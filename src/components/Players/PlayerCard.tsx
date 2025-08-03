import React from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy, Target, Zap, Shield, Heart } from 'lucide-react'
import { Player } from '../../types'

interface PlayerCardProps {
  player: Player
  isHoverable?: boolean
  size?: 'small' | 'medium' | 'large'
  showStats?: boolean
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isHoverable = true,
  size = 'medium',
  showStats = true
}) => {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Gardien': return 'from-yellow-500 to-yellow-600'
      case 'Défenseur': return 'from-blue-500 to-blue-600'
      case 'Milieu': return 'from-green-500 to-green-600'
      case 'Attaquant': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'text-yellow-500'
    if (level >= 3) return 'text-green-500'
    if (level >= 2) return 'text-blue-500'
    return 'text-gray-500'
  }

  const getLevelStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < level ? getLevelColor(level) : 'text-gray-300'}`}
        fill={i < level ? 'currentColor' : 'none'}
      />
    ))
  }

  const getStats = () => {
    // Statistiques simulées basées sur le niveau et la position
    const baseStats = {
      vitesse: Math.floor(Math.random() * 20) + 60 + player.level * 5,
      technique: Math.floor(Math.random() * 20) + 60 + player.level * 5,
      physique: Math.floor(Math.random() * 20) + 60 + player.level * 5,
      mental: Math.floor(Math.random() * 20) + 60 + player.level * 5
    }

    // Ajuster selon la position
    switch (player.position) {
      case 'Gardien':
        baseStats.technique += 10
        baseStats.mental += 10
        break
      case 'Défenseur':
        baseStats.physique += 10
        baseStats.mental += 5
        break
      case 'Milieu':
        baseStats.technique += 10
        baseStats.vitesse += 5
        break
      case 'Attaquant':
        baseStats.vitesse += 10
        baseStats.technique += 5
        break
    }

    return baseStats
  }

  const stats = getStats()

  const cardSizes = {
    small: 'w-48 h-64',
    medium: 'w-64 h-80',
    large: 'w-80 h-96'
  }

  const CardComponent = isHoverable ? motion.div : 'div'
  const cardProps = isHoverable ? {
    whileHover: { scale: 1.05, y: -5 },
    whileTap: { scale: 0.95 }
  } : {}

  return (
    <CardComponent
      {...cardProps}
      className={`${cardSizes[size]} bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700 relative group cursor-pointer`}
    >
      {/* Fond avec effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header avec position et niveau */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPositionColor(player.position)} text-white text-xs font-bold`}>
            {player.position}
          </div>
          <div className="flex items-center space-x-1">
            {getLevelStars(player.level)}
          </div>
        </div>
        
        {/* Numéro de maillot */}
        {player.jerseyNumber && (
          <div className="absolute top-2 right-2 text-6xl font-bold text-white/20">
            {player.jerseyNumber}
          </div>
        )}
      </div>

      {/* Photo du joueur (placeholder) */}
      <div className="relative z-10 px-4">
        <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
          <div className="text-6xl font-bold text-white/30">
            {player.name.charAt(0).toUpperCase()}
          </div>
          {/* Badge de niveau */}
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{player.level}</span>
          </div>
        </div>
      </div>

      {/* Informations du joueur */}
      <div className="relative z-10 p-4">
        <h3 className="text-lg font-bold text-white mb-1 truncate">
          {player.name}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {player.age} ans • Niveau {player.level}
        </p>

        {/* Statistiques */}
        {showStats && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">Vitesse</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-semibold">{stats.vitesse}</span>
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                    style={{ width: `${stats.vitesse}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3 text-blue-400" />
                <span className="text-gray-300">Technique</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-semibold">{stats.technique}</span>
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                    style={{ width: `${stats.technique}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Physique</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-semibold">{stats.physique}</span>
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    style={{ width: `${stats.physique}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-400" />
                <span className="text-gray-300">Mental</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-semibold">{stats.mental}</span>
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                    style={{ width: `${stats.mental}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer avec équipe */}
      {player.team && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {player.team.name.charAt(0)}
              </span>
            </div>
            <span className="text-white text-sm font-medium truncate">
              {player.team.name}
            </span>
          </div>
        </div>
      )}

      {/* Effet de brillance au survol */}
      {isHoverable && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </CardComponent>
  )
} 