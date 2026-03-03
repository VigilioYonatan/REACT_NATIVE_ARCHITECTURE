# 02 — React Native Reanimated

## 🎯 Objetivo

Dominar **Reanimated 3** para crear animaciones de alto rendimiento que se ejecutan en el **hilo nativo (UI thread)**, no en JavaScript.

---

## 📚 Teoría

### Animated API vs Reanimated

| Característica    | Animated API (built-in)                 | Reanimated 3                                 |
| ----------------- | --------------------------------------- | -------------------------------------------- |
| Hilo de ejecución | JS thread (con useNativeDriver parcial) | **UI thread** siempre                        |
| Performance       | Buena con useNativeDriver               | **Excelente** — 60/120fps                    |
| Gestos            | Limitado                                | Integrado con `react-native-gesture-handler` |
| Layout animations | ❌                                      | ✅ Entering/Exiting/Layout                   |
| Shared values     | ❌                                      | ✅ `useSharedValue`                          |

### Instalación

```bash
npx expo install react-native-reanimated react-native-gesture-handler
```

### Conceptos Clave

```tsx
const offset = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }],
}));

offset.value = withSpring(100, { damping: 15 });

<Animated.View style={animatedStyle} />;
```

---

## 💻 Código Práctico

### Ejemplo 1: Drag & Drop con Gestos

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { View, Text } from "react-native";

export default function DragDemo() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSpring(1.3);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  const composed = Gesture.Simultaneous(dragGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView className="flex-1 bg-background justify-center items-center">
      <Text className="text-slate-500 text-base absolute top-24">
        Arrastra la caja 👇
      </Text>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={animatedStyle}
          className="w-[120px] h-[120px] bg-primary rounded-3xl justify-center items-center"
        >
          <Text className="text-5xl">🎯</Text>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
```

### Ejemplo 2: Layout Animations (Entering/Exiting)

```tsx
import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { useState } from "react";

const ITEMS = ["React Native", "Expo", "Reanimated", "TypeScript", "Hermes"];

export default function LayoutAnimDemo() {
  const [items, setItems] = useState(ITEMS);

  const removeItem = (item: string) =>
    setItems((p) => p.filter((i) => i !== item));
  const resetItems = () => setItems(ITEMS);

  return (
    <View className="flex-1 bg-background p-5 pt-20">
      <Text className="text-3xl font-bold text-white mb-6">
        Layout Animations
      </Text>

      <Animated.View layout={LinearTransition.springify()} className="gap-3">
        {items.map((item, index) => (
          <Animated.View
            key={item}
            entering={FadeInDown.delay(index * 100).springify()}
            exiting={FadeOutUp.duration(300)}
            layout={LinearTransition.springify()}
          >
            <Pressable
              onPress={() => removeItem(item)}
              className="bg-surface p-4 rounded-xl flex-row justify-between items-center border-l-4 border-primary"
            >
              <Text className="text-slate-200 text-lg font-medium">{item}</Text>
              <Text className="text-red-400 font-bold">✕</Text>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>

      {items.length < ITEMS.length && (
        <Pressable
          onPress={resetItems}
          className="bg-slate-700 p-4 rounded-xl items-center mt-6"
        >
          <Text className="text-white font-semibold">🔄 Reset</Text>
        </Pressable>
      )}
    </View>
  );
}
```

### Ejemplo 3: interpolateColor — Theme Switch

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { View, Pressable } from "react-native";

export default function ColorSwitch() {
  const progress = useSharedValue(0);

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#0a0a0a", "#f8fafc"],
    ),
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 40 }],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#7c3aed", "#f59e0b"],
    ),
  }));

  const toggle = () => {
    progress.value = withTiming(progress.value === 0 ? 1 : 0, {
      duration: 400,
    });
  };

  return (
    <Animated.View
      style={backgroundStyle}
      className="flex-1 justify-center items-center"
    >
      <Pressable
        onPress={toggle}
        className="w-20 h-10 bg-slate-800 rounded-full p-1 justify-center"
      >
        <Animated.View style={circleStyle} className="w-8 h-8 rounded-full" />
      </Pressable>
    </Animated.View>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Swipe to Delete

Lista con items que se swipean a la izquierda para revelar un botón de eliminar.

### Ejercicio 2: Bottom Sheet

Sheet que se arrastra desde abajo con snap points (25%, 50%, 100%).

### Ejercicio 3: Card Flip

Tarjeta que rota 180° al tocar con `rotateY`.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica          | ❌ Malo                            | ✅ Bueno                                            |
| ----------------- | ---------------------------------- | --------------------------------------------------- |
| Hilo UI           | Lógica compleja en worklets        | Solo animación en worklets, data en JS thread       |
| SharedValue       | Crear shared values en cada render | `useSharedValue` una vez, actualizar con `.value`   |
| Layout Animations | Animar con `useEffect` + delay     | `entering={FadeIn}` layout animations de Reanimated |
| Gestos            | PanResponder legacy                | `react-native-gesture-handler` + Reanimated         |
| Cancelación       | No cancelar animaciones            | `cancelAnimation(sharedValue)` al desmontar         |
| Interpolation     | Interpolaciones en JS thread       | `useAnimatedStyle` con `interpolate()` en UI thread |

### Performance Tips

```tsx
// ✅ withTiming corre en UI thread — 60fps garantizados
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(offset.value) }],
}));

// ❌ Nunca hacer fetch/async dentro de worklets
const animatedStyle = useAnimatedStyle(() => {
  // fetch('/api/data'); ← CRASH — worklets no tienen acceso a JS APIs
});

// ✅ Usar runOnJS para ejecutar funciones JS desde worklets
const gesture = Gesture.Tap().onEnd(() => {
  runOnJS(handleTap)(); // Ejecutar en JS thread
});
```

---

## ✅ Checklist

- [ ] Entiendo la diferencia entre Animated API y Reanimated
- [ ] Sé usar `useSharedValue` y `useAnimatedStyle`
- [ ] Puedo animar con `withTiming`, `withSpring`, `withDecay`
- [ ] Sé integrar gestos con `react-native-gesture-handler`
- [ ] Puedo usar Layout Animations (Entering/Exiting)
- [ ] Entiendo `interpolateColor` y `interpolate`
