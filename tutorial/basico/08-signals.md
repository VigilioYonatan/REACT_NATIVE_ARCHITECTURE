# 08 — Signals para React Native

## 🎯 Objetivo

Entender **Signals** como alternativa moderna a `useState` para manejar estado reactivo con **re-renders granulares** y mejor rendimiento usando `@preact/signals-react`.

---

## 📚 Teoría

### ¿Qué son los Signals?

Los Signals son **primitivas reactivas** que rastrean y propagan cambios de estado automáticamente. A diferencia de `useState`, **solo re-renderizan los componentes que leen el signal**, no todo el árbol.

```
useState:   setCount(5)  →  re-renderiza TODO el componente + hijos
Signal:     count.value = 5  →  re-renderiza SOLO donde se lee count
```

### Instalación

```bash
npm install @preact/signals-react
```

### Signal vs useState vs useContext

| Característica    | `useState`              | `useContext`           | Signals           |
| ----------------- | ----------------------- | ---------------------- | ----------------- |
| Re-render scope   | Todo el componente      | Todos los consumidores | Solo donde se lee |
| Boilerplate       | Bajo                    | Medio (Provider)       | Muy bajo          |
| Estado global     | ❌ No                   | ✅ Sí (con setup)      | ✅ Sí (directo)   |
| Performance       | ⚠️ Re-renders extra     | ⚠️ Re-renders propagan | ✅ Granular       |
| Dependency arrays | Sí (useEffect, useMemo) | No                     | ❌ No necesita    |
| Learning curve    | Baja                    | Media                  | Baja              |

---

## 💻 Código Práctico

### Ejemplo 1: Signal Básico vs useState

```tsx
import { View, Text, Pressable } from "react-native";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

// El signal vive FUERA del componente — es global por defecto
const count = signal(0);

export default function SignalCounter() {
  useSignals(); // Necesario en React Native para activar la reactividad

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-6xl font-bold text-white mb-8">{count.value}</Text>

      <View className="flex-row gap-4">
        <Pressable
          onPress={() => count.value--}
          className="bg-red-500 px-6 py-4 rounded-2xl active:opacity-80"
        >
          <Text className="text-white text-lg font-bold">− 1</Text>
        </Pressable>

        <Pressable
          onPress={() => (count.value = 0)}
          className="bg-slate-700 px-6 py-4 rounded-2xl active:opacity-80"
        >
          <Text className="text-white text-lg font-bold">Reset</Text>
        </Pressable>

        <Pressable
          onPress={() => count.value++}
          className="bg-green-500 px-6 py-4 rounded-2xl active:opacity-80"
        >
          <Text className="text-white text-lg font-bold">+ 1</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### Ejemplo 2: Computed Signals (Valores Derivados)

```tsx
import { View, Text, Pressable } from "react-native";
import { signal, computed } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

// Signals de estado
const price = signal(100);
const quantity = signal(1);
const taxRate = signal(0.16);

// Computed: se recalculan automáticamente cuando sus dependencias cambian
// ¡Sin useMemo ni dependency arrays!
const subtotal = computed(() => price.value * quantity.value);
const tax = computed(() => subtotal.value * taxRate.value);
const total = computed(() => subtotal.value + tax.value);

export default function CartCalc() {
  useSignals();

  return (
    <View className="flex-1 bg-background p-6 pt-16">
      <Text className="text-2xl font-bold text-white mb-8">🛒 Carrito</Text>

      <View className="bg-surface rounded-2xl p-5 mb-4">
        <Text className="text-white text-lg mb-2">Precio: ${price.value}</Text>

        <Text className="text-slate-400 mb-2">Cantidad:</Text>
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => {
              if (quantity.value > 1) quantity.value--;
            }}
            className="bg-slate-700 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-xl">−</Text>
          </Pressable>
          <Text className="text-white text-2xl font-bold w-8 text-center">
            {quantity.value}
          </Text>
          <Pressable
            onPress={() => quantity.value++}
            className="bg-slate-700 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-xl">+</Text>
          </Pressable>
        </View>
      </View>

      {/* Los computed se actualizan automáticamente */}
      <View className="bg-surface rounded-2xl p-5">
        <Row label="Subtotal" value={`$${subtotal.value.toFixed(2)}`} />
        <Row label="IVA (16%)" value={`$${tax.value.toFixed(2)}`} />
        <View className="border-t border-slate-700 mt-3 pt-3">
          <Row label="Total" value={`$${total.value.toFixed(2)}`} bold />
        </View>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View className="flex-row justify-between py-2">
      <Text
        className={`text-slate-400 ${bold ? "text-lg font-bold text-white" : ""}`}
      >
        {label}
      </Text>
      <Text
        className={`text-white ${bold ? "text-lg font-bold text-primary" : ""}`}
      >
        {value}
      </Text>
    </View>
  );
}
```

### Ejemplo 3: Estado Global con Signals (Sin Context!)

```tsx
// store/appSignals.ts — Estado global sin Provider, sin Context
import { signal, computed } from "@preact/signals-react";

// Auth
export const currentUser = signal<{ name: string; email: string } | null>(null);
export const isAuthenticated = computed(() => currentUser.value !== null);

// Theme
export const isDarkMode = signal(true);

// Cart
export const cartItems = signal<{ id: string; name: string; price: number }[]>(
  [],
);
export const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price, 0),
);
export const cartCount = computed(() => cartItems.value.length);

// Actions
export const login = (name: string, email: string) => {
  currentUser.value = { name, email };
};

export const logout = () => {
  currentUser.value = null;
};

export const addToCart = (item: {
  id: string;
  name: string;
  price: number;
}) => {
  cartItems.value = [...cartItems.value, item];
};

export const removeFromCart = (id: string) => {
  cartItems.value = cartItems.value.filter((i) => i.id !== id);
};

export const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};
```

```tsx
// Uso en CUALQUIER componente — sin Provider, sin imports de Context
import { View, Text, Pressable } from "react-native";
import { useSignals } from "@preact/signals-react/runtime";
import {
  currentUser,
  isAuthenticated,
  login,
  logout,
  cartCount,
} from "@/store/appSignals";

export default function Header() {
  useSignals();

  return (
    <View className="flex-row justify-between items-center p-4 bg-surface">
      <Text className="text-white font-bold text-lg">
        {isAuthenticated.value
          ? `Hola, ${currentUser.value?.name}`
          : "Invitado"}
      </Text>
      <View className="flex-row items-center gap-4">
        <Text className="text-primary">🛒 {cartCount.value}</Text>
        {isAuthenticated.value ? (
          <Pressable
            onPress={logout}
            className="bg-red-500/20 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-red-400 text-sm font-medium">Salir</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => login("Ana", "ana@email.com")}
            className="bg-primary/20 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-primary text-sm font-medium">Login</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
```

### Ejemplo 4: Effect — Reaccionar a Cambios

```tsx
import { signal, effect } from "@preact/signals-react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const theme = signal("dark");

// Effect: se ejecuta cada vez que 'theme' cambia
// ¡Sin useEffect, sin dependency arrays!
effect(() => {
  AsyncStorage.setItem("theme", theme.value);
  console.log("📦 Theme guardado:", theme.value);
});

// Batch updates
import { batch } from "@preact/signals-react";

const firstName = signal("");
const lastName = signal("");
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Batch: ambos cambios se procesan juntos (1 re-render, no 2)
function updateName(first: string, last: string) {
  batch(() => {
    firstName.value = first;
    lastName.value = last;
  });
}
```

---

## 🔑 API de Signals

| API                   | Descripción                                             |
| --------------------- | ------------------------------------------------------- |
| `signal(valor)`       | Crear un signal reactivo                                |
| `computed(() => ...)` | Valor derivado (se recalcula automáticamente)           |
| `effect(() => ...)`   | Efecto secundario reactivo (sin dependency array)       |
| `batch(() => ...)`    | Agrupar cambios (1 sola actualización)                  |
| `.value`              | Leer o escribir el valor del signal                     |
| `useSignals()`        | Hook necesario en React Native para activar reactividad |

### ¿Cuándo usar Signals vs useState?

| Escenario                           | Recomendación                   |
| ----------------------------------- | ------------------------------- |
| Estado local simple (toggle, input) | `useState` está bien            |
| Estado compartido entre componentes | ✅ Signals                      |
| Estado global (auth, theme, cart)   | ✅ Signals (sin Context!)       |
| Valores derivados/computados        | ✅ `computed` (sin useMemo)     |
| Performance con listas largas       | ✅ Signals (re-render granular) |

---

## 📝 Ejercicios

### Ejercicio 1: Todo App con Signals

Crea una Todo App usando solo signals: `todos`, `filter`, `filteredTodos` (computed), `addTodo`, `toggleTodo`.

### Ejercicio 2: Migración de Context a Signals

Toma el `ThemeContext` del nivel intermedio y reescríbelo con signals. Compara la cantidad de código.

### Ejercicio 3: Dashboard Reactivo

Crea un dashboard con 4 métricas (signals). Un `computed` calcula el promedio. Un `effect` logea cada cambio.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica    | ❌ Malo                                      | ✅ Bueno                                                        |
| ----------- | -------------------------------------------- | --------------------------------------------------------------- |
| Re-renders  | Signal cambia → todo el tree re-renderiza    | `useSignals()` + acceder `.value` donde se necesita             |
| Scope       | Signals dentro de componentes                | Signals globales en archivos separados (`store/`)               |
| Mutación    | `signal.value = {...signal.value, key: val}` | `batch()` para múltiples cambios, `computed()` para derivados   |
| Debugging   | No saber qué signal cambió                   | `effect()` para logging temporal durante desarrollo             |
| Cuándo usar | Signals para TODO                            | Signals para estado global; `useState` para estado local simple |

### Cuándo usar Signals vs useState vs Zustand

```
useState    → Estado local de 1 componente (toggle, input)
Signals     → Estado global reactivo sin boilerplate (auth, theme, cart)
Zustand     → Estado complejo con middleware (persist, devtools, immer)
Context     → Datos que cambian poco (theme, idioma) — NO para datos frecuentes
```

### Performance con Signals

```tsx
// ✅ Granularidad — solo re-renderiza donde se lee .value
function CartBadge() {
  useSignals();
  return <Text>{cartItems.value.length}</Text>; // Solo este componente se actualiza
}

// ❌ Leer .value en el padre y pasar como prop — pierde la ventaja
function Parent() {
  useSignals();
  const count = cartItems.value.length; // Trigger re-render del padre entero
  return <CartBadge count={count} />;
}
```

---

## ✅ Checklist

- [ ] Entiendo qué son los Signals y por qué son más eficientes que useState
- [ ] Sé crear signals con `signal()` y leerlos con `.value`
- [ ] Puedo usar `computed()` para valores derivados sin dependency arrays
- [ ] Sé usar `effect()` como alternativa a useEffect
- [ ] Puedo crear estado global sin Context ni Provider
- [ ] Entiendo `batch()` para agrupar actualizaciones
- [ ] Sé cuándo usar Signals vs useState
