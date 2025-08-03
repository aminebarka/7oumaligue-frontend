import React, { useState, useEffect } from 'react';
import { X, Plus, Users, Calendar, Shuffle, Settings, Award, Edit, Trash2 } from 'lucide-react';
import { Tournament, Team, Player, Match, Group, GroupTeam } from '../../types';
import GroupStandings from './GroupStandings';
import PlayerFormModal from './PlayerFormModal';
import TeamFormModal from './TeamFormModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

interface ManageTournamentModalProps {
  show: boolean;
  onClose: () => void;
  tournament: Tournament;
  teams: Team[];
  players: Player[];
  matches: Match[];
  groups: Group[];
  onAddTeam: (teamId: string) => void;
  onRemoveTeam: (teamId: string) => void;
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
  onAddMatch: (match: Match) => void;
  onPerformDraw: (numberOfGroups: number) => void;
  onUpdateGroup: (group: Group) => void;
  onUpdateGroups: (groups: Group[]) => void;
  onGenerateMatches: (matchTime: string) => void;
  onUpdateTournament: (tournament: Tournament) => void;
  onCreateTeam: (team: Partial<Team>) => void;
  onRefreshData?: () => void;
  onUpdateMatchScore?: (matchId: string, homeScore: number, awayScore: number) => void;
}

const ManageTournamentModal: React.FC<ManageTournamentModalProps> = ({
  show,
  onClose,
  tournament,
  teams,
  players,
  matches,
  groups,
  onAddTeam,
  onRemoveTeam,
  onAddPlayer,
  onUpdatePlayer,
  onRemovePlayer,
  onAddMatch,
  onPerformDraw,
  onUpdateGroup,
  onUpdateGroups,
  onGenerateMatches,
  onUpdateTournament,
  onCreateTeam,
  onRefreshData,
  onUpdateMatchScore
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'teams' | 'players' | 'groups' | 'matches' | 'settings'>('teams');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showTeamFormModal, setShowTeamFormModal] = useState(false);
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: '',
    logo: '⚽',
    coach: '',
    players: [],
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    goalsAgainst: 0,
    matches: 0,
    createdAt: new Date().toISOString(),
    averageLevel: 3,
    playerLevels: {}
  });
  const [numberOfGroups, setNumberOfGroups] = useState(tournament.numberOfGroups || 4);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [matchTime, setMatchTime] = useState("15:00");
  const [tournamentSettings, setTournamentSettings] = useState({
    name: tournament.name,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    prize: tournament.prize || "",
    stadium: tournament.stadium || ""
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [editingScores, setEditingScores] = useState<{ homeScore: number; awayScore: number }>({ homeScore: 0, awayScore: 0 });
  const [matchStartTimes, setMatchStartTimes] = useState<{ [key: string]: Date }>({});
  
  const tournamentTeams = teams.filter(team => {
    if (!Array.isArray(tournament.tournamentTeams)) return false;
    // t est TournamentTeam avec structure { teamId, team: { id, name, ... } }
    return (Array.isArray(tournament.tournamentTeams) ? tournament.tournamentTeams : []).some((t: any) => t.team?.id === team.id || t.teamId === team.id);
  });
  
  const availableTeams = teams.filter(team => {
    if (!Array.isArray(tournament.tournamentTeams)) return true;
    // t est TournamentTeam avec structure { teamId, team: { id, name, ... } }
    return !(Array.isArray(tournament.tournamentTeams) ? tournament.tournamentTeams : []).some((t: any) => t.team?.id === team.id || t.teamId === team.id);
  });
  
  const teamIds = (Array.isArray(tournament.tournamentTeams) ? (tournament.tournamentTeams as any[]).map(t => t.team?.id || t.teamId) : []);
  
  // Filtrer les joueurs des équipes du tournoi
  const tournamentPlayers = Array.isArray(players) ? players : [];

  // Debug: afficher les informations pour diagnostiquer
  console.log('Debug ManageTournamentModal:');
  console.log('- tournament:', tournament);
  console.log('- tournament.tournamentTeams:', tournament.tournamentTeams);
  console.log('- teamIds:', teamIds);
  console.log('- players:', players);
  console.log('- tournamentPlayers:', tournamentPlayers);
  console.log('- Nombre total de joueurs:', players.length);
  console.log('- Nombre de joueurs du tournoi:', tournamentPlayers.length);
  console.log('- availableTeams:', availableTeams);
  console.log('- tournamentTeams:', tournamentTeams);
  console.log('- Nombre d\'équipes disponibles:', availableTeams.length);
  
  // Debug détaillé du filtrage
  console.log('Debug filtrage des équipes:');
  teams.forEach(team => {
    const isInTournament = Array.isArray(tournament.tournamentTeams) ? (tournament.tournamentTeams as any[]).some(t => t.team?.id === team.id || t.teamId === team.id) : false;
    console.log(`- Équipe ${team.name} (${team.id}): dans le tournoi = ${isInTournament}`);
  });
  
  // Debug de la structure de tournament.tournamentTeams
  console.log('Debug structure tournament.tournamentTeams:');
  if (Array.isArray(tournament.tournamentTeams)) {
    (Array.isArray(tournament.tournamentTeams) ? tournament.tournamentTeams : []).forEach((team, index) => {
      console.log(`  [${index}] team:`, team);
    });
  } else {
    console.log('  tournament.tournamentTeams n\'est pas un tableau:', tournament.tournamentTeams);
  }

  useEffect(() => {
    if (tournament.drawCompleted && !groups.length && tournamentTeams.length > 0) {
      onPerformDraw(numberOfGroups);
    }
  }, [tournament.drawCompleted, groups]);

  // Générer automatiquement les matchs après le tirage au sort
  useEffect(() => {
    if (tournament.drawCompleted && groups.length > 0 && matches.length === 0) {
      console.log('Génération automatique des matchs après tirage au sort...');
      onGenerateMatches("15:00");
    }
  }, [tournament.drawCompleted, groups.length, matches.length, onGenerateMatches]);

  // Mettre à jour le temps écoulé toutes les secondes pour les matchs en direct
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render pour mettre à jour le temps écoulé
      setMatchStartTimes(prev => ({ ...prev }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDraw = () => {
    onPerformDraw(numberOfGroups);
    setShowDrawModal(false);
  };

  const updateGroupName = (groupId: string, newName: string) => {
    const updatedGroups = groups.map(group => 
      group.id === groupId ? { ...group, name: newName } : group
    );
    onUpdateGroups(updatedGroups);
  };

  const moveTeamToGroup = (teamId: string, fromGroupId: string, toGroupId: string) => {
    const updatedGroups = [...groups];
    
    // Remove team from current group
    const fromGroupIndex = updatedGroups.findIndex(g => g.id === fromGroupId);
    if (fromGroupIndex !== -1) {
      updatedGroups[fromGroupIndex].groupTeams = 
        (updatedGroups[fromGroupIndex].groupTeams || []).filter(gt => gt.teamId !== teamId);
    }
    
    // Add team to new group
    const toGroupIndex = updatedGroups.findIndex(g => g.id === toGroupId);
    if (toGroupIndex !== -1) {
      if (!updatedGroups[toGroupIndex].groupTeams) {
        updatedGroups[toGroupIndex].groupTeams = [];
      }
      updatedGroups[toGroupIndex].groupTeams.push({
        id: `gt-${Date.now()}`,
        groupId: toGroupId,
        teamId,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0
      });
    }
    
    onUpdateGroups(updatedGroups);
  };

  const saveTournamentSettings = () => {
    onUpdateTournament({
      ...tournament,
      name: tournamentSettings.name,
      startDate: tournamentSettings.startDate,
      endDate: tournamentSettings.endDate,
      prize: tournamentSettings.prize,
      stadium: tournamentSettings.stadium
    });
  };

  const startEditingScore = (match: Match) => {
    setEditingMatch(match.id);
    setEditingScores({ homeScore: match.homeScore, awayScore: match.awayScore });
  };

  const saveScore = async (matchId: string) => {
    if (onUpdateMatchScore) {
      try {
        await onUpdateMatchScore(matchId, editingScores.homeScore, editingScores.awayScore);
        setEditingMatch(null);
        console.log('Score mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du score:', error);
      }
    }
  };

  const cancelEditingScore = () => {
    setEditingMatch(null);
  };

  const changeMatchStatus = (match: Match, newStatus: 'scheduled' | 'live' | 'completed') => {
    // Mettre à jour le statut du match
    const updatedMatch = { ...match, status: newStatus };
    
    // Si le match passe en direct, enregistrer l'heure de début
    if (newStatus === 'live') {
      setMatchStartTimes(prev => ({ ...prev, [match.id]: new Date() }));
    }
    
    onAddMatch(updatedMatch);
  };

  const getElapsedTime = (matchId: string) => {
    const startTime = matchStartTimes[matchId];
    if (!startTime) return null;
    
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60); // en minutes
    return `${elapsed}'`;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            {tournament.logo && tournament.logo.startsWith('data:image') ? (
              <img
                src={tournament.logo}
                alt="Tournament logo"
                className="w-16 h-16 mr-4 object-contain rounded-lg shadow-md"
              />
            ) : (
              <span className="text-4xl mr-4">{tournament.logo}</span>
            )}
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{tournament.name}</span>
              <span className="text-sm text-gray-500 font-medium">
                {tournament.startDate && tournament.endDate && (
                  `${new Date(tournament.startDate).toLocaleDateString('fr-FR')} - ${new Date(tournament.endDate).toLocaleDateString('fr-FR')}`
                )}
              </span>
            </div>
          </h2>
          <div className="flex items-center space-x-4">
            {/* Informations du tournoi */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{tournamentTeams.length}</div>
                <div className="text-xs text-gray-500">Équipes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{tournamentPlayers.length}</div>
                <div className="text-xs text-gray-500">Joueurs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{matches.length}</div>
                <div className="text-xs text-gray-500">Matchs</div>
              </div>
              {tournament.drawCompleted && (groups.length > 0 || tournament.groups?.length > 0) && (
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Shuffle size={14} className="text-blue-500" />
                  <span className="text-sm text-blue-600 font-medium">
                    {groups.length || tournament.groups?.length || 0} groupes
                  </span>
                </div>
              )}
            </div>
            
            {/* Boutons d'action */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  console.log('Rechargement manuel des données...');
                  if (onRefreshData) {
                    onRefreshData();
                  }
                }}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Actualiser les données"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex border-b mb-6 bg-gray-50 rounded-lg p-1">
          <button
            className={`px-4 py-3 font-medium flex items-center rounded-md transition-all duration-200 ${
              activeTab === 'teams' 
                ? 'bg-white text-green-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('teams')}
          >
            <Users size={18} className="mr-2" />
            Équipes
          </button>
          <button
            className={`px-4 py-3 font-medium flex items-center rounded-md transition-all duration-200 ${
              activeTab === 'players' 
                ? 'bg-white text-green-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('players')}
          >
            <Users size={18} className="mr-2" />
            Joueurs
          </button>
          <button
            className={`px-4 py-3 font-medium flex items-center rounded-md transition-all duration-200 ${
              activeTab === 'groups' 
                ? 'bg-white text-green-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('groups')}
          >
            <Shuffle size={18} className="mr-2" />
            Groupes
          </button>
          <button
            className={`px-4 py-3 font-medium flex items-center rounded-md transition-all duration-200 ${
              activeTab === 'matches' 
                ? 'bg-white text-green-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            <Calendar size={18} className="mr-2" />
            Matchs
          </button>
          <button
            className={`px-4 py-3 font-medium flex items-center rounded-md transition-all duration-200 ${
              activeTab === 'settings' 
                ? 'bg-white text-green-600 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} className="mr-2" />
            Paramètres
          </button>
        </div>

        {activeTab === 'teams' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Équipes participantes ({tournamentTeams.length})
                </h3>
                {!tournament.drawCompleted && tournamentTeams.length > 0 && (
                  <button
                    onClick={() => setShowDrawModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Shuffle size={16} className="mr-2" />
                    Effectuer le tirage
                  </button>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                {(tournamentTeams || []).map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{team.logo}</span>
                      <div>
                        <div className="font-medium text-gray-900">{team.name}</div>
                        <div className="text-sm text-gray-600">
                          {team.players.length} joueurs
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTeam(team)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Voir les détails"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => onRemoveTeam(team.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {availableTeams.length > 0 && (
                <>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Ajouter une équipe au tournoi
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(availableTeams || []).map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{team.logo}</span>
                          <div>
                            <div className="font-medium text-gray-900">{team.name}</div>
                            <div className="text-sm text-gray-600">
                              {team.players.length} joueurs
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Vérification supplémentaire avant l'ajout
                            console.log('Tentative d\'ajout d\'équipe:', team.name, team.id);
                            console.log('Équipes dans le tournoi:', (Array.isArray(tournament.tournamentTeams) ? tournament.tournamentTeams : []).map(t => ({ id: t.teamId, name: t.team?.name })));
                            
                            const isAlreadyInTournament = (Array.isArray(tournament.tournamentTeams) ? tournament.tournamentTeams : []).some(t => t.team?.id === team.id || t.teamId === team.id);
                            console.log('Équipe déjà dans le tournoi?', isAlreadyInTournament);
                            
                            if (isAlreadyInTournament) {
                              console.log('Équipe déjà inscrite - arrêt de l\'ajout');
                              alert('Cette équipe est déjà inscrite au tournoi');
                              return;
                            }
                            
                            console.log('Ajout de l\'équipe autorisé');
                            onAddTeam(team.id);
                          }}
                          className="text-green-600 hover:text-green-800 p-2"
                          title="Ajouter"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowTeamFormModal(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Créer une nouvelle équipe
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Groupes du tournoi
              </h3>
              
                             {/* Informations de débogage (discrètes) */}
               <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                 <div className="flex items-center justify-between">
                   <span className="font-medium">État du tournoi:</span>
                   <div className="flex space-x-4">
                     <span>Équipes: {tournamentTeams.length}</span>
                     <span>Groupes: {groups.length}</span>
                     <span>Tirage: {tournament.drawCompleted ? '✓' : '✗'}</span>
                   </div>
                 </div>
               </div>
              
              {(groups && groups.length > 0) || (tournament.groups && tournament.groups.length > 0) ? (
                groups.map(group => (
                  <div key={group.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">{group.name}</h4>
                      <button 
                        onClick={() => setEditingGroup(group)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                    <ul>
                      {group.groupTeams?.map(groupTeam => {
                        const team = teams.find(t => t.id === groupTeam.teamId);
                        return (
                          <li key={groupTeam.id || groupTeam.teamId} className="flex items-center py-1">
                            <span className="text-xl mr-2">{team?.logo}</span>
                            {team?.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {tournament.drawCompleted ? 
                    'Aucun groupe créé' : 
                    'Tirage au sort non effectué'
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Joueurs ({tournamentPlayers.length})
              </h3>
              <button
                onClick={() => setSelectedPlayer({
                  id: '',
                  name: '',
                  position: 'Milieu',
                  level: 3,
                  age: 25,
                  teamId: teamIds.length > 0 ? teamIds[0] : ''
                })}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Ajouter un joueur
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(tournamentPlayers || []).map((player, idx) => (
                <div key={player.id || idx} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{player.name}</h4>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedPlayer(player)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onRemovePlayer(player.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm">
                      <span className="font-medium">Équipe: </span>
                      {teams.find(t => t.id === player.teamId)?.name || 'Aucune équipe'}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Poste: </span>
                      {player.position}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Niveau: </span>
                      {'⭐'.repeat(player.level)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Âge: </span>
                      {player.age}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Groupes du tournoi
              </h3>
              {groups && groups.length > 0 && (
                <div className="flex items-center">
                  <span className="mr-2">Heure des matchs:</span>
                  <input
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="mr-3 p-1 border rounded"
                  />
                  <button
                    onClick={() => onGenerateMatches(matchTime)}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center"
                  >
                    <Calendar size={16} className="mr-1" />
                    Générer les matchs
                  </button>
                </div>
              )}
            </div>
            
            {groups && groups.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {(groups || []).map(group => (
                    <div key={group.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        {editingGroup?.id === group.id ? (
                          <input
                            type="text"
                            value={editingGroup.name}
                            onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                            onBlur={() => {
                              updateGroupName(group.id, editingGroup.name);
                              setEditingGroup(null);
                            }}
                            className="text-lg font-bold border-b border-gray-500 w-full"
                            autoFocus
                          />
                        ) : (
                          <h4 
                            className="text-lg font-bold cursor-pointer"
                            onClick={() => setEditingGroup(group)}
                          >
                            {group.name} <Edit size={14} className="inline ml-2" />
                          </h4>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Équipes dans ce groupe:
                        </label>
                        <ul className="space-y-2">
                          {group.groupTeams?.map((groupTeam, idx) => (
                            <li key={groupTeam.id || idx} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center">
                                <span className="text-xl mr-2">{teams.find(t => t.id === groupTeam.teamId)?.logo}</span>
                                <span>{teams.find(t => t.id === groupTeam.teamId)?.name}</span>
                              </div>
                              <div className="flex space-x-1">
                                {groups.filter(g => g.id !== group.id).map(otherGroup => (
                                  <button
                                    key={otherGroup.id}
                                    onClick={() => moveTeamToGroup(groupTeam.teamId, group.id, otherGroup.id)}
                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                                    title={`Déplacer vers ${otherGroup.name}`}
                                  >
                                    {otherGroup.name.charAt(otherGroup.name.length - 1)}
                                  </button>
                                ))}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Classements des groupes
                  </h3>
                  <div className="space-y-6">
                    {(groups || []).map(group => (
                      <GroupStandings 
                        key={group.id} 
                        group={group} 
                        teams={teams} 
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun groupe créé. Effectuez d'abord le tirage au sort dans l'onglet Équipes.
              </div>
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Matchs du tournoi
              </h3>
              {matches.length === 0 && groups.length > 0 && (
                <button
                  onClick={() => onGenerateMatches(matchTime)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Calendar size={16} className="mr-2" />
                  Générer les matchs
                </button>
              )}
            </div>
            
            {matches.length > 0 ? (
              <div className="space-y-4">
                {(matches || []).map(match => {
                  const homeTeam = teams.find(t => t.id === match.homeTeam);
                  const awayTeam = teams.find(t => t.id === match.awayTeam);
                  
                  return (
                    <div key={match.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {new Date(match.date).toLocaleDateString()} - {match.time}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            match.status === 'live' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {match.status === 'scheduled' ? 'Programmé' :
                            match.status === 'live' ? 'En direct' :
                            'Terminé'}
                          </span>
                          {match.status === 'live' && (
                            <span className="text-xs text-red-600 font-bold flex items-center">
                              <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                              {getElapsedTime(match.id) || "0'"}
                            </span>
                          )}
                          <select
                            value={match.status}
                            onChange={(e) => changeMatchStatus(match, e.target.value as 'scheduled' | 'live' | 'completed')}
                            className="text-xs border border-gray-300 rounded px-1 py-1"
                          >
                            <option value="scheduled">Programmé</option>
                            <option value="live">En direct</option>
                            <option value="completed">Terminé</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{homeTeam?.logo}</span>
                          <span>{homeTeam?.name}</span>
                        </div>
                        
                        <div className="text-xl font-bold mx-4 flex items-center space-x-2">
                          {editingMatch === match.id ? (
                            <>
                              <input
                                type="number"
                                min="0"
                                value={editingScores.homeScore}
                                onChange={(e) => setEditingScores({...editingScores, homeScore: parseInt(e.target.value, 10) || 0})}
                                className="w-16 text-center border border-gray-300 rounded-md px-2 py-1"
                              />
                              <span>-</span>
                              <input
                                type="number"
                                min="0"
                                value={editingScores.awayScore}
                                onChange={(e) => setEditingScores({...editingScores, awayScore: parseInt(e.target.value, 10) || 0})}
                                className="w-16 text-center border border-gray-300 rounded-md px-2 py-1"
                              />
                              <div className="flex space-x-1 ml-2">
                                <button
                                  onClick={() => saveScore(match.id)}
                                  className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={cancelEditingScore}
                                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                >
                                  ✕
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span>{match.homeScore} - {match.awayScore}</span>
                              <button
                                onClick={() => startEditingScore(match)}
                                className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                title="Modifier le score"
                              >
                                ✏️
                              </button>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <span>{awayTeam?.name}</span>
                          <span className="text-xl ml-2">{awayTeam?.logo}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Groupe: </span>
                        {
                          (() => {
                            // Try to find the group name from the group id if available
                            const group = groups.find(g => g.id === match.groupId);
                            return group ? group.name : 'N/A';
                          })()
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Lieu: </span>
                        {match.venue ? match.venue : 'N/A'}
                      </div>
                      
                      {/* Statistiques du match */}
                      {match.status === 'live' || match.status === 'completed' ? (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div className="text-center">
                              <div className="font-medium text-gray-700">Tirs</div>
                              <div className="text-lg font-bold text-blue-600">
                                {Math.floor(Math.random() * 10) + 5} - {Math.floor(Math.random() * 10) + 5}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-gray-700">Possession</div>
                              <div className="text-lg font-bold text-green-600">
                                {Math.floor(Math.random() * 30) + 35}% - {Math.floor(Math.random() * 30) + 35}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-gray-700">Corners</div>
                              <div className="text-lg font-bold text-orange-600">
                                {Math.floor(Math.random() * 8) + 2} - {Math.floor(Math.random() * 8) + 2}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : groups.length > 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun match programmé. Cliquez sur "Générer les matchs" pour créer le calendrier.
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Créez d'abord les groupes avant de générer les matchs.
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Paramètres du tournoi
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du tournoi
                </label>
                <input
                  type="text"
                  value={tournamentSettings.name}
                  onChange={(e) => setTournamentSettings({...tournamentSettings, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={tournamentSettings.startDate}
                    onChange={(e) => setTournamentSettings({...tournamentSettings, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={tournamentSettings.endDate}
                    onChange={(e) => setTournamentSettings({...tournamentSettings, endDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <input
                  type="text"
                  value={tournamentSettings.prize}
                  onChange={(e) => setTournamentSettings({...tournamentSettings, prize: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stade
                </label>
                <input
                  type="text"
                  value={tournamentSettings.stadium}
                  onChange={(e) => setTournamentSettings({...tournamentSettings, stadium: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ex: Stade Municipal de Douz"
                />
              </div>
              
              <div className="pt-4">
                <button
                  onClick={saveTournamentSettings}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Modal de tirage au sort */}
      {showDrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Tirage au sort</h3>
              <button onClick={() => setShowDrawModal(false)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de groupes
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 6, 8].map(num => (
                  <button
                    key={num}
                    onClick={() => setNumberOfGroups(num)}
                    className={`py-2 rounded-lg ${
                      numberOfGroups === num 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipes participantes: {tournamentTeams.length}
              </label>
              <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                {(tournamentTeams || []).map(team => {
                  const teamPlayers = players.filter(p => p.teamId === team.id);
                  const averageLevel = teamPlayers.length > 0 
                    ? teamPlayers.reduce((sum, p) => sum + p.level, 0) / teamPlayers.length 
                    : 0;
                  
                  return (
                    <div key={team.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{team.logo}</span>
                        <span>{team.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {teamPlayers.length} joueurs | Niveau: {averageLevel.toFixed(1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDrawModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Annuler
              </button>
              <button 
                onClick={handleDraw}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={tournamentTeams.length < numberOfGroups}
              >
                Effectuer le tirage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout/édition de joueur */}
      {selectedPlayer && (
        <PlayerFormModal
          show={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          player={selectedPlayer}
          setPlayer={setSelectedPlayer}
          onSubmit={async () => {
            if (selectedPlayer.id) {
              await onUpdatePlayer(selectedPlayer);
            } else {
              await onAddPlayer(selectedPlayer);
              // PAS de localStorage ici !
            }
            setSelectedPlayer(null);
            // Optionnel : recharge les joueurs si besoin
            // await loadData();
          }}
          t={t}
          teams={tournamentTeams}
        />
      )}

      {/* Modal de création d'équipe */}
      <TeamFormModal
        show={showTeamFormModal}
        onClose={() => {
          setShowTeamFormModal(false);
          setNewTeam({
            name: '',
            logo: '⚽',
            coach: '',
            players: [],
            wins: 0,
            draws: 0,
            losses: 0,
            goals: 0,
            goalsAgainst: 0,
            matches: 0,
            createdAt: new Date().toISOString(),
            averageLevel: 3,
            playerLevels: {}
          });
        }}
        team={newTeam}
        setTeam={setNewTeam}
        onSubmit={async () => {
          await onCreateTeam(newTeam);
          setShowTeamFormModal(false);
          setNewTeam({
            name: '',
            logo: '⚽',
            coach: '',
            players: [],
            wins: 0,
            draws: 0,
            losses: 0,
            goals: 0,
            goalsAgainst: 0,
            matches: 0,
            createdAt: new Date().toISOString(),
            averageLevel: 3,
            playerLevels: {}
          });
        }}
        t={t}
      />

      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedTeam(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              title="Fermer"
            >
              <X size={24} />
            </button>
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">{selectedTeam.logo}</span>
                             <div>
                 <h2 className="text-2xl font-bold">{selectedTeam.name}</h2>
                 <div className="text-gray-500 text-sm">{players.filter(p => p.teamId === selectedTeam.id).length} joueurs</div>
               </div>
              <button
                className="ml-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                title="Modifier l'équipe"
                // onClick={() => ...} // À implémenter plus tard
              >
                Modifier
              </button>
            </div>
            <hr className="my-4" />
            <h3 className="font-semibold mb-2 text-lg flex items-center">
              <Users className="mr-2 text-blue-500" size={20} /> Joueurs
            </h3>
                         <div className="mb-6">
               {selectedTeam.players && selectedTeam.players.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {players.filter(p => p.teamId === selectedTeam.id).map((player: Player) => (
                     <div key={player.id} className="bg-gray-50 rounded-lg p-3 flex flex-col shadow-sm">
                       <div className="font-medium text-gray-900">{player.name}</div>
                       <div className="text-xs text-gray-500 mb-1">{player.position}</div>
                       <div className="flex items-center space-x-2 text-xs">
                         <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Niveau : {player.level}</span>
                         <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Âge : {player.age}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-gray-400 italic">Aucun joueur dans cette équipe.</div>
               )}
             </div>
            <hr className="my-4" />
            <h3 className="font-semibold mb-2 text-lg flex items-center">
              <Award className="mr-2 text-yellow-500" size={20} /> Statistiques
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
                <span className="text-lg font-bold text-green-700">{selectedTeam.wins}</span>
                <span className="text-xs text-gray-500">Victoires</span>
              </div>
              <div className="bg-red-50 rounded-lg p-3 flex flex-col items-center">
                <span className="text-lg font-bold text-red-700">{selectedTeam.losses}</span>
                <span className="text-xs text-gray-500">Défaites</span>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 flex flex-col items-center">
                <span className="text-lg font-bold text-yellow-700">{selectedTeam.draws}</span>
                <span className="text-xs text-gray-500">Nuls</span>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                <span className="text-lg font-bold text-blue-700">{selectedTeam.goals}</span>
                <span className="text-xs text-gray-500">Buts marqués</span>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 flex flex-col items-center">
                <span className="text-lg font-bold text-purple-700">{selectedTeam.goalsAgainst}</span>
                <span className="text-xs text-gray-500">Buts encaissés</span>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 flex flex-col items-center">
                <span className="text-lg font-bold text-gray-700">{selectedTeam.matches}</span>
                <span className="text-xs text-gray-500">Matchs joués</span>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center col-span-2">
                <span className="text-lg font-bold text-indigo-700">{selectedTeam.averageLevel}</span>
                <span className="text-xs text-gray-500">Niveau moyen</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTournamentModal;