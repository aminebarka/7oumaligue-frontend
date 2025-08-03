import express from 'express'
import { TournamentSuggestion, TournamentConstraints } from '../utils/tournamentAI'

const router = express.Router()

// Types pour l'API
interface TournamentSuggestionAPI {
  id: string
  name: string
  description: string
  teamsCount: number
  duration: string
  complexity: 'easy' | 'medium' | 'hard'
  features: string[]
}

interface TournamentConstraintsAPI {
  maxTeams: number
  maxDuration: string
  preferredFormat: string
  specialRequirements: string[]
}

// GET /api/tournaments/ai/suggestions
router.post('/suggestions', async (req, res) => {
  try {
    const constraints: TournamentConstraintsAPI = req.body

    // Simulation d'IA - suggestions basées sur les contraintes
    const suggestions: TournamentSuggestionAPI[] = [
      {
        id: '1',
        name: 'Mini League Tournament',
        description: 'Simple and organized league tournament with 8 teams',
        teamsCount: constraints.maxTeams,
        duration: constraints.maxDuration,
        complexity: 'easy',
        features: [
          'Round-robin format',
          'Automatic scheduling',
          'Detailed statistics'
        ]
      },
      {
        id: '2',
        name: 'Knockout Cup',
        description: 'Exciting knockout tournament with 16 teams',
        teamsCount: Math.min(constraints.maxTeams * 2, 32),
        duration: constraints.maxDuration,
        complexity: 'medium',
        features: [
          'Knockout system',
          'Thrilling matches',
          'Final playoffs'
        ]
      },
      {
        id: '3',
        name: 'Advanced Skills Tournament',
        description: 'Advanced tournament with special rules and challenges',
        teamsCount: Math.min(constraints.maxTeams, 12),
        duration: constraints.maxDuration,
        complexity: 'hard',
        features: [
          'Advanced rules',
          'Special challenges',
          'Complex scoring system'
        ]
      }
    ]

    res.json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    console.error('Error generating tournament suggestions:', error)
    res.status(500).json({
      success: false,
      message: 'Error generating tournament suggestions'
    })
  }
})

// POST /api/tournaments/ai/personalized
router.post('/personalized', async (req, res) => {
  try {
    const { teams, venue, timeSlot, budget } = req.body

    // Simulation d'IA - recommandation personnalisée
    const recommendation: TournamentSuggestionAPI = {
      id: Date.now().toString(),
      name: 'Personalized Tournament',
      description: `Custom tournament for ${teams} teams at ${venue}`,
      teamsCount: teams,
      duration: budget > 1000 ? '2 weeks' : '1 week',
      complexity: teams > 16 ? 'hard' : teams > 8 ? 'medium' : 'easy',
      features: [
        'Custom scheduling',
        'Venue optimization',
        'Budget management'
      ]
    }

    res.json({
      success: true,
      data: recommendation
    })
  } catch (error) {
    console.error('Error generating personalized recommendation:', error)
    res.status(500).json({
      success: false,
      message: 'Error generating personalized recommendation'
    })
  }
})

// POST /api/tournaments/ai/create
router.post('/create', async (req, res) => {
  try {
    const suggestion: TournamentSuggestionAPI = req.body

    // Simulation de création de tournoi
    const tournament = {
      id: Date.now().toString(),
      name: suggestion.name,
      teamsCount: suggestion.teamsCount,
      duration: suggestion.duration,
      complexity: suggestion.complexity,
      features: suggestion.features,
      createdAt: new Date(),
      status: 'draft'
    }

    res.json({
      success: true,
      data: tournament
    })
  } catch (error) {
    console.error('Error creating tournament:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating tournament'
    })
  }
})

export default router 