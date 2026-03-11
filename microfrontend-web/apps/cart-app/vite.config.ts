import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "cart",
      filename: "remoteEntry.js",
      exposes: {
        "./CartPage": "./src/CartPage.ts",
      },
      shared: {
        vue: { singleton: true, requiredVersion: "^3.5.0" },
        "@ecommerce/events": { singleton: true },
        "@ecommerce/shared-types": { singleton: true },
      },
    }),
    vue(),
  ],
  server: {
    port: 3002,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});
