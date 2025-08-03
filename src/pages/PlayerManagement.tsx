import React from 'react';
import { useData } from '../contexts/DataContext';
import { Users, User, Star } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  level: number;
  teamId?: string;
}

interface Team {
  id: string;
  name: string;
  logo: string | null;
  coachName?: string;
}

const PlayerManagementPage: React.FC = () => {
  const { teams, players } = useData();
  const teamList = teams || [];
  const allPlayers = players || [];

  const getTeamPlayers = (teamId: string): Player[] => {
    return allPlayers.filter(p => p.teamId && p.teamId === teamId);
  };

  const renderStars = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={star <= level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">Niv.{level}</span>
      </div>
    );
  };

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex items-center mb-6 gap-3">
        <Users size={28} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des joueurs - إدارة اللاعبين
        </h1>
      </div>

      {/* Wide Grid Layout - All Teams and Players */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {teamList.map(team => {
          const teamPlayers = getTeamPlayers(team.id);
          return (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Team Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                    {team.logo || '⚽'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{team.name}</h3>
                    {team.coachName && (
                      <p className="text-blue-100 text-sm">Coach: {team.coachName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="bg-white/20 px-2 py-1 rounded text-sm font-semibold">
                      {teamPlayers.length} joueurs
                    </span>
                  </div>
                </div>
              </div>

              {/* Players List */}
              <div className="p-4">
                {teamPlayers.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <User size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucun joueur</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {teamPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-blue-300 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm truncate">
                              {player.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {player.position || 'Poste inconnu'} • {player.age} ans
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {renderStars(player.level || 1)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{teamList.length}</div>
            <div className="text-sm text-gray-600">Équipes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{allPlayers.length}</div>
            <div className="text-sm text-gray-600">Joueurs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(allPlayers.reduce((sum, p) => sum + (p.level || 1), 0) / allPlayers.length || 0)}
            </div>
            <div className="text-sm text-gray-600">Niveau moyen</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(allPlayers.reduce((sum, p) => sum + p.age, 0) / allPlayers.length || 0)}
            </div>
            <div className="text-sm text-gray-600">Âge moyen</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerManagementPage; 