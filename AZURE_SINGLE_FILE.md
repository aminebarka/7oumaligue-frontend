# 🚨 Solution SINGLE FILE - Erreur Azure

## 📊 Problème Critique Persistant
```
The content server has rejected the request with: BadRequest
Reason: The number of static files was too large
```

## ✅ Solution SINGLE FILE

### **1. Configuration Vite Single File**
```typescript
// vite.config.single.ts
export default defineConfig({
  build: {
    cssCodeSplit: false,        // 1 seul fichier CSS
    sourcemap: false,           // Pas de sourcemaps
    rollupOptions: {
      output: {
        manualChunks: undefined, // 1 seul chunk
        chunkFileNames: 'app.js',
        entryFileNames: 'app.js',
        assetFileNames: '[name].[ext]',
        format: 'iife',         // Format IIFE
        name: 'App'
      }
    },
    assetsInlineLimit: 0,       // Pas d'inline
    target: 'es2015'           // Target ES2015
  }
})
```

### **2. Script de Build Single File**
```bash
npm run build:single
```

### **3. Nettoyage Ultra-Agressif**
```bash
node scripts/clean-assets.js
```
**Actions :**
- Supprime tous les fichiers de debug
- Supprime les images inutiles
- Déplace tout à la racine
- Supprime les dossiers vides
- Affiche la structure finale

## 🎯 Structure Finale Single File

```
dist/
├── index.html
├── app.js
├── index.css
└── [images minimales]
```

**Objectif : < 5 fichiers**

## 🚀 Déploiement

### **1. Build Single File**
```bash
npm run build:single
```

### **2. Vérification**
```bash
# Compter les fichiers
find dist -type f | wc -l
# Doit être < 5
```

### **3. Déploiement Azure**
- **Build command** : `npm run build:single`
- **Output location** : `dist`
- **Structure** : Tout à la racine

## 📋 Checklist Single File

- [ ] Configuration `vite.config.single.ts` créée
- [ ] Script `build:single` configuré
- [ ] Nettoyage ultra-agressif configuré
- [ ] Workflow GitHub Actions mis à jour
- [ ] Test local du build
- [ ] Vérification du nombre de fichiers (< 5)
- [ ] Déploiement sur Azure

## 🔧 Commandes de Test

```bash
# Build single file
npm run build:single

# Vérifier le nombre de fichiers
find dist -type f | wc -l

# Analyser la structure
ls -la dist/

# Nettoyer manuellement si nécessaire
npm run clean:assets
```

## ⚠️ Points Critiques Single File

1. **Un seul fichier JS** : Tout dans `app.js`
2. **Format IIFE** : Compatible navigateur
3. **Pas de hash** : Noms simples
4. **Pas de dossiers** : Tout à la racine
5. **CSS unifié** : Un seul fichier
6. **Images minimales** : Seulement essentielles
7. **Nettoyage agressif** : Suppression de tout le superflu

## 🎉 Résultat Attendu Single File

- **Nombre de fichiers** : < 5
- **Structure** : Tout à la racine
- **Taille** : Optimisée au maximum
- **Azure compatible** : ✅

Cette configuration SINGLE FILE devrait définitivement résoudre l'erreur Azure ! 🚀 