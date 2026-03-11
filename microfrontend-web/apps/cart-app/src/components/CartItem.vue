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
    <div class="cart-item__image">{{ item.image }}</div>
    <div class="cart-item__info">
      <h3 class="cart-item__name">{{ item.name }}</h3>
      <span class="cart-item__price">${{ item.price.toFixed(2) }}</span>
    </div>
    <div class="cart-item__quantity">
      <button
        class="qty-btn"
        :disabled="item.quantity <= 1"
        @click="emit('update:quantity', item.productId, item.quantity - 1)"
      >
        −
      </button>
      <span class="qty-value">{{ item.quantity }}</span>
      <button
        class="qty-btn"
        @click="emit('update:quantity', item.productId, item.quantity + 1)"
      >
        +
      </button>
    </div>
    <div class="cart-item__subtotal">
      ${{ (item.price * item.quantity).toFixed(2) }}
    </div>
    <button class="cart-item__remove" @click="emit('remove', item.productId)">
      🗑️
    </button>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--surface-1, #1e293b);
  border-radius: 12px;
  transition: transform 0.15s ease;
}

.cart-item:hover {
  transform: translateX(4px);
}

.cart-item__image {
  font-size: 2.5rem;
  width: 60px;
  text-align: center;
}

.cart-item__info {
  flex: 1;
}

.cart-item__name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #f8fafc);
  margin-bottom: 4px;
}

.cart-item__price {
  font-size: 0.85rem;
  color: var(--text-muted, #64748b);
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color, #334155);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary, #f8fafc);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.15s ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-primary, #6366f1);
  border-color: var(--color-primary, #6366f1);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 28px;
  text-align: center;
  font-weight: 600;
}

.cart-item__subtotal {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-primary, #6366f1);
  min-width: 90px;
  text-align: right;
}

.cart-item__remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.cart-item__remove:hover {
  background: rgba(239, 68, 68, 0.15);
}
</style>
