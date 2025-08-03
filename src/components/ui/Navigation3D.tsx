import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  description?: string
}

interface Navigation3DProps {
  items: NavigationItem[]
  className?: string
  variant?: 'horizontal' | 'vertical' | 'grid'
}

const Navigation3D: React.FC<Navigation3DProps> = ({
  items,
  className = '',
  variant = 'horizontal'
}) => {
  const location = useLocation()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const navItemVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      filter: "drop-shadow(0 0 0 rgba(0,0,0,0))"
    },
    hover: {
      y: -4,
      scale: 1.05,
      filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
      transition: {
        duration: 0.2,
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

  const isActive = (href: string) => location.pathname === href

  const getContainerClasses = () => {
    switch (variant) {
      case 'horizontal':
        return 'flex space-x-4'
      case 'vertical':
        return 'flex flex-col space-y-4'
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
      default:
        return 'flex space-x-4'
    }
  }

  const getItemClasses = (isActive: boolean) => {
    const baseClasses = 'relative p-4 rounded-xl transition-all duration-300 cursor-pointer'
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg`
    }
    
    return `${baseClasses} bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40`
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${getContainerClasses()} ${className}`}
    >
      {items.map((item, index) => {
        const Icon = item.icon
        const active = isActive(item.href)
        
        return (
          <motion.div
            key={item.href}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              variants={navItemVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={getItemClasses(active)}
            >
              <Link to={item.href} className="block">
                {/* Effet de lueur pour l'élément actif */}
                {active && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-lg"
                  />
                )}
                
                {/* Bordure brillante */}
                <div className="absolute inset-0 rounded-xl border border-white/20" />
                
                {/* Contenu */}
                <div className="relative z-10 flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-white/10'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    {item.description && (
                      <div className="text-sm opacity-80">{item.description}</div>
                    )}
                  </div>
                </div>

                {/* Effet de réflexion */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-xl" />
              </Link>
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default Navigation3D 