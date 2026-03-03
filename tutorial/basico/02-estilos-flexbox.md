# 02 — StyleSheet & Flexbox

## 🎯 Objetivo

Dominar el sistema de estilos de React Native con `StyleSheet` y el modelo de layout **Flexbox**, que es el sistema por defecto para organizar componentes en pantalla.

---

## 📚 Teoría

### StyleSheet vs CSS

React Native **NO usa CSS**. En su lugar usa objetos JavaScript con propiedades en **camelCase**:

```
CSS                    →  React Native
background-color       →  backgroundColor
font-size              →  fontSize
border-radius          →  borderRadius
text-align             →  textAlign
margin-top             →  marginTop
```

### ¿Por qué StyleSheet.create()?

```tsx
// ✅ Recomendado — optimizado internamente
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});

// ⚠️ Funciona, pero sin optimización
<View style={{ flex: 1, backgroundColor: "#000" }} />;
```

`StyleSheet.create()` valida los estilos en desarrollo y los optimiza en producción.

### Flexbox en React Native

> **Diferencia clave**: En React Native, `flexDirection` es `'column'` por defecto (en CSS web es `'row'`).

#### Propiedades del Contenedor (Padre)

| Propiedad        | Valores                                                                                                   | Descripción                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `flexDirection`  | `'column'` \| `'row'` \| `'column-reverse'` \| `'row-reverse'`                                            | Dirección del eje principal                   |
| `justifyContent` | `'flex-start'` \| `'center'` \| `'flex-end'` \| `'space-between'` \| `'space-around'` \| `'space-evenly'` | Alineación en el eje principal                |
| `alignItems`     | `'flex-start'` \| `'center'` \| `'flex-end'` \| `'stretch'` \| `'baseline'`                               | Alineación en el eje cruzado                  |
| `flexWrap`       | `'nowrap'` \| `'wrap'` \| `'wrap-reverse'`                                                                | Si los hijos hacen wrap                       |
| `gap`            | `number`                                                                                                  | Espacio entre hijos (✅ soportado en RN 0.83) |
| `rowGap`         | `number`                                                                                                  | Espacio entre filas                           |
| `columnGap`      | `number`                                                                                                  | Espacio entre columnas                        |

#### Propiedades del Hijo

| Propiedad    | Tipo                    | Descripción                        |
| ------------ | ----------------------- | ---------------------------------- |
| `flex`       | `number`                | Proporción del espacio disponible  |
| `flexGrow`   | `number`                | Cuánto debe crecer                 |
| `flexShrink` | `number`                | Cuánto debe encogerse              |
| `flexBasis`  | `number \| string`      | Tamaño base antes de grow/shrink   |
| `alignSelf`  | Mismos que `alignItems` | Override de `alignItems` del padre |

---

## 💻 Código Práctico

### Ejemplo 1: Explorando flexDirection y justifyContent

```tsx
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Box({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.box, { backgroundColor: color }]}>
      <Text style={styles.boxText}>{label}</Text>
    </View>
  );
}

export default function FlexboxDemo() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Column (default) con center */}
      <Text style={styles.sectionTitle}>flexDirection: column (default)</Text>
      <View style={styles.columnContainer}>
        <Box label="1" color="#ef4444" />
        <Box label="2" color="#3b82f6" />
        <Box label="3" color="#22c55e" />
      </View>

      {/* Row con space-between */}
      <Text style={styles.sectionTitle}>
        flexDirection: row + space-between
      </Text>
      <View style={styles.rowContainer}>
        <Box label="1" color="#ef4444" />
        <Box label="2" color="#3b82f6" />
        <Box label="3" color="#22c55e" />
      </View>

      {/* Row con space-evenly */}
      <Text style={styles.sectionTitle}>flexDirection: row + space-evenly</Text>
      <View style={styles.rowEvenContainer}>
        <Box label="1" color="#f59e0b" />
        <Box label="2" color="#8b5cf6" />
        <Box label="3" color="#ec4899" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 16,
  },
  sectionTitle: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  columnContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
  },
  rowEvenContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
  },
  box: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
```

### Ejemplo 2: Flex Grow — Layouts Proporcionales

```tsx
import { View, Text, StyleSheet } from "react-native";

export default function FlexGrowDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Layout con flex</Text>

      {/* Header fijo + Contenido flexible + Footer fijo */}
      <View style={styles.layout}>
        <View style={styles.header}>
          <Text style={styles.text}>Header (fijo)</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.text}>
            Content (flex: 1 — toma todo el espacio)
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.text}>Footer (fijo)</Text>
        </View>
      </View>

      {/* Proporciones con flex */}
      <Text style={styles.title}>Proporciones</Text>
      <View style={styles.proportions}>
        <View style={[styles.segment, { flex: 1, backgroundColor: "#ef4444" }]}>
          <Text style={styles.text}>flex: 1</Text>
        </View>
        <View style={[styles.segment, { flex: 2, backgroundColor: "#3b82f6" }]}>
          <Text style={styles.text}>flex: 2</Text>
        </View>
        <View style={[styles.segment, { flex: 1, backgroundColor: "#22c55e" }]}>
          <Text style={styles.text}>flex: 1</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 16,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  layout: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    height: 60,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1, // Toma todo el espacio restante
    backgroundColor: "#1e1e3a",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: 50,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  proportions: {
    flexDirection: "row",
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  segment: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
```

### Ejemplo 3: Grid con flexWrap y gap

```tsx
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const PADDING = 16;
const GAP = 12;
const COLUMNS = 3;
const ITEM_SIZE = (width - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
];

export default function GridDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grid 3x3 con flexWrap</Text>
      <View style={styles.grid}>
        {COLORS.map((color, index) => (
          <View
            key={index}
            style={[styles.gridItem, { backgroundColor: color }]}
          >
            <Text style={styles.gridText}>{index + 1}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: PADDING,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  gridText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
```

### Ejemplo 4: Combinando Múltiples Estilos

```tsx
import { View, Text, StyleSheet } from "react-native";

export default function MultiStyleDemo() {
  const isActive = true;
  const isPremium = false;

  return (
    <View style={styles.container}>
      {/* Combinar estilos con array */}
      <View style={[styles.card, styles.cardElevated]}>
        <Text style={styles.cardText}>Estilos combinados con array</Text>
      </View>

      {/* Estilos condicionales */}
      <View
        style={[
          styles.badge,
          isActive ? styles.badgeActive : styles.badgeInactive,
        ]}
      >
        <Text style={styles.badgeText}>{isActive ? "Activo" : "Inactivo"}</Text>
      </View>

      {/* Spread de estilos inline (solo cuando es necesario) */}
      <View
        style={[
          styles.card,
          { borderColor: isPremium ? "#fbbf24" : "#334155" },
        ]}
      >
        <Text style={styles.cardText}>
          {isPremium ? "⭐ Premium" : "Free Tier"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", padding: 20, gap: 16 },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#1e1e2e",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardElevated: {
    elevation: 8,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardText: { color: "#e2e8f0", fontSize: 16 },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeActive: { backgroundColor: "#16a34a" },
  badgeInactive: { backgroundColor: "#dc2626" },
  badgeText: { color: "#fff", fontWeight: "600" },
});
```

---

## 🔑 Conceptos Clave

### Unidades

- React Native usa **density-independent pixels (dp)** — **no** px, em, rem, %, vh, vw
- Para porcentajes: usar `flex` o `Dimensions.get('window')`
- `gap`, `rowGap`, `columnGap` sí están soportados en React Native 0.83 ✅

### Cheatsheet Visual de Flexbox

```
flexDirection: 'column' (default)     flexDirection: 'row'
┌──────────────┐                      ┌──────────────────────┐
│ ┌──────────┐ │                      │ ┌────┐ ┌────┐ ┌────┐│
│ │  Item 1  │ │                      │ │ I1 │ │ I2 │ │ I3 ││
│ └──────────┘ │                      │ └────┘ └────┘ └────┘│
│ ┌──────────┐ │                      └──────────────────────┘
│ │  Item 2  │ │
│ └──────────┘ │                      justifyContent: 'space-between'
│ ┌──────────┐ │                      ┌──────────────────────┐
│ │  Item 3  │ │                      │┌────┐        ┌────┐ │
│ └──────────┘ │                      ││ I1 │        │ I2 │ │
└──────────────┘                      │└────┘        └────┘ │
                                      └──────────────────────┘
```

---

## 📝 Ejercicios

### Ejercicio 1: Clon de Card de Twitter/X

Crea una tarjeta de tweet con:

- Avatar (izquierda), nombre + handle + tiempo (derecha, horizontal)
- Texto del tweet
- Barra inferior con iconos de acciones (comentar, retweet, like, compartir)
- Usa `flexDirection: 'row'` y `'column'` combinados

### Ejercicio 2: Layout de App (Header + Content + BottomBar)

Crea un layout tipo app con:

- Header fijo de 60px con título centrado
- Contenido que ocupa todo el espacio `flex: 1`
- BottomBar fija de 70px con 4 items en fila (`space-around`)

### Ejercicio 3: Dashboard de Estadísticas

Crea un grid de 2x2 con cards de estadísticas:

- Cada card tiene: icono/emoji, título, valor numérico grande, indicador de cambio (+/-%)
- Usa `flexWrap: 'wrap'` y `gap`

---

## 🏆 Buenas Prácticas y Optimización

| Práctica          | ❌ Malo                                | ✅ Bueno                                                            |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------- |
| Espaciado         | `marginBottom` en cada hijo            | `gap` en el padre (más limpio)                                      |
| Layout responsivo | `width: 375` hardcodeado               | `flex: 1` o porcentajes con `Dimensions`                            |
| Grid              | Calcular manualmente cada posición     | `flexWrap: 'wrap'` + `gap`                                          |
| Estilos dinámicos | Crear StyleSheet dentro del componente | `StyleSheet.create()` fuera + array de estilos                      |
| Sombras           | Solo `elevation` (Android looks)       | Combinar `shadowColor/Offset/Opacity` (iOS) + `elevation` (Android) |

### Responsive Design

```tsx
import { useWindowDimensions } from "react-native";

function ResponsiveGrid() {
  const { width } = useWindowDimensions(); // ✅ Se actualiza al rotar
  const columns = width > 768 ? 4 : width > 480 ? 3 : 2;
  const itemSize = (width - 32 - (columns - 1) * 12) / columns;

  // ✅ useWindowDimensions > Dimensions.get('window')
  // porque se actualiza automáticamente al cambiar tamaño
}
```

### Errores Comunes

```tsx
// ❌ Error: Text fuera de Text
<View>
  <Text>Precio: </Text>
  {'$100'}  // ❌ Crash — texto suelto
</View>

// ✅ Correcto
<View>
  <Text>Precio: {'$100'}</Text>
</View>

// ❌ flex: 1 sin padre con dimensiones
<View>
  <View style={{ flex: 1 }} />  // No crece si el padre no tiene flex/height
</View>

// ✅ Padre con flex: 1
<View style={{ flex: 1 }}>
  <View style={{ flex: 1 }} />  // Ahora sí funciona
</View>
```

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo la diferencia entre CSS web y StyleSheet de React Native
- [ ] Sé usar `StyleSheet.create()` y por qué es mejor que estilos inline
- [ ] Domino `flexDirection`, `justifyContent` y `alignItems`
- [ ] Sé usar `flex` para layouts proporcionales
- [ ] Puedo crear grids con `flexWrap` y `gap`
- [ ] Sé combinar y aplicar estilos condicionales

---

## 📖 Referencias

- [React Native — Flexbox](https://reactnative.dev/docs/flexbox)
- [React Native — StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Yoga Layout — Motor Flexbox de RN](https://yogalayout.dev/)
