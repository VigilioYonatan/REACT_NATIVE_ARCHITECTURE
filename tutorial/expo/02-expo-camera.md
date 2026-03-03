# Expo Camera

> Acceso a la **cámara** del dispositivo — fotos, video, barcode scanner, face detection.

## 📦 Instalación

```bash
npx expo install expo-camera
```

---

## 💻 Ejemplos

### 1. Cámara con Captura de Foto

```tsx
import { View, Text, Pressable, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";

export default function CameraDemo() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [photo, setPhoto] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-6">
        <Text className="text-white text-xl text-center mb-6">
          Necesitamos acceso a la cámara
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-semibold">Dar permiso</Text>
        </Pressable>
      </View>
    );
  }

  if (photo) {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri: photo }} className="flex-1" />
        <View className="absolute bottom-10 left-0 right-0 flex-row justify-center gap-4">
          <Pressable
            onPress={() => setPhoto(null)}
            className="bg-red-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">❌ Descartar</Text>
          </Pressable>
          <Pressable className="bg-green-500 px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold">✅ Guardar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    const result = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
    if (result) setPhoto(result.uri);
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="absolute bottom-10 left-0 right-0 flex-row justify-center gap-6">
          <Pressable
            onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
            className="bg-white/20 p-4 rounded-full"
          >
            <Text className="text-3xl">🔄</Text>
          </Pressable>
          <Pressable
            onPress={takePicture}
            className="bg-white w-20 h-20 rounded-full border-4 border-primary"
          />
        </View>
      </CameraView>
    </View>
  );
}
```

### 2. Barcode Scanner

```tsx
import { View, Text, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";

export default function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission?.granted) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Pressable
          onPress={requestPermission}
          className="bg-primary px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-semibold">Dar permiso</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "code128"] }}
        onBarcodeScanned={
          scanned
            ? undefined
            : ({ data, type }) => {
                setScanned(true);
                Alert.alert(`Código ${type}`, data, [
                  { text: "Escanear otro", onPress: () => setScanned(false) },
                ]);
              }
        }
      >
        <View className="flex-1 justify-center items-center">
          <View className="w-64 h-64 border-2 border-primary rounded-2xl" />
          <Text className="text-white mt-4">Apunta al código</Text>
        </View>
      </CameraView>
    </View>
  );
}
```

---

## 🔑 Props de CameraView

| Prop                     | Descripción                |
| ------------------------ | -------------------------- |
| `facing`                 | `'back'` o `'front'`       |
| `flash`                  | `'off'`, `'on'`, `'auto'`  |
| `zoom`                   | `0` a `1`                  |
| `enableTorch`            | Linterna                   |
| `barcodeScannerSettings` | Config de barcode scanner  |
| `onBarcodeScanned`       | Callback cuando se escanea |

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/camera/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                          | ✅ Bueno                                              |
| -------- | -------------------------------- | ----------------------------------------------------- |
| Permisos | Pedir al iniciar la app          | Pedir cuando el user toca "Abrir Cámara"              |
| Calidad  | `quality: 1` por defecto         | `quality: 0.7` (60% menos peso, misma calidad visual) |
| Preview  | Tomar foto sin preview           | Mostrar preview con opciones (guardar/retomar)        |
| Memoria  | Guardar todas las fotos en state | Limpiar fotos anteriores del state                    |
| Expo Go  | Asumir que todo funciona         | Barcode scanner avanzado requiere dev client          |

---

## ✅ Checklist

- [ ] Sé pedir permisos de cámara con `useCameraPermissions`
- [ ] Puedo tomar fotos con `takePictureAsync`
- [ ] Sé cambiar entre cámara frontal/trasera
- [ ] Puedo escanear barcodes y QR codes
