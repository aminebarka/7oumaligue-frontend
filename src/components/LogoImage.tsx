import React from 'react';

interface LogoImageProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
}

const LogoImage: React.FC<LogoImageProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="7ouma Ligue" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback si l'image ne charge pas
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 rounded-full flex items-center justify-center"><span class="text-white font-bold text-2xl">7</span></div>';
        }}
      />
    </div>
  );
};

export default LogoImage; 