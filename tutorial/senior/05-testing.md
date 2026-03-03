# 05 — Testing (Vitest + React Native Testing Library)

## 🎯 Objetivo

Escribir **tests unitarios**, **de integración** y **de componentes** con **Vitest** y **React Native Testing Library (RNTL)** para garantizar calidad en tu código.

---

## 📚 Teoría

### ¿Por qué Vitest en 2026?

| Característica | Jest               | Vitest                                 |
| -------------- | ------------------ | -------------------------------------- |
| Velocidad      | ⚠️ Media           | ✅ Blazing fast (powered by Vite)      |
| HMR en tests   | ❌                 | ✅ Re-ejecuta solo los tests afectados |
| ESM nativo     | ⚠️ Parcial         | ✅ Native ESM                          |
| API compatible | ✅ Estándar        | ✅ Compatible con Jest API             |
| Configuración  | `jest.config.js`   | `vitest.config.ts`                     |
| Watch mode     | ✅                 | ✅ Más rápido                          |
| TypeScript     | Necesita `ts-jest` | ✅ Nativo                              |

### Pirámide de Testing

```
          /\
         /  \     E2E (Detox, Maestro)
        /    \    → Flujos completos en dispositivo
       /------\
      /        \  Integration (RNTL)
     /          \ → Componentes + interacciones
    /            \
   /--------------\  Unit (Vitest)
  /                \ → Funciones puras, hooks, utils
 /                  \
```

### Setup con Expo + Vitest

```bash
npm install -D vitest @testing-library/react-native @testing-library/jest-dom
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/types/**"],
    },
  },
});
```

```typescript
// test/setup.ts
import "@testing-library/jest-dom";

// Mock de react-native
vi.mock("react-native", async () => {
  const actual = await vi.importActual("react-native");
  return { ...actual };
});
```

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

---

## 💻 Código Práctico

### Ejemplo 1: Tests Unitarios (Funciones Puras)

```tsx
// utils/helpers.ts
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function filterByQuery<T extends { name: string }>(
  items: T[],
  query: string,
): T[] {
  if (!query.trim()) return items;
  return items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
}

export function calculateTotal(
  items: { price: number; quantity: number }[],
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

```tsx
// __tests__/helpers.test.ts
import { describe, it, expect } from "vitest";
import { formatPrice, filterByQuery, calculateTotal } from "../utils/helpers";

describe("formatPrice", () => {
  it("formatea un precio entero", () => {
    expect(formatPrice(10)).toBe("$10.00");
  });

  it("formatea un precio con decimales", () => {
    expect(formatPrice(9.99)).toBe("$9.99");
  });

  it("formatea cero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("filterByQuery", () => {
  const items = [
    { name: "React Native" },
    { name: "Flutter" },
    { name: "React Web" },
  ];

  it("filtra por query", () => {
    expect(filterByQuery(items, "react")).toHaveLength(2);
  });

  it("devuelve todos si query está vacío", () => {
    expect(filterByQuery(items, "")).toHaveLength(3);
  });

  it("es case-insensitive", () => {
    expect(filterByQuery(items, "FLUTTER")).toHaveLength(1);
  });

  it("devuelve vacío si no hay match", () => {
    expect(filterByQuery(items, "SwiftUI")).toHaveLength(0);
  });
});

describe("calculateTotal", () => {
  it("calcula el total correctamente", () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];
    expect(calculateTotal(items)).toBe(35);
  });

  it("devuelve 0 para array vacío", () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

### Ejemplo 2: Tests de Componentes con RNTL

```tsx
// components/Counter.tsx
import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text testID="count-display" className="text-5xl font-bold text-white">
        {count}
      </Text>
      <View className="flex-row gap-4 mt-6">
        <Pressable
          testID="increment-btn"
          onPress={() => setCount((p) => p + 1)}
          className="bg-green-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">+</Text>
        </Pressable>
        <Pressable
          testID="decrement-btn"
          onPress={() => setCount((p) => p - 1)}
          className="bg-red-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">−</Text>
        </Pressable>
        <Pressable
          testID="reset-btn"
          onPress={() => setCount(initial)}
          className="bg-slate-700 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

```tsx
// __tests__/Counter.test.tsx
import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react-native";
import Counter from "../components/Counter";

describe("Counter", () => {
  it("muestra el valor inicial por defecto (0)", () => {
    render(<Counter />);
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
  });

  it("acepta un valor inicial custom", () => {
    render(<Counter initial={10} />);
    expect(screen.getByTestId("count-display")).toHaveTextContent("10");
  });

  it("incrementa al presionar +", () => {
    render(<Counter />);
    fireEvent.press(screen.getByTestId("increment-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("1");
  });

  it("decrementa al presionar −", () => {
    render(<Counter initial={5} />);
    fireEvent.press(screen.getByTestId("decrement-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("4");
  });

  it("resetea al valor inicial", () => {
    render(<Counter initial={10} />);
    fireEvent.press(screen.getByTestId("increment-btn"));
    fireEvent.press(screen.getByTestId("increment-btn"));
    fireEvent.press(screen.getByTestId("reset-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("10");
  });
});
```

### Ejemplo 3: Testing Async + Mocks con `vi`

```tsx
// __tests__/UsersList.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react-native";
import UsersList from "../components/UsersList";

// Mock de fetch con vi (no jest)
global.fetch = vi.fn();

const mockUsers = [
  { id: 1, name: "Ana García", email: "ana@test.com" },
  { id: 2, name: "Carlos López", email: "carlos@test.com" },
];

beforeEach(() => {
  vi.mocked(fetch).mockClear();
});

describe("UsersList", () => {
  it("muestra loading inicialmente", () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));
    render(<UsersList />);
    expect(screen.getByText("Cargando...")).toBeTruthy();
  });

  it("muestra usuarios después de cargar", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    render(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText("Ana García")).toBeTruthy();
      expect(screen.getByText("Carlos López")).toBeTruthy();
    });
  });

  it("muestra error si falla", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
    render(<UsersList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });
});
```

### Ejemplo 4: Testing Custom Hooks

```tsx
// __tests__/useCounter.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-native";
import { useCounter } from "../hooks/useCounter";

describe("useCounter", () => {
  it("inicia con el valor por defecto", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("incrementa", () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => result.current.increment());
    expect(result.current.count).toBe(6);
  });

  it("resetea al valor inicial", () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(10);
  });
});
```

---

## 🔑 Vitest vs Jest — Cheatsheet

| Jest                             | Vitest                         |
| -------------------------------- | ------------------------------ |
| `jest.fn()`                      | `vi.fn()`                      |
| `jest.mock('module')`            | `vi.mock('module')`            |
| `jest.spyOn(obj, 'method')`      | `vi.spyOn(obj, 'method')`      |
| `jest.useFakeTimers()`           | `vi.useFakeTimers()`           |
| `jest.advanceTimersByTime(1000)` | `vi.advanceTimersByTime(1000)` |
| `jest.mocked(fn)`                | `vi.mocked(fn)`                |
| `jest.clearAllMocks()`           | `vi.clearAllMocks()`           |
| `expect.any(Number)`             | `expect.any(Number)` (igual)   |

---

## 📝 Ejercicios

### Ejercicio 1: Test Suite para Login

Testa LoginForm: validación, estados de error, submit exitoso, loading.

### Ejercicio 2: Mock de AsyncStorage

Testa componente que lee/escribe de AsyncStorage. Usa `vi.mock`.

### Ejercicio 3: Snapshot Tests

Snapshot tests para 3 componentes UI. Verifica que no cambien inesperadamente.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica    | ❌ Malo                          | ✅ Bueno                                                 |
| ----------- | -------------------------------- | -------------------------------------------------------- |
| Coverage    | 100% coverage a toda costa       | 80% coverage enfocado en lógica crítica                  |
| Qué testear | Testear implementación           | Testear comportamiento del usuario                       |
| Mocks       | Mockear todo                     | Mock solo external deps (API, storage, navigation)       |
| Selectors   | `getByTestId` para todo          | `getByRole`, `getByText`, `getByPlaceholderText` primero |
| Async       | `setTimeout` en tests            | `waitFor`, `findBy*` de RNTL                             |
| Snapshots   | Snapshots como tests principales | Snapshots solo como complemento, no como test principal  |

### Pirámide de Tests

```
          /  E2E  \          ← Detox/Maestro (pocos, lentos, costosos)
         /  Integración \     ← RNTL (renderizar pantallas completas)
        /   Unitarios    \    ← Vitest (hooks, utils, lógica pura)
       ────────────────────   ← Muchos, rápidos, baratos
```

### Qué testear y qué NO

```
✅ Testear:
  - Hooks personalizados con lógica
  - Funciones de utilidad
  - Componentes con lógica condicional
  - Flujos de usuario (login, checkout)

❌ No testear:
  - Componentes puramente visuales (testear visualmente)
  - Librerías de terceros
  - Código generado
  - Estilos CSS/NativeWind
```

---

## ✅ Checklist

- [ ] Sé configurar Vitest con React Native
- [ ] Puedo escribir tests unitarios con `describe`, `it`, `expect`
- [ ] Sé testar componentes con `render`, `fireEvent`, `screen`
- [ ] Puedo testar código asíncrono con `waitFor`
- [ ] Sé mockear con `vi.fn()`, `vi.mock()`, `vi.spyOn()`
- [ ] Puedo testar custom hooks con `renderHook`
- [ ] Conozco las diferencias con Jest (`vi.*` vs `jest.*`)
