import React, { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Sparkles, Trophy, Users, BarChart3 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const TahiaCoachAI: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: isArabic 
        ? 'مرحباً! أنا طاهية المدرب، مساعدتك الذكي لإدارة البطولات. كيف يمكنني مساعدتك؟'
        : 'Salut ! Je suis Tahia Coach, votre assistant intelligent pour gérer les tournois. Comment puis-je vous aider ?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const quickActions = [
    {
      icon: Trophy,
      text: isArabic ? 'عرض المجموعات' : 'Montrer les groupes',
      action: () => handleQuickAction('Montrer les groupes')
    },
    {
      icon: Users,
      text: isArabic ? 'أفضل اللاعبين' : 'Meilleurs joueurs',
      action: () => handleQuickAction('Quel joueur a le plus de buts ?')
    },
    {
      icon: BarChart3,
      text: isArabic ? 'الإحصائيات' : 'Statistiques',
      action: () => handleQuickAction('Afficher les statistiques')
    }
  ]

  const handleQuickAction = (action: string) => {
    // Ajouter le message utilisateur
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: action,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Simuler la réponse AI
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        'Montrer les groupes': isArabic 
          ? 'هنا مجموعات البطولة الحالية:\n\nالمجموعة أ:\n- فريق 1 (6 نقاط)\n- فريق 2 (4 نقاط)\n- فريق 3 (3 نقاط)\n\nالمجموعة ب:\n- فريق 4 (5 نقاط)\n- فريق 5 (2 نقاط)\n- فريق 6 (1 نقطة)'
          : 'Voici les groupes du tournoi actuel :\n\nGroupe A :\n- Équipe 1 (6 points)\n- Équipe 2 (4 points)\n- Équipe 3 (3 points)\n\nGroupe B :\n- Équipe 4 (5 points)\n- Équipe 5 (2 points)\n- Équipe 6 (1 point)',
        'Quel joueur a le plus de buts ?': isArabic
          ? 'أحمد بن علي هو أفضل هداف البطولة بـ 24 هدفاً، يليه يوسف العمراني بـ 18 هدفاً.'
          : 'Ahmed Ben Ali est le meilleur buteur du tournoi avec 24 buts, suivi de Youssef El Amrani avec 18 buts.',
        'Afficher les statistiques': isArabic
          ? 'إحصائيات البطولة:\n- إجمالي المباريات: 45\n- إجمالي الأهداف: 127\n- متوسط الأهداف/مباراة: 2.8\n- أفضل هداف: أحمد بن علي (24 هدف)'
          : 'Statistiques du tournoi :\n- Total matchs : 45\n- Total buts : 127\n- Moyenne buts/match : 2.8\n- Meilleur buteur : Ahmed Ben Ali (24 buts)'
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses[action] || 'Je ne comprends pas cette demande. Pouvez-vous reformuler ?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simuler la réponse AI
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: isArabic 
          ? 'شكراً لسؤالك! سأقوم بتحليل طلبك والرد عليك قريباً.'
          : 'Merci pour votre question ! Je vais analyser votre demande et vous répondre bientôt.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const chatVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 100,
      transition: {
        duration: 0.2
      }
    }
  }

  const messageVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <>
      {/* Bouton flottant moderne */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-accent to-accent-light rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isOpen 
            ? '0 0 30px rgba(0, 201, 167, 0.8)' 
            : '0 0 20px rgba(0, 201, 167, 0.5)'
        }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Interface de chat moderne sans cadres */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col"
          >
            {/* Header moderne */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-light rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {isArabic ? 'طاهية المدرب' : 'Tahia Coach'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isArabic ? 'مساعد ذكي' : 'Assistant IA'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isArabic ? 'متصل' : 'En ligne'}
                </span>
              </div>
            </div>

            {/* Messages sans cadres */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs p-4 rounded-3xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-secondary to-secondary-light text-primary' 
                      : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-900 dark:text-white'
                  }`}>
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                    <div className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Actions rapides modernes */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {isArabic ? 'إجراءات سريعة:' : 'Actions rapides :'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={action.action}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100/80 dark:bg-gray-700/80 rounded-2xl text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <action.icon className="w-4 h-4" />
                      <span>{action.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input moderne */}
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isArabic ? 'اكتب رسالتك...' : 'Tapez votre message...'}
                  className="flex-1 px-4 py-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-gradient-to-r from-accent to-accent-light rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur de disponibilité moderne */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-24 right-6 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {isArabic ? 'تحتاج مساعدة؟' : 'Besoin d\'aide ?'}
            </span>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default TahiaCoachAI 