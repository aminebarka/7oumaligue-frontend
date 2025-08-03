import React from 'react';

interface TournamentCardProps {
  tournament: any;
  user: any;
  t: any;
  isRTL: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onDrawClick: () => void;
  onManageClick: () => void;
  onDelete: (id: string) => void;
  onDetails: () => void;
  onShowPlayers: () => void;
  onManage: () => void;
}

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR');
};

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  user,
  t,
  isRTL,
  canEdit = true,
  canDelete = true,
  onDrawClick,
  onManageClick,
  onDelete,
  onDetails,
  onShowPlayers,
  onManage
}) => {
  return (
    <div className="rounded-2xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
      {/* Header with tournament logo */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Tournament Logo */}
          {tournament.logo && tournament.logo.startsWith('data:image') ? (
            <img
              src={tournament.logo}
              alt="Tournament logo"
              className="w-16 h-16 object-cover rounded-xl shadow-lg border-2 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/20">
              {tournament.logo || '🏆'}
            </div>
          )}
          
          <div className="flex flex-col">
            <h3 className="font-bold text-xl text-white drop-shadow-sm">{tournament.name}</h3>
            {tournament.startDate && tournament.endDate && (
              <span className="text-white/90 text-sm font-medium">
                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {tournament.isFavorite && (
            <span className="text-yellow-300 text-2xl drop-shadow-sm">⭐</span>
          )}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            tournament.status === 'active' 
              ? 'bg-green-500 text-white shadow-sm' 
              : 'bg-gray-500 text-white shadow-sm'
          }`}>
            {tournament.status === 'active' ? 'En cours' : 'Terminé'}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Tournament Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{tournament.teams?.length || 0}</div>
              <div className="text-xs text-blue-600 font-medium">Équipes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tournament.drawCompleted ? '✓' : '⏳'}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {tournament.drawCompleted ? 'Tirage fait' : 'Tirage à faire'}
              </div>
            </div>
          </div>

          {/* Tournament Details */}
          <div className="space-y-3">
            {tournament.prize && (
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">💰</span>
                <span className="font-medium">Prix: {tournament.prize}</span>
              </div>
            )}
            
            {tournament.stadium && (
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">🏟️</span>
                <span className="font-medium">Stade: {tournament.stadium}</span>
              </div>
            )}
            
            {tournament.rules && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Règles:</span> {tournament.rules}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" 
            onClick={onDetails}
          >
            👁️ Détails
          </button>
          <button 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" 
            onClick={onShowPlayers}
          >
            👥 Joueurs
          </button>
          
          {canEdit && (
            <button 
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" 
              onClick={onManage}
            >
              ⚙️ Gérer
            </button>
          )}
          
          {canDelete && (
            <button 
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" 
              onClick={() => onDelete(tournament.id)}
            >
              🗑️ Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
