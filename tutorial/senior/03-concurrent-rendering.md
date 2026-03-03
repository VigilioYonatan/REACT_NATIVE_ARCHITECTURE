# 03 — Concurrent Rendering & Suspense

## 🎯 Objetivo

Dominar las features de **React 19** en React Native: `useTransition`, `useDeferredValue`, `Suspense`.

---

## 📚 Teoría

### ¿Qué es Concurrent Rendering?

React puede **interrumpir** renderizados no urgentes para priorizar los urgentes (input, gestos).

```
SIN Concurrent:  [===== render largo =====] → UI bloqueada 🔴
CON Concurrent:  [== render ==][toque!][== continúa ==] → UI fluida 🟢
```

### Prioridades

| Prioridad     | Ejemplo             | API                      |
| ------------- | ------------------- | ------------------------ |
| 🔴 Urgente    | Input, toques       | Actualizaciones normales |
| 🟡 Transición | Filtrar lista larga | `useTransition`          |
| 🟢 Diferida   | Preview de búsqueda | `useDeferredValue`       |

---

## 💻 Código Práctico

### Ejemplo 1: useTransition — Búsqueda sin Bloquear

```tsx
import { View, Text, TextInput, FlatList } from "react-native";
import { useState, useTransition, useMemo } from "react";

const HUGE_LIST = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i),
  name: `Item ${i} — ${["React", "Native", "Expo", "TypeScript", "Hermes"][i % 5]}`,
}));

export default function TransitionDemo() {
  const [query, setQuery] = useState("");
  const [filteredQuery, setFilteredQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (text: string) => {
    setQuery(text); // ✅ Urgente — input responde al instante
    startTransition(() => {
      setFilteredQuery(text); // 🟡 Transición — puede interrumpirse
    });
  };

  const filtered = useMemo(
    () =>
      HUGE_LIST.filter((item) =>
        item.name.toLowerCase().includes(filteredQuery.toLowerCase()),
      ),
    [filteredQuery],
  );

  return (
    <View className="flex-1 bg-background p-4 pt-16">
      <TextInput
        value={query}
        onChangeText={handleSearch}
        placeholder="Buscar en 10,000 items..."
        placeholderTextColor="#475569"
        className="bg-surface rounded-xl p-3.5 text-white text-base border border-slate-700 mb-2"
      />
      {isPending && (
        <View className="bg-primary/10 p-2 rounded-lg mb-2">
          <Text className="text-primary/70 text-center text-sm">
            ⏳ Filtrando...
          </Text>
        </View>
      )}
      <Text className="text-slate-500 text-sm mb-2">
        {filtered.length} resultados
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        style={{ opacity: isPending ? 0.6 : 1 }}
        renderItem={({ item }) => (
          <View className="py-3.5 px-4 border-b border-slate-800 h-[50px] justify-center">
            <Text className="text-slate-200 text-base">{item.name}</Text>
          </View>
        )}
        getItemLayout={(_, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
        maxToRenderPerBatch={30}
        windowSize={10}
      />
    </View>
  );
}
```

### Ejemplo 2: useDeferredValue

```tsx
import { View, Text, TextInput } from "react-native";
import { useState, useDeferredValue, useMemo } from "react";

function HeavyPreview({ text }: { text: string }) {
  const rendered = useMemo(() => {
    const start = Date.now();
    while (Date.now() - start < 50) {} // Simular 50ms procesamiento
    return text.split("").map((char, i) => (
      <Text
        key={i}
        style={{ color: `hsl(${i * 30}, 80%, 60%)` }}
        className="text-2xl font-bold"
      >
        {char}
      </Text>
    ));
  }, [text]);
  return <View className="flex-row flex-wrap">{rendered}</View>;
}

export default function DeferredDemo() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  const isStale = text !== deferredText;

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-1">
        useDeferredValue
      </Text>
      <Text className="text-slate-500 mb-6">
        Escribe rápido — el input no se traba
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Escribe algo..."
        placeholderTextColor="#475569"
        className="bg-surface rounded-xl p-3.5 text-white text-base border border-slate-700 mb-6"
      />
      <View
        className={`bg-surface rounded-xl p-5 min-h-[100px] ${isStale ? "opacity-50" : ""}`}
      >
        <Text className="text-slate-500 text-xs mb-3">
          Preview {isStale ? "(actualizando...)" : "(actualizado)"}
        </Text>
        <HeavyPreview text={deferredText} />
      </View>
    </View>
  );
}
```

### Ejemplo 3: Suspense con Data Fetching

```tsx
import { View, Text, ActivityIndicator, Suspense } from "react-native";

function createResource<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: Error;
  const suspender = promise.then(
    (data) => {
      status = "success";
      result = data;
    },
    (err) => {
      status = "error";
      error = err;
    },
  );
  return {
    read(): T {
      if (status === "pending") throw suspender;
      if (status === "error") throw error;
      return result;
    },
  };
}

const usersResource = createResource(
  fetch("https://jsonplaceholder.typicode.com/users").then((r) => r.json()),
);

function UserList() {
  const users = usersResource.read();
  return (
    <View>
      {users.map((user: any) => (
        <View key={user.id} className="bg-surface rounded-xl p-4 mb-2">
          <Text className="text-white font-semibold">{user.name}</Text>
          <Text className="text-primary text-sm mt-1">{user.email}</Text>
        </View>
      ))}
    </View>
  );
}

export default function SuspenseDemo() {
  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-3xl font-bold text-white mb-6">Suspense Demo</Text>
      <Suspense
        fallback={
          <View className="items-center pt-16">
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text className="text-slate-400 mt-3">Cargando usuarios...</Text>
          </View>
        }
      >
        <UserList />
      </Suspense>
    </View>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Tabs con Transiciones

Cambiar de tab usa `startTransition`. Tab anterior semi-opaco mientras carga.

### Ejercicio 2: Autocomplete Diferido

5000 opciones. `useDeferredValue` para que sugerencias no bloqueen teclado.

### Ejercicio 3: Skeleton + Suspense

Skeleton loading con `Suspense` boundaries anidados.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica    | ❌ Malo                               | ✅ Bueno                                  |
| ----------- | ------------------------------------- | ----------------------------------------- |
| Transitions | Bloquear UI en cada cambio de estado  | `useTransition` para updates no urgentes  |
| Suspense    | Un solo fallback grande               | Múltiples Suspense boundaries granulares  |
| Deferred    | Re-renderizar lista en cada keystroke | `useDeferredValue` para input → lista     |
| Loading     | Spinner genérico                      | Skeleton screens que simulen el contenido |
| Waterfall   | Peticiones secuenciales en Suspense   | Parallel fetching con prefetch            |

### Cuándo usar Concurrent Features

```
useTransition     → Navegación entre tabs, filtros pesados, búsqueda
useDeferredValue  → Input + lista grande, autocomplete, preview
Suspense          → Lazy loading de componentes, data fetching
startTransition   → Updates imperativas de baja prioridad
```

---

## ✅ Checklist

- [ ] Entiendo Concurrent Rendering y por qué mejora UX
- [ ] Sé usar `useTransition` para actualizaciones no-urgentes
- [ ] Entiendo `useDeferredValue` y cuándo usarlo
- [ ] Puedo implementar `Suspense` con fallbacks
- [ ] Entiendo urgente vs transición vs diferido
