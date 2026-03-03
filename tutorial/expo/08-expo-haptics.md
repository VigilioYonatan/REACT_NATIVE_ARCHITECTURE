# Expo Haptics

> **Feedback háptico** — vibraciones sutiles al tocar botones, completar acciones, y alertar al usuario.

## 📦 Instalación

```bash
npx expo install expo-haptics
```

---

## 🔑 Tipos de Feedback

| Método                       | Cuándo usarlo                      | Intensidad |
| ---------------------------- | ---------------------------------- | ---------- |
| `impactAsync(Light)`         | Tocar botón, elemento UI           | Suave      |
| `impactAsync(Medium)`        | Acción completada                  | Media      |
| `impactAsync(Heavy)`         | Acción importante                  | Fuerte     |
| `notificationAsync(Success)` | Éxito ✅                           | Media      |
| `notificationAsync(Warning)` | Advertencia ⚠️                     | Media      |
| `notificationAsync(Error)`   | Error ❌                           | Fuerte     |
| `selectionAsync()`           | Cambiar selección (picker, toggle) | Muy suave  |

---

## 💻 Ejemplos

### 1. Botones con Haptics

```tsx
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";

export default function HapticsDemo() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-6 gap-4">
      <Text className="text-2xl font-bold text-white mb-4">Haptics 📳</Text>

      <Pressable
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        className="bg-blue-500 p-4 rounded-xl w-full"
      >
        <Text className="text-white text-center font-semibold">
          Light Impact
        </Text>
      </Pressable>

      <Pressable
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        className="bg-blue-600 p-4 rounded-xl w-full"
      >
        <Text className="text-white text-center font-semibold">
          Medium Impact
        </Text>
      </Pressable>

      <Pressable
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        className="bg-blue-700 p-4 rounded-xl w-full"
      >
        <Text className="text-white text-center font-semibold">
          Heavy Impact
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }
        className="bg-green-500 p-4 rounded-xl w-full"
      >
        <Text className="text-white text-center font-semibold">✅ Success</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
        className="bg-red-500 p-4 rounded-xl w-full"
      >
        <Text className="text-white text-center font-semibold">❌ Error</Text>
      </Pressable>

      <Pressable
        onPress={() => Haptics.selectionAsync()}
        className="bg-slate-700 p-4 rounded-xl w-full"
      >
        <Text className="text-white text-center font-semibold">Selection</Text>
      </Pressable>
    </View>
  );
}
```

### 2. Hook reutilizable

```tsx
// hooks/useHaptics.ts
import * as Haptics from "expo-haptics";
import { useCallback } from "react";

export function useHaptics() {
  const light = useCallback(
    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    [],
  );
  const medium = useCallback(
    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    [],
  );
  const heavy = useCallback(
    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    [],
  );
  const success = useCallback(
    () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    [],
  );
  const error = useCallback(
    () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    [],
  );
  const selection = useCallback(() => Haptics.selectionAsync(), []);

  return { light, medium, heavy, success, error, selection };
}

// Uso:
// const haptics = useHaptics();
// <Pressable onPress={() => { haptics.success(); doSomething(); }}>
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/haptics/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica      | ❌ Malo                     | ✅ Bueno                                                         |
| ------------- | --------------------------- | ---------------------------------------------------------------- |
| Frecuencia    | Haptic en cada interacción  | Solo en acciones importantes (confirmar, error, éxito)           |
| Tipo          | `Heavy` para todo           | Impact Light para tap, Notification Success/Error para resultado |
| Platform      | Asumir que siempre funciona | Check `Platform.OS` — Android emulators no vibran                |
| Accesibilidad | Sin opción de desactivar    | Respetar preferencia del usuario                                 |
| UX            | Haptic sin feedback visual  | Combinar haptic + visual + sonido para feedback completo         |

---

## ✅ Checklist

- [ ] Sé la diferencia entre impact, notification y selection
- [ ] Puedo usar haptics en botones y acciones
- [ ] Sé crear un hook `useHaptics` reutilizable
