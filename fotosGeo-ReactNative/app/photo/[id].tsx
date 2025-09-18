import { useEffect, useState, useMemo } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, TextInput, Share, Linking, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Para borrar archivo sin warnings en SDK 54 usamos la API legacy aquí:
import * as FS from "expo-file-system/legacy";

type Shot = {
  id: string;
  uri: string;
  lat: number | null;
  lng: number | null;
  when: number;
  note?: string; // nuevo (opcional)
};

const STORAGE_KEY = "@photos_with_location";

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [all, setAll] = useState<Shot[] | null>(null);
  const shot = useMemo(() => (all ?? []).find(s => s.id === id), [all, id]);
  const [note, setNote] = useState("");

  // Cargar lista persistida
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Shot[] = JSON.parse(raw);
        setAll(parsed);
      } else {
        setAll([]);
      }
    })();
  }, []);

  // Cuando encontramos el shot, reflejar la nota
  useEffect(() => {
    if (shot) setNote(shot.note ?? "");
  }, [shot]);

  const saveNote = async () => {
    if (!all || !shot) return;
    const updated = all.map(s => (s.id === shot.id ? { ...s, note } : s));
    setAll(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openInMaps = async () => {
    if (!shot || shot.lat == null || shot.lng == null) {
      Alert.alert("Ubicación", "Este elemento no tiene coordenadas.");
      return;
    }
    const { lat, lng } = shot;
    // geo: funciona en Android; https funciona en todos
    const geoURL = `geo:${lat},${lng}?q=${lat},${lng}`;
    const webURL = `https://maps.google.com/?q=${lat},${lng}`;
    // Intentamos abrir geo:, si falla abrimos web
    const supported = await Linking.canOpenURL(geoURL);
    await Linking.openURL(supported ? geoURL : webURL);
  };

  const sharePhoto = async () => {
    if (!shot) return;
    try {
      await Share.share({
        url: shot.uri,
        message: `Foto (${new Date(shot.when).toLocaleString()})` + (shot.lat != null && shot.lng != null ? `\nLat: ${shot.lat}, Lng: ${shot.lng}` : ""),
      });
    } catch (e) {
      console.warn("No se pudo compartir", e);
    }
  };

  const deletePhoto = async () => {
    if (!all || !shot) return;
    Alert.alert("Eliminar", "¿Eliminar esta foto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            // borrar archivo (idempotente)
            try { await FS.deleteAsync(shot.uri, { idempotent: true }); } catch {}
            const rest = all.filter(s => s.id !== shot.id);
            setAll(rest);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
            router.back();
          } catch (e) {
            console.warn("No se pudo eliminar", e);
          }
        },
      },
    ]);
  };

  if (!all) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: "#ddd" }}>Cargando…</Text>
      </View>
    );
  }

  if (!shot) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white", textAlign: "center" }}>
          No se encontró la foto (id: {String(id)}).
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.btn, styles.btnSecondary, { marginTop: 12 }]}>
          <Text style={styles.btnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Image source={{ uri: shot.uri }} style={styles.full} />

      <View style={styles.info}>
        <Text style={styles.title}>{new Date(shot.when).toLocaleString()}</Text>
        <Text style={styles.meta}>
          {shot.lat != null && shot.lng != null
            ? `Lat: ${shot.lat.toFixed(6)}   Lng: ${shot.lng.toFixed(6)}`
            : "Ubicación no disponible"}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity onPress={sharePhoto} style={[styles.btn, styles.btnPrimary]}>
            <Text style={styles.btnText}>Compartir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openInMaps} style={[styles.btn, styles.btnSecondary]}>
            <Text style={styles.btnText}>Abrir en Mapas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deletePhoto} style={[styles.btn, styles.btnDanger]}>
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Nota</Text>
        <TextInput
          placeholder="Escribí una nota…"
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={setNote}
          multiline
          style={styles.input}
        />
        <TouchableOpacity onPress={saveNote} style={[styles.btn, styles.btnPrimary, { alignSelf: "flex-start" }]}>
          <Text style={styles.btnText}>Guardar nota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0b0b0b" },
  full: { width: "100%", height: 360, backgroundColor: "#111" },
  info: { padding: 16, gap: 8 },
  title: { color: "white", fontSize: 18, fontWeight: "700" },
  meta: { color: "#e5e7eb" },
  row: { flexDirection: "row", gap: 10, marginTop: 8, flexWrap: "wrap" },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  btnPrimary: { backgroundColor: "#2563eb" },
  btnSecondary: { backgroundColor: "#334155" },
  btnDanger: { backgroundColor: "#b91c1c" },
  btnText: { color: "white", fontWeight: "700" },
  label: { color: "#e5e7eb", fontWeight: "600" },
  input: {
    color: "white", backgroundColor: "#111", borderRadius: 10, padding: 12,
    minHeight: 80, textAlignVertical: "top", borderWidth: 1, borderColor: "#1f2937",
    marginBottom: 8,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
});
