import { useAuth } from '../contexts/AuthContext'

export const usePermissions = () => {
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'
  const isCoach = user?.role === 'coach'
  const isPlayer = user?.role === 'player'
  
  const canEdit = isAdmin || isCoach
  const canDelete = isAdmin
  const canCreate = isAdmin || isCoach
  const canViewAll = true // Tous les utilisateurs connectés peuvent voir

  return {
    isAdmin,
    isCoach,
    isPlayer,
    canEdit,
    canDelete,
    canCreate,
    canViewAll,
    userRole: user?.role || 'guest'
  }
} 