import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    minify: 'esbuild',
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Un seul chunk vendor pour toutes les librairies
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
            'framer-motion',
            'lucide-react',
            'axios',
            'clsx',
            'tailwind-merge'
          ],
          // Un seul chunk pour toutes les pages
          'app': [
            './src/pages/Home.tsx',
            './src/pages/Dashboard.tsx',
            './src/pages/Login.tsx',
            './src/pages/Profile.tsx',
            './src/pages/Heroes.tsx',
            './src/pages/Stats.tsx',
            './src/pages/Tournaments.tsx',
            './src/pages/Groups.tsx',
            './src/pages/Matches.tsx',
            './src/pages/LiveMatch.tsx',
            './src/pages/TournamentAI.tsx',
            './src/pages/Teams.tsx',
            './src/pages/Players.tsx',
            './src/pages/PlayerCards.tsx',
            './src/pages/PlayerManagement.tsx',
            './src/pages/Store.tsx',
            './src/pages/FreePlayers.tsx',
            './src/pages/Sponsors.tsx',
            './src/pages/SocialWall.tsx',
            './src/pages/PaymentCenter.tsx',
            './src/pages/TVDisplay.tsx',
            './src/pages/Stadiums.tsx',
            './src/pages/Admin.tsx'
          ]
        },
        // Noms de fichiers très simples
        chunkFileNames: 'js/[name].js',
        entryFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      },
    },
    chunkSizeWarningLimit: 2000,
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
