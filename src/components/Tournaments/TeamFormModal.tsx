import React from 'react';
import { X } from 'lucide-react';
import { Team } from '../../types';

interface TeamFormModalProps {
  show: boolean;
  onClose: () => void;
  team: Partial<Team>;
  setTeam: React.Dispatch<React.SetStateAction<Partial<Team>>>;
  onSubmit: () => void;
  t: (key: string) => string;
}

const TeamFormModal: React.FC<TeamFormModalProps> = ({
  show,
  onClose,
  team,
  setTeam,
  onSubmit,
  t
}) => {
  if (!show) return null;

  const logoOptions = ['⚽', '🏆', '🥇', '🏅', '🎯', '🔥', '⭐', '💎', '👑', '🌟', '🦁', '🦅', '🦈', '⚡', '🐺', '🦉', '🦊', '🐯', '🐻', '🐨'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Créer une nouvelle équipe
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'équipe
            </label>
            <input
              type="text"
              required
              value={team.name || ''}
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nom de l'équipe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
              {logoOptions.map((logo) => (
                <button
                  key={logo}
                  type="button"
                  onClick={() => setTeam({ ...team, logo })}
                  className={`p-2 text-2xl rounded-lg border-2 ${
                    team.logo === logo 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {logo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entraîneur
            </label>
            <input
              type="text"
              value={team.coach || ''}
              onChange={(e) => setTeam({ ...team, coach: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nom de l'entraîneur"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!team.name || !team.logo}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Créer l'équipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFormModal; 