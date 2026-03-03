# React Native MMKV 4.1

> Storage **ultra-rápido** — 30x más rápido que AsyncStorage. Síncrono, cifrado opcional, tipado.

## 📦 Instalación

```bash
npx expo install react-native-mmkv
```

> ⚠️ MMKV requiere **custom dev client** (no funciona en Expo Go).

---

## 🔑 MMKV vs AsyncStorage

| Característica | AsyncStorage    | MMKV                            |
| -------------- | --------------- | ------------------------------- |
| Velocidad      | ⚠️ Async (~5ms) | ✅ Síncrono (~0.05ms)           |
| API            | Async (await)   | **Síncrono**                    |
| Cifrado        | ❌              | ✅ AES-256                      |
| Tipos nativos  | Solo strings    | String, number, boolean, Buffer |
| Tamaño max     | ~6MB            | Sin límite práctico             |
| Multi-process  | ❌              | ✅                              |

---

## 💻 Ejemplos

### 1. Uso Básico

```tsx
import { MMKV } from "react-native-mmkv";

// Crear instancia
const storage = new MMKV();

// Guardar — síncrono, sin await
storage.set("user.name", "Elena");
storage.set("user.age", 28);
storage.set("user.premium", true);
storage.set("user.settings", JSON.stringify({ theme: "dark", lang: "es" }));

// Leer
const name = storage.getString("user.name"); // 'Elena'
const age = storage.getNumber("user.age"); // 28
const isPremium = storage.getBoolean("user.premium"); // true
const settings = JSON.parse(storage.getString("user.settings") ?? "{}");

// Verificar existencia
storage.contains("user.name"); // true

// Eliminar
storage.delete("user.age");

// Limpiar todo
storage.clearAll();

// Listar keys
const allKeys = storage.getAllKeys(); // ['user.name', 'user.premium', ...]
```

### 2. Hook useMMKVStorage

```tsx
// hooks/useMMKV.ts
import { useState, useCallback } from "react";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export function useMMKVString(key: string, defaultValue = "") {
  const [value, setValue] = useState(
    () => storage.getString(key) ?? defaultValue,
  );

  const set = useCallback(
    (newValue: string) => {
      storage.set(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  const remove = useCallback(() => {
    storage.delete(key);
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, set, remove] as const;
}

export function useMMKVObject<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = storage.getString(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  const set = useCallback(
    (newValue: T) => {
      storage.set(key, JSON.stringify(newValue));
      setValue(newValue);
    },
    [key],
  );

  return [value, set] as const;
}
```

```tsx
// Uso
import { View, Text, Pressable } from "react-native";
import { useMMKVObject } from "@/hooks/useMMKV";

export default function SettingsScreen() {
  const [settings, setSettings] = useMMKVObject("settings", {
    darkMode: true,
    notifications: true,
    language: "es",
  });

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Pressable
        onPress={() =>
          setSettings({ ...settings, darkMode: !settings.darkMode })
        }
        className="bg-surface p-4 rounded-xl flex-row justify-between items-center"
      >
        <Text className="text-white text-base">Dark Mode</Text>
        <Text className="text-2xl">{settings.darkMode ? "🌙" : "☀️"}</Text>
      </Pressable>
    </View>
  );
}
```

### 3. Storage Cifrado

```tsx
const secureStorage = new MMKV({
  id: "secure-storage",
  encryptionKey: "my-secret-key-256-bits",
});

secureStorage.set("auth.token", "eyJhbG...");
secureStorage.set("auth.refresh", "dGhpcyBpcyBh...");
```

### 4. Integrar con Zustand

```tsx
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => mmkv.delete(name),
};

export const useSettings = create(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
```

---

## 🔗 Links

- [GitHub](https://github.com/mrousavy/react-native-mmkv)
- [Documentación](https://github.com/mrousavy/react-native-mmkv#readme)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica        | ❌ Malo                      | ✅ Bueno                                                 |
| --------------- | ---------------------------- | -------------------------------------------------------- |
| Datos sensibles | Contraseñas en MMKV          | `expo-secure-store` para datos cifrados                  |
| Instancias      | Una sola instancia para todo | Instancias separadas por dominio (cache, settings, user) |
| Tamaño          | Guardar objetos enormes      | Solo datos < 1MB, SQLite para más                        |
| Listeners       | No reaccionar a cambios      | `useMMKVString/Boolean/Number` para reactivo             |
| Cifrado         | Sin cifrado                  | `MMKV({ encryptionKey })` para datos sensibles           |

---

## ✅ Checklist

- [ ] Sé instalar MMKV con custom dev client
- [ ] Puedo guardar/leer strings, numbers y booleans (síncrono)
- [ ] Sé guardar objetos con `JSON.stringify/parse`
- [ ] Puedo usar cifrado AES-256
- [ ] Sé integrar MMKV con Zustand persist middleware
