# Expo SecureStore

> Almacenamiento **seguro y cifrado** — ideal para tokens, credenciales, y datos sensibles. Usa Keychain (iOS) y EncryptedSharedPreferences (Android).

## 📦 Instalación

```bash
npx expo install expo-secure-store
```

---

## 🔑 SecureStore vs AsyncStorage vs MMKV

|               | AsyncStorage    | MMKV         | SecureStore           |
| ------------- | --------------- | ------------ | --------------------- |
| Cifrado       | ❌              | Opcional     | ✅ Siempre            |
| Velocidad     | Lento           | Ultra rápido | Medio                 |
| Capacidad     | ~6MB            | Sin límite   | ~2KB por valor        |
| Uso principal | Datos generales | Cache rápido | **Tokens, passwords** |
| Síncrono      | ❌              | ✅           | ❌                    |

---

## 💻 Ejemplos

### 1. Guardar y Leer Tokens

```tsx
import * as SecureStore from "expo-secure-store";

// Guardar token
const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("auth_token", token);
};

// Leer token
const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("auth_token");
};

// Eliminar token
const removeToken = async () => {
  await SecureStore.deleteItemAsync("auth_token");
};
```

### 2. Hook useSecureStore

```tsx
// hooks/useSecureStore.ts
import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

export function useSecureStore(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(key)
      .then(setValue)
      .finally(() => setLoading(false));
  }, [key]);

  const save = useCallback(
    async (newValue: string) => {
      await SecureStore.setItemAsync(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  const remove = useCallback(async () => {
    await SecureStore.deleteItemAsync(key);
    setValue(null);
  }, [key]);

  return { value, save, remove, loading };
}
```

### 3. Auth Token Manager

```tsx
import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const TokenManager = {
  async save(auth: string, refresh: string) {
    await Promise.all([
      SecureStore.setItemAsync(AUTH_TOKEN_KEY, auth),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh),
    ]);
  },

  async getAuth(): Promise<string | null> {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },

  async getRefresh(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(AUTH_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica  | ❌ Malo                     | ✅ Bueno                                          |
| --------- | --------------------------- | ------------------------------------------------- |
| Tamaño    | Guardar objetos grandes     | Solo tokens, keys, passwords (< 2KB)              |
| Keys      | Keys genéricas `'token'`    | Prefijo descriptivo `'auth:access_token'`         |
| Fallback  | Crash si falla              | `try/catch` con fallback a re-login               |
| Biometric | Sin protección extra        | `requireAuthentication: true` para datos críticos |
| Logout    | No limpiar al cerrar sesión | `deleteItemAsync` para cada key al logout         |

---

## ✅ Checklist

- [ ] Sé cuándo usar SecureStore vs AsyncStorage vs MMKV
- [ ] Puedo guardar, leer y eliminar datos seguros
- [ ] Sé crear un hook `useSecureStore` reutilizable
- [ ] Puedo gestionar tokens de auth de forma segura
