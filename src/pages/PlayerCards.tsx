import React, { useState } from 'react'
import { PlayerCard } from '../components/Players/PlayerCard'
import { Player } from '../types'

const PlayerCards: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [showStats, setShowStats] = useState(true)

  // Données de test pour les cartes de joueur
  const mockPlayers: Player[] = [
    {
      id: '1',
      name: 'Ahmed Ben Ali',
      position: 'Attaquant',
      level: 5,
      age: 25,
      teamId: '1',
      jerseyNumber: 10,
      team: {
        id: '1',
        name: 'Équipe A',
        logo: ''
      }
    },
    {
      id: '2',
      name: 'Mohamed Salah',
      position: 'Milieu',
      level: 4,
      age: 28,
      teamId: '1',
      jerseyNumber: 8,
      team: {
        id: '1',
        name: 'Équipe A',
        logo: ''
      }
    },
    {
      id: '3',
      name: 'Karim Benzema',
      position: 'Défenseur',
      level: 3,
      age: 30,
      teamId: '2',
      jerseyNumber: 4,
      team: {
        id: '2',
        name: 'Équipe B',
        logo: ''
      }
    },
    {
      id: '4',
      name: 'Youssef Msakni',
      position: 'Gardien',
      level: 4,
      age: 27,
      teamId: '2',
      jerseyNumber: 1,
      team: {
        id: '2',
        name: 'Équipe B',
        logo: ''
      }
    },
    {
      id: '5',
      name: 'Hamza Lahmar',
      position: 'Attaquant',
      level: 5,
      age: 24,
      teamId: '3',
      jerseyNumber: 9,
      team: {
        id: '3',
        name: 'Équipe C',
        logo: ''
      }
    },
    {
      id: '6',
      name: 'Oussama Idrissi',
      position: 'Milieu',
      level: 4,
      age: 26,
      teamId: '3',
      jerseyNumber: 7,
      team: {
        id: '3',
        name: 'Équipe C',
        logo: ''
      }
    },
    {
      id: '7',
      name: 'Achraf Hakimi',
      position: 'Défenseur',
      level: 4,
      age: 23,
      teamId: '4',
      jerseyNumber: 2,
      team: {
        id: '4',
        name: 'Équipe D',
        logo: ''
      }
    },
    {
      id: '8',
      name: 'Yassine Bounou',
      position: 'Gardien',
      level: 5,
      age: 31,
      teamId: '4',
      jerseyNumber: 1,
      team: {
        id: '4',
        name: 'Équipe D',
        logo: ''
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Cartes de Joueur - Style FIFA
          </h1>
          <p className="text-gray-300">
            Collectionnez et admirez les cartes de vos joueurs préférés
          </p>
        </div>

        {/* Contrôles */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Options d'affichage</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Taille des cartes
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as 'small' | 'medium' | 'large')}
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="small">Petite</option>
                <option value="medium">Moyenne</option>
                <option value="large">Grande</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showStats"
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500"
              />
              <label htmlFor="showStats" className="text-sm font-medium text-gray-300">
                Afficher les statistiques
              </label>
            </div>
          </div>
        </div>

        {/* Grille des cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockPlayers.map((player) => (
            <div key={player.id} className="flex justify-center">
              <PlayerCard
                player={player}
                size={selectedSize}
                showStats={showStats}
                isHoverable={true}
              />
            </div>
          ))}
        </div>

        {/* Statistiques */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Statistiques de la Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{mockPlayers.length}</div>
              <div className="text-gray-300">Joueurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {mockPlayers.filter(p => p.level >= 4).length}
              </div>
              <div className="text-gray-300">Niveau 4+</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {mockPlayers.filter(p => p.position === 'Attaquant').length}
              </div>
              <div className="text-gray-300">Attaquants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">
                {mockPlayers.filter(p => p.position === 'Gardien').length}
              </div>
              <div className="text-gray-300">Gardiens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCards 