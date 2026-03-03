# 02 — Fetch API & Axios

## 🎯 Objetivo

Consumir **APIs REST** con `fetch` nativo y `axios`. Manejar estados de carga, errores, interceptors y cancelación.

---

## 📚 Teoría

### fetch vs axios

| Característica | fetch (nativo)           | axios                             |
| -------------- | ------------------------ | --------------------------------- |
| Instalación    | Incluido                 | `npm install axios`               |
| JSON parsing   | Manual (`.json()`)       | Automático                        |
| Interceptors   | ❌                       | ✅                                |
| Timeout        | Manual (AbortController) | Nativo (`timeout: 5000`)          |
| Error handling | Solo errores de red      | Status codes ≥ 400                |
| Cancelación    | `AbortController`        | `CancelToken` / `AbortController` |

---

## 💻 Código Práctico

### Ejemplo 1: Fetch con Estados (Loading/Error/Data)

```tsx
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=20",
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text className="text-slate-400 mt-4">Cargando posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-5">
        <Text className="text-5xl mb-4">❌</Text>
        <Text className="text-red-400 text-lg text-center mb-4">{error}</Text>
        <Pressable
          onPress={fetchPosts}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => String(item.id)}
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-3"
      onRefresh={fetchPosts}
      refreshing={loading}
      renderItem={({ item }) => (
        <View className="bg-surface rounded-xl p-4">
          <Text className="text-primary text-xs font-mono mb-2">
            Post #{item.id}
          </Text>
          <Text className="text-white font-semibold text-base mb-2">
            {item.title}
          </Text>
          <Text className="text-slate-400 text-sm leading-5" numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      )}
    />
  );
}
```

### Ejemplo 2: Axios con Interceptors

```tsx
import axios from "axios";

// Crear instancia configurada
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de request — agregar token
api.interceptors.request.use((config) => {
  // const token = await getToken();
  // config.headers.Authorization = `Bearer ${token}`;
  console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Interceptor de response — manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 No autorizado — redirigir a login");
    }
    return Promise.reject(error);
  },
);

export default api;
```

### Ejemplo 3: POST con Feedback Visual

```tsx
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import api from "./api";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/posts", { title, body, userId: 1 });
      Alert.alert("✅ Éxito", `Post creado con ID: ${data.id}`);
      setTitle("");
      setBody("");
    } catch (err) {
      Alert.alert("❌ Error", "No se pudo crear el post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">Nuevo Post</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        placeholderTextColor="#475569"
        className="bg-surface rounded-xl p-4 text-white text-base border border-slate-700 mb-3"
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Contenido"
        placeholderTextColor="#475569"
        multiline
        numberOfLines={4}
        className="bg-surface rounded-xl p-4 text-white text-base border border-slate-700 mb-6 min-h-[120px]"
        textAlignVertical="top"
      />
      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        className={`py-4 rounded-xl items-center ${submitting ? "bg-primary/50" : "bg-primary active:opacity-80"}`}
      >
        <Text className="text-white font-semibold text-base">
          {submitting ? "⏳ Enviando..." : "📤 Publicar"}
        </Text>
      </Pressable>
    </View>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Listado + Detalle

Fetch de posts. Al tocar uno, navegar a `/post/[id]` y hacer fetch del detalle.

### Ejercicio 2: CRUD Completo

Implementa crear, leer, actualizar y eliminar posts con feedback visual.

### Ejercicio 3: Infinite Scroll

Cargar posts de 10 en 10. Al llegar al final, cargar más (`onEndReached`).

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                           | ✅ Bueno                                  |
| -------- | --------------------------------- | ----------------------------------------- |
| Loading  | No manejar loading state          | Skeleton/spinner mientras carga           |
| Errores  | `catch(() => {})` silencioso      | Mostrar error al usuario con retry        |
| Cache    | Cada navegación re-fetcha         | TanStack Query con `staleTime`            |
| Tipado   | Respuesta sin tipo (`any`)        | Interfaces TypeScript para cada respuesta |
| URLs     | API URL hardcodeada en cada fetch | Instancia centralizada de axios/fetch     |
| Timeout  | Sin timeout                       | `AbortController` con `setTimeout`        |

### Patrón Robusto de Fetching

```tsx
// ✅ Hook reutilizable con estados completos
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

### Recomendación para Producción

```
Datos simples + aprendizaje → fetch + useEffect
Producción → TanStack Query (cache, retry, dedup, prefetch, pagination)
```

---

## ✅ Checklist

- [ ] Sé hacer fetch con estados loading/error/data
- [ ] Puedo configurar axios con interceptors
- [ ] Sé hacer POST con feedback visual
- [ ] Entiendo cancelación con AbortController
- [ ] Puedo implementar pull-to-refresh con API data
