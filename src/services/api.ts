import axios from "axios"
import { 
  Academy,
  AcademyTeam,
  AcademyPlayer,
  AcademyEvent,
  AcademyAnnouncement,
  AcademyPayment,
  CreateAcademyForm,
  CreateAcademyTeamForm,
  CreateAcademyPlayerForm,
  CreateAcademyEventForm
} from '../types';

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

// User Management API (Admin only)
export const getAllUsers = async () => {
  try {
    console.log("📡 GET /auth/users - Récupération de tous les utilisateurs...");
    console.log("🔐 Token dans getAllUsers:", localStorage.getItem("token") ? "Présent" : "Absent");
    console.log("🌐 URL de base:", axiosInstance.defaults.baseURL);
    
    const response = await axiosInstance.get("/auth/users")
    console.log("✅ GET /auth/users - Réponse reçue:", {
      status: response.status,
      userCount: response.data?.data?.length || 0,
      data: response.data
    });
    return response.data?.data || response.data || []
  } catch (error: any) {
    console.error("❌ Erreur détaillée lors de la récupération des utilisateurs:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    throw error
  }
}

export const getUserStats = async () => {
  try {
    console.log("📡 GET /auth/users/stats - Récupération des statistiques utilisateurs...");
    const response = await axiosInstance.get("/auth/users/stats")
    console.log("✅ GET /auth/users/stats - Réponse reçue:", {
      status: response.status,
      stats: response.data?.data
    });
    return response.data?.data || response.data
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques:", error)
    throw error
  }
}

export const updateUserRole = async (userId: number, role: string) => {
  try {
    console.log(`📡 PUT /auth/users/${userId}/role - Mise à jour du rôle:`, role);
    const response = await axiosInstance.put(`/auth/users/${userId}/role`, { role })
    console.log("✅ PUT /auth/users/:userId/role - Réponse reçue:", {
      status: response.status,
      updatedUser: response.data?.data
    });
    return response.data?.data || response.data
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du rôle:", error)
    throw error
  }
}

export const deleteUser = async (userId: number) => {
  try {
    console.log(`📡 DELETE /auth/users/${userId} - Suppression de l'utilisateur`);
    const response = await axiosInstance.delete(`/auth/users/${userId}`)
    console.log("✅ DELETE /auth/users/:userId - Réponse reçue:", {
      status: response.status
    });
    return response.data
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur:", error)
    throw error
  }
}

// Reservation API
export const getReservations = async (filters?: any) => {
  try {
    console.log("📡 GET /reservations - Récupération des réservations...");
    const response = await axiosInstance.get("/reservations", { params: filters });
    console.log("✅ GET /reservations - Réponse reçue:", {
      status: response.status,
      reservationCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des réservations:", error);
    throw error;
  }
};

export const getCalendarReservations = async (view: string, date: string, stadiumId?: number) => {
  try {
    console.log("📡 GET /reservations/calendar - Récupération du calendrier...");
    const response = await axiosInstance.get("/reservations/calendar", {
      params: { view, date, stadiumId }
    });
    console.log("✅ GET /reservations/calendar - Réponse reçue:", {
      status: response.status,
      reservationCount: response.data?.data?.reservations?.length || 0
    });
    return response.data?.data || response.data || {};
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du calendrier:", error);
    throw error;
  }
};

export const createReservation = async (reservationData: any) => {
  try {
    console.log("📡 POST /reservations - Création d'une réservation...");
    const response = await axiosInstance.post("/reservations", reservationData);
    console.log("✅ POST /reservations - Réservation créée:", {
      status: response.status,
      reservationId: response.data?.data?.id
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la création de la réservation:", error);
    throw error;
  }
};

export const updateReservation = async (id: number, reservationData: any) => {
  try {
    console.log(`📡 PATCH /reservations/${id} - Mise à jour de la réservation...`);
    const response = await axiosInstance.patch(`/reservations/${id}`, reservationData);
    console.log("✅ PATCH /reservations - Réservation mise à jour:", {
      status: response.status,
      reservationId: response.data?.data?.id
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la réservation:", error);
    throw error;
  }
};

export const deleteReservation = async (id: number) => {
  try {
    console.log(`📡 DELETE /reservations/${id} - Suppression de la réservation...`);
    const response = await axiosInstance.delete(`/reservations/${id}`);
    console.log("✅ DELETE /reservations - Réservation supprimée:", {
      status: response.status
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la réservation:", error);
    throw error;
  }
};

export const getReservationStatistics = async (filters?: any) => {
  try {
    console.log("📡 GET /reservations/statistics - Récupération des statistiques...");
    const response = await axiosInstance.get("/reservations/statistics", { params: filters });
    console.log("✅ GET /reservations/statistics - Statistiques récupérées:", {
      status: response.status
    });
    return response.data?.data || response.data || {};
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques:", error);
    throw error;
  }
};

// Stadium API
export const getStadiums = async (filters?: any) => {
  try {
    console.log("📡 GET /stadiums - Récupération des stades...");
    const response = await axiosInstance.get("/stadiums", { params: filters });
    console.log("✅ GET /stadiums - Stades récupérés:", {
      status: response.status,
      stadiumCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stades:", error);
    throw error;
  }
};

export const getStadium = async (id: number) => {
  try {
    console.log(`📡 GET /stadiums/${id} - Récupération du stade...`);
    const response = await axiosInstance.get(`/stadiums/${id}`);
    console.log("✅ GET /stadiums - Stade récupéré:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du stade:", error);
    throw error;
  }
};

export const getStadiumAvailability = async (id: number, date: string, fieldId?: number) => {
  try {
    console.log(`📡 GET /stadiums/${id}/availability - Récupération de la disponibilité...`);
    const response = await axiosInstance.get(`/stadiums/${id}/availability`, {
      params: { date, fieldId }
    });
    console.log("✅ GET /stadiums/availability - Disponibilité récupérée:", {
      status: response.status
    });
    return response.data?.data || response.data || {};
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la disponibilité:", error);
    throw error;
  }
};

export const getFields = async (filters?: any) => {
  try {
    console.log("📡 GET /stadiums/fields - Récupération des terrains...");
    const response = await axiosInstance.get("/stadiums/fields", { params: filters });
    console.log("✅ GET /stadiums/fields - Terrains récupérés:", {
      status: response.status,
      fieldCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des terrains:", error);
    throw error;
  }
};

export const getField = async (id: number) => {
  try {
    console.log(`📡 GET /stadiums/fields/${id} - Récupération du terrain...`);
    const response = await axiosInstance.get(`/stadiums/fields/${id}`);
    console.log("✅ GET /stadiums/fields - Terrain récupéré:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du terrain:", error);
    throw error;
  }
};

// ===== SERVICES POUR LES ACADÉMIES =====

export const getAcademies = async (): Promise<Academy[]> => {
  try {
    console.log("📡 GET /academies - Récupération des académies...");
    const response = await axiosInstance.get('/academies');
    console.log("✅ GET /academies - Académies récupérées:", {
      status: response.status,
      academyCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des académies:', error);
    throw error;
  }
};

export const getAcademy = async (id: number): Promise<Academy> => {
  try {
    console.log(`📡 GET /academies/${id} - Récupération de l'académie...`);
    const response = await axiosInstance.get(`/academies/${id}`);
    console.log("✅ GET /academies - Académie récupérée:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'académie:', error);
    throw error;
  }
};

export const createAcademy = async (academyData: CreateAcademyForm): Promise<Academy> => {
  try {
    console.log("📡 POST /academies - Création de l'académie...");
    const response = await axiosInstance.post('/academies', academyData);
    console.log("✅ POST /academies - Académie créée:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'académie:', error);
    throw error;
  }
};

export const updateAcademy = async (id: number, academyData: Partial<CreateAcademyForm>): Promise<Academy> => {
  try {
    console.log(`📡 PUT /academies/${id} - Mise à jour de l'académie...`);
    const response = await axiosInstance.put(`/academies/${id}`, academyData);
    console.log("✅ PUT /academies - Académie mise à jour:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'académie:', error);
    throw error;
  }
};

export const deleteAcademy = async (id: number): Promise<void> => {
  try {
    console.log(`📡 DELETE /academies/${id} - Suppression de l'académie...`);
    await axiosInstance.delete(`/academies/${id}`);
    console.log("✅ DELETE /academies - Académie supprimée");
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'académie:', error);
    throw error;
  }
};

// ===== SERVICES POUR LES ÉQUIPES D'ACADÉMIE =====

export const getAcademyTeams = async (academyId: number): Promise<AcademyTeam[]> => {
  try {
    console.log(`📡 GET /academies/${academyId}/teams - Récupération des équipes...`);
    const response = await axiosInstance.get(`/academies/${academyId}/teams`);
    console.log("✅ GET /academies/teams - Équipes récupérées:", {
      status: response.status,
      teamCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des équipes:', error);
    throw error;
  }
};

export const createAcademyTeam = async (academyId: number, teamData: CreateAcademyTeamForm): Promise<AcademyTeam> => {
  try {
    console.log(`📡 POST /academies/${academyId}/teams - Création de l'équipe...`);
    const response = await axiosInstance.post(`/academies/${academyId}/teams`, teamData);
    console.log("✅ POST /academies/teams - Équipe créée:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'équipe:', error);
    throw error;
  }
};

// ===== SERVICES POUR LES JOUEURS D'ACADÉMIE =====

export const getAcademyPlayers = async (academyId: number): Promise<AcademyPlayer[]> => {
  try {
    console.log(`📡 GET /academies/${academyId}/players - Récupération des joueurs...`);
    const response = await axiosInstance.get(`/academies/${academyId}/players`);
    console.log("✅ GET /academies/players - Joueurs récupérés:", {
      status: response.status,
      playerCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des joueurs:', error);
    throw error;
  }
};

export const createAcademyPlayer = async (academyId: number, playerData: CreateAcademyPlayerForm): Promise<AcademyPlayer> => {
  try {
    console.log(`📡 POST /academies/${academyId}/players - Création du joueur...`);
    const response = await axiosInstance.post(`/academies/${academyId}/players`, playerData);
    console.log("✅ POST /academies/players - Joueur créé:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création du joueur:', error);
    throw error;
  }
};

// ===== SERVICES POUR LES ÉVÉNEMENTS D'ACADÉMIE =====

export const getAcademyEvents = async (academyId: number): Promise<AcademyEvent[]> => {
  try {
    console.log(`📡 GET /academies/${academyId}/events - Récupération des événements...`);
    const response = await axiosInstance.get(`/academies/${academyId}/events`);
    console.log("✅ GET /academies/events - Événements récupérés:", {
      status: response.status,
      eventCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements:', error);
    throw error;
  }
};

export const createAcademyEvent = async (academyId: number, eventData: CreateAcademyEventForm): Promise<AcademyEvent> => {
  try {
    console.log(`📡 POST /academies/${academyId}/events - Création de l'événement...`);
    const response = await axiosInstance.post(`/academies/${academyId}/events`, eventData);
    console.log("✅ POST /academies/events - Événement créé:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'événement:', error);
    throw error;
  }
};

// ===== SERVICES POUR LES ANNONCES D'ACADÉMIE =====

export const getAcademyAnnouncements = async (academyId: number): Promise<AcademyAnnouncement[]> => {
  try {
    console.log(`📡 GET /academies/${academyId}/announcements - Récupération des annonces...`);
    const response = await axiosInstance.get(`/academies/${academyId}/announcements`);
    console.log("✅ GET /academies/announcements - Annonces récupérées:", {
      status: response.status,
      announcementCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des annonces:', error);
    throw error;
  }
};

export const createAcademyAnnouncement = async (academyId: number, announcementData: {
  title: string;
  content: string;
  type: string;
  isPublic?: boolean;
}): Promise<AcademyAnnouncement> => {
  try {
    console.log(`📡 POST /academies/${academyId}/announcements - Création de l'annonce...`);
    const response = await axiosInstance.post(`/academies/${academyId}/announcements`, announcementData);
    console.log("✅ POST /academies/announcements - Annonce créée:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'annonce:', error);
    throw error;
  }
};

// ===== SERVICES POUR LES PAIEMENTS D'ACADÉMIE =====

export const getAcademyPayments = async (academyId: number): Promise<AcademyPayment[]> => {
  try {
    console.log(`📡 GET /academies/${academyId}/payments - Récupération des paiements...`);
    const response = await axiosInstance.get(`/academies/${academyId}/payments`);
    console.log("✅ GET /academies/payments - Paiements récupérés:", {
      status: response.status,
      paymentCount: response.data?.data?.length || 0
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des paiements:', error);
    throw error;
  }
};

export const createAcademyPayment = async (academyId: number, paymentData: {
  playerId?: number;
  teamId?: number;
  type: string;
  amount: number;
  description?: string;
  dueDate?: string;
  method?: string;
}): Promise<AcademyPayment> => {
  try {
    console.log(`📡 POST /academies/${academyId}/payments - Création du paiement...`);
    const response = await axiosInstance.post(`/academies/${academyId}/payments`, paymentData);
    console.log("✅ POST /academies/payments - Paiement créé:", {
      status: response.status
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création du paiement:', error);
    throw error;
  }
};

export default axiosInstance
