// Types pour les fonctionnalités d'IA

export interface TournamentSuggestion {
  id: string
  name: string
  description: string
  teamsCount: number
  duration: string
  complexity: 'easy' | 'medium' | 'hard'
  features: string[]
}

export interface TournamentConstraints {
  maxTeams: number
  maxDuration: string
  preferredFormat: string
  specialRequirements: string[]
}

export interface PersonalizedRecommendationRequest {
  teams: number
  venue: string
  timeSlot: string
  budget: number
}

export interface TournamentCreationRequest {
  suggestion: TournamentSuggestion
}

export interface TournamentCreationResponse {
  id: string
  name: string
  teamsCount: number
  duration: string
  complexity: string
  features: string[]
  createdAt: Date
  status: string
} 