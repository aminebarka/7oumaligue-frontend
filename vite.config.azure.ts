import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// Configuration ultra-optimisée pour Azure Static Web Apps
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    minify: 'esbuild',
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Un seul chunk pour tout
        manualChunks: undefined,
        // Noms de fichiers sans hash pour Azure
        chunkFileNames: 'js/app.js',
        entryFileNames: 'js/index.js',
        assetFileNames: 'assets/[name].[ext]'
      },
    },
    chunkSizeWarningLimit: 5000,
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react-router-dom", 
      "axios",
      "framer-motion",
      "lucide-react"
    ],
  },
}) 