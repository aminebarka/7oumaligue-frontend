import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Users, User, Shield, ChevronLeft, Dribbble } from 'lucide-react';

const TeamPlayersPage: React.FC = () => {
  const { teams, players } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const teamList = teams || [];
  const selectedTeam = teamList.find(t => t.id === selectedTeamId) || null;
  const teamPlayers = selectedTeam
    ? players.filter(p => p.teamId === selectedTeam.id)
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8 gap-3">
        <Dribbble size={32} className="text-orange-500" />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Joueurs par équipe</h1>
      </div>
      {!selectedTeamId ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamList.map(team => (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-100 to-orange-300 flex items-center justify-center text-3xl font-bold shadow-sm mb-3">
                {team.logo || '⚽'}
              </div>
              <span className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors mb-1">{team.name}</span>
              <span className="text-xs text-gray-500">Coach: {team.coachName || '-'}</span>
              <span className="mt-2 px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                {players.filter(p => p.teamId === team.id).length} joueurs
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedTeamId(null)}
            className="flex items-center mb-6 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" /> Retour aux équipes
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-6 gap-2">
              <Users size={20} className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800">{selectedTeam?.name}</h2>
              <span className="ml-auto px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                {teamPlayers.length} joueurs
              </span>
            </div>
            {teamPlayers.length === 0 ? (
              <div className="text-gray-500 flex flex-col items-center py-12">
                <User size={48} className="mb-2 text-gray-300" />
                Aucun joueur dans cette équipe.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {teamPlayers.map(player => (
                  <li key={player.id} className="flex items-center py-4 gap-4 group hover:bg-orange-50 rounded-lg transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-100 to-orange-300 flex items-center justify-center text-2xl font-bold shadow-sm">
                      <User size={24} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors text-lg">{player.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {player.position || 'Poste inconnu'} • {player.age} ans
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPlayersPage; 