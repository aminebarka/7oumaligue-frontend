// Types pour la logique Round Robin
export interface GroupTeam {
  id: string;
  name: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface GroupMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'completed';
  date: string;
  time: string;
  venue: string;
  round: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  teams: GroupTeam[];
  matches: GroupMatch[];
}

// Calculer le nombre de matchs dans un groupe
export const calculateMatchesInGroup = (teamCount: number): number => {
  return (teamCount * (teamCount - 1)) / 2;
};

// Générer tous les matchs d'un groupe (Round Robin)
export const generateGroupMatches = (
  groupId: string,
  teamIds: string[],
  venue: string = 'Stade Principal',
  startDate: string = new Date().toISOString().split('T')[0]
): GroupMatch[] => {
  const matches: GroupMatch[] = [];
  const teamCount = teamIds.length;
  
  // Pour un nombre impair d'équipes, ajouter un "bye" (équipe fictive)
  const teams = teamCount % 2 === 0 ? [...teamIds] : [...teamIds, 'BYE'];
  const n = teams.length;
  
  // Algorithme Round Robin (méthode du cercle)
  for (let round = 0; round < n - 1; round++) {
    for (let i = 0; i < n / 2; i++) {
      const team1 = teams[i];
      const team2 = teams[n - 1 - i];
      
      // Ignorer les matchs avec "BYE"
      if (team1 !== 'BYE' && team2 !== 'BYE') {
        const matchDate = new Date(startDate);
        matchDate.setDate(matchDate.getDate() + round);
        
        const match: GroupMatch = {
          id: `match-${groupId}-${team1}-${team2}-${round}`,
          homeTeam: team1,
          awayTeam: team2,
          homeScore: 0,
          awayScore: 0,
          status: 'scheduled',
          date: matchDate.toISOString().split('T')[0],
          time: '15:00',
          venue: venue,
          round: 'Groupes',
          groupId: groupId
        };
        
        matches.push(match);
      }
    }
    
    // Rotation des équipes (sauf la première)
    teams.splice(1, 0, teams.pop()!);
  }
  
  return matches;
};

// Calculer les points selon le barème FIFA
export const calculatePoints = (goalsFor: number, goalsAgainst: number): number => {
  if (goalsFor > goalsAgainst) return 3; // Victoire
  if (goalsFor === goalsAgainst) return 1; // Match nul
  return 0; // Défaite
};

// Mettre à jour les statistiques d'une équipe après un match
export const updateTeamStats = (
  team: GroupTeam,
  goalsFor: number,
  goalsAgainst: number
): GroupTeam => {
  const points = calculatePoints(goalsFor, goalsAgainst);
  const isWin = goalsFor > goalsAgainst;
  const isDraw = goalsFor === goalsAgainst;
  const isLoss = goalsFor < goalsAgainst;
  
  return {
    ...team,
    points: team.points + points,
    goalsFor: team.goalsFor + goalsFor,
    goalsAgainst: team.goalsAgainst + goalsAgainst,
    goalDifference: team.goalDifference + (goalsFor - goalsAgainst),
    matchesPlayed: team.matchesPlayed + 1,
    wins: team.wins + (isWin ? 1 : 0),
    draws: team.draws + (isDraw ? 1 : 0),
    losses: team.losses + (isLoss ? 1 : 0)
  };
};

// Classer les équipes selon les critères FIFA
export const sortTeamsByStandings = (teams: GroupTeam[]): GroupTeam[] => {
  return [...teams].sort((a, b) => {
    // 1. Points (décroissant)
    if (a.points !== b.points) {
      return b.points - a.points;
    }
    
    // 2. Différence de buts (décroissant)
    if (a.goalDifference !== b.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    
    // 3. Buts marqués (décroissant)
    if (a.goalsFor !== b.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    
    // 4. Résultat direct (si les équipes se sont rencontrées)
    // Note: Cette logique nécessiterait de vérifier les matchs joués
    
    // 5. Fair-play (moins de cartons rouges, puis jaunes)
    // Note: Nécessiterait des données de cartons
    
    // 6. Tirage au sort (ordre alphabétique par défaut)
    return a.name.localeCompare(b.name);
  });
};

// Calculer le classement d'un groupe
export const calculateGroupStandings = (
  teams: GroupTeam[],
  matches: GroupMatch[]
): GroupTeam[] => {
  // Initialiser les statistiques des équipes
  const teamStats: Record<string, GroupTeam> = {};
  
  teams.forEach(team => {
    teamStats[team.id] = {
      ...team,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0
    };
  });
  
  // Traiter tous les matchs terminés
  matches
    .filter(match => match.status === 'completed')
    .forEach(match => {
      const homeTeam = teamStats[match.homeTeam];
      const awayTeam = teamStats[match.awayTeam];
      
      if (homeTeam && awayTeam) {
        // Mettre à jour l'équipe domicile
        teamStats[match.homeTeam] = updateTeamStats(
          homeTeam,
          match.homeScore,
          match.awayScore
        );
        
        // Mettre à jour l'équipe extérieur
        teamStats[match.awayTeam] = updateTeamStats(
          awayTeam,
          match.awayScore,
          match.homeScore
        );
      }
    });
  
  // Retourner les équipes classées
  return sortTeamsByStandings(Object.values(teamStats));
};

// Vérifier si tous les matchs d'un groupe sont terminés
export const isGroupCompleted = (matches: GroupMatch[]): boolean => {
  return matches.every(match => match.status === 'completed');
};

// Obtenir les équipes qualifiées d'un groupe
export const getQualifiedTeams = (
  standings: GroupTeam[],
  qualificationSpots: number = 2
): GroupTeam[] => {
  return standings.slice(0, qualificationSpots);
};

// Générer un calendrier de matchs pour plusieurs groupes
export const generateTournamentGroups = (
  groups: Array<{ id: string; name: string; teamIds: string[] }>,
  venue: string = 'Stade Principal'
): GroupMatch[] => {
  const allMatches: GroupMatch[] = [];
  
  groups.forEach(group => {
    const groupMatches = generateGroupMatches(group.id, group.teamIds, venue);
    allMatches.push(...groupMatches);
  });
  
  return allMatches;
};

// Exemple d'utilisation pour un groupe de 4 équipes
export const exampleGroup4Teams = () => {
  const teamIds = ['team-A', 'team-B', 'team-C', 'team-D'];
  const matches = generateGroupMatches('group-1', teamIds);
  
  console.log('Matchs générés pour un groupe de 4 équipes:');
  matches.forEach((match, index) => {
    console.log(`Journée ${Math.floor(index / 2) + 1}: ${match.homeTeam} vs ${match.awayTeam}`);
  });
  
  return matches;
}; 