import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, QrCode, Wifi, WifiOff, Download, ExternalLink } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import Button3D from './ui/Button3D'

const MobileApp: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const phoneVariants = {
    initial: { rotateY: -15, rotateX: 5 },
    hover: { 
      rotateY: 0, 
      rotateX: 0,
      y: -10,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const screenVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3
      }
    }
  }

  const features = [
    {
      icon: QrCode,
      title: isArabic ? 'مسح QR' : 'Scan QR',
      description: isArabic ? 'انضم للبطولات بسرعة' : 'Rejoignez les tournois rapidement'
    },
    {
      icon: Wifi,
      title: isArabic ? 'وضع عدم الاتصال' : 'Mode Offline',
      description: isArabic ? 'استخدم التطبيق بدون إنترنت' : 'Utilisez l\'app sans connexion'
    },
    {
      icon: Smartphone,
      title: isArabic ? 'إحصائيات مباشرة' : 'Stats en direct',
      description: isArabic ? 'تابع النتائج والمباريات' : 'Suivez les résultats et matchs'
    }
  ]

  return (
    <section className="relative py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Contenu texte */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
                         <div>
               <motion.div
                 initial={{ scale: 0.8 }}
                 whileInView={{ scale: 1 }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl"
               >
                 <Smartphone className="w-10 h-10 text-white" />
               </motion.div>
               
                               <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                  <span className="text-gray-900">
                    {isArabic ? 'التطبيق المحمول' : 'App Mobile'}
                  </span>
                </h2>
               
                               <motion.p 
                  className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {isArabic 
                    ? 'احمل تطبيق 7OUMA LIGUE على هاتفك واستمتع بتجربة كاملة حتى بدون إنترنت مع تقنيات متقدمة'
                    : 'Téléchargez l\'app 7OUMA LIGUE sur votre téléphone et profitez d\'une expérience complète même sans connexion avec des technologies avancées'
                  }
                </motion.p>
             </div>

                         {/* Fonctionnalités avec design pro */}
             <div className="space-y-6">
               {features.map((feature, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, x: -30, scale: 0.9 }}
                   whileInView={{ opacity: 1, x: 0, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ 
                     duration: 0.6, 
                     delay: index * 0.2,
                     ease: "easeOut"
                   }}
                   whileHover={{ 
                     x: 10,
                     scale: 1.02,
                     transition: { duration: 0.3 }
                   }}
                   className="group"
                 >
                                       <div className="relative p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed font-medium">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                 </motion.div>
               ))}
             </div>

                         {/* Boutons de téléchargement avec design pro */}
             <div className="space-y-6">
               <div className="flex flex-col sm:flex-row gap-4">
                                   <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Download className="w-6 h-6" />
                      <span>{isArabic ? 'Google Play' : 'Google Play'}</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    className="px-8 py-4 border-2 border-blue-500 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 font-bold text-lg rounded-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Download className="w-6 h-6" />
                      <span>{isArabic ? 'App Store' : 'App Store'}</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
               </div>

                               {/* Badge "Prochainement" simple */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="inline-flex items-center space-x-3 px-6 py-3 bg-yellow-100 border border-yellow-300 rounded-full"
                >
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-yellow-800">
                    {isArabic ? 'قريباً' : 'Prochainement'}
                  </span>
                </motion.div>
             </div>
          </motion.div>

                                {/* App Image simple et grande */}
           <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex justify-center lg:justify-end"
           >
             <div className="relative">
               <img 
                 src="/app.png" 
                 alt="7OUMA LIGUE Mobile App" 
                 className="w-full max-w-lg h-auto object-contain"
               />
             </div>
           </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MobileApp 