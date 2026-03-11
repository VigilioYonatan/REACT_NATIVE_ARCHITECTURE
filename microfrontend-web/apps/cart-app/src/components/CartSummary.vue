<script setup lang="ts">
import { eventBus } from "@ecommerce/events";

const props = defineProps<{
  total: number;
  itemCount: number;
}>();

const emit = defineEmits<{
  clear: [];
}>();

function handleCheckout() {
  eventBus.emit("checkout:started", {
    cartTotal: props.total,
    itemCount: props.itemCount,
  });
  eventBus.emit("navigate", { path: "/checkout" });
}
</script>

<template>
  <aside class="cart-summary">
    <h2 class="cart-summary__title">Resumen</h2>

    <div class="cart-summary__row">
      <span>Productos ({{ itemCount }})</span>
      <span>${{ total.toFixed(2) }}</span>
    </div>

    <div class="cart-summary__row">
      <span>Envío</span>
      <span class="cart-summary__free">Gratis</span>
    </div>

    <div class="cart-summary__divider" />

    <div class="cart-summary__row cart-summary__total">
      <span>Total</span>
      <span>${{ total.toFixed(2) }}</span>
    </div>

    <button class="btn-checkout" @click="handleCheckout">
      💳 Proceder al Pago
    </button>

    <button class="btn-clear" @click="emit('clear')">🗑️ Vaciar Carrito</button>
  </aside>
</template>

<style scoped>
.cart-summary {
  background: var(--surface-1, #1e293b);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 88px;
}

.cart-summary__title {
  font-size: 1.2rem;
  font-weight: 700;
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary, #94a3b8);
}

.cart-summary__free {
  color: var(--color-success, #10b981);
  font-weight: 600;
}

.cart-summary__divider {
  height: 1px;
  background: var(--border-color, #334155);
}

.cart-summary__total {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary, #f8fafc);
}

.btn-checkout {
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-checkout:hover {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.btn-clear {
  padding: 10px;
  border: 1px solid var(--border-color, #334155);
  border-radius: 12px;
  background: transparent;
  color: var(--text-muted, #64748b);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-clear:hover {
  border-color: var(--color-danger, #ef4444);
  color: var(--color-danger, #ef4444);
}
</style>
