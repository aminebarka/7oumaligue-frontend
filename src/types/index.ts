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
  role: "admin" | "coach" | "player"
  tenantId: number
  createdAt?: string
  updatedAt?: string
  _count?: {
    socialPosts: number
    teamFans: number
    players: number
    teams: number
  }
}

export interface UserStats {
  total: number
  byRole: {
    players: number
    coaches: number
    admins: number
  }
  recentUsers: User[]
}

export interface UserManagementData {
  users: User[]
  stats: UserStats
  loading: boolean
  error: string | null
}

export interface Permission {
  id: string
  name: string
  description: string
  category: 'user' | 'team' | 'tournament' | 'match' | 'admin'
  granted: boolean
}

export interface RolePermissions {
  player: Permission[]
  coach: Permission[]
  admin: Permission[]
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

// Types pour le système de réservation
export interface Field {
  id: number;
  name: string;
  number: number;
  type: "synthétique" | "gazon naturel" | "couvert" | "extérieur";
  size?: string;
  isActive: boolean;
  stadiumId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stadium {
  id: number;
  name: string;
  address: string;
  city: string;
  region: string;
  neighborhood?: string;
  capacity: number;
  fieldCount: number;
  fieldTypes: string[];
  amenities: string[];
  images: string[];
  contactInfo: any;
  pricing: any;
  description?: string;
  isPartner: boolean;
  isActive: boolean;
  ownerId: number;
  openingHours?: any;
  specialDates?: any;
  createdAt: string;
  updatedAt: string;
  fields: Field[];
}

export interface Reservation {
  id: number;
  fieldId: number;
  userId: number;
  teamId?: string;
  title: string;
  description?: string;
  startTime: string;
  phoneNumber?: string;
  endTime: string;
  purpose: "match" | "entraînement" | "tournoi" | "événement";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  price?: number;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: "stripe" | "paypal" | "cash";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  field: Field;
  user: User;
  team?: Team;
}

export interface ReservationNotification {
  id: number;
  reservationId: number;
  type: "confirmation" | "reminder_24h" | "reminder_2h" | "cancellation" | "change";
  message: string;
  isRead: boolean;
  sentAt: string;
}

export interface UserNotification {
  id: number;
  userId: number;
  type: "reservation" | "payment" | "reminder" | "system";
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface FieldStatistics {
  id: number;
  fieldId: number;
  date: string;
  totalHours: number;
  occupiedHours: number;
  revenue: number;
  reservationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationFilters {
  stadiumId?: number;
  fieldType?: string;
  neighborhood?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  purpose?: string;
}

export interface CalendarView {
  type: "day" | "week" | "month";
  date: string;
}

export interface CreateReservationForm {
  fieldId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  purpose: "match" | "entraînement" | "tournoi" | "événement";
  teamId?: string;
  phoneNumber: string;
}

// Types pour la gestion des académies
export interface Academy {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  address: string;
  city: string;
  region: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: any;
  history?: string;
  values?: string;
  isActive: boolean;
  isVerified: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  owner?: User;
  staff?: User[];
  teams?: AcademyTeam[];
  players?: AcademyPlayer[];
  events?: AcademyEvent[];
  announcements?: AcademyAnnouncement[];
  payments?: AcademyPayment[];
  documents?: AcademyDocument[];
  sponsors?: AcademySponsor[];
}

export interface AcademyTeam {
  id: number;
  name: string;
  category: string;
  logo?: string;
  color?: string;
  academyId: number;
  coachId?: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  academy?: Academy;
  coach?: User;
  players?: AcademyPlayer[];
  matches?: AcademyMatch[];
  awayMatches?: AcademyMatch[];
}

export interface AcademyPlayer {
  id: number;
  firstName: string;
  lastName: string;
  photo?: string;
  birthDate: string;
  position: string;
  jerseyNumber?: number;
  academyId: number;
  teamId?: number;
  parentPhone?: string;
  parentEmail?: string;
  medicalInfo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  academy?: Academy;
  team?: AcademyTeam;
  stats?: AcademyPlayerStats[];
  documents?: AcademyDocument[];
}

export interface AcademyPlayerStats {
  id: number;
  playerId: number;
  season: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  player?: AcademyPlayer;
}

export interface AcademyEvent {
  id: number;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate: string;
  location?: string;
  academyId: number;
  isPublic: boolean;
  maxParticipants?: number;
  registrationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  academy?: Academy;
  participants?: AcademyEventParticipant[];
}

export interface AcademyEventParticipant {
  id: number;
  eventId: number;
  playerId?: number;
  teamId?: number;
  status: string;
  createdAt: string;
  // Relations
  event?: AcademyEvent;
  player?: AcademyPlayer;
  team?: AcademyTeam;
}

export interface AcademyMatch {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore?: number;
  awayScore?: number;
  date: string;
  location?: string;
  type: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  homeTeam?: AcademyTeam;
  awayTeam?: AcademyTeam;
}

export interface AcademyAnnouncement {
  id: number;
  title: string;
  content: string;
  type: string;
  academyId: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  academy?: Academy;
}

export interface AcademyPayment {
  id: number;
  playerId?: number;
  teamId?: number;
  academyId: number;
  type: string;
  amount: number;
  description?: string;
  dueDate?: string;
  paidDate?: string;
  status: string;
  method?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  player?: AcademyPlayer;
  team?: AcademyTeam;
  academy?: Academy;
}

export interface AcademyDocument {
  id: number;
  name: string;
  type: string;
  fileUrl: string;
  playerId?: number;
  academyId: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  player?: AcademyPlayer;
  academy?: Academy;
}

export interface AcademySponsor {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  academyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  academy?: Academy;
}

// Formulaires pour les académies
export interface CreateAcademyForm {
  name: string;
  description?: string;
  address: string;
  city: string;
  region: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: any;
  history?: string;
  values?: string;
}

export interface CreateAcademyTeamForm {
  name: string;
  category: string;
  color?: string;
  coachId?: number;
}

export interface CreateAcademyPlayerForm {
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
  jerseyNumber?: number;
  parentPhone?: string;
  parentEmail?: string;
  medicalInfo?: string;
  teamId?: number;
}

export interface CreateAcademyEventForm {
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate: string;
  location?: string;
  isPublic: boolean;
  maxParticipants?: number;
  registrationDeadline?: string;
}
