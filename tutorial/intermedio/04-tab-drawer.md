# 04 — Tab Navigation & Drawer

## 🎯 Objetivo

Implementar navegación avanzada con **Tabs** y **Drawer** usando Expo Router, combinándolos con Stack navigation.

---

## 📚 Teoría

### Tipos de Navegación en Expo Router

| Tipo       | Carpeta          | Uso                       |
| ---------- | ---------------- | ------------------------- |
| **Stack**  | `app/` (default) | Pantallas apiladas        |
| **Tabs**   | `app/(tabs)/`    | Barra inferior con íconos |
| **Drawer** | `app/(drawer)/`  | Menú lateral deslizable   |

### Instalación

```bash
npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

---

## 💻 Código Práctico

### Ejemplo 1: Tab Navigation

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7c3aed",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopColor: "#1e293b",
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

```tsx
// app/(tabs)/index.tsx
import { View, Text } from "react-native";

export default function HomeTab() {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-3xl mb-2">🏠</Text>
      <Text className="text-2xl font-bold text-white">Inicio</Text>
      <Text className="text-slate-400 mt-2">Tab con NativeWind</Text>
    </View>
  );
}
```

### Ejemplo 2: Drawer Navigation

```tsx
// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: "#7c3aed",
          drawerInactiveTintColor: "#94a3b8",
          drawerStyle: { backgroundColor: "#0a0a0a", width: 280 },
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTintColor: "#fff",
        }}
      >
        <Drawer.Screen name="index" options={{ title: "🏠 Inicio" }} />
        <Drawer.Screen
          name="settings"
          options={{ title: "⚙️ Configuración" }}
        />
        <Drawer.Screen name="about" options={{ title: "ℹ️ Acerca de" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
```

```tsx
// app/(drawer)/settings.tsx
import { View, Text, Pressable } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background p-5">
      <Text className="text-2xl font-bold text-white mb-6">
        ⚙️ Configuración
      </Text>

      {["Notificaciones", "Tema", "Idioma", "Privacidad"].map((item) => (
        <Pressable
          key={item}
          className="bg-surface rounded-xl p-4 mb-3 flex-row justify-between items-center
                     active:opacity-80"
        >
          <Text className="text-white text-base">{item}</Text>
          <Text className="text-slate-500">›</Text>
        </Pressable>
      ))}
    </View>
  );
}
```

### Ejemplo 3: Tabs + Stack Combinados

```
app/
├── (tabs)/
│   ├── _layout.tsx        ← Tab navigator
│   ├── index.tsx           ← Home tab
│   ├── search.tsx          ← Search tab
│   └── profile.tsx         ← Profile tab
├── post/
│   └── [id].tsx            ← Stack screen (detalle)
└── _layout.tsx             ← Stack root
```

```tsx
// app/_layout.tsx — Root Stack con Tabs anidados
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="post/[id]"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: App con 4 Tabs

Crea tabs: Inicio, Explorar, Favoritos, Perfil. Cada tab con ícono y contenido.

### Ejercicio 2: Drawer con Perfil

Drawer con header que muestra avatar, nombre y email. Menú con 5 opciones.

### Ejercicio 3: Tabs + Stack + Drawer

Combina los 3 tipos de navegación en una sola app.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica      | ❌ Malo                         | ✅ Bueno                                             |
| ------------- | ------------------------------- | ---------------------------------------------------- |
| Tabs          | Más de 5 tabs en Bottom Tab     | 3-5 tabs máximo, usar Drawer para más opciones       |
| Lazy loading  | Todas las tabs cargan al inicio | `lazy: true` en screenOptions                        |
| Icons         | Imágenes como iconos            | `@expo/vector-icons` o SVG                           |
| Badge         | Re-render de todo el tab bar    | Badge solo en el tab que cambia                      |
| Header        | Header diferente por tab        | `screenOptions` con función `({ route }) => ({...})` |
| Drawer + Tabs | Drawer dentro de Tabs           | Tabs dentro de Drawer (Drawer es el navegador padre) |

### Optimización de Tab Navigator

```tsx
<Tabs
  screenOptions={{
    lazy: true, // ✅ Solo cargar tab cuando se visite
    tabBarHideOnKeyboard: true, // ✅ Ocultar tab bar con teclado
    freezeOnBlur: true, // ✅ Congelar tabs inactivas (performance)
  }}
/>
```

### Estructura de Navegación Recomendada

```
RootLayout (Stack)
├── (auth)
│   ├── login
│   └── register
├── (main) (Drawer)
│   └── (tabs)
│       ├── home
│       ├── search
│       └── profile
└── modal
```

---

## ✅ Checklist

- [ ] Sé crear Tab navigation con Expo Router
- [ ] Puedo personalizar la tab bar con estilos y colores
- [ ] Sé implementar Drawer navigation
- [ ] Puedo combinar Tabs + Stack navigation
- [ ] Entiendo la estructura de carpetas de Expo Router
