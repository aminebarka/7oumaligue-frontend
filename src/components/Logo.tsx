import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  className = '' 
}) => {
  const { language } = useLanguage();

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <img 
          src="/logo.png" 
          alt="7ouma Ligue Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold text-gray-900 dark:text-white leading-tight`}>
            7ouma Ligue
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {language === 'fr' ? 'Mini-foot Communautaire' : 'كرة القدم المصغرة المجتمعية'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo; 