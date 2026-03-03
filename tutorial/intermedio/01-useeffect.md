# 01 — useEffect & Ciclo de Vida

## 🎯 Objetivo

Dominar el hook `useEffect` para manejar **efectos secundarios**: timers, suscripciones, llamadas API y cleanup.

---

## 📚 Teoría

### ¿Qué es un Efecto Secundario?

Todo lo que ocurre **fuera del renderizado**: fetch de datos, timers, suscripciones, escribir en storage.

### Anatomía de useEffect

```tsx
useEffect(() => {
  // 1. EFECTO — se ejecuta después del render
  const timer = setInterval(() => console.log("tick"), 1000);

  // 2. CLEANUP — se ejecuta antes del siguiente efecto o al desmontar
  return () => clearInterval(timer);
}, [dependency]); // 3. DEPENDENCIAS — cuándo re-ejecutar
```

### Cuándo se Ejecuta

| Dependencias                            | Comportamiento           |
| --------------------------------------- | ------------------------ |
| Sin array: `useEffect(() => {})`        | Cada render (⚠️ evitar)  |
| Array vacío: `useEffect(() => {}, [])`  | Solo al montar (1 vez)   |
| Con deps: `useEffect(() => {}, [a, b])` | Cuando `a` o `b` cambian |

---

## 💻 Código Práctico

### Ejemplo 1: Timer con Cleanup

```tsx
import { View, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup: limpiar el timer al pausar o desmontar
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-7xl font-bold text-white mb-12 tracking-wider">
        {formatTime(seconds)}
      </Text>
      <View className="flex-row gap-4">
        <Pressable
          onPress={() => setIsRunning((p) => !p)}
          className={`px-8 py-4 rounded-2xl ${isRunning ? "bg-red-500" : "bg-green-500"}`}
        >
          <Text className="text-white text-lg font-semibold">
            {isRunning ? "⏸ Pausar" : "▶ Iniciar"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsRunning(false);
            setSeconds(0);
          }}
          className="bg-slate-700 px-8 py-4 rounded-2xl"
        >
          <Text className="text-white text-lg font-semibold">🔄 Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### Ejemplo 2: Fetch al Montar

```tsx
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false);
      });

    return () => controller.abort(); // Cleanup
  }, []); // [] = solo al montar

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-3"
      renderItem={({ item }) => (
        <View className="bg-surface rounded-xl p-4 border-l-4 border-primary">
          <Text className="text-white font-semibold text-base">
            {item.name}
          </Text>
          <Text className="text-slate-400 text-sm mt-1">{item.email}</Text>
        </View>
      )}
    />
  );
}
```

### Ejemplo 3: Reaccionar a Cambios de Dependencia

```tsx
import { View, Text, TextInput, FlatList } from "react-native";
import { useState, useEffect } from "react";

export default function SearchWithEffect() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Se ejecuta cada vez que query cambia (con debounce)
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users?q=${query}`,
      );
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar usuarios..."
        placeholderTextColor="#475569"
        className="bg-surface rounded-xl p-4 text-white text-base border border-slate-700 mb-4"
      />
      {loading && <ActivityIndicator color="#7c3aed" className="my-4" />}
      <FlatList
        data={results}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: any) => (
          <Text className="text-white py-3 border-b border-slate-800">
            {item.name}
          </Text>
        )}
      />
    </View>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Reloj Digital

Muestra la hora actual HH:MM:SS actualizada cada segundo. Cleanup al desmontar.

### Ejercicio 2: Detector de Conexión

Usa `useEffect` + `NetInfo` para mostrar si hay internet o no, con un banner animado.

### Ejercicio 3: Auto-Save

Un TextInput que guarda en AsyncStorage 2 segundos después de dejar de escribir (debounce con cleanup).

---

## 🏆 Buenas Prácticas y Optimización

| Práctica           | ❌ Malo                             | ✅ Bueno                                           |
| ------------------ | ----------------------------------- | -------------------------------------------------- |
| Dependencias       | `useEffect(() => {...})` sin array  | Siempre especificar `[]` o `[deps]`                |
| Cleanup            | No limpiar timers/subscriptions     | `return () => cleanup()` en el useEffect           |
| Fetch              | No cancelar peticiones al desmontar | `AbortController` o flag `isMounted`               |
| Dependencias extra | `[obj]` que cambia cada render      | Desestructurar: `[obj.id, obj.name]`               |
| Funciones          | Función dentro de dependencias      | `useCallback` o mover la función dentro del effect |
| Datos              | `useEffect` + `useState` para fetch | TanStack Query (cache, retry, dedup automático)    |

### Evitar Race Conditions

```tsx
useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    const res = await fetch(`/api/user/${id}`);
    const data = await res.json();
    if (!cancelled) setUser(data); // ✅ Solo actualizar si el efecto sigue vigente
  };
  fetchData();

  return () => {
    cancelled = true;
  }; // ✅ Cancelar si id cambia antes de que responda
}, [id]);

// ✅ Aún mejor: AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/user/${id}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUser)
    .catch(() => {});
  return () => controller.abort();
}, [id]);
```

### Regla de Oro

```
Si algo se puede calcular durante el render → NO uses useEffect
useEffect es para SINCRONIZAR con sistemas externos (APIs, timers, DOM)
```

---

## ✅ Checklist

- [ ] Entiendo cuándo usar `useEffect` y para qué
- [ ] Sé la diferencia entre `[]`, `[dep]` y sin array
- [ ] Siempre implemento cleanup functions cuando es necesario
- [ ] Sé cancelar fetch con `AbortController`
- [ ] Puedo implementar debounce con useEffect + cleanup
