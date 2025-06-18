import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getPageNumbers } from './userUtils.jsx';

const UserPagination = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onFirst,
  onPrevious,
  onNext,
  onLast,
  itemLabel = 'utilisateur'
}) => {
  if (totalItems === 0) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="px-4 py-4 border-t border-slate-700/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Informations de pagination */}
        <div className="text-sm text-gray-400">
          Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems} {itemLabel}{totalItems > 1 ? 's' : ''}
        </div>

        {/* Contrôles de pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* Bouton première page */}
            <button
              onClick={onFirst}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-gray-400 transition-colors"
              title="Première page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Bouton page précédente */}
            <button
              onClick={onPrevious}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-gray-400 transition-colors"
              title="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Numéros de pages */}
            <div className="flex items-center gap-1">
              {pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bouton page suivante */}
            <button
              onClick={onNext}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-gray-400 transition-colors"
              title="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bouton dernière page */}
            <button
              onClick={onLast}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-gray-400 transition-colors"
              title="Dernière page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPagination; 