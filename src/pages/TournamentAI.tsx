import React, { useState } from 'react'
import { TahiaCoach } from '../components/AI/TahiaCoach'
import { TournamentSuggestion } from '../../../backend/src/utils/tournamentAI'

const TournamentAI: React.FC = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<TournamentSuggestion | null>(null)

  const handleSuggestionSelect = (suggestion: TournamentSuggestion) => {
    setSelectedSuggestion(suggestion)
    console.log('Suggestion sélectionnée:', suggestion)
  }

  const handleAction = (action: string, data?: any) => {
    console.log('Action demandée:', action, data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Assistant AI - Tahia Coach
          </h1>
          <p className="text-gray-600 text-lg">
            Votre assistant intelligent pour organiser des tournois parfaits
          </p>
        </div>

        {/* Section d'information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🤖 Tahia Coach
            </h2>
            <p className="text-gray-600 mb-4">
              Tahia Coach est votre assistant AI personnel qui vous aide à :
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Choisir le meilleur format de tournoi
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Calculer la durée et le nombre de matchs
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Planifier les groupes et les matchs
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Analyser les statistiques
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💡 Fonctionnalités
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Générateur de tournoi intelligent</h3>
                  <p className="text-gray-600 text-sm">Suggère automatiquement le format optimal selon vos contraintes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Assistant multilingue</h3>
                  <p className="text-gray-600 text-sm">Support complet en français et arabe</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Recommandations personnalisées</h3>
                  <p className="text-gray-600 text-sm">Adapté à votre contexte et vos besoins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion sélectionnée */}
        {selectedSuggestion && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ✅ Suggestion Sélectionnée
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {selectedSuggestion.description}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Format:</strong> {selectedSuggestion.format}</p>
                  <p><strong>Groupes:</strong> {selectedSuggestion.numberOfGroups}</p>
                  <p><strong>Équipes par groupe:</strong> {selectedSuggestion.teamsPerGroup}</p>
                  <p><strong>Matchs totaux:</strong> {selectedSuggestion.totalMatches}</p>
                  <p><strong>Durée estimée:</strong> {selectedSuggestion.estimatedDuration}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Avantages:</h4>
                <ul className="space-y-1 text-gray-600">
                  {selectedSuggestion.advantages.map((advantage, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Appliquer cette suggestion
              </button>
              <button 
                onClick={() => setSelectedSuggestion(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Choisir une autre suggestion
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🚀 Comment utiliser Tahia Coach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Cliquez sur l'assistant</h3>
              <p className="text-gray-600 text-sm">
                Utilisez le bouton flottant en bas à droite pour ouvrir Tahia Coach
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Posez votre question</h3>
              <p className="text-gray-600 text-sm">
                Décrivez votre tournoi ou utilisez les actions rapides
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Recevez des suggestions</h3>
              <p className="text-gray-600 text-sm">
                Choisissez parmi les recommandations personnalisées
              </p>
            </div>
          </div>
        </div>

        {/* Exemples de questions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            💬 Exemples de questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 font-medium">"J'ai 12 équipes, quel format me recommandes-tu ?"</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 font-medium">"Aide-moi à former les groupes pour 8 équipes"</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 font-medium">"Quel joueur a marqué le plus de buts ?"</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 font-medium">"Planifie les matchs pour ce weekend"</p>
            </div>
          </div>
        </div>

        {/* Assistant AI flottant */}
        <TahiaCoach
          onSuggestionSelect={handleSuggestionSelect}
          onAction={handleAction}
        />
      </div>
    </div>
  )
}

export default TournamentAI 