# Zustand 5.0

> Estado global **minimalista** — sin boilerplate, sin providers, sin reducers. Hook-based, tipado, y ultra-rápido.

## 📦 Instalación

```bash
npm install zustand@5.0.11
```

---

## 🔑 ¿Por qué Zustand?

| vs          | Redux              | Context                   | Zustand                    |
| ----------- | ------------------ | ------------------------- | -------------------------- |
| Boilerplate | 🔴 Mucho           | 🟡 Medio                  | 🟢 Mínimo                  |
| Provider    | Sí                 | Sí                        | **No**                     |
| Re-renders  | Controlado         | 🔴 Todos los consumidores | 🟢 Solo lo que se suscribe |
| DevTools    | Sí                 | No                        | Sí (middleware)            |
| Async       | Thunks / RTK Query | Manual                    | Directo en el store        |
| Bundle size | ~12kb              | 0                         | ~1kb                       |

---

## 💻 Ejemplos

### 1. Store Básico

```tsx
import { create } from "zustand";

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Uso en componente
import { View, Text, Pressable } from "react-native";

export default function Counter() {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-6xl font-bold text-white mb-8">{count}</Text>
      <View className="flex-row gap-4">
        <Pressable
          onPress={decrement}
          className="bg-red-500 px-6 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold text-lg">−</Text>
        </Pressable>
        <Pressable
          onPress={reset}
          className="bg-slate-700 px-6 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold text-lg">0</Text>
        </Pressable>
        <Pressable
          onPress={increment}
          className="bg-green-500 px-6 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold text-lg">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### 2. Store Complejo (Auth + Cart)

```tsx
import { create } from "zustand";

// --- Auth Store ---
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const user = await res.json();
    set({ user, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// --- Cart Store ---
interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    const items = existing
      ? get().items.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        )
      : [...get().items, { ...item, qty: 1 }];
    set({ items, total: items.reduce((s, i) => s + i.price * i.qty, 0) });
  },
  removeItem: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    set({ items, total: items.reduce((s, i) => s + i.price * i.qty, 0) });
  },
  clear: () => set({ items: [], total: 0 }),
}));
```

### 3. Selectores para Evitar Re-renders

```tsx
// ❌ MALO — re-renderiza cuando CUALQUIER campo del store cambia
const { count, increment } = useCounter();

// ✅ BUENO — solo re-renderiza cuando 'count' cambia
const count = useCounter((state) => state.count);
const increment = useCounter((state) => state.increment);

// ✅ BUENO — múltiples selectores con shallow comparison
import { useShallow } from "zustand/react/shallow";

const { count, total } = useCounter(
  useShallow((state) => ({ count: state.count, total: state.total })),
);
```

### 4. Middleware: Persist + DevTools

```tsx
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsStore {
  theme: "dark" | "light";
  language: string;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
}

export const useSettings = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        theme: "dark",
        language: "es",
        toggleTheme: () =>
          set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
        setLanguage: (language) => set({ language }),
      }),
      {
        name: "settings-storage",
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
    { name: "settings" },
  ),
);
```

---

## 🔗 Links

- [Documentación oficial](https://zustand.docs.pmnd.rs/)
- [GitHub](https://github.com/pmndrs/zustand)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                           | ✅ Bueno                                                      |
| ---------- | --------------------------------- | ------------------------------------------------------------- |
| Selectores | `const store = useStore()` (todo) | `const count = useStore(s => s.count)` (selectivo)            |
| Stores     | Un solo store gigante             | Stores separados por dominio (`useAuthStore`, `useCartStore`) |
| Acciones   | Lógica en componentes             | Acciones dentro del store                                     |
| Persist    | `AsyncStorage` adapter            | MMKV adapter (30x más rápido)                                 |
| Devtools   | Sin debugging                     | `devtools` middleware en desarrollo                           |
| Immer      | Spread profundo manual            | `immer` middleware para mutaciones intuitivas                 |

---

## ✅ Checklist

- [ ] Sé crear stores con `create`
- [ ] Puedo hacer acciones async directamente en el store
- [ ] Entiendo selectores y `useShallow` para evitar re-renders
- [ ] Sé usar middleware `persist` con AsyncStorage
- [ ] Puedo combinar múltiples stores independientes
