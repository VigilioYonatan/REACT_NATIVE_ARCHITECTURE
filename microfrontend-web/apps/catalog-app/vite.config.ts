import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "catalog",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductList": "./src/pages/ProductList.tsx",
        "./ProductDetail": "./src/pages/ProductDetail.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.2.0" },
        "@ecommerce/events": { singleton: true },
        "@ecommerce/shared-types": { singleton: true },
      },
    }),
    react(),
  ],
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});
