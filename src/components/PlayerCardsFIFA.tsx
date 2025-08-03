import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy, Target, Zap, Heart, Eye } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

interface PlayerCard {
  id: string
  name: string
  position: string
  team: string
  overall: number
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  reputation: number
  goals: number
  assists: number
  image: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const PlayerCardsFIFA: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const navigate = useNavigate()
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  // Mock data - cartes joueurs style FIFA
  const players: PlayerCard[] = [
    {
      id: '1',
      name: 'Ahmed Ben Ali',
      position: 'ST',
      team: 'Équipe A',
      overall: 87,
      pace: 89,
      shooting: 88,
      passing: 75,
      dribbling: 82,
      defending: 45,
      physical: 78,
      reputation: 4.8,
      goals: 24,
      assists: 8,
      image: '/placeholder-user.jpg',
      rarity: 'epic'
    },
    {
      id: '2',
      name: 'Youssef El Amrani',
      position: 'CM',
      team: 'Équipe B',
      overall: 84,
      pace: 76,
      shooting: 72,
      passing: 88,
      dribbling: 85,
      defending: 68,
      physical: 75,
      reputation: 4.6,
      goals: 12,
      assists: 18,
      image: '/placeholder-user.jpg',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Karim Benslimane',
      position: 'CB',
      team: 'Équipe C',
      overall: 82,
      pace: 70,
      shooting: 45,
      passing: 65,
      dribbling: 55,
      defending: 88,
      physical: 85,
      reputation: 4.4,
      goals: 3,
      assists: 2,
      image: '/placeholder-user.jpg',
      rarity: 'common'
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500'
      case 'rare': return 'from-blue-400 to-blue-500'
      case 'epic': return 'from-purple-400 to-purple-500'
      case 'legendary': return 'from-secondary to-accent'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return isArabic ? 'عادي' : 'COMMON'
      case 'rare': return isArabic ? 'نادر' : 'RARE'
      case 'epic': return isArabic ? 'ملحمي' : 'EPIC'
      case 'legendary': return isArabic ? 'أسطوري' : 'LEGENDARY'
      default: return 'COMMON'
    }
  }

  const cardVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: { 
      scale: 1.05, 
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    selected: {
      scale: 1.1,
      rotateY: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isArabic ? 'بطاقات اللاعبين' : 'Cartes FIFA'}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {isArabic 
              ? 'اكتشف أفضل اللاعبين مع إحصائيات مفصلة'
              : 'Découvrez les meilleurs joueurs avec des statistiques détaillées'
            }
          </p>
        </motion.div>

                          {/* Section Promo Professionnelle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-12 border border-gray-700 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                {/* Texte à gauche */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-8">
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                      <span className="block bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                        {isArabic ? 'احصل على الحلم' : 'Offrez-vous le rêve'}
                      </span>
                      <span className="block text-white">{isArabic ? 'لبطاقة FUT' : 'd\'une carte FUT'}</span>
                      <span className="block bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl inline-block mt-4 text-2xl font-bold shadow-lg">
                        {isArabic ? 'مخصصة' : 'personnalisée'}
                      </span>
                    </h3>
                  </div>
                  
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                    {isArabic 
                      ? 'احصل على بطاقة FIFA مخصصة خاصة بك مع إحصائياتك الخاصة وألوان فريقك المفضلة'
                      : 'Créez votre carte FIFA personnalisée avec vos propres statistiques, photos et couleurs d\'équipe. Un souvenir unique de vos performances !'
                    }
                  </p>
                  
                                     <div className="flex flex-col sm:flex-row gap-6">
                     {/* Bouton Principal */}
                     <motion.button
                       onClick={() => navigate('/store')}
                       whileHover={{ 
                         scale: 1.05,
                         boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                       }}
                       whileTap={{ scale: 0.95 }}
                       className="group relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl overflow-hidden"
                     >
                       {/* Effet de brillance */}
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                       
                       {/* Contenu du bouton */}
                       <div className="relative z-10 flex items-center gap-3">
                         <span className="text-xl font-black">{isArabic ? 'أنشئ بطاقتي' : 'Je crée ma carte'}</span>
                         <div className="flex items-center gap-2">
                           <span className="text-3xl animate-pulse">🔥</span>
                           <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                         </div>
                       </div>
                     </motion.button>
                     
                     {/* Bouton Secondaire */}
                     <motion.button
                       onClick={() => navigate('/store')}
                       whileHover={{ 
                         scale: 1.05,
                         boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)"
                       }}
                       whileTap={{ scale: 0.95 }}
                       className="group relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 text-gray-200 hover:text-white font-bold py-5 px-10 rounded-2xl transition-all duration-500 flex items-center justify-center gap-4 border-2 border-gray-600 hover:border-gray-400 shadow-xl overflow-hidden"
                     >
                       {/* Effet de brillance */}
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                       
                       {/* Contenu du bouton */}
                       <div className="relative z-10 flex items-center gap-3">
                         <span className="text-xl font-bold">{isArabic ? 'عرض المزيد' : 'Voir plus d\'exemples'}</span>
                         <motion.div
                           animate={{ x: [0, 5, 0] }}
                           transition={{ duration: 2, repeat: Infinity }}
                           className="text-2xl"
                         >
                           →
                         </motion.div>
                       </div>
                     </motion.button>
                   </div>
                </div>
                
                {/* Exemple de carte à droite */}
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="relative"
                  >
                    <div className="text-center mb-6">
                      <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                        {isArabic ? 'مثال على البطاقة المخصصة' : 'Exemple de carte personnalisée'}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                      <img 
                        src="/carteicône.webp" 
                        alt="Exemple de carte FIFA personnalisée" 
                        className="relative w-full max-w-sm mx-auto rounded-3xl shadow-2xl border-2 border-gray-600"
                      />
                    </div>
                    
                    <div className="text-center mt-6">
                      <div className="flex justify-center items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{isArabic ? 'صورة مخصصة' : 'Photo personnalisée'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{isArabic ? 'إحصائيات حقيقية' : 'Stats réelles'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

        

        {/* Statistiques détaillées (si joueur sélectionné) */}
        {selectedPlayer && (
          <motion.div
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="text-center text-white mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {players.find(p => p.id === selectedPlayer)?.name}
              </h3>
              <p className="text-white/80">
                {isArabic ? 'إحصائيات مفصلة' : 'Statistiques détaillées'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">{isArabic ? 'السرعة' : 'Vitesse'}</span>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                      style={{ width: `${players.find(p => p.id === selectedPlayer)?.pace}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">{isArabic ? 'التسديد' : 'Tir'}</span>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                      style={{ width: `${players.find(p => p.id === selectedPlayer)?.shooting}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">{isArabic ? 'التمرير' : 'Passe'}</span>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                      style={{ width: `${players.find(p => p.id === selectedPlayer)?.passing}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">{isArabic ? 'المراوغة' : 'Dribble'}</span>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                      style={{ width: `${players.find(p => p.id === selectedPlayer)?.dribbling}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">{isArabic ? 'الدفاع' : 'Défense'}</span>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                      style={{ width: `${players.find(p => p.id === selectedPlayer)?.defending}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">{isArabic ? 'البدنية' : 'Physique'}</span>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                      style={{ width: `${players.find(p => p.id === selectedPlayer)?.physical}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default PlayerCardsFIFA 