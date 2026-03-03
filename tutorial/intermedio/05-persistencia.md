# 05 — AsyncStorage & Persistencia

## 🎯 Objetivo

Persistir datos localmente con **AsyncStorage**: configuración de usuario, carrito, tokens de sesión. Entender cuándo usar storage local vs remoto.

---

## 📚 Teoría

### ¿Qué es AsyncStorage?

Sistema de almacenamiento **clave-valor asíncrono**, persistente y no cifrado. Ideal para datos pequeños.

### Instalación

```bash
npx expo install @react-native-async-storage/async-storage
```

### API

| Método                   | Descripción                     |
| ------------------------ | ------------------------------- |
| `setItem(key, value)`    | Guardar (value debe ser string) |
| `getItem(key)`           | Leer (devuelve string o null)   |
| `removeItem(key)`        | Eliminar                        |
| `multiSet([[k,v], ...])` | Guardar múltiples               |
| `multiGet([keys])`       | Leer múltiples                  |
| `clear()`                | Borrar todo                     |

> ⚠️ **Solo almacena strings**. Usa `JSON.stringify()` / `JSON.parse()` para objetos.

---

## 💻 Código Práctico

### Ejemplo 1: Guardar/Cargar Configuración

```tsx
import { View, Text, Pressable, Switch } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  language: string;
}

const DEFAULTS: Settings = {
  darkMode: true,
  notifications: true,
  language: "es",
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("settings").then((data) => {
      if (data) setSettings(JSON.parse(data));
      setLoaded(true);
    });
  }, []);

  const updateSetting = async <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await AsyncStorage.setItem("settings", JSON.stringify(updated));
  };

  if (!loaded) return null;

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">
        ⚙️ Configuración
      </Text>

      <View className="bg-surface rounded-2xl overflow-hidden">
        <SettingRow
          label="Dark Mode"
          emoji="🌙"
          right={
            <Switch
              value={settings.darkMode}
              onValueChange={(v) => updateSetting("darkMode", v)}
              trackColor={{ false: "#334155", true: "#7c3aed" }}
            />
          }
        />
        <SettingRow
          label="Notificaciones"
          emoji="🔔"
          right={
            <Switch
              value={settings.notifications}
              onValueChange={(v) => updateSetting("notifications", v)}
              trackColor={{ false: "#334155", true: "#7c3aed" }}
            />
          }
        />
        <SettingRow
          label="Idioma"
          emoji="🌐"
          right={
            <Pressable
              onPress={() =>
                updateSetting(
                  "language",
                  settings.language === "es" ? "en" : "es",
                )
              }
              className="bg-slate-700 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">
                {settings.language.toUpperCase()}
              </Text>
            </Pressable>
          }
        />
      </View>

      <Pressable
        onPress={async () => {
          await AsyncStorage.removeItem("settings");
          setSettings(DEFAULTS);
        }}
        className="mt-6 bg-red-500/20 py-4 rounded-xl items-center"
      >
        <Text className="text-red-400 font-semibold">
          🗑 Resetear configuración
        </Text>
      </Pressable>
    </View>
  );
}

function SettingRow({
  label,
  emoji,
  right,
}: {
  label: string;
  emoji: string;
  right: React.ReactNode;
}) {
  return (
    <View className="flex-row justify-between items-center p-4 border-b border-slate-800">
      <View className="flex-row items-center gap-3">
        <Text className="text-xl">{emoji}</Text>
        <Text className="text-white text-base">{label}</Text>
      </View>
      {right}
    </View>
  );
}
```

### Ejemplo 2: Hook useStorage Reutilizable

```tsx
// hooks/useStorage.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(key).then((data) => {
      if (data) setValue(JSON.parse(data));
      setLoading(false);
    });
  }, [key]);

  const setStoredValue = async (newValue: T | ((prev: T) => T)) => {
    const resolved = newValue instanceof Function ? newValue(value) : newValue;
    setValue(resolved);
    await AsyncStorage.setItem(key, JSON.stringify(resolved));
  };

  const removeValue = async () => {
    setValue(defaultValue);
    await AsyncStorage.removeItem(key);
  };

  return { value, setValue: setStoredValue, removeValue, loading };
}

// Uso:
// const { value: todos, setValue: setTodos, loading } = useStorage<Todo[]>('todos', []);
```

---

## 📝 Ejercicios

### Ejercicio 1: Onboarding Persistente

Muestra pantalla de onboarding solo la primera vez. Guardar flag `hasSeenOnboarding` en AsyncStorage.

### Ejercicio 2: Lista de Favoritos

Guardar/cargar favoritos de AsyncStorage. Botón ❤️ que persiste entre sesiones.

### Ejercicio 3: Cache de API

Guardar respuestas de API en AsyncStorage con timestamp. Si la data tiene <5 min, mostrar cache.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica        | ❌ Malo                         | ✅ Bueno                                    |
| --------------- | ------------------------------- | ------------------------------------------- |
| Librería        | AsyncStorage para todo          | MMKV (30x más rápido, síncrono)             |
| Datos sensibles | Tokens en AsyncStorage/MMKV     | `expo-secure-store` para tokens y passwords |
| Serialización   | `JSON.stringify` manual         | MMKV tipado o wrapper con generics          |
| Tamaño          | Guardar listas enormes en local | Solo guardar IDs, cache en TanStack Query   |
| Keys            | Keys sin prefijo `user_name`    | Prefijo de dominio `app:user:name`          |
| Migración       | Cambiar structure sin migrar    | Versionar el schema y migrar datos          |

### Cuándo usar cada solución

```
MMKV           → Cache rápido, settings, flags (síncrono, ultra rápido)
SecureStore    → Tokens, credenciales, API keys (cifrado nativo)
AsyncStorage   → Legacy — migrar a MMKV
SQLite         → Datos relacionales complejos (offline-first, queries SQL)
TanStack Query → Cache de servidor (automático con staleTime + gcTime)
```

### Persistencia + Zustand

```tsx
// ✅ Zustand con MMKV persist — la mejor combinación
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandMMKVStorage } from "./mmkv-storage";

const useStore = create(
  persist((set) => ({ theme: "dark", setTheme: (t) => set({ theme: t }) }), {
    name: "app-settings",
    storage: createJSONStorage(() => zustandMMKVStorage),
  }),
);
// El estado se persiste automáticamente y se rehidrata al abrir la app
```

---

## ✅ Checklist

- [ ] Sé instalar y usar AsyncStorage
- [ ] Puedo guardar/cargar objetos con JSON.stringify/parse
- [ ] Sé crear un hook `useStorage` reutilizable
- [ ] Entiendo cuándo usar storage local vs remoto
- [ ] Puedo limpiar storage selectivamente o completamente
