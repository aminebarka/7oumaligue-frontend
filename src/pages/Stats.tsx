import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { BarChart3, Trophy, Target, Users, Award, TrendingUp, Calendar, Medal } from 'lucide-react';

const Stats: React.FC = () => {
  const { user } = useAuth();
  const { teams, matches } = useData();
  const { t, isRTL } = useLanguage();
  const [selectedView, setSelectedView] = useState<'teams' | 'players' | 'matches'>('teams');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier que les données sont chargées
  if (!teams || teams.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement des statistiques...</div>
        </div>
      </div>
    );
  }

  const completedMatches = matches?.filter(m => m.status === 'completed') || [];
  const totalGoals = completedMatches.reduce((acc, match) => acc + (match.homeScore || 0) + (match.awayScore || 0), 0);
  const averageGoalsPerMatch = completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(1) : '0';

  const teamStats = teams.map(team => {
    // Calculate stats from team properties
    const wins = team.wins || 0;
    const draws = team.draws || 0;
    const losses = team.losses || 0;
    const goals = team.goals || 0;
    const goalsAgainst = team.goalsAgainst || 0;
    const matches = team.matches || 0;
    
    return {
      ...team,
      points: (wins * 3) + (draws * 1),
      goalDifference: goals - goalsAgainst,
      winRate: matches > 0 ? ((wins / matches) * 100).toFixed(1) : '0'
    };
  }).sort((a, b) => b.points - a.points);

  const topScorers = [
    { name: 'Ahmed Bennani', team: 'FC Lions', goals: 8, matches: 12 },
    { name: 'Youssef Alami', team: 'Eagles FC', goals: 6, matches: 10 },
    { name: 'Karim Zidane', team: 'Wolves United', goals: 5, matches: 11 },
    { name: 'Omar Tazi', team: 'FC Lions', goals: 4, matches: 9 },
    { name: 'Mehdi Rahimi', team: 'Eagles FC', goals: 4, matches: 8 }
  ];

  const assistLeaders = [
    { name: 'Mohamed Chraibi', team: 'FC Lions', assists: 5, matches: 12 },
    { name: 'Reda Mansouri', team: 'Eagles FC', assists: 4, matches: 10 },
    { name: 'Ismail Kadiri', team: 'Wolves United', assists: 3, matches: 11 },
    { name: 'Zakaria Boulahcen', team: 'Wolves United', assists: 3, matches: 9 },
    { name: 'Nabil Squalli', team: 'Wolves United', assists: 2, matches: 8 }
  ];

  const globalStats = [
    { label: 'Équipes Actives', value: teams.length, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Matchs Joués', value: completedMatches.length, icon: Calendar, color: 'from-green-500 to-green-600' },
    { label: 'Buts Marqués', value: totalGoals, icon: Target, color: 'from-red-500 to-red-600' },
    { label: 'Moyenne Buts/Match', value: averageGoalsPerMatch, icon: TrendingUp, color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques</h1>
        <p className="text-gray-600">
          Analysez les performances des équipes et joueurs
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {globalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg card-hover">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Selector */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedView('teams')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedView === 'teams'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Classement Équipes
        </button>
        <button
          onClick={() => setSelectedView('players')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedView === 'players'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Statistiques Joueurs
        </button>
        <button
          onClick={() => setSelectedView('matches')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedView === 'matches'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Historique Matchs
        </button>
      </div>

      {selectedView === 'teams' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Trophy className="mr-2" size={24} />
              Classement des Équipes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MJ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">G</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamStats.map((team, index) => (
                  <tr key={team.id} className={index < 3 ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <Medal className="text-yellow-500 mr-2" size={20} />}
                        {index === 1 && <Medal className="text-gray-400 mr-2" size={20} />}
                        {index === 2 && <Medal className="text-yellow-600 mr-2" size={20} />}
                        <span className="font-medium">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{team.logo}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.coach}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.matches || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{team.wins || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">{team.draws || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{team.losses || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.goals || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.goalsAgainst || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedView === 'players' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Scorers */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Target className="mr-2" size={24} />
                Meilleurs Buteurs
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topScorers.map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.team}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{player.goals}</div>
                      <div className="text-sm text-gray-500">{player.matches} matchs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assist Leaders */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Award className="mr-2" size={24} />
                Meilleurs Passeurs
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {assistLeaders.map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.team}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{player.assists}</div>
                      <div className="text-sm text-gray-500">{player.matches} matchs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'matches' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="mr-2" size={24} />
              Historique des Matchs
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {completedMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{match.homeTeam}</span>
                      <span className="text-2xl font-bold text-green-600">{match.homeScore}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-2xl font-bold text-green-600">{match.awayScore}</span>
                      <span className="font-medium">{match.awayTeam}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{match.venue}</div>
                    <div className="text-xs text-gray-400 capitalize">{match.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
