import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "production" && removeConsole()].filter(Boolean),
  server: {
    host: true,
    strictPort: true,
    port: 8080,
    proxy: {
      "/api/v1": {
        target: "https://expense-track-backend-xb4k.onrender.com/",
        changeOrigin: true,
        secure: false, 
      },
    },
  },
}));
