// CartPage.ts — Vue → React interop wrapper
// This file is exposed via Module Federation and consumed by the React shell.
// It mounts the Vue app into a DOM element and returns a cleanup function.

import { createApp, type App as VueApp } from "vue";
import { createPinia } from "pinia";
import CartApp from "./App.vue";
import "./cart.css";

let vueApp: VueApp | null = null;

export function mount(el: HTMLElement): () => void {
  if (vueApp) {
    vueApp.unmount();
  }

  vueApp = createApp(CartApp);
  vueApp.use(createPinia());
  vueApp.mount(el);

  return () => {
    vueApp?.unmount();
    vueApp = null;
  };
}

// React wrapper component — default export for Module Federation
// This allows the React shell to consume this Vue micro as if it were a React component
function CartPageWrapper() {
  // We import React dynamically to avoid bundling it in the Vue app
  // The shell shares React as a singleton
  const React = (window as any).__REACT__;

  // Fallback: create a simple DOM-based wrapper
  const container = document.createElement("div");
  container.id = "cart-vue-root";

  let cleanup: (() => void) | null = null;

  // Use MutationObserver to detect when element is added to DOM
  const observer = new MutationObserver(() => {
    if (document.contains(container) && !cleanup) {
      cleanup = mount(container);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Immediate attempt
  setTimeout(() => {
    if (document.contains(container) && !cleanup) {
      cleanup = mount(container);
      observer.disconnect();
    }
  }, 0);

  return container;
}

// For React usage via Module Federation
export default {
  mount,
  __esModule: true,
};
