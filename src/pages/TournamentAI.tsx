import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, Calendar, Target, Brain, Sparkles, ArrowRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { TournamentSuggestion, TournamentConstraints } from '../types/ai'

const TournamentAI: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  
  const [constraints, setConstraints] = useState<TournamentConstraints>({
    maxTeams: 8,
    maxDuration: '2 weeks',
    preferredFormat: 'league',
    specialRequirements: []
  })

  const [suggestions, setSuggestions] = useState<TournamentSuggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSuggestions = async () => {
    setIsGenerating(true)
    
    // Simulation d'IA - suggestions basées sur les contraintes
    const mockSuggestions: TournamentSuggestion[] = [
      {
        id: '1',
        name: isArabic ? 'بطولة الدوري المصغرة' : 'Mini League Tournament',
        description: isArabic 
          ? 'بطولة دوري بسيطة ومنظمة مع 8 فرق'
          : 'Simple and organized league tournament with 8 teams',
        teamsCount: 8,
        duration: '1 week',
        complexity: 'easy',
        features: [
          isArabic ? 'دوري ذهاب وإياب' : 'Round-robin format',
          isArabic ? 'جدول تلقائي' : 'Automatic scheduling',
          isArabic ? 'إحصائيات مفصلة' : 'Detailed statistics'
        ]
      },
      {
        id: '2',
        name: isArabic ? 'كأس التصفية' : 'Knockout Cup',
        description: isArabic 
          ? 'بطولة إقصائية مثيرة مع 16 فريق'
          : 'Exciting knockout tournament with 16 teams',
        teamsCount: 16,
        duration: '2 weeks',
        complexity: 'medium',
        features: [
          isArabic ? 'نظام إقصائي' : 'Knockout system',
          isArabic ? 'مباريات مثيرة' : 'Thrilling matches',
          isArabic ? 'تصفيات نهائية' : 'Final playoffs'
        ]
      },
      {
        id: '3',
        name: isArabic ? 'بطولة المهارات المتقدمة' : 'Advanced Skills Tournament',
        description: isArabic 
          ? 'بطولة متقدمة مع قواعد خاصة وتحديات'
          : 'Advanced tournament with special rules and challenges',
        teamsCount: 12,
        duration: '3 weeks',
        complexity: 'hard',
        features: [
          isArabic ? 'قواعد متقدمة' : 'Advanced rules',
          isArabic ? 'تحديات خاصة' : 'Special challenges',
          isArabic ? 'نظام نقاط معقد' : 'Complex scoring system'
        ]
      }
    ]

    // Simuler un délai d'IA
    setTimeout(() => {
      setSuggestions(mockSuggestions)
      setIsGenerating(false)
    }, 2000)
  }

  const handleConstraintChange = (field: keyof TournamentConstraints, value: any) => {
    setConstraints(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getComplexityColor = (complexity: string): string => {
    switch (complexity) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplexityText = (complexity: string): string => {
    switch (complexity) {
      case 'easy': return isArabic ? 'سهل' : 'Easy'
      case 'medium': return isArabic ? 'متوسط' : 'Medium'
      case 'hard': return isArabic ? 'صعب' : 'Hard'
      default: return complexity
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-6xl font-black text-white">
              {isArabic ? '7OUMA' : '7OUMA'} 
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {isArabic ? ' الذكي' : ' AI'}
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {isArabic 
              ? 'دع الذكاء الاصطناعي يساعدك في تصميم بطولات مثالية'
              : 'Let artificial intelligence help you design perfect tournaments'
            }
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration des contraintes */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                {isArabic ? 'تحديد المتطلبات' : 'Define Requirements'}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isArabic ? 'الحد الأقصى للفرق' : 'Maximum Teams'}
                </label>
                <input
                  type="number"
                  value={constraints.maxTeams}
                  onChange={(e) => handleConstraintChange('maxTeams', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  min="4"
                  max="32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isArabic ? 'المدة القصوى' : 'Maximum Duration'}
                </label>
                <select
                  value={constraints.maxDuration}
                  onChange={(e) => handleConstraintChange('maxDuration', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="1 week">{isArabic ? 'أسبوع واحد' : '1 week'}</option>
                  <option value="2 weeks">{isArabic ? 'أسبوعان' : '2 weeks'}</option>
                  <option value="3 weeks">{isArabic ? '3 أسابيع' : '3 weeks'}</option>
                  <option value="1 month">{isArabic ? 'شهر واحد' : '1 month'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isArabic ? 'التنسيق المفضل' : 'Preferred Format'}
                </label>
                <select
                  value={constraints.preferredFormat}
                  onChange={(e) => handleConstraintChange('preferredFormat', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="league">{isArabic ? 'دوري' : 'League'}</option>
                  <option value="cup">{isArabic ? 'كأس' : 'Cup'}</option>
                  <option value="mixed">{isArabic ? 'مختلط' : 'Mixed'}</option>
                </select>
              </div>

              <button
                onClick={generateSuggestions}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    {isArabic ? 'جاري التوليد...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    {isArabic ? 'توليد الاقتراحات' : 'Generate Suggestions'}
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Suggestions générées */}
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {suggestion.name}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {suggestion.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(suggestion.complexity)}`}>
                    {getComplexityText(suggestion.complexity)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-300">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{suggestion.teamsCount} {isArabic ? 'فرق' : 'teams'}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{suggestion.duration}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'المميزات:' : 'Features:'}
                  </h4>
                  <ul className="space-y-1">
                    {suggestion.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-400 flex items-center">
                        <ArrowRight className="w-3 h-3 mr-2 text-purple-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  {isArabic ? 'إنشاء البطولة' : 'Create Tournament'}
                </button>
              </motion.div>
            ))}

            {suggestions.length === 0 && !isGenerating && (
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center"
              >
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {isArabic ? 'لا توجد اقتراحات بعد' : 'No suggestions yet'}
                </h3>
                <p className="text-gray-300">
                  {isArabic 
                    ? 'حدد متطلباتك واضغط على "توليد الاقتراحات"'
                    : 'Define your requirements and click "Generate Suggestions"'
                  }
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TournamentAI 