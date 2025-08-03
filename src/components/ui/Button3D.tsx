import React from 'react'
import { motion, Variants } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Button3DProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl',
    outline: 'bg-transparent border-2 border-white/20 text-white hover:bg-white/10',
    ghost: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
  }

  const buttonVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      filter: "drop-shadow(0 0 0 rgba(0,0,0,0))"
    },
    hover: {
      y: -2,
      scale: 1.02,
      filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    },
    tap: {
      y: 0,
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    },
    disabled: {
      opacity: 0.5,
      y: 0,
      scale: 1
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

  return (
    <motion.button
      className={`
        relative font-semibold rounded-xl transition-all duration-300
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      variants={buttonVariants}
      initial="initial"
      whileHover={disabled ? "disabled" : "hover"}
      whileTap={disabled ? "disabled" : "tap"}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Effet de lueur */}
      <motion.div
        variants={glowVariants}
        className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-lg"
      />
      
      {/* Bordure brillante */}
      <div className="absolute inset-0 rounded-xl border border-white/20" />
      
      {/* Contenu du bouton */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {Icon && iconPosition === 'left' && (
          <Icon className="w-5 h-5" />
        )}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && (
          <Icon className="w-5 h-5" />
        )}
      </div>

      {/* Effet de réflexion */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent rounded-xl" />
    </motion.button>
  )
}

export default Button3D 