<script setup lang="ts">
import { useCartStore } from "./store/cart";
import CartItem from "./components/CartItem.vue";
import CartSummary from "./components/CartSummary.vue";

const cart = useCartStore();
</script>

<template>
  <section class="cart-page">
    <h1 class="cart-page__title">🛒 Tu Carrito</h1>

    <div v-if="cart.items.length === 0" class="cart-empty">
      <div class="cart-empty__icon">🛒</div>
      <h2>Tu carrito está vacío</h2>
      <p>Agrega productos desde el catálogo para comenzar</p>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <CartItem
          v-for="item in cart.items"
          :key="item.productId"
          :item="item"
          @update:quantity="(id, qty) => cart.updateQuantity(id, qty)"
          @remove="(id) => cart.removeItem(id)"
        />
      </div>
      <CartSummary
        :total="cart.total"
        :item-count="cart.itemCount"
        @clear="cart.clearCart()"
      />
    </div>
  </section>
</template>

<style scoped>
.cart-page__title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 24px;
}
</style>
