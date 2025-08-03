import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
      title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
    >
      <div className="relative w-5 h-5">
        {/* Icône Soleil */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'text-yellow-400 opacity-100 scale-100' 
              : 'text-white/50 opacity-0 scale-75'
          }`}
        />
        {/* Icône Lune */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'text-blue-300 opacity-100 scale-100' 
              : 'text-white/50 opacity-0 scale-75'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle; 