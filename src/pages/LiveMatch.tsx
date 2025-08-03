import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { liveMatchService, LiveMatchState, MatchEvent } from '../services/websocket';
import { 
  Play, 
  Pause, 
  Square, 
  Trophy, 
  Users, 
  Clock, 
  Target,
  Zap,
  Award,
  Flag,
  User,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { Match, Team, Player } from '../types';



interface LiveMatchProps {
  matchId: string;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matchId }) => {
  const { user } = useAuth();
  const { matches, teams, players } = useData();
  
  // État du match en direct
  const [liveState, setLiveState] = useState<LiveMatchState | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [eventType, setEventType] = useState<'goal' | 'yellow_card' | 'red_card' | 'substitution'>('goal');
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  const match = matches.find(m => m.id === matchId);
  const homeTeam = teams.find(t => t.id === match?.homeTeam);
  const awayTeam = teams.find(t => t.id === match?.awayTeam);
  const homePlayers = players.filter(p => p.teamId === match?.homeTeam);
  const awayPlayers = players.filter(p => p.teamId === match?.awayTeam);

  // Initialiser le match et s'abonner aux mises à jour
  useEffect(() => {
    if (match) {
      // Initialiser le match s'il n'existe pas encore
      const currentState = liveMatchService.getState(matchId);
      if (!currentState) {
        liveMatchService.initializeMatch(matchId, match.homeScore || 0, match.awayScore || 0);
      }

      // S'abonner aux mises à jour
      const unsubscribe = liveMatchService.subscribe(matchId, (state) => {
        setLiveState(state);
      });

      return unsubscribe;
    }
  }, [matchId, match]);

  // Timer automatique quand le match est en cours
  useEffect(() => {
    let interval: number;
    if (liveState?.isLive && !liveState?.isPaused) {
      interval = setInterval(() => {
        liveMatchService.updateMatchTime(matchId, (liveState?.matchTime || 0) + 1);
      }, 1000) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [liveState?.isLive, liveState?.isPaused, matchId]);

  const formatMatchTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getMatchPhase = (time: number) => {
    if (time <= 45) return 'Première mi-temps';
    if (time <= 90) return 'Deuxième mi-temps';
    if (time <= 105) return 'Prolongations 1ère mi-temps';
    if (time <= 120) return 'Prolongations 2ème mi-temps';
    return 'Tirs au but';
  };

  const handleStartMatch = async () => {
    await liveMatchService.startMatch(matchId);
  };

  const handlePauseResume = async () => {
    await liveMatchService.togglePause(matchId);
  };

  const handleEndMatch = async () => {
    await liveMatchService.endMatch(matchId);
  };

  const addMatchEvent = async () => {
    if (!selectedPlayer) return;

    const player = players.find(p => p.id === selectedPlayer);
    const teamName = selectedTeam === 'home' ? homeTeam?.name : awayTeam?.name;
    
    const event: MatchEvent = {
      id: Date.now().toString(),
      type: eventType,
      minute: Math.floor((liveState?.matchTime || 0) / 60),
      playerId: selectedPlayer,
      playerName: player?.name,
      team: selectedTeam,
      description: `${eventType === 'goal' ? '🥅 But' : eventType === 'yellow_card' ? '🟨 Carton jaune' : eventType === 'red_card' ? '🟥 Carton rouge' : '🔄 Remplacement'} - ${player?.name} (${teamName})`,
      timestamp: new Date(),
      matchId
    };

    await liveMatchService.addEvent(matchId, event);
    setSelectedPlayer('');
    
    console.log('Événement ajouté:', event);
  };

  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'goal': return '🥅';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'substitution': return '🔄';
      default: return '📝';
    }
  };

  const getEventColor = (type: string): string => {
    switch (type) {
      case 'goal': return 'bg-green-500';
      case 'yellow_card': return 'bg-yellow-500';
      case 'red_card': return 'bg-red-500';
      case 'substitution': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600">Match non trouvé</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header du match */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Zap size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Match en Direct
                </h1>
                <p className="text-gray-600 mt-1">
                  {homeTeam?.name} vs {awayTeam?.name}
                </p>
              </div>
            </div>
            
            {/* Statut du match */}
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                liveState?.isLive ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
              }`}>
                {liveState?.isLive ? 'EN DIRECT' : 'EN ATTENTE'}
              </div>
              {liveState?.isPaused && (
                <div className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium">
                  PAUSE
                </div>
              )}
            </div>
          </div>

          {/* Score et temps */}
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Équipe domicile */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">{homeTeam?.name}</div>
                              <div className="text-4xl font-bold text-gray-900">{liveState?.homeScore || match.homeScore || 0}</div>
            </div>
            
            {/* Temps et phase */}
            <div className="text-center">
              <div className="text-6xl font-bold text-red-600 mb-2">
                {formatMatchTime(liveState?.matchTime || 0)}
              </div>
              <div className="text-sm text-gray-600">{getMatchPhase(liveState?.matchTime || 0)}</div>
            </div>
            
            {/* Équipe visiteur */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">{awayTeam?.name}</div>
                              <div className="text-4xl font-bold text-gray-900">{liveState?.awayScore || match.awayScore || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Admin */}
      {user?.role === 'admin' && (
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target size={24} className="mr-2" />
              Contrôle Admin
            </h2>
            
            {/* Contrôles du match */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Démarrage/Pause/Fin */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Contrôle du Match</h3>
                <div className="flex space-x-2">
                  {!liveState?.isLive ? (
                    <button
                      onClick={handleStartMatch}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      <Play size={16} className="mr-2" />
                      Démarrer
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handlePauseResume}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                      >
                        {liveState?.isPaused ? <Play size={16} className="mr-2" /> : <Pause size={16} className="mr-2" />}
                        {liveState?.isPaused ? 'Reprendre' : 'Pause'}
                      </button>
                      <button
                        onClick={handleEndMatch}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        <Square size={16} className="mr-2" />
                        Terminer
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Contrôle du temps */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Contrôle du Temps</h3>
                <div className="flex space-x-2">
                                     <button
                     onClick={async () => await liveMatchService.updateMatchTime(matchId, Math.max(0, (liveState?.matchTime || 0) - 30))}
                     className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
                   >
                     -30s
                   </button>
                   <button
                     onClick={async () => await liveMatchService.updateMatchTime(matchId, Math.max(0, (liveState?.matchTime || 0) - 1))}
                     className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
                   >
                     -1s
                   </button>
                   <button
                     onClick={async () => await liveMatchService.updateMatchTime(matchId, (liveState?.matchTime || 0) + 1)}
                     className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
                   >
                     +1s
                   </button>
                   <button
                     onClick={async () => await liveMatchService.updateMatchTime(matchId, (liveState?.matchTime || 0) + 30)}
                     className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
                   >
                     +30s
                   </button>
                </div>
              </div>

              {/* Phases prédéfinies */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Phases</h3>
                                 <div className="grid grid-cols-2 gap-2">
                   <button
                     onClick={async () => await liveMatchService.updateMatchTime(matchId, 45 * 60)}
                     className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600"
                   >
                     Mi-temps
                   </button>
                   <button
                     onClick={async () => await liveMatchService.updateMatchTime(matchId, 90 * 60)}
                     className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-600"
                   >
                     Fin 90'
                   </button>
                 </div>
              </div>
            </div>

            {/* Ajout d'événements */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Ajouter un Événement</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Type d'événement */}
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="goal">🥅 But</option>
                  <option value="yellow_card">🟨 Carton jaune</option>
                  <option value="red_card">🟥 Carton rouge</option>
                  <option value="substitution">🔄 Remplacement</option>
                </select>

                {/* Équipe */}
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="home">{homeTeam?.name}</option>
                  <option value="away">{awayTeam?.name}</option>
                </select>

                {/* Joueur */}
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un joueur</option>
                  {(selectedTeam === 'home' ? homePlayers : awayPlayers).map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>

                {/* Bouton d'ajout */}
                                 <button
                   onClick={async () => await addMatchEvent()}
                   disabled={!selectedPlayer}
                   className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                 >
                   Ajouter
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interface User (lecture seule) */}
      {user?.role !== 'admin' && (
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users size={24} className="mr-2" />
              Vue Spectateur
            </h2>
            
            {/* Statistiques en direct */}
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
               <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
                 <div className="text-2xl font-bold">{liveState?.events.filter(e => e.type === 'goal').length || 0}</div>
                 <div className="text-sm">Buts</div>
               </div>
               <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
                 <div className="text-2xl font-bold">{liveState?.events.filter(e => e.type === 'yellow_card').length || 0}</div>
                 <div className="text-sm">Cartons Jaunes</div>
               </div>
               <div className="bg-red-500 text-white p-4 rounded-lg text-center">
                 <div className="text-2xl font-bold">{liveState?.events.filter(e => e.type === 'red_card').length || 0}</div>
                 <div className="text-sm">Cartons Rouges</div>
               </div>
               <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
                 <div className="text-2xl font-bold">{liveState?.events.filter(e => e.type === 'substitution').length || 0}</div>
                 <div className="text-sm">Remplacements</div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Liste des événements */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Award size={24} className="mr-2" />
          Événements du Match
        </h2>
        
                 {!liveState?.events || liveState.events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Flag size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucun événement pour le moment</p>
          </div>
        ) : (
                     <div className="space-y-3">
             {liveState?.events.map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-between p-4 rounded-lg ${getEventColor(event.type)} text-white`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getEventIcon(event.type)}</span>
                  <div>
                    <div className="font-medium">{event.description}</div>
                    <div className="text-sm opacity-90">
                      {event.minute}' - {event.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                                 {user?.role === 'admin' && (
                   <button
                     onClick={() => {
                       const newEvents = liveState?.events.filter(e => e.id !== event.id) || [];
                       liveMatchService.emit(matchId, { ...liveState!, events: newEvents });
                     }}
                     className="text-white hover:text-red-200 transition-colors"
                   >
                     <X size={16} />
                   </button>
                 )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatch; 