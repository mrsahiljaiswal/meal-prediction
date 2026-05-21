import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  // load .env files into process.env
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL || "http://localhost:8082",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
