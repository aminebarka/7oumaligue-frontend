import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LogoImage from './LogoImage';

interface LogoWithTextProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'horizontal' | 'vertical';
  showSubtitle?: boolean;
  className?: string;
}

const LogoWithText: React.FC<LogoWithTextProps> = ({ 
  size = 'medium', 
  variant = 'horizontal',
  showSubtitle = true,
  className = '' 
}) => {
  const { language } = useLanguage();

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
    xl: 'text-3xl'
  };

  const subtitleSizes = {
    small: 'text-xs',
    medium: 'text-xs',
    large: 'text-sm',
    xl: 'text-base'
  };

  const logoSize = size === 'xl' ? 'large' : size;

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <LogoImage size={logoSize} />
        <div className="text-center">
          <h1 className={`${textSizes[size]} font-bold text-gray-900 dark:text-white leading-tight`}>
            7ouma Ligue
          </h1>
          {showSubtitle && (
            <p className={`${subtitleSizes[size]} text-gray-600 dark:text-gray-300 mt-1`}>
              {language === 'fr' ? 'Mini-foot Communautaire' : 'كرة القدم المصغرة المجتمعية'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <LogoImage size={logoSize} />
      <div className="flex flex-col min-w-0">
        <h1 className={`${textSizes[size]} font-bold text-gray-900 dark:text-white leading-tight truncate`}>
          7ouma Ligue
        </h1>
        {showSubtitle && (
          <p className={`${subtitleSizes[size]} text-gray-600 dark:text-gray-300 truncate`}>
            {language === 'fr' ? 'Mini-foot Communautaire' : 'كرة القدم المصغرة المجتمعية'}
          </p>
        )}
      </div>
    </div>
  );
};

export default LogoWithText; 