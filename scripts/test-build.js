import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function testBuild() {
  console.log('🔍 Test du build...\n')

  try {
    // Test TypeScript
    console.log('📝 Vérification TypeScript...')
    const { stdout: tsOutput, stderr: tsError } = await execAsync('npx tsc --noEmit', { cwd: process.cwd() })
    
    if (tsError) {
      console.error('❌ Erreurs TypeScript:')
      console.error(tsError)
      return false
    }
    
    console.log('✅ TypeScript OK')

    // Test build ultra
    console.log('\n⚡ Test build ultra...')
    const { stdout: buildOutput, stderr: buildError } = await execAsync('npm run build:ultra', { cwd: process.cwd() })
    
    if (buildError) {
      console.error('❌ Erreurs de build:')
      console.error(buildError)
      return false
    }
    
    console.log('✅ Build ultra OK')
    console.log('\n📊 Résumé du build:')
    console.log(buildOutput)

    // Vérifier la structure du dist
    console.log('\n📁 Vérification structure dist...')
    const { stdout: lsOutput } = await execAsync('ls -la dist/', { cwd: process.cwd() })
    console.log(lsOutput)

    console.log('\n🎉 Tous les tests sont passés !')
    return true

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
    return false
  }
}

testBuild() 