import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Users, Clock, Star, Zap, ArrowRight, UserCheck, Target } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const FreePlayers: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const floatingVariants: Variants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div className="mb-16" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-8 shadow-2xl"
              variants={floatingVariants}
              animate="animate"
            >
              <Users className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {isArabic ? 'اللاعبون الأحرار' : 'Joueurs Libres'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {isArabic 
                ? 'اكتشف اللاعبين الأحرار الموهوبين وانضم للفرق أو ابحث عن لاعبين لفرقك'
                : 'Découvrez les joueurs libres talentueux et rejoignez des équipes ou trouvez des joueurs pour vos équipes'
              }
            </p>
          </motion.div>

          {/* Coming Soon Section */}
          <motion.div 
            className="relative mb-20"
            variants={itemVariants}
          >
            <div className="relative bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-xl rounded-3xl p-12 border border-blue-500/20 shadow-2xl">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
              
              <div className="relative z-10">
                <motion.div
                  className="flex items-center justify-center mb-8"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Clock className="w-16 h-16 text-white" />
                  </div>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black text-center mb-6">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {isArabic ? 'قريباً' : 'Coming Soon'}
                  </span>
                </h2>

                <p className="text-xl text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                  {isArabic 
                    ? 'نحن نعمل على إطلاق منصة اللاعبين الأحرار. ستكون متاحة قريباً مع ميزات رائعة للبحث والتواصل!'
                    : 'Nous travaillons sur le lancement de la plateforme des joueurs libres. Elle sera bientôt disponible avec des fonctionnalités incroyables de recherche et de communication !'
                  }
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto mb-8">
                  <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-center text-gray-400 mt-2">60% {isArabic ? 'مكتمل' : 'Terminé'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            variants={itemVariants}
          >
            {[
              {
                icon: UserCheck,
                title: isArabic ? 'البحث المتقدم' : 'Recherche Avancée',
                description: isArabic 
                  ? 'ابحث عن لاعبين حسب الموقع والمهارات والخبرة'
                  : 'Recherchez des joueurs par position, compétences et expérience',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Star,
                title: isArabic ? 'تقييم المهارات' : 'Évaluation des Compétences',
                description: isArabic 
                  ? 'نظام تقييم شامل لمهارات اللاعبين وأدائهم'
                  : 'Système d\'évaluation complet des compétences et performances des joueurs',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Zap,
                title: isArabic ? 'تواصل سريع' : 'Communication Rapide',
                description: isArabic 
                  ? 'تواصل مباشر مع اللاعبين والفرق عبر المنصة'
                  : 'Communication directe avec les joueurs et équipes via la plateforme',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                whileHover={{ y: -10 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Section */}
          <motion.div 
            className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-12 border border-blue-500/20"
            variants={itemVariants}
          >
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {isArabic ? 'كن أول من يعرف' : 'Soyez les premiers informés'}
              </h3>
              
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                {isArabic 
                  ? 'سجل بريدك الإلكتروني لتصلك الإشعارات عند إطلاق منصة اللاعبين الأحرار'
                  : 'Inscrivez votre email pour être notifié dès l\'ouverture de la plateforme des joueurs libres'
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={isArabic ? "بريدك الإلكتروني" : "Votre email"}
                  className="flex-1 px-6 py-4 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>{isArabic ? 'إشعارني' : 'M\'alerter'}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default FreePlayers 