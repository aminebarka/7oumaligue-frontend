import React from 'react';
import { Match, Team } from '../types';

interface LiveScoreDisplayProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  currentTime: string;
  matchStatus: string;
  elapsedMinute: number;
  homeScore?: number;
  awayScore?: number;
  events?: any[];
}

const LiveScoreDisplay: React.FC<LiveScoreDisplayProps> = ({
  match,
  homeTeam,
  awayTeam,
  currentTime,
  matchStatus,
  elapsedMinute,
  homeScore,
  awayScore,
  events = []
}) => {
  // Utiliser les props si fournies, sinon utiliser les valeurs du match
  const displayHomeScore = homeScore !== undefined ? homeScore : match.homeScore;
  const displayAwayScore = awayScore !== undefined ? awayScore : match.awayScore;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-2xl">
      <div className="flex items-center justify-between">
        {/* Équipe domicile */}
        <div className="flex items-center space-x-3">
          <div className="text-gray-400 hover:text-yellow-400 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-inner">
              {homeTeam.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-bold text-lg">{homeTeam.name}</div>
          </div>
        </div>

        {/* Score et statut central */}
        <div className="text-center flex-1 mx-8">
          {/* Date et heure */}
          <div className="text-sm text-gray-300 mb-2">
            {new Date(match.date).toLocaleDateString('fr-FR')} {match.time}
          </div>
          
          {/* Score principal */}
          <div className="text-6xl font-black text-pink-500 mb-2 tracking-wider">
            {displayHomeScore} - {displayAwayScore}
          </div>
          
          {/* Statut du match */}
          <div className="text-pink-500 font-semibold text-lg mb-1">
            {matchStatus}
          </div>
          
          {/* Minute écoulée */}
          <div className="text-pink-500 font-bold text-2xl">
            {elapsedMinute}'
          </div>
          {/* Affichage des événements */}
          <div className="mt-4">
            {events.length === 0 ? (
              <div className="text-gray-400 text-sm text-center">Aucun événement pour le moment</div>
            ) : (
              <ul className="space-y-1">
                {events.map(event => (
                  <li key={event.id} className="flex items-center justify-center text-sm">
                    <span className="font-bold text-pink-500 mr-2">{event.time}'</span>
                    {event.type === 'goal' && (
                      <span className="text-green-600 font-semibold">⚽ {event.playerName} ({event.team === 'home' ? '🏠' : '🚩'})</span>
                    )}
                    {event.type === 'card' && (
                      <span className={event.cardType === 'yellow' ? 'text-yellow-600' : 'text-red-600'}>
                        {event.cardType === 'yellow' ? '🟨' : '🟥'} {event.playerName}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Équipe visiteur */}
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className="font-bold text-lg">{awayTeam.name}</div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-inner">
              {awayTeam.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="text-gray-400 hover:text-yellow-400 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScoreDisplay; 