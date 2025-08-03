import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { Trophy, Star, Award, Users, Target, Calendar } from 'lucide-react';

const Heroes: React.FC = () => {
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Données des héros (exemple)
  const heroes = [
    {
      id: 1,
      name: language === 'fr' ? 'Ahmed "Le Magicien"' : 'أحمد "الساحر"',
      team: language === 'fr' ? 'Équipe Al-Hilal' : 'فريق الهلال',
      position: language === 'fr' ? 'Attaquant' : 'مهاجم',
      stats: {
        goals: 45,
        assists: 23,
        matches: 28,
        trophies: 3
      },
      achievements: [
        language === 'fr' ? 'Meilleur buteur 2023' : 'أفضل هداف 2023',
        language === 'fr' ? 'Champion de ligue' : 'بطل الدوري',
        language === 'fr' ? 'MVP Finale' : 'أفضل لاعب في النهائي'
      ]
    },
    {
      id: 2,
      name: language === 'fr' ? 'Karim "Le Tank"' : 'كريم "الدبابة"',
      team: language === 'fr' ? 'Équipe Al-Nasr' : 'فريق النصر',
      position: language === 'fr' ? 'Défenseur' : 'مدافع',
      stats: {
        goals: 12,
        assists: 8,
        matches: 32,
        trophies: 2
      },
      achievements: [
        language === 'fr' ? 'Meilleur défenseur' : 'أفضل مدافع',
        language === 'fr' ? 'Leader défensif' : 'قائد دفاعي',
        language === 'fr' ? 'Fair-play award' : 'جائزة الروح الرياضية'
      ]
    },
    {
      id: 3,
      name: language === 'fr' ? 'Youssef "Le Génie"' : 'يوسف "العبقري"',
      team: language === 'fr' ? 'Équipe Al-Ahly' : 'فريق الأهلي',
      position: language === 'fr' ? 'Milieu' : 'لاعب وسط',
      stats: {
        goals: 28,
        assists: 35,
        matches: 30,
        trophies: 4
      },
      achievements: [
        language === 'fr' ? 'Meilleur passeur' : 'أفضل صانع ألعاب',
        language === 'fr' ? 'Champion 2x' : 'بطل مرتين',
        language === 'fr' ? 'Leader technique' : 'قائد تقني'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'fr' ? 'Nos Héros' : 'أبطالنا'}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {language === 'fr' 
            ? 'Découvrez les meilleurs joueurs de notre communauté' 
            : 'اكتشف أفضل اللاعبين في مجتمعنا'
          }
        </p>
      </div>

      {/* Section Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {language === 'fr' ? '9 Trophées' : '9 كؤوس'}
          </h3>
          <p className="text-yellow-100">
            {language === 'fr' ? 'Gagnés cette saison' : 'فازوا هذا الموسم'}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 text-white text-center">
          <Star className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {language === 'fr' ? '156 Buts' : '156 هدف'}
          </h3>
          <p className="text-blue-100">
            {language === 'fr' ? 'Marqués en total' : 'سجلوا في المجموع'}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-6 text-white text-center">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {language === 'fr' ? '90 Matchs' : '90 مباراة'}
          </h3>
          <p className="text-green-100">
            {language === 'fr' ? 'Joués ensemble' : 'لعبوا معاً'}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl p-6 text-white text-center">
          <Award className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {language === 'fr' ? '12 Récompenses' : '12 جائزة'}
          </h3>
          <p className="text-purple-100">
            {language === 'fr' ? 'Distribuées' : 'وزعت'}
          </p>
        </div>
      </div>

      {/* Liste des Héros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {heroes.map((hero) => (
          <div key={hero.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* En-tête du héros */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <h3 className="text-xl font-bold mb-1">{hero.name}</h3>
                  <p className="text-yellow-100 text-sm">{hero.team}</p>
                  <p className="text-yellow-100 text-sm">{hero.position}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{hero.stats.trophies}</div>
                  <div className="text-xs text-yellow-100">
                    {language === 'fr' ? 'Trophées' : 'كؤوس'}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hero.stats.goals}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'fr' ? 'Buts' : 'أهداف'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hero.stats.assists}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'fr' ? 'Passes' : 'تمريرات'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hero.stats.matches}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'fr' ? 'Matchs' : 'مباريات'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hero.stats.trophies}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'fr' ? 'Trophées' : 'كؤوس'}
                  </div>
                </div>
              </div>

              {/* Réalisations */}
              <div>
                <h4 className={`font-semibold text-gray-900 dark:text-white mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'fr' ? 'Réalisations' : 'الإنجازات'}
                </h4>
                <div className="space-y-2">
                  {hero.achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Call-to-Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'fr' ? 'Devenez un Héros' : 'كن بطلاً'}
          </h2>
          <p className="text-xl mb-6">
            {language === 'fr' 
              ? 'Rejoignez la compétition et écrivez votre histoire' 
              : 'انضم للمنافسة واكتب قصتك'
            }
          </p>
          <button className="bg-white text-yellow-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
            {language === 'fr' ? 'Participer maintenant' : 'شارك الآن'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Heroes; 