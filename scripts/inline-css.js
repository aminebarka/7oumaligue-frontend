import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.join(__dirname, '../dist')

function inlineCSS() {
  console.log('🎨 Inlining CSS dans HTML...')
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dossier dist non trouvé')
    return
  }

  const htmlPath = path.join(distPath, 'index.html')
  const cssPath = path.join(distPath, 'style.css')

  if (!fs.existsSync(htmlPath)) {
    console.log('❌ index.html non trouvé')
    return
  }

  if (!fs.existsSync(cssPath)) {
    console.log('❌ style.css non trouvé')
    return
  }

  // Lire le HTML et le CSS
  let html = fs.readFileSync(htmlPath, 'utf8')
  const css = fs.readFileSync(cssPath, 'utf8')

  // Remplacer le lien CSS par le CSS inline
  const cssLinkRegex = /<link[^>]*href="[^"]*style\.css"[^>]*>/g
  const styleTag = `<style>${css}</style>`
  
  html = html.replace(cssLinkRegex, styleTag)

  // Écrire le HTML modifié
  fs.writeFileSync(htmlPath, html)
  console.log('✅ CSS inlined dans HTML')

  // Supprimer le fichier CSS
  fs.unlinkSync(cssPath)
  console.log('🗑️ Fichier CSS supprimé')

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
  
  if (totalFiles <= 3) {
    console.log('✅ SUCCÈS ! Nombre de fichiers acceptable pour Azure.')
  } else {
    console.log('⚠️ ATTENTION: Encore trop de fichiers pour Azure.')
  }
}

inlineCSS() 