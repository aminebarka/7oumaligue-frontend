import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Shuffle, CheckCircle } from 'lucide-react'
import { Team, Group } from '../../types'

interface GroupDrawAnimationProps {
  teams: Team[]
  numberOfGroups: number
  onDrawComplete: (groups: Group[]) => void
  onCancel: () => void
}

export const GroupDrawAnimation: React.FC<GroupDrawAnimationProps> = ({
  teams,
  numberOfGroups,
  onDrawComplete,
  onCancel
}) => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'drawing' | 'complete'>('intro')
  const [currentGroup, setCurrentGroup] = useState(0)
  const [drawnTeams, setDrawnTeams] = useState<Team[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    // Initialiser les groupes
    const initialGroups: Group[] = Array.from({ length: numberOfGroups }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Groupe ${String.fromCharCode(65 + i)}`, // A, B, C, D...
      tournamentId: '',
      groupTeams: [],
      matches: [],
      freePlayers: []
    }))
    setGroups(initialGroups)
  }, [numberOfGroups])

  const startDraw = () => {
    setCurrentPhase('drawing')
    setCurrentGroup(0)
    setDrawnTeams([])
    setIsDrawing(true)
    drawNextGroup()
  }

  const drawNextGroup = () => {
    if (currentGroup >= numberOfGroups) {
      setCurrentPhase('complete')
      setIsDrawing(false)
      return
    }

    const remainingTeams = teams.filter(team => !drawnTeams.includes(team))
    const teamsPerGroup = Math.ceil(teams.length / numberOfGroups)
    const currentGroupTeams = remainingTeams.slice(0, teamsPerGroup)

    // Animation de tirage
    setTimeout(() => {
      setDrawnTeams(prev => [...prev, ...currentGroupTeams])
      
      // Mettre à jour le groupe actuel
      const updatedGroups = [...groups]
      updatedGroups[currentGroup] = {
        ...updatedGroups[currentGroup],
        groupTeams: currentGroupTeams.map(team => ({
          id: `gt-${team.id}-${currentGroup}`,
          groupId: updatedGroups[currentGroup].id,
          teamId: team.id,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        }))
      }
      setGroups(updatedGroups)

      // Passer au groupe suivant
      setTimeout(() => {
        setCurrentGroup(prev => prev + 1)
        if (currentGroup + 1 < numberOfGroups) {
          drawNextGroup()
        } else {
          setCurrentPhase('complete')
          setIsDrawing(false)
        }
      }, 2000)
    }, 3000)
  }

  const completeDraw = () => {
    onDrawComplete(groups)
  }

  const getRemainingTeams = () => {
    return teams.filter(team => !drawnTeams.includes(team))
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentPhase === 'intro' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800">
                Tirage des Groupes
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                  <span>{teams.length} équipes</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span>{numberOfGroups} groupes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={startDraw}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Commencer le Tirage
                </button>
              </div>
            </motion.div>
          )}

          {currentPhase === 'drawing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Tirage en cours...
                </h2>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-spin">
                  <Shuffle className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Groupe en cours */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-center mb-4">
                  {groups[currentGroup]?.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {isDrawing && currentGroup < numberOfGroups && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="col-span-2 text-center py-8"
                    >
                      <div className="text-4xl font-bold text-gray-400 animate-pulse">
                        Tirage en cours...
                      </div>
                    </motion.div>
                  )}
                  
                  {groups[currentGroup]?.groupTeams?.map((groupTeam, index) => (
                    <motion.div
                      key={groupTeam.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {teams.find(t => t.id === groupTeam.teamId)?.name?.charAt(0) || 'T'}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {teams.find(t => t.id === groupTeam.teamId)?.name || 'Équipe'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Équipes restantes */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold mb-3">Équipes restantes</h4>
                <div className="flex flex-wrap gap-2">
                  {(getRemainingTeams() || []).map(team => (
                    <span
                      key={team.id}
                      className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                    >
                      {team.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentPhase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Tirage Terminé !
                </h2>
                <p className="text-gray-600">
                  Les groupes ont été formés avec succès
                </p>
              </div>

              {/* Résumé des groupes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(groups || []).map((group, index) => (
                  <div
                    key={group.id}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
                  >
                    <h3 className="font-bold text-lg mb-3 text-center">
                      {group.name}
                    </h3>
                    <div className="space-y-2">
                      {group.groupTeams?.map(groupTeam => (
                        <div
                          key={groupTeam.id}
                          className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2"
                        >
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {teams.find(t => t.id === groupTeam.teamId)?.name?.charAt(0) || 'T'}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {teams.find(t => t.id === groupTeam.teamId)?.name || 'Équipe'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={completeDraw}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Confirmer les Groupes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 