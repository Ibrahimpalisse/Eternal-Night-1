import React from 'react';
import { Clock, Play, ChevronUp, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const LatestChapters = ({ 
  chapters, 
  showAllLatestChapters, 
  setShowAllLatestChapters, 
  currentLatestChapterPage, 
  setCurrentLatestChapterPage,
  totalLatestChapterPages,
  onChapterClick,
  formatDate 
}) => {
  
  // Composant Pagination
  const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    if (totalPages <= 1) return null;

    return (
      <div className={`flex justify-center items-center gap-2 ${className}`}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-slate-600/50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <span>Derniers chapitres ajoutés</span>
            <span className="text-sm text-gray-400 font-normal">({chapters.length})</span>
          </h2>
          
          {chapters.length > 3 && (
            <button
              onClick={() => setShowAllLatestChapters(!showAllLatestChapters)}
              className="flex items-center gap-2 px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-gray-300 hover:text-white hover:bg-slate-600/50 transition-colors text-sm"
            >
              {showAllLatestChapters ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Voir moins</span>
                </>
              ) : (
                <>
                  <MoreVertical className="w-4 h-4" />
                  <span>Voir tous ({chapters.length})</span>
                </>
              )}
            </button>
          )}
        </div>
        
        <div className={`grid grid-cols-1 ${showAllLatestChapters ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-3'} gap-3 sm:gap-4`}>
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 sm:p-4 hover:bg-slate-600/40 transition-colors cursor-pointer group"
              onClick={() => onChapterClick(chapter)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-md text-xs font-medium">
                  Ch. {chapter.number}
                </span>
                <button className="p-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2 text-sm sm:text-base">
                {chapter.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">{formatDate(chapter.publishedAt)}</p>
            </div>
          ))}
        </div>

        {/* Pagination pour les derniers chapitres si mode étendu */}
        {showAllLatestChapters && totalLatestChapterPages > 1 && (
          <Pagination
            currentPage={currentLatestChapterPage}
            totalPages={totalLatestChapterPages}
            onPageChange={setCurrentLatestChapterPage}
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
};

export default LatestChapters; 