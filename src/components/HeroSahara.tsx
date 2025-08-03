import React from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Sun, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import Logo3D from './Logo3D'
import Button3D from './ui/Button3D'

const HeroSahara: React.FC = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  }

  const floatingBallVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  const sunVariants: Variants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  }

  const sandVariants: Variants = {
    animate: {
      x: [0, 10, 0],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-100 to-amber-200 dark:from-gray-900 dark:via-orange-900 dark:to-red-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Sun */}
        <motion.div
          variants={sunVariants}
          animate="animate"
          className="absolute top-20 right-20 w-32 h-32"
        >
          <Sun className="w-full h-full text-yellow-400 opacity-60" />
        </motion.div>

        {/* Floating Football */}
        <motion.div
          variants={floatingBallVariants}
          animate="animate"
          className="absolute top-1/4 left-1/4 w-16 h-16"
        >
          <div className="w-full h-full bg-gradient-to-br from-black to-gray-800 rounded-full shadow-2xl border-4 border-white">
            <div className="w-full h-full bg-gradient-to-br from-white to-gray-300 rounded-full p-2">
              <div className="w-full h-full bg-black rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Sand Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            variants={sandVariants}
            animate="animate"
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}

        {/* Wind Effect */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Logo et titre principal */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex justify-center mb-8">
                <Logo3D size="xl" variant="hero" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {isArabic 
                    ? "المنصة الذكية لبطولات الأحياء"
                    : "La plateforme intelligente des tournois de quartier"
                  }
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                {isArabic 
                  ? "أدر، تابع ونمّي بطولاتك المحلية بأداة احترافية مصممة للمجتمع"
                  : "Gérez, suivez et développez vos tournois locaux avec un outil professionnel pensé pour la communauté"
                }
              </p>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button3D
                size="lg"
                variant="primary"
                icon={Sparkles}
                iconPosition="right"
                onClick={() => navigate('/create-tournament')}
                className="group"
              >
                <span className="flex items-center">
                  {isArabic ? "إنشاء بطولتي" : "Créer mon tournoi"}
                  <Wind className="ml-2 w-5 h-5 group-hover:animate-pulse" />
                </span>
              </Button3D>
              
              <Button3D
                size="lg"
                variant="ghost"
                icon={Play}
                iconPosition="left"
                onClick={() => navigate('/tournaments')}
              >
                {isArabic ? "رؤية آخر البطولات" : "Voir les derniers tournois"}
              </Button3D>
            </motion.div>

            {/* Statistiques rapides */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <div className="text-3xl font-bold text-orange-600 mb-1">120+</div>
                <div className="text-gray-700 dark:text-gray-200">
                  {isArabic ? "بطولة" : "Tournois"}
                </div>
              </div>
              <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <div className="text-3xl font-bold text-orange-600 mb-1">1500+</div>
                <div className="text-gray-700 dark:text-gray-200">
                  {isArabic ? "لاعب" : "Joueurs"}
                </div>
              </div>
              <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <div className="text-3xl font-bold text-orange-600 mb-1">98%</div>
                <div className="text-gray-700 dark:text-gray-200">
                  {isArabic ? "رضا" : "Satisfaction"}
                </div>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center text-gray-600 dark:text-gray-300">
                <span className="text-sm mb-2">
                  {isArabic ? "اكتشف المزيد" : "Découvrir plus"}
                </span>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
                >
                  <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50"></div>
    </div>
  )
}

export default HeroSahara 