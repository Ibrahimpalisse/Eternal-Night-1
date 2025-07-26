import React from 'react';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import SearchBar from './SearchBar';
import MultiSelectFilter from './MultiSelectFilter';
import LikesFilter from './LikesFilter';
import { useFilterState } from '../../hooks/useLocalStorage';

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  selectedGenres, 
  onGenresChange, 
  genres,
  selectedLikes,
  onLikesChange,
  resultsCount,
  selectedStatus,
  onStatusChange
}) => {
  const [showFilters, setShowFilters] = useFilterState();

  return (
    <div className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 sm:p-6 mb-8">
      {/* Bouton filtres et compteur */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-slate-600/50 transition-all w-fit"
          >
            <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Filtres</span>
            {showFilters ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
        </div>
        <div className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-0">
          {resultsCount} roman{resultsCount > 1 ? 's' : ''} trouvé{resultsCount > 1 ? 's' : ''}
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Rechercher un roman, un auteur..."
        />
      </div>
      
      {/* Filtres (conditionnels) */}
      {showFilters && (
        <>
          {/* Filtre d'état des romans */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">État du roman</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: '', label: 'Tous', color: 'bg-gray-700/40 text-gray-200', active: 'bg-purple-600 text-white' },
                { value: 'en_cours', label: 'En cours', color: 'bg-orange-500/20 text-orange-300', active: 'bg-orange-500/90 text-white' },
                { value: 'terminé', label: 'Fini', color: 'bg-green-500/20 text-green-300', active: 'bg-green-500/90 text-white' },
                { value: 'arrete', label: 'Arrêté', color: 'bg-red-500/20 text-red-300', active: 'bg-red-500/90 text-white' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  className={`px-3 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/40 ${
                    selectedStatus === option.value ? option.active : option.color
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtres en grille responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            {/* Filtre genres */}
            <MultiSelectFilter
              title="Genres"
              placeholder="Rechercher un genre..."
              options={genres}
              selectedOptions={selectedGenres}
              onSelectionChange={onGenresChange}
            />
            
            {/* Filtre likes */}
            <LikesFilter
              selectedLikes={selectedLikes}
              onLikesChange={onLikesChange}
            />
          </div>
        </>
      )}

      {/* Tags des filtres actifs */}
      {(selectedGenres.length > 0 || selectedLikes || selectedStatus) && (
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {/* Tags genres */}
          {selectedGenres.map(genreValue => {
            const genre = genres.find(g => g.value === genreValue);
            return genre ? (
              <span
                key={genreValue}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 text-xs sm:text-sm rounded-full border border-purple-500/30"
              >
                {genre.label}
                <button
                  onClick={() => onGenresChange(selectedGenres.filter(g => g !== genreValue))}
                  className="hover:text-purple-100 transition-colors"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          
          {/* Tag likes */}
          {selectedLikes && (
            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-500/20 text-red-300 text-xs sm:text-sm rounded-full border border-red-500/30">
              {selectedLikes}+ likes
              <button
                onClick={() => onLikesChange('')}
                className="hover:text-red-100 transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {/* Tag statut */}
          {selectedStatus && (
            <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border transition-colors ${
              selectedStatus === 'en_cours' 
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' 
                : selectedStatus === 'terminé' 
                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}>
              {selectedStatus === 'en_cours' ? 'En cours' : selectedStatus === 'terminé' ? 'Fini' : 'Arrêté'}
              <button
                onClick={() => onStatusChange('')}
                className={`hover:text-white transition-colors ${
                  selectedStatus === 'en_cours' 
                    ? 'hover:text-orange-100' 
                    : selectedStatus === 'terminé' 
                    ? 'hover:text-green-100'
                    : 'hover:text-red-100'
                }`}
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar; 