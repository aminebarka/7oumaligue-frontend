import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { Trophy, Users, Calendar, TrendingUp, Star, Shield, Target, UserCheck, Building2, Briefcase, BarChart3 } from 'lucide-react'
import Hero3D from '../components/Hero3D'
import TournamentTimeline from '../components/TournamentTimeline'
import PlayerCardsFIFA from '../components/PlayerCardsFIFA'
import TahiaCoachAI from '../components/TahiaCoachAI'
import FeaturesSection from '../components/FeaturesSection'
import FreePlayers from '../components/FreePlayers'
import MobileApp from '../components/MobileApp'
import Footer from '../components/Footer'


const Home: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 1. Hero Section 3D */}
      <Hero3D />



      {/* 3. Timeline "Crée ton tournoi" */}
      <TournamentTimeline />

      {/* 4. Cartes FIFA */}
      <PlayerCardsFIFA />

      {/* 5. Assistant AI Tahia Coach */}
      <TahiaCoachAI />

      {/* 6. Fonctionnalités clés */}
      <FeaturesSection />

      {/* 4. Section "Pour qui ?" - Design Pro */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header avec effet 3D */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl"
            >
              <Target className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {isArabic ? 'لمن هذه المنصة؟' : 'Pour qui ?'}
              </span>
            </h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {isArabic 
                ? 'منصة شاملة لجميع أفراد المجتمع الرياضي مع تقنيات متقدمة'
                : 'Une plateforme complète pour tous les acteurs du football de quartier avec des technologies avancées'
              }
            </motion.p>
          </motion.div>

          {/* Grille des utilisateurs avec design pro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: isArabic ? 'للمنظمين' : 'Pour les organisateurs',
                description: isArabic ? 'أدر بطولاتك بسهولة واحترافية مع أدوات متقدمة' : 'Gérez vos tournois facilement et professionnellement avec des outils avancés',
                icon: Trophy,
                color: 'from-orange-500 via-red-500 to-pink-500',
                bgColor: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
                borderColor: 'border-orange-200 dark:border-orange-700'
              },
              {
                title: isArabic ? 'لللاعبين' : 'Pour les joueurs',
                description: isArabic ? 'انضم للفرق وشارك في المباريات مع تتبع الأداء' : 'Rejoignez des équipes et participez aux matchs avec suivi de performance',
                icon: Users,
                color: 'from-blue-500 via-purple-500 to-indigo-500',
                bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
                borderColor: 'border-blue-200 dark:border-blue-700'
              },
              {
                title: isArabic ? 'للمشجعين' : 'Pour les supporters',
                description: isArabic ? 'تابع المباريات وادعم فرقك المفضلة في الوقت الفعلي' : 'Suivez les matchs et soutenez vos équipes en temps réel',
                icon: Star,
                color: 'from-green-500 via-teal-500 to-emerald-500',
                bgColor: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
                borderColor: 'border-green-200 dark:border-green-700'
              },
              {
                title: isArabic ? 'لمديري الملاعب' : 'Pour les gérants de stade',
                description: isArabic ? 'زود حجوزاتك وادعم البطولات المحلية مع إدارة ذكية' : 'Augmentez vos réservations et soutenez les tournois locaux avec gestion intelligente',
                icon: Building2,
                color: 'from-yellow-500 via-orange-500 to-amber-500',
                bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
                borderColor: 'border-yellow-200 dark:border-yellow-700'
              },
              {
                title: isArabic ? 'للرعاة المحليين' : 'Pour les sponsors locaux',
                description: isArabic ? 'عرض علامتك التجارية في البطولات المحلية مع تحليلات متقدمة' : 'Exposez votre marque dans les tournois locaux avec analyses avancées',
                icon: Briefcase,
                color: 'from-purple-500 via-pink-500 to-rose-500',
                bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
                borderColor: 'border-purple-200 dark:border-purple-700'
              },
              {
                title: isArabic ? 'للمدربين' : 'Pour les entraîneurs',
                description: isArabic ? 'طور مهارات فريقك مع أدوات تحليل متقدمة وتقارير مفصلة' : 'Développez les compétences de votre équipe avec outils d\'analyse avancés',
                icon: BarChart3,
                color: 'from-indigo-500 via-blue-500 to-cyan-500',
                bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
                borderColor: 'border-indigo-200 dark:border-indigo-700'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className={`relative p-8 rounded-3xl ${item.bgColor} border-2 ${item.borderColor} shadow-xl hover:shadow-2xl transition-all duration-500 h-full overflow-hidden backdrop-blur-sm`}>
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Icône avec effet 3D */}
                  <div className="relative z-10 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 mb-4`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Indicateur de progression */}
                  <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <div className={`w-8 h-1 bg-gradient-to-r ${item.color} rounded-full`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. App Mobile */}
      <MobileApp />

      {/* 6. Joueurs Libres */}
      <FreePlayers />

      {/* 7. Chiffres clés */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isArabic ? 'الأرقام تتحدث' : 'Les chiffres parlent'}
          </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '120+', label: isArabic ? 'بطولة' : 'Tournois gérés' },
              { value: '1500+', label: isArabic ? 'لاعب' : 'Joueurs enregistrés' },
              { value: '98%', label: isArabic ? 'رضا' : 'Satisfaction organisateurs' },
              { value: '100%', label: isArabic ? 'محلي' : 'Adapté au local' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
            </div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Pour les stades & sponsors */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-yellow-50 dark:from-gray-900 dark:to-yellow-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Stades */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {isArabic ? 'للملاعب' : 'Pour les stades'}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {isArabic 
                  ? 'زود حجوزاتك وادعم البطولات المحلية. احصل على المزيد من العملاء من خلال نظامنا.'
                  : 'Augmentez vos réservations et soutenez les tournois locaux. Obtenez plus de clients grâce à notre système.'
                }
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-colors">
                {isArabic ? 'انضم كملعب شريك' : 'Devenir stade partenaire'}
              </button>
            </motion.div>

            {/* Sponsors */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {isArabic ? 'للرعاة' : 'Pour les sponsors'}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {isArabic 
                  ? 'عرض شعارك على شاشات التلفاز والإحصائيات. اربط علامتك التجارية بالرياضة المحلية.'
                  : 'Exposez votre logo sur les écrans TV et les statistiques. Associez votre marque au sport local.'
                }
              </p>
              <button 
                onClick={() => navigate('/sponsors')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                {isArabic ? 'اصبح راعياً' : 'Devenir sponsor'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Avis & témoignages */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {isArabic ? 'آراء المستخدمين' : 'Avis & témoignages'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Ahmed Ben Ali',
                role: isArabic ? 'منظم بطولات' : 'Organisateur',
                content: isArabic 
                  ? 'سهل الاستخدام، حتى للبطولات في حيي'
                  : 'Facile à utiliser, même pour les tournois dans ma cité',
                rating: 5
              },
              {
                name: 'Youssef El Amrani',
                role: isArabic ? 'لاعب' : 'Joueur',
                content: isArabic 
                  ? 'أدارنا كل البطولة من هاتفنا'
                  : 'On a géré tout le tournoi depuis notre téléphone',
                rating: 5
              },
              {
                name: 'Karim Benslimane',
                role: isArabic ? 'مدير ملعب' : 'Gérant de stade',
                content: isArabic 
                  ? 'زادت الحجوزات بنسبة 40%'
                  : 'Les réservations ont augmenté de 40%',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-700"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Call to action final */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-orange-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isArabic 
                ? 'جاهز لإنشاء بطولة حيك؟'
                : 'Prêt à créer le tournoi de ta 7ouma ?'
              }
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {isArabic 
                ? 'انضم لآلاف اللاعبين والمنظمين الذين يثقون بنا'
                : 'Rejoignez des milliers de joueurs et organisateurs qui nous font confiance'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-colors">
                {isArabic ? 'إنشاء بطولة الآن' : 'Créer un tournoi maintenant'}
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-colors">
                {isArabic ? 'رؤية عرض توضيحي' : 'Voir une démo'}
              </button>
          </div>
          </motion.div>
        </div>
      </section>

      {/* 11. Footer */}
      <Footer />
    </div>
  )
}

export default Home
