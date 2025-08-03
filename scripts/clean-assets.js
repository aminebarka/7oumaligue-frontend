import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.join(__dirname, '../dist')

function cleanAssets() {
  console.log('🧹 Nettoyage ULTRA-AGRESSIF pour Azure...')
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dossier dist non trouvé')
    return
  }

  // Supprimer TOUS les fichiers de debug et stats
  const filesToRemove = [
    'stats.html',
    'stats.json',
    '.vite',
    'vite.config.js.timestamp-*.mjs',
    '*.map',
    '*.map.js',
    '*.map.css'
  ]

  // Supprimer les fichiers de debug
  filesToRemove.forEach(pattern => {
    const files = fs.readdirSync(distPath)
    files.forEach(file => {
      if (file.includes('stats') || file.includes('.map') || file.includes('.vite')) {
        const filePath = path.join(distPath, file)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log(`🗑️ Supprimé: ${file}`)
        }
      }
    })
  })

  // Supprimer les dossiers vides
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

  // Déplacer tous les fichiers à la racine pour réduire la structure
  const flattenStructure = (dir) => {
    const items = fs.readdirSync(dir)
    items.forEach(item => {
      const itemPath = path.join(dir, item)
      const stat = fs.statSync(itemPath)
      if (stat.isDirectory()) {
        flattenStructure(itemPath)
        // Supprimer le dossier après avoir déplacé son contenu
        const dirItems = fs.readdirSync(itemPath)
        if (dirItems.length === 0) {
          fs.rmdirSync(itemPath)
        }
      } else if (dir !== distPath) {
        // Déplacer le fichier à la racine
        const newPath = path.join(distPath, item)
        if (!fs.existsSync(newPath)) {
          fs.renameSync(itemPath, newPath)
          console.log(`📁 Déplacé: ${item} vers la racine`)
        }
      }
    })
  }

  flattenStructure(distPath)

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
  
  if (totalFiles <= 15) {
    console.log('✅ SUCCÈS ! Nombre de fichiers acceptable pour Azure.')
  } else {
    console.log('⚠️ ATTENTION: Encore trop de fichiers pour Azure.')
    console.log('📋 Structure actuelle:')
    const listFiles = (dir, prefix = '') => {
      const items = fs.readdirSync(dir)
      items.forEach(item => {
        const itemPath = path.join(dir, item)
        const stat = fs.statSync(itemPath)
        if (stat.isDirectory()) {
          console.log(`${prefix}📁 ${item}/`)
          listFiles(itemPath, prefix + '  ')
        } else {
          console.log(`${prefix}📄 ${item}`)
        }
      })
    }
    listFiles(distPath)
  }
}

cleanAssets() 