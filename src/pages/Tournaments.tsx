import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { usePermissions } from '../hooks/usePermissions';
import { useNavigate, Navigate } from 'react-router-dom';
import { Plus, Trophy, Calendar, Users, Star, Award, Target, Zap } from 'lucide-react';
import TournamentCard from '../components/Tournaments/TournamentCard';
import CreateTournamentModal from '../components/Tournaments/CreateTournamentModal';
import TournamentDrawModal from '../components/Tournaments/TournamentDrawModal';
import ManageTournamentModal from '../components/Tournaments/ManageTournamentModal';
import DebugData from '../components/DebugData';
import { Tournament, CreatePlayerForm, Team } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Tournaments: React.FC = () => {
  const { user } = useAuth();
  const { tournaments, teams, players, matches, createTournament, createTeam, generateDraw, generateGroupMatches, addPlayer, updateTournament, loadData, updateMatchScore } = useData();
  const { canEdit, canDelete, canCreate } = usePermissions();
  const navigate = useNavigate();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [selectedTournamentPlayers, setSelectedTournamentPlayers] = useState<any[]>([]);
  // Ajout d'un state pour le nombre de groupes sélectionné
  const [selectedNumberOfGroups, setSelectedNumberOfGroups] = useState<number>(4);

  const [newTournament, setNewTournament] = useState<Omit<Tournament, 'id'>>({
    name: '',
    logo: '🏆',
    startDate: '',
    endDate: '',
    prize: '',
    rules: '',
    stadium: '',
    status: 'upcoming',
    tournamentTeams: [],
    matches: [],
    drawCompleted: false,
    numberOfGroups: 2,
    teamsPerGroup: 4,
    groups: [],
    freePlayers: [],
  });

  const logoOptions = ['🏆', '🥇', '⚽', '🏅', '🎯', '🔥', '⭐', '💎', '👑', '🌟'];

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
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    if (!showCreateModal) {
      setNewTournament({
        name: '',
        logo: '🏆',
        startDate: '',
        endDate: '',
        prize: '',
        rules: '',
        stadium: '',
        status: 'upcoming',
        tournamentTeams: [],
        matches: [],
        drawCompleted: false,
        numberOfGroups: 2,
        teamsPerGroup: 4,
        groups: [],
        freePlayers: [],
      });
    }
  }, [showCreateModal]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateTournament = async (e: React.FormEvent) => {
      e.preventDefault();
      
      console.log("🏆 Tentative de création de tournoi:", {
        newTournament,
        user: user?.name,
        userId: user?.id
      });

      // Vérifier les champs requis
      if (!newTournament.name || !newTournament.startDate || !newTournament.endDate) {
        console.error("❌ Champs requis manquants:", {
          name: newTournament.name,
          startDate: newTournament.startDate,
          endDate: newTournament.endDate
        });
        alert("Veuillez remplir tous les champs requis (nom, date de début, date de fin)");
        return;
      }

      try {
        const tournamentData = {
          name: newTournament.name,
          logo: newTournament.logo,
          startDate: newTournament.startDate,
          endDate: newTournament.endDate,
          prize: newTournament.prize,
          rules: newTournament.rules,
          stadium: newTournament.stadium,
          numberOfGroups: newTournament.numberOfGroups || 2,
          teamsPerGroup: newTournament.teamsPerGroup || 4
        };

        console.log("📤 Données envoyées au serveur:", tournamentData);

        const createdTournament = await createTournament(tournamentData as any);
        
        console.log("✅ Tournoi créé avec succès:", createdTournament);
        setShowCreateModal(false);
      } catch (error) {
        console.error("❌ Failed to create tournament:", error);
        alert("Erreur lors de la création du tournoi. Vérifiez les données saisies.");
      }
  };

  const handleGenerateGroups = async (tournamentId: string, numberOfGroups?: number) => {
    try {
      await generateDraw(tournamentId, 'groupes', numberOfGroups);
      setShowDrawModal(false);
      console.log("Tirage au sort terminé avec succès");
      
      // Recharger les données pour afficher les nouveaux groupes et joueurs
      console.log("Rechargement des données après tirage au sort...");
      await loadData();
      
      // Si un tournoi est sélectionné, rafraîchir ses données spécifiques
      if (selectedTournamentId === tournamentId) {
        await refreshTournamentData(tournamentId);
      }
      
      // Debug: vérifier les données mises à jour
      const updatedTournament = tournaments.find(t => t.id === tournamentId);
      console.log("Tournoi mis à jour après tirage:", {
        id: updatedTournament?.id,
        name: updatedTournament?.name,
        drawCompleted: updatedTournament?.drawCompleted,
        groupsLength: updatedTournament?.groups?.length || 0,
        teamsLength: updatedTournament?.tournamentTeams?.length || 0
      });
      
      console.log("Données rechargées avec succès");
      
    } catch (error) {
      console.error("Erreur lors du tirage au sort:", error);
      // Ici tu pourrais ajouter une notification d'erreur pour l'utilisateur
    }
  };

  const handleGenerateMatches = async (tournamentId: string) => {
    try {
      // Utiliser generateGroupMatches pour générer les matchs des groupes
      await generateGroupMatches(tournamentId);
      console.log("Matchs générés avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération des matchs:", error);
      // Ici tu pourrais ajouter une notification d'erreur pour l'utilisateur
    }
  };

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId) || null;

  const handleAddTeamToTournament = async (teamId: string) => {
    if (!selectedTournament) return;
    
    console.log('Ajouter équipe au tournoi:', teamId);
    console.log('Équipes disponibles:', teams.map(t => ({ id: t.id, name: t.name })));
            console.log('Équipes dans le tournoi:', selectedTournament.tournamentTeams?.map(t => ({ id: t.id, teamId: t.teamId })) || []);
        console.log('Équipes dans le tournoi (avant ajout):', selectedTournament.tournamentTeams);
    console.log('ID de l\'équipe à ajouter:', teamId);
    
    try {
      // Trouver l'équipe à ajouter
      const teamToAdd = teams.find(t => t.id === teamId);
      if (!teamToAdd) {
        console.error('Équipe non trouvée:', teamId);
        return;
      }
      
      // Vérifier si l'équipe n'est pas déjà dans le tournoi
              const currentTeams = Array.isArray(selectedTournament.tournamentTeams) ? selectedTournament.tournamentTeams : [];
      const isAlreadyInTournament = currentTeams.some(t => t.team?.id === teamId || t.teamId === teamId);
      
      if (isAlreadyInTournament) {
        console.log('Équipe déjà dans le tournoi (vérification frontend)');
        alert('Cette équipe est déjà inscrite au tournoi');
        // Recharger les données pour s'assurer que l'interface est à jour
        await loadData();
        return;
      }
      
      // Utiliser l'API axios configurée
      const { axiosInstance } = await import('../services/api');
      
      console.log('Ajout d\'équipe via axios:', { tournamentId: selectedTournament.id, teamId });
      
      try {
        const response = await axiosInstance.post(`/tournaments/${selectedTournament.id}/teams`, { teamId });
        console.log('Équipe ajoutée au tournoi avec succès:', response.data);
        
        // Récupérer directement les données du tournoi depuis la BD
        console.log('Récupération des données du tournoi depuis la BD...');
        await refreshTournamentData(selectedTournament.id);
        
        console.log('Rechargement terminé');
        
      } catch (error: any) {
        console.error('Erreur axios:', error.response?.data);
        
        // Gérer le cas où l'équipe est déjà inscrite
        if (error.response?.data?.message === "Cette équipe est déjà inscrite au tournoi") {
          console.log('Équipe déjà inscrite - rechargement des données...');
          alert('Cette équipe est déjà inscrite au tournoi');
          // Recharger les données pour synchroniser l'interface
          await loadData();
          return; // Sortir sans erreur
        }
        
        // Pour toute autre erreur, afficher le message
        alert(`Erreur lors de l'ajout de l'équipe: ${error.response?.data?.message || 'Erreur inconnue'}`);
        throw error;
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'équipe au tournoi:', error);
    }
  };

  // Fonction pour récupérer directement les données du tournoi depuis la BD
  const refreshTournamentData = async (tournamentId: string) => {
    try {
      const { axiosInstance } = await import('../services/api');
      
      console.log('Récupération du tournoi depuis la BD:', tournamentId);
      const response = await axiosInstance.get(`/tournaments/${tournamentId}`);
      
      if (response.data.success) {
        console.log('Données du tournoi récupérées:', response.data.data);
        
        // Mettre à jour le state local avec les données fraîches
        const updatedTournament = response.data.data;
        
        // Forcer la mise à jour du state local
        setSelectedTournamentId(null);
        setTimeout(() => {
          setSelectedTournamentId(tournamentId);
        }, 100);
        
        // Recharger aussi toutes les données
        await loadData();
        
        console.log('Données du tournoi mises à jour');
      } else {
        console.error('Erreur lors de la récupération du tournoi:', response.data);
        // Fallback vers loadData
        await loadData();
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du tournoi:', error);
      console.log('Utilisation de loadData() comme fallback...');
      // Fallback vers loadData en cas d'erreur CORS
      await loadData();
    }
  };

  const handleDeleteTournament = async (tournamentId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tournoi ?")) return;
    try {
      const { axiosInstance } = await import('../services/api');
      await axiosInstance.delete(`/tournaments/${tournamentId}`);
      await loadData();
    } catch (error) {
      alert("Erreur lors de la suppression du tournoi.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-orange-900 dark:to-red-900">
      <ReadOnlyBanner />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-800">
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
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
                {isArabic ? '7OUMA البطولات' : '7OUMA Tournois'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {isArabic 
                ? 'أنشئ وأدر بطولات كرة القدم المثيرة'
                : 'Créez et gérez vos tournois de football passionnants'
              }
            </p>
            
            {canCreate && (
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300"
              >
                <Plus className="w-6 h-6 mr-2" />
                {isArabic ? 'إنشاء بطولة جديدة' : 'Créer un tournoi'}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grille des tournois */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            user={user}
            t={t}
            isRTL={isRTL}
            canEdit={canEdit}
            canDelete={canDelete}
            onDrawClick={() => {
              setSelectedTournamentId(tournament.id);
              setShowDrawModal(true);
            }}
            onManageClick={() => {
              setSelectedTournamentId(tournament.id);
              setShowManageModal(true);
            }}
            onDelete={handleDeleteTournament}
            onDetails={() => {
              setSelectedTournamentId(tournament.id);
              setShowManageModal(true);
            }}
            onShowPlayers={() => {
              setSelectedTournamentId(tournament.id);
              setSelectedTournamentPlayers(
                (Array.isArray(tournament.tournamentTeams) ? tournament.tournamentTeams : []).flatMap(team => Array.isArray(team.team?.players) ? team.team.players : [])
              );
              setShowPlayersModal(true);
            }}
            onManage={() => {
              setSelectedTournamentId(tournament.id);
              setShowManageModal(true);
            }}
          />
        ))}
        </motion.div>

        {/* Message si aucun tournoi */}
        {tournaments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <Trophy size={80} className="mx-auto text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                {isArabic ? 'لا توجد بطولات' : 'Aucun tournoi créé'}
              </h3>
              <p className="text-gray-500 text-lg">
                {isArabic ? 'أنشئ بطولتك الأولى للبدء' : 'Créez votre premier tournoi pour commencer'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {showPlayersModal && selectedTournamentId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {isArabic ? 'لاعبو البطولة' : 'Joueurs du tournoi'}
            </h2>
            <ul className="space-y-4">
              {(Array.isArray(tournaments.find(t => t.id === selectedTournamentId)?.tournamentTeams)
                ? tournaments.find(t => t.id === selectedTournamentId)?.tournamentTeams || []
                : []
              ).map((teamObj: any, idx: number) => {
                const team = (teamObj as any).team || teamObj;
                return (
                  <li key={team.id || idx}>
                    <div className="font-bold text-gray-700">{team.name}</div>
                    <ul className="ml-4 list-disc text-gray-600 text-sm">
                      {Array.isArray(team.players) && team.players.length > 0
                        ? team.players.map((player: any, pidx: number) => (
                            <li key={player.id || pidx}>{player.name}</li>
                          ))
                        : <li className="text-gray-400">Aucun joueur</li>
                      }
                    </ul>
                  </li>
                );
              })}
            </ul>
            <button
              className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg"
              onClick={() => setShowPlayersModal(false)}
            >
              {isArabic ? 'إغلاق' : 'Fermer'}
            </button>
          </motion.div>
        </div>
      )}

      <CreateTournamentModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newTournament={newTournament}
        setNewTournament={setNewTournament}
        logoOptions={logoOptions}
        onSubmit={handleCreateTournament}
        t={t}
        isRTL={isRTL}
      />

      <TournamentDrawModal
        show={showDrawModal}
        onClose={() => setShowDrawModal(false)}
        onConfirm={() => selectedTournamentId && handleGenerateGroups(selectedTournamentId, selectedNumberOfGroups)}
        t={t}
        numberOfGroups={selectedNumberOfGroups}
        setNumberOfGroups={setSelectedNumberOfGroups}
      />

      {selectedTournament && (
        <ManageTournamentModal
          show={showManageModal}
          onClose={() => setShowManageModal(false)}
          tournament={selectedTournament}
          teams={teams}
          players={players}
          matches={matches.filter(match => match.tournamentId === selectedTournament.id)}
          groups={tournaments.find(t => t.id === selectedTournamentId)?.groups || []}
          onAddTeam={handleAddTeamToTournament}
          onRemoveTeam={async (teamId) => {
            if (!selectedTournament) return;
            
            console.log('Supprimer équipe du tournoi:', teamId);
            
            try {
              // Utiliser l'API axios configurée
              const { axiosInstance } = await import('../services/api');
              
              console.log('Suppression d\'équipe via axios:', { tournamentId: selectedTournament.id, teamId });
              
              await axiosInstance.delete(`/tournaments/${selectedTournament.id}/teams/${teamId}`);
              console.log('Équipe supprimée du tournoi avec succès');
              
              // Recharger les données pour voir les changements
              await loadData();
              
              // Forcer la mise à jour du state local
              setSelectedTournamentId(null);
              setTimeout(() => setSelectedTournamentId(selectedTournament.id), 0);
              
            } catch (error: any) {
              console.error('Erreur lors de la suppression de l\'équipe du tournoi:', error.response?.data || error);
            }
          }}
          onAddPlayer={(player) => {
            // Debug: voir les données envoyées
            console.log('Données du joueur à envoyer:', player);
            
            // Nettoyer les données avant l'envoi
            const cleanPlayer: CreatePlayerForm = {
              name: player.name,
              position: player.position,
              level: player.level,
              age: player.age,
              teamId: player.teamId || undefined,
              jerseyNumber: player.jerseyNumber || undefined
            };
            
            console.log('Données nettoyées:', cleanPlayer);
            addPlayer(cleanPlayer);
          }}
          onUpdatePlayer={(player) => {
            // Debug: voir les données envoyées
            console.log('Mettre à jour joueur:', player);
            
            // Nettoyer les données avant l'envoi
            const cleanPlayer = {
              name: player.name,
              position: player.position,
              level: player.level,
              age: player.age,
              teamId: player.teamId || undefined,
              jerseyNumber: player.jerseyNumber || undefined
            };
            
            console.log('Données nettoyées pour mise à jour:', cleanPlayer);
            
            // Mettre à jour le joueur via l'API
            fetch(`/api/players/${player.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(cleanPlayer)
            })
            .then(res => res.json())
            .then(data => {
              console.log('Joueur mis à jour:', data);
              // Recharger les données pour voir les changements
              window.location.reload();
            })
            .catch(error => {
              console.error('Erreur lors de la mise à jour du joueur:', error);
            });
          }}
          onRemovePlayer={(playerId) => {
            // Supprimer le joueur via l'API
            console.log('Supprimer joueur:', playerId);
            
            fetch(`/api/players/${playerId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
            .then(res => {
              if (res.ok) {
                console.log('Joueur supprimé avec succès');
                // Recharger les données pour voir les changements
                window.location.reload();
              } else {
                console.error('Erreur lors de la suppression:', res.status);
              }
            })
            .catch(error => {
              console.error('Erreur lors de la suppression du joueur:', error);
            });
          }}
          onAddMatch={(match) => {
            // Ajouter le match au state global
            console.log('Ajouter match:', match);
          }}
          onPerformDraw={(numberOfGroups) => {
            selectedTournamentId && handleGenerateGroups(selectedTournamentId, numberOfGroups);
          }}
          onUpdateGroup={(group) => {
            // Mettre à jour le groupe dans le state global
            console.log('Mettre à jour groupe:', group);
          }}
          onUpdateGroups={(groups) => {
            // Mettre à jour les groupes dans le state global
            console.log('Mettre à jour groupes:', groups);
          }}
          onGenerateMatches={(matchTime) => {
            selectedTournamentId && handleGenerateMatches(selectedTournamentId);
          }}
          onUpdateTournament={(tournament) => {
            // Mettre à jour le tournoi dans le state global
            console.log('Mettre à jour tournoi:', tournament);
          }}
          onCreateTeam={async (teamData) => {
            // Créer l'équipe via l'API
            console.log('Créer équipe:', teamData);
            try {
              const newTeam = await createTeam(teamData as Team);
              console.log('Équipe créée:', newTeam);
              // L'équipe sera automatiquement ajoutée au state global
            } catch (error) {
              console.error('Erreur lors de la création de l\'équipe:', error);
            }
          }}
          onRefreshData={async () => {
            console.log('Rechargement manuel des données...');
            if (selectedTournament) {
              await refreshTournamentData(selectedTournament.id);
            } else {
              await loadData();
            }
          }}
          onUpdateMatchScore={async (matchId: string, homeScore: number, awayScore: number) => {
            try {
              await updateMatchScore(matchId, homeScore, awayScore);
              console.log('Score mis à jour avec succès');
            } catch (error) {
              console.error('Erreur lors de la mise à jour du score:', error);
              throw error;
            }
          }}
        />
      )}
    </div>
  );
};

export default Tournaments;