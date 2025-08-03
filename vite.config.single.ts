import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// Configuration UN SEUL FICHIER - Maximum absolu
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
        // FORCER UN SEUL FICHIER
        manualChunks: undefined,
        // UN SEUL FICHIER JS
        chunkFileNames: 'app.js',
        entryFileNames: 'app.js',
        assetFileNames: '[name].[ext]',
        // Forcer un seul fichier
        format: 'iife',
        name: 'App'
      },
    },
    chunkSizeWarningLimit: 50000,
    // Désactiver les assets inline
    assetsInlineLimit: 0,
    // Forcer un seul fichier
    lib: undefined,
    // Désactiver le code splitting
    target: 'es2015'
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