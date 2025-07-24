import React from 'react';
import { Search, Grid3X3, List, ChevronDown } from 'lucide-react';

const BookmarksToolbar = ({ 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy, 
  viewMode, 
  setViewMode, 
  showFilters, 
  setShowFilters, 
  activeTab, 
  filterDropdownRef 
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
          />
        </div>

        {/* Contrôles */}
        <div className="flex items-center gap-2">
          {/* Tri */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 flex items-center justify-between min-w-[140px]"
            >
              <span>
                {sortBy === 'bookmarked' ? 'Plus récents' : 
                 sortBy === 'title' ? 'Titre' : 
                 sortBy === 'progress' ? 'Progression' : 'Plus récents'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Mode d'affichage */}
          <div className="flex items-center bg-slate-700/50 border border-slate-600/50 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksToolbar; 