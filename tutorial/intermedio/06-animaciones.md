# 06 — Animaciones con Animated API

## 🎯 Objetivo

Crear animaciones fluidas con la **Animated API** nativa de React Native: fade, slide, scale, spring, y combinarlas.

---

## 📚 Teoría

### Tipos de Animación

| Tipo       | Función             | Descripción                            |
| ---------- | ------------------- | -------------------------------------- |
| **Timing** | `Animated.timing()` | Duración fija, easing configurable     |
| **Spring** | `Animated.spring()` | Física de resorte (rebote natural)     |
| **Decay**  | `Animated.decay()`  | Desaceleración desde velocidad inicial |

### Flujo Básico

```tsx
// 1. Crear valor animado
const opacity = useRef(new Animated.Value(0)).current;

// 2. Configurar animación
Animated.timing(opacity, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // ⚡ Siempre que se pueda
}).start();

// 3. Usar en componente
<Animated.View style={{ opacity }}>
```

### useNativeDriver

| `useNativeDriver: true`    | `useNativeDriver: false`             |
| -------------------------- | ------------------------------------ |
| Animación en **UI thread** | Animación en **JS thread**           |
| `transform`, `opacity`     | `width`, `height`, `backgroundColor` |
| ⚡ 60fps garantizado       | ⚠️ Puede dropear frames              |

---

## 💻 Código Práctico

### Ejemplo 1: Fade + Slide In

```tsx
import { View, Text, Pressable, Animated } from "react-native";
import { useRef } from "react";

export default function AnimationDemo() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        className="bg-surface rounded-2xl p-8 w-full items-center border-l-4 border-primary mb-8"
      >
        <Text className="text-4xl mb-3">🎭</Text>
        <Text className="text-white text-xl font-bold">Animación</Text>
        <Text className="text-slate-400 mt-2">Fade + Slide</Text>
      </Animated.View>

      <View className="flex-row gap-4">
        <Pressable
          onPress={animateIn}
          className="bg-green-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Mostrar</Text>
        </Pressable>
        <Pressable
          onPress={animateOut}
          className="bg-red-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Ocultar</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### Ejemplo 2: Spring + Scale (Botón Animado)

```tsx
import { Animated, Pressable, Text, View } from "react-native";
import { useRef } from "react";

export default function SpringButton() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          className="bg-primary px-12 py-5 rounded-2xl shadow-lg shadow-primary/40"
        >
          <Text className="text-white text-lg font-bold">🚀 Spring!</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
```

### Ejemplo 3: Animación Sequencial + Loop

```tsx
import { View, Text, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function PulseLoader() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Animated.View
        style={{ transform: [{ scale }], opacity }}
        className="w-24 h-24 rounded-full bg-primary items-center justify-center"
      >
        <Text className="text-white text-3xl">💜</Text>
      </Animated.View>
      <Text className="text-slate-400 mt-6">Cargando...</Text>
    </View>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Lista Animada

Cada item de una FlatList aparece con fade+slide escalonado (delay incrementando).

### Ejercicio 2: Like Button

Corazón que hace scale up + cambia de color (gris→rojo) con spring al presionar.

### Ejercicio 3: Splash Screen

Logo que aparece con fade-in, sube con slide, y luego hace zoom out antes de navegar.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica     | ❌ Malo                                  | ✅ Bueno                                                      |
| ------------ | ---------------------------------------- | ------------------------------------------------------------- |
| Driver       | `useNativeDriver: false`                 | `useNativeDriver: true` (60fps en el hilo nativo)             |
| Layout props | Animar `width`, `height`, `top`          | Animar solo `transform` y `opacity` (nativeDriver compatible) |
| Clases       | Mezclar Animated + NativeWind            | Animated para animación, NativeWind para estilos estáticos    |
| Complejidad  | Animated API para gestos complejos       | Usar Reanimated 4 para worklets en UI thread                  |
| Refs         | Crear nuevo `Animated.Value` cada render | `useRef(new Animated.Value(0))`                               |
| Loops        | `setInterval` para animaciones           | `Animated.loop()` nativo                                      |

### useNativeDriver — La Regla de Oro

```tsx
// ✅ Corre en el hilo nativo UI — 60fps
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Solo funciona con transform y opacity
}).start();

// ❌ Corre en el hilo JS — posibles drops de frames
Animated.timing(heightAnim, {
  toValue: 200,
  duration: 300,
  useNativeDriver: false, // Necesario para layout props (width, height)
}).start();
```

### Cuándo usar Animated vs Reanimated

```
Animated API   → Animaciones simples (fade, scale, slide)
Reanimated 4  → Gestos complejos, worklets, shared values, layout animations
Lottie         → Animaciones complejas basadas en archivos After Effects
```

---

## ✅ Checklist

- [ ] Sé crear valores animados con `Animated.Value`
- [ ] Puedo usar `timing`, `spring` y `decay`
- [ ] Entiendo `useNativeDriver` y cuándo activarlo
- [ ] Sé combinar con `parallel`, `sequence`, `loop`
- [ ] Puedo integrar Animated.View con NativeWind className
