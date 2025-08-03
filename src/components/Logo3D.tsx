import React from 'react'
import { motion, Variants } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'hero' | 'header'
  className?: string
}

const Logo3D: React.FC<Logo3DProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}) => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const containerVariants: Variants = {
    initial: { 
      rotateY: 0,
      scale: 1
    },
    hover: { 
      rotateY: 15,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  const logoVariants: Variants = {
    initial: { 
      y: 0,
      filter: "drop-shadow(0 0 0 rgba(0,0,0,0))"
    },
    hover: { 
      y: -5,
      filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const glowVariants: Variants = {
    initial: { 
      opacity: 0,
      scale: 0.8
    },
    hover: { 
      opacity: 1,
      scale: 1.2,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const textVariants: Variants = {
    initial: { 
      opacity: 0,
      x: variant === 'hero' ? -20 : 0
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2
      }
    }
  }

  return (
    <motion.div
      className={`relative inline-flex items-center ${className}`}
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Effet de lueur */}
      <motion.div
        variants={glowVariants}
        className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"
      />
      
      {/* Logo principal intégré naturellement */}
      <motion.div
        variants={logoVariants}
        className={`relative ${sizeClasses[size]} flex items-center justify-center`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Logo image sans cadre */}
        <div className="relative z-10 w-full h-full">
          <img
            src="/logo.png"
            alt="7OUMA LIGUE"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Effet de lueur subtil */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-xl" />
      </motion.div>

      {/* Texte du logo */}
      {variant !== 'header' && (
        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          className={`ml-4 ${variant === 'hero' ? 'text-white' : 'text-gray-900 dark:text-white'}`}
        >
          <div className="flex flex-col">
            <span className={`font-bold ${variant === 'hero' ? 'text-3xl md:text-4xl' : 'text-xl'} bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent`}>
              {isArabic ? "دوري السبع" : "7OUMA"}
            </span>
            <span className={`font-semibold ${variant === 'hero' ? 'text-xl md:text-2xl' : 'text-sm'} ${variant === 'hero' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
              {isArabic ? "الحي" : "LIGUE"}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Logo3D 