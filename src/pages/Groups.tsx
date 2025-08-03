import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { GroupTeam } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Trophy, 
  Clock, 
  Calendar,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  ArrowRight,
  Move,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Phone,
  Mail,
  Shield,
  Zap,
  Star,
  Crown
} from 'lucide-react';

interface Group {
  id: string;
  name: string;
  tournamentId: string;
  groupTeams: GroupTeam[];
}

interface Team {
  id: string;
  name: string;
  logo: string | null;
  coachName?: string;
}

const Groups: React.FC = () => {
  const { user } = useAuth();
  const { tournaments, teams, matches, loadData } = useData();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [selectedTournament, setSelectedTournament] = useState<string>('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [matchTime, setMatchTime] = useState('15:00');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [movingTeam, setMovingTeam] = useState<{teamId: string, teamName: string, fromGroupId: string} | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Obtenir le tournoi sélectionné
  const currentTournament = (tournaments || []).find(t => t.id === selectedTournament) || (tournaments || [])[0];
  const tournamentGroups = currentTournament?.groups || [];

  // Obtenir toutes les équipes disponibles
  const availableTeams = teams.filter(team => {
    // Équipes qui ne sont dans aucun groupe du tournoi actuel
    const teamsInGroups = (tournamentGroups || []).flatMap(group => 
      group.groupTeams?.map(gt => gt.teamId) || []
    );
    return !teamsInGroups.includes(team.id);
  });

  // Toggle l'expansion d'un groupe
  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Ajouter une équipe à un groupe
  const addTeamToGroup = async (groupId: string, teamId: string) => {
    try {
      const { addTeamToGroup } = await import('../services/api');
      await addTeamToGroup(groupId, teamId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'équipe au groupe:', error);
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', {
          message: error.message,
          response: (error as any).response?.data,
          status: (error as any).response?.status
        });
        alert(`Erreur lors de l'ajout de l'équipe: ${(error as any).response?.data?.message || error.message}`);
      } else {
        console.error('Erreur inconnue:', error);
        alert('Erreur lors de l\'ajout de l\'équipe');
      }
    }
  };

  // Retirer une équipe d'un groupe
  const removeTeamFromGroup = async (groupId: string, teamId: string) => {
    try {
      const { removeTeamFromGroup } = await import('../services/api');
      await removeTeamFromGroup(groupId, teamId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors du retrait de l\'équipe du groupe:', error);
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', {
          message: error.message,
          response: (error as any).response?.data,
          status: (error as any).response?.status
        });
        alert(`Erreur lors du retrait de l'équipe: ${(error as any).response?.data?.message || error.message}`);
      } else {
        console.error('Erreur inconnue:', error);
        alert('Erreur lors du retrait de l\'équipe');
      }
    }
  };

  // Déplacer une équipe d'un groupe à un autre
  const moveTeamToGroup = async (teamId: string, fromGroupId: string, toGroupId: string) => {
    try {
      // D'abord retirer l'équipe de son groupe actuel
      await removeTeamFromGroup(fromGroupId, teamId);
      
      // Ensuite l'ajouter au nouveau groupe
      await addTeamToGroup(toGroupId, teamId);
      
      setMovingTeam(null);
    } catch (error) {
      console.error('Erreur lors du déplacement de l\'équipe:', error);
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', error.message);
      } else {
        console.error('Erreur inconnue:', error);
      }
    }
  };

  // Créer un nouveau groupe
  const createGroup = async (groupName: string) => {
    if (!currentTournament) return;
    
    try {
      const { createGroup } = await import('../services/api');
      await createGroup({
        name: groupName,
        tournamentId: currentTournament.id
      });
      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', error.message);
      } else {
        console.error('Erreur inconnue:', error);
      }
    }
  };

  // Modifier un groupe
  const updateGroup = async (groupId: string, newName: string) => {
    try {
      const { updateGroup } = await import('../services/api');
      await updateGroup(groupId, { name: newName });
      await loadData();
      setShowEditModal(false);
      setEditingGroup(null);
    } catch (error) {
      console.error('Erreur lors de la modification du groupe:', error);
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', error.message);
      } else {
        console.error('Erreur inconnue:', error);
      }
    }
  };

  // Supprimer un groupe
  const deleteGroup = async (groupId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) return;
    
    try {
      const { deleteGroup } = await import('../services/api');
      await deleteGroup(groupId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe:', error);
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', error.message);
      } else {
        console.error('Erreur inconnue:', error);
      }
    }
  };

  // Générer les matchs pour tous les groupes
  const generateMatches = async () => {
    if (!currentTournament) return;
    
    try {
      const { generateMatches } = await import('../services/api');
      const result = await generateMatches(currentTournament.id, matchTime);
      await loadData();
      
      const message = `Matchs générés avec succès !\n\n📊 Résumé:\n- ${result.totalMatches} matchs au total\n- ${result.totalDays} jours de compétition\n- ${result.groupMatches} matchs de groupes\n- ${result.finalMatches} matchs de phase finale`;
      alert(message);
    } catch (error) {
      console.error('Erreur lors de la génération des matchs:', error);
      if (error instanceof Error) {
        alert(`Erreur lors de la génération des matchs: ${(error as any).response?.data?.message || error.message}`);
      } else {
        alert('Erreur lors de la génération des matchs');
      }
    }
  };

  const updateFinalPhase = async () => {
    if (!currentTournament) return;
    
    try {
      const { updateFinalPhaseMatches } = await import('../services/api');
      const result = await updateFinalPhaseMatches(currentTournament.id);
      await loadData();
      alert(`Équipes qualifiées assignées avec succès !\n\n🏆 ${result.qualifiedTeams.length} équipes qualifiées`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des équipes qualifiées:', error);
      if (error instanceof Error) {
        alert(`Erreur: ${(error as any).response?.data?.message || error.message}`);
      } else {
        alert('Erreur lors de la mise à jour des équipes qualifiées');
      }
    }
  };

  const generateFinalMatches = async () => {
    if (!currentTournament) return;
    
    try {
      const { generateFinalPhaseMatches } = await import('../services/api');
      const result = await generateFinalPhaseMatches(currentTournament.id, matchTime);
      await loadData();
      alert(`Matchs de la phase finale générés avec succès !\n\n🏆 ${result.totalMatches} matchs créés\n- ${result.quarters} quarts de finale\n- ${result.semis} demi-finales\n- ${result.final} finale`);
    } catch (error) {
      console.error('Erreur lors de la génération des matchs de la phase finale:', error);
      if (error instanceof Error) {
        alert(`Erreur: ${(error as any).response?.data?.message || error.message}`);
      } else {
        alert('Erreur lors de la génération des matchs de la phase finale');
      }
    }
  };

  // Calculer les statistiques d'un groupe
  const getGroupStats = (group: Group) => {
    const groupMatches = matches.filter(m => m.groupId === group.id);
    const completedMatches = groupMatches.filter(m => m.status === 'completed');
    const totalMatches = groupMatches.length;
    
    return {
      totalMatches,
      completedMatches: completedMatches.length,
      pendingMatches: totalMatches - completedMatches.length,
      teams: group.groupTeams?.length || 0
    };
  };

  // Obtenir le classement d'un groupe
  const getGroupStandings = (group: Group) => {
    const groupMatches = matches.filter(m => m.groupId === group.id && m.status === 'completed');
    
    // Calculer les points pour chaque équipe
    const teamStats = group.groupTeams?.map(gt => {
      const team = teams.find(t => t.id === gt.teamId);
      const teamMatches = groupMatches.filter(m => 
        m.homeTeam === gt.teamId || m.awayTeam === gt.teamId
      );
      
      let points = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;
      let wins = 0;
      let draws = 0;
      let losses = 0;
      
      teamMatches.forEach(match => {
        const isHome = match.homeTeam === gt.teamId;
        const goalsScored = isHome ? match.homeScore : match.awayScore;
        const goalsConceded = isHome ? match.awayScore : match.homeScore;
        
        goalsFor += goalsScored;
        goalsAgainst += goalsConceded;
        
        if (goalsScored > goalsConceded) {
          points += 3;
          wins++;
        } else if (goalsScored === goalsConceded) {
          points += 1;
          draws++;
        } else {
          losses++;
        }
      });
      
      return {
        teamId: gt.teamId,
        teamName: team?.name || 'Équipe inconnue',
        points,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        wins,
        draws,
        losses,
        matchesPlayed: teamMatches.length
      };
    });
    
    // Trier par points, puis différence de buts, puis buts marqués
    return (teamStats || []).sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-white/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-2xl"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                {isArabic ? '7OUMA المجموعات' : '7OUMA Groupes'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {isArabic 
                ? 'إدارة المجموعات والفرق في البطولات'
                : 'Gérez les groupes et équipes de vos tournois'
              }
            </p>
            
            {user.role === 'admin' && (
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300"
              >
                <Plus className="w-6 h-6 mr-2" />
                {isArabic ? 'إنشاء مجموعة جديدة' : 'Nouveau Groupe'}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sélecteur de tournoi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isArabic ? 'اختر البطولة' : 'Sélectionner un tournoi'}
              </h2>
              <p className="text-gray-600">
                {isArabic ? 'اختر البطولة لإدارة مجموعاتها' : 'Sélectionnez un tournoi pour gérer ses groupes'}
              </p>
            </div>
            
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm min-w-[300px]"
            >
              {(tournaments || []).map(tournament => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Contrôles de génération de matchs */}
        {user.role === 'admin' && (tournamentGroups || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-xl p-8 mb-8 border border-green-200"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isArabic ? 'إنشاء المباريات' : 'Génération des matchs'}
                </h3>
                <p className="text-gray-600">
                  {isArabic ? 'إنشاء مباريات البطولة تلقائياً' : 'Générez automatiquement les matchs du tournoi'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">
                    {isArabic ? 'وقت المباراة:' : 'Heure des matchs:'}
                  </label>
                  <input
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    onClick={generateMatches}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{isArabic ? 'إنشاء المباريات' : 'Générer les matchs'}</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={updateFinalPhase}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>{isArabic ? 'تعيين الفرق المؤهلة' : 'Assigner équipes qualifiées'}</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={generateFinalMatches}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <Award className="w-5 h-5" />
                    <span>{isArabic ? 'إنشاء المرحلة النهائية' : 'Générer phase finale'}</span>
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                <strong>📅 {isArabic ? 'هيكل FIFA الرسمي:' : 'Structure FIFA officielle :'}</strong> {isArabic ? 'مباراة واحدة يومياً، توزيع متوازن، راحة مثالية' : '1 match par jour, répartition équilibrée, repos optimal'}
              </p>
              <div className="mt-2 text-xs text-blue-700">
                <p>• {isArabic ? '18 يوم من مرحلة المجموعات (6 مباريات لكل مجموعة)' : '18 jours de phase de groupes (6 matchs par groupe)'}</p>
                <p>• {isArabic ? 'كل فريق يلعب كل 4-5 أيام' : 'Chaque équipe joue tous les 4-5 jours'}</p>
                <p>• {isArabic ? 'هيكل مطابق لكأس العالم FIFA' : 'Structure identique à la Coupe du Monde FIFA'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Affichage des groupes */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {(tournamentGroups || []).map((group) => {
            const stats = getGroupStats(group);
            const standings = getGroupStandings(group);
            const isExpanded = expandedGroups.has(group.id);
            
            return (
              <motion.div
                key={group.id}
                variants={itemVariants}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-105"
              >
                {/* Header du groupe */}
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-600">
                          {isArabic ? `${stats.teams} فريق` : `${stats.teams} équipes`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' && (
                        <>
                          <button
                            onClick={() => {
                              setEditingGroup(group);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300"
                            title={isArabic ? 'تعديل' : 'Modifier'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteGroup(group.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                            title={isArabic ? 'حذف' : 'Supprimer'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => toggleGroupExpansion(group.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-300"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Statistiques du groupe */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.teams}</div>
                      <div className="text-xs text-gray-600">{isArabic ? 'الفرق' : 'Équipes'}</div>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalMatches}</div>
                      <div className="text-xs text-gray-600">{isArabic ? 'المباريات' : 'Matchs'}</div>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.completedMatches}</div>
                      <div className="text-xs text-gray-600">{isArabic ? 'منتهية' : 'Terminés'}</div>
                    </div>
                  </div>
                </div>

                {/* Contenu détaillé du groupe */}
                {isExpanded && (
                  <div className="p-8">
                    {/* Équipes du groupe */}
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-green-600" />
                        {isArabic ? 'الفرق في هذه المجموعة:' : 'Équipes dans ce groupe:'}
                      </h4>
                      <div className="space-y-3">
                        {group.groupTeams?.map((groupTeam, index) => (
                          <motion.div
                            key={groupTeam.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {teams.find(t => t.id === groupTeam.teamId)?.logo || '⚽'}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900">{teams.find(t => t.id === groupTeam.teamId)?.name || 'Équipe inconnue'}</span>
                                {index === 0 && (
                                  <div className="flex items-center mt-1">
                                    <Crown className="w-3 h-3 text-yellow-500 mr-1" />
                                    <span className="text-xs text-yellow-600 font-medium">
                                      {isArabic ? 'المركز الأول' : '1er place'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Bouton pour déplacer l'équipe */}
                              {user.role === 'admin' && (tournamentGroups || []).length > 1 && (
                                <button
                                  onClick={() => setMovingTeam({
                                    teamId: groupTeam.teamId,
                                    teamName: teams.find(t => t.id === groupTeam.teamId)?.name || 'Équipe inconnue',
                                    fromGroupId: group.id
                                  })}
                                  className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                                  title={isArabic ? 'نقل الفريق' : 'Déplacer l\'équipe'}
                                >
                                  <Move className="w-4 h-4" />
                                </button>
                              )}
                              {/* Bouton pour retirer l'équipe */}
                              {user.role === 'admin' && (
                                <button
                                  onClick={() => removeTeamFromGroup(group.id, groupTeam.teamId)}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                                  title={isArabic ? 'إزالة الفريق' : 'Retirer l\'équipe'}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Ajouter une équipe */}
                      {user.role === 'admin' && availableTeams.length > 0 && (
                        <div className="mt-6">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addTeamToGroup(group.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          >
                            <option value="">{isArabic ? 'إضافة فريق...' : 'Ajouter une équipe...'}</option>
                            {(availableTeams || []).map(team => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Classement du groupe */}
                    {standings.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                          {isArabic ? 'الترتيب:' : 'Classement:'}
                        </h4>
                        <div className="space-y-2">
                          {(standings || []).map((team, index) => (
                            <motion.div
                              key={team.teamId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex items-center justify-between p-3 rounded-2xl text-sm transition-all duration-300 ${
                                index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' :
                                index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200' :
                                index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200' :
                                'bg-gray-50 border border-gray-100'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  index === 0 ? 'bg-yellow-500 text-white' :
                                  index === 1 ? 'bg-gray-500 text-white' :
                                  index === 2 ? 'bg-orange-500 text-white' :
                                  'bg-gray-300 text-gray-700'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-gray-900">{team.teamName}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-xs">
                                <span className="font-bold text-green-600">{team.points}pts</span>
                                <span className="text-gray-600">{team.goalsFor}-{team.goalsAgainst}</span>
                                <span className="text-gray-500">{team.matchesPlayed}J</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Message si aucun groupe */}
        {(tournamentGroups || []).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <Users size={80} className="mx-auto text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                {isArabic ? 'لا توجد مجموعات' : 'Aucun groupe créé'}
              </h3>
              <p className="text-gray-500 text-lg">
                {isArabic ? 'أنشئ مجموعتك الأولى للبدء' : 'Créez votre premier groupe pour commencer'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Modal de déplacement d'équipe */}
        {movingTeam && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isArabic ? 'نقل الفريق' : 'Déplacer l\'équipe'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isArabic ? 'نقل' : 'Déplacer'} <strong>{movingTeam.teamName}</strong> {isArabic ? 'إلى:' : 'vers :'}
              </p>
              <select
                onChange={(e) => {
                  if (e.target.value && e.target.value !== movingTeam.fromGroupId) {
                    moveTeamToGroup(movingTeam.teamId, movingTeam.fromGroupId, e.target.value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 mb-6"
              >
                <option value="">{isArabic ? 'اختر مجموعة...' : 'Sélectionner un groupe...'}</option>
                {(tournamentGroups || [])
                  .filter(g => g.id !== movingTeam.fromGroupId)
                  .map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))
                }
              </select>
              <div className="flex justify-end">
                <button
                  onClick={() => setMovingTeam(null)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  {isArabic ? 'إلغاء' : 'Annuler'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de création de groupe */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isArabic ? 'إنشاء مجموعة جديدة' : 'Créer un nouveau groupe'}
              </h3>
              <input
                type="text"
                placeholder={isArabic ? "اسم المجموعة (مثال: المجموعة أ)" : "Nom du groupe (ex: Groupe A)"}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 mb-6"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      createGroup(input.value.trim());
                    }
                  }
                }}
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  {isArabic ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Nom du groupe"], input[placeholder*="اسم المجموعة"]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      createGroup(input.value.trim());
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg"
                >
                  {isArabic ? 'إنشاء' : 'Créer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de modification de groupe */}
        {showEditModal && editingGroup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isArabic ? 'تعديل المجموعة' : 'Modifier le groupe'}
              </h3>
              <input
                type="text"
                defaultValue={editingGroup.name}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 mb-6"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      updateGroup(editingGroup.id, input.value.trim());
                    }
                  }
                }}
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingGroup(null);
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  {isArabic ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[defaultValue*="Groupe"], input[defaultValue*="المجموعة"]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      updateGroup(editingGroup.id, input.value.trim());
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg"
                >
                  {isArabic ? 'تحديث' : 'Modifier'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups; 