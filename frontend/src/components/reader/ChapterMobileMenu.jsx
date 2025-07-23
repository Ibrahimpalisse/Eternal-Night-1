import React from 'react';
import { X, Search } from 'lucide-react';

const ChapterMobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  chapterSearch,
  setChapterSearch,
  filteredChapters,
  goToChapter,
  chapterNumber
}) => {
  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm sm:hidden" onClick={() => setIsMenuOpen(false)}>
      <div className="absolute top-0 right-0 w-72 h-full bg-slate-800 border-l border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-white">
              Chapitres
            </h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Barre de recherche mobile */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un chapitre..."
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>
          </div>

          {/* Liste des chapitres mobile */}
          <div className="flex-1 overflow-y-auto">
            {filteredChapters.length > 0 ? (
              <div className="space-y-2">
                {filteredChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      goToChapter(chapter.number);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-3 rounded-lg cursor-pointer transition-colors text-left ${
                      parseInt(chapterNumber) === chapter.number 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        parseInt(chapterNumber) === chapter.number
                          ? 'bg-purple-500/30 text-purple-300'
                          : chapter.isRead
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-700 text-gray-400'
                      }`}>
                        {chapter.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          parseInt(chapterNumber) === chapter.number
                            ? 'text-purple-300'
                            : 'text-gray-300'
                        }`}>
                          {chapter.title}
                        </p>
                        {chapter.isRead && (
                          <p className="text-xs text-green-400">Lu</p>
                        )}
                      </div>
                    </div>
                    {parseInt(chapterNumber) === chapter.number && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">Aucun chapitre trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterMobileMenu; 