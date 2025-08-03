import React, { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Wallet, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'
import { paymentService, PaymentTransaction } from '../services/advancedApi'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  color: string
  available: boolean
}

// Suppression de l'interface locale car elle est maintenant importée

const PaymentCenter: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [amount, setAmount] = useState<number>(50)
  const [tournamentId, setTournamentId] = useState<string>('')
  const [teamId, setTeamId] = useState<string>('')
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'flouci',
      name: 'Flouci',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Paiement mobile rapide et sécurisé',
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'd17',
      name: 'D17',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Solution de paiement mobile tunisienne',
      color: 'bg-green-500',
      available: true
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, American Express',
      color: 'bg-purple-500',
      available: true
    },
    {
      id: 'cash',
      name: 'Espèces',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Paiement en espèces au stade',
      color: 'bg-orange-500',
      available: true
    }
  ]

  // Charger les transactions depuis l'API
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true)
        const transactionsData = await paymentService.getTransactions()
        setTransactions(transactionsData)
        setError(null)
      } catch (error) {
        console.error('Erreur lors du chargement des transactions:', error)
        setError('Erreur lors du chargement des transactions')
        // Fallback vers des données de test
        setTransactions([
          {
            id: '1',
            transactionId: 'TXN001',
            tournamentId: '1',
            teamId: '1',
            amount: 50,
            commission: 2.5,
            netAmount: 47.5,
            paymentMethod: 'Flouci',
            playerCount: 8,
            organizerId: 1,
            status: 'completed',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            tournament: { name: 'Tournoi d\'Été 2024' },
            team: { name: 'Équipe A' }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const handlePayment = async () => {
    if (!selectedMethod || !amount || !tournamentId || !teamId) {
      alert('Veuillez remplir tous les champs')
      return
    }

    try {
      const result = await paymentService.createPayment({
        tournamentId,
        teamId,
        amount,
        paymentMethod: selectedMethod,
        playerCount: 8 // Valeur par défaut
      })

      // Redirection vers la passerelle de paiement
      if (result.paymentUrl) {
        window.open(result.paymentUrl, '_blank')
      } else {
        alert('Paiement initié ! Transaction ID: ' + result.transactionId)
      }

      // Recharger les transactions
      const updatedTransactions = await paymentService.getTransactions()
      setTransactions(updatedTransactions)
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
      alert('Erreur lors du paiement. Veuillez réessayer.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Payé'
      case 'pending':
        return 'En cours'
      case 'failed':
        return 'Échoué'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Centre de Paiement
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez vos paiements et inscriptions aux tournois
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de paiement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Nouveau Paiement
            </h2>

            <div className="space-y-6">
              {/* Informations du tournoi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournoi
                </label>
                <select
                  value={tournamentId}
                  onChange={(e) => setTournamentId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Sélectionner un tournoi</option>
                  <option value="1">Tournoi d'Été 2024 - 50 DT</option>
                  <option value="2">Championnat Local - 75 DT</option>
                  <option value="3">Tournoi Amical - 30 DT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Équipe
                </label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Sélectionner une équipe</option>
                  <option value="1">Équipe A</option>
                  <option value="2">Équipe B</option>
                  <option value="3">Équipe C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (DT)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="50"
                />
              </div>

              {/* Méthodes de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      disabled={!method.available}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedMethod === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${method.color} text-white rounded-lg flex items-center justify-center`}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={handlePayment}
                disabled={!selectedMethod || !amount}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Procéder au paiement</span>
                </div>
              </button>
            </div>
          </div>

          {/* Historique des transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Historique des Paiements
            </h2>

            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune transaction trouvée
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {transaction.tournament?.name || 'Tournoi inconnu'}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Équipe:</strong> {transaction.team?.name || 'Équipe inconnue'}</p>
                        <p><strong>Montant:</strong> {transaction.amount} DT</p>
                        <p><strong>Commission:</strong> {transaction.commission} DT</p>
                        <p><strong>Méthode:</strong> {transaction.paymentMethod}</p>
                        <p><strong>Joueurs:</strong> {transaction.playerCount}</p>
                        <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Statistiques */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {transactions.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Payés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {transactions.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">En cours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {transactions.filter(t => t.status === 'failed').length}
                  </div>
                  <div className="text-sm text-gray-600">Échoués</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentCenter 