# Expo Image

> Componente de **imágenes** optimizado por Expo — caching automático, blurhash, transiciones, y soporte para formatos modernos.

## 📦 Instalación

```bash
npx expo install expo-image
```

---

## 🔑 Expo Image vs React Native Image

| Característica     | `<Image>` (RN) | `<Image>` (Expo)                |
| ------------------ | -------------- | ------------------------------- |
| Cache              | ❌ Manual      | ✅ Automático (disco + memoria) |
| Blurhash/Thumbhash | ❌             | ✅ Placeholders nativos         |
| Transiciones       | ❌             | ✅ Fade, cross-dissolve, flip   |
| SVG                | ❌             | ✅                              |
| WebP/AVIF          | Parcial        | ✅ Todos los formatos           |
| Prefetch           | ❌             | ✅ `Image.prefetch()`           |
| Reciclaje          | ❌             | ✅ Automática                   |

---

## 💻 Ejemplos

### 1. Uso Básico con Blurhash

```tsx
import { View, Text } from "react-native";
import { Image } from "expo-image";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function ImageDemo() {
  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">Expo Image</Text>

      <Image
        source="https://picsum.photos/800/600"
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={300}
        className="w-full h-[300px] rounded-2xl"
      />

      <Image
        source="https://picsum.photos/800/400"
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={500}
        className="w-full h-[200px] rounded-2xl mt-4"
      />
    </View>
  );
}
```

### 2. Avatar con Fallback

```tsx
import { Image } from "expo-image";
import { View, Text } from "react-native";

interface AvatarProps {
  uri?: string | null;
  name: string;
  size?: number;
}

export function Avatar({ uri, name, size = 48 }: AvatarProps) {
  if (!uri) {
    return (
      <View
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="bg-primary items-center justify-center"
      >
        <Text className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={uri}
      contentFit="cover"
      transition={200}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="border-2 border-primary"
    />
  );
}
```

### 3. Galería con Cache y Prefetch

```tsx
import { View, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";

const IMAGES = Array.from(
  { length: 12 },
  (_, i) => `https://picsum.photos/400/400?random=${i}`,
);

export default function Gallery() {
  // Prefetch las siguientes imágenes
  useEffect(() => {
    Image.prefetch(IMAGES.slice(4));
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-background p-2"
      contentContainerClassName="flex-row flex-wrap"
    >
      {IMAGES.map((url, i) => (
        <Pressable key={i} className="w-[33%] p-1">
          <Image
            source={url}
            contentFit="cover"
            recyclingKey={url}
            transition={300}
            className="w-full aspect-square rounded-xl"
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}
```

---

## 🔑 Props Importantes

| Prop           | Descripción                                      |
| -------------- | ------------------------------------------------ |
| `contentFit`   | `cover`, `contain`, `fill`, `none`, `scale-down` |
| `placeholder`  | `{ blurhash }` o `{ thumbhash }` o `{ uri }`     |
| `transition`   | Duración en ms del fade-in                       |
| `recyclingKey` | Key para reciclaje en listas                     |
| `cachePolicy`  | `memory-disk`, `memory`, `disk`, `none`          |
| `priority`     | `low`, `normal`, `high`                          |

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/image/)
- [GitHub](https://github.com/expo/expo/tree/main/packages/expo-image)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica    | ❌ Malo                          | ✅ Bueno                                          |
| ----------- | -------------------------------- | ------------------------------------------------- |
| Cache       | Recargar imágenes en cada visita | `cachePolicy="memory-disk"`                       |
| Placeholder | Loading sin indicador visual     | `placeholder={blurhash}` para transición suave    |
| Tamaño      | Cargar imágenes 4000x4000        | `contentFit="cover"` + dimensiones del componente |
| Transición  | Cambio brusco al cargar          | `transition={300}` para fade-in suave             |
| Fallback    | Sin manejo de error              | `onError` + imagen fallback                       |

---

## ✅ Checklist

- [ ] Sé usar `expo-image` como reemplazo de `<Image>`
- [ ] Puedo usar blurhash para placeholders
- [ ] Entiendo `contentFit` y transiciones
- [ ] Sé usar `prefetch` y `cachePolicy`
- [ ] Puedo crear componentes reutilizables (Avatar, Gallery)
