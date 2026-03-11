import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
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
        "react-router-dom": { singleton: true, requiredVersion: "^7.2.0" },
        "@ecommerce/events": { singleton: true },
        "@ecommerce/shared-types": { singleton: true },
      },
    }),
    react(),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});
