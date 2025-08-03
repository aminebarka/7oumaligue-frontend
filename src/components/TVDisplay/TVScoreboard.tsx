import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, Users, Target } from 'lucide-react'
import { Match, Team, Tournament } from '../../types'

interface TVScoreboardProps {
  currentMatch?: Match
  nextMatches: Match[]
  tournament?: Tournament
  teams: Team[]
  isLive: boolean
}

export const TVScoreboard: React.FC<TVScoreboardProps> = ({
  currentMatch,
  nextMatches,
  tournament,
  teams,
  isLive
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNextMatches, setShowNextMatches] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Alterner entre match en cours et prochains matchs
    const interval = setInterval(() => {
      setShowNextMatches(prev => !prev)
    }, 10000) // 10 secondes

    return () => clearInterval(interval)
  }, [])

  const getTeamById = (teamId: string) => {
    return teams.find(team => team.id === teamId)
  }

  const formatTime = (time: string | undefined) => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Header avec logo et informations du tournoi */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">7</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  7OUMA LIGUE
                </h1>
                {tournament && (
                  <p className="text-lg text-gray-300">{tournament.name}</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-mono font-bold">
                {currentTime.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-lg text-gray-300">
                {currentTime.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          {isLive && currentMatch && !showNextMatches ? (
            <motion.div
              key="live-match"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Match en cours */}
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-lg font-bold">EN DIRECT</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 items-center">
                  {/* Équipe domicile */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold">
                        {getTeamById(currentMatch.homeTeam)?.name?.charAt(0) || 'H'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {getTeamById(currentMatch.homeTeam)?.name || 'Équipe A'}
                    </h2>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className="text-8xl font-bold mb-4">
                      {currentMatch.homeScore} - {currentMatch.awayScore}
                    </div>
                    <div className="text-xl text-gray-300">
                      {formatTime(currentMatch.time)}
                    </div>
                  </div>

                  {/* Équipe extérieur */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold">
                        {getTeamById(currentMatch.awayTeam)?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {getTeamById(currentMatch.awayTeam)?.name || 'Équipe B'}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Statistiques du match */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-gray-300">Tirs</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-3xl font-bold">8</div>
                  <div className="text-gray-300">Fautes</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-3xl font-bold">35'</div>
                  <div className="text-gray-300">Temps</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="next-matches"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Prochains matchs */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-2">Prochains Matchs</h2>
                <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {nextMatches.slice(0, 4).map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-300">
                        {formatTime(match.time)}
                      </div>
                      <div className="text-sm text-gray-300">
                        {match.venue}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">
                            {getTeamById(match.homeTeam)?.name?.charAt(0) || 'H'}
                          </span>
                        </div>
                        <span className="text-lg font-semibold">
                          {getTeamById(match.homeTeam)?.name || 'Équipe A'}
                        </span>
                      </div>

                      <div className="text-center text-2xl font-bold text-gray-300">VS</div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">
                            {getTeamById(match.awayTeam)?.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <span className="text-lg font-semibold">
                          {getTeamById(match.awayTeam)?.name || 'Équipe B'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer avec informations supplémentaires */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-semibold">Tournoi en cours</span>
              </div>
              <div className="text-gray-300">
                {tournament?.teams?.length || 0} équipes participantes
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-300">
                Powered by 7ouma Ligue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 