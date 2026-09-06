import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  build: {
    outDir: "build/web",
    emptyOutDir: true,
    target: "es2022",
    chunkSizeWarningLimit: 800,
  },
  server: { host: "0.0.0.0", port: 5173, strictPort: true },
});
