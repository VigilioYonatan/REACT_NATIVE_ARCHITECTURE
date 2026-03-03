# Expo Image Picker

> **Seleccionar imágenes** de la galería o **tomar fotos** con la cámara — con recorte, compresión, y selección múltiple.

## 📦 Instalación

```bash
npx expo install expo-image-picker
```

---

## 💻 Ejemplos

### 1. Seleccionar de Galería

```tsx
import { View, Text, Pressable, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function PickerDemo() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // Recorte cuadrado
      quality: 0.8, // 80% calidad (compresión)
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      {image ? (
        <Image source={{ uri: image }} className="w-64 h-64 rounded-2xl mb-6" />
      ) : (
        <View className="w-64 h-64 bg-surface rounded-2xl mb-6 justify-center items-center border-2 border-dashed border-slate-700">
          <Text className="text-4xl">🖼</Text>
          <Text className="text-slate-400 mt-2">Sin imagen</Text>
        </View>
      )}

      <Pressable
        onPress={pickImage}
        className="bg-primary px-8 py-4 rounded-2xl"
      >
        <Text className="text-white font-semibold">📸 Elegir Imagen</Text>
      </Pressable>
    </View>
  );
}
```

### 2. Tomar Foto con Cámara

```tsx
import * as ImagePicker from "expo-image-picker";

const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Necesitamos permiso de cámara");
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  return null;
};
```

### 3. Selección Múltiple

```tsx
const pickMultiple = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit: 5, // Máximo 5
    quality: 0.7,
    orderedSelection: true,
  });

  if (!result.canceled) {
    // result.assets es un array de imágenes
    const uris = result.assets.map((a) => a.uri);
    console.log("Seleccionadas:", uris.length);
    return result.assets;
  }
  return [];
};
```

### 4. Upload Component Completo

```tsx
import { View, Text, Pressable, Image, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function ImageUploader() {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.7,
    });
    if (!result.canceled) setImages((prev) => [...prev, ...result.assets]);
  };

  const remove = (index: number) => {
    setImages((p) => p.filter((_, i) => i !== index));
  };

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-4">
        📤 Subir Imágenes
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        <View className="flex-row gap-3">
          {images.map((img, i) => (
            <Pressable key={i} onLongPress={() => remove(i)}>
              <Image
                source={{ uri: img.uri }}
                className="w-24 h-24 rounded-xl"
              />
              <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs">✕</Text>
              </View>
            </Pressable>
          ))}

          <Pressable
            onPress={pick}
            className="w-24 h-24 bg-surface rounded-xl border-2 border-dashed border-slate-600 justify-center items-center"
          >
            <Text className="text-3xl text-slate-500">+</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="bg-surface p-4 rounded-xl">
        <Text className="text-slate-400">
          {images.length} imagen(es) seleccionadas
        </Text>
        {images[0] && (
          <Text className="text-slate-500 text-xs mt-1">
            {images[0].width}x{images[0].height} •{" "}
            {((images[0].fileSize ?? 0) / 1024).toFixed(0)} KB
          </Text>
        )}
      </View>
    </View>
  );
}
```

---

## 🏆 Buenas Prácticas y Optimización

| Práctica               | Detalle                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **Comprimir**          | `quality: 0.7` reduce tamaño ~60% sin pérdida visible en mobile                               |
| **Aspect ratio**       | Usa `aspect` para forzar recorte (avatar=1:1, cover=16:9)                                     |
| **Tamaño máximo**      | Usa `exif: false` para evitar cargar metadata pesada                                          |
| **Permisos**           | Solo pedir permiso de cámara para `launchCameraAsync`, galería no necesita permiso en iOS 14+ |
| **Selección múltiple** | Siempre usa `selectionLimit` para evitar seleccionar 100+ fotos                               |
| **Upload**             | Comprime antes de subir — `quality: 0.7` + resize en servidor                                 |
| **Memoria**            | No guardes muchas URIs en state — usa `FlashList` para mostrar                                |

```tsx
// ✅ Configuración óptima para upload
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ["images"],
  quality: 0.7, // Comprimir
  allowsEditing: true, // Dejar recortar
  exif: false, // No cargar EXIF data
});

// ❌ Malo para upload
const result = await ImagePicker.launchImageLibraryAsync({
  quality: 1, // Imágenes enormes
  exif: true, // Metadata innecesaria
});
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica  | ❌ Malo                         | ✅ Bueno                                           |
| --------- | ------------------------------- | -------------------------------------------------- |
| Calidad   | `quality: 1` para uploads       | `quality: 0.7` (60% menos peso)                    |
| Resize    | Subir imagen original 4000x4000 | `allowsEditing: true` o resize manual              |
| Múltiples | Solo 1 imagen                   | `allowsMultipleSelection: true` + límite           |
| Permisos  | No manejar `canAskAgain: false` | Fallback a `Linking.openSettings()`                |
| Tipo      | Solo fotos                      | `mediaTypes: ['images', 'videos']` según necesidad |
| Upload    | Enviar base64                   | Enviar como `FormData` con `multipart/form-data`   |

---

## ✅ Checklist

- [ ] Sé seleccionar imágenes de la galería
- [ ] Puedo tomar fotos con la cámara
- [ ] Sé habilitar selección múltiple con límite
- [ ] Entiendo la compresión con `quality` y `aspect`
- [ ] Puedo crear un componente de upload con preview y delete
- [ ] Conozco las buenas prácticas de compresión para upload
