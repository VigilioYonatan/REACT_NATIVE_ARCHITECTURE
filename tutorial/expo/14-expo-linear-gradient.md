# Expo Linear Gradient & BlurView

> **Gradientes** y **efectos blur** nativos para crear interfaces modernas con glassmorphism, headers dinámicos, y fondos premium.

## 📦 Instalación

```bash
npx expo install expo-linear-gradient expo-blur
```

---

## 💻 Ejemplos

### 1. Gradiente Básico

```tsx
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientDemo() {
  return (
    <View className="flex-1">
      {/* Fondo completo */}
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text className="text-white text-4xl font-bold">Gradiente</Text>
        <Text className="text-slate-300 mt-2">De arriba a abajo</Text>
      </LinearGradient>
    </View>
  );
}
```

### 2. Gradiente Horizontal y Diagonal

```tsx
import { LinearGradient } from "expo-linear-gradient";
import { View, Text } from "react-native";

export function GradientCard({
  title,
  colors,
}: {
  title: string;
  colors: string[];
}) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }} // Diagonal
      style={{ padding: 24, borderRadius: 16, marginBottom: 12 }}
    >
      <Text className="text-white text-xl font-bold">{title}</Text>
    </LinearGradient>
  );
}

// Uso:
// <GradientCard title="Sunset" colors={['#f97316', '#ef4444', '#ec4899']} />
// <GradientCard title="Ocean" colors={['#06b6d4', '#3b82f6', '#8b5cf6']} />
// <GradientCard title="Forest" colors={['#22c55e', '#14b8a6', '#0ea5e9']} />
```

### 3. Botón Gradiente

```tsx
import { Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: string[];
}

export function GradientButton({
  title,
  onPress,
  colors = ["#7c3aed", "#a855f7", "#c084fc"],
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-80 active:scale-[0.98]"
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text className="text-white font-bold text-base">{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}
```

### 4. BlurView — Glassmorphism

```tsx
import { View, Text, ImageBackground } from "react-native";
import { BlurView } from "expo-blur";

export default function Glassmorphism() {
  return (
    <ImageBackground
      source={{ uri: "https://picsum.photos/800/1200" }}
      className="flex-1 justify-center items-center p-6"
    >
      <BlurView
        intensity={60}
        tint="dark"
        style={{
          padding: 32,
          borderRadius: 24,
          overflow: "hidden",
          width: "100%",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Text className="text-white text-2xl font-bold mb-2">
          Glassmorphism ✨
        </Text>
        <Text className="text-slate-200">
          Efecto blur nativo con expo-blur. Funciona en iOS y Android.
        </Text>
      </BlurView>
    </ImageBackground>
  );
}
```

### 5. Header con Fade Gradient

```tsx
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function FadeHeader({ title }: { title: string }) {
  return (
    <View className="absolute top-0 left-0 right-0 z-10">
      <LinearGradient
        colors={[
          "rgba(15, 13, 35, 1)",
          "rgba(15, 13, 35, 0.8)",
          "rgba(15, 13, 35, 0)",
        ]}
        style={{ paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-2xl font-bold">{title}</Text>
      </LinearGradient>
    </View>
  );
}
```

---

## 🏆 Buenas Prácticas y Optimización

| Práctica             | Detalle                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| **Evita re-renders** | Memoriza arrays de `colors` con `useMemo` — nuevas refs causan re-render |
| **Performance**      | `BlurView` es costoso — úsalo en **pocas** superficies, no en listas     |
| **Colores RGBA**     | Usa `rgba()` en gradientes fade para transparencia suave                 |
| **Start/End**        | `{x:0,y:0}→{x:1,y:0}` = horizontal; `{x:0,y:0}→{x:1,y:1}` = diagonal     |
| **Tint de blur**     | `"light"` para fondos claros, `"dark"` para oscuros, `"default"` auto    |
| **Locations**        | `locations={[0, 0.5, 1]}` controla dónde se posiciona cada color         |

```tsx
// ✅ Memorizar colors para evitar re-renders
const colors = useMemo(() => ['#7c3aed', '#a855f7'], []);
<LinearGradient colors={colors} />

// ❌ Esto causa re-render cada vez
<LinearGradient colors={['#7c3aed', '#a855f7']} />
```

---

## 🔗 Links

- [Linear Gradient docs](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [Blur docs](https://docs.expo.dev/versions/latest/sdk/blur-view/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica    | ❌ Malo                            | ✅ Bueno                                         |
| ----------- | ---------------------------------- | ------------------------------------------------ |
| Performance | Gradient en cada item de una lista | Gradient solo en containers/headers estáticos    |
| Blur        | `intensity={100}` pesado           | `intensity` 30-50 para efecto sutil sin impacto  |
| Colores     | Gradients con 5+ colores           | 2-3 colores máximo para gradients limpios        |
| Glass       | BlurView sin fallback              | `tint` + `backgroundColor` fallback para Android |
| Reuse       | Gradients configurados inline      | Componente `<GradientCard>` reutilizable         |

---

## ✅ Checklist

- [ ] Sé crear gradientes verticales, horizontales y diagonales
- [ ] Puedo hacer botones y cards con gradiente
- [ ] Sé usar BlurView para glassmorphism
- [ ] Entiendo cómo optimizar gradientes (useMemo para colors)
- [ ] Puedo crear headers con fade gradient
