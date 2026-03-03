# Lottie React Native 7.3

> **Animaciones vectoriales** de alta calidad exportadas de After Effects como JSON. Ligeras, escalables e interactivas.

## 📦 Instalación

```bash
npx expo install lottie-react-native
```

---

## 🔑 ¿Qué es Lottie?

Lottie reproduce animaciones exportadas de **Adobe After Effects** como archivos JSON usando el plugin [Bodymovin](https://aescripts.com/bodymovin/). Son **vectoriales**, no imágenes, por lo que escalan sin perder calidad.

### Fuentes de Animaciones Gratuitas

- [LottieFiles](https://lottiefiles.com/) — Miles de animaciones gratis
- [IconScout](https://iconscout.com/lottie-animations)
- [Lordicon](https://lordicon.com/)

---

## 💻 Ejemplos

### 1. Animación Básica

```tsx
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieBasic() {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <LottieView
        source={require("@/assets/animations/loading.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text className="text-white text-lg mt-4">Cargando...</Text>
    </View>
  );
}
```

### 2. Animación desde URL

```tsx
import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function LottieFromUrl() {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <LottieView
        source={{ uri: "https://lottie.host/embed/dotlottie-url.json" }}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
}
```

### 3. Animación Controlada (Play/Pause/Reset)

```tsx
import { View, Text, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import { useRef } from "react";

export default function LottieControlled() {
  const animationRef = useRef<LottieView>(null);

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <LottieView
        ref={animationRef}
        source={require("@/assets/animations/success.json")}
        loop={false}
        style={{ width: 250, height: 250 }}
      />

      <View className="flex-row gap-3 mt-6">
        <Pressable
          onPress={() => animationRef.current?.play()}
          className="bg-green-500 px-5 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">▶ Play</Text>
        </Pressable>
        <Pressable
          onPress={() => animationRef.current?.pause()}
          className="bg-yellow-500 px-5 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">⏸ Pause</Text>
        </Pressable>
        <Pressable
          onPress={() => animationRef.current?.reset()}
          className="bg-red-500 px-5 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">🔄 Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### 4. Like Button Animado

```tsx
import { View, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";

export default function LikeLottie() {
  const animRef = useRef<LottieView>(null);
  const [liked, setLiked] = useState(false);

  const handlePress = () => {
    if (!liked) {
      animRef.current?.play(0, 60); // Play frames 0–60
    } else {
      animRef.current?.reset();
    }
    setLiked(!liked);
  };

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Pressable onPress={handlePress}>
        <LottieView
          ref={animRef}
          source={require("@/assets/animations/heart-like.json")}
          loop={false}
          style={{ width: 100, height: 100 }}
        />
      </Pressable>
    </View>
  );
}
```

### 5. Skeleton/Empty State con Lottie

```tsx
import LottieView from "lottie-react-native";
import { View, Text, Pressable } from "react-native";

export function EmptyState({ onAction }: { onAction: () => void }) {
  return (
    <View className="flex-1 bg-background justify-center items-center p-8">
      <LottieView
        source={require("@/assets/animations/empty-box.json")}
        autoPlay
        loop
        style={{ width: 250, height: 250 }}
      />
      <Text className="text-white text-xl font-bold mt-4">Nada aquí aún</Text>
      <Text className="text-slate-400 text-center mt-2 mb-8">
        Agrega tu primer item para comenzar
      </Text>
      <Pressable
        onPress={onAction}
        className="bg-primary px-8 py-4 rounded-2xl"
      >
        <Text className="text-white font-semibold text-base">+ Agregar</Text>
      </Pressable>
    </View>
  );
}
```

---

## 🔗 Links

- [GitHub](https://github.com/lottie-react-native/lottie-react-native)
- [LottieFiles](https://lottiefiles.com/)
- [Expo docs](https://docs.expo.dev/versions/latest/sdk/lottie/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                       | ✅ Bueno                                                       |
| -------- | ----------------------------- | -------------------------------------------------------------- |
| Archivos | JSON > 500KB                  | Optimizar en LottieFiles, comprimir layers                     |
| Loop     | `autoPlay` sin control        | `ref.current?.play()` para control preciso                     |
| Cantidad | 10+ Lotties visibles a la vez | Máx 2-3 simultáneos, lazy load el resto                        |
| Platform | Asumir que funciona igual     | Testear en iOS y Android (diferencias de rendering)            |
| Bundle   | Animaciones en el bundle      | CDN remoto para animaciones grandes, `require()` para pequeñas |

---

## ✅ Checklist

- [ ] Sé reproducir animaciones Lottie (local y URL)
- [ ] Puedo controlar play/pause/reset con ref
- [ ] Sé reproducir rangos específicos de frames
- [ ] Puedo usar Lottie para loading, empty states, y micro-interactions
- [ ] Sé dónde encontrar animaciones gratuitas
