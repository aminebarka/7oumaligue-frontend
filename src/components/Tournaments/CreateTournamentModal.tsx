import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, Users, Calendar, MapPin, Brain } from 'lucide-react';
import { tournamentAIService } from '../../services/advancedApi';
import { stadiumService, Stadium } from '../../services/stadiumApi';
import { TournamentSuggestion, TournamentConstraints } from '../../types/ai';

// Types locaux pour ce composant
interface LocalTournamentSuggestion {
  description: string;
  format: string;
  numberOfGroups: number;
  teamsPerGroup: number;
  totalMatches: number;
  estimatedDuration: string;
  advantages: string[];
  isRecommended?: boolean;
}

interface CreateTournamentModalProps {
  show: boolean;
  onClose: () => void;
  newTournament: any;
  setNewTournament: React.Dispatch<React.SetStateAction<any>>;
  logoOptions: string[];
  onSubmit: (e: React.FormEvent) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  show,
  onClose,
  newTournament,
  setNewTournament,
  logoOptions,
  onSubmit,
  t,
  isRTL
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'ai'>('basic');
  const [teamsCount, setTeamsCount] = useState(8);
  const [aiSuggestions, setAiSuggestions] = useState<LocalTournamentSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<LocalTournamentSuggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [stadiumsLoading, setStadiumsLoading] = useState(false);

  // Charger les stades au montage du composant
  useEffect(() => {
    loadStadiums();
  }, []);

  const loadStadiums = async () => {
    setStadiumsLoading(true);
    try {
      console.log('🔄 Chargement des stades...');
      console.log('🔑 Token disponible:', !!localStorage.getItem('token'));
      console.log('🌐 URL API:', `${window.location.origin.replace('3000', '5000')}/stadiums/public`);
      
      const stadiumsData = await stadiumService.getStadiums();
      console.log('✅ Stades chargés:', stadiumsData);
      console.log('📊 Nombre de stades:', stadiumsData.length);
      console.log('📋 Type de données:', typeof stadiumsData);
      console.log('📋 Est un tableau:', Array.isArray(stadiumsData));
      
      if (stadiumsData.length === 0) {
        console.log('⚠️ Aucun stade récupéré de l\'API');
        console.log('💡 Vérifiez que:');
        console.log('   1. Le serveur backend est démarré');
        console.log('   2. L\'API /api/stadiums/public répond');
        console.log('   3. Il y a des stades en base de données');
      } else {
        console.log('📋 Stades récupérés:');
        stadiumsData.forEach((stadium, index) => {
          console.log(`  ${index + 1}. ${stadium.name} - ${stadium.city} (ID: ${stadium.id})`);
        });
      }
      
      setStadiums(stadiumsData);
    } catch (error: any) {
      console.error('❌ Erreur lors du chargement des stades:', error);
      console.error('📋 Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors du chargement des stades. Vérifiez la console pour plus de détails.');
    } finally {
      setStadiumsLoading(false);
    }
  };

  if (!show) return null;

  // Fonction pour gérer le changement de nombre de groupes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setNewTournament({ 
      ...newTournament, 
      numberOfGroups: isNaN(numValue) ? 0 : numValue 
    });
  };

  // Fonction pour obtenir des suggestions AI
  const getAISuggestions = async () => {
    if (teamsCount < 4) {
      alert('Le nombre minimum d\'équipes est de 4');
      return;
    }

    setAiLoading(true);
    try {
      const constraints: TournamentConstraints = {
        maxTeams: teamsCount,
        maxDuration: "2 weeks",
        preferredFormat: "league",
        specialRequirements: []
      };
      
      const suggestions = await tournamentAIService.getSuggestions(constraints);
      
      // Convertir les suggestions API en format local
      const localSuggestions: LocalTournamentSuggestion[] = suggestions.map(suggestion => ({
        description: suggestion.description,
        format: suggestion.complexity === 'easy' ? 'League' : suggestion.complexity === 'medium' ? 'Cup' : 'Mixed',
        numberOfGroups: Math.ceil(suggestion.teamsCount / 4),
        teamsPerGroup: 4,
        totalMatches: suggestion.teamsCount * 2,
        estimatedDuration: suggestion.duration,
        advantages: suggestion.features,
        isRecommended: suggestion.complexity === 'easy'
      }));
      
      setAiSuggestions(localSuggestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      alert('Erreur lors de la récupération des suggestions AI');
    } finally {
      setAiLoading(false);
    }
  };

  // Appliquer une suggestion AI
  const applySuggestion = (suggestion: LocalTournamentSuggestion) => {
    setNewTournament({
      ...newTournament,
      numberOfGroups: String(suggestion.numberOfGroups),
      teamsPerGroup: String(suggestion.teamsPerGroup)
    });
    setSelectedSuggestion(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un Nouveau Tournoi</h2>
        
        {/* Onglets */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Informations de base</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'ai'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Assistant AI</span>
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'basic' && (
          <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tournaments.create.name')}
            </label>
            <input
              type="text"
              required
              value={newTournament.name}
              onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Championnat d'Été 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tournaments.create.logo')}
            </label>
            
            {/* Option 1: Sélection d'emoji */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Ou choisissez un emoji :</p>
              <div className="grid grid-cols-5 gap-2">
                {logoOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewTournament({ ...newTournament, logo: emoji })}
                    className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                      newTournament.logo === emoji
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 2: Upload d'image */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Ou importez votre logo :</p>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        setNewTournament({ ...newTournament, logo: result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Parcourir
                </button>
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const result = event.target?.result as string;
                      setNewTournament({ ...newTournament, logo: result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </div>

            {/* Aperçu du logo sélectionné */}
            {newTournament.logo && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                <div className="flex items-center space-x-4">
                  {newTournament.logo.startsWith('data:image') ? (
                    <img
                      src={newTournament.logo}
                      alt="Logo preview"
                      className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 text-3xl flex items-center justify-center rounded-lg border-2 border-gray-200">
                      {newTournament.logo}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setNewTournament({ ...newTournament, logo: '🏆' })}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tournaments.create.start')}
              </label>
              <input
                type="date"
                required
                value={newTournament.startDate}
                onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tournaments.create.end')}
              </label>
              <input
                type="date"
                required
                value={newTournament.endDate}
                onChange={(e) => setNewTournament({ ...newTournament, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tournaments.create.prize')}
            </label>
            <input
              type="text"
              required
              value={newTournament.prize}
              onChange={(e) => setNewTournament({ ...newTournament, prize: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: 1000 MAD + Trophée"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tournaments.create.rules')}
            </label>
            <textarea
              required
              value={newTournament.rules}
              onChange={(e) => setNewTournament({ ...newTournament, rules: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Format coupe - Élimination directe - Matchs de 2x20 minutes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stade
            </label>
            <select
              value={newTournament.stadium || ''}
              onChange={(e) => setNewTournament({ ...newTournament, stadium: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Sélectionner un stade</option>
              {stadiumsLoading ? (
                <option value="">Chargement des stades...</option>
              ) : stadiums.length === 0 ? (
                <option value="">Aucun stade trouvé</option>
              ) : (
                stadiums.map((stadium) => (
                  <option key={String(stadium.id)} value={stadium.name}>
                    {stadium.name} - {stadium.city}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tournaments.create.groups')}
            </label>
            <input
              type="number"
              min="1"
              max="8"
              required
              value={newTournament.numberOfGroups || 0}
              onChange={handleNumberChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nombre de groupes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tournaments.create.teamsPerGroup')}
            </label>
            <input
              type="number"
              min="2"
              max="8"
              required
              value={newTournament.teamsPerGroup || 0}
              onChange={(e) => setNewTournament({ 
                ...newTournament, 
                teamsPerGroup: parseInt(e.target.value) || 0 
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Équipes par groupe"
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary text-white px-4 py-2 rounded-lg font-medium"
            >
              {t('tournaments.create')}
            </button>
          </div>
        </form>
        )}

        {/* Onglet AI */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                🤖 Assistant AI - Tahia Coach
              </h3>
              <p className="text-blue-700 text-sm">
                Laissez notre IA vous suggérer le meilleur format de tournoi selon vos contraintes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'équipes
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  min="4"
                  max="32"
                  value={teamsCount}
                  onChange={(e) => setTeamsCount(parseInt(e.target.value) || 8)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nombre d'équipes"
                />
                <button
                  type="button"
                  onClick={getAISuggestions}
                  disabled={aiLoading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {aiLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyse...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Obtenir des suggestions</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Suggestions AI */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Suggestions de format ({aiSuggestions.length})
                </h3>
                <div className="grid gap-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSuggestion === suggestion
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {suggestion.description}
                            {suggestion.isRecommended && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Recommandé
                              </span>
                            )}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Format:</strong> {suggestion.format}</p>
                              <p><strong>Groupes:</strong> {suggestion.numberOfGroups}</p>
                              <p><strong>Équipes/groupe:</strong> {suggestion.teamsPerGroup}</p>
                            </div>
                            <div>
                              <p><strong>Matchs totaux:</strong> {suggestion.totalMatches}</p>
                              <p><strong>Durée estimée:</strong> {suggestion.estimatedDuration}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Avantages:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {suggestion.advantages.map((advantage, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  {advantage}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {selectedSuggestion === suggestion && (
                          <div className="ml-4">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour aux informations
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!selectedSuggestion}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Créer avec ce format
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTournamentModal;