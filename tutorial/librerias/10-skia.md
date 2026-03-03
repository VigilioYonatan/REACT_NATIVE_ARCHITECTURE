# React Native Skia 2.4 (Shopify)

> Motor de **gráficos 2D** de alto rendimiento — dibuja shapes, gradientes, shaders, blur, paths, y texto con la API Skia de Google.

## 📦 Instalación

```bash
npx expo install @shopify/react-native-skia
```

---

## 🔑 ¿Para qué usarlo?

| Caso                 | Ejemplo                              |
| -------------------- | ------------------------------------ |
| Gradientes complejos | Fondos animated con mesh gradients   |
| Gráficas y charts    | Barras, líneas, pies personalizados  |
| Efectos visuales     | Blur, sombras, glassmorphism         |
| Dibujo               | Canvas para firma, anotaciones       |
| Shaders              | Efectos GLSL en tiempo real          |
| Texto decorativo     | Texto con gradientes, sombras, paths |

---

## 💻 Ejemplos

### 1. Canvas Básico — Shapes

```tsx
import { View, Text } from "react-native";
import {
  Canvas,
  Circle,
  Rect,
  RoundedRect,
  Group,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";

export default function SkiaShapes() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Text className="text-white text-2xl font-bold mb-6">Skia Shapes</Text>

      <Canvas style={{ width: 300, height: 300 }}>
        {/* Rectángulo con gradiente */}
        <RoundedRect x={20} y={20} width={260} height={120} r={20}>
          <LinearGradient
            start={vec(20, 20)}
            end={vec(280, 140)}
            colors={["#7c3aed", "#06b6d4"]}
          />
        </RoundedRect>

        {/* Círculos */}
        <Circle cx={80} cy={220} r={40} color="#7c3aed" opacity={0.8} />
        <Circle cx={150} cy={220} r={40} color="#06b6d4" opacity={0.8} />
        <Circle cx={220} cy={220} r={40} color="#f59e0b" opacity={0.8} />
      </Canvas>
    </View>
  );
}
```

### 2. Animated Gradient Background

```tsx
import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { useEffect } from "react";

export default function AnimatedGradient() {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
  }, []);

  return (
    <Canvas style={{ width, height, position: "absolute" }}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={["#0f0c29", "#302b63", "#24243e"]}
        />
      </Rect>
    </Canvas>
  );
}
```

### 3. Blur Effect (Glassmorphism)

```tsx
import {
  Canvas,
  RoundedRect,
  BackdropBlur,
  Fill,
} from "@shopify/react-native-skia";
import { View, Text, useWindowDimensions } from "react-native";

export default function GlassCard() {
  const { width } = useWindowDimensions();

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Canvas style={{ width: width - 40, height: 200 }}>
        <Fill color="rgba(124, 58, 237, 0.1)" />
        <BackdropBlur
          blur={20}
          clip={{ x: 0, y: 0, width: width - 40, height: 200 }}
        >
          <RoundedRect
            x={0}
            y={0}
            width={width - 40}
            height={200}
            r={20}
            color="rgba(255, 255, 255, 0.1)"
          />
        </BackdropBlur>
      </Canvas>
      <Text className="text-white text-xl font-bold absolute">
        Glassmorphism ✨
      </Text>
    </View>
  );
}
```

### 4. Drawing Path (Firma)

```tsx
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { useState, useCallback } from "react";

export default function SignaturePad() {
  const { width } = useWindowDimensions();
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<any>(null);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      const path = Skia.Path.Make();
      path.moveTo(e.x, e.y);
      setCurrentPath(path);
    })
    .onUpdate((e) => {
      if (currentPath) {
        currentPath.lineTo(e.x, e.y);
        setCurrentPath(currentPath.copy());
      }
    })
    .onEnd(() => {
      if (currentPath) {
        setPaths((p) => [...p, currentPath.toSVGString()]);
        setCurrentPath(null);
      }
    });

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-white text-xl font-bold mb-4">✍️ Firma Aquí</Text>
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <Canvas
            style={{
              width: width - 40,
              height: 300,
              backgroundColor: "#1e1e2e",
              borderRadius: 16,
            }}
          >
            {paths.map((d, i) => (
              <Path
                key={i}
                path={d}
                color="#7c3aed"
                style="stroke"
                strokeWidth={3}
              />
            ))}
            {currentPath && (
              <Path
                path={currentPath}
                color="#7c3aed"
                style="stroke"
                strokeWidth={3}
              />
            )}
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView>
      <Pressable
        onPress={() => setPaths([])}
        className="bg-red-500 py-3 rounded-xl items-center mt-4"
      >
        <Text className="text-white font-semibold">🗑 Limpiar</Text>
      </Pressable>
    </View>
  );
}
```

---

## 🔗 Links

- [Documentación oficial](https://shopify.github.io/react-native-skia/)
- [GitHub](https://github.com/Shopify/react-native-skia)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica  | ❌ Malo                    | ✅ Bueno                                                 |
| --------- | -------------------------- | -------------------------------------------------------- |
| Canvas    | Canvas gigante innecesario | Limitar tamaño del Canvas al mínimo necesario            |
| Re-draw   | Re-dibujar todo el canvas  | `Reanimated` shared values para partes animadas          |
| Gradients | CSS gradients              | `LinearGradient` de Skia (GPU-accelerated)               |
| Fonts     | Cargar font en cada render | `useFont` con `expo-font` pre-cargada                    |
| Images    | `expo-image` para filtros  | Skia `ImageShader` para filtros GPU (blur, color matrix) |

---

## ✅ Checklist

- [ ] Sé usar `<Canvas>` con shapes básicas
- [ ] Puedo crear gradientes lineales y radiales
- [ ] Entiendo blur/glassmorphism con Skia
- [ ] Sé dibujar paths interactivos
- [ ] Puedo integrar Skia con Reanimated
