# 🏗️ Microfrontend Web — Guía Senior 2026

> **Arquitectura Microfrontend para la Web** con **Vite**, **Module Federation**, **React** y **Vue** — ejemplo práctico de un **e-commerce** modular.

---

## 📑 Tabla de Contenidos

1. [¿Qué es un Microfrontend?](#-qué-es-un-microfrontend)
2. [¿Por qué Microfrontends en 2026?](#-por-qué-microfrontends-en-2026)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Arquitectura del E-commerce](#-arquitectura-del-e-commerce)
5. [Estructura del Monorepo](#-estructura-del-monorepo)
6. [Setup Inicial](#-setup-inicial)
7. [Configuración de Vite + Module Federation](#-configuración-de-vite--module-federation)
8. [Ejemplo Práctico: E-commerce](#-ejemplo-práctico-e-commerce)
9. [Comunicación entre Microfrontends](#-comunicación-entre-microfrontends)
10. [Shared Dependencies](#-shared-dependencies)
11. [Routing Federado](#-routing-federado)
12. [Testing](#-testing)
13. [CI/CD & Deploy](#-cicd--deploy)
14. [Buenas Prácticas Senior 2026](#-buenas-prácticas-senior-2026)
15. [Anti-patterns](#-anti-patterns)
16. [Performance](#-performance)
17. [Observabilidad](#-observabilidad)
18. [Recursos](#-recursos)

---

## 🧩 ¿Qué es un Microfrontend?

Un **microfrontend** extiende el concepto de microservicios al frontend. Cada equipo posee un **vertical completo** (desde UI hasta la API) de una funcionalidad de negocio, desplegable de forma **independiente**.

```
┌─────────────────────────────────────────────────────┐
│                    SHELL (Host)                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Catálogo │  │ Carrito  │  │ Checkout/Pagos    │  │
│  │ (React)  │  │  (Vue)   │  │    (React)        │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│                                                     │
│  Shared: Design System · Auth · Event Bus · Router  │
└─────────────────────────────────────────────────────┘
```

### Principios clave

| Principio                       | Descripción                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| **Independencia de equipo**     | Cada micro-app tiene su propio repo/carpeta, CI/CD y stack  |
| **Aislamiento de runtime**      | No comparten estado global; se comunican por contratos      |
| **Composición en el navegador** | El Shell carga los remotes en runtime vía Module Federation |
| **Deploy independiente**        | Un cambio en "Carrito" NO requiere re-deploy de "Catálogo"  |

---

## 🚀 ¿Por qué Microfrontends en 2026?

| Necesidad                  | Cómo lo resuelve                                       |
| -------------------------- | ------------------------------------------------------ |
| Equipos grandes (>15 devs) | Ownership claro por dominio de negocio                 |
| Mix de tecnologías         | React para catálogo, Vue para carrito — sin conflictos |
| Releases frecuentes        | Deploy de un micro sin tocar los demás                 |
| Escalabilidad de build     | Builds paralelos, cache distribuido (Nx / Turborepo)   |
| Migración gradual          | Reescribir una app legacy pieza por pieza              |

> **⚠️ Nota:** Si tu equipo es pequeño (<5 devs) y la app no es compleja, un **monolito modular** sigue siendo la mejor opción. Microfrontend añade complejidad operacional.

---

## 🛠 Stack Tecnológico

| Herramienta                 | Versión | Rol                               |
| --------------------------- | ------- | --------------------------------- |
| **Vite**                    | 6.x     | Bundler + Dev Server              |
| **@module-federation/vite** | 1.x     | Module Federation para Vite       |
| **React**                   | 19.x    | UI del Shell, Catálogo y Checkout |
| **Vue**                     | 3.5+    | UI del Carrito                    |
| **TypeScript**              | 5.7+    | Tipado estático                   |
| **pnpm**                    | 9.x     | Package manager (workspaces)      |
| **Vitest**                  | 3.x     | Testing                           |
| **Biome**                   | 1.x     | Linter + Formatter                |
| **Nx**                      | 20.x    | Monorepo orchestrator (opcional)  |

---

## 🏛 Arquitectura del E-commerce

```
                        ┌──────────────────┐
                        │   CDN / Nginx    │
                        │  (entry point)   │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │   Shell (Host)   │
                        │   React 19       │
                        │   Puerto: 3000   │
                        └──┬─────┬─────┬───┘
                           │     │     │
               ┌───────────┘     │     └────────────┐
               │                 │                  │
      ┌────────▼───────┐ ┌──────▼───────┐ ┌────────▼───────┐
      │   Catálogo     │ │   Carrito    │ │   Checkout     │
      │   React 19     │ │   Vue 3.5    │ │   React 19     │
      │   Puerto: 3001 │ │   Puerto: 3002│ │   Puerto: 3003 │
      └────────────────┘ └──────────────┘ └────────────────┘

      ■ Shared: @ecommerce/ui · @ecommerce/auth · @ecommerce/events
```

### Dominios de Negocio

| Microfrontend    | Framework | Responsabilidad                                  |
| ---------------- | --------- | ------------------------------------------------ |
| **shell-app**    | React 19  | Layout, routing global, navbar, auth wrapper     |
| **catalog-app**  | React 19  | Listado de productos, búsqueda, filtros, detalle |
| **cart-app**     | Vue 3.5   | Carrito de compras, gestión de cantidades        |
| **checkout-app** | React 19  | Proceso de pago, dirección, confirmación         |

---

## 📁 Estructura del Monorepo

```
microfrontend-web/
├── apps/
│   ├── shell-app/              # Host — React 19
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── bootstrap.tsx    # Dynamic import (Module Federation)
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── routes.tsx
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── catalog-app/            # Remote — React 19
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ProductList.tsx
│   │   │   │   └── ProductDetail.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   └── hooks/
│   │   │       └── useProducts.ts
│   │   └── vite.config.ts
│   │
│   ├── cart-app/               # Remote — Vue 3.5
│   │   ├── src/
│   │   │   ├── App.vue
│   │   │   ├── components/
│   │   │   │   ├── CartItem.vue
│   │   │   │   └── CartSummary.vue
│   │   │   ├── composables/
│   │   │   │   └── useCart.ts
│   │   │   └── store/
│   │   │       └── cart.ts      # Pinia store
│   │   └── vite.config.ts
│   │
│   └── checkout-app/           # Remote — React 19
│       ├── src/
│       │   ├── App.tsx
│       │   ├── steps/
│       │   │   ├── AddressStep.tsx
│       │   │   ├── PaymentStep.tsx
│       │   │   └── ConfirmationStep.tsx
│       │   └── hooks/
│       │       └── useCheckout.ts
│       └── vite.config.ts
│
├── packages/
│   ├── ui/                     # Design System compartido
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── events/                 # Event Bus tipado
│   │   ├── src/
│   │   │   ├── bus.ts
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   ├── auth/                   # Auth compartido
│   │   ├── src/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── useAuth.ts
│   │   └── package.json
│   │
│   └── shared-types/           # Tipos compartidos
│       ├── src/
│       │   ├── product.ts
│       │   ├── cart.ts
│       │   └── user.ts
│       └── package.json
│
├── pnpm-workspace.yaml
├── package.json
├── nx.json                     # (opcional)
├── vitest.workspace.ts
├── biome.json
├── tsconfig.base.json
└── README.md
```

---

## ⚡ Setup Inicial

### 1. Crear el workspace

```bash
mkdir microfrontend-web && cd microfrontend-web
pnpm init
```

### 2. Configurar pnpm workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 3. Instalar dependencias raíz

```bash
pnpm add -Dw typescript vitest @biomejs/biome
```

### 4. Crear el Shell (Host) con React

```bash
# Desde la raíz
pnpm create vite apps/shell-app --template react-ts
cd apps/shell-app
pnpm add @module-federation/vite
```

### 5. Crear Catalog Remote con React

```bash
pnpm create vite apps/catalog-app --template react-ts
cd apps/catalog-app
pnpm add @module-federation/vite
```

### 6. Crear Cart Remote con Vue

```bash
pnpm create vite apps/cart-app --template vue-ts
cd apps/cart-app
pnpm add @module-federation/vite
```

### 7. Crear Checkout Remote con React

```bash
pnpm create vite apps/checkout-app --template react-ts
cd apps/checkout-app
pnpm add @module-federation/vite
```

---

## ⚙️ Configuración de Vite + Module Federation

### Shell (Host) — `apps/shell-app/vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        catalog: {
          type: "module",
          name: "catalog",
          entry: "http://localhost:3001/mf-manifest.json",
        },
        cart: {
          type: "module",
          name: "cart",
          entry: "http://localhost:3002/mf-manifest.json",
        },
        checkout: {
          type: "module",
          name: "checkout",
          entry: "http://localhost:3003/mf-manifest.json",
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
    }),
  ],
  server: { port: 3000 },
  build: { target: "esnext" },
});
```

### Catalog Remote — `apps/catalog-app/vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "catalog",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductList": "./src/pages/ProductList.tsx",
        "./ProductDetail": "./src/pages/ProductDetail.tsx",
        "./ProductCard": "./src/components/ProductCard.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
    }),
  ],
  server: { port: 3001 },
  build: { target: "esnext" },
});
```

### Cart Remote (Vue) — `apps/cart-app/vite.config.ts`

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "cart",
      filename: "remoteEntry.js",
      exposes: {
        // Exponemos un wrapper Web Component para interop React↔Vue
        "./CartWidget": "./src/CartWidget.ts",
        "./CartPage": "./src/CartPage.ts",
      },
      shared: {
        vue: { singleton: true, requiredVersion: "^3.5.0" },
      },
    }),
  ],
  server: { port: 3002 },
  build: { target: "esnext" },
});
```

### Checkout Remote — `apps/checkout-app/vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "checkout",
      filename: "remoteEntry.js",
      exposes: {
        "./CheckoutFlow": "./src/App.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
    }),
  ],
  server: { port: 3003 },
  build: { target: "esnext" },
});
```

---

## 🛒 Ejemplo Práctico: E-commerce

### Shell — `apps/shell-app/src/bootstrap.tsx`

```tsx
// ❗ El entry point REAL es bootstrap.tsx (lazy import por Module Federation)
// main.tsx solo hace: import("./bootstrap")
import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./layout/Navbar";
import { AuthProvider } from "@ecommerce/auth";
import { ErrorBoundary } from "./ErrorBoundary";

// 🔥 Remote imports — cargados en RUNTIME desde otros servidores
const CatalogApp = lazy(() => import("catalog/ProductList"));
const CartApp = lazy(() => import("cart/CartPage"));
const CheckoutApp = lazy(() => import("checkout/CheckoutFlow"));

const Loading = () => (
  <div className="loading-skeleton">Cargando módulo...</div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <ErrorBoundary fallback={<p>Error al cargar módulo</p>}>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<CatalogApp />} />
                <Route path="/product/:id" element={<CatalogApp />} />
                <Route path="/cart" element={<CartApp />} />
                <Route path="/checkout/*" element={<CheckoutApp />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
```

### Catalog — `apps/catalog-app/src/pages/ProductList.tsx`

```tsx
import { useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { eventBus } from "@ecommerce/events";
import type { Product } from "@ecommerce/shared-types";

const mockProducts: Product[] = [
  { id: "1", name: "Laptop Pro 16", price: 1299.99, image: "/laptop.webp" },
  { id: "2", name: "Mouse Ergonómico", price: 49.99, image: "/mouse.webp" },
  { id: "3", name: "Teclado Mecánico", price: 89.99, image: "/keyboard.webp" },
  { id: "4", name: 'Monitor 4K 27"', price: 399.99, image: "/monitor.webp" },
];

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddToCart = (product: Product) => {
    // 🔥 Comunicación cross-microfrontend via Event Bus
    eventBus.emit("cart:add-item", {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <section>
      <h1>Catálogo de Productos</h1>
      <input
        type="search"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </section>
  );
}
```

### Cart (Vue) — `apps/cart-app/src/components/CartItem.vue`

```vue
<script setup lang="ts">
import type { CartItem } from "@ecommerce/shared-types";

const props = defineProps<{
  item: CartItem;
}>();

const emit = defineEmits<{
  "update:quantity": [id: string, qty: number];
  remove: [id: string];
}>();
</script>

<template>
  <div class="cart-item">
    <div class="cart-item__info">
      <h3>{{ item.name }}</h3>
      <span class="cart-item__price">${{ item.price.toFixed(2) }}</span>
    </div>
    <div class="cart-item__actions">
      <button
        @click="emit('update:quantity', item.productId, item.quantity - 1)"
      >
        −
      </button>
      <span>{{ item.quantity }}</span>
      <button
        @click="emit('update:quantity', item.productId, item.quantity + 1)"
      >
        +
      </button>
      <button class="btn-remove" @click="emit('remove', item.productId)">
        🗑️
      </button>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}
</style>
```

### Cart — Vue → Web Component Wrapper (para interop con React Shell)

```typescript
// apps/cart-app/src/CartWidget.ts
// Wrapeamos la app Vue como Web Component para consumir desde React
import { defineCustomElement } from "vue";
import CartWidgetCe from "./components/CartSummary.ce.vue";

const CartWidgetElement = defineCustomElement(CartWidgetCe);

if (!customElements.get("cart-widget")) {
  customElements.define("cart-widget", CartWidgetElement);
}

export default CartWidgetElement;
```

```typescript
// apps/cart-app/src/CartPage.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

export function mount(el: HTMLElement) {
  const app = createApp(App);
  app.use(createPinia());
  app.mount(el);
  return () => app.unmount();
}

// React wrapper para usar desde el Shell
export default function CartPageWrapper() {
  const ref = React.useRef<HTMLDivElement>(null);
  const unmountRef = React.useRef<() => void>();

  React.useEffect(() => {
    if (ref.current) {
      unmountRef.current = mount(ref.current);
    }
    return () => unmountRef.current?.();
  }, []);

  return React.createElement("div", { ref });
}
```

---

## 📡 Comunicación entre Microfrontends

### Event Bus Tipado — `packages/events/src/bus.ts`

```typescript
type EventMap = {
  "cart:add-item": {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  };
  "cart:remove-item": { productId: string };
  "cart:update-quantity": { productId: string; quantity: number };
  "cart:cleared": void;
  "auth:login": { userId: string; token: string };
  "auth:logout": void;
  "checkout:started": { cartTotal: number };
  "checkout:completed": { orderId: string };
};

type EventKey = keyof EventMap;

class TypedEventBus {
  private listeners = new Map<string, Set<Function>>();

  on<K extends EventKey>(event: K, callback: (payload: EventMap[K]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Retorna función de cleanup
    return () => this.off(event, callback);
  }

  off<K extends EventKey>(event: K, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  emit<K extends EventKey>(event: K, payload: EventMap[K]) {
    this.listeners.get(event)?.forEach((cb) => cb(payload));
  }
}

// Singleton global (accesible desde cualquier micro-app)
export const eventBus =
  (window as any).__ECOMMERCE_EVENT_BUS__ ??
  ((window as any).__ECOMMERCE_EVENT_BUS__ = new TypedEventBus());
```

### 🔍 ¿Cómo funciona internamente el Event Bus?

El Event Bus es un **patrón Pub/Sub (Publish-Subscribe) puro en vanilla TypeScript** — **no usa ninguna librería externa**. Es código propio, ~40 líneas.

#### Anatomía paso a paso

```typescript
class TypedEventBus {
  // 1️⃣ Un Map donde cada key es un evento y el value es un Set de callbacks
  private listeners = new Map<string, Set<Function>>();
  //     "cart:add-item" → [callback1, callback2, ...]
  //     "auth:logout"   → [callback3, ...]

  // 2️⃣ on() — Registra un listener (suscripción)
  on(event, callback) {
    this.listeners.get(event)!.add(callback); // Agrega al Set
    return () => this.off(event, callback); // Retorna cleanup
  }

  // 3️⃣ emit() — Dispara el evento (publicación)
  emit(event, payload) {
    // Ejecuta TODOS los callbacks registrados para ese evento
    this.listeners.get(event)?.forEach((cb) => cb(payload));
  }

  // 4️⃣ off() — Remueve un listener
  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }
}
```

#### El truco clave: **Singleton en `window`**

```typescript
// ❓ ¿Por qué window?
// Porque React y Vue corren en bundles SEPARADOS,
// pero comparten el MISMO objeto window del navegador.

export const eventBus =
  window.__ECOMMERCE_EVENT_BUS__ ?? // ¿Ya existe? Úsalo
  (window.__ECOMMERCE_EVENT_BUS__ = new TypedEventBus()); // Si no, créalo

// ✅ Resultado: Catálogo (React) y Carrito (Vue) acceden al MISMO bus
```

```
┌────────────────────────────────────────────────────────┐
│                    window (navegador)                   │
│                                                        │
│   window.__ECOMMERCE_EVENT_BUS__ = TypedEventBus {}    │
│                    ▲              ▲                     │
│                    │              │                     │
│   ┌────────────────┘              └──────────────────┐  │
│   │                                                  │  │
│   │  Catálogo (React)           Carrito (Vue)        │  │
│   │  eventBus.emit(             eventBus.on(         │  │
│   │    "cart:add-item",           "cart:add-item",   │  │
│   │    { productId, ... }         (payload) => {     │  │
│   │  )                              addItem(payload) │  │
│   │                               })                 │  │
│   └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

#### ¿Por qué NO usa una librería?

| Alternativa                  | Por qué **no** la usamos                                                 |
| ---------------------------- | ------------------------------------------------------------------------ |
| **Redux/Zustand compartido** | ❌ Acopla los micros — si actualizas Redux en uno, rompes los demás      |
| **RxJS**                     | ❌ Overkill para este caso, agrega ~30KB al bundle                       |
| **CustomEvent (DOM nativo)** | ⚠️ Funciona, pero pierde el type-safety del payload                      |
| **mitt / EventEmitter3**     | ✅ Son buenas (~200 bytes), pero para fines didácticos lo hicimos manual |

> **💡 Consejo senior:** En producción, podrías reemplazar `TypedEventBus` por **mitt** (~200B) sin cambiar la interfaz. La abstracción ya está desacoplada.

#### Flujo completo de un `emit`

```
1. Usuario hace clic en "Agregar al carrito" en el Catálogo (React, :3001)
                    │
2. ProductList.tsx llama:
   eventBus.emit("cart:add-item", { productId: "1", name: "Laptop", ... })
                    │
3. El Event Bus itera el Set de listeners de "cart:add-item"
                    │
4. El Pinia store del Carrito (Vue, :3002) tiene un listener registrado:
   eventBus.on("cart:add-item", (payload) => addItem(payload))
                    │
5. Vue reactivamente actualiza la UI del carrito
                    │
6. El store emite de vuelta:
   eventBus.emit("cart:updated", { items, total, itemCount })
                    │
7. El Shell (React, :3000) escucha "cart:updated" y actualiza el badge 🛒 del Navbar
```

### Patrones de Comunicación

| Patrón                  | Cuándo usarlo                             | Ejemplo                                |
| ----------------------- | ----------------------------------------- | -------------------------------------- |
| **Event Bus**           | Comunicación loosely-coupled entre micros | Catálogo → Carrito: "agregar producto" |
| **Custom Events (DOM)** | Interop con Web Components                | Vue cart → React shell                 |
| **URL/Query params**    | Estado serializable en la URL             | Filtros de búsqueda, paginación        |
| **Shared Store**        | Estado que TODOS necesitan (auth, tema)   | Token de usuario, preferencias         |
| **Props/Attributes**    | Datos parent → child al montar el remote  | Shell pasa `userId` al checkout        |

> **🚫 Nunca:** imports directos entre micro-apps. Siempre a través de `packages/` o el Event Bus.

---

## 🔗 Shared Dependencies

### Estrategia de Compartir

```typescript
// Regla de oro: compartir lo mínimo necesario
shared: {
  // ✅ Singleton: React DEBE ser una sola instancia
  react: {
    singleton: true,
    requiredVersion: "^19.0.0",
    eager: false,           // Lazy load (el Host lo carga primero)
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^19.0.0",
    eager: false,
  },

  // ✅ Compartir types y utilidades del workspace
  "@ecommerce/shared-types": {
    singleton: true,
    requiredVersion: "workspace:*",
  },
  "@ecommerce/events": {
    singleton: true,
    requiredVersion: "workspace:*",
  },

  // ❌ NO compartir dependencias pesadas que solo un micro usa
  // pinia: NO — solo cart-app la usa
  // recharts: NO — solo analytics la usaría
}
```

### Design System Compartido — `packages/ui/src/Button.tsx`

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}
```

---

## 🧭 Routing Federado

### Estrategia: Shell Owns the Router

```tsx
// Shell define las rutas de primer nivel
// Cada remote maneja sus sub-rutas internamente

// apps/shell-app/src/routes.tsx
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const CatalogRoutes = lazy(() => import("catalog/ProductList"));
const CatalogDetail = lazy(() => import("catalog/ProductDetail"));
const CartPage = lazy(() => import("cart/CartPage"));
const CheckoutFlow = lazy(() => import("checkout/CheckoutFlow"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <CatalogRoutes />,
  },
  {
    path: "/product/:id",
    element: <CatalogDetail />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout/*",
    element: <CheckoutFlow />,
    // El checkout maneja internamente:
    // /checkout/address
    // /checkout/payment
    // /checkout/confirmation
  },
];
```

### Reglas de Routing

1. **Shell es el dueño** del `<BrowserRouter>` — nunca un remote
2. **Remotes** usan rutas relativas o reciben la `basename` como prop
3. **Deep linking** funciona porque las rutas están en el Shell
4. **Lazy loading** con `React.lazy()` + `Suspense` para cada remote

---

## 🧪 Testing

### Estrategia por Capa

| Capa            | Herramienta              | Qué testear                                   |
| --------------- | ------------------------ | --------------------------------------------- |
| **Unit**        | Vitest                   | Hooks, utilidades, stores, event bus          |
| **Componente**  | Vitest + Testing Library | Componentes aislados SIN Module Federation    |
| **Integración** | Vitest + Happy DOM       | Interacción entre componentes del mismo micro |
| **E2E**         | Playwright               | Flujo completo cross-microfrontend            |
| **Contract**    | Vitest                   | Interfaces expuestas por cada remote          |

### Contract Test — Garantizar la interfaz pública

```typescript
// apps/catalog-app/__tests__/contract.test.ts
import { describe, it, expect } from "vitest";

describe("Catalog Remote Contract", () => {
  it("should export ProductList as default export", async () => {
    const mod = await import("../src/pages/ProductList");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });

  it("should export ProductDetail as default export", async () => {
    const mod = await import("../src/pages/ProductDetail");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });

  it("should export ProductCard as named export", async () => {
    const mod = await import("../src/components/ProductCard");
    expect(mod.ProductCard).toBeDefined();
  });
});
```

### E2E — Flujo de compra completo

```typescript
// e2e/purchase-flow.spec.ts
import { test, expect } from "@playwright/test";

test("usuario completa un flujo de compra", async ({ page }) => {
  // 1. Navegar al catálogo
  await page.goto("http://localhost:3000");
  await expect(page.getByText("Catálogo de Productos")).toBeVisible();

  // 2. Agregar producto al carrito
  await page.getByText("Laptop Pro 16").click();
  await page.getByRole("button", { name: "Agregar al carrito" }).click();

  // 3. Ir al carrito (micro-app Vue)
  await page.getByRole("link", { name: "Carrito" }).click();
  await expect(page.getByText("Laptop Pro 16")).toBeVisible();
  await expect(page.getByText("$1,299.99")).toBeVisible();

  // 4. Proceder al checkout
  await page.getByRole("button", { name: "Proceder al pago" }).click();
  await expect(page.url()).toContain("/checkout");

  // 5. Completar dirección y pagar
  await page.fill('[name="address"]', "Calle Falsa 123");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Confirmar pedido" }).click();

  // 6. Verificar confirmación
  await expect(page.getByText("¡Pedido confirmado!")).toBeVisible();
});
```

### Ejecutar tests

```bash
# Unit + Componente (todo el workspace)
pnpm vitest run

# Solo un micro-app
pnpm --filter catalog-app vitest run

# E2E
pnpm --filter e2e playwright test

# Watch mode en desarrollo
pnpm vitest --watch
```

---

## 🚢 CI/CD & Deploy

### Estrategia de Deploy Independiente

```yaml
# .github/workflows/deploy-catalog.yml
name: Deploy Catalog

on:
  push:
    paths:
      - "apps/catalog-app/**"
      - "packages/ui/**" # Si cambió el design system
      - "packages/shared-types/**"
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      # Build SOLO el catálogo y sus dependencias
      - run: pnpm --filter catalog-app... build

      # Tests
      - run: pnpm --filter catalog-app vitest run
      - run: pnpm --filter catalog-app... vitest run --passWithNoTests

      # Deploy al CDN (ejemplo con S3 + CloudFront)
      - name: Deploy to S3
        run: |
          aws s3 sync apps/catalog-app/dist/ \
            s3://${{ secrets.BUCKET }}/catalog/ \
            --delete
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CF_DIST_ID }} \
            --paths "/catalog/*"
```

### URLs de Runtime en Producción

```typescript
// Shell detecta el entorno y usa las URLs correctas
const REMOTE_URLS: Record<string, Record<string, string>> = {
  development: {
    catalog: "http://localhost:3001/mf-manifest.json",
    cart: "http://localhost:3002/mf-manifest.json",
    checkout: "http://localhost:3003/mf-manifest.json",
  },
  production: {
    catalog: "https://cdn.example.com/catalog/mf-manifest.json",
    cart: "https://cdn.example.com/cart/mf-manifest.json",
    checkout: "https://cdn.example.com/checkout/mf-manifest.json",
  },
};
```

---

## ✅ Buenas Prácticas Senior 2026

### 1. Contratos Tipados

```typescript
// packages/shared-types/src/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
}

// packages/shared-types/src/cart.ts
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
```

### 2. Error Boundaries por Remote

```tsx
// Cada remote tiene su propio error boundary
// Si un micro falla, NO tumba toda la app

import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  remoteName: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // 📊 Enviar a Sentry/Datadog con metadata del remote
    console.error(`[MFE:${this.props.remoteName}] Error:`, error);
    // reportError({ remote: this.props.remoteName, error });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Uso en el Shell:
<RemoteErrorBoundary
  remoteName="catalog"
  fallback={<p>Catálogo no disponible</p>}
>
  <Suspense fallback={<Skeleton />}>
    <CatalogApp />
  </Suspense>
</RemoteErrorBoundary>;
```

### 3. Versionado Semántico de Remotes

```jsonc
// Cada remote expone su versión en el manifest
// El shell puede verificar compatibilidad antes de montar
{
  "name": "catalog",
  "version": "2.3.1",
  "exposes": {
    "./ProductList": "./src/pages/ProductList.tsx",
  },
  "contractVersion": "1.0.0", // Versión del contrato de API
}
```

### 4. Feature Flags por Remote

```typescript
// El shell puede deshabilitar un remote en caliente
const featureFlags = {
  enableCheckout: true,
  enableCart: true,
  enableCatalogV2: false,  // A/B testing nueva versión
};

// En el router:
{featureFlags.enableCart && (
  <Route path="/cart" element={<CartApp />} />
)}
```

### 5. CSS Isolation — Evitar Conflictos

```typescript
// Opción A: CSS Modules (recomendado para React)
import styles from "./ProductCard.module.css";

// Opción B: Shadow DOM para Web Components (Vue interop)
defineCustomElement(CartWidgetCe, {
  shadowRoot: true,  // Encapsula estilos
});

// Opción C: Prefijo por micro-app en CSS custom properties
// Cada micro define sus variables bajo su namespace
:root {
  --catalog-primary: #3b82f6;
  --cart-primary: #10b981;
  --checkout-primary: #8b5cf6;
}
```

### 6. Tabla Resumen de Buenas Prácticas

| Práctica                                  | ¿Por qué?                                   |
| ----------------------------------------- | ------------------------------------------- |
| **TypeScript strict** en todos los micros | Seguridad de tipos en contratos de interop  |
| **Event Bus tipado**                      | Prevenir errores de runtime en comunicación |
| **Error Boundary por remote**             | Aislamiento de fallos                       |
| **Contract tests**                        | Detectar breaking changes ANTES del deploy  |
| **CSS Modules / Shadow DOM**              | Zero conflictos de estilos entre micros     |
| **Lazy loading de remotes**               | Reducir TTI (Time to Interactive)           |
| **Feature flags**                         | Rollback instantáneo sin re-deploy          |
| **Shared deps como singleton**            | Evitar múltiples instancias de React/Vue    |
| **pnpm workspaces**                       | Installs rápidos, dedup eficiente           |
| **Biome > ESLint**                        | 100x más rápido en linting/formatting       |

---

## 🚫 Anti-patterns

| ❌ Anti-pattern                                        | ✅ Corrección                                |
| ------------------------------------------------------ | -------------------------------------------- |
| Importar componentes directamente entre micro-apps     | Usar `packages/` para código compartido      |
| State global con Redux/Zustand compartido entre micros | Event Bus loosely-coupled + stores locales   |
| Un solo build que bundlea TODO                         | Builds independientes por micro-app          |
| Compartir TODAS las dependencias                       | Solo compartir `react`, `react-dom` y types  |
| `window.globalState = {...}`                           | Event Bus tipado con contract testing        |
| Micro-apps con 50+ componentes                         | Mantener cada micro pequeño y enfocado       |
| Routing en cada remote                                 | El Shell es el dueño del router              |
| Deploy acoplado (mono-deploy)                          | Un pipeline por micro (paths-based triggers) |
| Testing solo E2E                                       | Pirámide: unit → component → contract → E2E  |
| Ignorar versiones de shared deps                       | `requiredVersion` + `singleton: true`        |

---

## ⚡ Performance

### Checklist de Optimización

```bash
# 1. Analizar el bundle de cada micro
pnpm --filter catalog-app vite-bundle-visualizer

# 2. Verificar que no hay dependencias duplicadas
pnpm --filter shell-app why react   # Debe resolver a una sola versión

# 3. Precarga de remotes críticos
<link rel="modulepreload" href="https://cdn.example.com/catalog/remoteEntry.js">
```

### Precarga Inteligente

```tsx
// En el Shell: precargar remotes en idle time
useEffect(() => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      // Precargar el catálogo si no está cargado
      import("catalog/ProductList").catch(() => {});
    });
  }
}, []);
```

### Bundle Size Budget

```typescript
// vite.config.ts — Alertar si un chunk supera el límite
build: {
  rollupOptions: {
    output: {
      manualChunks: undefined,  // Module Federation maneja los chunks
    },
  },
  chunkSizeWarningLimit: 250,  // kB — Alertar temprano
}
```

### Métricas Clave

| Métrica                       | Target        | Herramienta              |
| ----------------------------- | ------------- | ------------------------ |
| **LCP**                       | < 2.5s        | Lighthouse / Web Vitals  |
| **FID**                       | < 100ms       | Web Vitals               |
| **CLS**                       | < 0.1         | Web Vitals               |
| **Bundle por remote**         | < 250 KB gzip | `vite-bundle-visualizer` |
| **Tiempo de carga de remote** | < 500ms       | Performance API          |

---

## 📊 Observabilidad

### Telemetría por Microfrontend

```typescript
// packages/observability/src/tracker.ts
interface MfeMetric {
  remote: string;
  event: "load" | "error" | "render" | "interaction";
  duration?: number;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export function trackRemoteLoad(remoteName: string) {
  const start = performance.now();

  return {
    success: () => {
      const duration = performance.now() - start;
      sendMetric({
        remote: remoteName,
        event: "load",
        duration,
        timestamp: Date.now(),
      });
    },
    failure: (error: Error) => {
      sendMetric({
        remote: remoteName,
        event: "error",
        metadata: { message: error.message },
        timestamp: Date.now(),
      });
    },
  };
}

function sendMetric(metric: MfeMetric) {
  // Enviar a tu sistema de métricas (Datadog, NewRelic, etc.)
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/metrics", JSON.stringify(metric));
  }
}
```

### Dashboard Recomendado

```
┌─────────────────────────────────────────────────┐
│              MFE Health Dashboard                │
├───────────┬───────────┬───────────┬─────────────┤
│  Catalog  │   Cart    │ Checkout  │   Shell     │
│  ✅ 99.9% │  ✅ 99.8% │  ⚠️ 98.5% │  ✅ 99.99%  │
├───────────┴───────────┴───────────┴─────────────┤
│  Avg Load Time: 180ms | Errors/hr: 3 | P95: 420ms│
└─────────────────────────────────────────────────┘
```

---

## 📚 Recursos

| Recurso                         | Link                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| Module Federation Docs          | [module-federation.io](https://module-federation.io/)                                               |
| Vite Plugin                     | [@module-federation/vite](https://www.npmjs.com/package/@module-federation/vite)                    |
| Micro Frontends (Martin Fowler) | [martinfowler.com/articles/micro-frontends](https://martinfowler.com/articles/micro-frontends.html) |
| Nx Monorepo                     | [nx.dev](https://nx.dev)                                                                            |
| Vite 6 Docs                     | [vite.dev](https://vite.dev)                                                                        |
| Playwright E2E                  | [playwright.dev](https://playwright.dev)                                                            |
| Biome (Linter)                  | [biomejs.dev](https://biomejs.dev)                                                                  |
| pnpm Workspaces                 | [pnpm.io/workspaces](https://pnpm.io/workspaces)                                                    |

---

## 🏃 Quick Start — Levantar Todo

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar todos los micros en paralelo
pnpm --parallel -r dev

# O usar Nx para orquestación inteligente:
npx nx run-many -t dev --all

# 3. Abrir en el navegador
# Shell:    http://localhost:3000
# Catalog:  http://localhost:3001  (standalone)
# Cart:     http://localhost:3002  (standalone)
# Checkout: http://localhost:3003  (standalone)
```

---

<div align="center">

**Built with ❤️ using Vite + Module Federation**

_Microfrontend Architecture — Senior Level 2026_

</div>
