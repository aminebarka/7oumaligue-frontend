const http = require('http');

async function testInfiniteLoop() {
  console.log('🔍 Test de boucle infinie...\n');

  // 1. Vérifier que le serveur répond
  console.log('1. Test de connexion au serveur...');
  try {
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:5000/health', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      req.on('error', reject);
      req.setTimeout(5000, () => reject(new Error('Timeout')));
    });

    console.log(`   ✅ Serveur accessible (status: ${response.statusCode})`);
  } catch (error) {
    console.log('   ❌ Serveur non accessible:', error.message);
    return;
  }

  // 2. Tester plusieurs requêtes pour vérifier la stabilité
  console.log('\n2. Test de stabilité des requêtes...');
  const requests = [];
  
  for (let i = 0; i < 5; i++) {
    requests.push(
      new Promise((resolve, reject) => {
        const req = http.get('http://localhost:5000/health', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });
        req.on('error', reject);
        req.setTimeout(5000, () => reject(new Error('Timeout')));
      })
    );
  }

  try {
    const results = await Promise.all(requests);
    console.log('   ✅ Toutes les requêtes ont réussi');
    results.forEach((result, index) => {
      console.log(`   📊 Requête ${index + 1}: ${result.statusCode}`);
    });
  } catch (error) {
    console.log('   ❌ Erreur lors des requêtes multiples:', error.message);
  }

  // 3. Vérifier les logs du serveur
  console.log('\n3. Recommandations:');
  console.log('   🔍 Vérifiez les logs du serveur pour des erreurs répétées');
  console.log('   🔍 Surveillez la console du navigateur pour des warnings React');
  console.log('   🔍 Vérifiez que les composants ne se re-rendent pas en boucle');

  console.log('\n🎯 Test terminé. Si le problème persiste:');
  console.log('   - Redémarrez le serveur: npm run dev');
  console.log('   - Vérifiez les dépendances dans useEffect');
  console.log('   - Utilisez React DevTools pour surveiller les re-renders');
}

testInfiniteLoop().catch(console.error); 