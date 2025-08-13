import { useAuth } from '../contexts/AuthContext'

export const usePermissions = () => {
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'
  const isCoach = user?.role === 'coach'
  const isPlayer = user?.role === 'player'
  
  // Permissions de base
  const canEdit = isAdmin || isCoach
  const canDelete = isAdmin
  const canCreate = isAdmin || isCoach
  const canViewAll = true // Tous les utilisateurs connectés peuvent voir

  // Permissions utilisateur
  const canViewProfile = true
  const canEditProfile = true
  const canViewAllUsers = isAdmin
  const canEditUsers = isAdmin
  const canDeleteUsers = isAdmin
  const canManageRoles = isAdmin

  // Permissions équipe
  const canViewTeams = true
  const canCreateTeam = isAdmin || isCoach
  const canEditTeam = isAdmin || isCoach
  const canDeleteTeam = isAdmin
  const canManageTeamPlayers = isAdmin || isCoach

  // Permissions tournoi
  const canViewTournaments = true
  const canCreateTournament = isAdmin || isCoach
  const canEditTournament = isAdmin || isCoach
  const canDeleteTournament = isAdmin
  const canManageTournamentDraw = isAdmin || isCoach
  const canGenerateMatches = isAdmin || isCoach

  // Permissions match
  const canViewMatches = true
  const canCreateMatch = isAdmin || isCoach
  const canEditMatch = isAdmin || isCoach
  const canDeleteMatch = isAdmin
  const canUpdateMatchScore = isAdmin || isCoach
  const canManageLiveMatch = isAdmin || isCoach

  // Permissions joueur
  const canViewPlayers = true
  const canCreatePlayer = isAdmin || isCoach
  const canEditPlayer = isAdmin || isCoach
  const canDeletePlayer = isAdmin
  const canAssignPlayerToTeam = isAdmin || isCoach

  // Permissions stade
  const canViewStadiums = true
  const canCreateStadium = isAdmin
  const canEditStadium = isAdmin
  const canDeleteStadium = isAdmin

  // Permissions statistiques
  const canViewStats = true
  const canViewAdvancedStats = isAdmin || isCoach
  const canExportData = isAdmin

  // Permissions paiement
  const canViewPayments = isAdmin
  const canProcessPayments = isAdmin
  const canRefundPayments = isAdmin

  // Permissions communauté
  const canViewSocialWall = true
  const canCreateSocialPost = true
  const canModerateSocialPosts = isAdmin || isCoach
  const canDeleteSocialPosts = isAdmin

  // Permissions système
  const canAccessAdminPanel = isAdmin
  const canViewSystemLogs = isAdmin
  const canManageSystemSettings = isAdmin
  const canBackupData = isAdmin
  const canRestoreData = isAdmin

  // Permissions spéciales
  const canInviteUsers = isAdmin
  const canBulkActions = isAdmin
  const canViewAuditLogs = isAdmin
  const canManageNotifications = isAdmin || isCoach

  // Vérification de permissions spécifiques
  const hasPermission = (permission: string): boolean => {
    const permissions: { [key: string]: boolean } = {
      // Permissions utilisateur
      'user.view_profile': canViewProfile,
      'user.edit_profile': canEditProfile,
      'user.view_all': canViewAllUsers,
      'user.edit': canEditUsers,
      'user.delete': canDeleteUsers,
      'user.manage_roles': canManageRoles,
      'user.invite': canInviteUsers,

      // Permissions équipe
      'team.view': canViewTeams,
      'team.create': canCreateTeam,
      'team.edit': canEditTeam,
      'team.delete': canDeleteTeam,
      'team.manage_players': canManageTeamPlayers,

      // Permissions tournoi
      'tournament.view': canViewTournaments,
      'tournament.create': canCreateTournament,
      'tournament.edit': canEditTournament,
      'tournament.delete': canDeleteTournament,
      'tournament.manage_draw': canManageTournamentDraw,
      'tournament.generate_matches': canGenerateMatches,

      // Permissions match
      'match.view': canViewMatches,
      'match.create': canCreateMatch,
      'match.edit': canEditMatch,
      'match.delete': canDeleteMatch,
      'match.update_score': canUpdateMatchScore,
      'match.manage_live': canManageLiveMatch,

      // Permissions joueur
      'player.view': canViewPlayers,
      'player.create': canCreatePlayer,
      'player.edit': canEditPlayer,
      'player.delete': canDeletePlayer,
      'player.assign_team': canAssignPlayerToTeam,

      // Permissions stade
      'stadium.view': canViewStadiums,
      'stadium.create': canCreateStadium,
      'stadium.edit': canEditStadium,
      'stadium.delete': canDeleteStadium,

      // Permissions statistiques
      'stats.view': canViewStats,
      'stats.view_advanced': canViewAdvancedStats,
      'stats.export': canExportData,

      // Permissions paiement
      'payment.view': canViewPayments,
      'payment.process': canProcessPayments,
      'payment.refund': canRefundPayments,

      // Permissions communauté
      'social.view': canViewSocialWall,
      'social.create': canCreateSocialPost,
      'social.moderate': canModerateSocialPosts,
      'social.delete': canDeleteSocialPosts,

      // Permissions système
      'system.admin_panel': canAccessAdminPanel,
      'system.view_logs': canViewSystemLogs,
      'system.manage_settings': canManageSystemSettings,
      'system.backup': canBackupData,
      'system.restore': canRestoreData,
      'system.audit_logs': canViewAuditLogs,
      'system.notifications': canManageNotifications,

      // Permissions générales
      'edit': canEdit,
      'delete': canDelete,
      'create': canCreate,
      'view_all': canViewAll,
      'bulk_actions': canBulkActions,
    };

    return permissions[permission] || false;
  };

  // Vérification de permissions multiples
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    // Rôles
    isAdmin,
    isCoach,
    isPlayer,
    userRole: user?.role || 'guest',

    // Permissions de base
    canEdit,
    canDelete,
    canCreate,
    canViewAll,

    // Permissions utilisateur
    canViewProfile,
    canEditProfile,
    canViewAllUsers,
    canEditUsers,
    canDeleteUsers,
    canManageRoles,

    // Permissions équipe
    canViewTeams,
    canCreateTeam,
    canEditTeam,
    canDeleteTeam,
    canManageTeamPlayers,

    // Permissions tournoi
    canViewTournaments,
    canCreateTournament,
    canEditTournament,
    canDeleteTournament,
    canManageTournamentDraw,
    canGenerateMatches,

    // Permissions match
    canViewMatches,
    canCreateMatch,
    canEditMatch,
    canDeleteMatch,
    canUpdateMatchScore,
    canManageLiveMatch,

    // Permissions joueur
    canViewPlayers,
    canCreatePlayer,
    canEditPlayer,
    canDeletePlayer,
    canAssignPlayerToTeam,

    // Permissions stade
    canViewStadiums,
    canCreateStadium,
    canEditStadium,
    canDeleteStadium,

    // Permissions statistiques
    canViewStats,
    canViewAdvancedStats,
    canExportData,

    // Permissions paiement
    canViewPayments,
    canProcessPayments,
    canRefundPayments,

    // Permissions communauté
    canViewSocialWall,
    canCreateSocialPost,
    canModerateSocialPosts,
    canDeleteSocialPosts,

    // Permissions système
    canAccessAdminPanel,
    canViewSystemLogs,
    canManageSystemSettings,
    canBackupData,
    canRestoreData,
    canViewAuditLogs,
    canManageNotifications,

    // Permissions spéciales
    canInviteUsers,
    canBulkActions,

    // Méthodes de vérification
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
} 