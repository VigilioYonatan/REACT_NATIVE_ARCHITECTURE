# 06 — Performance & Memoización

## 🎯 Objetivo

Optimizar rendimiento con `React.memo`, `useMemo`, `useCallback` y tuning de `FlatList` para evitar **re-renders innecesarios**.

---

## 📚 Teoría

### ¿Por qué se re-renderiza un componente?

1. Su **estado** cambió
2. Su **padre se re-renderizó** (incluso si las props no cambiaron)
3. Un **Context** que consume cambió

### Herramientas

| Herramienta       | Qué optimiza                          | Cuándo                       |
| ----------------- | ------------------------------------- | ---------------------------- |
| `React.memo`      | Evita re-render si props no cambiaron | Hijos costosos               |
| `useMemo`         | Memoriza valor computado              | Cálculos costosos            |
| `useCallback`     | Memoriza función                      | Funciones pasadas como props |
| `FlatList` tuning | Virtualiza listas                     | Listas >20 items             |

> ⚠️ **No optimizar prematuramente**. Solo memoizar con problemas medibles.

---

## 💻 Código Práctico

### Ejemplo 1: React.memo

```tsx
import { View, Text, Pressable } from "react-native";
import { useState, memo } from "react";

const ExpensiveChild = memo(function ExpensiveChild({
  name,
}: {
  name: string;
}) {
  console.log(`🔄 Renderizando: ${name}`);
  return (
    <View className="bg-surface rounded-xl p-5 mt-4">
      <Text className="text-white text-lg font-semibold">Hijo: {name}</Text>
      <Text className="text-slate-500 mt-1">
        {Array.from({ length: 100 }, (_, i) => i).reduce((a, b) => a + b, 0)}
      </Text>
    </View>
  );
});

export default function MemoDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Ana");

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">
        React.memo Demo
      </Text>

      <Pressable
        onPress={() => setCount((p) => p + 1)}
        className="bg-primary p-4 rounded-xl mb-3 items-center"
      >
        <Text className="text-white font-semibold">Count: {count}</Text>
      </Pressable>

      <Pressable
        onPress={() => setName((p) => (p === "Ana" ? "Carlos" : "Ana"))}
        className="bg-slate-700 p-4 rounded-xl items-center"
      >
        <Text className="text-white font-semibold">Cambiar nombre</Text>
      </Pressable>

      <ExpensiveChild name={name} />
    </View>
  );
}
```

### Ejemplo 2: useMemo & useCallback con FlatList

```tsx
import { View, Text, FlatList, TextInput, Pressable } from "react-native";
import { useState, useMemo, useCallback, memo } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

const PRODUCTS: Product[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Producto ${i} — ${["Tech", "Ropa", "Hogar", "Deporte"][i % 4]}`,
  price: Math.floor(Math.random() * 1000) + 10,
}));

const ProductItem = memo(function ProductItem({
  item,
  onPress,
}: {
  item: Product;
  onPress: (id: number) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      className="flex-row justify-between p-4 border-b border-slate-800 h-[60px]"
    >
      <Text className="text-slate-200 text-base">{item.name}</Text>
      <Text className="text-green-400 font-semibold">${item.price}</Text>
    </Pressable>
  );
});

export default function OptimizedList() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const stats = useMemo(
    () => ({
      total: filtered.length,
      avg:
        filtered.length > 0
          ? Math.round(
              filtered.reduce((s, p) => s + p.price, 0) / filtered.length,
            )
          : 0,
    }),
    [filtered],
  );

  const handlePress = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  return (
    <View className="flex-1 bg-background p-4 pt-16">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar..."
        placeholderTextColor="#475569"
        className="bg-surface rounded-xl p-3.5 text-white border border-slate-700 mb-3"
      />
      <Text className="text-primary text-sm mb-3">
        {stats.total} productos | Promedio: ${stats.avg}
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductItem item={item} onPress={handlePress} />
        )}
        getItemLayout={(_, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews
        initialNumToRender={15}
      />
    </View>
  );
}
```

---

## 🔑 Resumen

```tsx
const Child = memo(({ data }) => <Text>{data}</Text>);
const sorted = useMemo(() => expensiveSort(list), [list]);
const handler = useCallback((id) => setSelected(id), []);

<FlatList
  getItemLayout={...}        // Evita medir
  maxToRenderPerBatch={20}   // Items por batch
  windowSize={10}            // Ventana virtual
  removeClippedSubviews      // Recicla
  initialNumToRender={15}    // Render inicial
/>
```

---

## 📝 Ejercicios

### Ejercicio 1: Lista de 10K Items

10K contactos. Mide FPS sin vs con `memo` + `useCallback` + `getItemLayout`.

### Ejercicio 2: Dashboard Estadísticas

4 cards (sum, avg, min, max). `useMemo` para recalcular solo la afectada.

### Ejercicio 3: Profiling

Usa React DevTools Profiler para identificar re-renders innecesarios y optimiza.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                   | ✅ Bueno                                                     |
| ---------- | ------------------------- | ------------------------------------------------------------ |
| Re-renders | `React.memo` en todo      | Solo en componentes pesados que se re-renderizan sin cambios |
| Imágenes   | `Image` de RN             | `expo-image` (cache, blurhash, lazy loading)                 |
| Listas     | `FlatList` sin optimizar  | `FlashList` + `estimatedItemSize`                            |
| Bundle     | Importar toda la librería | Tree shaking + lazy imports `React.lazy()`                   |
| Profiling  | "Se siente lento"         | Medir con Flipper / React DevTools Profiler                  |
| Hermes     | Motor JS viejo            | Hermes habilitado (default en RN 0.83)                       |

### Checklist de Performance Audit

```
1. ¿Imágenes optimizadas? → expo-image con cachePolicy
2. ¿Listas virtualizadas? → FlashList > FlatList > ScrollView
3. ¿Re-renders innecesarios? → React DevTools Profiler
4. ¿Animaciones en UI thread? → Reanimated worklets
5. ¿Bundle size? → npx expo export --analyze
6. ¿Fonts cargadas? → expo-font con SplashScreen
7. ¿Hermes habilitado? → Verificar en Settings > Apps
8. ¿Network optimizado? → TanStack Query cache + staleTime
```

### Herramientas de Profiling

```
React DevTools Profiler → Identificar re-renders
Flipper                 → Network, Layout, DB inspector
expo export --analyze    → Bundle size analysis
console.time()          → Medir operaciones específicas
why-did-you-render      → Detectar re-renders innecesarios
```

---

## ✅ Checklist

- [ ] Entiendo cuándo y por qué un componente se re-renderiza
- [ ] Sé usar `React.memo` para hijos costosos
- [ ] Entiendo `useMemo` para valores computados
- [ ] Entiendo `useCallback` para funciones estables
- [ ] Conozco las props de rendimiento de `FlatList`
