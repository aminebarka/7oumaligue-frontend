// src/components/Tournaments/MatchFormModal.tsx
import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Match, Team } from '../../types';

interface MatchFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (match: Match) => void;
  teams: Team[];
  t: (key: string) => string;
  initialMatch?: Match;
}

const MatchFormModal: React.FC<MatchFormModalProps> = ({
  show,
  onClose,
  onSubmit,
  teams,
  t,
  initialMatch
}) => {
  const [match, setMatch] = useState<Match>(initialMatch || {
    id: '',
    date: '',
    time: '18:00',
    venue: '',
    homeTeam: '',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    type: 'tournament'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!match.date) newErrors.date = t('common.required');
    if (!match.time) newErrors.time = t('common.required');
    if (!match.venue) newErrors.venue = t('common.required');
    if (!match.homeTeam) newErrors.homeTeam = t('common.required');
    if (!match.awayTeam) newErrors.awayTeam = t('common.required');
    if (match.homeTeam === match.awayTeam) newErrors.awayTeam = t('matches.error.sameTeam');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const matchId = initialMatch?.id || `match-${Date.now()}`;
      onSubmit({ ...match, id: matchId });
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {initialMatch ? t('common.edit.match') : t('matches.create.new')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar size={16} className="mr-2" />
                {t('common.date')}
              </label>
              <input
                type="date"
                required
                value={match.date}
                onChange={(e) => setMatch({ ...match, date: e.target.value })}
                className={`w-full px-4 py-2 border ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock size={16} className="mr-2" />
                {t('common.time')}
              </label>
              <input
                type="time"
                required
                value={match.time}
                onChange={(e) => setMatch({ ...match, time: e.target.value })}
                className={`w-full px-4 py-2 border ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin size={16} className="mr-2" />
              {t('common.venue')}
            </label>
            <input
              type="text"
              required
              value={match.venue}
              onChange={(e) => setMatch({ ...match, venue: e.target.value })}
              placeholder={t('matches.venue.placeholder')}
              className={`w-full px-4 py-2 border ${
                errors.venue ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('matches.home.team')}
              </label>
              <select
                value={match.homeTeam}
                onChange={(e) => setMatch({ ...match, homeTeam: e.target.value })}
                className={`w-full px-4 py-2 border ${
                  errors.homeTeam ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              >
                <option value="">{t('common.select.team')}</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.homeTeam && <p className="text-red-500 text-xs mt-1">{errors.homeTeam}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('matches.away.team')}
              </label>
              <select
                value={match.awayTeam}
                onChange={(e) => setMatch({ ...match, awayTeam: e.target.value })}
                className={`w-full px-4 py-2 border ${
                  errors.awayTeam ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              >
                <option value="">{t('common.select.team')}</option>
                {teams
                  .filter(team => team.id !== match.homeTeam)
                  .map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
              {errors.awayTeam && <p className="text-red-500 text-xs mt-1">{errors.awayTeam}</p>}
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
              type="submit"
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {initialMatch ? t('common.save') : t('common.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchFormModal;
