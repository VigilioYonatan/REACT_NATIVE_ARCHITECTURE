# React Native Gesture Handler

> Sistema de **gestos** de alto rendimiento que corre en el UI thread nativo. Base para Reanimated, Bottom Sheet y Drawer.

## 📦 Instalación

```bash
npx expo install react-native-gesture-handler
```

### Setup en Root Layout

```tsx
// app/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack />
    </GestureHandlerRootView>
  );
}
```

---

## 🔑 Gestos Disponibles

| Gesto                 | Descripción        | Eventos               |
| --------------------- | ------------------ | --------------------- |
| `Gesture.Tap()`       | Toque simple/doble | `onStart`, `onEnd`    |
| `Gesture.Pan()`       | Arrastrar (drag)   | `onUpdate`, `onEnd`   |
| `Gesture.Pinch()`     | Pellizcar (zoom)   | `onUpdate` (scale)    |
| `Gesture.Rotation()`  | Rotar 2 dedos      | `onUpdate` (rotation) |
| `Gesture.LongPress()` | Presión larga      | `onStart`, `onEnd`    |
| `Gesture.Fling()`     | Swipe rápido       | `onStart` (direction) |

### Composición

| Método                         | Descripción                     |
| ------------------------------ | ------------------------------- |
| `Gesture.Simultaneous(g1, g2)` | Ambos a la vez                  |
| `Gesture.Exclusive(g1, g2)`    | Solo uno (prioridad al primero) |
| `Gesture.Race(g1, g2)`         | El primero que se active gana   |

---

## 💻 Ejemplos

### 1. Drag & Drop

```tsx
import { View, Text } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function DragDrop() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      // Snap back al centro
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView className="flex-1 bg-background justify-center items-center">
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={animatedStyle}
          className="w-32 h-32 bg-primary rounded-3xl justify-center items-center shadow-lg"
        >
          <Text className="text-4xl">🎯</Text>
          <Text className="text-white text-xs mt-1">Arrástrme</Text>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
```

### 2. Pinch to Zoom

```tsx
import { View, Image } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function PinchZoom() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < 1) {
        scale.value = 1;
        savedScale.value = 1;
      }
    });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureHandlerRootView className="flex-1 bg-black justify-center items-center">
      <GestureDetector gesture={pinchGesture}>
        <Animated.Image
          source={{ uri: "https://picsum.photos/400/600" }}
          style={[{ width: 300, height: 400 }, imageStyle]}
          className="rounded-2xl"
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
```

### 3. Swipe to Delete

```tsx
import { View, Text, FlatList } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useState } from "react";

function SwipeableItem({
  item,
  onDelete,
}: {
  item: string;
  onDelete: (item: string) => void;
}) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        translateX.value = withTiming(-400, {}, () => runOnJS(onDelete)(item));
      } else {
        translateX.value = withTiming(0);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="mb-2">
      <View className="absolute right-0 top-0 bottom-0 w-full bg-red-500 rounded-xl justify-center items-end pr-6">
        <Text className="text-white font-bold">🗑 Eliminar</Text>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={style} className="bg-surface p-4 rounded-xl">
          <Text className="text-white text-base">{item}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default function SwipeList() {
  const [items, setItems] = useState([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
  ]);

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">
        Swipe ← para eliminar
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <SwipeableItem
            item={item}
            onDelete={(i) => setItems((p) => p.filter((x) => x !== i))}
          />
        )}
      />
    </View>
  );
}
```

### 4. Double Tap (Like Animation)

```tsx
import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export default function DoubleTapLike() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      scale.value = withSpring(1, { damping: 8 });
      opacity.value = withTiming(1, { duration: 200 });
    })
    .onEnd(() => {
      scale.value = withDelay(500, withSpring(0));
      opacity.value = withDelay(500, withTiming(0));
    });

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={doubleTap}>
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-slate-500 mb-8">Doble toque para ❤️</Text>
        <Animated.Text style={heartStyle} className="text-8xl absolute">
          ❤️
        </Animated.Text>
      </View>
    </GestureDetector>
  );
}
```

---

## 🔗 Links

- [Documentación oficial](https://docs.swmansion.com/react-native-gesture-handler/)
- [GitHub](https://github.com/software-mansion/react-native-gesture-handler)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica               | ❌ Malo                   | ✅ Bueno                                            |
| ---------------------- | ------------------------- | --------------------------------------------------- |
| API                    | `TouchableOpacity`        | `Gesture.Tap()` v2 declarativo                      |
| Composición            | Un gesto gigante          | `Gesture.Simultaneous()`, `.Race()`, `.Exclusive()` |
| Hit area               | Área de toque muy pequeña | `hitSlop` para expandir zona táctil                 |
| Feedback               | Sin feedback al tocar     | `Gesture.Tap().onBegin()` para feedback inmediato   |
| GestureHandlerRootView | Olvidar wrappear          | Siempre en `_layout.tsx` raíz                       |

---

## ✅ Checklist

- [ ] Sé configurar `GestureHandlerRootView`
- [ ] Puedo usar `Gesture.Pan()`, `.Tap()`, `.Pinch()`, `.Rotation()`
- [ ] Sé integrar gestos con Reanimated (shared values)
- [ ] Puedo componer gestos con `Simultaneous`, `Exclusive`, `Race`
- [ ] Sé implementar swipe-to-delete y drag-and-drop
