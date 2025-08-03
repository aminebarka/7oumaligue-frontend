import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import { Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, User, Target, Calendar, Award, Users, Star } from 'lucide-react';
import { Player, Team, CreatePlayerForm } from '../types';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

const Players: React.FC = () => {
  const { user } = useAuth();
  const { players, teams, addPlayer, updatePlayer, deletePlayer, loadData } = useData();
  const { t, isRTL } = useLanguage();
  const { canEdit, canDelete, canCreate } = usePermissions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'age' | 'team'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [newPlayer, setNewPlayer] = useState<CreatePlayerForm>({
    name: '',
    position: 'Attaquant',
    level: 1,
    age: 18,
    teamId: undefined,
    jerseyNumber: undefined
  });

  useEffect(() => {
    if (!showCreateModal) {
      setNewPlayer({
        name: '',
        position: 'Attaquant',
        level: 1,
        age: 18,
        teamId: undefined,
        jerseyNumber: undefined
      });
    }
  }, [showCreateModal]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeam, selectedLevel]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Filtrer et trier les joueurs selon les critères
  const filteredPlayers = players
    .filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           player.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = selectedTeam === 'all' || player.teamId === selectedTeam;
      const matchesLevel = selectedLevel === 'all' || player.level.toString() === selectedLevel;
      
      return matchesSearch && matchesTeam && matchesLevel;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'level':
          comparison = a.level - b.level;
          break;
        case 'age':
          comparison = a.age - b.age;
          break;
        case 'team':
          const teamA = getTeamName(a.teamId);
          const teamB = getTeamName(b.teamId);
          comparison = teamA.localeCompare(teamB);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPlayer(newPlayer);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erreur lors de la création du joueur:', error);
    }
  };

  const handleUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    
    try {
      await updatePlayer(editingPlayer);
      setEditingPlayer(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du joueur:', error);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) return;
    
    try {
      await deletePlayer(playerId);
    } catch (error) {
      console.error('Erreur lors de la suppression du joueur:', error);
    }
  };

  // Fonction pour exporter les joueurs en CSV
  const handleExportCSV = () => {
    try {
      // En-têtes du CSV (format professionnel simplifié)
      const headers = [
        'Nom',
        'Position', 
        'Niveau',
        'Âge',
        'Équipe',
        'Numéro'
      ];

      // Données des joueurs
      const csvData = players.map(p => [
        `"${p.name}"`, // Guillemets pour éviter les problèmes avec les virgules dans les noms
        p.position,
        p.level,
        p.age,
        `"${getTeamName(p.teamId)}"`,
        p.jerseyNumber || ''
      ]);

      // Créer le contenu CSV
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      // Encoder et télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `joueurs_7oumaligue_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Notification de succès
      alert(`✅ Export réussi ! ${players.length} joueurs exportés.\n\n📄 Format: Nom, Position, Niveau, Âge, Équipe, Numéro`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('❌ Erreur lors de l\'export CSV');
    }
  };

  // Fonction pour importer des joueurs depuis un CSV
  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.txt';
    input.multiple = false;
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // Vérifier la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('❌ Le fichier est trop volumineux. Taille maximum : 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const csv = e.target?.result as string;
            const lines = csv.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
              alert('❌ Le fichier CSV doit contenir au moins une ligne d\'en-tête et une ligne de données');
              return;
            }

            // Parser les en-têtes avec plus de flexibilité
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            
            // Détection intelligente des colonnes
            const nameIndex = headers.findIndex(h => 
              h.includes('nom') || h.includes('name') || h.includes('prénom') || h.includes('firstname')
            );
            const positionIndex = headers.findIndex(h => 
              h.includes('position') || h.includes('poste') || h.includes('role')
            );
            const levelIndex = headers.findIndex(h => 
              h.includes('niveau') || h.includes('level') || h.includes('skill')
            );
            const ageIndex = headers.findIndex(h => 
              h.includes('âge') || h.includes('age') || h.includes('years')
            );
            const teamIndex = headers.findIndex(h => 
              h.includes('équipe') || h.includes('team') || h.includes('club')
            );
            const jerseyIndex = headers.findIndex(h => 
              h.includes('numéro') || h.includes('jersey') || h.includes('maillot') || h.includes('number')
            );

            // Vérifier les colonnes obligatoires
            if (nameIndex === -1) {
              alert('❌ Colonne "Nom" manquante dans le fichier CSV\n\n📋 Colonnes détectées: ' + headers.join(', '));
              return;
            }

            // Afficher les colonnes détectées
            console.log('Colonnes détectées:', {
              nom: nameIndex >= 0 ? headers[nameIndex] : 'Non trouvé',
              position: positionIndex >= 0 ? headers[positionIndex] : 'Non trouvé',
              niveau: levelIndex >= 0 ? headers[levelIndex] : 'Non trouvé',
              age: ageIndex >= 0 ? headers[ageIndex] : 'Non trouvé',
              equipe: teamIndex >= 0 ? headers[teamIndex] : 'Non trouvé',
              numero: jerseyIndex >= 0 ? headers[jerseyIndex] : 'Non trouvé'
            });

            // Confirmer l'import avec plus d'informations
            const dataLines = lines.slice(1);
            const requiredColumns = [];
            if (nameIndex >= 0) requiredColumns.push('✅ Nom');
            if (positionIndex >= 0) requiredColumns.push('✅ Position');
            if (levelIndex >= 0) requiredColumns.push('✅ Niveau');
            if (ageIndex >= 0) requiredColumns.push('✅ Âge');
            if (teamIndex >= 0) requiredColumns.push('✅ Équipe');
            if (jerseyIndex >= 0) requiredColumns.push('✅ Numéro');

            const confirmImport = window.confirm(
              `📋 Import CSV détecté\n\n` +
              `📄 Fichier: ${file.name}\n` +
              `👥 Joueurs à importer: ${dataLines.length}\n\n` +
              `📊 Colonnes détectées:\n${requiredColumns.join('\n')}\n\n` +
              `⚠️  Attention: Cette opération va créer ${dataLines.length} nouveaux joueurs.\n\n` +
              `Voulez-vous continuer ?`
            );

            if (!confirmImport) return;

            // Traiter chaque ligne
            let successCount = 0;
            let errorCount = 0;
            const errors: string[] = [];

            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;

              try {
                // Parser la ligne en tenant compte des guillemets
                const values = parseCSVLine(line);
                
                if (values.length < Math.max(nameIndex, positionIndex, levelIndex, ageIndex) + 1) {
                  errors.push(`Ligne ${i + 1}: Données insuffisantes`);
                  errorCount++;
                  continue;
                }

                // Extraire et valider les données avec plus de flexibilité
                const name = values[nameIndex]?.trim().replace(/"/g, '') || '';
                
                // Position avec validation intelligente
                let position = 'Attaquant'; // Valeur par défaut
                if (positionIndex >= 0 && values[positionIndex]) {
                  const posValue = values[positionIndex].trim().replace(/"/g, '').toLowerCase();
                  if (posValue.includes('attaquant') || posValue.includes('forward') || posValue.includes('striker')) {
                    position = 'Attaquant';
                  } else if (posValue.includes('milieu') || posValue.includes('midfielder') || posValue.includes('mid')) {
                    position = 'Milieu';
                  } else if (posValue.includes('défenseur') || posValue.includes('defender') || posValue.includes('def')) {
                    position = 'Défenseur';
                  } else if (posValue.includes('gardien') || posValue.includes('goalkeeper') || posValue.includes('gk')) {
                    position = 'Gardien';
                  } else {
                    position = 'Attaquant'; // Valeur par défaut
                  }
                }

                // Niveau avec validation
                let level = 1; // Valeur par défaut
                if (levelIndex >= 0 && values[levelIndex]) {
                  const levelValue = parseInt(values[levelIndex].trim());
                  if (!isNaN(levelValue) && levelValue >= 1 && levelValue <= 10) {
                    level = levelValue;
                  }
                }

                // Âge avec validation
                let age = 18; // Valeur par défaut
                if (ageIndex >= 0 && values[ageIndex]) {
                  const ageValue = parseInt(values[ageIndex].trim());
                  if (!isNaN(ageValue) && ageValue >= 16 && ageValue <= 50) {
                    age = ageValue;
                  }
                }

                // Équipe (optionnel)
                const teamName = teamIndex >= 0 ? values[teamIndex]?.trim().replace(/"/g, '') || '' : '';
                
                // Numéro de maillot (optionnel)
                let jerseyNumber = undefined;
                if (jerseyIndex >= 0 && values[jerseyIndex]) {
                  const jerseyValue = parseInt(values[jerseyIndex].trim());
                  if (!isNaN(jerseyValue) && jerseyValue > 0 && jerseyValue <= 99) {
                    jerseyNumber = jerseyValue;
                  }
                }

                // Validation des données obligatoires
                if (!name) {
                  errors.push(`Ligne ${i + 1}: Nom manquant`);
                  errorCount++;
                  continue;
                }

                // Trouver l'équipe par nom si fourni
                let teamId = undefined;
                if (teamName) {
                  const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
                  teamId = team?.id;
                  if (!team) {
                    console.warn(`Équipe "${teamName}" non trouvée pour le joueur "${name}"`);
                  }
                }

                // Créer le joueur
                const playerData = {
                  name,
                  position: ['Attaquant', 'Milieu', 'Défenseur', 'Gardien'].includes(position) 
                    ? position 
                    : 'Attaquant',
                  level,
                  age,
                  teamId,
                  jerseyNumber: jerseyNumber && jerseyNumber > 0 && jerseyNumber <= 99 ? jerseyNumber : undefined
                };

                // await createPlayer(playerData);
                successCount++;

                // Afficher le progrès tous les 10 joueurs
                if (successCount % 10 === 0) {
                  console.log(`Import en cours: ${successCount}/${dataLines.length} joueurs traités`);
                }

              } catch (error) {
                errors.push(`Ligne ${i + 1}: Erreur de parsing`);
                errorCount++;
                console.error(`Erreur ligne ${i + 1}:`, error);
              }
            }

            // Afficher le résultat
            let resultMessage = `✅ Import terminé !\n\n`;
            resultMessage += `✅ Joueurs créés: ${successCount}\n`;
            if (errorCount > 0) {
              resultMessage += `❌ Erreurs: ${errorCount}\n`;
            }
            resultMessage += `\nTotal traité: ${dataLines.length}`;

            if (errors.length > 0) {
              resultMessage += `\n\nErreurs détaillées:\n${errors.slice(0, 5).join('\n')}`;
              if (errors.length > 5) {
                resultMessage += `\n... et ${errors.length - 5} autres erreurs`;
              }
            }

            alert(resultMessage);

            // Recharger les données
            await loadData();

          } catch (error) {
            console.error('Erreur lors du parsing CSV:', error);
            alert('❌ Erreur lors du parsing du fichier CSV');
          }
        };

        reader.readAsText(file, 'UTF-8');

      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        alert('❌ Erreur lors de l\'import du fichier');
      }
    };

    input.click();
  };

  // Fonction utilitaire pour parser une ligne CSV en tenant compte des guillemets
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const getTeamName = (teamId: string | undefined) => {
    if (!teamId) return 'Sans équipe';
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Équipe inconnue';
  };

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'text-red-600 bg-red-100';
    if (level >= 6) return 'text-orange-600 bg-orange-100';
    if (level >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Attaquant': return 'bg-red-100 text-red-800';
      case 'Milieu': return 'bg-blue-100 text-blue-800';
      case 'Défenseur': return 'bg-green-100 text-green-800';
      case 'Gardien': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: players.length,
    withTeam: players.filter(p => p.teamId).length,
    withoutTeam: players.filter(p => !p.teamId).length,
    averageLevel: players.length > 0 ? (players.reduce((acc, p) => acc + p.level, 0) / players.length).toFixed(1) : '0',
    topLevel: players.length > 0 ? Math.max(...players.map(p => p.level)) : 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReadOnlyBanner />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t("players.management")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
            {t("players.manage.all")}
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>{t("players.add.player")}</span>
          </button>
        )}
      </div>

      {/* Section pour gestion en masse */}
      {canEdit && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🚀 {t("players.mass.management")} ({players.length} {t("common.players")})
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {t("players.mass.management.desc")}
              </p>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                <strong>{t("players.csv.format")}</strong> {t("common.name")}, {t("common.position")}, {t("common.level")}, {t("common.age")}, {t("common.team")}, {t("players.jersey")}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                title={t("players.export.csv")}
              >
                <span>📊</span>
                <span>{t("players.export.csv")}</span>
              </button>
              <button
                onClick={handleImportCSV}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                title={t("players.import.csv")}
              >
                <span>📥</span>
                <span>{t("players.import.csv")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t("players.total")}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.withTeam}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t("players.with.team")}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.withoutTeam}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t("players.without.team")}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageLevel}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t("players.average.level")}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Award size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.topLevel}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t("players.max.level")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder={t("players.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filtre par équipe */}
          <div className="lg:w-48">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{t("players.all.teams")}</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          {/* Filtre par niveau */}
          <div className="lg:w-32">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{t("players.all.levels")}</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <option key={level} value={level.toString()}>{t("common.level")} {level}</option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className="lg:w-40">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="level-desc">Niveau ↓</option>
              <option value="level-asc">Niveau ↑</option>
              <option value="age-asc">Âge ↑</option>
              <option value="age-desc">Âge ↓</option>
              <option value="team-asc">Équipe A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des joueurs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("common.player.name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("common.position")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("common.level")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("common.age")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("common.team")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("players.jersey")}
                </th>
                {canEdit && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("common.actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{player.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(player.position)}`}>
                      {player.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(player.level)}`}>
                      Niveau {player.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {player.age} ans
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getTeamName(player.teamId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.jerseyNumber || '-'}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingPlayer(player)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDeletePlayer(player.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentPlayers.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">Aucun joueur trouvé</p>
            <p className="text-sm text-gray-500">Modifiez vos filtres pour voir les joueurs disponibles</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(endIndex, filteredPlayers.length)} sur {filteredPlayers.length} joueurs
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-green-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter un joueur</h2>
            <form onSubmit={handleCreatePlayer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value as "Gardien" | "Défenseur" | "Milieu" | "Attaquant" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Attaquant">Attaquant</option>
                  <option value="Milieu">Milieu</option>
                  <option value="Défenseur">Défenseur</option>
                  <option value="Gardien">Gardien</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    value={newPlayer.level}
                    onChange={(e) => setNewPlayer({ ...newPlayer, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                      <option key={level} value={level}>Niveau {level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                  <input
                    type="number"
                    min="16"
                    max="50"
                    required
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer({ ...newPlayer, age: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipe (optionnel)</label>
                <select
                  value={newPlayer.teamId || ''}
                  onChange={(e) => setNewPlayer({ ...newPlayer, teamId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sans équipe</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de maillot (optionnel)</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newPlayer.jerseyNumber || ''}
                  onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier le joueur</h2>
            <form onSubmit={handleUpdatePlayer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={editingPlayer.position}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value as "Gardien" | "Défenseur" | "Milieu" | "Attaquant" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Attaquant">Attaquant</option>
                  <option value="Milieu">Milieu</option>
                  <option value="Défenseur">Défenseur</option>
                  <option value="Gardien">Gardien</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    value={editingPlayer.level}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                      <option key={level} value={level}>Niveau {level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                  <input
                    type="number"
                    min="16"
                    max="50"
                    required
                    value={editingPlayer.age}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, age: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipe (optionnel)</label>
                <select
                  value={editingPlayer.teamId || ''}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, teamId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sans équipe</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de maillot (optionnel)</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={editingPlayer.jerseyNumber || ''}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, jerseyNumber: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPlayer(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players; 