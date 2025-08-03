import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import { Navigate } from 'react-router-dom';
import { Plus, Users, Trophy, Target, Calendar, Edit, Trash2, Star, Award, X } from 'lucide-react';
import { Team, Player } from '../types';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Teams: React.FC = () => {
  const { user } = useAuth();
  const { teams, players, loadData, addTeam, updatePlayer, createTeam } = useData();
  const { t, isRTL } = useLanguage();
  const { canEdit, canDelete, canCreate } = usePermissions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const [newTeam, setNewTeam] = useState<Omit<Team, 'id'>>({
    name: '',
    logo: '⚽',
    coach: user?.name || '',
    players: [],
    playerLevels: {},
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    goalsAgainst: 0,
    createdAt: new Date().toISOString().split('T')[0],
    averageLevel: 0
  });

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const logoOptions = ['⚽', '🦁', '🦅', '🐺', '🔥', '⚡', '🏆', '🎯', '💪', '🌟'];

  // Charger les données au montage du composant
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]); // Retirer loadData des dépendances pour éviter la boucle infinie

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam({
        ...newTeam,
        id: `team-${Date.now()}`
      } as Team);
      setShowCreateModal(false);
      // Recharger les données après création
      await loadData();
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  };

  const handleEditTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    
    try {
      // Mettre à jour l'équipe via l'API
      const { updateTeam } = await import('../services/api');
      await updateTeam(editingTeam.id, editingTeam);
      setShowEditModal(false);
      setEditingTeam(null);
      // Recharger les données après modification
      await loadData();
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const { deleteTeam } = await import('../services/api');
      
      // Essayer d'abord la suppression normale
      try {
        await deleteTeam(teamId);
        console.log("✅ Équipe supprimée normalement");
      } catch (error: any) {
        // Si l'erreur indique un tournoi actif, proposer la suppression forcée
        if (error?.response?.data?.message?.includes('tournoi actif')) {
          const forceDelete = confirm(
            'Cette équipe participe à un tournoi actif. Voulez-vous forcer la suppression ?\n\n⚠️ Attention : Cela retirera l\'équipe du tournoi.'
          );
          
          if (forceDelete) {
            await deleteTeam(teamId, true); // Suppression forcée
            console.log("✅ Équipe supprimée avec suppression forcée");
          } else {
            console.log("❌ Suppression annulée par l'utilisateur");
            return; // Ne pas recharger les données
          }
        } else {
          // Autre type d'erreur, la relancer
          throw error;
        }
      }
      
      // Recharger les données après suppression
      await loadData();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🟠';
      case 'expert': return '🔴';
      case 'professional': return '⭐';
      default: return '⚪';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-orange-600';
      case 'expert': return 'text-red-600';
      case 'professional': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  // Calculer les statistiques réelles pour chaque équipe
  const getTeamStats = (team: Team) => {
    const teamPlayers = players.filter(p => p.teamId === team.id);
    const totalMatches = team.matches || 0;
    const wins = team.wins || 0;
    const draws = team.draws || 0;
    const losses = team.losses || 0;
    const goals = team.goals || 0;
    const goalsAgainst = team.goalsAgainst || 0;
    
    // Calculer le niveau moyen
    const averageLevel = teamPlayers.length > 0 
      ? Math.round(teamPlayers.reduce((sum, p) => sum + p.level, 0) / teamPlayers.length * 10) / 10
      : 0;

    return {
      playerCount: teamPlayers.length,
      totalMatches,
      wins,
      draws,
      losses,
      goals,
      goalsAgainst,
      averageLevel,
      winPercentage: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReadOnlyBanner />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Équipes</h1>
          <p className="text-gray-600 mt-2">Gérez vos équipes et joueurs</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Créer une équipe</span>
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const stats = getTeamStats(team);
          
          return (
            <div key={team.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{team.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{team.name}</h3>
                      <p className="text-green-100">Coach: {team.coach}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star size={16} className="text-yellow-300" />
                        <span className="text-green-100 text-sm">Niveau: {stats.averageLevel}/5</span>
                      </div>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowPlayerModal(true);
                        }}
                        className="text-white hover:text-green-200 transition-colors"
                        title="Gestion des joueurs"
                      >
                        <Award size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingTeam(team);
                          setShowEditModal(true);
                        }}
                        className="text-white hover:text-green-200 transition-colors"
                        title="Modifier l'équipe"
                      >
                        <Edit size={18} />
                      </button>
                      {canDelete && (
                        <button 
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-white hover:text-red-200 transition-colors"
                          title="Supprimer l'équipe"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{stats.playerCount} joueurs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{stats.totalMatches} matchs</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
                    <div className="text-xs text-gray-500">Victoires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.draws}</div>
                    <div className="text-xs text-gray-500">Nuls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
                    <div className="text-xs text-gray-500">Défaites</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Target size={16} />
                    <span>{stats.goals} buts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy size={16} />
                    <span>{stats.winPercentage}% victoires</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de création d'équipe */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Créer une nouvelle équipe</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'équipe
                </label>
                <input
                  type="text"
                  required
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: FC Lions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {logoOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewTeam({ ...newTeam, logo: emoji })}
                      className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                        newTeam.logo === emoji
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coach
                </label>
                <input
                  type="text"
                  required
                  value={newTeam.coach}
                  onChange={(e) => setNewTeam({ ...newTeam, coach: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nom du coach"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-white px-4 py-2 rounded-lg font-medium"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition d'équipe */}
      {showEditModal && editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Modifier l'équipe</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTeam(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'équipe
                </label>
                <input
                  type="text"
                  required
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {logoOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditingTeam({ ...editingTeam, logo: emoji })}
                      className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                        editingTeam.logo === emoji
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coach
                </label>
                <input
                  type="text"
                  required
                  value={editingTeam.coach}
                  onChange={(e) => setEditingTeam({ ...editingTeam, coach: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTeam(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-white px-4 py-2 rounded-lg font-medium"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de gestion des joueurs */}
      {showPlayerModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Award className="mr-3 text-yellow-600" size={28} />
                Gestion des joueurs - {selectedTeam.name}
              </h2>
              <button
                onClick={() => setShowPlayerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {(() => {
                const teamPlayers = players.filter(p => p.teamId === selectedTeam.id);
                
                if (teamPlayers.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <Users size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Aucun joueur dans cette équipe</p>
                      <p className="text-sm">Les joueurs seront ajoutés lors du tirage au sort</p>
                    </div>
                  );
                }
                
                return teamPlayers.map((player) => (
                  <div key={player.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.position} • {player.age} ans</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{'⭐'.repeat(player.level)}</span>
                        <span className="text-sm font-medium text-blue-600">
                          Niveau {player.level}/5
                        </span>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowPlayerModal(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;