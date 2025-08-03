import React from 'react';
import { Eye, Info } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';

const ReadOnlyBanner: React.FC = () => {
  const { canEdit, canDelete, userRole } = usePermissions();

  // Afficher la bannière seulement si l'utilisateur ne peut pas éditer
  if (canEdit) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Eye className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Mode lecture seule</strong> - Vous pouvez consulter toutes les informations mais ne pouvez pas les modifier.
            {userRole === 'player' && (
              <span className="block mt-1 text-xs text-blue-600">
                En tant que joueur, vous avez accès en lecture seule à toutes les données de la plateforme.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyBanner; 