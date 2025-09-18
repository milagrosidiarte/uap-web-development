import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Camera from "expo-camera";

export default function HomeScreen() {
  const camRef = useRef<Camera.Camera | null>(null);
  const [hasCamPerm, setHasCamPerm] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCamPerm(status === "granted");
    })();
  }, []);

  if (hasCamPerm === null) {
    return <View style={styles.center}><Text>Solicitando permiso de cámara…</Text></View>;
  }

  if (!hasCamPerm) {
    return <View style={styles.center}><Text>Permiso de cámara denegado</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Vista previa de la cámara */}
      <Camera.Camera
        ref={(r) => (camRef.current = r)}
        style={styles.camera}
        type={Camera.CameraType.back}
      />
      <View style={styles.footer}>
        <Text style={{ color: "#ddd" }}>Vista previa lista</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  camera: { width: "100%", height: 360 },
  footer: { padding: 12, backgroundColor: "#111" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
