# 03 — Cámara & Permisos Nativos

## 🎯 Objetivo

Acceder a funcionalidades nativas: **cámara**, **galería**, **permisos** con Expo SDK 55.

---

## 📚 Teoría

### Instalación

```bash
npx expo install expo-camera expo-image-picker expo-media-library expo-file-system
```

### Permisos

| Paquete              | Permiso            | Uso                  |
| -------------------- | ------------------ | -------------------- |
| `expo-camera`        | Cámara + Micrófono | Capturar fotos/video |
| `expo-image-picker`  | Galería / Cámara   | Seleccionar fotos    |
| `expo-media-library` | Galería (guardar)  | Guardar fotos        |

---

## 💻 Código Práctico

### Ejemplo 1: Image Picker (Galería + Cámara)

```tsx
import { View, Text, Image, Pressable, Alert } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerDemo() {
  const [image, setImage] = useState<string | null>(null);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso necesario", "Necesitamos acceso a la cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <View className="flex-1 bg-background p-5 pt-16 items-center">
      <Text className="text-3xl font-bold text-white mb-6">
        📸 Image Picker
      </Text>

      <View className="w-[250px] h-[250px] bg-surface rounded-2xl justify-center items-center overflow-hidden mb-6">
        {image ? (
          <Image source={{ uri: image }} className="w-full h-full" />
        ) : (
          <Text className="text-slate-500 text-base">No hay imagen</Text>
        )}
      </View>

      <View className="flex-row gap-4">
        <Pressable
          onPress={pickFromGallery}
          className="bg-blue-500 px-6 py-3.5 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-semibold">🖼️ Galería</Text>
        </Pressable>
        <Pressable
          onPress={takePhoto}
          className="bg-green-500 px-6 py-3.5 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-semibold">📷 Cámara</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### Ejemplo 2: Cámara en Tiempo Real

```tsx
import { View, Text, Pressable } from "react-native";
import { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraDemo() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg mb-4">
          Necesitamos acceso a la cámara
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary px-6 py-4 rounded-xl"
        >
          <Text className="text-white font-semibold">Conceder Permiso</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      console.log("📸 Foto:", photo?.uri);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="flex-1 flex-row justify-around items-end pb-10">
          <Pressable
            onPress={() => setFacing((p) => (p === "back" ? "front" : "back"))}
            className="w-[50px] h-[50px] rounded-full bg-white/30 justify-center items-center"
          >
            <Text className="text-2xl">🔄</Text>
          </Pressable>
          <Pressable
            onPress={takePicture}
            className="w-[72px] h-[72px] rounded-full border-4 border-white justify-center items-center"
          >
            <View className="w-14 h-14 rounded-full bg-white" />
          </Pressable>
          <View className="w-[50px]" />
        </View>
      </CameraView>
    </View>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Avatar Picker

Foto de perfil circular con ActionSheet (Galería / Cámara / Eliminar).

### Ejercicio 2: Escáner de QR

`CameraView` con `barcodeScannerSettings` para escanear QR y abrir la URL.

### Ejercicio 3: Galería Multi-Select

Seleccionar múltiples imágenes, previsualizarlas en grid, eliminar individualmente.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                           | ✅ Bueno                                                    |
| -------- | --------------------------------- | ----------------------------------------------------------- |
| Permisos | Pedir permiso sin contexto        | Explicar POR QUÉ antes de pedir                             |
| Denegado | No manejar denegación             | Mostrar botón a Settings con explicación                    |
| Calidad  | `quality: 1` para todo            | `quality: 0.7-0.8` (60% menos tamaño, misma calidad visual) |
| Preview  | Sin preview de foto tomada        | Siempre mostrar preview antes de guardar                    |
| Error    | No manejar errores de cámara      | `try/catch` con feedback al usuario                         |
| Expo Go  | Asumir cámara funciona en Expo Go | `expo-camera` requiere dev client en muchas features        |

### UX de Permisos

```tsx
// ✅ Patrón recomendado de permisos
// 1. Primero explicar por qué
// 2. Luego pedir el permiso
// 3. Si deniega, dar opción a Settings

if (!permission.granted && !permission.canAskAgain) {
  return (
    <View>
      <Text>Necesitamos la cámara para escanear códigos</Text>
      <Pressable onPress={Linking.openSettings}>
        <Text>Abrir Configuración</Text>
      </Pressable>
    </View>
  );
}
```

---

## ✅ Checklist

- [ ] Sé solicitar y verificar permisos de cámara y galería
- [ ] Puedo usar `expo-image-picker` para seleccionar/capturar fotos
- [ ] Sé usar `CameraView` para cámara en tiempo real
- [ ] Entiendo los estados de permisos (undetermined/denied/granted)
- [ ] Puedo manejar front/back camera y capturar fotos
