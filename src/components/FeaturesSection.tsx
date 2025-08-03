import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Trophy, Users, Calendar, TrendingUp, Star, Shield, Zap, Heart } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import Card3D from './ui/Card3D'

const FeaturesSection: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const navigate = useNavigate()

  const features = [
    {
      icon: Trophy,
      title: isArabic ? "إدارة البطولات" : "Gestion de Tournois",
      description: isArabic 
        ? "أنشئ وأدر بطولات كرة القدم المصغرة بسهولة مع نظام تلقائي للجداول والنتائج"
        : "Créez et gérez vos tournois de football à 7 avec un système automatique de planning et de résultats",
      color: "from-yellow-500 to-orange-500",
      delay: 0.1
    },
    {
      icon: Users,
      title: isArabic ? "إدارة الفرق" : "Gestion d'Équipes",
      description: isArabic
        ? "أدر فرقك ولاعبيك مع إحصائيات مفصلة ومتابعة الأداء"
        : "Gérez vos équipes et joueurs avec des statistiques détaillées et un suivi de performance",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: Calendar,
      title: isArabic ? "جدولة المباريات" : "Planification de Matchs",
      description: isArabic
        ? "جدولة تلقائية للمباريات مع نظام تنبيهات ذكي للفرق والجمهور"
        : "Planification automatique des matchs avec un système de notifications intelligent pour les équipes et le public",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: TrendingUp,
      title: isArabic ? "الإحصائيات المتقدمة" : "Statistiques Avancées",
      description: isArabic
        ? "إحصائيات مفصلة للاعبين والفرق مع تحليلات الأداء والتصنيفات"
        : "Statistiques détaillées des joueurs et équipes avec analyses de performance et classements",
      color: "from-purple-500 to-pink-500",
      delay: 0.4
    },
    {
      icon: Star,
      title: isArabic ? "المجتمع والتفاعل" : "Communauté & Interaction",
      description: isArabic
        ? "منصة اجتماعية للتفاعل بين اللاعبين والجماهير مع نظام التقييم والجوائز"
        : "Plateforme sociale pour l'interaction entre joueurs et supporters avec système de notation et récompenses",
      color: "from-pink-500 to-rose-500",
      delay: 0.5
    },
    {
      icon: Shield,
      title: isArabic ? "الأمان والحماية" : "Sécurité & Protection",
      description: isArabic
        ? "نظام أمان متقدم لحماية البيانات الشخصية والمالية مع تشفير كامل"
        : "Système de sécurité avancé pour protéger les données personnelles et financières avec chiffrement complet",
      color: "from-gray-500 to-slate-500",
      delay: 0.6
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {isArabic ? "مميزات منصة 7OUMA LIGUE" : "Fonctionnalités de 7OUMA LIGUE"}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {isArabic
              ? "منصة شاملة لإدارة بطولات كرة القدم المصغرة مع أحدث التقنيات والواجهات الحديثة"
              : "Une plateforme complète pour gérer vos tournois de football à 7 avec les dernières technologies et interfaces modernes"
            }
          </p>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ delay: feature.delay }}
            >
              <Card3D
                variant="feature"
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                interactive={true}
                className="h-full"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>

        {/* Section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                <Zap className="w-10 h-10" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {isArabic ? "ابدأ رحلتك مع 7OUMA LIGUE" : "Commencez votre aventure avec 7OUMA LIGUE"}
              </h3>
              <p className="text-xl mb-8 opacity-90">
                {isArabic
                  ? "انضم إلى مجتمع كرة القدم المصغرة الأكبر في تونس"
                  : "Rejoignez la plus grande communauté de football à 7 du Tunisie"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
                >
                  {isArabic ? "إنشاء حساب مجاني" : "Créer un compte gratuit"}
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-orange-600 transition-all duration-300"
                >
                  {isArabic ? "اكتشف المزيد" : "Découvrir plus"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection 