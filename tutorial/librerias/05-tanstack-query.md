# TanStack Query 5 (React Query)

> **Data fetching** y **server state management** — caching automático, refetch inteligente, mutations, infinite scroll.

## 📦 Instalación

```bash
npm install @tanstack/react-query@5
```

---

## 🔑 Conceptos Clave

| Concepto            | Descripción                                    |
| ------------------- | ---------------------------------------------- |
| `useQuery`          | Leer datos del servidor (GET)                  |
| `useMutation`       | Modificar datos (POST/PUT/DELETE)              |
| `useInfiniteQuery`  | Paginación infinita                            |
| `queryKey`          | Identificador único para cache                 |
| `staleTime`         | Cuánto dura el dato como "fresco"              |
| `gcTime`            | Cuánto permanece en cache después de no usarse |
| `invalidateQueries` | Forzar refetch de una query                    |

---

## 💻 Ejemplos

### Setup

```tsx
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
      retry: 2,
      refetchOnWindowFocus: false, // Desactivar en mobile
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
```

### 1. useQuery — Fetching Básico

```tsx
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

interface Post {
  id: number;
  title: string;
  body: string;
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=20",
  );
  if (!res.ok) throw new Error("Error al cargar");
  return res.json();
}

export default function PostsScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 bg-background justify-center items-center p-5">
        <Text className="text-red-400 text-lg mb-4">❌ {error.message}</Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </Pressable>
      </View>
    );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-3"
      onRefresh={refetch}
      refreshing={isRefetching}
      renderItem={({ item }) => (
        <View className="bg-surface rounded-xl p-4">
          <Text className="text-white font-semibold">{item.title}</Text>
          <Text className="text-slate-400 text-sm mt-2" numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      )}
    />
  );
}
```

### 2. useMutation — Crear/Actualizar/Eliminar

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: { title: string; body: string }) => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Error al crear");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refetch automático
      Alert.alert("✅ Post creado");
    },
    onError: (error) => {
      Alert.alert("❌ Error", error.message);
    },
  });
}

// Uso:
// const { mutate, isPending } = useCreatePost();
// mutate({ title: 'Nuevo', body: 'Contenido' });
```

### 3. useInfiniteQuery — Infinite Scroll

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlatList, View, Text, ActivityIndicator } from "react-native";

async function fetchPostsPage({ pageParam = 1 }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
  );
  const data = await res.json();
  return { data, nextPage: data.length === 10 ? pageParam + 1 : undefined };
}

export default function InfinitePostsList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["posts", "infinite"],
      queryFn: fetchPostsPage,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FlatList
      data={allPosts}
      keyExtractor={(item) => String(item.id)}
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-3"
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color="#7c3aed" className="py-4" />
        ) : null
      }
      renderItem={({ item }) => (
        <View className="bg-surface rounded-xl p-4">
          <Text className="text-white font-semibold">{item.title}</Text>
        </View>
      )}
    />
  );
}
```

### 4. Custom Hook con Query

```tsx
// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  email: string;
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async (): Promise<User> => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
      );
      if (!res.ok) throw new Error("Usuario no encontrado");
      return res.json();
    },
    enabled: id > 0, // Solo ejecutar si hay id válido
  });
}
```

---

## 🔗 Links

- [Documentación oficial](https://tanstack.com/query/latest)
- [GitHub](https://github.com/TanStack/query)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica  | ❌ Malo                              | ✅ Bueno                                                |
| --------- | ------------------------------------ | ------------------------------------------------------- |
| staleTime | `0` (refetch en cada mount)          | `5 * 60 * 1000` (5min) para datos que no cambian rápido |
| Keys      | `['data']` genérica                  | `['users', userId, { role }]` jerárquica y descriptiva  |
| Prefetch  | Esperar a que el user navegue        | `queryClient.prefetchQuery()` en hover/focus            |
| Mutations | Esperar respuesta para actualizar UI | Optimistic updates con `onMutate`                       |
| Error     | Retry infinito                       | `retry: 3` con `retryDelay: exponentialBackoff`         |
| Global    | Sin default options                  | Configurar `defaultOptions` en `QueryClient`            |

---

## ✅ Checklist

- [ ] Sé configurar QueryClient y Provider
- [ ] Puedo usar `useQuery` con loading/error/data
- [ ] Sé hacer mutations con `useMutation`
- [ ] Entiendo `invalidateQueries` para refetch automático
- [ ] Puedo implementar infinite scroll con `useInfiniteQuery`
- [ ] Entiendo `staleTime`, `gcTime` y estrategias de cache
