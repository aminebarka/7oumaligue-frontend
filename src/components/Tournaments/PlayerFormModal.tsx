// src/components/Tournaments/PlayerFormModal.tsx
import React from 'react';
import { Player, Team } from '../../types';

interface PlayerFormModalProps {
  show: boolean;
  onClose: () => void;
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  onSubmit: () => void;
  t: (key: string) => string;
  teams: Team[];
}

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  show,
  onClose,
  player,
  setPlayer,
  onSubmit,
  t,
  teams
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {player.id ? t('common.edit.player') : t('common.add.player')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.player.name')}
            </label>
            <input
              type="text"
              required
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nom du joueur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.position')}
            </label>
            <select
              value={player.position}
              onChange={(e) => setPlayer({ ...player, position: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Gardien">Gardien</option>
              <option value="Défenseur">Défenseur</option>
              <option value="Milieu">Milieu</option>
              <option value="Attaquant">Attaquant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.team')}
            </label>
            <select
              value={player.teamId || ''}
              onChange={e => setPlayer({ ...player, teamId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Sélectionner une équipe</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.level')}
              </label>
              <select
                value={player.level}
                onChange={(e) => setPlayer({ ...player, level: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(level => (
                  <option key={level} value={level}>
                    {level} ⭐
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.age')}
              </label>
              <input
                type="number"
                min="16"
                max="50"
                value={player.age}
                onChange={(e) => setPlayer({ ...player, age: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.jerseyNumber')}
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={player.jerseyNumber || ''}
                onChange={(e) => setPlayer({ 
                  ...player, 
                  jerseyNumber: parseInt(e.target.value) 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {player.id ? t('common.save') : t('common.add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerFormModal;