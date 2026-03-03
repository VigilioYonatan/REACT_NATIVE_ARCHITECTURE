# React Native Reanimated 4.2.1

> Animaciones de **alto rendimiento** ejecutadas en el **UI thread** nativo, no en JavaScript.

## 📦 Instalación

```bash
npx expo install react-native-reanimated
```

> ⚠️ Reanimated 4.x **solo** soporta la New Architecture (Fabric). Para Old Architecture usa 3.x.

### Configurar Babel

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"], // ¡Siempre al final!
  };
};
```

---

## 🔑 Conceptos Clave

| Concepto           | Descripción                                 |
| ------------------ | ------------------------------------------- |
| `useSharedValue`   | Valor animable que vive en el **UI thread** |
| `useAnimatedStyle` | Genera estilos reactivos al shared value    |
| `withTiming`       | Animación con duración fija                 |
| `withSpring`       | Animación con física de resorte             |
| `withDecay`        | Desaceleración desde velocidad              |
| `withDelay`        | Delay antes de otra animación               |
| `withSequence`     | Ejecutar animaciones en secuencia           |
| `withRepeat`       | Repetir una animación N veces o infinito    |
| `interpolate`      | Mapear rango de valores                     |
| `interpolateColor` | Transición entre colores                    |

---

## 💻 Ejemplos

### 1. Fade + Slide In

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";
import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function FadeSlideDemo() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const show = () => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withSpring(0, { damping: 15 });
  };

  const hide = () => {
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(50, { duration: 300 });
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Animated.View
        style={animatedStyle}
        className="bg-surface rounded-2xl p-8 w-full items-center border-l-4 border-primary mb-8"
      >
        <Text className="text-4xl mb-3">✨</Text>
        <Text className="text-white text-xl font-bold">Reanimated 4</Text>
        <Text className="text-slate-400 mt-2">UI Thread Animation</Text>
      </Animated.View>

      <View className="flex-row gap-4">
        <Pressable onPress={show} className="bg-green-500 px-6 py-3 rounded-xl">
          <Text className="text-white font-semibold">Mostrar</Text>
        </Pressable>
        <Pressable onPress={hide} className="bg-red-500 px-6 py-3 rounded-xl">
          <Text className="text-white font-semibold">Ocultar</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### 2. Layout Animations (Entering/Exiting)

```tsx
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function LayoutAnimDemo() {
  const [items, setItems] = useState(["React", "Native", "Expo", "TypeScript"]);

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Animated.View layout={LinearTransition.springify()} className="gap-3">
        {items.map((item, i) => (
          <Animated.View
            key={item}
            entering={FadeInDown.delay(i * 80).springify()}
            exiting={FadeOutUp.duration(300)}
            layout={LinearTransition.springify()}
          >
            <Pressable
              onPress={() => setItems((p) => p.filter((x) => x !== item))}
              className="bg-surface p-4 rounded-xl flex-row justify-between items-center"
            >
              <Text className="text-white text-lg">{item}</Text>
              <Text className="text-red-400">✕</Text>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>

      <Pressable
        onPress={() => setItems(["React", "Native", "Expo", "TypeScript"])}
        className="bg-primary p-4 rounded-xl items-center mt-6"
      >
        <Text className="text-white font-semibold">🔄 Reset</Text>
      </Pressable>
    </View>
  );
}
```

### 3. Interpolate + Scroll Animation

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { View, Text } from "react-native";

export default function ScrollHeader() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, 150],
      [200, 80],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      Extrapolation.CLAMP,
    ),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      scrollY.value,
      [0, 150],
      [32, 18],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View className="flex-1 bg-background">
      <Animated.View style={headerStyle} className="bg-primary justify-end p-5">
        <Animated.Text style={titleStyle} className="text-white font-bold">
          Mi App
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        {Array.from({ length: 30 }).map((_, i) => (
          <View key={i} className="bg-surface m-3 p-4 rounded-xl">
            <Text className="text-white">Item {i + 1}</Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
```

### 4. withSequence + withRepeat (Shake Animation)

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { View, Pressable, Text } from "react-native";

export default function ShakeButton() {
  const translateX = useSharedValue(0);

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 4, true),
      withTiming(0, { duration: 50 }),
    );
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Animated.View style={style}>
        <Pressable onPress={shake} className="bg-red-500 px-8 py-4 rounded-2xl">
          <Text className="text-white font-bold text-lg">
            🔴 Error — Shake!
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
```

---

## 🔗 Links

- [Documentación oficial](https://docs.swmansion.com/react-native-reanimated/)
- [GitHub](https://github.com/software-mansion/react-native-reanimated)
- [Expo docs](https://docs.expo.dev/versions/latest/sdk/reanimated/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica    | ❌ Malo                          | ✅ Bueno                                       |
| ----------- | -------------------------------- | ---------------------------------------------- |
| SharedValue | `useState` para animaciones      | `useSharedValue` (no causa re-renders)         |
| Style       | Calcular en JS y pasar a style   | `useAnimatedStyle` (corre en UI thread)        |
| Gestos      | PanResponder                     | `react-native-gesture-handler` v2 + Reanimated |
| Cancelar    | No cancelar animaciones previas  | `cancelAnimation()` antes de iniciar nueva     |
| Compose     | Una sola animación compleja      | `withSequence`, `withDelay` composables        |
| Layout      | Animar mount/unmount manualmente | `entering`, `exiting` layout animations        |

---

## ✅ Checklist

- [ ] Sé la diferencia entre Animated API y Reanimated
- [ ] Puedo usar `useSharedValue` + `useAnimatedStyle`
- [ ] Domino `withTiming`, `withSpring`, `withDelay`, `withSequence`, `withRepeat`
- [ ] Sé usar Layout Animations (Entering/Exiting)
- [ ] Puedo animar con scroll usando `useAnimatedScrollHandler`
- [ ] Entiendo `interpolate` e `interpolateColor`
