import axios from 'axios'

export interface Stadium {
  id: string
  name: string
  city: string
  address?: string
  capacity?: number
  surface?: string
  image?: string
}

export const stadiumService = {
  // Récupérer tous les stades
  getStadiums: async (): Promise<Stadium[]> => {
    try {
      const response = await axios.get('/api/stadiums/public')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching stadiums:', error)
      return []
    }
  },

  // Récupérer un stade par ID
  getStadium: async (id: string): Promise<Stadium | null> => {
    try {
      const response = await axios.get(`/api/stadiums/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching stadium:', error)
      return null
    }
  },

  // Créer un nouveau stade
  createStadium: async (stadium: Omit<Stadium, 'id'>): Promise<Stadium | null> => {
    try {
      const response = await axios.post('/api/stadiums', stadium)
      return response.data.data
    } catch (error) {
      console.error('Error creating stadium:', error)
      return null
    }
  },

  // Mettre à jour un stade
  updateStadium: async (id: string, stadium: Partial<Stadium>): Promise<Stadium | null> => {
    try {
      const response = await axios.put(`/api/stadiums/${id}`, stadium)
      return response.data.data
    } catch (error) {
      console.error('Error updating stadium:', error)
      return null
    }
  },

  // Supprimer un stade
  deleteStadium: async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`/api/stadiums/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting stadium:', error)
      return false
    }
  }
} 