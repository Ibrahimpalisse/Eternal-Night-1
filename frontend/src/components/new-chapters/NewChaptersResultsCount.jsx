import React from 'react';

const NewChaptersResultsCount = ({ count }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
      <div className="text-xs sm:text-sm text-gray-400">
        {count} chapitre{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default NewChaptersResultsCount; 