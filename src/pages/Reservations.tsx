import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ReservationCalendar from '../components/ReservationCalendar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Filter, 
  Plus, 
  Users, 
  Trophy, 
  Target,
  Building,
  BarChart3,
  FileText,
  Bell
} from 'lucide-react';

const Reservations: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'statistics' | 'history'>('calendar');
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);

  const tabs = [
    {
      id: 'calendar',
      name: 'Calendrier',
      icon: Calendar,
      description: 'Vue interactive des réservations'
    },
    {
      id: 'list',
      name: 'Liste',
      icon: FileText,
      description: 'Liste détaillée des réservations'
    },
    {
      id: 'statistics',
      name: 'Statistiques',
      icon: BarChart3,
      description: 'Analyses et rapports'
    },
    {
      id: 'history',
      name: 'Historique',
      icon: Clock,
      description: 'Historique des réservations'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <ReservationCalendar 
            showNewReservationModal={showNewReservationModal}
            onShowNewReservationModal={setShowNewReservationModal}
          />
        );
      case 'list':
        return (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Liste des Réservations</h3>
            <p className="text-gray-600">Fonctionnalité en cours de développement...</p>
          </div>
        );
      case 'statistics':
        return (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
            <p className="text-gray-600">Fonctionnalité en cours de développement...</p>
          </div>
        );
      case 'history':
        return (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Historique</h3>
            <p className="text-gray-600">Fonctionnalité en cours de développement...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="mr-3 text-blue-600" size={32} />
                Réservations de Terrains
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez vos réservations de terrains de football avec notre système complet
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowNewReservationModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Réservation
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Réservations actives</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terrains disponibles</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Heures réservées</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Matchs joués</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg shadow border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* Informations utiles */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Comment réserver ?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  1
                </div>
                <p>Sélectionnez un créneau libre dans le calendrier</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  2
                </div>
                <p>Remplissez les informations de votre réservation</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  3
                </div>
                <p>Confirmez votre réservation</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  4
                </div>
                <p>Recevez une confirmation par email</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Types de réservations
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Trophy className="w-4 h-4 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Match</p>
                  <p className="text-sm text-gray-600">Réservation pour un match officiel</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Target className="w-4 h-4 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Entraînement</p>
                  <p className="text-sm text-gray-600">Session d'entraînement d'équipe</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Trophy className="w-4 h-4 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Tournoi</p>
                  <p className="text-sm text-gray-600">Événement sportif spécial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
