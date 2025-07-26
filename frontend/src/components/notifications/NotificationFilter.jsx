import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const NotificationFilter = ({ selectedFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'Toutes', color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/20' },
    { value: 'warning', label: 'Avertissement', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' },
    { value: 'congratulations', label: 'Félicitations', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
    { value: 'alert', label: 'Alerte', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
    { value: 'announcement', label: 'Annonce', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
    { value: 'general', label: 'Général', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' }
  ];

  const selectedFilterData = filterOptions.find(option => option.value === selectedFilter);
  const hasActiveFilters = selectedFilter !== 'all' || searchQuery.trim();

  const clearAllFilters = () => {
    onFilterChange('all');
    onSearchChange('');
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Barre de recherche adaptée au style global */}
      <div className="relative group">
        <div className="relative bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-focus-within:border-purple-500/30">
          <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4">
            <div className="relative flex-shrink-0">
              <Search className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                isSearchFocused ? 'text-purple-400' : 'text-gray-400'
              }`} />
            </div>
            <Input
              type="text"
              placeholder="Rechercher des notifications..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none text-sm sm:text-base min-w-0"
            />
            {searchQuery && (
              <Button
                onClick={() => onSearchChange('')}
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex-shrink-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filtres avec animation */}
      <div className="space-y-2 sm:space-y-3">
        {/* Bouton pour développer/réduire les filtres */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
          >
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 group-hover:text-purple-400 transition-colors" />
            <span className="text-xs sm:text-sm font-medium">Filtres</span>
            {isFilterExpanded ? (
              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200" />
            )}
          </button>
          
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-2 sm:px-3 py-1 rounded-lg transition-all duration-200"
            >
              <X className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
              <span className="hidden sm:inline">Effacer tout</span>
              <span className="sm:hidden">Effacer</span>
            </Button>
          )}
        </div>

        {/* Filtre sélectionné actuellement */}
        {selectedFilter !== 'all' && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <div className={`inline-flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border ${selectedFilterData.bgColor} ${selectedFilterData.borderColor}`}>
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${selectedFilterData.color.replace('text-', 'bg-')}`}></div>
              <span className={`text-xs sm:text-sm font-medium ${selectedFilterData.color}`}>
                {selectedFilterData.label}
              </span>
            </div>
          </div>
        )}

        {/* Options de filtre déployées */}
        {isFilterExpanded && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onFilterChange(option.value)}
                    className={`relative group p-2 sm:p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedFilter === option.value
                        ? `${option.bgColor} ${option.borderColor} ${option.color}`
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                        selectedFilter === option.value
                          ? option.color.replace('text-', 'bg-')
                          : 'bg-gray-500 group-hover:bg-gray-400'
                      }`}></div>
                      <span className="text-xs sm:text-sm font-medium truncate">{option.label}</span>
                    </div>
                    {selectedFilter === option.value && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Indicateur de filtres actifs */}
        {hasActiveFilters && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="truncate">
                {searchQuery && selectedFilter !== 'all' 
                  ? `Recherche "${searchQuery}" + ${selectedFilterData.label}`
                  : searchQuery 
                    ? `Recherche "${searchQuery}"`
                    : `Filtre: ${selectedFilterData.label}`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationFilter; 