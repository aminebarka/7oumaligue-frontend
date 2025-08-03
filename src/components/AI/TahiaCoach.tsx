import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Bot, Lightbulb, Trophy, Users, Clock, Target } from 'lucide-react'
import { TournamentSuggestion, TournamentConstraints } from '../../types'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: TournamentSuggestion[]
  action?: string
}

interface TahiaCoachProps {
  onSuggestionSelect?: (suggestion: TournamentSuggestion) => void
  onAction?: (action: string, data?: any) => void
}

export const TahiaCoach: React.FC<TahiaCoachProps> = ({
  onSuggestionSelect,
  onAction
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحبا! أنا طاهية كوتش، مساعدتك الذكي لتنظيم البطولات! كيف يمكنني مساعدتك  اليوم؟',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, type: 'user' | 'assistant', suggestions?: TournamentSuggestion[], action?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions,
      action
    }
    setMessages(prev => [...prev, newMessage])
  }

  const simulateTyping = async (response: string, suggestions?: TournamentSuggestion[], action?: string) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    addMessage(response, 'assistant', suggestions, action)
    setIsTyping(false)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    addMessage(userMessage, 'user')
    setInputValue('')

    // Analyser le message et générer une réponse
    const response = await generateResponse(userMessage)
  }

  const generateResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('بطولة') || lowerMessage.includes('tournament')) {
      if (lowerMessage.includes('12') || lowerMessage.includes('اثنتي عشرة')) {
        const suggestions = generateTournamentSuggestions(12)
        await simulateTyping(
          'ممتاز! لـ 12 فريق، إليك أفضل الخيارات:',
          suggestions,
          'tournament_suggestions'
        )
      } else if (lowerMessage.includes('8') || lowerMessage.includes('ثمانية')) {
        const suggestions = generateTournamentSuggestions(8)
        await simulateTyping(
          'لـ 8 فرق، هذه أفضل التنسيقات:',
          suggestions,
          'tournament_suggestions'
        )
      } else {
        await simulateTyping(
          'أخبرني بعدد الفرق وسأساعدك في اختيار أفضل تنسيق للبطولة!'
        )
      }
    } else if (lowerMessage.includes('مجموعات') || lowerMessage.includes('groups')) {
      await simulateTyping(
        'سأساعدك في تشكيل المجموعات! كم عدد الفرق لديك؟'
      )
    } else if (lowerMessage.includes('مباريات') || lowerMessage.includes('matches')) {
      await simulateTyping(
        'لجدولة المباريات، أحتاج معرفة: عدد الفرق، المدة المتاحة، وعدد الملاعب.'
      )
    } else if (lowerMessage.includes('إحصائيات') || lowerMessage.includes('stats')) {
      await simulateTyping(
        'يمكنني مساعدتك في تحليل الإحصائيات! ما الذي تريد معرفته تحديداً؟'
      )
    } else {
      await simulateTyping(
        'أنا هنا لمساعدتك في تنظيم البطولات! يمكنني اقتراح التنسيقات، جدولة المباريات، وتحليل الإحصائيات. ما الذي تحتاج إليه؟'
      )
    }
  }

  const generateTournamentSuggestions = (teams: number): TournamentSuggestion[] => {
    const constraints: TournamentConstraints = {
      numberOfTeams: teams,
      maxDuration: '1d',
      availableFields: 1,
      maxMatchesPerDay: 8,
      includeThirdPlace: true
    }

    // Simuler les suggestions de l'AI
    const suggestions: TournamentSuggestion[] = []

    if (teams === 12) {
      suggestions.push({
        format: 'groups',
        numberOfGroups: 3,
        teamsPerGroup: 4,
        totalMatches: 18,
        estimatedDuration: '1 jour',
        description: '3 مجموعات من 4 فرق، مرحلة المجموعات + إقصائيات',
        advantages: [
          'توازن مثالي بين الفرق',
          'كل فريق يلعب 3 مباريات على الأقل',
          'تنسيق معياري ومعترف به',
          'إمكانية تأهل أفضل ثالث'
        ],
        disadvantages: [
          'المزيد من المباريات لتنظيمها',
          'يتطلب المزيد من الوقت'
        ],
        recommended: true
      })

      suggestions.push({
        format: 'knockout',
        numberOfGroups: 0,
        teamsPerGroup: 0,
        totalMatches: 11,
        estimatedDuration: '4 ساعات',
        description: 'إقصائي مباشر مع 4 فرق معفاة',
        advantages: [
          'أسرع تنسيق',
          'أقصى درجات التشويق',
          'قليل من المباريات لتنظيمها'
        ],
        disadvantages: [
          'الفرق تُقصى بسرعة',
          'لا توجد فرصة ثانية',
          'يعتمد على القرعة'
        ],
        recommended: false
      })
    }

    return suggestions
  }

  const handleSuggestionSelect = (suggestion: TournamentSuggestion) => {
    onSuggestionSelect?.(suggestion)
    addMessage(`تم اختيار: ${suggestion.description}`, 'user')
  }

  const quickActions = [
    { icon: Trophy, label: 'اقتراح بطولة', action: 'suggest_tournament' },
    { icon: Users, label: 'تشكيل مجموعات', action: 'form_groups' },
    { icon: Clock, label: 'جدولة مباريات', action: 'schedule_matches' },
    { icon: Target, label: 'تحليل إحصائيات', action: 'analyze_stats' }
  ]

  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg flex items-center justify-center text-white z-50"
      >
        <Bot className="w-8 h-8" />
      </motion.button>

      {/* Modal du chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 100 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-96 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">طاهية كوتش</h3>
                      <p className="text-sm opacity-90">المساعد الذكي للبطولات</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSuggestionSelect(suggestion)}
                              className={`w-full p-3 rounded-lg text-left text-xs border ${
                                suggestion.recommended
                                  ? 'bg-green-50 border-green-200 text-green-800'
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold">{suggestion.description}</span>
                                {suggestion.recommended && (
                                  <span className="text-green-600">⭐ موصى به</span>
                                )}
                              </div>
                              <div className="text-xs opacity-75">
                                {suggestion.totalMatches} مباراة • {suggestion.estimatedDuration}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick actions */}
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.action}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        addMessage(action.label, 'user')
                        generateResponse(action.label)
                      }}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                    >
                      <action.icon className="w-4 h-4 text-orange-500" />
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 