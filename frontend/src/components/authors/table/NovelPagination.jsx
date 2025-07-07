import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NovelPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10, 
  totalItems = 0,
  className = "" 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si peu de pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (currentPage <= 2) {
        for (let i = 1; i <= (window.innerWidth < 640 ? 2 : 4); i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - (window.innerWidth < 640 ? 1 : 3); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        pages.push(currentPage);
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/30 border-t border-gray-600/20 ${className}`}>
      {/* Informations */}
      <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
        <span className="hidden xs:inline">Affichage de </span>
        <span className="font-medium text-white">{startItem}</span>
        <span className="hidden xs:inline"> à </span>
        <span className="xs:hidden">-</span>
        <span className="font-medium text-white">{endItem}</span>
        <span className="hidden xs:inline"> sur </span>
        <span className="xs:hidden">/</span>
        <span className="font-medium text-white">{totalItems}</span>
        <span className="hidden xs:inline"> romans</span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Bouton Précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-300 bg-gray-700/50 border border-gray-600/30 rounded-md hover:bg-gray-600/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        {/* Numéros de pages */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-400"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  min-w-[32px] sm:min-w-[36px] px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
                  ${isActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-300 bg-gray-700/50 border border-gray-600/30 hover:bg-gray-600/50 hover:text-white'
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-300 bg-gray-700/50 border border-gray-600/30 rounded-md hover:bg-gray-600/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default NovelPagination; 