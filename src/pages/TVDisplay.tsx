import React, { useState, useEffect } from 'react'
import { TVScoreboard } from '../components/TVDisplay/TVScoreboard'
import { Match, Team, Tournament } from '../types'
import { liveDataService } from '../services/advancedApi'

const TVDisplay: React.FC = () => {
  const [currentMatch, setCurrentMatch] = useState<Match | undefined>()
  const [nextMatches, setNextMatches] = useState<Match[]>([])
  const [tournament, setTournament] = useState<Tournament | undefined>()
  const [teams, setTeams] = useState<Team[]>([])
  const [isLive, setIsLive] = useState(false)

  // Charger les vraies données depuis l'API
  useEffect(() => {
    const loadLiveData = async () => {
      try {
        // Charger le match en cours
        const currentMatchData = await liveDataService.getCurrentMatch()
        if (currentMatchData && currentMatchData.id !== 'mock-match-1') {
          setCurrentMatch(currentMatchData)
          setIsLive(true)
        }

        // Charger les prochains matchs
        const nextMatchesData = await liveDataService.getNextMatches(5)
        if (nextMatchesData && nextMatchesData.length > 0 && nextMatchesData[0].id !== 'mock-match-2') {
          setNextMatches(nextMatchesData)
        }

        // Si pas de match en cours, afficher les prochains matchs
        if (!currentMatchData || currentMatchData.id === 'mock-match-1') {
          if (nextMatchesData && nextMatchesData.length > 0 && nextMatchesData[0].id !== 'mock-match-2') {
            setIsLive(false)
          } else {
            // Utiliser les données mock si pas de vraies données
            loadMockData()
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données en direct:', error)
        // Fallback vers les données de test en cas d'erreur
        loadMockData()
      }
    }

    const loadMockData = () => {
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Équipe A',
          logo: '',
          players: [],
          coach: 'Coach A',
          wins: 3,
          draws: 1,
          losses: 1,
          goals: 12,
          goalsAgainst: 5,
          matches: 5,
          createdAt: new Date().toISOString(),
          averageLevel: 4,
          playerLevels: {}
        },
        {
          id: '2',
          name: 'Équipe B',
          logo: '',
          players: [],
          coach: 'Coach B',
          wins: 2,
          draws: 2,
          losses: 1,
          goals: 8,
          goalsAgainst: 6,
          matches: 5,
          createdAt: new Date().toISOString(),
          averageLevel: 3,
          playerLevels: {}
        }
      ]

      const mockTournament: Tournament = {
        id: '1',
        name: 'Tournoi d\'Été 2024',
        logo: '',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        prize: '1000 DT',
        rules: 'Règlement standard',
        status: 'active',
        teams: mockTeams,
        tournamentTeams: [],
        matches: [],
        drawCompleted: true,
        numberOfGroups: 2,
        teamsPerGroup: 4,
        groups: [],
        freePlayers: []
      }

      const mockCurrentMatch: Match = {
        id: '1',
        homeTeam: '1',
        awayTeam: '2',
        homeScore: 2,
        awayScore: 1,
        date: new Date().toISOString(),
        time: '15:30',
        status: 'live',
        type: 'tournament',
        venue: 'Terrain Principal',
        tournamentId: '1'
      }

      const mockNextMatches: Match[] = [
        {
          id: '2',
          homeTeam: '3',
          awayTeam: '4',
          homeScore: 0,
          awayScore: 0,
          date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          time: '17:00',
          status: 'scheduled',
          type: 'tournament',
          venue: 'Terrain Principal',
          tournamentId: '1'
        },
        {
          id: '3',
          homeTeam: '5',
          awayTeam: '6',
          homeScore: 0,
          awayScore: 0,
          date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          time: '19:00',
          status: 'scheduled',
          type: 'tournament',
          venue: 'Terrain Principal',
          tournamentId: '1'
        }
      ]

      setTeams(mockTeams)
      setTournament(mockTournament)
      setCurrentMatch(mockCurrentMatch)
      setNextMatches(mockNextMatches)
      setIsLive(true)
    }

    loadLiveData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Affichage TV - Stade
          </h1>
          <p className="text-gray-300">
            Interface optimisée pour écrans TV dans les stades
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Contrôles</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg ${
                isLive 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}
            >
              {isLive ? 'Match en Direct' : 'Mode Attente'}
            </button>
            <button
              onClick={() => setCurrentMatch(undefined)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Afficher Prochains Matchs
            </button>
          </div>
        </div>

        <TVScoreboard
          currentMatch={currentMatch}
          nextMatches={nextMatches}
          tournament={tournament}
          teams={teams}
          isLive={isLive}
        />
      </div>
    </div>
  )
}

export default TVDisplay 