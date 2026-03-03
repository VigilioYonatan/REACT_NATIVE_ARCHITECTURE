# 06 — Navegación Básica (Stack)

## 🎯 Objetivo

Aprender a navegar entre pantallas con **Expo Router** (file-based routing), pasar parámetros entre pantallas y usar el `Stack` navigator.

---

## 📚 Teoría

### Expo Router (2026) — File-Based Routing

En React Native 0.83 con Expo SDK 55, la navegación se basa en **archivos**. Cada archivo en `app/` es una ruta:

```
app/
├── _layout.tsx     →  Layout raíz (Stack, Tabs, etc.)
├── index.tsx       →  Ruta "/"
├── about.tsx       →  Ruta "/about"
├── users/
│   ├── index.tsx   →  Ruta "/users"
│   └── [id].tsx    →  Ruta "/users/123" (dinámica)
```

### Navegación — Herramientas

| API                      | Uso                                 | Ejemplo                                 |
| ------------------------ | ----------------------------------- | --------------------------------------- |
| `<Link>`                 | Navegación declarativa (como `<a>`) | `<Link href="/about">Ir</Link>`         |
| `useRouter()`            | Navegación imperativa               | `router.push('/about')`                 |
| `router.push()`          | Ir a pantalla (agrega al stack)     | `router.push('/users/1')`               |
| `router.replace()`       | Reemplaza la pantalla actual        | `router.replace('/home')`               |
| `router.back()`          | Volver atrás                        | `router.back()`                         |
| `useLocalSearchParams()` | Leer params de la URL               | `const { id } = useLocalSearchParams()` |

### Stack Navigator

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#0a0a0a" },
      }}
    />
  );
}
```

---

## 💻 Código Práctico

### Ejemplo 1: Navegación Básica con Link y Router

```tsx
// app/index.tsx — Pantalla principal
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>

      {/* Navegación declarativa con Link */}
      <Link href="/about" style={styles.link}>
        <Text style={styles.linkText}>Ir a About →</Text>
      </Link>

      <Link href="/profile" style={styles.link}>
        <Text style={styles.linkText}>Ir a Profile →</Text>
      </Link>

      {/* Ruta dinámica */}
      <Link href="/users/42" style={styles.link}>
        <Text style={styles.linkText}>Ver Usuario #42 →</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 32 },
  link: {
    backgroundColor: "#1e1e2e",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  linkText: { color: "#7c3aed", fontSize: 17, fontWeight: "600" },
});
```

### Ejemplo 2: Rutas Dinámicas con Params

```tsx
// app/users/[id].tsx — Ruta dinámica
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

const USERS: Record<string, { name: string; role: string; emoji: string }> = {
  "42": { name: "Ana García", role: "Frontend Dev", emoji: "👩‍💻" },
  "7": { name: "Carlos López", role: "Backend Dev", emoji: "👨‍💻" },
};

export default function UserDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = USERS[id ?? ""] ?? {
    name: "Desconocido",
    role: "N/A",
    emoji: "❓",
  };

  return (
    <View style={styles.container}>
      {/* Configurar header dinámicamente */}
      <Stack.Screen options={{ title: user.name, headerBackTitle: "Volver" }} />

      <Text style={styles.emoji}>{user.emoji}</Text>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.role}>{user.role}</Text>
      <Text style={styles.id}>ID: {id}</Text>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </Pressable>

      {/* Navegar a otro usuario */}
      <Pressable
        onPress={() => router.push("/users/7")}
        style={styles.nextButton}
      >
        <Text style={styles.nextText}>Ver Usuario #7 →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: { fontSize: 80, marginBottom: 16 },
  name: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  role: { fontSize: 16, color: "#7c3aed", marginTop: 4 },
  id: { fontSize: 14, color: "#64748b", marginTop: 8 },
  backButton: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    width: "100%",
    alignItems: "center",
  },
  backText: { color: "#e2e8f0", fontSize: 16, fontWeight: "600" },
  nextButton: {
    backgroundColor: "#1e1e3a",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  nextText: { color: "#a78bfa", fontSize: 16 },
});
```

### Ejemplo 3: Lista → Detalle (Patrón Master-Detail)

```tsx
// app/products/index.tsx
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const PRODUCTS = [
  { id: "1", name: "iPhone 17", price: 999, emoji: "📱" },
  { id: "2", name: "MacBook Pro", price: 2499, emoji: "💻" },
  { id: "3", name: "AirPods Max", price: 549, emoji: "🎧" },
];

export default function ProductList() {
  const router = useRouter();

  return (
    <FlatList
      style={styles.container}
      data={PRODUCTS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/products/${item.id}`)}
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  content: { padding: 20, paddingTop: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    padding: 18,
    borderRadius: 14,
    marginBottom: 10,
    gap: 14,
  },
  emoji: { fontSize: 36 },
  info: { flex: 1 },
  name: { color: "#fff", fontSize: 17, fontWeight: "600" },
  price: { color: "#22c55e", fontSize: 15, marginTop: 2 },
  arrow: { color: "#475569", fontSize: 24 },
});
```

---

## 📝 Ejercicios

### Ejercicio 1: Blog con Master-Detail

Lista de artículos → al tocar uno, navegar al detalle con título, contenido y autor.

### Ejercicio 2: Navegación con Params Múltiples

Pantalla de búsqueda → pasar `category` y `query` como params → pantalla de resultados.

### Ejercicio 3: Flujo de Onboarding

3 pantallas secuenciales (Paso 1 → 2 → 3) con `router.push`. En la última, `router.replace('/home')`.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica     | ❌ Malo                                | ✅ Bueno                                             |
| ------------ | -------------------------------------- | ---------------------------------------------------- |
| Params       | Pasar objetos grandes como params      | Pasar solo IDs, cargar data en la pantalla destino   |
| Headers      | Hardcodear header en cada screen       | `screenOptions` en el Navigator o layout             |
| Animaciones  | Transiciones default sin pensar        | `animation: 'slide_from_right'` o custom transitions |
| Deep linking | No configurar                          | Definir `scheme` y rutas en `app.json`               |
| Back handler | No manejar el botón "atrás" Android    | `headerBackTitle`, `gestureEnabled`                  |
| Auth flow    | Stack con login y home al mismo tiempo | Grupos `(auth)` y `(tabs)` separados                 |

### Optimización de Navegación

```tsx
// ✅ Solo pasar IDs como params — cargar data en destino
router.push({ pathname: "/user/[id]", params: { id: "42" } });

// ❌ Nunca pasar objetos grandes como params
router.push({ pathname: "/user", params: { user: JSON.stringify(bigObject) } });

// ✅ Lazy loading de pantallas con Expo Router
// Expo Router hace lazy loading por defecto — las pantallas
// solo se cargan cuando se navega a ellas

// ✅ Precarga de pantallas críticas
import { router } from "expo-router";
router.prefetch("/settings"); // Precargar en background
```

---

## ✅ Checklist

- [ ] Entiendo file-based routing de Expo Router
- [ ] Sé usar `<Link>` y `useRouter()` para navegar
- [ ] Puedo crear rutas dinámicas con `[id].tsx`
- [ ] Sé leer params con `useLocalSearchParams()`
- [ ] Entiendo la diferencia entre `push`, `replace` y `back`
- [ ] Puedo personalizar el header con `Stack.Screen options`
