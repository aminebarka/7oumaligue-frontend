import React from 'react'
import { motion, Variants } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Card3DProps {
  children: React.ReactNode
  variant?: 'default' | 'feature' | 'stats' | 'testimonial'
  icon?: LucideIcon
  title?: string
  description?: string
  className?: string
  onClick?: () => void
  interactive?: boolean
}

const Card3D: React.FC<Card3DProps> = ({
  children,
  variant = 'default',
  icon: Icon,
  title,
  description,
  className = '',
  onClick,
  interactive = false
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    feature: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20',
    stats: 'bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20',
    testimonial: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20'
  }

  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      filter: "drop-shadow(0 0 0 rgba(0,0,0,0))"
    },
    hover: interactive ? {
      y: -8,
      scale: 1.02,
      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    } : {},
    tap: interactive ? {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    } : {}
  }

  const glowVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.8
    },
    hover: interactive ? {
      opacity: 1,
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    } : {}
  }

  const iconVariants: Variants = {
    initial: {
      scale: 1,
      rotate: 0
    },
    hover: interactive ? {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    } : {}
  }

  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl transition-all duration-300
        ${variantClasses[variant]}
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      {/* Effet de lueur */}
      <motion.div
        variants={glowVariants}
        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-xl"
      />
      
      {/* Bordure brillante */}
      <div className="absolute inset-0 rounded-2xl border border-white/10" />
      
      {/* Contenu principal */}
      <div className="relative z-10">
        {/* Icône */}
        {Icon && (
          <motion.div
            variants={iconVariants}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 mb-4"
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
        )}
        
        {/* Titre */}
        {title && (
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {description}
          </p>
        )}
        
        {/* Contenu personnalisé */}
        {children}
      </div>

      {/* Effet de réflexion */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-2xl" />
    </motion.div>
  )
}

export default Card3D 