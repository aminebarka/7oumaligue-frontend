// Service WebSocket pour la communication en temps réel
// Utilise les API backend pour la persistance en base de données
// Plus tard, on pourra implémenter Socket.io ou Supabase Realtime

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  playerId?: string;
  playerName?: string;
  team: 'home' | 'away';
  description: string;
  timestamp: Date;
  matchId: string;
}

export interface LiveMatchState {
  matchId: string;
  isLive: boolean;
  isPaused: boolean;
  matchTime: number;
  events: MatchEvent[];
  homeScore: number;
  awayScore: number;
}

class LiveMatchService {
  private listeners: Map<string, ((state: LiveMatchState) => void)[]> = new Map();
  private matchStates: Map<string, LiveMatchState> = new Map();
  private pollingIntervals: Map<string, number> = new Map();

  // S'abonner aux mises à jour d'un match
  subscribe(matchId: string, callback: (state: LiveMatchState) => void) {
    if (!this.listeners.has(matchId)) {
      this.listeners.set(matchId, []);
    }
    this.listeners.get(matchId)!.push(callback);

    // Démarrer le polling si pas déjà actif
    if (!this.pollingIntervals.has(matchId)) {
      this.startPolling(matchId);
    }

    // Retourner la fonction de désabonnement
    return () => {
      const callbacks = this.listeners.get(matchId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }

      // Arrêter le polling si plus d'auditeurs
      if (this.listeners.get(matchId)?.length === 0) {
        this.stopPolling(matchId);
      }
    };
  }

  // Démarrer le polling pour un match
  private startPolling(matchId: string) {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/live-matches/${matchId}/state`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const state: LiveMatchState = {
            matchId,
            isLive: data.data.liveState.isLive,
            isPaused: data.data.liveState.isPaused,
            matchTime: data.data.liveState.matchTime,
            homeScore: data.data.liveState.homeScore,
            awayScore: data.data.liveState.awayScore,
            events: data.data.events || [],
          };
          
          this.emit(matchId, state);
        }
      } catch (error) {
        console.error('Erreur lors du polling:', error);
      }
    }, 2000); // Polling toutes les 2 secondes

    this.pollingIntervals.set(matchId, interval as unknown as number);
  }

  // Arrêter le polling pour un match
  private stopPolling(matchId: string) {
    const interval = this.pollingIntervals.get(matchId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(matchId);
    }
  }

  // Émettre une mise à jour pour un match
  emit(matchId: string, state: LiveMatchState) {
    this.matchStates.set(matchId, state);
    
    const callbacks = this.listeners.get(matchId);
    if (callbacks) {
      callbacks.forEach(callback => callback(state));
    }
  }

  // Obtenir l'état actuel d'un match
  getState(matchId: string): LiveMatchState | undefined {
    return this.matchStates.get(matchId);
  }

  // Ajouter un événement à un match
  async addEvent(matchId: string, event: MatchEvent) {
    try {
      const response = await fetch(`/api/live-matches/${matchId}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: event.type,
          minute: event.minute,
          playerId: event.playerId,
          playerName: event.playerName,
          team: event.team,
          description: event.description,
        }),
      });
      
      if (response.ok) {
        // L'événement sera récupéré lors du prochain polling
        console.log('Événement ajouté avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
    }
  }

  // Mettre à jour le temps d'un match
  async updateMatchTime(matchId: string, matchTime: number) {
    try {
      const response = await fetch(`/api/live-matches/${matchId}/time`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchTime }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const state: LiveMatchState = {
          matchId,
          isLive: data.data.isLive,
          isPaused: data.data.isPaused,
          matchTime: data.data.matchTime,
          homeScore: data.data.homeScore,
          awayScore: data.data.awayScore,
          events: [],
        };
        this.emit(matchId, state);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du temps:', error);
    }
  }

  // Mettre à jour le score d'un match
  updateScore(matchId: string, homeScore: number, awayScore: number) {
    const currentState = this.getState(matchId);
    if (currentState) {
      const newState = {
        ...currentState,
        homeScore,
        awayScore
      };
      this.emit(matchId, newState);
    }
  }

  // Démarrer un match
  async startMatch(matchId: string) {
    try {
      const response = await fetch(`/api/live-matches/${matchId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const state: LiveMatchState = {
          matchId,
          isLive: data.data.isLive,
          isPaused: data.data.isPaused,
          matchTime: data.data.matchTime,
          homeScore: data.data.homeScore,
          awayScore: data.data.awayScore,
          events: [],
        };
        this.emit(matchId, state);
      }
    } catch (error) {
      console.error('Erreur lors du démarrage du match:', error);
    }
  }

  // Mettre en pause/reprendre un match
  async togglePause(matchId: string) {
    try {
      const response = await fetch(`/api/live-matches/${matchId}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const state: LiveMatchState = {
          matchId,
          isLive: data.data.isLive,
          isPaused: data.data.isPaused,
          matchTime: data.data.matchTime,
          homeScore: data.data.homeScore,
          awayScore: data.data.awayScore,
          events: [],
        };
        this.emit(matchId, state);
      }
    } catch (error) {
      console.error('Erreur lors de la pause du match:', error);
    }
  }

  // Terminer un match
  async endMatch(matchId: string) {
    try {
      const response = await fetch(`/api/live-matches/${matchId}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const state: LiveMatchState = {
          matchId,
          isLive: data.data.isLive,
          isPaused: data.data.isPaused,
          matchTime: data.data.matchTime,
          homeScore: data.data.homeScore,
          awayScore: data.data.awayScore,
          events: [],
        };
        this.emit(matchId, state);
      }
    } catch (error) {
      console.error('Erreur lors de la fin du match:', error);
    }
  }

  // Initialiser un match
  initializeMatch(matchId: string, homeScore: number = 0, awayScore: number = 0) {
    const initialState: LiveMatchState = {
      matchId,
      isLive: false,
      isPaused: false,
      matchTime: 0,
      events: [],
      homeScore,
      awayScore
    };
    this.emit(matchId, initialState);
  }
}

// Instance singleton du service
export const liveMatchService = new LiveMatchService();

export default liveMatchService; 