import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  Users, 
  Edit, 
  Play, 
  Square,
  CheckCircle, 
  ChevronRight, 
  Award, 
  Target,
  Zap,
  Star,
  TrendingUp,
  CalendarDays,
  Timer,
  Flag,
  Users2,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Match, Team } from '../types';

const tabOptions = [
  { key: 'all', label: 'TOUS', icon: <Trophy size={16} />, gradient: 'from-purple-500 to-pink-500' },
  { key: 'live', label: 'EN DIRECT', icon: <Zap size={16} />, gradient: 'from-red-500 to-orange-500' },
  { key: 'scheduled', label: 'PROGRAMMÉS', icon: <Clock size={16} />, gradient: 'from-blue-500 to-cyan-500' },
  { key: 'finished', label: 'TERMINÉS', icon: <CheckCircle size={16} />, gradient: 'from-green-500 to-emerald-500' },
];

const roundTypes = [
  { key: 'all', label: 'TOUS LES ROUNDS', icon: <Trophy size={16} />, gradient: 'from-purple-500 to-pink-500' },
  { key: 'groupes', label: 'PHASE DE GROUPES', icon: <Users size={16} />, gradient: 'from-blue-500 to-cyan-500' },
  { key: 'quarters', label: '1/4 DE FINALE', icon: <Target size={16} />, gradient: 'from-purple-500 to-indigo-500' },
  { key: 'semis', label: '1/2 FINALE', icon: <Award size={16} />, gradient: 'from-orange-500 to-red-500' },
  { key: 'finale', label: 'FINALE', icon: <Trophy size={16} />, gradient: 'from-yellow-500 to-orange-500' }
];

const Matches: React.FC = () => {
  const { user } = useAuth();
  const { matches, teams, players, tournaments, addMatch, updateMatchScore, loadData, generateDraw } = useData();
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === 'ar';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };
  
  const [activeTab, setActiveTab] = useState('all');
  const [activeRound, setActiveRound] = useState<'all' | 'groupes' | 'quarters' | 'semis' | 'finale'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null);

  const [newMatch, setNewMatch] = useState<Omit<Match, 'id'>>({
    homeTeam: '',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    date: '',
    time: '',
    status: 'scheduled',
    type: 'friendly',
    venue: ''
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Filtrer et dédupliquer les matchs selon les critères sélectionnés
  const filteredMatches = matches
    .filter(match => {
      const statusMatch = activeTab === 'all' || match.status === activeTab;
      const roundMatch = activeRound === 'all' || match.round?.toLowerCase() === activeRound;
      return statusMatch && roundMatch;
    })
    // Dédupliquer par ID pour éviter les doublons
    .filter((match, index, self) => 
      index === self.findIndex(m => m.id === match.id)
    )
    // Dédupliquer aussi par combinaison homeTeam + awayTeam + date
    .filter((match, index, self) => 
      index === self.findIndex(m => 
        m.homeTeam === match.homeTeam && 
        m.awayTeam === match.awayTeam && 
        m.date === match.date
      )
    );

  // Fonction pour obtenir le nom du groupe d'un match
  const getGroupName = (match: Match) => {
    if (!match.groupId) return 'Phase finale';
    
    const tournament = tournaments.find(t => 
      t.groups?.some((g: any) => g.id === match.groupId)
    );
    
    if (tournament) {
      const group = tournament.groups?.find((g: any) => g.id === match.groupId);
      return group?.name || 'Groupe inconnu';
    }
    
    return 'Groupe inconnu';
  };

  // Trier les matchs par jour et par groupe selon la structure FIFA
  const sortedMatches = filteredMatches.sort((a, b) => {
    // D'abord par date
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // Ensuite par groupe (A, B, C)
    const groupA = getGroupName(a);
    const groupB = getGroupName(b);
    return groupA.localeCompare(groupB);
  });

  // Calculer le jour du match basé sur la date
  const getMatchDay = (match: Match) => {
    const matchDate = new Date(match.date);
    const today = new Date();
    const diffTime = matchDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1); // Jour 1 si aujourd'hui
  };

  // Debug: Afficher le nombre de matchs pour diagnostiquer les doublons
  console.log('Total matches:', matches.length);
  console.log('Filtered matches:', filteredMatches.length);
  console.log('Sorted matches:', sortedMatches.length);

  // Calculer la progression du tournoi
  const tournamentProgress = () => {
    const totalMatches = matches.length;
    const completedMatches = matches.filter(m => m.status === 'completed').length;
    const liveMatches = matches.filter(m => m.status === 'live').length;
    const scheduledMatches = matches.filter(m => m.status === 'scheduled').length;
    
    return {
      total: totalMatches,
      completed: completedMatches,
      live: liveMatches,
      scheduled: scheduledMatches,
      percentage: totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0
    };
  };

  const canGenerateNextRound = (currentRound: string) => {
    const completedMatches = matches.filter(m => m.status === 'completed' && m.round === currentRound).length;
    const totalMatches = matches.filter(m => m.round === currentRound).length;
    return completedMatches === totalMatches && totalMatches > 0;
  };

  const getNextRound = (currentRound: string) => {
    const roundMap: Record<string, string> = {
      'Groupes': '1/4 de Finale',
      '1/4 de Finale': '1/2 Finale',
      '1/2 Finale': 'Finale'
    };
    return roundMap[currentRound] || 'Round suivant';
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    addMatch({
      ...newMatch,
      id: `match-${Date.now()}`
    } as Match);
    setNewMatch({
      homeTeam: '',
      awayTeam: '',
      homeScore: 0,
      awayScore: 0,
      date: '',
      time: '',
      status: 'scheduled',
      type: 'friendly',
      venue: ''
    });
    setShowCreateModal(false);
  };

  const handleUpdateScore = (matchId: string, homeScore: number, awayScore: number) => {
    updateMatchScore(matchId, homeScore, awayScore);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Équipe inconnue';
  };

  const getTeamAverageLevel = (teamId: string) => {
    const teamPlayers = players.filter(p => p.teamId === teamId);
    if (teamPlayers.length === 0) return 0;
    const totalLevel = teamPlayers.reduce((sum, player) => sum + (player.level || 0), 0);
    return Math.round(totalLevel / teamPlayers.length);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Zap size={16} className="text-red-500" />;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'scheduled': return <Clock size={16} className="text-blue-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'En direct';
      case 'completed': return 'Terminé';
      case 'scheduled': return 'Programmé';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-red-500 bg-red-50 border-red-200';
      case 'completed': return 'text-green-500 bg-green-50 border-green-200';
      case 'scheduled': return 'text-blue-500 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span className="ml-1">{getStatusText(status)}</span>
    </span>
  );

  // État pour le contrôle en live
  const [liveMatch, setLiveMatch] = useState<Match | null>(null);
  const [matchTime, setMatchTime] = useState(0);
  const [isLiveTimer, setIsLiveTimer] = useState(false);

  // Contrôle manuel du temps (pas de timer automatique)
  // Le temps sera contrôlé par l'admin via les boutons

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

  const handleStatusChange = async (match: Match, newStatus: 'scheduled' | 'live' | 'completed') => {
    try {
      if (newStatus === 'live') {
        setLiveMatch(match);
        setMatchTime(0);
        setIsLiveTimer(true);
        // Démarrer le match en live
        console.log(`Match ${match.id} démarré en live`);
      } else if (newStatus === 'completed') {
        setIsLiveTimer(false);
        setLiveMatch(null);
        setMatchTime(0);
        // Terminer le match
        console.log(`Match ${match.id} terminé`);
      }
      
      // Mettre à jour le statut dans le backend
      await updateMatchScore(match.id, match.homeScore || 0, match.awayScore || 0);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleLiveScoreUpdate = async (matchId: string, homeScore: number, awayScore: number) => {
    try {
      await updateMatchScore(matchId, homeScore, awayScore);
      // Mettre à jour le match en live
      if (liveMatch && liveMatch.id === matchId) {
        setLiveMatch({ ...liveMatch, homeScore, awayScore });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du score:', error);
    }
  };

  const handleMatchEvent = (eventType: 'goal' | 'yellow_card' | 'red_card' | 'substitution', team: 'home' | 'away') => {
    if (!liveMatch) return;

    const event = {
      type: eventType,
      team,
      time: matchTime,
      timestamp: new Date().toISOString()
    };

    console.log('Événement de match:', event);
    // Ici tu peux ajouter la logique pour sauvegarder l'événement
  };

  const saveMatchTime = async () => {
    if (!liveMatch) return;
    
    try {
      // Sauvegarder le temps actuel dans le match
      const { updateMatch } = await import('../services/api');
      await updateMatch(liveMatch.id, { 
        ...liveMatch, 
        matchTime: matchTime 
      });
      console.log('Temps de match sauvegardé:', formatMatchTime(matchTime));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du temps:', error);
    }
  };

  const generateNextRound = async (currentRound: string) => {
    try {
      // Ici tu peux ajouter la logique pour générer le round suivant
      console.log(`Génération du round suivant: ${getNextRound(currentRound)}`);
    } catch (error) {
      console.error('Erreur lors de la génération du round suivant:', error);
    }
  };



  const renderMatch = (match: Match) => (
    <div 
      key={match.id}
      className={`relative group transition-all duration-300 transform hover:scale-105 ${
        hoveredMatch === match.id ? 'z-10' : ''
      }`}
      onMouseEnter={() => setHoveredMatch(match.id)}
      onMouseLeave={() => setHoveredMatch(null)}
    >
      {/* Effet de brillance au survol */}
      {hoveredMatch === match.id && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-xl" />
      )}
      
      <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {getMatchDay(match)}
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                {getGroupName(match)}
              </span>
            </div>
          </div>
          {getStatusBadge(match.status)}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-900">{getTeamName(match.homeTeam)}</div>
            <div className="text-xs text-gray-500">Niveau: {getTeamAverageLevel(match.homeTeam)}</div>
          </div>
          
          <div className="mx-6 text-center">
            <div className="text-2xl font-bold text-gray-400">VS</div>
            {match.homeScore !== null && match.awayScore !== null && (
              <div className="text-xl font-bold text-gray-900 mt-1">
                {match.homeScore} - {match.awayScore}
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-900">{getTeamName(match.awayTeam)}</div>
            <div className="text-xs text-gray-500">Niveau: {getTeamAverageLevel(match.awayTeam)}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <CalendarDays size={14} />
            <span>{new Date(match.date).toLocaleDateString('fr-FR')}</span>
          </div>
          {match.time && (
            <div className="flex items-center space-x-1">
              <Timer size={14} />
              <span>{match.time}</span>
            </div>
          )}
        </div>
        
        {user.role === 'admin' && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingMatch(match)}
                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
                title="Modifier le match"
              >
                <Edit size={16} className="text-blue-600" />
              </button>
              
              <button
                onClick={() => window.location.href = `/live-match/${match.id}`}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Match en direct"
              >
                <Zap size={16} className="text-red-600" />
              </button>
              
              {match.status === 'scheduled' && (
              <button
                onClick={() => handleStatusChange(match, 'live')}
                className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
                  title="Démarrer le match"
                >
                  <Play size={16} className="text-green-600" />
                </button>
              )}
              
              {match.status === 'live' && (
                <button
                  onClick={() => handleStatusChange(match, 'completed')}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Terminer le match"
                >
                  <Square size={16} className="text-red-600" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Contrôle en live pour les admins */}
        {user.role === 'admin' && match.status === 'live' && liveMatch?.id === match.id && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-red-700">MATCH EN DIRECT</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Contrôle manuel du temps */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMatchTime(prev => Math.max(0, prev - 30))}
                    className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600"
                    title="Reculer de 30 secondes"
                  >
                    -30s
                  </button>
                  <button
                    onClick={() => setMatchTime(prev => Math.max(0, prev - 1))}
                    className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600"
                    title="Reculer de 1 seconde"
                  >
                    -1s
                  </button>
                </div>
                
                <div className="text-2xl font-bold text-red-600">
                  {formatMatchTime(matchTime)}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMatchTime(prev => prev + 1)}
                    className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                    title="Avancer de 1 seconde"
                  >
                    +1s
                  </button>
                  <button
                    onClick={() => setMatchTime(prev => prev + 30)}
                    className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                    title="Avancer de 30 secondes"
                  >
                    +30s
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-red-600">
                {getMatchPhase(matchTime)}
              </div>
              
              {/* Contrôle des phases de match */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMatchTime(0)}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                  title="Début de match"
                >
                  Début
                </button>
                <button
                  onClick={() => setMatchTime(45 * 60)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600"
                  title="Mi-temps"
                >
                  Mi-temps
                </button>
                <button
                  onClick={() => setMatchTime(90 * 60)}
                  className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600"
                  title="Fin du temps réglementaire"
                >
                  Fin 90'
                </button>
                <button
                  onClick={() => setMatchTime(120 * 60)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                  title="Fin des prolongations"
                >
                  Fin 120'
                </button>
              </div>
            </div>
            
            {/* Contrôle du score en live */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{getTeamName(match.homeTeam)}</div>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <button
                    onClick={() => handleLiveScoreUpdate(match.id, (match.homeScore || 0) - 1, match.awayScore || 0)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    disabled={(match.homeScore || 0) <= 0}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-8 text-center">
                    {match.homeScore || 0}
                  </span>
                  <button
                    onClick={() => handleLiveScoreUpdate(match.id, (match.homeScore || 0) + 1, match.awayScore || 0)}
                    className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{getTeamName(match.awayTeam)}</div>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <button
                    onClick={() => handleLiveScoreUpdate(match.id, match.homeScore || 0, (match.awayScore || 0) - 1)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    disabled={(match.awayScore || 0) <= 0}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-8 text-center">
                    {match.awayScore || 0}
                  </span>
                  <button
                    onClick={() => handleLiveScoreUpdate(match.id, match.homeScore || 0, (match.awayScore || 0) + 1)}
                    className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Événements de match */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => handleMatchEvent('goal', 'home')}
                className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
              >
                🥅 But {getTeamName(match.homeTeam)}
              </button>
              <button
                onClick={() => handleMatchEvent('goal', 'away')}
                className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
              >
                🥅 But {getTeamName(match.awayTeam)}
              </button>
              <button
                onClick={() => handleMatchEvent('yellow_card', 'home')}
                className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
              >
                🟨 Carton {getTeamName(match.homeTeam)}
              </button>
              <button
                onClick={() => handleMatchEvent('yellow_card', 'away')}
                className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
              >
                🟨 Carton {getTeamName(match.awayTeam)}
              </button>
            </div>
            
            {/* Bouton pour sauvegarder le temps */}
            <div className="text-center">
              <button
                onClick={saveMatchTime}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600"
                title="Sauvegarder le temps actuel"
              >
                💾 Sauvegarder le temps ({formatMatchTime(matchTime)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header moderne avec glassmorphism */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Trophy size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {isArabic ? '7OUMA المباريات' : '7OUMA Matches'}
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  {isArabic ? 'إدارة ومتابعة المباريات' : 'Gestion et suivi des rencontres'}
                </p>
              </div>
            </div>
            
            {user.role === 'admin' && (
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:shadow-3xl"
              >
                <Plus size={24} />
                <span>{isArabic ? 'مباراة جديدة' : 'Nouveau Match'}</span>
              </motion.button>
            )}
          </div>

          {/* Statistiques modernes */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">{isArabic ? 'المجموع' : 'Total'}</p>
                  <p className="text-3xl font-bold">{tournamentProgress().total}</p>
                </div>
                <BarChart3 size={32} className="text-blue-200" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">{isArabic ? 'منتهية' : 'Terminés'}</p>
                  <p className="text-3xl font-bold">{tournamentProgress().completed}</p>
                </div>
                <CheckCircle size={32} className="text-green-200" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">{isArabic ? 'مباشر' : 'En Direct'}</p>
                  <p className="text-3xl font-bold">{tournamentProgress().live}</p>
                </div>
                <Zap size={32} className="text-red-200" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">{isArabic ? 'التقدم' : 'Progression'}</p>
                  <p className="text-3xl font-bold">{tournamentProgress().percentage}%</p>
                </div>
                <TrendingUp size={32} className="text-purple-200" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filtres modernes */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Sparkles size={20} className="text-purple-500" />
            <span>Filtres</span>
          </h3>
          
          {/* Filtres par statut */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Statut</p>
            <div className="flex flex-wrap gap-3">
              {tabOptions.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.key 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105` 
                      : 'bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtres par round */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Phase</p>
            <div className="flex flex-wrap gap-3">
              {roundTypes.map((round) => (
                <button
                  key={round.key}
                  onClick={() => setActiveRound(round.key as any)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                    activeRound === round.key 
                      ? `bg-gradient-to-r ${round.gradient} text-white shadow-lg transform scale-105` 
                      : 'bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-200'
                  }`}
                >
                  {round.icon}
                  <span>{round.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Affichage des matchs en grille moderne */}
      <div className="space-y-6">
        {sortedMatches.length === 0 && (
          <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-white/20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun match à afficher</h3>
            <p className="text-gray-500">Modifiez les filtres pour voir les matchs disponibles</p>
          </div>
        )}
        
        {/* Grille de matchs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMatches.map((match) => renderMatch(match))}
        </div>
      </div>
    </div>
  );
};

export default Matches;