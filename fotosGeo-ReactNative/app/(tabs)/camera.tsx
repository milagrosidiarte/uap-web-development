import { useEffect, useRef, useState } from "react";
import { StyleSheet, Pressable, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, FlatList } from "react-native";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";


type Shot = {
  id: string;
  uri: string;             // ruta persistente en documentDirectory
  lat: number | null;
  lng: number | null;
  when: number;            // timestamp
};

const STORAGE_KEY = "@photos_with_location";

export default function CameraScreen() {
  // TIPOS: con SDK 54, este ref funciona bien si lo pasamos directo (sin callback):
  const cameraRef = useRef<CameraView | null>(null);

  const [camPerm, requestCamPerm] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [ready, setReady] = useState(false);

  const [locPerm, requestLocPerm] = Location.useForegroundPermissions();

  const [isBusy, setIsBusy] = useState(false);
  const [shots, setShots] = useState<Shot[]>([]);

  // Cargar lo persistido
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setShots(JSON.parse(raw));
      } catch (e) {
        console.warn("No se pudo leer AsyncStorage", e);
      }
    })();
  }, []);

  // Guardar cuando cambie
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shots));
      } catch (e) {
        console.warn("No se pudo guardar AsyncStorage", e);
      }
    })();
  }, [shots]);

  if (!camPerm || !locPerm) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: "#ddd" }}>Cargando permisos…</Text>
      </View>
    );
  }

  if (!camPerm.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white", textAlign: "center" }}>Necesitamos permiso de cámara.</Text>
        <TouchableOpacity onPress={requestCamPerm} style={[styles.btn, styles.btnPrimary, { marginTop: 12 }]}>
          <Text style={styles.btnText}>Conceder permiso de cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!ready) return;
    try {
      setIsBusy(true);

      // 1) Foto (uri temporal del capturador)
      const picture = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (!picture?.uri) {
        Alert.alert("Ups", "No se pudo capturar la foto.");
        return;
      }

      // 2) Ubicación
      let lat: number | null = null;
      let lng: number | null = null;

      if (!locPerm.granted) {
        const res = await requestLocPerm();
        // si no concede, seguimos sin ubicación
        if (!res?.granted) {
          // noop
        }
      }

      const fg = await Location.getForegroundPermissionsAsync();
      if (fg.granted) {
        const pos = await Location.getCurrentPositionAsync({});
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }

      // 3) Mover foto a documentDirectory (persistente)
      const filename = `${Date.now()}.jpg`;
      const dir = (FileSystem as any).documentDirectory as string; 
      const target = dir + filename;

      await FileSystem.copyAsync({ from: picture.uri, to: target });

      // 4) Guardar en estado (y se persiste por el useEffect)
      const newShot: Shot = {
        id: `${Date.now()}`,
        uri: target,
        lat,
        lng,
        when: Date.now(),
      };
      setShots(prev => [newShot, ...prev]);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Ocurrió un problema al capturar/guardar la foto.");
    } finally {
      setIsBusy(false);
    }
  };

  const flip = () => setFacing(f => (f === "back" ? "front" : "back"));

  const clearAll = async () => {
    Alert.alert("Borrar todo", "¿Eliminar TODAS las fotos guardadas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            // Borrar archivos
            await Promise.all(
              shots.map(async s => {
                try { await FileSystem.deleteAsync(s.uri, { idempotent: true }); } catch {}
              })
            );
            // Limpiar estado + storage
            setShots([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
          } catch (e) {
            console.warn("No se pudo borrar todo", e);
          }
        },
      },
    ]);
  };

  const removeOne = async (id: string) => {
    const shot = shots.find(s => s.id === id);
    if (shot) {
      try { await FileSystem.deleteAsync(shot.uri, { idempotent: true }); } catch {}
    }
    setShots(prev => prev.filter(s => s.id !== id));
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}             // <— DIRECTO, sin callback que “devuelva” algo
        style={styles.camera}
        facing={facing}
        mode="picture"
        onCameraReady={() => setReady(true)}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={flip} style={[styles.btn, styles.btnSecondary]}>
          <Text style={styles.btnText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={takePhoto}
          disabled={isBusy || !ready}
          style={[styles.btn, isBusy || !ready ? styles.btnDisabled : styles.btnPrimary]}
        >
          <Text style={styles.btnText}>{isBusy ? "..." : "Tomar Foto"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={clearAll} style={[styles.btn, styles.btnDanger]}>
          <Text style={styles.btnText}>Borrar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shots}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 12 }}
        ListHeaderComponent={
          <Text style={{ color: "white", fontWeight: "600", marginBottom: 8 }}>
            Fotos guardadas ({shots.length})
          </Text>
        }
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/photo/[id]", params: { id: item.id } }}
            asChild
          >
            <Pressable style={styles.card}>
              <Image source={{ uri: item.uri }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.meta}>{new Date(item.when).toLocaleString()}</Text>
                <Text style={styles.meta}>
                  {item.lat != null && item.lng != null
                    ? `Lat: ${item.lat.toFixed(6)}   Lng: ${item.lng.toFixed(6)}`
                    : "Ubicación no disponible"}
                </Text>
              </View>

              {/* Detenemos la propagación para que NO navegue al tocar la X */}
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  removeOne(item.id);
                }}
                style={[styles.chip, { backgroundColor: "#ef4444" }]}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>X</Text>
              </TouchableOpacity>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  camera: { width: "100%", height: 360 },
  controls: {
    padding: 12, backgroundColor: "#111",
    alignItems: "center", flexDirection: "row", justifyContent: "space-around",
  },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnPrimary: { backgroundColor: "#2563eb" },
  btnSecondary: { backgroundColor: "#334155" },
  btnDanger: { backgroundColor: "#b91c1c" },
  btnDisabled: { backgroundColor: "#555" },
  btnText: { color: "white", fontWeight: "600" },
  card: {
    flexDirection: "row", gap: 12, padding: 12, marginBottom: 10,
    backgroundColor: "#1f2937", borderRadius: 12, alignItems: "center",
  },
  thumb: { width: 64, height: 64, borderRadius: 8 },
  meta: { color: "#e5e7eb" },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
});
