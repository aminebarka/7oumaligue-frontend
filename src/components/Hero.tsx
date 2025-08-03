import React from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, Play, Users, Trophy, Star, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import Logo3D from './Logo3D'
import Button3D from './ui/Button3D'

const Hero: React.FC = () => {
  const navigate = useNavigate()
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

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "500+",
      label: isArabic ? "لاعب" : "Joueurs"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      value: "50+",
      label: isArabic ? "بطولة" : "Tournois"
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: "1000+",
      label: isArabic ? "مباراة" : "Matchs"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image avec overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/background.png)',
        }}
      >
        {/* Overlay gradient pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Contenu principal */}
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
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-center">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {isArabic ? "دوري السبع" : "7OUMA"}
                </span>
                <br />
                <span className="text-white">
                  {isArabic ? "الحي" : "LIGUE"}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                {isArabic 
                  ? "انضم إلى أكبر منصة لإدارة بطولات كرة القدم المصغرة في تونس"
                  : "Rejoignez la plus grande plateforme de gestion de tournois de football à 7"
                }
              </p>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button3D
                size="lg"
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/register')}
                className="group"
              >
                <span className="flex items-center">
                  {isArabic ? "ابدأ الآن" : "Commencer"}
                  <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
                </span>
              </Button3D>
              
              <Button3D
                size="lg"
                variant="ghost"
                icon={Play}
                iconPosition="left"
                onClick={() => navigate('/tournaments')}
              >
                {isArabic ? "استكشف البطولات" : "Explorer les tournois"}
              </Button3D>
            </motion.div>

            {/* Statistiques */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center text-white/60">
                <span className="text-sm mb-2">
                  {isArabic ? "اكتشف المزيد" : "Découvrir plus"}
                </span>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
                >
                  <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Particules flottantes pour l'ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero 