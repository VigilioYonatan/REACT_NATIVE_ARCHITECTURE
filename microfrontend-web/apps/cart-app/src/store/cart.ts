import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { CartItem } from "@ecommerce/shared-types";
import { eventBus } from "@ecommerce/events";

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  function addItem(newItem: CartItem) {
    const existing = items.value.find(
      (item) => item.productId === newItem.productId
    );
    if (existing) {
      existing.quantity += newItem.quantity;
    } else {
      items.value.push({ ...newItem });
    }
    notifyUpdate();
  }

  function removeItem(productId: string) {
    items.value = items.value.filter((item) => item.productId !== productId);
    notifyUpdate();
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const item = items.value.find((item) => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      notifyUpdate();
    }
  }

  function clearCart() {
    items.value = [];
    notifyUpdate();
    eventBus.emit("cart:cleared");
  }

  function notifyUpdate() {
    eventBus.emit("cart:updated", {
      items: items.value,
      total: total.value,
      itemCount: itemCount.value,
    });
  }

  // Listen for add-item events from other microfrontends (e.g., Catalog)
  eventBus.on("cart:add-item", (payload) => addItem(payload));
  eventBus.on("cart:remove-item", ({ productId }) => removeItem(productId));
  eventBus.on("cart:update-quantity", ({ productId, quantity }) =>
    updateQuantity(productId, quantity)
  );

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
});
