import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.join(__dirname, '../dist')

function cleanAssets() {
  console.log('🧹 Nettoyage des assets pour Azure...')
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dossier dist non trouvé')
    return
  }

  // Supprimer les fichiers de stats et de debug
  const filesToRemove = [
    'stats.html',
    'stats.json',
    '.vite',
    'vite.config.js.timestamp-*.mjs'
  ]

  filesToRemove.forEach(file => {
    const filePath = path.join(distPath, file)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`🗑️ Supprimé: ${file}`)
    }
  })

  // Nettoyer les dossiers vides
  const cleanEmptyDirs = (dir) => {
    const items = fs.readdirSync(dir)
    items.forEach(item => {
      const itemPath = path.join(dir, item)
      const stat = fs.statSync(itemPath)
      if (stat.isDirectory()) {
        cleanEmptyDirs(itemPath)
        const dirItems = fs.readdirSync(itemPath)
        if (dirItems.length === 0) {
          fs.rmdirSync(itemPath)
          console.log(`🗑️ Dossier vide supprimé: ${itemPath}`)
        }
      }
    })
  }

  cleanEmptyDirs(distPath)

  // Compter les fichiers
  const countFiles = (dir) => {
    let count = 0
    const items = fs.readdirSync(dir)
    items.forEach(item => {
      const itemPath = path.join(dir, item)
      const stat = fs.statSync(itemPath)
      if (stat.isDirectory()) {
        count += countFiles(itemPath)
      } else {
        count++
      }
    })
    return count
  }

  const totalFiles = countFiles(distPath)
  console.log(`📊 Total fichiers: ${totalFiles}`)
  
  if (totalFiles <= 30) {
    console.log('✅ Optimisation réussie ! Nombre de fichiers acceptable pour Azure.')
  } else {
    console.log('⚠️ Attention: Encore trop de fichiers pour Azure.')
  }
}

cleanAssets() 