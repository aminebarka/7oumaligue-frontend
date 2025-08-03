import React, { useState } from 'react';
import { Match, Player } from '../types';

interface MatchControlProps {
  match: Match;
  players: Player[];
  onClose: () => void;
  onAddGoal: (matchId: string, team: 'home' | 'away', playerName: string, time: string) => void;
  onAddCard: (matchId: string, team: 'home' | 'away', playerName: string, cardType: 'yellow' | 'red', time: string) => void;
  onAddSubstitution: (matchId: string, team: 'home' | 'away', playerOut: string, playerIn: string, time: string) => void;
  getTeamName: (teamId: string) => string;
  getCurrentMatchTime: (matchId: string) => string;
  events: any[];
}

const MatchControl: React.FC<MatchControlProps> = ({
  match,
  players,
  onClose,
  onAddGoal,
  onAddCard,
  onAddSubstitution,
  getTeamName,
  getCurrentMatchTime,
  events
}) => {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [eventType, setEventType] = useState<'goal' | 'card' | 'substitution'>('goal');
  const [cardType, setCardType] = useState<'yellow' | 'red'>('yellow');
  const [substitutionPlayer, setSubstitutionPlayer] = useState('');

  const homePlayers = players.filter(p => p.teamId === match.homeTeam);
  const awayPlayers = players.filter(p => p.teamId === match.awayTeam);
  const currentPlayers = selectedTeam === 'home' ? homePlayers : awayPlayers;

  const handleAddEvent = () => {
    const currentTime = getCurrentMatchTime(match.id);

    switch (eventType) {
      case 'goal':
        if (selectedPlayer) {
          onAddGoal(match.id, selectedTeam, selectedPlayer, currentTime);
        }
        break;
      case 'card':
        if (selectedPlayer) {
          onAddCard(match.id, selectedTeam, selectedPlayer, cardType, currentTime);
        }
        break;
      case 'substitution':
        if (selectedPlayer && substitutionPlayer) {
          onAddSubstitution(match.id, selectedTeam, selectedPlayer, substitutionPlayer, currentTime);
        }
        break;
    }

    // Reset form
    setSelectedPlayer('');
    setSubstitutionPlayer('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contrôle du Match</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Score actuel */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Score Actuel</h4>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold">{getTeamName(match.homeTeam)}</div>
              <div className="text-4xl font-bold text-green-600">{match.homeScore}</div>
            </div>
            <div className="text-3xl font-bold text-gray-400">-</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{getTeamName(match.awayTeam)}</div>
              <div className="text-4xl font-bold text-green-600">{match.awayScore}</div>
            </div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Temps: {getCurrentMatchTime(match.id)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ajouter un événement */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Ajouter un événement</h4>

            {/* Type d'événement */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Type d'événement</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="goal">⚽ But</option>
                <option value="card">🟨🟥 Carton</option>
                <option value="substitution">🔄 Substitution</option>
              </select>
            </div>

            {/* Équipe */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Équipe</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTeam('home')}
                  className={`px-3 py-1 rounded ${selectedTeam === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {getTeamName(match.homeTeam)}
                </button>
                <button
                  onClick={() => setSelectedTeam('away')}
                  className={`px-3 py-1 rounded ${selectedTeam === 'away' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {getTeamName(match.awayTeam)}
                </button>
              </div>
            </div>

            {/* Joueur */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                {eventType === 'substitution' ? 'Joueur sortant' : 'Joueur'}
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Sélectionner un joueur</option>
                {currentPlayers.map(player => (
                  <option key={player.id} value={player.name}>
                    {player.name} ({player.position})
                  </option>
                ))}
              </select>
            </div>

            {/* Options spécifiques */}
            {eventType === 'card' && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Type de carton</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCardType('yellow')}
                    className={`px-3 py-1 rounded ${cardType === 'yellow' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                  >
                    🟨 Jaune
                  </button>
                  <button
                    onClick={() => setCardType('red')}
                    className={`px-3 py-1 rounded ${cardType === 'red' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                  >
                    🟥 Rouge
                  </button>
                </div>
              </div>
            )}

            {eventType === 'substitution' && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Joueur entrant</label>
                <select
                  value={substitutionPlayer}
                  onChange={(e) => setSubstitutionPlayer(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Sélectionner un joueur</option>
                  {currentPlayers.map(player => (
                    <option key={player.id} value={player.name}>
                      {player.name} ({player.position})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddEvent}
              disabled={!selectedPlayer || (eventType === 'substitution' && !substitutionPlayer)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
            >
              Ajouter l'événement
            </button>
          </div>

          {/* Historique des événements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Historique des événements</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun événement pour le moment</p>
              ) : (
                events.map(event => (
                  <div key={event.id} className="bg-white rounded p-2 text-sm border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{event.time}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.team === 'home' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {event.team === 'home' ? getTeamName(match.homeTeam) : getTeamName(match.awayTeam)}
                      </span>
                    </div>
                    <div className="mt-1">
                      {event.type === 'goal' && (
                        <span className="text-green-600">⚽ But par {event.playerName}</span>
                      )}
                      {event.type === 'card' && (
                        <span className={event.cardType === 'yellow' ? 'text-yellow-600' : 'text-red-600'}>
                          {event.cardType === 'yellow' ? '🟨' : '🟥'} Carton {event.cardType === 'yellow' ? 'jaune' : 'rouge'} pour {event.playerName}
                        </span>
                      )}
                      {event.type === 'substitution' && (
                        <span className="text-blue-600">🔄 {event.playerOut} → {event.playerIn}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchControl; 