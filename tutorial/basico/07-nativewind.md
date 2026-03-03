# 07 — NativeWind 4.2.1 (Tailwind CSS para React Native)

## 🎯 Objetivo

Aprender a usar **NativeWind 4.2.1** para estilizar componentes de React Native con clases de **Tailwind CSS** usando el prop `className`, reemplazando `StyleSheet.create()`.

---

## 📚 Teoría

### ¿Qué es NativeWind?

NativeWind permite usar **Tailwind CSS utility classes** directamente en React Native. Internamente convierte las clases en objetos `StyleSheet.create()` durante el build, con **rendimiento nativo**.

```tsx
// ❌ Antes — StyleSheet (verbose)
<View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
  <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff' }}>Hola</Text>
</View>

// ✅ Ahora — NativeWind (conciso)
<View className="flex-1 bg-[#0a0a0a] justify-center items-center p-5">
  <Text className="text-3xl font-bold text-white">Hola</Text>
</View>
```

### Instalación con Expo SDK 55

```bash
npx expo install nativewind@4.2.1 tailwindcss@3.4.17
npx expo install react-native-reanimated react-native-safe-area-context
```

### Configuración

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",
        surface: "#1e1e2e",
        background: "#0a0a0a",
      },
    },
  },
  plugins: [],
};
```

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

```tsx
// app/_layout.tsx
import "../global.css"; // ¡Importar el CSS global!
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

---

## 💻 Código Práctico

### Ejemplo 1: Componentes Básicos con NativeWind

```tsx
import { View, Text, Image, Pressable } from "react-native";

export default function HolaNativeWind() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Image
        source={{ uri: "https://i.pravatar.cc/150?img=3" }}
        className="w-24 h-24 rounded-full border-4 border-primary mb-6"
      />
      <Text className="text-3xl font-bold text-white mb-2">
        ¡Hola NativeWind! 🎨
      </Text>
      <Text className="text-base text-slate-400 text-center mb-8">
        Tailwind CSS en React Native
      </Text>

      <Pressable className="bg-primary px-8 py-4 rounded-2xl active:opacity-80 active:scale-95">
        <Text className="text-white font-semibold text-lg">Empezar</Text>
      </Pressable>
    </View>
  );
}
```

### Ejemplo 2: Cards con Dark Mode y Sombras

```tsx
import { View, Text, ScrollView } from "react-native";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureCard({ emoji, title, description }: FeatureCardProps) {
  return (
    <View
      className="bg-surface rounded-2xl p-5 mb-3 border-l-4 border-primary
                      shadow-lg shadow-primary/20"
    >
      <Text className="text-3xl mb-2">{emoji}</Text>
      <Text className="text-lg font-semibold text-white mb-1">{title}</Text>
      <Text className="text-sm text-slate-400 leading-5">{description}</Text>
    </View>
  );
}

export default function FeaturesScreen() {
  return (
    <ScrollView className="flex-1 bg-background px-5 pt-16">
      <Text className="text-2xl font-bold text-cyan-400 text-center mb-6">
        NativeWind 4.2.1
      </Text>
      <FeatureCard
        emoji="⚡"
        title="className prop"
        description="Usa clases de Tailwind directamente en React Native"
      />
      <FeatureCard
        emoji="🎨"
        title="Dark Mode"
        description="Soporte nativo con la clase dark:"
      />
      <FeatureCard
        emoji="📱"
        title="Responsive"
        description="Media queries con sm:, md:, lg:"
      />
      <FeatureCard
        emoji="🔄"
        title="CSS Variables"
        description="Variables CSS personalizadas"
      />
    </ScrollView>
  );
}
```

### Ejemplo 3: Comparación StyleSheet vs NativeWind

```tsx
// ❌ StyleSheet — 30 líneas de estilos
import { View, Text, StyleSheet } from "react-native";

function CardStyleSheet() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>StyleSheet</Text>
      <Text style={styles.subtitle}>Muchas líneas de código</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e2e",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#ffffff" },
  subtitle: { fontSize: 14, color: "#94a3b8", marginTop: 4 },
});

// ✅ NativeWind — Todo inline, limpio
function CardNativeWind() {
  return (
    <View className="bg-surface rounded-2xl p-5 mb-3 shadow-lg shadow-primary/30">
      <Text className="text-lg font-semibold text-white">NativeWind</Text>
      <Text className="text-sm text-slate-400 mt-1">Conciso y limpio</Text>
    </View>
  );
}
```

### Ejemplo 4: Responsive Design + Estado Condicional

```tsx
import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function ResponsiveDemo() {
  const [isActive, setIsActive] = useState(false);

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      {/* Responsive: 1 col en móvil, 2 en tablet */}
      <View className="flex-row flex-wrap gap-3">
        {["React", "Native", "Expo", "TypeScript"].map((tech) => (
          <View
            key={tech}
            className="bg-surface rounded-xl p-4 w-[48%] sm:w-[31%] lg:w-[23%]"
          >
            <Text className="text-white font-medium text-center">{tech}</Text>
          </View>
        ))}
      </View>

      {/* Estilos condicionales con template literals */}
      <Pressable
        onPress={() => setIsActive((p) => !p)}
        className={`mt-8 px-6 py-4 rounded-2xl items-center
          ${isActive ? "bg-green-500" : "bg-slate-700"}
          active:opacity-80`}
      >
        <Text className="text-white font-semibold text-base">
          {isActive ? "✅ Activo" : "⬜ Inactivo"}
        </Text>
      </Pressable>
    </View>
  );
}
```

---

## 🔑 Cheatsheet: StyleSheet → NativeWind

| StyleSheet                   | NativeWind                                |
| ---------------------------- | ----------------------------------------- |
| `flex: 1`                    | `flex-1`                                  |
| `backgroundColor: '#0a0a0a'` | `bg-[#0a0a0a]` o `bg-background`          |
| `justifyContent: 'center'`   | `justify-center`                          |
| `alignItems: 'center'`       | `items-center`                            |
| `padding: 20`                | `p-5`                                     |
| `marginBottom: 12`           | `mb-3`                                    |
| `borderRadius: 16`           | `rounded-2xl`                             |
| `fontSize: 32`               | `text-3xl`                                |
| `fontWeight: 'bold'`         | `font-bold`                               |
| `color: '#ffffff'`           | `text-white`                              |
| `flexDirection: 'row'`       | `flex-row`                                |
| `gap: 16`                    | `gap-4`                                   |
| `width: '100%'`              | `w-full`                                  |
| `height: 60`                 | `h-[60px]`                                |
| `opacity: 0.5`               | `opacity-50`                              |
| Valores custom               | `bg-[#1e1e2e]` \| `w-[48%]` \| `p-[22px]` |

### Pseudo-clases (NativeWind 4.x)

```tsx
<Pressable className="bg-primary active:bg-primary/80 active:scale-95">
<View className="hover:bg-slate-700">  {/* Solo en web */}
<TextInput className="focus:border-primary">
```

### Dark Mode

```tsx
<View className="bg-white dark:bg-background">
<Text className="text-black dark:text-white">
```

---

## 📝 Ejercicios

### Ejercicio 1: Perfil con NativeWind

Recrea la tarjeta de perfil del Ejercicio 1 de la lección 01 usando solo NativeWind (sin StyleSheet).

### Ejercicio 2: Grid Responsive

Crea un grid de 6 cards que sea:

- 2 columnas en móvil
- 3 columnas en tablet
- Usa `w-[48%]` y `sm:w-[31%]`

### Ejercicio 3: Migración

Toma cualquier componente con StyleSheet y conviértelo a NativeWind. Compara la cantidad de líneas.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                                                                               | ✅ Bueno                                          |
| ---------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Clases     | `className="p-4 m-2 bg-slate-800 rounded-xl border border-slate-700 ..."` super larga | Agrupar en variables o crear componentes          |
| Colores    | Colores hardcodeados `bg-[#1a1a2e]`                                                   | Definir en `tailwind.config.js` como `bg-surface` |
| Dark mode  | `if (isDark)` condicional manual                                                      | `dark:bg-slate-900` (automático con NativeWind)   |
| Responsive | Dimensiones fijas `w-[375px]`                                                         | `w-full`, `flex-1`, clases responsive             |
| Migración  | Mezclar StyleSheet y NativeWind                                                       | Elegir uno y ser consistente en todo el proyecto  |

### Organización de Clases

```tsx
// ❌ Clases largas e ilegibles
<View className="flex-1 bg-slate-900 p-4 pt-16 gap-4 items-center justify-center border border-slate-700 rounded-2xl shadow-lg" />;

// ✅ Extraer a variables descriptivas
const containerClasses = "flex-1 bg-background p-4 pt-16";
const cardClasses = "bg-surface rounded-2xl border border-slate-700 p-4";

<View className={containerClasses}>
  <View className={cardClasses}>...</View>
</View>;

// ✅✅ Mejor aún: crear componentes reutilizables
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`bg-surface rounded-2xl border border-slate-700 p-4 ${className}`}
    >
      {children}
    </View>
  );
}
```

### Configurar Design Tokens

```js
// tailwind.config.js — definir tokens una sola vez
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "#0f0d23",
        surface: "#1e1e2e",
        primary: "#7c3aed",
      },
    },
  },
};
// Ahora: className="bg-background" en vez de className="bg-[#0f0d23]"
```

---

## ✅ Checklist

- [ ] Sé instalar y configurar NativeWind 4.2.1 con Expo
- [ ] Puedo usar `className` con clases de Tailwind en React Native
- [ ] Sé usar valores custom con `[]` (ej: `bg-[#1e1e2e]`)
- [ ] Entiendo la equivalencia entre StyleSheet y NativeWind
- [ ] Puedo aplicar estilos condicionales con template literals
- [ ] Sé usar `active:`, `focus:`, y `dark:` pseudo-clases
- [ ] Puedo extender el tema en `tailwind.config.js`
