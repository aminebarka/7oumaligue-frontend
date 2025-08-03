import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// Configuration ULTRA-MINIMALE - Minimum absolu de fichiers
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
        // UN SEUL FICHIER JS - TOUT DANS UN SEUL FICHIER
        manualChunks: undefined,
        // Noms de fichiers SANS HASH ET SANS DOSSIER
        chunkFileNames: 'app.js',
        entryFileNames: 'index.js',
        assetFileNames: '[name].[ext]'
      },
    },
    chunkSizeWarningLimit: 20000,
    // Désactiver les assets inline
    assetsInlineLimit: 0,
    // Forcer un seul fichier
    lib: undefined,
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