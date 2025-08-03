import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Trophy, Users, Sparkles, ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Hero3D: React.FC = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const floatingBallVariants: Variants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 360],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const glowVariants: Variants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

                       return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#0F2027] overflow-hidden -mt-16">
      {/* Background Image - Optimisé */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 md:opacity-40"
        style={{
          backgroundImage: 'url(/background2.png)',
          filter: 'blur(0.5px)'
        }}
      />
      
      {/* Overlay sombre réduit */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F2027]/80 via-[#203A43]/60 to-[#0F2027]/80" />
      
      {/* Animated Background Elements - Légers */}
      <div className="absolute inset-0">
        {/* Floating Particles - Réduits */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFEB3B] rounded-full opacity-20 hidden md:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Floating Ball - Plus discret */}
        <motion.div
          className="absolute top-16 right-16 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#FFEB3B] to-[#FF9800] rounded-full shadow-lg"
          variants={floatingBallVariants}
          animate="animate"
        >
          <div className="w-full h-full bg-gradient-to-br from-[#FFEB3B] to-[#FF9800] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
            ⚽
          </div>
        </motion.div>
      </div>

                    {/* Content Container - Centré verticalement */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center pt-16">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
                     {/* Logo and Brand - Plus net */}
           <motion.div 
             className="mb-8 md:mb-12"
             variants={itemVariants}
           >
             <div className="flex items-center justify-center space-x-4 mb-6">
               <motion.div
                 className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-xl"
                 variants={glowVariants}
                 animate="animate"
               >
                 <img 
                   src="/logo.png" 
                   alt="7ouma Ligue Logo" 
                   className="w-full h-full object-contain"
                 />
               </motion.div>
               <div className="text-left">
                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                   <span className="bg-gradient-to-r from-[#4CAF50] to-[#FFEB3B] bg-clip-text text-transparent">
                     7OUMA
                   </span>
                   <span className="text-white ml-2">LIGUE</span>
                 </h1>
               </div>
             </div>
           </motion.div>

          {/* Main Title - Simplifié et impactant */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-[#4CAF50] via-[#FFEB3B] to-[#4CAF50] bg-clip-text text-transparent">
              {isArabic ? 'أنشئ. العب. شارك.' : 'Crée. Joue. Partage.'}
            </span>
            <br />
            <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {isArabic ? 'دوري ذكي لكرة القدم المصغرة.' : 'Ligue intelligente pour mini-foot.'}
            </span>
          </motion.h1>

          {/* Subtitle - Simplifié */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {isArabic 
              ? 'نظم بسهولة بطولات محلية لكرة القدم المصغرة مع أدوات حديثة وإحصائيات وعرض مباشر.'
              : 'Organise facilement des tournois locaux de mini-foot avec outils modernes, stats, et affichage en direct.'
            }
          </motion.p>

          {/* CTA Buttons - Optimisés */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={itemVariants}
          >
            {/* Primary CTA - Jaune vif */}
            <motion.button
              onClick={() => navigate('/tournaments')}
              className="group relative px-8 py-4 bg-[#FFC107] text-black font-bold text-lg rounded-2xl shadow-xl hover:shadow-[#FFC107]/25 transition-all duration-300 transform hover:scale-105 hover:bg-[#FF9800]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>{isArabic ? 'إنشاء بطولة' : 'Créer un tournoi'}</span>
                <Trophy className="w-6 h-6" />
              </div>
            </motion.button>

            {/* Secondary CTA - Blanc avec bord cyan */}
            <motion.button
              onClick={() => navigate('/tournaments')}
              className="group px-8 py-4 border-2 border-[#00BCD4] text-white font-bold text-lg rounded-2xl hover:bg-[#00BCD4]/10 transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6" />
                <span>{isArabic ? 'استكشف المنصة' : 'Explorer la plateforme'}</span>
                <motion.div
                  className="w-6 h-6"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>

          

          
        </motion.div>
      </div>

      {/* Bottom Gradient - Plus subtil */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0F2027] to-transparent" />
    </div>
  );
};

export default Hero3D; 