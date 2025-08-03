import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const DebugData: React.FC = () => {
  const { tournaments, teams, players, matches, isLoading, error } = useData();
  const { user, token } = useAuth();

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border max-w-md z-50">
      <h3 className="text-lg font-bold mb-2">🔍 Debug Data</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>User:</strong> {user?.name} ({user?.role})
        </div>
        <div>
          <strong>Token:</strong> {token ? '✅ Présent' : '❌ Absent'}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? '⏳ Chargement...' : '✅ Terminé'}
        </div>
        {error && (
          <div className="text-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="border-t pt-2 mt-2">
          <strong>Données:</strong>
          <div>🏆 Tournois: {tournaments.length}</div>
          <div>⚽ Équipes: {teams.length}</div>
          <div>👤 Joueurs: {players.length}</div>
          <div>🎮 Matchs: {matches.length}</div>
        </div>
        
        {tournaments.length > 0 && (
          <div className="border-t pt-2 mt-2">
            <strong>Premier tournoi:</strong>
            <div>Nom: {tournaments[0].name}</div>
            <div>Status: {tournaments[0].status}</div>
          </div>
        )}
        
        {teams.length > 0 && (
          <div className="border-t pt-2 mt-2">
            <strong>Première équipe:</strong>
            <div>Nom: {teams[0].name}</div>
            <div>Coach: {teams[0].coach}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugData; 