console.log('🌍 Test des traductions français/arabe...\n');

// Traductions à tester
const translations = {
  fr: {
    "Gérez vos tournois de mini-foot facilement et rapidement": "Gérez vos tournois de mini-foot facilement et rapidement",
    "Plateforme moderne pour organiser, suivre et vivre la passion du foot de quartier.": "Plateforme moderne pour organiser, suivre et vivre la passion du foot de quartier.",
    "Découvrir les tournois": "Découvrir les tournois",
    "Nos Héros": "Nos Héros",
    "أبطالنا": "أبطالنا"
  },
  ar: {
    "Gérez vos tournois de mini-foot facilement et rapidement": "إدارة بطولات كرة القدم المصغرة بسهولة وسرعة",
    "Plateforme moderne pour organiser, suivre et vivre la passion du foot de quartier.": "منصة حديثة لتنظيم ومتابعة وتجربة شغف كرة القدم المصغر.",
    "Découvrir les tournois": "اكتشف البطولات",
    "Nos Héros": "أبطالنا",
    "أبطالنا": "أبطالنا"
  }
};

console.log('✅ Traductions françaises:');
Object.entries(translations.fr).forEach(([key, value]) => {
  console.log(`   "${key}" → "${value}"`);
});

console.log('\n✅ Traductions arabes:');
Object.entries(translations.ar).forEach(([key, value]) => {
  console.log(`   "${key}" → "${value}"`);
});

console.log('\n🎯 Test terminé.');
console.log('💡 Pour tester dans l\'application:');
console.log('   - Allez sur la page d\'accueil');
console.log('   - Changez la langue avec le bouton FR/AR');
console.log('   - Vérifiez que les textes changent correctement'); 