import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname);
  const env = loadEnv(mode, envDir, "");
  const apiKey = (env.VITE_POISKKINO_API_KEY || "").trim();
  if (!apiKey && mode === "development") {
    console.warn(
      "[vite] VITE_POISKKINO_API_KEY не найден в .env - запросы к API вернут 401. Проверьте файл .env в корне проекта."
    );
  }

  const base = mode === "pages" ? "/vk-frontend-internship/" : "/";

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: {
      proxy: {
        "/api": {
          target: "https://api.poiskkino.dev",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader("X-API-KEY", apiKey);
              }
            });
          },
        },
      },
    },
  };
});
