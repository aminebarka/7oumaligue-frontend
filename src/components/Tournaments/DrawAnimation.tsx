import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Shuffle } from 'lucide-react'

interface Team {
  id: string
  name: string
  logo: string
}

interface Group {
  name: string
  teams: Team[]
}

interface DrawAnimationProps {
  tournament: {
    id: string
    name: string
    logo: string
  }
  teams: Team[]
  numberOfGroups: number
  onDrawComplete: (groups: Group[]) => void
  onCancel: () => void
}

const DrawAnimation: React.FC<DrawAnimationProps> = ({
  tournament,
  teams,
  numberOfGroups,
  onDrawComplete,
  onCancel
}) => {
  const [phase, setPhase] = useState<'intro' | 'shuffling' | 'drawing' | 'complete'>('intro')
  const [shuffledTeams, setShuffledTeams] = useState<Team[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [currentDrawIndex, setCurrentDrawIndex] = useState(0)
  const [remainingTeams, setRemainingTeams] = useState<Team[]>([])

  useEffect(() => {
    if (phase === 'intro') {
      setTimeout(() => setPhase('shuffling'), 2000)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'shuffling') {
      // Mélanger les équipes
      const shuffled = shuffleArray([...teams])
      setShuffledTeams(shuffled)
      setRemainingTeams(shuffled)
      
      setTimeout(() => setPhase('drawing'), 3000)
    }
  }, [phase, teams])

  useEffect(() => {
    if (phase === 'drawing') {
      const teamsPerGroup = Math.ceil(teams.length / numberOfGroups)
      const newGroups: Group[] = []

      for (let i = 0; i < numberOfGroups; i++) {
        const groupTeams = shuffledTeams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup)
        newGroups.push({
          name: `Groupe ${String.fromCharCode(65 + i)}`,
          teams: groupTeams
        })
      }

      setGroups(newGroups)
      
      // Animation progressive du tirage
      let drawIndex = 0
      const drawInterval = setInterval(() => {
        if (drawIndex < teams.length) {
          setCurrentDrawIndex(drawIndex)
          setRemainingTeams(shuffledTeams.slice(drawIndex + 1))
          drawIndex++
        } else {
          clearInterval(drawInterval)
          setTimeout(() => setPhase('complete'), 1000)
        }
      }, 500)
    }
  }, [phase, shuffledTeams, teams.length, numberOfGroups])

  useEffect(() => {
    if (phase === 'complete') {
      setTimeout(() => {
        onDrawComplete(groups)
      }, 2000)
    }
  }, [phase, groups, onDrawComplete])

  const shuffleArray = (array: Team[]): Team[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const getPhaseTitle = () => {
    switch (phase) {
      case 'intro':
        return 'Préparation du tirage'
      case 'shuffling':
        return 'Mélange des équipes'
      case 'drawing':
        return 'Tirage en cours'
      case 'complete':
        return 'Tirage terminé'
      default:
        return ''
    }
  }

  const getPhaseDescription = () => {
    switch (phase) {
      case 'intro':
        return 'Préparation du tirage au sort des groupes...'
      case 'shuffling':
        return 'Mélange aléatoire des équipes pour garantir l\'équité'
      case 'drawing':
        return 'Attribution des équipes aux groupes'
      case 'complete':
        return 'Le tirage est terminé ! Voici les groupes formés'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">Tirage de Groupes</h1>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl text-gray-600">{tournament.name}</h2>
        </div>

        {/* Phase Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            {getPhaseTitle()}
          </h3>
          <p className="text-blue-700">{getPhaseDescription()}</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Équipes restantes */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Équipes en attente
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {(remainingTeams || []).map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                  >
                    <div className="text-2xl mb-1">{team.logo}</div>
                    <div className="text-sm font-medium text-gray-800">{team.name}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Groupes */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Groupes formés
            </h3>
            <div className="space-y-4">
              {(groups || []).map((group, groupIndex) => (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.2 }}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-gray-800 mb-3">{group.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(group.teams || []).map((team, teamIndex) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: (groupIndex * group.teams.length + teamIndex) * 0.1,
                          duration: 0.5
                        }}
                        className={`flex items-center space-x-2 p-2 rounded ${
                          currentDrawIndex >= groupIndex * Math.ceil(teams.length / numberOfGroups) + teamIndex
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-gray-100'
                        }`}
                      >
                        <span className="text-lg">{team.logo}</span>
                        <span className="text-sm font-medium text-gray-700">{team.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Animation de mélange */}
        {phase === 'shuffling' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-white text-6xl"
            >
              <Shuffle />
            </motion.div>
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-center space-x-4 mt-8">
          {phase === 'intro' && (
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          )}
          
          {phase === 'complete' && (
            <button
              onClick={() => onDrawComplete(groups)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Confirmer le tirage
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrawAnimation 