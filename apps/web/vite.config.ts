import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:3001",
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: "browser-boundary",
          generateBundle() {
            for (const id of this.getModuleIds()) {
              if (
                /apps\/api\/|node_modules\/(?:\.pnpm\/)?(?:pg|drizzle-orm|@hono)(?:@|\/)/.test(
                  id,
                )
              )
                this.error(`Server dependency in browser bundle: ${id}`);
            }
          },
        },
      ],
    },
  },
});
