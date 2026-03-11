import { useState, useEffect } from "react";
import { eventBus } from "@ecommerce/events";

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsubscribe = eventBus.on("cart:updated", ({ itemCount }) => {
      setCount(itemCount);
    });

    return unsubscribe;
  }, []);

  return count;
}
