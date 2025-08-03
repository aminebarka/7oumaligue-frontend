import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// Configuration ULTRA-MINIMALE - Minimum absolu
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
        // FORCER UN SEUL FICHIER JS
        manualChunks: undefined,
        // UN SEUL FICHIER JS
        chunkFileNames: 'app.js',
        entryFileNames: 'app.js',
        assetFileNames: '[name].[ext]',
        // Forcer un seul fichier
        format: 'iife',
        name: 'App',
        // Inline tout le CSS
        inlineDynamicImports: true
      },
    },
    chunkSizeWarningLimit: 100000,
    // Désactiver les assets inline
    assetsInlineLimit: 0,
    // Forcer un seul fichier
    lib: undefined,
    // Désactiver le code splitting
    target: 'es2015',
    // Inline le CSS
    cssCodeSplit: false
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