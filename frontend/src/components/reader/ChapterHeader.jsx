import React, { useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Eye, 
  Bookmark, 
  Menu, 
  List, 
  ChevronDown, 
  Search,
  Maximize2
} from 'lucide-react';

const ChapterHeader = ({
  chapterData,
  isBookmarked,
  setIsBookmarked,
  setIsSettingsOpen,
  setIsMenuOpen,
  goBackToNovel,
  // États pour le menu des chapitres
  isChaptersMenuOpen,
  setIsChaptersMenuOpen,
  chapterSearch,
  setChapterSearch,
  filteredChapters,
  goToChapter,
  chapterNumber,
  isImmersive,
  setIsImmersive
}) => {
  const chaptersDropdownRef = useRef(null);

  // Fermer le dropdown des chapitres quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chaptersDropdownRef.current && !chaptersDropdownRef.current.contains(event.target)) {
        setIsChaptersMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsChaptersMenuOpen]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-1 z-40 mx-3 sm:mx-4 lg:mx-6 xl:mx-8 mt-3 rounded-xl backdrop-blur-sm border border-slate-700/50 bg-slate-800/60">
        <div className="flex items-center justify-between p-3 sm:p-4">
          
          {/* Navigation gauche */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={goBackToNovel}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:block">
              <h1 className="font-medium text-sm sm:text-base text-white">
                {chapterData.novel.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Chapitre {chapterData.number} - {chapterData.title}
              </p>
            </div>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            
            {/* Menu des chapitres - déplacé à droite */}
            <div className="hidden lg:block relative" ref={chaptersDropdownRef}>
              <button
                onClick={() => setIsChaptersMenuOpen(!isChaptersMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <List className="w-4 h-4" />
                <span className="text-sm">Chapitres</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isChaptersMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown des chapitres */}
              {isChaptersMenuOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl max-h-80 overflow-hidden z-50"
                  style={{ width: '400px' }}
                >
                  {/* Barre de recherche */}
                  <div className="p-3 border-b border-slate-700/50">
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

                  {/* Liste des chapitres */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredChapters.length > 0 ? (
                      filteredChapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => goToChapter(chapter.number)}
                          className={`w-full flex items-center px-3 py-3 hover:bg-slate-700/50 cursor-pointer transition-colors text-left ${
                            parseInt(chapterNumber) === chapter.number 
                              ? 'bg-purple-500/20 border-r-2 border-purple-500' 
                              : ''
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
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center">
                        <p className="text-sm text-gray-400">Aucun chapitre trouvé</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Statistiques cachées sur mobile */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-400 mr-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {chapterData.views}
              </span>
            </div>

            {/* Actions d'interaction */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'text-blue-400 bg-blue-500/10' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Plein écran / Immersive mode */}
            {typeof setIsImmersive === 'function' && !isImmersive && (
              <button
                onClick={() => setIsImmersive(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                aria-label="Activer le mode lecture immersive"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-colors sm:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default ChapterHeader; 