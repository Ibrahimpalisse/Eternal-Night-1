import React from 'react';
import { Bookmark, BookOpen, Eye, BookmarkX } from 'lucide-react';

const ChapterCard = ({ chapter, viewMode, onChapterClick, onRemoveBookmark, formatRelativeTime }) => {
  return (
    <div 
      className={`group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer ${
        viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'
      }`}
      onClick={() => onChapterClick(chapter)}
    >
      {viewMode === 'grid' && (
        <div className="flex items-start gap-4 mb-4">
          {/* Image du roman */}
          <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={chapter.image}
              alt={chapter.novelTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Informations principales */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">
                  {chapter.novelTitle}
                </h4>
                <p className="text-gray-400 text-xs">par {chapter.author}</p>
              </div>
              
              {/* Bouton supprimer favori */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBookmark('chapter', chapter.id);
                }}
                className="p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <BookmarkX className="w-3 h-3" />
              </button>
            </div>

            {/* Numéro et titre du chapitre */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-400 font-bold text-sm">
                  Ch. {chapter.chapterNumber}
                </span>
              </div>
              <h5 className="text-gray-300 text-sm line-clamp-1">
                {chapter.chapterTitle}
              </h5>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <>
          {/* Image */}
          <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={chapter.image}
              alt={chapter.novelTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm mb-1">
                  {chapter.novelTitle}
                </h4>
                <p className="text-gray-400 text-xs">par {chapter.author}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBookmark('chapter', chapter.id);
                }}
                className="p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <BookmarkX className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-400 font-bold text-sm">
                Ch. {chapter.chapterNumber}
              </span>
              <span className="text-gray-300 text-sm">
                {chapter.chapterTitle}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Statistiques et date */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {chapter.views}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {chapter.wordCount} mots
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Bookmark className="w-3 h-3" />
          {formatRelativeTime(chapter.bookmarkedAt)}
        </span>
      </div>
    </div>
  );
};

export default ChapterCard; 