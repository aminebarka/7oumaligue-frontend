import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { Tournament, Team, Player, Match, Group, CreatePlayerForm } from "../types";
import { 
  getTournaments, 
  getTeams, 
  getPlayers, 
  getMatches, 
  createTournament as apiCreateTournament,
  createTeam as apiCreateTeam,
  addPlayer as apiAddPlayer,
  createMatch as apiCreateMatch,
  updateTournament as apiUpdateTournament,
  updateTeam as apiUpdateTeam,
  updatePlayer as apiUpdatePlayer,
  deletePlayer as apiDeletePlayer,
  drawTeams as apiDrawTeams
} from "../services/api";

interface DataContextType {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  createTournament: (tournament: Tournament) => Promise<Tournament>;
  createTeam: (team: Team) => Promise<Team>;
  addPlayer: (player: CreatePlayerForm) => Promise<Player>;
  createMatch: (match: Match) => Promise<Match>;
  updateTournament: (id: string, data: Partial<Tournament>) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (playerId: string) => void;
  addTeam: (team: Team) => void;
  addMatch: (match: Match) => void;
  generateDraw: (tournamentId: string, roundType?: 'groupes' | 'quarters' | 'semis' | 'finale', numberOfGroups?: number) => void;
  generateGroupMatches: (tournamentId: string) => void;
  generateNextRoundMatches: (tournamentId: string, roundType: 'quarters' | 'semis' | 'finale') => void;
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number) => void;
  updateTeam: (team: Team) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mémoriser loadData pour éviter les re-renders infinis
  const loadData = useCallback(async () => {
    if (!token) {
      console.log("❌ Pas de token, impossible de charger les données");
      return;
    }
    
    console.log("🔍 Début du chargement des données pour l'utilisateur:", {
      userId: user?.id,
      email: user?.email,
      role: user?.role,
      hasToken: !!token
    });
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("📡 Envoi des requêtes API...");
      const [tournamentsData, teamsData, playersData, matchesData] = await Promise.all([
        getTournaments(),
        getTeams(),
        getPlayers(),
        getMatches(),
      ]);
      
      console.log("✅ Données reçues:", {
        tournaments: tournamentsData?.length || 0,
        teams: teamsData?.length || 0,
        players: playersData?.length || 0,
        matches: matchesData?.length || 0
      });
      
      setTournaments(tournamentsData || []);
      setTeams(teamsData || []);
      setPlayers(playersData || []);
      setMatches(matchesData || []);
      
    } catch (error: any) {
      console.error("❌ Erreur lors du chargement des données:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      setError(error.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    console.log("🔄 useEffect DataContext:", {
      hasUser: !!user,
      hasToken: !!token,
      userRole: user?.role
    });
    
    if (user && token) {
      console.log("🚀 Chargement des données...");
      loadData();
    } else {
      console.log("🧹 Réinitialisation des données (pas d'utilisateur/token)");
      setTournaments([]);
      setTeams([]);
      setPlayers([]);
      setMatches([]);
    }
  }, [user, token, loadData]);

  const createTournament = async (tournamentData: Tournament): Promise<Tournament> => {
    try {
      const newTournament = await apiCreateTournament(tournamentData);
      setTournaments(prev => [...prev, newTournament]);
      return newTournament;
    } catch (error: any) {
      throw error;
    }
  };

  const createTeam = async (teamData: Team): Promise<Team> => {
    try {
      const newTeam = await apiCreateTeam(teamData);
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (error: any) {
      throw error;
    }
  };

  const addPlayer = async (playerData: CreatePlayerForm): Promise<Player> => {
    try {
      const newPlayer = await apiAddPlayer(playerData);
      setPlayers(prev => [...prev, newPlayer]);
      return newPlayer;
    } catch (error: any) {
      throw error;
    }
  };

  const createMatch = async (matchData: Match): Promise<Match> => {
    try {
      const newMatch = await apiCreateMatch(matchData);
      setMatches(prev => [...prev, newMatch]);
      return newMatch;
    } catch (error: any) {
      throw error;
    }
  };

  const updateTournament = async (id: string, data: Partial<Tournament>) => {
    try {
      const updatedTournament = await apiUpdateTournament(id, data);
      setTournaments(prev => 
        prev.map(t => t.id === id ? { ...t, ...updatedTournament } : t)
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tournoi:", error);
      throw error;
    }
  };

  const updatePlayer = async (player: Player) => {
    try {
      const updatedPlayer = await apiUpdatePlayer(player.id, player);
      setPlayers(prev => prev.map(p => p.id === player.id ? updatedPlayer : p));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du joueur:", error);
      throw error;
    }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      await apiDeletePlayer(playerId);
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    } catch (error) {
      console.error("Erreur lors de la suppression du joueur:", error);
      throw error;
    }
  };

  const addTeam = async (team: Team) => {
    try {
      const newTeam = await apiCreateTeam(team);
      setTeams(prev => [...prev, newTeam]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipe:", error);
      throw error;
    }
  };

  const addMatch = async (match: Match) => {
    try {
      const newMatch = await apiCreateMatch(match);
      setMatches(prev => [...prev, newMatch]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du match:", error);
      throw error;
    }
  };

  const generateDraw = async (tournamentId: string, roundType?: 'groupes' | 'quarters' | 'semis' | 'finale', numberOfGroups?: number) => {
    try {
      console.log(`Tirage au sort pour le round: ${roundType} | groupes: ${numberOfGroups}`);
      
      if (roundType === 'groupes' || !roundType) {
        // Tirage au sort pour les groupes (logique existante)
        const { drawTeams } = await import('../services/api');
        await drawTeams(tournamentId, numberOfGroups);
        console.log("Tirage au sort des groupes terminé");
      } else {
        // Tirage au sort pour les rounds suivants (1/4, 1/2, finale)
        await generateNextRoundMatches(tournamentId, roundType);
        console.log(`Tirage au sort pour ${roundType} terminé`);
      }
      // Recharger les données
      await loadData();
    } catch (error) {
      console.error("Erreur lors du tirage au sort:", error);
      throw error;
    }
  };

  const generateGroupMatches = async (tournamentId: string) => {
    try {
      console.log("Génération des matchs pour le tournoi:", tournamentId);
      
      // Récupérer le tournoi avec ses groupes depuis la base de données
      const { axiosInstance } = await import('../services/api');
      const response = await axiosInstance.get(`/tournaments/${tournamentId}`);
      
      if (!response.data.success) {
        throw new Error('Impossible de récupérer les données du tournoi');
      }
      
      const tournament = response.data.data;
      console.log("Tournoi récupéré:", tournament);
      
      if (!tournament.groups || tournament.groups.length === 0) {
        throw new Error('Aucun groupe trouvé pour ce tournoi');
      }
      
      const newMatches: Match[] = [];
      // Déterminer la date de début du tournoi
      let currentDate = tournament.startDate ? new Date(tournament.startDate) : new Date();
      
      tournament.groups.forEach((group: any) => {
        const teamIds = (group.groupTeams as any[]).map((gt: any) => gt.teamId);
        console.log(`Groupe ${group.name}: équipes`, teamIds);
        
        for (let i = 0; i < teamIds.length; i++) {
          for (let j = i + 1; j < teamIds.length; j++) {
            newMatches.push({
              id: `match-${teamIds[i]}-${teamIds[j]}-${Date.now()}`,
              homeTeam: teamIds[i],
              awayTeam: teamIds[j],
              homeScore: 0,
              awayScore: 0,
              date: currentDate.toISOString().split('T')[0], // date du match
              time: "15:00", // heure par défaut
              status: "scheduled",
              type: "tournament",
              venue: "Stade principal", // lieu par défaut
              tournamentId,
              groupId: group.id,
              round: "Groupes" // Phase de groupes
            });
            // Incrémenter la date d'un jour pour le prochain match
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });
      
      console.log("Matchs à créer:", newMatches);
      
      // Créer tous les matchs dans la base de données
      for (const match of newMatches) {
        await addMatch(match);
      }
      
      // Recharger les données pour voir les nouveaux matchs
      await loadData();
      
      console.log("Matchs générés et sauvegardés dans la base de données");
      
    } catch (error) {
      console.error("Erreur lors de la génération des matchs:", error);
      throw error;
    }
  };

  const generateNextRoundMatches = async (tournamentId: string, roundType: 'quarters' | 'semis' | 'finale') => {
    try {
      // Récupérer les équipes qualifiées selon le round précédent
      const qualifiedTeams = await getQualifiedTeams(tournamentId, roundType);
      
      if (qualifiedTeams.length < 2) {
        throw new Error(`Pas assez d'équipes qualifiées pour ${roundType} (${qualifiedTeams.length} équipes)`);
      }
      
      // Créer les matchs du round suivant
      const newMatches: Match[] = [];
      let currentDate = new Date();
      
      // Logique de tirage selon le round
      if (roundType === 'quarters') {
        // 8 équipes → 4 matchs
        for (let i = 0; i < qualifiedTeams.length; i += 2) {
          if (i + 1 < qualifiedTeams.length) {
            newMatches.push({
              id: `match-${qualifiedTeams[i]}-${qualifiedTeams[i+1]}-${Date.now()}-${i}`,
              homeTeam: qualifiedTeams[i],
              awayTeam: qualifiedTeams[i+1],
              homeScore: 0,
              awayScore: 0,
              date: currentDate.toISOString().split('T')[0],
              time: "15:00",
              status: "scheduled",
              type: "tournament",
              venue: "Stade principal",
              tournamentId,
              round: "1/4"
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      } else if (roundType === 'semis') {
        // 4 équipes → 2 matchs
        for (let i = 0; i < qualifiedTeams.length; i += 2) {
          if (i + 1 < qualifiedTeams.length) {
            newMatches.push({
              id: `match-${qualifiedTeams[i]}-${qualifiedTeams[i+1]}-${Date.now()}-${i}`,
              homeTeam: qualifiedTeams[i],
              awayTeam: qualifiedTeams[i+1],
              homeScore: 0,
              awayScore: 0,
              date: currentDate.toISOString().split('T')[0],
              time: "15:00",
              status: "scheduled",
              type: "tournament",
              venue: "Stade principal",
              tournamentId,
              round: "1/2"
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      } else if (roundType === 'finale') {
        // 2 équipes → 1 match
        if (qualifiedTeams.length >= 2) {
          newMatches.push({
            id: `match-${qualifiedTeams[0]}-${qualifiedTeams[1]}-${Date.now()}`,
            homeTeam: qualifiedTeams[0],
            awayTeam: qualifiedTeams[1],
            homeScore: 0,
            awayScore: 0,
            date: currentDate.toISOString().split('T')[0],
            time: "15:00",
            status: "scheduled",
            type: "tournament",
            venue: "Stade principal",
            tournamentId,
            round: "Finale"
          });
        }
      }
      
      // Créer les matchs dans la base de données
      for (const match of newMatches) {
        await addMatch(match);
      }
      
      console.log(`${newMatches.length} matchs créés pour ${roundType}`);
      
    } catch (error) {
      console.error(`Erreur lors de la génération des matchs ${roundType}:`, error);
      throw error;
    }
  };

  const getQualifiedTeams = async (tournamentId: string, roundType: 'quarters' | 'semis' | 'finale'): Promise<string[]> => {
    // Logique pour déterminer les équipes qualifiées selon le round
    if (roundType === 'quarters') {
      // Prendre les 2 premiers de chaque groupe
      const tournament = tournaments.find(t => t.id === tournamentId);
      if (!tournament?.groups) return [];
      
      const qualifiedTeams: string[] = [];
      tournament.groups.forEach(group => {
        // Trier les équipes du groupe par points, puis par différence de buts
        const sortedTeams = group.groupTeams
          .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
          })
          .slice(0, 2); // Prendre les 2 premiers
        
        qualifiedTeams.push(...sortedTeams.map(gt => gt.teamId));
      });
      
      return qualifiedTeams;
    } else if (roundType === 'semis') {
      // Prendre les gagnants des 1/4 de finale
      const quarterMatches = matches.filter(m => m.tournamentId === tournamentId && m.round === '1/4' && m.status === 'completed');
      return quarterMatches.map(match => 
        match.homeScore > match.awayScore ? match.homeTeam : match.awayTeam
      );
    } else if (roundType === 'finale') {
      // Prendre les gagnants des 1/2 finales
      const semiMatches = matches.filter(m => m.tournamentId === tournamentId && m.round === '1/2' && m.status === 'completed');
      return semiMatches.map(match => 
        match.homeScore > match.awayScore ? match.homeTeam : match.awayTeam
      );
    }
    
    return [];
  };

  const updateMatchScore = async (matchId: string, homeScore: number, awayScore: number) => {
    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) return;
      
      // Utiliser l'API spécifique pour mettre à jour le score
      const { updateMatchScore: apiUpdateMatchScore } = await import('../services/api');
      const result = await apiUpdateMatchScore(matchId, homeScore, awayScore);
      
      setMatches(prev => 
        prev.map(m => m.id === matchId ? result : m)
      );
      
      console.log("Score du match mis à jour dans la base de données");
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du score:", error);
      throw error;
    }
  };

  const updateTeam = async (team: Team) => {
    try {
      const updatedTeam = await apiUpdateTeam(team.id, team);
      setTeams(prev => prev.map(t => t.id === team.id ? updatedTeam : t));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
      throw error;
    }
  };

  const value: DataContextType = {
    tournaments,
    teams,
    players,
    matches,
    isLoading,
    error,
    loadData,
    createTournament,
    createTeam,
    addPlayer,
    createMatch,
    updateTournament,
    updatePlayer,
    deletePlayer,
    addTeam,
    addMatch,
    generateDraw,
    generateGroupMatches,
    generateNextRoundMatches,
    updateMatchScore,
    updateTeam
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};