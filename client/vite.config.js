import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://mern-ecom-3-l9sy.onrender.com", // your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
