import React from 'react';
import { Search } from 'lucide-react';

const NoResults = ({ searchQuery, selectedNovel }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Aucun chapitre trouvé
      </h3>
      <p className="text-slate-400 text-center max-w-md">
        {searchQuery ? (
          <>
            Aucun chapitre ne correspond à votre recherche <span className="text-white">"{searchQuery}"</span>
          </>
        ) : selectedNovel !== 'all' ? (
          "Aucun chapitre trouvé pour le roman sélectionné"
        ) : (
          "Aucun chapitre ne correspond aux filtres sélectionnés"
        )}
      </p>
    </div>
  );
};

export default NoResults; 