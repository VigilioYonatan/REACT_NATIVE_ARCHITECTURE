# Expo FileSystem

> Leer, escribir, copiar, mover y **descargar archivos** en el sistema de archivos del dispositivo.

## 📦 Instalación

```bash
npx expo install expo-file-system
```

---

## 🔑 Directorios Principales

| Directorio          | Descripción                             |
| ------------------- | --------------------------------------- |
| `documentDirectory` | Persistente — sobrevive actualizaciones |
| `cacheDirectory`    | Temporal — el OS puede limpiarlo        |
| `bundleDirectory`   | Assets de la app (solo lectura)         |

---

## 💻 Ejemplos

### 1. Leer y Escribir Archivos

```tsx
import * as FileSystem from 'expo-file-system';

// Escribir texto
const writeFile = async () => {
  const fileUri = FileSystem.documentDirectory + 'notas.txt';
  await FileSystem.writeAsStringAsync(fileUri, 'Hola desde Expo!');
  console.log('✅ Archivo escrito:', fileUri);
};

// Leer texto
const readFile = async () => {
  const fileUri = FileSystem.documentDirectory + 'notas.txt';
  const content = await FileSystem.readAsStringAsync(fileUri);
  console.log('📄 Contenido:', content);
};

// Escribir JSON
const writeJSON = async (data: object) => {
  const fileUri = FileSystem.documentDirectory + 'data.json';
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
};

// Leer JSON
const readJSON = async <T>(): Promise<T> => {
  const fileUri = FileSystem.documentDirectory + 'data.json';
  const content = await FileSystem.readAsStringAsync(fileUri);
  return JSON.parse(content);
};
```

### 2. Descargar Archivos con Progreso

```tsx
import { View, Text, Pressable } from "react-native";
import * as FileSystem from "expo-file-system";
import { useState } from "react";

export default function DownloadDemo() {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    const fileUri = FileSystem.documentDirectory + "imagen.jpg";

    const downloadResumable = FileSystem.createDownloadResumable(
      "https://picsum.photos/1920/1080",
      fileUri,
      {},
      (downloadProgress) => {
        const p =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        setProgress(Math.round(p * 100));
      },
    );

    try {
      const result = await downloadResumable.downloadAsync();
      console.log("✅ Descargado:", result?.uri);
    } catch (e) {
      console.error("❌ Error:", e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Pressable
        onPress={download}
        disabled={downloading}
        className={`px-8 py-4 rounded-2xl ${downloading ? "bg-primary/50" : "bg-primary"}`}
      >
        <Text className="text-white font-semibold">
          {downloading ? `Descargando ${progress}%` : "📥 Descargar Imagen"}
        </Text>
      </Pressable>
      {downloading && (
        <View className="w-full bg-slate-800 h-3 rounded-full mt-4 overflow-hidden">
          <View
            className="bg-primary h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      )}
    </View>
  );
}
```

### 3. Gestión de Archivos

```tsx
import * as FileSystem from "expo-file-system";

// Info de archivo
const getFileInfo = async (uri: string) => {
  const info = await FileSystem.getInfoAsync(uri);
  console.log("Existe:", info.exists);
  if (info.exists) {
    console.log("Tamaño:", info.size, "bytes");
    console.log("Es directorio:", info.isDirectory);
  }
};

// Listar directorio
const listFiles = async () => {
  const files = await FileSystem.readDirectoryAsync(
    FileSystem.documentDirectory!,
  );
  console.log("Archivos:", files);
};

// Copiar archivo
const copyFile = async () => {
  await FileSystem.copyAsync({
    from: FileSystem.documentDirectory + "original.txt",
    to: FileSystem.documentDirectory + "copia.txt",
  });
};

// Mover archivo
const moveFile = async () => {
  await FileSystem.moveAsync({
    from: FileSystem.documentDirectory + "temp.txt",
    to: FileSystem.documentDirectory + "final.txt",
  });
};

// Eliminar
const deleteFile = async (uri: string) => {
  await FileSystem.deleteAsync(uri, { idempotent: true });
};

// Crear directorio
const createFolder = async () => {
  await FileSystem.makeDirectoryAsync(
    FileSystem.documentDirectory + "mis-archivos/",
    { intermediates: true },
  );
};
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/filesystem/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                    | ✅ Bueno                                           |
| ---------- | -------------------------- | -------------------------------------------------- |
| Directorio | Escribir en cualquier ruta | Solo `documentDirectory` y `cacheDirectory`        |
| Downloads  | Sin indicador de progreso  | `createDownloadResumable` con callback de progreso |
| Cache      | Cache sin límite           | Limpiar cache periódicamente con `deleteAsync`     |
| Errores    | No manejar errores de FS   | `try/catch` con verificación de existencia previa  |
| Encoding   | Asumir UTF-8 siempre       | Especificar `EncodingType` correctamente           |

---

## ✅ Checklist

- [ ] Sé leer y escribir archivos de texto y JSON
- [ ] Puedo descargar archivos con progreso
- [ ] Sé copiar, mover y eliminar archivos
- [ ] Entiendo `documentDirectory` vs `cacheDirectory`
- [ ] Puedo crear directorios recursivos
