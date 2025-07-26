import React from 'react';

const NewChaptersEmptyState = ({ onClearSearch }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Aucun nouveau chapitre trouvé</h3>
      <p className="text-gray-400 mb-4">
        Essayez de modifier vos critères de recherche
      </p>
      <button
        onClick={onClearSearch}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
      >
        Effacer la recherche
      </button>
    </div>
  );
};

export default NewChaptersEmptyState; 