import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllUsers, getUserStats, updateUserRole, deleteUser } from '../services/api';
import { User, UserStats, Permission, RolePermissions } from '../types';
import PermissionsDisplay from './PermissionsDisplay';
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';

interface UserManagementProps {
  onClose?: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const { user: currentUser } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Permissions par rôle
  const rolePermissions: RolePermissions = {
    player: [
      { id: 'view_profile', name: 'Voir profil', description: 'Peut voir son propre profil', category: 'user', granted: true },
      { id: 'edit_profile', name: 'Modifier profil', description: 'Peut modifier son propre profil', category: 'user', granted: true },
      { id: 'view_teams', name: 'Voir équipes', description: 'Peut voir les équipes', category: 'team', granted: true },
      { id: 'view_tournaments', name: 'Voir tournois', description: 'Peut voir les tournois', category: 'tournament', granted: true },
      { id: 'view_matches', name: 'Voir matchs', description: 'Peut voir les matchs', category: 'match', granted: true },
    ],
    coach: [
      { id: 'view_profile', name: 'Voir profil', description: 'Peut voir son propre profil', category: 'user', granted: true },
      { id: 'edit_profile', name: 'Modifier profil', description: 'Peut modifier son propre profil', category: 'user', granted: true },
      { id: 'view_teams', name: 'Voir équipes', description: 'Peut voir les équipes', category: 'team', granted: true },
      { id: 'create_team', name: 'Créer équipe', description: 'Peut créer une équipe', category: 'team', granted: true },
      { id: 'edit_team', name: 'Modifier équipe', description: 'Peut modifier son équipe', category: 'team', granted: true },
      { id: 'view_tournaments', name: 'Voir tournois', description: 'Peut voir les tournois', category: 'tournament', granted: true },
      { id: 'create_tournament', name: 'Créer tournoi', description: 'Peut créer un tournoi', category: 'tournament', granted: true },
      { id: 'edit_tournament', name: 'Modifier tournoi', description: 'Peut modifier ses tournois', category: 'tournament', granted: true },
      { id: 'view_matches', name: 'Voir matchs', description: 'Peut voir les matchs', category: 'match', granted: true },
      { id: 'manage_matches', name: 'Gérer matchs', description: 'Peut gérer les matchs de son équipe', category: 'match', granted: true },
    ],
    admin: [
      { id: 'view_profile', name: 'Voir profil', description: 'Peut voir son propre profil', category: 'user', granted: true },
      { id: 'edit_profile', name: 'Modifier profil', description: 'Peut modifier son propre profil', category: 'user', granted: true },
      { id: 'view_all_users', name: 'Voir tous les utilisateurs', description: 'Peut voir tous les utilisateurs', category: 'user', granted: true },
      { id: 'edit_users', name: 'Modifier utilisateurs', description: 'Peut modifier les utilisateurs', category: 'user', granted: true },
      { id: 'delete_users', name: 'Supprimer utilisateurs', description: 'Peut supprimer des utilisateurs', category: 'user', granted: true },
      { id: 'manage_roles', name: 'Gérer rôles', description: 'Peut changer les rôles des utilisateurs', category: 'user', granted: true },
      { id: 'view_teams', name: 'Voir équipes', description: 'Peut voir toutes les équipes', category: 'team', granted: true },
      { id: 'create_team', name: 'Créer équipe', description: 'Peut créer des équipes', category: 'team', granted: true },
      { id: 'edit_team', name: 'Modifier équipe', description: 'Peut modifier toutes les équipes', category: 'team', granted: true },
      { id: 'delete_team', name: 'Supprimer équipe', description: 'Peut supprimer des équipes', category: 'team', granted: true },
      { id: 'view_tournaments', name: 'Voir tournois', description: 'Peut voir tous les tournois', category: 'tournament', granted: true },
      { id: 'create_tournament', name: 'Créer tournoi', description: 'Peut créer des tournois', category: 'tournament', granted: true },
      { id: 'edit_tournament', name: 'Modifier tournoi', description: 'Peut modifier tous les tournois', category: 'tournament', granted: true },
      { id: 'delete_tournament', name: 'Supprimer tournoi', description: 'Peut supprimer des tournois', category: 'tournament', granted: true },
      { id: 'view_matches', name: 'Voir matchs', description: 'Peut voir tous les matchs', category: 'match', granted: true },
      { id: 'manage_matches', name: 'Gérer matchs', description: 'Peut gérer tous les matchs', category: 'match', granted: true },
      { id: 'view_stats', name: 'Voir statistiques', description: 'Peut voir toutes les statistiques', category: 'admin', granted: true },
      { id: 'export_data', name: 'Exporter données', description: 'Peut exporter les données', category: 'admin', granted: true },
    ]
  };

  useEffect(() => {
    // Check if current user is admin
    if (!currentUser) {
      setError('Utilisateur non connecté.');
      return;
    }
    
    if (currentUser.role !== 'admin') {
      setError(`Accès non autorisé. Votre rôle actuel est "${currentUser.role}". Seuls les administrateurs peuvent accéder à cette fonctionnalité.`);
      return;
    }
    
    loadUsers();
    loadStats();
  }, [currentUser]);

  // Test function to check backend connectivity
  const testBackendConnection = async () => {
    try {
      console.log("🧪 Test de connexion au backend...");
      
      // Test multiple endpoints to see what's working
      const endpoints = [
        '/test',
        '/health',
        '/ping',
        '/auth/test'
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || "https://backend-7oumaligue-hrd4bqesgcefg5h4.francecentral-01.azurewebsites.net/api"}${endpoint}`);
          const data = await response.json();
          console.log(`✅ Endpoint ${endpoint} accessible:`, data);
        } catch (error) {
          console.log(`❌ Endpoint ${endpoint} non accessible:`, error);
        }
      }
      
      return true;
    } catch (error) {
      console.error("❌ Test de connexion échoué:", error);
      return false;
    }
  };

  // Test function to check authentication
  const testAuthentication = async () => {
    try {
      console.log("🔐 Test d'authentification...");
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Pas de token trouvé");
        return false;
      }
      
      // Test simple auth route first
      const authTestResponse = await fetch(`${import.meta.env.VITE_API_URL || "https://backend-7oumaligue-hrd4bqesgcefg5h4.francecentral-01.azurewebsites.net/api"}/auth/test`);
      const authTestData = await authTestResponse.json();
      console.log("✅ Test route auth simple:", authTestData);
      
      // Test authenticated route
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://backend-7oumaligue-hrd4bqesgcefg5h4.francecentral-01.azurewebsites.net/api"}/auth/debug`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("✅ Test d'authentification réussi:", data);
      return true;
    } catch (error) {
      console.error("❌ Test d'authentification échoué:", error);
      return false;
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Début du chargement des utilisateurs...");
      console.log("🔐 Token actuel:", localStorage.getItem("token") ? "Présent" : "Absent");
      console.log("👤 Utilisateur actuel:", currentUser);
      
      // Test backend connection first
      const backendOk = await testBackendConnection();
      if (!backendOk) {
        throw new Error("Impossible de se connecter au serveur backend");
      }
      
      // Test authentication
      const authOk = await testAuthentication();
      if (!authOk) {
        throw new Error("Problème d'authentification");
      }
      
      const usersData = await getAllUsers();
      console.log("✅ Utilisateurs récupérés:", usersData);
      setUsers(usersData);
    } catch (err: any) {
      console.error("❌ Erreur détaillée lors du chargement des utilisateurs:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: err.config
      });
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getUserStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers(); // Recharger la liste
      setShowUserModal(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      await loadUsers(); // Recharger la liste
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-500" />;
      case 'coach': return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'player': return <Users className="w-4 h-4 text-green-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'coach':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'player':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur lors du chargement des utilisateurs
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={loadUsers}
                  className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="mr-3 text-blue-600" size={28} />
            Gestion des Utilisateurs
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez les utilisateurs et leurs permissions
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={testBackendConnection}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Backend
          </button>
          <button
            onClick={testAuthentication}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Auth
          </button>
          <button
            onClick={() => getAllUsers().then(console.log).catch(console.error)}
            className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Users API
          </button>
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL || "https://backend-7oumaligue-hrd4bqesgcefg5h4.francecentral-01.azurewebsites.net/api"}/auth/test-db`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                const data = await response.json();
                console.log("✅ Test DB:", data);
              } catch (error) {
                console.error("❌ Test DB échoué:", error);
              }
            }}
            className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Test DB
          </button>
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || "https://backend-7oumaligue-hrd4bqesgcefg5h4.francecentral-01.azurewebsites.net/api"}/routes`);
                const data = await response.json();
                console.log("✅ Routes disponibles:", data);
              } catch (error) {
                console.error("❌ Test routes échoué:", error);
              }
            }}
            className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Test Routes
          </button>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={24} />
          </button>
        )}
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Joueurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byRole.players}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Coachs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byRole.coaches}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byRole.admins}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="coach">Coachs</option>
              <option value="player">Joueurs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className={getRoleBadge(user.role)}>
                        {user.role === 'admin' ? 'Administrateur' :
                         user.role === 'coach' ? 'Coach' : 'Joueur'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span>{user._count?.socialPosts || 0} posts</span>
                        <span>•</span>
                        <span>{user._count?.teams || 0} équipes</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPermissionsModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Permissions"
                      >
                        <Lock size={16} />
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(filteredUsers.length / usersPerPage)}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * usersPerPage, filteredUsers.length)}
                    </span>{' '}
                    sur <span className="font-medium">{filteredUsers.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(filteredUsers.length / usersPerPage)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de modification d'utilisateur */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Modifier l'utilisateur
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => handleRoleUpdate(selectedUser.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="player">Joueur</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de permissions */}
      {showPermissionsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  Permissions - {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Rôle actuel: <span className="font-medium">{selectedUser.role === 'admin' ? 'Administrateur' : selectedUser.role === 'coach' ? 'Coach' : 'Joueur'}</span>
                </p>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <PermissionsDisplay 
              userRole={selectedUser.role}
              showDetails={true}
            />
            
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirmer la suppression
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser.name}</strong> ? 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
