import type { CartItem } from "@ecommerce/shared-types";

// ── Event Map ────────────────────────────────────────────────────────
export type EventMap = {
  "cart:add-item": CartItem;
  "cart:remove-item": { productId: string };
  "cart:update-quantity": { productId: string; quantity: number };
  "cart:cleared": undefined;
  "cart:updated": { items: CartItem[]; total: number; itemCount: number };
  "auth:login": { userId: string; name: string; token: string };
  "auth:logout": undefined;
  "checkout:started": { cartTotal: number; itemCount: number };
  "checkout:completed": { orderId: string };
  "navigate": { path: string };
};

type EventKey = keyof EventMap;
type EventCallback<K extends EventKey> = EventMap[K] extends undefined
  ? () => void
  : (payload: EventMap[K]) => void;

// ── Typed Event Bus ──────────────────────────────────────────────────
class TypedEventBus {
  private listeners = new Map<string, Set<Function>>();

  on<K extends EventKey>(event: K, callback: EventCallback<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return cleanup function
    return () => this.off(event, callback);
  }

  off<K extends EventKey>(event: K, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit<K extends EventKey>(
    event: K,
    ...args: EventMap[K] extends undefined ? [] : [EventMap[K]]
  ): void {
    this.listeners.get(event)?.forEach((cb) => cb(...args));
  }

  /** Remove all listeners — useful for testing */
  clear(): void {
    this.listeners.clear();
  }
}

// ── Singleton ────────────────────────────────────────────────────────
const GLOBAL_KEY = "__ECOMMERCE_EVENT_BUS__" as const;

declare global {
  interface Window {
    [GLOBAL_KEY]?: TypedEventBus;
  }
}

export const eventBus: TypedEventBus =
  (typeof window !== "undefined" && window[GLOBAL_KEY]) ||
  (() => {
    const bus = new TypedEventBus();
    if (typeof window !== "undefined") {
      window[GLOBAL_KEY] = bus;
    }
    return bus;
  })();
