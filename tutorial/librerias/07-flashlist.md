# FlashList 2.x (Shopify)

> Listas **ultra-rápidas** — reemplazo drop-in de `FlatList` con reciclaje de celdas. Hasta **5x más rápido**.

## 📦 Instalación

```bash
npx expo install @shopify/flash-list@^2.0.0
```

> ⚠️ FlashList v2 **requiere** New Architecture (Fabric).

---

## 🔑 FlashList vs FlatList

|                   | FlatList                    | FlashList v2            |
| ----------------- | --------------------------- | ----------------------- |
| Rendimiento       | ⚠️ Blancos en scroll rápido | ✅ Reciclaje de celdas  |
| Estimación tamaño | No necesita                 | ❌ **No necesita** (v2) |
| Masonry layout    | ❌                          | ✅ Props nativa         |
| Memoria           | ⚠️ Alta con listas grandes  | ✅ Optimizada           |
| API               | React Native core           | Drop-in replacement     |

---

## 💻 Ejemplos

### 1. Lista Básica (Drop-in)

```tsx
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

interface Item {
  id: string;
  title: string;
  subtitle: string;
}

const DATA: Item[] = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i),
  title: `Item ${i}`,
  subtitle: `Descripción del item ${i}`,
}));

export default function BasicList() {
  return (
    <FlashList
      data={DATA}
      estimatedItemSize={70}
      renderItem={({ item }) => (
        <View className="bg-surface mx-4 mb-2 p-4 rounded-xl">
          <Text className="text-white font-semibold">{item.title}</Text>
          <Text className="text-slate-400 text-sm mt-1">{item.subtitle}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingTop: 16 }}
    />
  );
}
```

### 2. Masonry Layout (Grid)

```tsx
import { View, Text, Image, useWindowDimensions } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";

const IMAGES = Array.from({ length: 50 }, (_, i) => ({
  id: String(i),
  url: `https://picsum.photos/300/${200 + (i % 5) * 50}?random=${i}`,
  height: 200 + (i % 5) * 50,
}));

export default function MasonryGrid() {
  return (
    <MasonryFlashList
      data={IMAGES}
      numColumns={2}
      estimatedItemSize={250}
      renderItem={({ item }) => (
        <View className="m-1">
          <Image
            source={{ uri: item.url }}
            style={{ height: item.height * 0.4 }}
            className="rounded-xl w-full"
          />
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### 3. Múltiples Tipos de Items

```tsx
import { FlashList } from "@shopify/flash-list";
import { View, Text } from "react-native";

type ListItem =
  | { type: "header"; title: string }
  | { type: "item"; id: string; name: string };

const DATA: ListItem[] = [
  { type: "header", title: "Sección A" },
  { type: "item", id: "1", name: "Item 1" },
  { type: "item", id: "2", name: "Item 2" },
  { type: "header", title: "Sección B" },
  { type: "item", id: "3", name: "Item 3" },
];

export default function SectionedList() {
  return (
    <FlashList
      data={DATA}
      estimatedItemSize={60}
      getItemType={(item) => item.type}
      renderItem={({ item }) => {
        if (item.type === "header") {
          return (
            <Text className="text-primary font-bold text-lg px-4 py-3">
              {item.title}
            </Text>
          );
        }
        return (
          <View className="bg-surface mx-4 mb-2 p-4 rounded-xl">
            <Text className="text-white">{item.name}</Text>
          </View>
        );
      }}
    />
  );
}
```

---

## 🔗 Links

- [Documentación oficial](https://shopify.github.io/flash-list/)
- [GitHub](https://github.com/Shopify/flash-list)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica          | ❌ Malo                         | ✅ Bueno                                         |
| ----------------- | ------------------------------- | ------------------------------------------------ |
| estimatedItemSize | No definir                      | Siempre definir (mejora layout calculations)     |
| renderItem        | Inline function                 | Componente memoizado fuera del render            |
| Key               | Index como key                  | ID único estable con `keyExtractor`              |
| Tipo              | Mezclar tipos sin `getItemType` | `getItemType` cuando hay items heterogéneos      |
| Blank             | Flash de espacio vacío          | `drawDistance` para pre-render fuera de pantalla |

---

## ✅ Checklist

- [ ] Sé instalar y usar FlashList como reemplazo de FlatList
- [ ] Puedo usar MasonryFlashList para grids
- [ ] Entiendo `estimatedItemSize` y `getItemType`
- [ ] Sé manejar múltiples tipos de items
