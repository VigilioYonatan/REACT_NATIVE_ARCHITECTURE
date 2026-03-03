# 01 — Hola Mundo & Componentes Básicos

## 🎯 Objetivo

Crear tu primera app en React Native, entender la estructura de un componente y dominar los componentes fundamentales: `View`, `Text`, `Image` y `SafeAreaView`.

---

## 📚 Teoría

### ¿Qué es React Native?

React Native es un framework de Meta que permite crear aplicaciones **nativas** para iOS y Android usando **JavaScript/TypeScript** y **React**. A diferencia de un WebView, los componentes se renderizan como elementos nativos reales.

### ¿Qué es Expo?

Expo es un framework que simplifica el desarrollo con React Native. Con **Expo SDK 55** y **React Native 0.83**, la **New Architecture** (Fabric + TurboModules + JSI) es obligatoria.

### Componentes Fundamentales

| Componente       | Equivalente Web      | Descripción                                              |
| ---------------- | -------------------- | -------------------------------------------------------- |
| `<View>`         | `<div>`              | Contenedor principal, usa Flexbox por defecto            |
| `<Text>`         | `<p>`                | Muestra texto. **Todo texto debe ir dentro de `<Text>`** |
| `<Image>`        | `<img>`              | Muestra imágenes locales o remotas                       |
| `<SafeAreaView>` | —                    | Evita el notch y barras del sistema                      |
| `<ScrollView>`   | `<div>` con overflow | Contenedor con scroll                                    |

### JSX en React Native

JSX es una extensión de JavaScript que permite escribir "HTML" dentro de JS:

```tsx
// ✅ Correcto
<View>
  <Text>Hola Mundo</Text>
</View>

// ❌ Incorrecto — texto sin <Text>
<View>
  Hola Mundo
</View>
```

> ⚠️ **Regla fundamental**: En React Native NO se puede poner texto directamente dentro de `<View>`. Siempre debe ir dentro de `<Text>`.

---

## 💻 Código Práctico

### Ejemplo 1: Hola Mundo Básico

```tsx
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HolaMundo() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Hola Mundo! 🌍</Text>
        <Text style={styles.subtitle}>Mi primera app en React Native</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#a0a0a0",
  },
});
```

### Ejemplo 2: Componente con Image

```tsx
import { View, Text, Image, StyleSheet } from "react-native";

export default function PerfilCard() {
  return (
    <View style={styles.card}>
      {/* Imagen remota */}
      <Image
        source={{ uri: "https://i.pravatar.cc/150?img=3" }}
        style={styles.avatar}
      />

      {/* Imagen local */}
      {/* <Image source={require('../assets/avatar.png')} style={styles.avatar} /> */}

      <Text style={styles.nombre}>Ana García</Text>
      <Text style={styles.rol}>Desarrolladora Mobile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    // Sombra iOS
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Sombra Android
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Hace la imagen circular
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#7c3aed",
  },
  nombre: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  rol: {
    fontSize: 14,
    color: "#a78bfa",
    marginTop: 4,
  },
});
```

### Ejemplo 3: Componentes Reutilizables con Props

```tsx
import { View, Text, Image, StyleSheet } from "react-native";

// Definimos la interfaz de las props con TypeScript
interface InfoCardProps {
  emoji: string;
  titulo: string;
  descripcion: string;
}

// Componente reutilizable
function InfoCard({ emoji, titulo, descripcion }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.cardTitle}>{titulo}</Text>
      <Text style={styles.cardDesc}>{descripcion}</Text>
    </View>
  );
}

// Componente principal que usa InfoCard
export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>React Native 2026</Text>

      <InfoCard
        emoji="⚡"
        titulo="Fabric"
        descripcion="Nuevo motor de renderizado síncrono"
      />
      <InfoCard
        emoji="🔧"
        titulo="TurboModules"
        descripcion="Carga lazy de módulos nativos"
      />
      <InfoCard
        emoji="🌉"
        titulo="JSI"
        descripcion="Comunicación directa JS ↔ Native"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00d4ff",
    textAlign: "center",
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "#1a1a3e",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00d4ff",
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: "#94a3b8",
  },
});
```

---

## 🔑 Conceptos Clave

### Props vs State

| Concepto          | Props                         | State                          |
| ----------------- | ----------------------------- | ------------------------------ |
| ¿Quién lo define? | El componente padre           | El propio componente           |
| ¿Es mutable?      | ❌ No (read-only)             | ✅ Sí (con `setState`)         |
| ¿Cuándo se usa?   | Pasar datos entre componentes | Datos que cambian en el tiempo |

### Diferencias con React Web

```
React Web          →  React Native
<div>              →  <View>
<p>, <span>, <h1>  →  <Text>
<img>              →  <Image>
CSS classes        →  StyleSheet.create({})
onClick            →  onPress
```

---

## 📝 Ejercicios

### Ejercicio 1: Tarjeta de Presentación

Crea una tarjeta personal con:

- Tu foto (usa una URL de placeholder)
- Tu nombre
- Tu profesión
- 3 habilidades en una lista

### Ejercicio 2: Galería de Fotos

Crea una vista con 6 imágenes organizadas en un grid de 2 columnas usando `View` y `Image`.

### Ejercicio 3: Componente Reutilizable

Crea un componente `<Badge>` que reciba las props:

- `label: string` — texto a mostrar
- `color: string` — color de fondo
- `size: 'sm' | 'md' | 'lg'` — tamaño del badge

---

## 🏆 Buenas Prácticas y Optimización

| Práctica         | ❌ Malo                                   | ✅ Bueno                                             |
| ---------------- | ----------------------------------------- | ---------------------------------------------------- |
| Estilos          | Estilos inline `style={{ flex: 1 }}`      | `StyleSheet.create()` (se compila una vez)           |
| Imágenes remotas | `<Image source={{ uri }}` sin dimensiones | Siempre definir `width` y `height`                   |
| Imágenes locales | Cargar imágenes muy grandes               | Comprimir antes de bundlear (~100KB max)             |
| Componentes      | Un solo archivo gigante                   | Separar en componentes pequeños y reutilizables      |
| Tipos            | Props sin tipado                          | Interfaces TypeScript para cada prop                 |
| SafeArea         | `paddingTop: 50` para evitar notch        | `<SafeAreaView>` de `react-native-safe-area-context` |

### Optimización de Imágenes

```tsx
// ✅ Siempre definir dimensiones para imágenes remotas
<Image source={{ uri: 'https://...' }} style={{ width: 100, height: 100 }} />

// ✅ Usar resizeMode para controlar el ajuste
<Image source={{ uri }} style={styles.img} resizeMode="cover" />

// ❌ Nunca dejes una imagen remota sin dimensiones
<Image source={{ uri: 'https://...' }} />  // Crash o no se muestra
```

### Rendimiento de StyleSheet

```tsx
// ✅ StyleSheet.create() — se procesa una sola vez en el bridge
const styles = StyleSheet.create({ box: { flex: 1 } });

// ❌ Objeto inline — se crea un nuevo objeto en cada render
<View style={{ flex: 1, backgroundColor: '#000' }} />

// ✅ Si necesitas estilos dinámicos, combina ambos
<View style={[styles.box, { backgroundColor: isDark ? '#000' : '#fff' }]} />
```

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo la diferencia entre React Web y React Native
- [ ] Sé usar `View`, `Text`, `Image` y `SafeAreaView`
- [ ] Entiendo las props y cómo pasarlas entre componentes
- [ ] Sé usar `StyleSheet.create()` para estilos
- [ ] Puedo crear componentes reutilizables con TypeScript
- [ ] Entiendo la diferencia entre imágenes locales y remotas

---

## 📖 Referencias

- [React Native Docs — Core Components](https://reactnative.dev/docs/components-and-apis)
- [Expo Docs — SDK 55](https://docs.expo.dev/)
- [TypeScript + React Native](https://reactnative.dev/docs/typescript)
