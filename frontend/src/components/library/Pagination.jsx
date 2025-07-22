import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  className = "" 
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5; // Nombre de pages à afficher
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    // Ajuster le début si on est proche de la fin
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}>
      {/* Bouton précédent */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Première page si pas visible */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="hidden sm:flex items-center justify-center w-10 h-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white hover:bg-slate-700/50 transition-all"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="hidden sm:block text-gray-400">...</span>
          )}
        </>
      )}

      {/* Pages visibles */}
      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-sm border rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm ${
            page === currentPage
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
              : 'bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Dernière page si pas visible */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="hidden sm:block text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="hidden sm:flex items-center justify-center w-10 h-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white hover:bg-slate-700/50 transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Bouton suivant */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Info mobile */}
      <div className="sm:hidden ml-3 text-xs text-gray-400">
        {currentPage}/{totalPages}
      </div>
    </div>
  );
};

export default Pagination; 
 
 
 