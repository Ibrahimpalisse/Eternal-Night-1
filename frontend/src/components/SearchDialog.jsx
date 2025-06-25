import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import CloseButton from './ui/CloseButton';
import { Search, Book, History, Clock, TrendingUp, X, Trash2 } from 'lucide-react';
import { FormValidation } from '../utils/validation';

const SearchDialog = ({ trigger, isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions] = useState([
    'Roman fantastique',
    'Auteur populaire', 
    'Histoire d\'amour',
    'Aventure épique',
    'Mystère et suspense'
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les recherches récentes depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des recherches récentes:', error);
      }
    }
  }, []);

  const handleSearch = () => {
    // Valider la recherche avec Zod
    const validation = FormValidation.validateSearchQuery(searchQuery);
    
    if (!validation.success) {
      setSearchError(validation.error);
      return;
    }

    const trimmedQuery = validation.query;
    
    // Ajouter à l'historique
    const updatedSearches = [trimmedQuery, ...recentSearches.filter(s => s !== trimmedQuery)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Exécuter la recherche
    onSearch(trimmedQuery);
    setSearchQuery('');
    setSearchError('');
    onClose();
  };

  const handleInputChange = (value) => {
    setSearchQuery(value);
    
    // Validation en temps réel
    if (value.trim()) {
      const validation = FormValidation.validateFieldLive(FormValidation.searchQuerySchema, value);
      if (!validation.isValid) {
        setSearchError(validation.error);
      } else {
        setSearchError('');
      }
    } else {
      setSearchError('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    // You could automatically submit the search here if desired
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Gérer la touche ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-[600px] bg-black/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-xl blur-lg"></div>
                <Search className="relative w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Night Novels
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-normal text-center">Découvrez votre prochaine lecture préférée</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Rechercher des livres, auteurs..."
              className={`pl-10 pr-10 h-12 bg-white/5 border text-white placeholder:text-gray-400 focus:ring-1 text-sm sm:text-base ${
                searchError 
                  ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' 
                  : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/50'
              }`}
              autoFocus
            />
            {searchQuery && (
              <CloseButton
                variant="minimal"
                size="sm"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                ariaLabel="Effacer la recherche"
              />
            )}
          </div>
          <Button 
            type="submit" 
            className="h-12 px-4 sm:px-6 bg-purple-600 hover:bg-purple-500 text-white transition-colors text-sm sm:text-base disabled:opacity-50"
            disabled={isLoading || !!searchError}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Recherche...
              </div>
            ) : (
              'Rechercher'
            )}
          </Button>
        </form>

        {/* Message d'erreur */}
        {searchError && (
          <div className="mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{searchError}</p>
          </div>
        )}

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div>
              <h3 className="flex items-center text-xs sm:text-sm font-medium text-gray-400 mb-3 sm:mb-4">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Recent searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 cursor-pointer transition-all duration-200"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <History className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    <span className="text-white/90 text-sm sm:text-base truncate">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h3 className="flex items-center text-xs sm:text-sm font-medium text-gray-400 mb-3 sm:mb-4">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Popular searches
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 cursor-pointer transition-all duration-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Book className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    <span className="text-white/90 text-sm sm:text-base truncate">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1.5">
            <kbd className="px-2 py-1 bg-white/10 rounded-md text-gray-400 font-mono text-xs">Échap</kbd>
            <span className="text-xs sm:text-xs">Fermer</span>
          </div>
          <div className="hidden sm:block h-4 w-[1px] bg-gray-800"></div>
          <div className="flex items-center space-x-1.5">
            <kbd className="px-2 py-1 bg-white/10 rounded-md text-gray-400 font-mono text-xs">Entrée</kbd>
            <span className="text-xs sm:text-xs">Rechercher</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog; 