# 06 — Monorepo & Arquitectura Escalable

## 🎯 Objetivo

Diseñar arquitecturas escalables: **monorepos con Turborepo**, estructura **feature-based**, y patrones de organización senior.

---

## 📚 Teoría

### ¿Por qué un Monorepo?

```
monorepo/
├── apps/
│   ├── mobile/          # App React Native (Expo)
│   ├── web/             # App Next.js
│   └── admin/           # Panel de admin
├── packages/
│   ├── ui/              # Componentes compartidos
│   ├── api-client/      # Cliente API tipado
│   ├── config/          # ESLint, Prettier, TS
│   └── types/           # Tipos compartidos
├── turbo.json
└── pnpm-workspace.yaml
```

### Setup

```bash
npx create-turbo@latest my-monorepo
cd my-monorepo && pnpm install
```

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

```json
// turbo.json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "dependsOn": ["build"] }
  }
}
```

---

## 💻 Arquitecturas de Proyecto

### Arquitectura 1: Feature-Based (Recomendada)

```
apps/mobile/src/
├── features/                    # Cada feature es independiente
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── services/authService.ts
│   │   ├── store/authSlice.ts
│   │   ├── types/auth.types.ts
│   │   └── index.ts            # Public API (barrel)
│   ├── products/
│   └── cart/
│
├── shared/                      # Compartido entre features
│   ├── components/              # UI genérica (Button, Card)
│   ├── hooks/                   # useFetch, useDebounce
│   ├── lib/                     # api client, storage
│   └── constants/               # Colores, endpoints
│
├── app/                         # Expo Router (solo routing)
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   └── index.tsx            # import from @/features/home
│   └── auth/login.tsx
│
└── providers/                   # Context providers
    └── AppProviders.tsx
```

### Reglas de Importación

```
✅ Features → shared/
✅ Features → providers
❌ Features → OTRAS features
❌ app/ no tiene lógica, solo importa de features/
✅ 2 features comparten → extraer a shared/
```

### Ejemplo: Feature Component con NativeWind

```tsx
// features/auth/components/LoginForm.tsx
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-white text-center mb-8">
        Iniciar Sesión
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#475569"
        className="bg-surface rounded-xl p-4 text-white border border-slate-700 mb-3"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#475569"
        secureTextEntry
        className="bg-surface rounded-xl p-4 text-white border border-slate-700 mb-4"
      />

      {error && (
        <View className="bg-red-500/10 p-3 rounded-lg mb-4">
          <Text className="text-red-400 text-sm text-center">{error}</Text>
        </View>
      )}

      <Pressable
        onPress={() => login(email, password)}
        disabled={loading}
        className={`py-4 rounded-xl items-center ${loading ? "bg-primary/50" : "bg-primary active:opacity-80"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Entrar</Text>
        )}
      </Pressable>
    </View>
  );
}
```

### Ejemplo: Barrel Export

```tsx
// features/auth/index.ts — Public API
export { LoginForm } from "./components/LoginForm";
export { useAuth } from "./hooks/useAuth";
export type { User, AuthState } from "./types/auth.types";
// ❌ NO exportar internals
```

### Compose Providers

```tsx
// providers/AppProviders.tsx
import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { AuthProvider } from "@/features/auth";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView className="flex-1">
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
```

### Absolute Imports

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Refactor Feature-Based

Toma una app monolítica y refactorízala a feature-based con barrel exports.

### Ejercicio 2: Monorepo Setup

Turborepo con: app mobile (Expo) + paquete `ui` + paquete `api-client`.

### Ejercicio 3: Clean Architecture

Implementa Products con domain/data/presentation. UseCase sin depender de React.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                           | ✅ Bueno                                       |
| -------- | --------------------------------- | ---------------------------------------------- |
| Deps     | Cada package con sus deps         | Hoist deps comunes al root                     |
| Config   | Config duplicada en cada package  | Shared configs en `packages/config`            |
| Circular | Package A importa B que importa A | Extraer código compartido a package C          |
| Build    | Rebuilds completos                | Turborepo `turbo run build` con cache          |
| Types    | Sin exports de types              | `exports` map en package.json para types       |
| Testing  | Tests aislados sin integración    | CI corre tests de todos los packages afectados |

### Estructura Feature-Based

```
src/
├── features/
│   ├── auth/
│   │   ├── components/     ← Solo componentes de auth
│   │   ├── hooks/          ← useAuth, useLogin
│   │   ├── screens/        ← LoginScreen, RegisterScreen
│   │   ├── services/       ← authApi.ts
│   │   └── types/          ← auth.types.ts
│   ├── products/
│   └── cart/
├── shared/
│   ├── components/         ← Button, Card, Input (reutilizables)
│   ├── hooks/              ← useDebounce, useFetch
│   └── utils/              ← formatDate, formatCurrency
└── app/                    ← Expo Router routes
```

---

## ✅ Checklist

- [ ] Entiendo cuándo usar monorepo y cuándo no
- [ ] Sé configurar Turborepo con pnpm workspaces
- [ ] Puedo organizar código feature-based
- [ ] Entiendo las reglas de importación entre features
- [ ] Sé usar barrel exports para APIs públicas
- [ ] Puedo componer múltiples providers
