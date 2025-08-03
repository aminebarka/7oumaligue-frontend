import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Filter, Star, MapPin, Clock, Trophy } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import Card3D from './ui/Card3D'

interface FreePlayer {
  id: string
  name: string
  position: string
  reputation: number
  lastMatch: string
  team: string | null
  location: string
  availability: 'available' | 'busy' | 'maybe'
}

const FreePlayers: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const navigate = useNavigate()
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  const [selectedReputation, setSelectedReputation] = useState<string>('all')

  // Mock data - à remplacer par des vraies données
  const freePlayers: FreePlayer[] = [
    {
      id: '1',
      name: 'Ahmed Ben Ali',
      position: 'Attaquant',
      reputation: 4.8,
      lastMatch: 'Il y a 2 jours',
      team: null,
      location: 'Douz',
      availability: 'available'
    },
    {
      id: '2',
      name: 'Youssef El Amrani',
      position: 'Milieu',
      reputation: 4.5,
      lastMatch: 'Hier',
      team: null,
      location: 'Douz',
      availability: 'available'
    },
    {
      id: '3',
      name: 'Karim Benslimane',
      position: 'Défenseur',
      reputation: 4.2,
      lastMatch: 'Il y a 3 jours',
      team: null,
      location: 'Douz',
      availability: 'maybe'
    },
    {
      id: '4',
      name: 'Hassan Tazi',
      position: 'Gardien',
      reputation: 4.7,
      lastMatch: 'Aujourd\'hui',
      team: null,
      location: 'Douz',
      availability: 'available'
    }
  ]

  const positions = [
    { value: 'all', label: isArabic ? 'جميع المراكز' : 'Toutes positions' },
    { value: 'Attaquant', label: isArabic ? 'مهاجم' : 'Attaquant' },
    { value: 'Milieu', label: isArabic ? 'وسط' : 'Milieu' },
    { value: 'Défenseur', label: isArabic ? 'مدافع' : 'Défenseur' },
    { value: 'Gardien', label: isArabic ? 'حارس' : 'Gardien' }
  ]

  const reputationLevels = [
    { value: 'all', label: isArabic ? 'جميع المستويات' : 'Tous niveaux' },
    { value: 'high', label: isArabic ? 'مستوى عالي' : 'Niveau élevé' },
    { value: 'medium', label: isArabic ? 'مستوى متوسط' : 'Niveau moyen' },
    { value: 'low', label: isArabic ? 'مستوى منخفض' : 'Niveau débutant' }
  ]

  const filteredPlayers = freePlayers.filter(player => {
    const positionMatch = selectedPosition === 'all' || player.position === selectedPosition
    const reputationMatch = selectedReputation === 'all' || 
      (selectedReputation === 'high' && player.reputation >= 4.5) ||
      (selectedReputation === 'medium' && player.reputation >= 3.5 && player.reputation < 4.5) ||
      (selectedReputation === 'low' && player.reputation < 3.5)
    
    return positionMatch && reputationMatch
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'maybe': return 'text-yellow-600 bg-yellow-100'
      case 'busy': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return isArabic ? 'متاح' : 'Disponible'
      case 'maybe': return isArabic ? 'ربما' : 'Peut-être'
      case 'busy': return isArabic ? 'مشغول' : 'Occupé'
      default: return isArabic ? 'غير معروف' : 'Inconnu'
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-orange-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {isArabic ? 'اللاعبين الأحرار' : 'Joueurs Libres'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {isArabic 
              ? 'تحتاج لاعب إضافي لهذا المساء؟ ابحث عن لاعبين متاحين في منطقتك'
              : 'Vous manquez d\'un joueur pour ce soir ? Trouvez des joueurs disponibles dans votre région'
            }
          </p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 mb-8 justify-center"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {positions.map(position => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-gray-600" />
            <select
              value={selectedReputation}
              onChange={(e) => setSelectedReputation(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {reputationLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Liste des joueurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card3D
                variant="feature"
                interactive={true}
                className="h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {player.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {player.position}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {player.reputation}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{player.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{player.lastMatch}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(player.availability)}`}>
                      {getAvailabilityText(player.availability)}
                    </span>
                    
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-colors">
                      {isArabic ? 'تواصل' : 'Contacter'}
                    </button>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => navigate('/free-players')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-colors"
          >
            {isArabic ? 'عرض جميع اللاعبين' : 'Voir tous les joueurs'}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default FreePlayers 