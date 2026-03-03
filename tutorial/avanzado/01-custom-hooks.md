# 01 — Custom Hooks

## 🎯 Objetivo

Crear **hooks personalizados** para reutilizar lógica entre componentes: `useFetch`, `useForm`, `useDebounce`, `useToggle`.

---

## 📚 Teoría

### ¿Qué es un Custom Hook?

Una función que empieza con `use` y utiliza otros hooks internamente. Permite **extraer y reutilizar lógica stateful**.

```tsx
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset };
}
```

### Reglas de los Hooks

1. Solo llamar hooks en el **nivel superior** (no en condicionales ni loops)
2. Solo llamar hooks en **componentes de React** u **otros hooks**
3. El nombre **debe empezar con `use`**

---

## 💻 Código Práctico

### Hook 1: useFetch — Fetching Genérico

```tsx
// hooks/useFetch.ts
import { useState, useEffect } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [url, trigger]);

  const refetch = () => setTrigger((prev) => prev + 1);
  return { data, loading, error, refetch };
}
```

```tsx
// Uso en componente
import { View, Text, FlatList, ActivityIndicator } from "react-native";

export default function UsersScreen() {
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users");

  if (loading)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-red-400 text-lg">Error: {error}</Text>
      </View>
    );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-3"
      onRefresh={refetch}
      refreshing={loading}
      renderItem={({ item }) => (
        <View className="bg-surface rounded-xl p-4 border-l-4 border-primary">
          <Text className="text-white font-semibold">{item.name}</Text>
          <Text className="text-slate-400 text-sm mt-1">{item.email}</Text>
        </View>
      )}
    />
  );
}
```

### Hook 2: useForm — Formularios Tipados

```tsx
// hooks/useForm.ts
import { useState } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Errors<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) onSubmit(values);
    } else {
      onSubmit(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, setValue, handleSubmit, reset };
}
```

```tsx
// Uso
import { View, Text, TextInput, Pressable } from "react-native";

export default function LoginScreen() {
  const { values, errors, setValue, handleSubmit } = useForm(
    { email: "", password: "" },
    (v) => {
      const e: any = {};
      if (!v.email.includes("@")) e.email = "Email inválido";
      if (v.password.length < 6) e.password = "Mínimo 6 caracteres";
      return e;
    },
  );

  return (
    <View className="flex-1 bg-background p-6 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">Login</Text>
      <TextInput
        value={values.email}
        onChangeText={(v) => setValue("email", v)}
        placeholder="Email"
        placeholderTextColor="#475569"
        className="bg-surface rounded-xl p-4 text-white mb-1 border border-slate-700"
      />
      {errors.email && (
        <Text className="text-red-400 text-sm mb-3 ml-1">{errors.email}</Text>
      )}

      <TextInput
        value={values.password}
        onChangeText={(v) => setValue("password", v)}
        placeholder="Password"
        placeholderTextColor="#475569"
        secureTextEntry
        className="bg-surface rounded-xl p-4 text-white mb-1 border border-slate-700 mt-2"
      />
      {errors.password && (
        <Text className="text-red-400 text-sm mb-3 ml-1">
          {errors.password}
        </Text>
      )}

      <Pressable
        onPress={() => handleSubmit((v) => console.log("Submit:", v))}
        className="bg-primary py-4 rounded-xl items-center mt-4 active:opacity-80"
      >
        <Text className="text-white font-semibold text-base">
          Iniciar Sesión
        </Text>
      </Pressable>
    </View>
  );
}
```

### Hook 3: useDebounce

```tsx
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### Hook 4: useToggle

```tsx
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((prev) => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  return { value, toggle, setTrue, setFalse };
}
```

---

## 📝 Ejercicios

### Ejercicio 1: useLocalStorage

Hook que guarda/carga de AsyncStorage automáticamente: `const [value, setValue] = useLocalStorage('key', default)`.

### Ejercicio 2: useCountdown

Hook que recibe segundos y devuelve `{ seconds, isFinished, start, pause, reset }`.

### Ejercicio 3: useGeolocation

Hook que devuelve `{ latitude, longitude, loading, error }` usando `expo-location`.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica        | ❌ Malo                               | ✅ Bueno                                    |
| --------------- | ------------------------------------- | ------------------------------------------- |
| Naming          | `useData()` genérico                  | `useUserProfile()` descritivo del dominio   |
| Responsabilidad | Hook que hace fetch + valida + navega | Una responsabilidad por hook                |
| Tipos           | Retornar `any`                        | Interfaces TypeScript estrictas para return |
| Deps            | Dependencias hardcodeadas             | Inyectar dependencias como parámetros       |
| Testing         | Imposible de testear                  | Separar lógica pura de side effects         |
| Composición     | Un hook gigante                       | Componer hooks pequeños                     |

### Patrones de Composición

```tsx
// ✅ Componer hooks pequeños en hooks más grandes
function useAuth() {
  const { user, loading } = useUser();
  const { token } = useSecureStore("auth_token");
  const isAuthenticated = !!user && !!token;
  return { user, loading, isAuthenticated, token };
}

// ✅ Hook con dependency injection para testing
function useFetchUser(fetcher = fetch) {
  // Ahora puedes pasar un mock en tests
}
```

---

## ✅ Checklist

- [ ] Entiendo cuándo y por qué crear un custom hook
- [ ] Puedo crear hooks genéricos con TypeScript (generics)
- [ ] Sé implementar `useFetch`, `useForm`, `useDebounce`
- [ ] Entiendo cómo los hooks manejan cleanup internamente
- [ ] Puedo componer hooks (usar hooks dentro de hooks)
