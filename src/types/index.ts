// Types alignés avec le schéma Prisma 
export interface Player { 
  id: string
  name: string
  position: "Gardien" | "Défenseur" | "Milieu" | "Attaquant"
  level: number // 1-5
  age: number
  teamId?: string
  jerseyNumber?: number
  userId?: number
  tenantId?: number
  createdAt?: string
  updatedAt?: string
  // Relations
  team?: {
    id: string
    name: string
    logo?: string
  }
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  players: string[];
  coach: string;
  coachName?: string;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  goalsAgainst: number;
  matches: number;
  createdAt: string;
  averageLevel: number;
  playerLevels: { [key: string]: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'professional' };
}

export interface Group {
  id: string;
  name: string;
  tournamentId: string;
  groupTeams: GroupTeam[];
  matches: string[];
  freePlayers: Player[];
}

export interface GroupTeam {
  id: string;
  groupId: string;
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface TournamentTeam {
  id: string
  tournamentId: string
  teamId: string
  groupId?: string
  // Relations
  team?: Team
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  status: "scheduled" | "live" | "completed";
  type: "friendly" | "tournament" | "training";
  venue: string;
  tournamentId?: string;
  groupId?: string;
  round?: string; // "Groupes", "1/4", "1/2", "Finale", etc.
}

export interface Tournament {
  id: string;
  name: string;
  logo: string;
  startDate: string;
  endDate: string;
  prize: string;
  rules: string;
  stadium?: string; // Nom du stade
  status: "upcoming" | "active" | "completed";
  teams?: Team[];
  tournamentTeams: TournamentTeam[];
  matches: string[]; // IDs des matchs
  drawCompleted: boolean;
  numberOfGroups: number;
  teamsPerGroup: number;
  groups: Group[];
  freePlayers: Player[];
}

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user" | "coach"
  tenantId: number
  createdAt?: string
  updatedAt?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Form types
export interface CreateTournamentForm {
  name: string
  startDate: string
  endDate: string
  prize?: string
  rules?: string
  numberOfGroups: number
}

export interface CreateTeamForm {
  name: string
  logo?: string
  coachName?: string
}

export interface CreatePlayerForm {
  name: string
  position: "Gardien" | "Défenseur" | "Milieu" | "Attaquant"
  level: number
  age: number
  teamId?: string
  jerseyNumber?: number
}

export interface CreateMatchForm {
  date: string
  time: string
  venue: string
  homeTeam: string
  awayTeam: string
  tournamentId: string
  groupId?: string
}

// Auth types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
  tenantId: number
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: AuthUser
    token: string
  }
  message?: string
  error?: string
}

// Tournament AI Types
export interface TournamentSuggestion {
  format: 'groups' | 'knockout' | 'league' | 'mixed'
  numberOfGroups: number
  teamsPerGroup: number
  totalMatches: number
  estimatedDuration: string
  description: string
  advantages: string[]
  disadvantages: string[]
  recommended: boolean
}

export interface TournamentConstraints {
  numberOfTeams: number
  maxDuration: string // "2h", "1d", "1w"
  availableFields: number
  maxMatchesPerDay: number
  includeThirdPlace: boolean
}
