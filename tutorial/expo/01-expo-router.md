# Expo Router — File-Based Navigation

> Sistema de **navegación** basado en archivos — como Next.js pero para React Native. Stack, Tabs, Drawer, y deep links automáticos.

## 📦 Instalación

```bash
npx expo install expo-router expo-linking expo-constants
```

---

## 🔑 Conceptos Clave

| Concepto           | Descripción                                           |
| ------------------ | ----------------------------------------------------- |
| File-based routing | Archivos en `app/` = rutas automáticas                |
| `_layout.tsx`      | Define el layout del directorio (Stack, Tabs, Drawer) |
| `[param]`          | Ruta dinámica — `app/user/[id].tsx`                   |
| `(group)`          | Grupo de rutas sin afectar la URL                     |
| `+not-found.tsx`   | Pantalla 404                                          |
| `router.push()`    | Navegar imperativamente                               |
| `<Link>`           | Navegar declarativamente                              |

---

## 📂 Estructura de Archivos

```
app/
├── _layout.tsx          ← Root layout (Stack principal)
├── index.tsx            ← Ruta: "/"
├── about.tsx            ← Ruta: "/about"
│
├── (tabs)/              ← Grupo de tabs
│   ├── _layout.tsx      ← Tab navigator
│   ├── index.tsx        ← Tab: Home
│   ├── search.tsx       ← Tab: Search
│   └── profile.tsx      ← Tab: Profile
│
├── (auth)/              ← Grupo de auth
│   ├── _layout.tsx      ← Stack sin tabs
│   ├── login.tsx        ← "/login"
│   └── register.tsx     ← "/register"
│
├── user/
│   ├── [id].tsx         ← "/user/123" (dinámico)
│   └── [id]/
│       └── posts.tsx    ← "/user/123/posts"
│
├── settings/
│   ├── _layout.tsx      ← Nested stack
│   └── index.tsx
│
└── +not-found.tsx       ← 404
```

---

## 💻 Ejemplos

### 1. Root Layout (Stack)

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0f0d23" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#0f0d23" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ title: "Perfil" }} />
      <Stack.Screen name="+not-found" options={{ title: "No encontrado" }} />
    </Stack>
  );
}
```

### 2. Tab Navigation

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7c3aed",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#1e1e2e",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: "#0f0d23" },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🔍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
```

### 3. Navegación Imperativa + Link

```tsx
// app/(tabs)/index.tsx
import { View, Text, Pressable } from "react-native";
import { Link, router } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background p-6 pt-16">
      <Text className="text-3xl font-bold text-white mb-8">Inicio</Text>

      {/* Declarativa */}
      <Link href="/about" asChild>
        <Pressable className="bg-primary p-4 rounded-xl mb-3">
          <Text className="text-white text-center font-semibold">
            Link → About
          </Text>
        </Pressable>
      </Link>

      {/* Imperativa */}
      <Pressable
        onPress={() => router.push("/user/42")}
        className="bg-surface p-4 rounded-xl mb-3 border border-primary"
      >
        <Text className="text-primary text-center font-semibold">
          router.push → User 42
        </Text>
      </Pressable>

      {/* Con params */}
      <Pressable
        onPress={() =>
          router.push({ pathname: "/user/[id]", params: { id: "99" } })
        }
        className="bg-surface p-4 rounded-xl mb-3 border border-slate-700"
      >
        <Text className="text-white text-center">router.push con params</Text>
      </Pressable>

      {/* Replace (no back) */}
      <Pressable
        onPress={() => router.replace("/(auth)/login")}
        className="bg-red-500/20 p-4 rounded-xl"
      >
        <Text className="text-red-400 text-center font-semibold">
          router.replace → Login
        </Text>
      </Pressable>
    </View>
  );
}
```

### 4. Rutas Dinámicas

```tsx
// app/user/[id].tsx
import { View, Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: `Usuario ${id}` }} />
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-4xl mb-4">👤</Text>
        <Text className="text-white text-2xl font-bold">User ID: {id}</Text>
      </View>
    </>
  );
}
```

### 5. Modals

```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen
    name="modal"
    options={{ presentation: "modal", title: "Modal" }}
  />
</Stack>;

// app/modal.tsx
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function ModalScreen() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Text className="text-white text-2xl font-bold mb-6">Modal 🎉</Text>
      <Pressable
        onPress={() => router.back()}
        className="bg-primary px-8 py-4 rounded-xl"
      >
        <Text className="text-white font-semibold">Cerrar</Text>
      </Pressable>
    </View>
  );
}
```

---

## 🔑 API de Router

| Método                   | Descripción                |
| ------------------------ | -------------------------- |
| `router.push(href)`      | Navegar (agrega al stack)  |
| `router.replace(href)`   | Navegar sin back           |
| `router.back()`          | Volver atrás               |
| `router.canGoBack()`     | Si se puede volver         |
| `router.dismiss()`       | Cerrar modal               |
| `useLocalSearchParams()` | Leer params de la ruta     |
| `useSegments()`          | Segmentos de la URL actual |
| `usePathname()`          | Ruta actual como string    |

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/router/introduction/)
- [API Reference](https://docs.expo.dev/router/reference/api/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                        | ✅ Bueno                                     |
| ---------- | ------------------------------ | -------------------------------------------- |
| Rutas      | Archivos con nombres genéricos | Nombres descriptivos que reflejen la URL     |
| Params     | Objetos grandes como params    | Solo IDs, cargar data en la pantalla destino |
| Grupos     | Todas las rutas al mismo nivel | Grupos `(auth)`, `(tabs)` para organizar     |
| Layout     | Repetir código en cada layout  | Layout compartido en `_layout.tsx` del grupo |
| Deep links | No configurar scheme           | `scheme` en `app.json` + universal links     |
| Protected  | Sin protección de rutas        | Redirect en `_layout.tsx` según auth state   |

---

## ✅ Checklist

- [ ] Entiendo file-based routing y la estructura de `app/`
- [ ] Sé crear layouts con Stack, Tabs y Drawer
- [ ] Puedo navegar con `<Link>` y `router.push/replace/back`
- [ ] Sé usar rutas dinámicas `[param]` y `useLocalSearchParams`
- [ ] Puedo crear grupos `(group)` y modales
