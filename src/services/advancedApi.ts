import axios from 'axios'
import { 
  TournamentSuggestion, 
  TournamentConstraints, 
  PersonalizedRecommendationRequest,
  TournamentCreationRequest,
  TournamentCreationResponse 
} from '../types/ai'

// API pour les suggestions de tournois
export const generateTournamentSuggestions = async (constraints: TournamentConstraints): Promise<TournamentSuggestion[]> => {
  try {
    const response = await axios.post('/api/tournaments/ai/suggestions', constraints)
    return response.data.data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating tournament suggestions:', error.message)
    }
    throw error
  }
}

// API pour créer un tournoi basé sur une suggestion
export const createTournamentFromSuggestion = async (suggestion: TournamentSuggestion): Promise<TournamentCreationResponse> => {
  try {
    const response = await axios.post('/api/tournaments/ai/create', suggestion)
    return response.data.data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating tournament:', error.message)
    }
    throw error
  }
}

// API pour obtenir une recommandation personnalisée
export const getPersonalizedRecommendation = async (
  teams: number,
  venue: string,
  timeSlot: string,
  budget: number
): Promise<TournamentSuggestion> => {
  try {
    const request: PersonalizedRecommendationRequest = {
      teams,
      venue,
      timeSlot,
      budget
    }
    const response = await axios.post('/api/tournaments/ai/personalized', request)
    return response.data.data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting personalized recommendation:', error.message)
    }
    throw error
  }
}

// Service pour les suggestions de tournoi AI
export const tournamentAIService = {
  // Obtenir des suggestions de format de tournoi
  getSuggestions: async (constraints: TournamentConstraints): Promise<TournamentSuggestion[]> => {
    return generateTournamentSuggestions(constraints)
  },

  // Générer une recommandation personnalisée
  getPersonalizedRecommendation: async (
    teams: number,
    venue: string,
    timeSlot: string,
    budget: number
  ): Promise<TournamentSuggestion> => {
    return getPersonalizedRecommendation(teams, venue, timeSlot, budget)
  }
}

// Utiliser une URL plus robuste qui fonctionne en développement et production
const API_URL = "https://backend-7oumaligue-hrd4bqesgcefg5h4.francecentral-01.azurewebsites.net/api"


// Types pour les nouvelles fonctionnalités
export interface SocialPost {
  id: string
  content: string
  media: string[]
  hashtags: string[]
  likes: number
  comments: number
  shares: number
  createdAt: string
  playerId?: string
  teamId?: string
  tournamentId?: string
  player?: any
  team?: any
  tournament?: any
  isLiked?: boolean
}

export interface PaymentTransaction {
  id: string
  transactionId: string
  tournamentId: string
  teamId: string
  amount: number
  commission: number
  netAmount: number
  paymentMethod: string
  playerCount: number
  organizerId: number
  status: string
  paymentData?: string
  completedAt?: string
  createdAt: string
  tournament?: any
  team?: any
}

export interface PlayerStats {
  id: string
  playerId: string
  tournamentId?: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  matchesPlayed: number
  minutesPlayed: number
  rating: number
  createdAt: string
  updatedAt: string
  player?: any
  tournament?: any
}

export interface PlayerBadge {
  id: string
  playerId: string
  badgeType: string
  badgeName: string
  description: string
  icon: string
  earnedAt: string
  tournamentId?: string
  player?: any
  tournament?: any
}

export interface Stadium {
  id: string
  name: string
  address: string
  city: string
  phone?: string
  email?: string
  website?: string
  logo?: string
  photos: string[]
  description?: string
  facilities: string[]
  isPartner: boolean
  partnerLevel?: string
  createdAt: string
  updatedAt: string
}

// Service pour le mur social
export const socialService = {
  // Obtenir tous les posts
  getPosts: async (): Promise<SocialPost[]> => {
    try {
      const response = await axios.get(`${API_URL}/social/posts`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error)
      return []
    }
  },

  // Créer un nouveau post
  createPost: async (postData: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>): Promise<SocialPost> => {
    try {
      const response = await axios.post(`${API_URL}/social/posts`, postData)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la création du post:', error)
      throw error
    }
  },

  // Liker/unliker un post
  toggleLike: async (postId: string): Promise<void> => {
    try {
      await axios.post(`${API_URL}/social/posts/${postId}/like`)
    } catch (error) {
      console.error('Erreur lors du like:', error)
      throw error
    }
  },

  // Ajouter un commentaire
  addComment: async (postId: string, comment: string): Promise<void> => {
    try {
      await axios.post(`${API_URL}/social/posts/${postId}/comments`, { content: comment })
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error)
      throw error
    }
  },

  // Partager un post
  sharePost: async (postId: string): Promise<void> => {
    try {
      await axios.post(`${API_URL}/social/posts/${postId}/share`)
    } catch (error) {
      console.error('Erreur lors du partage:', error)
      throw error
    }
  }
}

// Service pour les paiements
export const paymentService = {
  // Obtenir l'historique des paiements
  getTransactions: async (): Promise<PaymentTransaction[]> => {
    try {
      const response = await axios.get(`${API_URL}/payments/transactions`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error)
      return []
    }
  },

  // Créer une nouvelle transaction
  createPayment: async (paymentData: {
    tournamentId: string
    teamId: string
    amount: number
    paymentMethod: string
    playerCount: number
  }): Promise<{ transactionId: string; paymentUrl: string }> => {
    try {
      const response = await axios.post(`${API_URL}/payments/create`, paymentData)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error)
      throw error
    }
  },

  // Vérifier le statut d'un paiement
  checkPaymentStatus: async (transactionId: string): Promise<PaymentTransaction> => {
    try {
      const response = await axios.get(`${API_URL}/payments/status/${transactionId}`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error)
      throw error
    }
  },

  // Obtenir les statistiques de paiement
  getPaymentStats: async (organizerId: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/payments/stats/${organizerId}`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {}
    }
  }
}

// Service pour les statistiques des joueurs
export const playerStatsService = {
  // Obtenir les statistiques d'un joueur
  getPlayerStats: async (playerId: string): Promise<PlayerStats[]> => {
    try {
      const response = await axios.get(`${API_URL}/players/${playerId}/stats`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error)
      return []
    }
  },

  // Obtenir les badges d'un joueur
  getPlayerBadges: async (playerId: string): Promise<PlayerBadge[]> => {
    try {
      const response = await axios.get(`${API_URL}/players/${playerId}/badges`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération des badges:', error)
      return []
    }
  },

  // Mettre à jour les statistiques d'un joueur
  updatePlayerStats: async (playerId: string, stats: Partial<PlayerStats>): Promise<PlayerStats> => {
    try {
      const response = await axios.put(`${API_URL}/players/${playerId}/stats`, stats)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des stats:', error)
      throw error
    }
  }
}

// Service pour les stades
export const stadiumService = {
  // Obtenir tous les stades
  getStadiums: async (): Promise<Stadium[]> => {
    try {
      console.log('🔄 Tentative de récupération des stades...');
      
      // Utiliser la route simple /api/stadiums
      const response = await axios.get(`${API_URL}/stadiums`);
      console.log('✅ Stades récupérés via route simple');
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stades:', error);
      if (error instanceof Error) {
        console.error('📋 Détails de l\'erreur:', {
          message: error.message,
          response: (error as any).response?.data,
          status: (error as any).response?.status,
          statusText: (error as any).response?.statusText,
          url: (error as any).config?.url,
          method: (error as any).config?.method
        });
      } else {
        console.error('📋 Erreur inconnue:', error);
      }
      return [];
    }
  },

  // Obtenir un stade par ID
  getStadium: async (stadiumId: string): Promise<Stadium> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stadiums/${stadiumId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du stade:', error);
      throw error;
    }
  },

  // Obtenir les stades partenaires
  getPartnerStadiums: async (): Promise<Stadium[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stadiums/partners`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stades partenaires:', error);
      return [];
    }
  }
}

// Service pour les données en temps réel (TV Display)
export const liveDataService = {
  // Obtenir le match en cours
  getCurrentMatch: async (): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/matches/current`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération du match en cours:', error)
      // Retourner des données mock en cas d'erreur
      return {
        id: 'mock-match-1',
        homeTeamRef: { name: 'Équipe A', logo: '⚽' },
        awayTeamRef: { name: 'Équipe B', logo: '⚽' },
        homeScore: 2,
        awayScore: 1,
        status: 'in_progress',
        date: new Date().toISOString(),
        time: '14:30',
        tournament: { name: 'Tournoi Test' }
      }
    }
  },

  // Obtenir les prochains matchs
  getNextMatches: async (limit: number = 5): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_URL}/matches/next?limit=${limit}`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération des prochains matchs:', error)
      // Retourner des données mock en cas d'erreur
      return [
        {
          id: 'mock-match-2',
          homeTeamRef: { name: 'Équipe C', logo: '⚽' },
          awayTeamRef: { name: 'Équipe D', logo: '⚽' },
          status: 'scheduled',
          date: new Date(Date.now() + 86400000).toISOString(),
          time: '16:00',
          tournament: { name: 'Tournoi Test' }
        },
        {
          id: 'mock-match-3',
          homeTeamRef: { name: 'Équipe E', logo: '⚽' },
          awayTeamRef: { name: 'Équipe F', logo: '⚽' },
          status: 'scheduled',
          date: new Date(Date.now() + 172800000).toISOString(),
          time: '18:30',
          tournament: { name: 'Tournoi Test' }
        }
      ]
    }
  },

  // Obtenir les statistiques en temps réel
  getLiveStats: async (matchId: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/matches/${matchId}/stats`)
      return response.data.data
    } catch (error) {
      console.error('Erreur lors de la récupération des stats en direct:', error)
      return {}
    }
  }
} 