import React, { useMemo } from 'react';
import { Trophy, Users, Calendar, Target, Award, Clock, Star } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { teams, tournaments, matches, players, isLoading } = useData();
  const { t, isRTL } = useLanguage();

  // Statistiques dynamiques
  const stats = useMemo(() => [
    {
      title: 'Équipes Actives',
      value: teams.length,
      change: '', // Ajoute une logique de progression si tu veux
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Tournois en Cours',
      value: tournaments.filter(t => t.status === 'active').length,
      change: '',
      icon: Trophy,
      color: 'bg-green-500'
    },
    {
      title: 'Matchs Joués',
      value: matches.length,
      change: '',
      icon: Target,
      color: 'bg-orange-500'
    },
    {
      title: 'Joueurs Inscrits',
      value: players.length,
      change: '',
      icon: Award,
      color: 'bg-purple-500'
    }
  ], [teams, tournaments, matches, players]);

  // Matchs récents (3 derniers)
  const recentMatches = useMemo(() =>
    [...matches]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3),
    [matches]
  );

  // Top équipes (exemple : par nombre de victoires)
  const topTeams = useMemo(() =>
    [...teams]
      .sort((a, b) => (b.wins || 0) - (a.wins || 0))
      .slice(0, 4),
    [teams]
  );

  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre ligue de mini-foot</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            Nouveau Tournoi
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  {stat.change && <p className="text-green-600 text-sm font-medium mt-2">{stat.change}</p>}
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Matches */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Matchs Récents</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentMatches.length === 0 ? (
              <div className="text-gray-500 text-center py-8">Aucun match récent</div>
            ) : recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900">
                      {match.homeTeam}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {match.status === 'completed' ? `${match.homeScore} - ${match.awayScore}` : 'VS'}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {match.awayTeam}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{match.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      match.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {match.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Teams */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Équipes</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Classement complet
            </button>
          </div>
          <div className="space-y-4">
            {topTeams.length === 0 ? (
              <div className="text-gray-500 text-center py-8">Aucune équipe</div>
            ) : topTeams.map((team, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="text-2xl">{team.logo || '⚽'}</div>
                  <div>
                    <div className="font-medium text-gray-900">{team.name}</div>
                    <div className="text-sm text-gray-500">
                      {team.wins || 0} victoires sur {team.matches || 0} matchs
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{team.wins * 3 + team.draws || 0}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold mb-2">Actions Rapides</h2>
            <p className="text-green-100">Gérez facilement votre ligue de mini-foot</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Ajouter Équipe
            </button>
            <button className="bg-green-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-300 transition-colors">
              Planifier Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
