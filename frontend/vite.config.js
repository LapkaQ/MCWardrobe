import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react"; // Poprawny import
export default defineConfig({
  plugins: [react()], // Dodaj plugin React
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Dodaj ten alias
    },
  },
});
