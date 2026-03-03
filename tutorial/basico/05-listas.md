# 05 — FlatList & ScrollView

## 🎯 Objetivo

Dominar la renderización de **listas largas** con `FlatList` y `SectionList`, entender cuándo usar `ScrollView` y optimizar el rendimiento.

---

## 📚 Teoría

### ScrollView vs FlatList

| Característica    | ScrollView                   | FlatList                         |
| ----------------- | ---------------------------- | -------------------------------- |
| Renderiza         | **Todos** los hijos de golpe | Solo los **visibles** (lazy)     |
| Performance       | ❌ Lento con muchos items    | ✅ Optimizado para listas largas |
| Cuándo usar       | Pocos elementos (<20)        | Muchos elementos o dinámicos     |
| Scroll horizontal | `horizontal` prop            | `horizontal` prop                |

> ⚠️ **Regla**: Si tienes más de ~20 items, **siempre** usa `FlatList`. `ScrollView` renderiza todo en memoria.

### FlatList — Props Esenciales

| Prop                     | Tipo                       | Descripción                       |
| ------------------------ | -------------------------- | --------------------------------- |
| `data`                   | `T[]`                      | Array de datos                    |
| `renderItem`             | `({ item, index }) => JSX` | Cómo renderizar cada item         |
| `keyExtractor`           | `(item, index) => string`  | ID único para cada item           |
| `ListHeaderComponent`    | `JSX`                      | Header de la lista                |
| `ListFooterComponent`    | `JSX`                      | Footer de la lista                |
| `ListEmptyComponent`     | `JSX`                      | Cuando `data` está vacío          |
| `ItemSeparatorComponent` | `JSX`                      | Separador entre items             |
| `numColumns`             | `number`                   | Grid de N columnas                |
| `onEndReached`           | `() => void`               | Scroll infinito                   |
| `onEndReachedThreshold`  | `number`                   | Cuánto antes dispara onEndReached |
| `refreshing`             | `boolean`                  | Pull-to-refresh activo            |
| `onRefresh`              | `() => void`               | Handler del pull-to-refresh       |

---

## 💻 Código Práctico

### Ejemplo 1: FlatList Básica con Pull-to-Refresh

```tsx
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useState, useCallback } from "react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
}

const CONTACTS: Contact[] = [
  { id: "1", name: "Ana García", avatar: "👩‍💻", status: "online" },
  { id: "2", name: "Carlos López", avatar: "👨‍🎨", status: "offline" },
  { id: "3", name: "María Torres", avatar: "👩‍🔬", status: "online" },
  { id: "4", name: "Diego Ruiz", avatar: "👨‍🚀", status: "online" },
  { id: "5", name: "Laura Moreno", avatar: "👩‍🎤", status: "offline" },
  { id: "6", name: "Pedro Sánchez", avatar: "👨‍🍳", status: "offline" },
];

export default function ContactList() {
  const [refreshing, setRefreshing] = useState(false);
  const [contacts, setContacts] = useState(CONTACTS);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setContacts([...CONTACTS].sort(() => Math.random() - 0.5)); // shuffle
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.contactRow}>
      <Text style={styles.avatar}>{item.avatar}</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text
          style={[styles.status, item.status === "online" && styles.online]}
        >
          {item.status === "online" ? "🟢 En línea" : "⚫ Desconectado"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7c3aed"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Text style={styles.header}>Contactos ({contacts.length})</Text>
        }
        ListEmptyComponent={<Text style={styles.empty}>No hay contactos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  avatar: { fontSize: 36, marginRight: 16 },
  contactInfo: { flex: 1 },
  name: { fontSize: 17, fontWeight: "600", color: "#e2e8f0" },
  status: { fontSize: 13, color: "#64748b", marginTop: 2 },
  online: { color: "#22c55e" },
  separator: { height: 1, backgroundColor: "#1e293b", marginLeft: 72 },
  empty: { color: "#64748b", textAlign: "center", padding: 40, fontSize: 16 },
});
```

### Ejemplo 2: Grid con numColumns

```tsx
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 2;
const GAP = 12;
const ITEM_WIDTH = (width - 20 * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

const PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: `Producto ${i + 1}`,
  price: Math.floor(Math.random() * 100) + 10,
  emoji: ["👟", "👜", "⌚", "🎧", "📱", "💻"][i % 6],
}));

export default function ProductGrid() {
  return (
    <FlatList
      style={styles.container}
      data={PRODUCTS}
      numColumns={NUM_COLUMNS}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<Text style={styles.title}>🛍️ Tienda</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  content: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  row: { gap: GAP, marginBottom: GAP },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: "#1e1e2e",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  emoji: { fontSize: 40, marginBottom: 12 },
  name: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  price: { color: "#7c3aed", fontSize: 20, fontWeight: "bold", marginTop: 8 },
});
```

### Ejemplo 3: SectionList

```tsx
import { View, Text, SectionList, StyleSheet } from "react-native";

const SECTIONS = [
  {
    title: "🟢 Básico",
    data: [
      "View & Text",
      "StyleSheet",
      "useState",
      "TextInput",
      "FlatList",
      "Navegación",
    ],
  },
  {
    title: "🟡 Intermedio",
    data: [
      "useEffect",
      "Fetch API",
      "Context",
      "Tabs",
      "AsyncStorage",
      "Animaciones",
    ],
  },
  {
    title: "🔴 Senior",
    data: ["Fabric", "TurboModules", "JSI", "CI/CD", "Testing"],
  },
];

export default function SectionListDemo() {
  return (
    <SectionList
      style={styles.container}
      sections={SECTIONS}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text style={styles.itemNumber}>
            {String(index + 1).padStart(2, "0")}
          </Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      )}
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  sectionHeader: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingLeft: 20,
    gap: 12,
  },
  itemNumber: { color: "#7c3aed", fontSize: 14, fontWeight: "bold", width: 24 },
  itemText: { color: "#e2e8f0", fontSize: 16 },
});
```

---

## 📝 Ejercicios

### Ejercicio 1: Lista de Chat (WhatsApp-style)

FlatList con avatar, nombre, último mensaje, hora y badge de mensajes no leídos.

### Ejercicio 2: Galería de Fotos en Grid

FlatList con `numColumns={3}`, imágenes placeholder, pull-to-refresh para shuffle.

### Ejercicio 3: Lista con Scroll Infinito

Implementa `onEndReached` para cargar 10 items más al llegar al final.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica          | ❌ Malo                     | ✅ Bueno                                       |
| ----------------- | --------------------------- | ---------------------------------------------- |
| Listas largas     | `ScrollView` + `.map()`     | `FlatList` (virtualización automática)         |
| Keys              | `key={index}`               | `key={item.id}` (ID único y estable)           |
| renderItem        | Componente inline complejo  | Extraer a componente separado con `React.memo` |
| Imágenes en lista | Imágenes sin cache          | `expo-image` con `cachePolicy="memory-disk"`   |
| Separadores       | `marginBottom` en cada item | `ItemSeparatorComponent`                       |
| Listas vacías     | No manejar estado vacío     | `ListEmptyComponent` para feedback visual      |

### Optimización de FlatList

```tsx
// ✅ Rendimiento óptimo
<FlatList
  data={items}
  keyExtractor={(item) => item.id} // Siempre IDs estables
  renderItem={renderItem} // Función fuera del render
  getItemLayout={(_, index) => ({
    // Skip layout calculation
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  maxToRenderPerBatch={10} // Items por batch
  windowSize={5} // Ventana de render (default 21)
  removeClippedSubviews // Reciclar views fuera de pantalla
  initialNumToRender={10} // Items iniciales
/>;

// ✅ Memo para evitar re-renders innecesarios
const MemoItem = React.memo(({ item }: { item: Item }) => (
  <View>
    <Text>{item.title}</Text>
  </View>
));
```

### Cuándo usar cada componente

```
ScrollView  → Pocas items (< 20), contenido mixto
FlatList    → Listas largas, items homogéneos
SectionList → Listas agrupadas con headers
FlashList   → Listas con MUCHO rendimiento (Shopify)
```

---

## ✅ Checklist

- [ ] Sé cuándo usar `ScrollView` vs `FlatList`
- [ ] Domino `FlatList`: `data`, `renderItem`, `keyExtractor`
- [ ] Sé usar `numColumns` para grids
- [ ] Puedo implementar pull-to-refresh
- [ ] Entiendo `SectionList` para listas agrupadas
- [ ] Conozco `ListHeaderComponent`, `ListEmptyComponent`, `ItemSeparatorComponent`
