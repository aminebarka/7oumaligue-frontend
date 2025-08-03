import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function checkDeployment() {
  console.log('🔍 Vérification du déploiement...\n')

  // 1. Vérifier package.json
  console.log('📦 Vérification package.json...')
  const packageJsonPath = path.join(__dirname, '../package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json non trouvé')
    return false
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  if (!packageJson.scripts.build) {
    console.error('❌ Script build manquant dans package.json')
    return false
  }
  console.log('✅ package.json OK')

  // 2. Vérifier staticwebapp.config.json
  console.log('\n⚙️ Vérification staticwebapp.config.json...')
  const configPath = path.join(__dirname, '../staticwebapp.config.json')
  if (!fs.existsSync(configPath)) {
    console.error('❌ staticwebapp.config.json non trouvé')
    return false
  }
  console.log('✅ staticwebapp.config.json OK')

  // 3. Vérifier le workflow GitHub Actions
  console.log('\n🔄 Vérification workflow GitHub Actions...')
  const workflowPath = path.join(__dirname, '../.github/workflows/azure-static-web-apps.yml')
  if (!fs.existsSync(workflowPath)) {
    console.error('❌ Workflow GitHub Actions non trouvé')
    return false
  }
  console.log('✅ Workflow GitHub Actions OK')

  // 4. Vérifier vite.config.ultra.ts
  console.log('\n⚡ Vérification vite.config.ultra.ts...')
  const viteConfigPath = path.join(__dirname, '../vite.config.ultra.ts')
  if (!fs.existsSync(viteConfigPath)) {
    console.error('❌ vite.config.ultra.ts non trouvé')
    return false
  }
  console.log('✅ vite.config.ultra.ts OK')

  // 5. Vérifier les scripts de nettoyage
  console.log('\n🧹 Vérification scripts de nettoyage...')
  const cleanAssetsPath = path.join(__dirname, 'clean-assets.js')
  const inlineCssPath = path.join(__dirname, 'inline-css.js')
  
  if (!fs.existsSync(cleanAssetsPath)) {
    console.error('❌ clean-assets.js non trouvé')
    return false
  }
  if (!fs.existsSync(inlineCssPath)) {
    console.error('❌ inline-css.js non trouvé')
    return false
  }
  console.log('✅ Scripts de nettoyage OK')

  // 6. Vérifier les types
  console.log('\n📝 Vérification types...')
  const typesPath = path.join(__dirname, '../src/types/ai.ts')
  if (!fs.existsSync(typesPath)) {
    console.error('❌ types/ai.ts non trouvé')
    return false
  }
  console.log('✅ Types OK')

  // 7. Vérifier les routes backend
  console.log('\n🔗 Vérification routes backend...')
  const backendRoutesPath = path.join(__dirname, '../../backend/src/routes/tournamentAI.routes.ts')
  if (!fs.existsSync(backendRoutesPath)) {
    console.error('❌ Routes backend non trouvées')
    return false
  }
  console.log('✅ Routes backend OK')

  console.log('\n🎉 Toutes les vérifications sont passées !')
  console.log('\n📋 Checklist de déploiement :')
  console.log('1. ✅ package.json avec script build')
  console.log('2. ✅ staticwebapp.config.json configuré')
  console.log('3. ✅ Workflow GitHub Actions créé')
  console.log('4. ✅ Configuration Vite ultra-minimale')
  console.log('5. ✅ Scripts de nettoyage présents')
  console.log('6. ✅ Types TypeScript définis')
  console.log('7. ✅ Routes backend créées')
  
  console.log('\n🚀 Prêt pour le déploiement !')
  console.log('\n📝 Prochaines étapes :')
  console.log('1. Configurer le secret AZURE_STATIC_WEB_APPS_API_TOKEN dans GitHub')
  console.log('2. Pousser sur la branche main')
  console.log('3. Vérifier le déploiement dans GitHub Actions')
  
  return true
}

checkDeployment() 