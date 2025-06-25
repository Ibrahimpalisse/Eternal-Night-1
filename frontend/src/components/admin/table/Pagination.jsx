import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleFirst = () => onPageChange(1);
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  const handleLast = () => onPageChange(totalPages);

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = totalPages > 1 ? getPageNumbers() : [];

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Informations de pagination */}
        <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
          Affichage de <span className="font-medium text-white">{indexOfFirstItem + 1}</span> à{' '}
          <span className="font-medium text-white">{indexOfLastItem}</span> sur{' '}
          <span className="font-medium text-white">{totalItems}</span> résultats
        </div>

        {/* Contrôles de pagination */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bouton première page - masqué sur mobile */}
          <button
            onClick={handleFirst}
            disabled={currentPage === 1}
            className="hidden md:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Première page"
          >
            <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Bouton page précédente */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Page précédente"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Numéros de pages - responsive */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200 text-sm font-medium ${
                      currentPage === page
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Indicateur de page mobile */}
          <div className="sm:hidden px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium">
            {currentPage} / {totalPages}
          </div>

          {/* Bouton page suivante */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Page suivante"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Bouton dernière page - masqué sur mobile */}
          <button
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className="hidden md:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Dernière page"
          >
            <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 