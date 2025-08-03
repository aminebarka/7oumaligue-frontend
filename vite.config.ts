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
    cssCodeSplit: false, // Désactiver pour réduire le nombre de fichiers
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Libraries
          'ui-vendor': ['framer-motion', 'lucide-react'],
          
          // Utility libraries
          'utils-vendor': ['axios', 'clsx', 'tailwind-merge'],
          
          // Pages - Groupé en chunks plus gros pour réduire le nombre de fichiers
          'pages-main': [
            './src/pages/Home.tsx',
            './src/pages/Dashboard.tsx',
            './src/pages/Login.tsx',
            './src/pages/Profile.tsx',
            './src/pages/Heroes.tsx',
            './src/pages/Stats.tsx'
          ],
          'pages-tournaments': [
            './src/pages/Tournaments.tsx',
            './src/pages/Groups.tsx',
            './src/pages/Matches.tsx',
            './src/pages/LiveMatch.tsx',
            './src/pages/TournamentAI.tsx'
          ],
          'pages-teams': [
            './src/pages/Teams.tsx',
            './src/pages/Players.tsx',
            './src/pages/PlayerCards.tsx',
            './src/pages/PlayerManagement.tsx'
          ],
          'pages-features': [
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
        // Optimize chunk naming - Réduire la complexité des noms
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
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
