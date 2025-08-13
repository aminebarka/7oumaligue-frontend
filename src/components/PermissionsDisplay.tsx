import React, { useState } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { 
  Shield, 
  Users, 
  UserCheck, 
  Trophy, 
  Calendar, 
  Target, 
  MapPin, 
  BarChart3, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface PermissionsDisplayProps {
  userId?: number;
  userRole?: string;
  showDetails?: boolean;
  onPermissionChange?: (permission: string, granted: boolean) => void;
}

const PermissionsDisplay: React.FC<PermissionsDisplayProps> = ({
  userId,
  userRole,
  showDetails = false,
  onPermissionChange
}) => {
  const { hasPermission, userRole: currentUserRole } = usePermissions();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const permissionCategories = [
    {
      id: 'user',
      name: 'Utilisateur',
      icon: Users,
      permissions: [
        { id: 'user.view_profile', name: 'Voir profil', description: 'Peut voir son propre profil' },
        { id: 'user.edit_profile', name: 'Modifier profil', description: 'Peut modifier son propre profil' },
        { id: 'user.view_all', name: 'Voir tous les utilisateurs', description: 'Peut voir tous les utilisateurs' },
        { id: 'user.edit', name: 'Modifier utilisateurs', description: 'Peut modifier les utilisateurs' },
        { id: 'user.delete', name: 'Supprimer utilisateurs', description: 'Peut supprimer des utilisateurs' },
        { id: 'user.manage_roles', name: 'Gérer rôles', description: 'Peut changer les rôles des utilisateurs' },
        { id: 'user.invite', name: 'Inviter utilisateurs', description: 'Peut inviter de nouveaux utilisateurs' },
      ]
    },
    {
      id: 'team',
      name: 'Équipe',
      icon: Trophy,
      permissions: [
        { id: 'team.view', name: 'Voir équipes', description: 'Peut voir les équipes' },
        { id: 'team.create', name: 'Créer équipe', description: 'Peut créer une équipe' },
        { id: 'team.edit', name: 'Modifier équipe', description: 'Peut modifier les équipes' },
        { id: 'team.delete', name: 'Supprimer équipe', description: 'Peut supprimer des équipes' },
        { id: 'team.manage_players', name: 'Gérer joueurs', description: 'Peut gérer les joueurs de l\'équipe' },
      ]
    },
    {
      id: 'tournament',
      name: 'Tournoi',
      icon: Calendar,
      permissions: [
        { id: 'tournament.view', name: 'Voir tournois', description: 'Peut voir les tournois' },
        { id: 'tournament.create', name: 'Créer tournoi', description: 'Peut créer un tournoi' },
        { id: 'tournament.edit', name: 'Modifier tournoi', description: 'Peut modifier les tournois' },
        { id: 'tournament.delete', name: 'Supprimer tournoi', description: 'Peut supprimer des tournois' },
        { id: 'tournament.manage_draw', name: 'Gérer tirage', description: 'Peut gérer le tirage au sort' },
        { id: 'tournament.generate_matches', name: 'Générer matchs', description: 'Peut générer les matchs' },
      ]
    },
    {
      id: 'match',
      name: 'Match',
      icon: Target,
      permissions: [
        { id: 'match.view', name: 'Voir matchs', description: 'Peut voir les matchs' },
        { id: 'match.create', name: 'Créer match', description: 'Peut créer un match' },
        { id: 'match.edit', name: 'Modifier match', description: 'Peut modifier les matchs' },
        { id: 'match.delete', name: 'Supprimer match', description: 'Peut supprimer des matchs' },
        { id: 'match.update_score', name: 'Mettre à jour score', description: 'Peut mettre à jour les scores' },
        { id: 'match.manage_live', name: 'Gérer match en direct', description: 'Peut gérer les matchs en direct' },
      ]
    },
    {
      id: 'player',
      name: 'Joueur',
      icon: UserCheck,
      permissions: [
        { id: 'player.view', name: 'Voir joueurs', description: 'Peut voir les joueurs' },
        { id: 'player.create', name: 'Créer joueur', description: 'Peut créer un joueur' },
        { id: 'player.edit', name: 'Modifier joueur', description: 'Peut modifier les joueurs' },
        { id: 'player.delete', name: 'Supprimer joueur', description: 'Peut supprimer des joueurs' },
        { id: 'player.assign_team', name: 'Assigner équipe', description: 'Peut assigner un joueur à une équipe' },
      ]
    },
    {
      id: 'stadium',
      name: 'Stade',
      icon: MapPin,
      permissions: [
        { id: 'stadium.view', name: 'Voir stades', description: 'Peut voir les stades' },
        { id: 'stadium.create', name: 'Créer stade', description: 'Peut créer un stade' },
        { id: 'stadium.edit', name: 'Modifier stade', description: 'Peut modifier les stades' },
        { id: 'stadium.delete', name: 'Supprimer stade', description: 'Peut supprimer des stades' },
      ]
    },
    {
      id: 'stats',
      name: 'Statistiques',
      icon: BarChart3,
      permissions: [
        { id: 'stats.view', name: 'Voir statistiques', description: 'Peut voir les statistiques' },
        { id: 'stats.view_advanced', name: 'Statistiques avancées', description: 'Peut voir les statistiques avancées' },
        { id: 'stats.export', name: 'Exporter données', description: 'Peut exporter les données' },
      ]
    },
    {
      id: 'payment',
      name: 'Paiement',
      icon: CreditCard,
      permissions: [
        { id: 'payment.view', name: 'Voir paiements', description: 'Peut voir les paiements' },
        { id: 'payment.process', name: 'Traiter paiements', description: 'Peut traiter les paiements' },
        { id: 'payment.refund', name: 'Rembourser', description: 'Peut effectuer des remboursements' },
      ]
    },
    {
      id: 'social',
      name: 'Communauté',
      icon: MessageSquare,
      permissions: [
        { id: 'social.view', name: 'Voir mur social', description: 'Peut voir le mur social' },
        { id: 'social.create', name: 'Créer post', description: 'Peut créer des posts' },
        { id: 'social.moderate', name: 'Modérer posts', description: 'Peut modérer les posts' },
        { id: 'social.delete', name: 'Supprimer posts', description: 'Peut supprimer des posts' },
      ]
    },
    {
      id: 'system',
      name: 'Système',
      icon: Settings,
      permissions: [
        { id: 'system.admin_panel', name: 'Panneau admin', description: 'Peut accéder au panneau d\'administration' },
        { id: 'system.view_logs', name: 'Voir logs', description: 'Peut voir les logs système' },
        { id: 'system.manage_settings', name: 'Gérer paramètres', description: 'Peut gérer les paramètres système' },
        { id: 'system.backup', name: 'Sauvegarde', description: 'Peut effectuer des sauvegardes' },
        { id: 'system.restore', name: 'Restauration', description: 'Peut restaurer des données' },
        { id: 'system.audit_logs', name: 'Logs d\'audit', description: 'Peut voir les logs d\'audit' },
        { id: 'system.notifications', name: 'Gérer notifications', description: 'Peut gérer les notifications' },
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  const getPermissionStatus = (permissionId: string) => {
    // Si on affiche les permissions d'un utilisateur spécifique
    if (userRole) {
      // Logique pour déterminer les permissions basées sur le rôle
      const rolePermissions: { [key: string]: string[] } = {
        player: [
          'user.view_profile', 'user.edit_profile',
          'team.view', 'tournament.view', 'match.view',
          'player.view', 'stadium.view', 'stats.view',
          'social.view', 'social.create'
        ],
        coach: [
          'user.view_profile', 'user.edit_profile',
          'team.view', 'team.create', 'team.edit', 'team.manage_players',
          'tournament.view', 'tournament.create', 'tournament.edit', 'tournament.manage_draw', 'tournament.generate_matches',
          'match.view', 'match.create', 'match.edit', 'match.update_score', 'match.manage_live',
          'player.view', 'player.create', 'player.edit', 'player.assign_team',
          'stadium.view', 'stats.view', 'stats.view_advanced',
          'social.view', 'social.create', 'social.moderate',
          'system.notifications'
        ],
        admin: [
          'user.view_profile', 'user.edit_profile', 'user.view_all', 'user.edit', 'user.delete', 'user.manage_roles', 'user.invite',
          'team.view', 'team.create', 'team.edit', 'team.delete', 'team.manage_players',
          'tournament.view', 'tournament.create', 'tournament.edit', 'tournament.delete', 'tournament.manage_draw', 'tournament.generate_matches',
          'match.view', 'match.create', 'match.edit', 'match.delete', 'match.update_score', 'match.manage_live',
          'player.view', 'player.create', 'player.edit', 'player.delete', 'player.assign_team',
          'stadium.view', 'stadium.create', 'stadium.edit', 'stadium.delete',
          'stats.view', 'stats.view_advanced', 'stats.export',
          'payment.view', 'payment.process', 'payment.refund',
          'social.view', 'social.create', 'social.moderate', 'social.delete',
          'system.admin_panel', 'system.view_logs', 'system.manage_settings', 'system.backup', 'system.restore', 'system.audit_logs', 'system.notifications'
        ]
      };
      
      return rolePermissions[userRole]?.includes(permissionId) || false;
    }
    
    // Sinon, utiliser les permissions de l'utilisateur actuel
    return hasPermission(permissionId);
  };

  const handlePermissionToggle = (permissionId: string, currentStatus: boolean) => {
    if (onPermissionChange) {
      onPermissionChange(permissionId, !currentStatus);
    }
  };

  return (
    <div className="space-y-4">
      {permissionCategories.map((category) => {
        const Icon = category.icon;
        const isExpanded = isCategoryExpanded(category.id);
        const categoryPermissions = category.permissions.filter(permission => 
          getPermissionStatus(permission.id)
        );
        const totalPermissions = category.permissions.length;
        const grantedPermissions = categoryPermissions.length;

        return (
          <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-500">
                  ({grantedPermissions}/{totalPermissions})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">{grantedPermissions}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>
            
            {isExpanded && (
              <div className="border-t border-gray-200 bg-white">
                <div className="p-4 space-y-3">
                  {category.permissions.map((permission) => {
                    const isGranted = getPermissionStatus(permission.id);
                    return (
                      <div key={permission.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{permission.name}</span>
                            {isGranted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          {showDetails && (
                            <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
                          )}
                        </div>
                        {onPermissionChange && (
                          <button
                            onClick={() => handlePermissionToggle(permission.id, isGranted)}
                            className={`p-2 rounded-lg transition-colors ${
                              isGranted 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title={isGranted ? 'Révoquer la permission' : 'Accorder la permission'}
                          >
                            {isGranted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsDisplay;
