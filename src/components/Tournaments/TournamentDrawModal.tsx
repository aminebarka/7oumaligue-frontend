import React from 'react';
import { Shuffle } from 'lucide-react';

interface TournamentDrawModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
  numberOfGroups: number;
  setNumberOfGroups: (n: number) => void;
}

const TournamentDrawModal: React.FC<TournamentDrawModalProps> = ({
  show,
  onClose,
  onConfirm,
  t,
  numberOfGroups,
  setNumberOfGroups
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Shuffle className="mr-3 text-blue-600" size={28} />
          {t('tournaments.draw.title')}
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🤖 {t('tournaments.draw.ai')}</h3>
            <p className="text-sm text-blue-800">
              {t('tournaments.draw.ai.desc')}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">⚖️ {t('tournaments.draw.balance')}</h3>
            <p className="text-sm text-green-800">
              {t('tournaments.draw.balance.desc')}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 6, 8].map(num => (
              <button
                key={num}
                onClick={() => setNumberOfGroups(num)}
                className={`py-2 rounded-lg ${
                  numberOfGroups === num 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Shuffle size={16} />
            <span>{t('tournaments.draw.perform')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentDrawModal;