import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

dotenv.config();

function addCSPHeaders() {
  return {
    name: "add-csp-headers",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        // Allow fetch calls to ic0.app
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; connect-src 'self' https://ic0.app; img-src 'self' data:; script-src 'self'; style-src 'self';"
        );
        next();
      });
    },
  };
}

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: "globalThis" },
    },
  },
  server: {
    // If you’re not using proxies right now, you can remove or comment these out
    // proxy: { ... }
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    tailwindcss(),
    addCSPHeaders(),
  ],
  cacheDir: "../node_modules/.vite",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
