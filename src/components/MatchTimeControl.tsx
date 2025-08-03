import React, { useState } from 'react';
import { Match } from '../types';

interface MatchTimeControlProps {
  match: Match;
  matchPhase: {
    phase: 'not_started' | 'first_half' | 'half_time' | 'second_half' | 'extra_time' | 'finished';
    extraTimeMinutes: number;
    isPaused: boolean;
  };
  onStartFirstHalf: (matchId: string) => void;
  onEndFirstHalf: (matchId: string) => void;
  onStartSecondHalf: (matchId: string) => void;
  onEndSecondHalf: (matchId: string) => void;
  onStartExtraTime: (matchId: string) => void;
  onEndExtraTime: (matchId: string) => void;
  onPause: (matchId: string) => void;
  onResume: (matchId: string) => void;
  onSetExtraTime: (matchId: string, minutes: number) => void;
  getPhaseElapsedTime: (matchId: string, phase: 'first_half' | 'second_half' | 'extra_time') => number;
}

const MatchTimeControl: React.FC<MatchTimeControlProps> = ({
  match,
  matchPhase,
  onStartFirstHalf,
  onEndFirstHalf,
  onStartSecondHalf,
  onEndSecondHalf,
  onStartExtraTime,
  onEndExtraTime,
  onPause,
  onResume,
  onSetExtraTime,
  getPhaseElapsedTime
}) => {
  const [showExtraTimeInput, setShowExtraTimeInput] = useState(false);
  const [extraTimeInput, setExtraTimeInput] = useState((matchPhase?.extraTimeMinutes || 0).toString());

  // S'assurer que matchPhase a des valeurs par défaut
  const safeMatchPhase = {
    phase: matchPhase?.phase || 'not_started',
    extraTimeMinutes: matchPhase?.extraTimeMinutes || 0,
    isPaused: matchPhase?.isPaused || false
  };

  const getPhaseDisplay = () => {
    switch (safeMatchPhase.phase) {
      case 'not_started':
        return { text: 'Match non commencé', color: 'text-gray-500', bgColor: 'bg-gray-100' };
      case 'first_half':
        const firstHalfTime = getPhaseElapsedTime(match.id, 'first_half');
        return { text: `1ère mi-temps ${firstHalfTime}'`, color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'half_time':
        return { text: 'Mi-temps', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'second_half':
        const secondHalfTime = getPhaseElapsedTime(match.id, 'second_half');
        return { text: `2ème mi-temps ${secondHalfTime}'`, color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'extra_time':
        const extraTime = getPhaseElapsedTime(match.id, 'extra_time');
        return { text: `Temps additionnel ${extraTime}'`, color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'finished':
        return { text: 'Match terminé', color: 'text-gray-600', bgColor: 'bg-gray-100' };
      default:
        return { text: 'Inconnu', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  const phaseDisplay = getPhaseDisplay();

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">⏱️ Contrôle du temps</h4>
      
      {/* Statut actuel */}
      <div className={`${phaseDisplay.bgColor} rounded-lg p-3 mb-4`}>
        <div className={`text-center font-bold ${phaseDisplay.color}`}>
          {phaseDisplay.text}
        </div>
        {safeMatchPhase.isPaused && (
          <div className="text-center text-yellow-600 text-sm mt-1">
            ⏸️ En pause
          </div>
        )}
      </div>

      {/* Contrôles selon la phase */}
      <div className="space-y-2">
        {safeMatchPhase.phase === 'not_started' && (
          <button
            onClick={() => onStartFirstHalf(match.id)}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
          >
            ▶️ Commencer la 1ère mi-temps
          </button>
        )}

        {safeMatchPhase.phase === 'first_half' && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              {!safeMatchPhase.isPaused ? (
                <button
                  onClick={() => onPause(match.id)}
                  className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-colors text-sm"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={() => onResume(match.id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  ▶️ Reprendre
                </button>
              )}
              <button
                onClick={() => onEndFirstHalf(match.id)}
                className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors text-sm"
              >
                🔚 Fin 1ère mi-temps
              </button>
            </div>
          </div>
        )}

        {safeMatchPhase.phase === 'half_time' && (
          <div className="space-y-2">
            <button
              onClick={() => onStartSecondHalf(match.id)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
            >
              ▶️ Commencer la 2ème mi-temps
            </button>
            
            {/* Configuration du temps additionnel */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Temps additionnel:</span>
                <span className="text-sm text-gray-600">{safeMatchPhase.extraTimeMinutes} min</span>
              </div>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4, 5].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => onSetExtraTime(match.id, minutes)}
                    className={`flex-1 py-1 px-2 rounded text-xs ${
                      safeMatchPhase.extraTimeMinutes === minutes
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {minutes}'
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {safeMatchPhase.phase === 'second_half' && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              {!safeMatchPhase.isPaused ? (
                <button
                  onClick={() => onPause(match.id)}
                  className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-colors text-sm"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={() => onResume(match.id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  ▶️ Reprendre
                </button>
              )}
              <button
                onClick={() => onEndSecondHalf(match.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors text-sm"
              >
                🔚 Fin du match
              </button>
            </div>
            
            {/* Option pour ajouter du temps additionnel */}
            {safeMatchPhase.extraTimeMinutes > 0 && (
              <button
                onClick={() => onStartExtraTime(match.id)}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors text-sm"
              >
                ⏰ Ajouter {safeMatchPhase.extraTimeMinutes} min de temps additionnel
              </button>
            )}
          </div>
        )}

        {safeMatchPhase.phase === 'extra_time' && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              {!safeMatchPhase.isPaused ? (
                <button
                  onClick={() => onPause(match.id)}
                  className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-colors text-sm"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={() => onResume(match.id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  ▶️ Reprendre
                </button>
              )}
              <button
                onClick={() => onEndExtraTime(match.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors text-sm"
              >
                🔚 Terminer le match
              </button>
            </div>
          </div>
        )}

        {safeMatchPhase.phase === 'finished' && (
          <div className="text-center text-gray-500 text-sm">
            Match terminé
          </div>
        )}
      </div>

      {/* Statistiques du temps */}
      {(safeMatchPhase.phase === 'first_half' || safeMatchPhase.phase === 'second_half' || safeMatchPhase.phase === 'extra_time') && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">1ère mi-temps:</span>
              <span className="ml-1">{getPhaseElapsedTime(match.id, 'first_half')}'</span>
            </div>
            <div>
              <span className="font-medium">2ème mi-temps:</span>
              <span className="ml-1">{getPhaseElapsedTime(match.id, 'second_half')}'</span>
            </div>
            {safeMatchPhase.phase === 'extra_time' && (
              <div className="col-span-2">
                <span className="font-medium">Temps additionnel:</span>
                <span className="ml-1">{getPhaseElapsedTime(match.id, 'extra_time')}'</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchTimeControl; 