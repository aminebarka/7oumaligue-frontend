import axios from "axios"

// Configuration de base d'axios
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-7oumaligue-hrd4bqesgcefg5h4.francecentral-01.azurewebsites.net/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Fonction pour définir le token d'authentification
export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"]
  }
}

// Intercepteur de requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("🔐 Token ajouté à la requête:", {
        url: config.url,
        method: config.method,
        hasToken: !!token
      });
    } else {
      console.log("⚠️ Pas de token trouvé pour la requête:", {
        url: config.url,
        method: config.method
      });
    }
    return config
  },
  (error) => {
    console.error("❌ Erreur dans l'intercepteur de requête:", error);
    return Promise.reject(error)
  },
)

// Intercepteur de réponse
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("token")
      setAuthToken("")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    throw error
  }
}

export const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
  try {
    console.log("📡 POST /auth/register - Envoi de la requête avec le rôle:", userData.role);
    const response = await axiosInstance.post("/auth/register", userData)
    console.log("✅ POST /auth/register - Réponse reçue:", {
      status: response.status,
      userRole: response.data?.data?.user?.role || response.data?.user?.role
    });
    return response.data
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error)
    throw error
  }
}

// Tournament API
export const getTournaments = async () => {
  try {
    console.log("📡 GET /tournaments - Envoi de la requête...");
    const response = await axiosInstance.get("/tournaments")
    console.log("✅ GET /tournaments - Réponse reçue:", {
      status: response.status,
      dataLength: response.data?.data?.length || response.data?.length || 0
    });
    return response.data?.data || response.data || []
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des tournois:", error)
    throw error
  }
}

export const getTournamentById = async (id: string) => {
  try {
    console.log(`📡 GET /tournaments/${id} - Envoi de la requête...`);
    const response = await axiosInstance.get(`/tournaments/${id}`)
    console.log(`✅ GET /tournaments/${id} - Réponse reçue:`, {
      status: response.status,
      hasData: !!response.data
    });
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la récupération du tournoi:", error)
    throw error
  }
}

export const createTournament = async (tournament: any) => {
  try {
    console.log("📤 Tentative de création de tournoi:", {
      name: tournament.name,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      stadium: tournament.stadium,
      hasToken: !!localStorage.getItem("token")
    });

    const response = await axiosInstance.post("/tournaments", tournament)
    
    console.log("✅ Tournoi créé avec succès:", {
      id: response.data?.data?.id,
      name: response.data?.data?.name
    });
    
    return response.data?.data || response.data
  } catch (error: any) {
    console.error("❌ Erreur lors de la création du tournoi:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      hasToken: !!localStorage.getItem("token")
    });
    throw error
  }
}

export const updateTournament = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/tournaments/${id}`, data)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du tournoi:", error)
    throw error
  }
}

export const deleteTournament = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/tournaments/${id}`)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la suppression du tournoi:", error)
    throw error
  }
}

export const drawTeams = async (tournamentId: string, numberOfGroups?: number) => {
  try {
    const response = await axiosInstance.post(
      `/tournaments/${tournamentId}/draw`,
      numberOfGroups ? { numberOfGroups } : {}
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Erreur lors du tirage au sort:", error);
    throw error;
  }
}

// Team API
export const getTeams = async () => {
  try {
    console.log("📡 GET /teams - Envoi de la requête...");
    const response = await axiosInstance.get("/teams")
    console.log("✅ GET /teams - Réponse reçue:", {
      status: response.status,
      dataLength: response.data?.data?.length || response.data?.length || 0
    });
    return response.data?.data || response.data || []
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error)
    throw error
  }
}

export const getTeamById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/teams/${id}`)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error)
    throw error
  }
}

export const createTeam = async (team: any) => {
  try {
    const response = await axiosInstance.post("/teams", team)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error)
    throw error
  }
}

export const updateTeam = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/teams/${id}`, data)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'équipe:", error)
    throw error
  }
}

export const deleteTeam = async (id: string, force: boolean = false) => {
  try {
    console.log("🗑️  Tentative de suppression d'équipe:", {
      teamId: id,
      force: force,
      token: localStorage.getItem("token") ? "Présent" : "Absent",
      headers: axiosInstance.defaults.headers.common
    });

    const url = force ? `/teams/${id}?force=true` : `/teams/${id}`;
    const response = await axiosInstance.delete(url)
    
    console.log("✅ Équipe supprimée avec succès:", response.data);
    return response.data?.data || response.data
  } catch (error: any) {
    console.error("❌ Erreur lors de la suppression de l'équipe:", {
      error: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      teamId: id,
      force: force,
      token: localStorage.getItem("token") ? "Présent" : "Absent"
    });
    throw error
  }
}

// Player API
export const getPlayers = async (teamId?: string) => {
  try {
    const url = teamId ? `/players/team/${teamId}` : "/players";
    console.log(`📡 GET ${url} - Envoi de la requête...`);
    const response = await axiosInstance.get(url)
    console.log(`✅ GET ${url} - Réponse reçue:`, {
      status: response.status,
      dataLength: response.data?.data?.length || response.data?.length || 0
    });
    return response.data?.data || response.data || []
  } catch (error) {
    console.error("Erreur lors de la récupération des joueurs:", error)
    throw error
  }
}

export const getPlayerById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/players/${id}`)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la récupération du joueur:", error)
    throw error
  }
}

export const addPlayer = async (player: any) => {
  try {
    const response = await axiosInstance.post("/players", player)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de l'ajout du joueur:", error)
    throw error
  }
}

export const updatePlayer = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/players/${id}`, data)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du joueur:", error)
    throw error
  }
}

export const deletePlayer = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/players/${id}`)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la suppression du joueur:", error)
    throw error
  }
}

// Match API
export const getMatches = async () => {
  try {
    console.log("📡 GET /matches - Envoi de la requête...");
    const response = await axiosInstance.get("/matches")
    console.log("✅ GET /matches - Réponse reçue:", {
      status: response.status,
      dataLength: response.data?.data?.length || response.data?.length || 0
    });
    return response.data?.data || response.data || []
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs:", error)
    throw error
  }
}

export const getMatchById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/matches/${id}`)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la récupération du match:", error)
    throw error
  }
}

export const createMatch = async (match: any) => {
  try {
    const response = await axiosInstance.post("/matches", match)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la création du match:", error)
    throw error
  }
}

export const updateMatch = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/matches/${id}`, data)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du match:", error)
    throw error
  }
}

export const updateMatchScore = async (id: string, homeScore: number, awayScore: number) => {
  try {
    const response = await axiosInstance.put(`/matches/${id}/score`, {
      homeScore,
      awayScore,
    })
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du score:", error)
    throw error
  }
}

// Group Management API
export const createGroup = async (groupData: { name: string; tournamentId: string }) => {
  try {
    const response = await axiosInstance.post("/tournaments/groups/create", groupData)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error)
    throw error
  }
}

export const updateGroup = async (groupId: string, data: { name: string }) => {
  try {
    const response = await axiosInstance.post("/tournaments/groups/update", { groupId, name: data.name })
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la modification du groupe:", error)
    throw error
  }
}

export const deleteGroup = async (groupId: string) => {
  try {
    const response = await axiosInstance.post("/tournaments/groups/delete", { groupId })
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la suppression du groupe:", error)
    throw error
  }
}

export const addTeamToGroup = async (groupId: string, teamId: string) => {
  try {
    const response = await axiosInstance.post(`/tournaments/groups/add-team`, { groupId, teamId })
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'équipe au groupe:", error)
    throw error
  }
}

export const removeTeamFromGroup = async (groupId: string, teamId: string) => {
  try {
    const response = await axiosInstance.post(`/tournaments/groups/remove-team`, { groupId, teamId })
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors du retrait de l'équipe du groupe:", error)
    throw error
  }
}

export const generateMatches = async (tournamentId: string, matchTime: string) => {
  try {
    const response = await axiosInstance.post(`/tournaments/${tournamentId}/generate-matches`, {
      matchTime
    })
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la génération des matchs:", error)
    throw error
  }
}

export const updateFinalPhaseMatches = async (tournamentId: string) => {
  try {
    const response = await axiosInstance.post(`/tournaments/${tournamentId}/update-final-phase`)
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour des équipes qualifiées:", error)
    throw error
  }
}

export const generateFinalPhaseMatches = async (tournamentId: string, matchTime?: string) => {
  try {
    const response = await axiosInstance.post(`/tournaments/${tournamentId}/generate-final-matches`, { matchTime })
    return response.data?.data || response.data
  } catch (error) {
    console.error("Erreur lors de la génération des matchs de la phase finale:", error)
    throw error
  }
}

export default axiosInstance
