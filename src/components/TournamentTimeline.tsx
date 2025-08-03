import React from 'react'
import { motion } from 'framer-motion'
import { Users, Shuffle, Calendar, BarChart3, FileText, Tv } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

const TournamentTimeline: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const navigate = useNavigate()

  const steps = [
    {
      icon: Users,
      title: isArabic ? 'إضافة الفرق' : 'Ajouter équipes',
      description: isArabic ? 'أضف فرقك أو اختر من القائمة' : 'Ajoutez vos équipes ou choisissez dans la liste',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shuffle,
      title: isArabic ? 'سحب تلقائي' : 'Tirage automatique',
      description: isArabic ? 'تقسيم الفرق إلى مجموعات ذكية' : 'Répartition intelligente des équipes',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calendar,
      title: isArabic ? 'تقويم ذكي' : 'Calendrier intelligent',
      description: isArabic ? 'جدولة المباريات تلقائياً' : 'Planification automatique des matchs',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: isArabic ? 'نتائج مباشرة' : 'Résultats live',
      description: isArabic ? 'متابعة النتائج والإحصائيات' : 'Suivi des résultats et statistiques',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: FileText,
      title: isArabic ? 'PDF / شهادات' : 'PDF / Certificats',
      description: isArabic ? 'إنشاء شهادات وتقارير' : 'Génération de certificats et rapports',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Tv,
      title: isArabic ? 'عرض التلفاز' : 'Affichage TV',
      description: isArabic ? 'عرض النتائج على شاشات الملعب' : 'Affichage des résultats sur écrans',
      color: 'from-accent to-accent-light'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <section className="relative py-24 overflow-hidden">
             {/* Background Image avec overlay */}
       <div className="absolute inset-0 z-0">
         <img 
           src="/background5.png" 
           alt="Background" 
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
       </div>

             {/* Particules flottantes et flèches */}
       <div className="absolute inset-0 z-1">
         <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
         <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
         <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
         <div className="absolute bottom-20 right-10 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
         
         {/* Flèches décoratives */}
         <div className="absolute top-32 left-1/4 w-4 h-4 text-blue-400 animate-bounce">
           <svg fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
         </div>
         <div className="absolute top-48 right-1/3 w-4 h-4 text-purple-400 animate-bounce" style={{animationDelay: '0.5s'}}>
           <svg fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
         </div>
         <div className="absolute bottom-32 right-1/4 w-4 h-4 text-green-400 animate-bounce" style={{animationDelay: '1s'}}>
           <svg fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
         </div>
         <div className="absolute bottom-48 left-1/3 w-4 h-4 text-yellow-400 animate-bounce" style={{animationDelay: '1.5s'}}>
           <svg fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
         </div>
       </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec effet 3D */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
                     <motion.h2 
             className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           >
             <span className="bg-gradient-to-r from-green-300 via-yellow-300 to-green-300 bg-clip-text text-transparent">
               {isArabic ? 'أنشئ بطولتك في بضع نقرات' : 'Crée ton tournoi'}
             </span>
             <br />
             <span className="text-white text-4xl md:text-5xl lg:text-6xl">
               {isArabic ? 'بسهولة' : 'en quelques clics'}
             </span>
           </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isArabic 
              ? 'عملية بسيطة وسريعة لإدارة بطولتك المحلية مع تقنيات متقدمة'
              : 'Processus simple et rapide pour gérer votre tournoi local avec des technologies avancées'
            }
          </motion.p>
        </motion.div>

        {/* Timeline 3D améliorée */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
                     {/* Ligne de connexion 3D */}
           <div className="absolute top-20 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 rounded-full opacity-40 blur-sm"></div>
           <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-yellow-300 to-green-300 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                                 {/* Carte 3D avec effet glassmorphism */}
                 <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-all duration-500 border border-white/30 overflow-hidden">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                                     {/* Numéro du step avec effet 3D */}
                   <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-white/20">
                     {index + 1}
                   </div>

                  {/* Icône 3D */}
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl border border-white/20`}
                  >
                    <step.icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </motion.div>

                  {/* Contenu avec typographie améliorée */}
                  <div className="text-center relative z-10">
                    <h3 className="text-xl font-black text-white mb-3 drop-shadow-lg">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>

                  {/* Indicateur de progression 3D */}
                  {index < steps.length - 1 && (
                    <div className="hidden xl:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                                             <motion.div
                         animate={{ x: [0, 15, 0] }}
                         transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                         className="w-12 h-1 bg-gradient-to-r from-green-300 to-yellow-300 rounded-full shadow-lg"
                       />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA 3D amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
                     <motion.button 
             onClick={() => navigate('/tournaments')}
             className="group relative px-12 py-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 hover:from-blue-500 hover:via-purple-500 hover:to-blue-600 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-[0_25px_50px_rgba(59,130,246,0.4)] transition-all duration-500 transform hover:scale-110 border-2 border-white/30 overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Contenu du bouton */}
            <div className="relative z-10 flex items-center justify-center gap-4">
              <span className="text-2xl">🚀</span>
              <span>{isArabic ? 'ابدأ الآن' : 'Commencer maintenant'}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl"
              >
                →
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default TournamentTimeline 