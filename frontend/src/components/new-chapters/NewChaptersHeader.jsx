import React from 'react';
import { Plus } from 'lucide-react';

const NewChaptersHeader = () => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            Nouveaux Chapitres
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Découvrez les derniers chapitres ajoutés par nos auteurs
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Mis à jour en temps réel</span>
        </div>
      </div>
    </div>
  );
};

export default NewChaptersHeader; 