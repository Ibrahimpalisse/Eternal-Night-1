import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Eye, 
  Calendar, 
  CheckCircle, 
  Play,
  Search,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  BookOpen as BookOpenIcon
} from 'lucide-react';

const ChapterList = ({ 
  chapters,
  chapterFilter,
  setChapterFilter,
  chapterSearch,
  setChapterSearch,
  chapterSort,
  setChapterSort,
  currentChapterPage,
  setCurrentChapterPage,
  totalChapterPages,
  onChapterClick,
  formatDate 
}) => {
  
  // État pour afficher/masquer les filtres avec persistance localStorage
  const [showFilters, setShowFilters] = useState(() => {
    const saved = localStorage.getItem('chapterFiltersOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // État pour le dropdown personnalisé
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  // Sauvegarder l'état des filtres dans localStorage
  useEffect(() => {
    localStorage.setItem('chapterFiltersOpen', JSON.stringify(showFilters));
  }, [showFilters]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Options du filtre avec icônes
  const filterOptions = [
    { value: 'all', label: 'Tous les chapitres', icon: BookOpenIcon },
    { value: 'read', label: 'Déjà lus', icon: CheckCircle },
    { value: 'unread', label: 'Non lus', icon: BookOpenIcon }
  ];

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === chapterFilter);
    return option ? option.label : 'Tous les chapitres';
  };

  const handleFilterChange = (value) => {
    setChapterFilter(value);
    setIsFilterDropdownOpen(false);
  };
  
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
        
        <div className="flex items-center gap-1 max-w-xs overflow-x-auto scrollbar-hide">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                  currentPage === page
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-slate-600/50'
                }`}
              >
                {page}
              </button>
            );
          })}
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
        
        {/* Header de la section chapitres avec bouton toggle filtres */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Liste des chapitres ({chapters.length})
            </h2>
            
            {/* Bouton pour afficher/masquer les filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-gray-300 hover:text-white hover:bg-slate-600/50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
              </span>
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {/* Filtres et tri des chapitres - Collapsible et responsive */}
          {showFilters && (
            <div className="space-y-3 sm:space-y-0">
              {/* Mobile: Filtres empilés */}
              <div className="flex flex-col gap-3 sm:hidden">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un chapitre..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  />
                  {chapterSearch && (
                    <button
                      onClick={() => setChapterSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Filtre de lecture - Dropdown personnalisé */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm hover:bg-slate-600/50 transition-colors"
                  >
                    <span>{getCurrentFilterLabel()}</span>
                    {isFilterDropdownOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isFilterDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {filterOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(option.value)}
                            className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
                          >
                            <span className="text-white text-sm">{option.label}</span>
                            {option.value !== 'all' && (
                              <div className="flex items-center gap-1 text-blue-400">
                                <IconComponent className="w-3 h-3" />
                                <span className="text-xs">
                                  {option.value === 'read' ? '✓' : '○'}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tri par date */}
                <button
                  onClick={() => setChapterSort(chapterSort === 'newest' ? 'oldest' : 'newest')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm hover:bg-slate-600/50 transition-colors"
                >
                  {chapterSort === 'newest' ? (
                    <>
                      <SortDesc className="w-4 h-4" />
                      <span>Plus récents</span>
                    </>
                  ) : (
                    <>
                      <SortAsc className="w-4 h-4" />
                      <span>Plus anciens</span>
                    </>
                  )}
                </button>
              </div>

              {/* Desktop: Filtres en ligne */}
              <div className="hidden sm:flex gap-3">
                {/* Recherche */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un chapitre..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  />
                  {chapterSearch && (
                    <button
                      onClick={() => setChapterSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Filtre de lecture - Dropdown personnalisé */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="flex items-center justify-between px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm hover:bg-slate-600/50 transition-colors min-w-[160px]"
                  >
                    <span>{getCurrentFilterLabel()}</span>
                    {isFilterDropdownOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isFilterDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {filterOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(option.value)}
                            className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
                          >
                            <span className="text-white text-sm">{option.label}</span>
                            {option.value !== 'all' && (
                              <div className="flex items-center gap-1 text-blue-400">
                                <IconComponent className="w-3 h-3" />
                                <span className="text-xs">
                                  {option.value === 'read' ? '✓' : '○'}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tri par date */}
                <button
                  onClick={() => setChapterSort(chapterSort === 'newest' ? 'oldest' : 'newest')}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm hover:bg-slate-600/50 transition-colors min-w-[140px] justify-center"
                >
                  {chapterSort === 'newest' ? (
                    <>
                      <SortDesc className="w-4 h-4" />
                      <span>Plus récents</span>
                    </>
                  ) : (
                    <>
                      <SortAsc className="w-4 h-4" />
                      <span>Plus anciens</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des chapitres avec scroll virtuel */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`group p-3 sm:p-4 border rounded-lg cursor-pointer transition-all hover:scale-[1.01] ${
                chapter.isRead 
                  ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/40' 
                  : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                
                {/* Informations du chapitre */}
                <div className="flex-1 min-w-0" onClick={() => onChapterClick(chapter)}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                      chapter.isRead 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      Ch. {chapter.number}
                    </span>
                    {chapter.isRead && (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <h3 className={`font-semibold text-sm sm:text-base group-hover:text-purple-300 transition-colors mb-2 line-clamp-2 ${
                    chapter.isRead ? 'text-gray-300' : 'text-white'
                  }`}>
                    {chapter.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{formatDate(chapter.publishedAt)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">{chapter.wordCount.toLocaleString()} mots</span>
                      <span className="sm:hidden">{Math.round(chapter.wordCount / 1000)}k mots</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{chapter.views} vues</span>
                    </span>
                  </div>
                </div>

                {/* Bouton de lecture */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onChapterClick(chapter)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-colors opacity-0 group-hover:opacity-100 text-sm"
                  >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Lire</span>
                  </button>
                  {chapter.status === 'published' && (
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination des chapitres */}
        <Pagination
          currentPage={currentChapterPage}
          totalPages={totalChapterPages}
          onPageChange={setCurrentChapterPage}
          className="mt-6"
        />

        {/* Message si aucun chapitre */}
        {chapters.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Aucun chapitre trouvé</h3>
            <p className="text-gray-400">
              {chapterSearch || chapterFilter !== 'all' 
                ? 'Aucun chapitre ne correspond à vos critères de recherche.'
                : 'Ce roman n\'a pas encore de chapitres publiés.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterList; 