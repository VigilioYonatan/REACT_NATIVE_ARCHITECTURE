# 03 — Estado con useState & Eventos

## 🎯 Objetivo

Entender cómo funciona el **estado** en React Native con `useState`, cómo manejar **eventos** del usuario y el flujo de re-renderizado.

---

## 📚 Teoría

### ¿Qué es el Estado?

El estado es **datos internos** de un componente que, al cambiar, provocan un **re-renderizado** automático de la UI.

```tsx
const [valor, setValor] = useState(valorInicial);
```

### Reglas del Estado

1. **Nunca mutar el estado directamente** — Siempre usar `setValor()`
2. **Las actualizaciones son asíncronas** — No leer el estado inmediatamente después de cambiarlo
3. **Usa la forma funcional** cuando depende del anterior: `setCount(prev => prev + 1)`
4. **Los Hooks solo en nivel superior** — Nunca dentro de `if`, `for`, o funciones anidadas

### Componentes de Interacción

| Componente         | Uso                   | Eventos                                             |
| ------------------ | --------------------- | --------------------------------------------------- |
| `Pressable`        | ✅ Recomendado 2026   | `onPress`, `onLongPress`, `onPressIn`, `onPressOut` |
| `TouchableOpacity` | Legado pero funcional | `onPress`, `onLongPress`                            |
| `Button`           | Botón simple nativo   | `onPress`                                           |

---

## 💻 Código Práctico

### Ejemplo 1: Contador

```tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function Contador() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador</Text>
      <Text
        style={[
          styles.count,
          count > 0 && { color: "#22c55e" },
          count < 0 && { color: "#ef4444" },
        ]}
      >
        {count}
      </Text>
      <View style={styles.buttons}>
        <Pressable
          onPress={() => setCount((prev) => prev - 1)}
          style={({ pressed }) => [
            styles.button,
            styles.btnDanger,
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Text style={styles.buttonText}>− 1</Text>
        </Pressable>
        <Pressable
          onPress={() => setCount(0)}
          style={({ pressed }) => [
            styles.button,
            styles.btnNeutral,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
        <Pressable
          onPress={() => setCount((prev) => prev + 1)}
          style={({ pressed }) => [
            styles.button,
            styles.btnSuccess,
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Text style={styles.buttonText}>+ 1</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#94a3b8",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  count: {
    fontSize: 96,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 32,
  },
  buttons: { flexDirection: "row", gap: 16 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 80,
    alignItems: "center",
  },
  btnDanger: { backgroundColor: "#ef4444" },
  btnSuccess: { backgroundColor: "#22c55e" },
  btnNeutral: { backgroundColor: "#334155" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
```

### Ejemplo 2: Toggle & Boolean State

```tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function ToggleDemo() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#0a0a0a" : "#f8fafc" },
      ]}
    >
      <Text style={[styles.title, { color: darkMode ? "#fff" : "#0a0a0a" }]}>
        Configuración
      </Text>

      <Pressable
        onPress={() => setDarkMode((prev) => !prev)}
        style={styles.row}
      >
        <Text style={styles.emoji}>{darkMode ? "🌙" : "☀️"}</Text>
        <Text
          style={[styles.label, { color: darkMode ? "#e2e8f0" : "#1e293b" }]}
        >
          Modo Oscuro
        </Text>
        <View
          style={[styles.toggle, darkMode ? styles.toggleOn : styles.toggleOff]}
        >
          <View style={[styles.dot, darkMode && { alignSelf: "flex-end" }]} />
        </View>
      </Pressable>

      <Pressable
        onPress={() => setNotifications((prev) => !prev)}
        style={styles.row}
      >
        <Text style={styles.emoji}>{notifications ? "🔔" : "🔕"}</Text>
        <Text
          style={[styles.label, { color: darkMode ? "#e2e8f0" : "#1e293b" }]}
        >
          Notificaciones
        </Text>
        <View
          style={[
            styles.toggle,
            notifications ? styles.toggleOn : styles.toggleOff,
          ]}
        >
          <View
            style={[styles.dot, notifications && { alignSelf: "flex-end" }]}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 32 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  emoji: { fontSize: 24, marginRight: 16 },
  label: { flex: 1, fontSize: 17 },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: "center",
  },
  toggleOn: { backgroundColor: "#7c3aed" },
  toggleOff: { backgroundColor: "#475569" },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#fff" },
});
```

### Ejemplo 3: Estado con Arrays — Todo List

```tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function TodoBasico() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Aprender useState", done: true },
    { id: 2, text: "Dominar Flexbox", done: true },
    { id: 3, text: "Entender Eventos", done: false },
    { id: 4, text: "Crear mi primera app", done: false },
  ]);

  // ✅ Inmutable: crear nuevo array
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  // ❌ NUNCA: todos[0].done = true; setTodos(todos);

  const completadas = todos.filter((t) => t.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
      <Text style={styles.progress}>
        {completadas}/{todos.length} completadas
      </Text>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(completadas / todos.length) * 100}%` },
          ]}
        />
      </View>

      {todos.map((todo) => (
        <Pressable
          key={todo.id}
          onPress={() => toggleTodo(todo.id)}
          style={styles.todoItem}
        >
          <Text style={styles.checkbox}>{todo.done ? "✅" : "⬜"}</Text>
          <Text style={[styles.todoText, todo.done && styles.todoDone]}>
            {todo.text}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
    paddingTop: 60,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  progress: { fontSize: 14, color: "#94a3b8", marginBottom: 16 },
  progressBar: {
    height: 6,
    backgroundColor: "#1e293b",
    borderRadius: 3,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#7c3aed", borderRadius: 3 },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#111827",
    borderRadius: 12,
    marginBottom: 8,
  },
  checkbox: { fontSize: 20, marginRight: 14 },
  todoText: { fontSize: 16, color: "#e2e8f0", flex: 1 },
  todoDone: { textDecorationLine: "line-through", color: "#475569" },
});
```

---

## 🔑 Conceptos Clave

### El Ciclo de Re-renderizado

```
setCount(5) → React detecta cambio → Re-ejecuta componente → Compara Virtual DOM → Actualiza UI
```

### Pressable — Estilos según Interacción

```tsx
<Pressable
  style={({ pressed }) => [styles.base, pressed && styles.pressed]}
  onPress={() => {}} // al tocar
  onLongPress={() => {}} // al mantener presionado (500ms default)
  hitSlop={10} // área de toque expandida
  disabled={false}
/>
```

---

## 📝 Ejercicios

### Ejercicio 1: Semáforo Interactivo

Crea un semáforo que cambie: Rojo → Amarillo → Verde → Rojo. El color activo brilla, los otros opacos.

### Ejercicio 2: Carrito de Compras

3 productos con +/- cantidad y total calculado en tiempo real.

### Ejercicio 3: Quiz de React Native

3 preguntas con 4 opciones, puntuación y resultado final.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica          | ❌ Malo                                              | ✅ Bueno                                                    |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| Estado derivado   | `const [total, setTotal] = useState(0)` recalculando | `const total = items.reduce(...)` (derivar del estado real) |
| Forma funcional   | `setCount(count + 1)`                                | `setCount(prev => prev + 1)` (seguro con batching)          |
| Mutación          | `todos[0].done = true; setTodos(todos)`              | `setTodos(prev => prev.map(...))` (inmutable)               |
| Múltiples estados | 5+ `useState` separados                              | Agrupar en objeto o usar `useReducer`                       |
| Handlers          | `onPress={() => setX(true)}` inline complejo         | Extraer a función con nombre descriptivo                    |

### Optimización de Re-renders

```tsx
// ❌ Función creada en cada render
<Pressable onPress={() => handlePress(item.id)} />;

// ✅ useCallback para funciones estables
const handlePress = useCallback((id: number) => {
  setTodos((prev) => prev.filter((t) => t.id !== id));
}, []);

// ❌ Nuevo objeto en cada render
<Pressable style={{ backgroundColor: "red" }} />;

// ✅ StyleSheet o useMemo
const dynamicStyle = useMemo(
  () => ({
    backgroundColor: isActive ? "#7c3aed" : "#334155",
  }),
  [isActive],
);
```

### Cuándo usar useState vs useReducer

```
useState  → 1-3 estados simples (boolean, string, number)
useReducer → Estado complejo (formularios, estado con múltiples acciones)
```

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo qué es el estado y por qué causa re-renderizados
- [ ] Sé usar `useState` con primitivos, objetos y arrays
- [ ] Entiendo la inmutabilidad del estado
- [ ] Sé cuándo usar la forma funcional `prev => ...`
- [ ] Domino `Pressable` y sus eventos
- [ ] Puedo aplicar estilos condicionales basados en el estado
