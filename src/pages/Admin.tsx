import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { Shield, Users, Trophy, Calendar, Settings, AlertTriangle, CheckCircle, Edit, Trash2, Download } from 'lucide-react';
import UserManagement from '../components/UserManagement';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { teams, tournaments, matches } = useData();
  const { t, isRTL } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'teams' | 'tournaments' | 'matches' | 'reports'>('overview');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const adminStats = [
    { label: 'Utilisateurs Actifs', value: 42, icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Équipes Créées', value: teams.length, icon: Trophy, color: 'from-green-500 to-green-600', change: '+8%' },
    { label: 'Tournois Gérés', value: tournaments.length, icon: Calendar, color: 'from-purple-500 to-purple-600', change: '+25%' },
    { label: 'Matchs Organisés', value: matches.length, icon: Settings, color: 'from-yellow-500 to-yellow-600', change: '+15%' }
  ];

  const recentActivity = [
    { type: 'team', message: 'Nouvelle équipe "FC Titans" créée', time: '2h', status: 'success' },
    { type: 'match', message: 'Match FC Lions vs Eagles FC terminé', time: '4h', status: 'info' },
    { type: 'user', message: 'Nouvel utilisateur inscrit: Mohamed Alami', time: '6h', status: 'success' },
    { type: 'tournament', message: 'Tournoi "Coupe du Printemps" lancé', time: '1j', status: 'warning' },
    { type: 'alert', message: 'Signalement reçu pour comportement antisportif', time: '2j', status: 'danger' }
  ];

  const pendingActions = [
    { id: 1, type: 'team_approval', message: 'Équipe "New Stars" en attente d\'approbation', priority: 'high' },
    { id: 2, type: 'user_report', message: 'Signalement utilisateur à traiter', priority: 'medium' },
    { id: 3, type: 'tournament_setup', message: 'Finaliser les paramètres du tournoi d\'été', priority: 'low' }
  ];

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Settings },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'teams', label: 'Équipes', icon: Trophy },
    { id: 'tournaments', label: 'Tournois', icon: Calendar },
    { id: 'matches', label: 'Matchs', icon: Calendar },
    { id: 'reports', label: 'Rapports', icon: Download }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="mr-3 text-red-600" size={32} />
            Administration
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez et supervisez l'ensemble de la plateforme 7ouma Ligue
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            🔒 Accès Administrateur
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-2 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'danger' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.message}</div>
                      <div className="text-xs text-gray-500">Il y a {activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions Requises</h2>
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`${
                          action.priority === 'high' ? 'text-red-500' :
                          action.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} size={16} />
                        <span className={`text-xs font-medium uppercase ${
                          action.priority === 'high' ? 'text-red-800' :
                          action.priority === 'medium' ? 'text-yellow-800' : 'text-blue-800'
                        }`}>
                          {action.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-3">{action.message}</div>
                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Traiter
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors">
                        Reporter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'users' && (
        <UserManagement />
      )}

      {selectedTab === 'teams' && (
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Gestion des Équipes</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Équipe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coach</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joueurs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{team.logo}</span>
                          <div className="font-medium text-gray-900">{team.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.coach}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.players.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'reports' && (
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Rapports et Exports</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Rapport d'Activité</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Exportez un rapport complet de l'activité de la plateforme
                </p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                  <Download size={16} />
                  <span>Télécharger PDF</span>
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Données Utilisateurs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Exportez les données des utilisateurs au format Excel
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Download size={16} />
                  <span>Télécharger Excel</span>
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Statistiques Matchs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Exportez les statistiques détaillées des matchs
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Download size={16} />
                  <span>Télécharger CSV</span>
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Feuilles de Match</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Générez des feuilles de match imprimables
                </p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2">
                  <Download size={16} />
                  <span>Générer PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
