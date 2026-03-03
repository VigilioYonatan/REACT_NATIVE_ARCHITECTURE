# 03 — Context API & useReducer

## 🎯 Objetivo

Manejar **estado global** con `Context API` y lógica compleja con `useReducer`, compartiendo datos entre componentes sin prop drilling.

---

## 📚 Teoría

### Problema: Prop Drilling

```
App → Header → UserName    (necesita user)
App → Content → Sidebar → CartCount  (necesita cart)
```

Pasar props por 3+ niveles es tedioso y frágil. **Context** lo resuelve.

### useReducer vs useState

|            | `useState`                    | `useReducer`                          |
| ---------- | ----------------------------- | ------------------------------------- |
| Ideal para | Estado simple (toggle, input) | Estado complejo (múltiples campos)    |
| Updates    | Directo: `setState(val)`      | Dispatch: `dispatch({ type: 'ADD' })` |
| Lógica     | En el componente              | Centralizada en reducer               |
| Testing    | Difícil de aislar             | Fácil (función pura)                  |

---

## 💻 Código Práctico

### Ejemplo 1: Theme Context

```tsx
// contexts/ThemeContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

type Theme = "dark" | "light";
type ThemeAction = { type: "TOGGLE" } | { type: "SET"; payload: Theme };

interface ThemeState {
  theme: Theme;
  colors: { bg: string; text: string; surface: string; primary: string };
}

const themes: Record<Theme, ThemeState["colors"]> = {
  dark: {
    bg: "bg-background",
    text: "text-white",
    surface: "bg-surface",
    primary: "bg-primary",
  },
  light: {
    bg: "bg-gray-100",
    text: "text-gray-900",
    surface: "bg-white",
    primary: "bg-violet-600",
  },
};

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "TOGGLE":
      const next: Theme = state.theme === "dark" ? "light" : "dark";
      return { theme: next, colors: themes[next] };
    case "SET":
      return { theme: action.payload, colors: themes[action.payload] };
    default:
      return state;
  }
}

const ThemeContext = createContext<{
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: "dark",
    colors: themes.dark,
  });
  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
```

```tsx
// Componente consumidor
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const { state, dispatch } = useTheme();

  return (
    <View className={`flex-1 ${state.colors.bg} p-5 pt-16`}>
      <Text className={`text-2xl font-bold ${state.colors.text} mb-6`}>
        ⚙️ Configuración
      </Text>
      <Pressable
        onPress={() => dispatch({ type: "TOGGLE" })}
        className={`${state.colors.surface} p-5 rounded-2xl flex-row justify-between items-center`}
      >
        <Text className={`${state.colors.text} text-base`}>Dark Mode</Text>
        <Text className="text-2xl">{state.theme === "dark" ? "🌙" : "☀️"}</Text>
      </Pressable>
    </View>
  );
}
```

### Ejemplo 2: Carrito de Compras con useReducer

```tsx
// contexts/CartContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
}
interface CartItem extends Product {
  quantity: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR" };

interface CartState {
  items: CartItem[];
  total: number;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      const items = exists
        ? state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...state.items, { ...action.payload, quantity: 1 }];
      return {
        items,
        total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload);
      return {
        items,
        total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      };
    }
    case "CLEAR":
      return { items: [], total: 0 };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
```

```tsx
// Pantalla de productos
import { View, Text, Pressable, FlatList } from "react-native";
import { useCart } from "@/contexts/CartContext";

const PRODUCTS = [
  { id: "1", name: "React Native Pro", price: 49.99 },
  { id: "2", name: "Expo Guide", price: 29.99 },
  { id: "3", name: "TypeScript Mastery", price: 39.99 },
];

export default function StoreScreen() {
  const { state, dispatch } = useCart();

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-white">🏪 Tienda</Text>
        <View className="bg-primary/20 px-3 py-1.5 rounded-full">
          <Text className="text-primary font-semibold">
            🛒 {state.items.length} · ${state.total.toFixed(2)}
          </Text>
        </View>
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3"
        renderItem={({ item }) => (
          <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-semibold">{item.name}</Text>
              <Text className="text-primary font-bold mt-1">${item.price}</Text>
            </View>
            <Pressable
              onPress={() => dispatch({ type: "ADD_ITEM", payload: item })}
              className="bg-primary px-4 py-2 rounded-lg active:opacity-80"
            >
              <Text className="text-white font-medium">+ Agregar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Auth Context

Crea un AuthContext con login, logout, y registro. Protege rutas según `isAuthenticated`.

### Ejercicio 2: Multi-Context

Usa ThemeContext + CartContext juntos. El carrito debe respetar el tema.

### Ejercicio 3: Reducer Testing

Escribe tests para el `cartReducer` como función pura (sin React).

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                              | ✅ Bueno                                                  |
| ---------- | ------------------------------------ | --------------------------------------------------------- |
| Re-renders | Un solo Context para todo            | Separar contextos por dominio (AuthContext, ThemeContext) |
| Frecuencia | Context para datos que cambian mucho | Zustand/Signals para datos frecuentes                     |
| Provider   | Provider en cada pantalla            | Provider en `_layout.tsx` raíz                            |
| Valor      | Pasar nuevo objeto en cada render    | `useMemo` en el value del Provider                        |
| Reducer    | Switch gigante con 20+ cases         | Separar en múltiples reducers o usar Zustand              |
| Default    | Sin default en switch                | Siempre `default: return state`                           |

### Evitar Re-renders con Context

```tsx
// ❌ Cada cambio re-renderiza TODOS los consumers
const AppContext = createContext({ user, theme, cart, settings });

// ✅ Separar por dominio — solo re-renderiza los consumers relevantes
const AuthContext = createContext({ user, login, logout });
const ThemeContext = createContext({ theme, toggleTheme });
const CartContext = createContext({ items, addItem, removeItem });

// ✅ Memorizar el value
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Cuándo NO usar Context

```
Context → Datos que cambian POCO (auth, theme, idioma)
Zustand/Signals → Datos que cambian FRECUENTEMENTE (cart, formularios, UI state)
TanStack Query → Datos del SERVIDOR (users, posts, productos)
```

---

## ✅ Checklist

- [ ] Sé crear un Context con createContext
- [ ] Puedo crear un custom hook (`useTheme`, `useCart`) para consumir Context
- [ ] Entiendo useReducer y cuándo preferirlo sobre useState
- [ ] Sé combinar Context + useReducer para estado global
- [ ] Puedo componer múltiples Providers
