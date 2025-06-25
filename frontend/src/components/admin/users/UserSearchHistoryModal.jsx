import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Search, 
  Calendar, 
  Clock, 
  Filter, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  Trash2,
  TrendingUp,
  History,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

// Composant de confirmation pour supprimer une recherche
const DeleteSearchConfirmDialog = ({ isOpen, onClose, search, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !search) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(search);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Supprimer la recherche</h3>
            <p className="text-sm text-red-400">Cette action est irréversible</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Êtes-vous sûr de vouloir supprimer cette recherche de l'historique ?
          </p>
          
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-white font-medium mb-1">
              "{search.query}"
            </div>
            <div className="text-sm text-gray-400">
              {search.category} • {search.resultsCount} résultat{search.resultsCount > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(search.timestamp).toLocaleDateString('fr-FR')} à {new Date(search.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

const UserSearchHistoryModal = ({ user, isOpen, onClose, onUserClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const searchesPerPage = 5; // 5 recherches par page
  
  // États pour la suppression
  const [selectedSearchForDelete, setSelectedSearchForDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const searchHistory = user?.searchHistory || [
    {
      id: 1,
      query: "roman fantastique",
      timestamp: "2024-01-22T14:30:00Z",
      resultsCount: 15,
      category: "Romans",
      device: "Desktop"
    },
    {
      id: 2,
      query: "chapitre 5 Les Chroniques",
      timestamp: "2024-01-22T13:45:00Z",
      resultsCount: 3,
      category: "Chapitres",
      device: "Mobile"
    },
    {
      id: 3,
      query: "auteur Claire Rousseau",
      timestamp: "2024-01-22T12:20:00Z",
      resultsCount: 8,
      category: "Auteurs",
      device: "Desktop"
    },
    {
      id: 4,
      query: "science fiction",
      timestamp: "2024-01-21T19:15:00Z",
      resultsCount: 22,
      category: "Romans",
      device: "Tablet"
    },
    {
      id: 5,
      query: "aventure médiévale",
      timestamp: "2024-01-21T16:30:00Z",
      resultsCount: 7,
      category: "Romans",
      device: "Mobile"
    },
    {
      id: 6,
      query: "Les Mystères de l'Académie",
      timestamp: "2024-01-21T11:45:00Z",
      resultsCount: 12,
      category: "Romans",
      device: "Desktop"
    },
    {
      id: 7,
      query: "chapitre final",
      timestamp: "2024-01-20T20:30:00Z",
      resultsCount: 5,
      category: "Chapitres",
      device: "Mobile"
    },
    {
      id: 8,
      query: "romance contemporaine",
      timestamp: "2024-01-20T15:20:00Z",
      resultsCount: 18,
      category: "Romans",
      device: "Desktop"
    }
  ];

  const filteredAndSortedSearches = useMemo(() => {
    let filtered = searchHistory.filter(search => {
      const matchesSearch = search.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           search.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const searchDate = new Date(search.timestamp);
      const matchesDateFrom = !filterDateFrom || searchDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || searchDate <= new Date(filterDateTo + 'T23:59:59');
      
      return matchesSearch && matchesDateFrom && matchesDateTo;
    });

    filtered.sort((a, b) => {
      const comparison = new Date(a.timestamp) - new Date(b.timestamp);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchHistory, searchTerm, filterDateFrom, filterDateTo, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSearches.length / searchesPerPage);
  const startIndex = (currentPage - 1) * searchesPerPage;
  const currentSearches = filteredAndSortedSearches.slice(startIndex, startIndex + searchesPerPage);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSortOrder('desc');
    setCurrentPage(1); // Reset pagination
  };

  // Reset pagination quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDateFrom, filterDateTo, sortOrder]);

  const hasActiveFilters = searchTerm || filterDateFrom || filterDateTo || sortOrder !== 'desc';

  const handleDeleteSearch = (search) => {
    setSelectedSearchForDelete(search);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (search) => {
    // Ici vous feriez l'appel API pour supprimer la recherche
    console.log('Suppression de la recherche:', search);
    
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedSearchForDelete(null);
  };

  if (!isOpen || !user) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg sm:rounded-xl border border-orange-500/30 flex-shrink-0">
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                Historique de recherche
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 truncate">
                Recherches de {user.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </button>
        </div>

        <div className="border-b border-slate-700/50 bg-slate-800/30">
          <div className="p-3 sm:p-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">Filtres</span>
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full"></div>
                <span className="text-xs text-orange-400 hidden sm:inline">Filtres actifs</span>
                <span className="text-xs text-orange-400 sm:hidden">Actifs</span>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    Rechercher
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-xs sm:text-sm"
                      placeholder="Recherche..."
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    Date début
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    Date fin
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    Ordre
                  </label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Plus récents ↓' : 'Plus anciens ↑'}</span>
                    <span className="sm:hidden">{sortOrder === 'desc' ? 'Récents ↓' : 'Anciens ↑'}</span>
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-3 sm:mt-4 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="px-3 sm:px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Réinitialiser</span>
                    <span className="sm:hidden">Reset</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-400">
            {filteredAndSortedSearches.length} recherche{filteredAndSortedSearches.length > 1 ? 's' : ''} trouvée{filteredAndSortedSearches.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto search-history-scrollbar" style={{ maxHeight: 'calc(95vh - 350px)' }}>
          {currentSearches.length > 0 ? (
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="space-y-3 sm:space-y-4">
                {currentSearches.map((search) => (
                <div
                  key={search.id}
                  className="bg-slate-800/30 rounded-lg sm:rounded-xl border border-slate-700/30 p-3 sm:p-4 hover:bg-slate-700/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg border border-orange-500/30 flex-shrink-0">
                      <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm sm:text-base truncate">
                            "{search.query}"
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              {search.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-gray-400">
                            {new Date(search.timestamp).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(search.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span className="hidden sm:inline">{search.resultsCount} résultat{search.resultsCount > 1 ? 's' : ''}</span>
                            <span className="sm:hidden">{search.resultsCount} rés.</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteSearch(search)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110"
                          title="Supprimer de l'historique"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                              ))}
              </div>
            </div>
          ) : (
            /* État vide */
            <div className="p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-orange-500/20">
                {searchTerm || filterDateFrom || filterDateTo ? (
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                ) : (
                  <History className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                )}
              </div>
              <p className="text-gray-400 text-base sm:text-lg font-medium mb-2">
                {searchTerm || filterDateFrom || filterDateTo ? (
                  "Aucune recherche trouvée"
                ) : (
                  "Aucun historique de recherche"
                )}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
                {searchTerm || filterDateFrom || filterDateTo ? (
                  "Aucune recherche ne correspond à vos critères de filtrage."
                ) : (
                  "Cet utilisateur n'a pas encore effectué de recherches ou l'historique n'est pas disponible."
                )}
              </p>
              {(searchTerm || filterDateFrom || filterDateTo) && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-400 text-sm transition-colors"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-700/50 p-3 sm:p-4 lg:p-6 bg-slate-800/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              {/* Informations de pagination */}
              <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left order-2 sm:order-1">
                <span className="hidden sm:inline">
                  Affichage de <span className="font-medium text-white">{startIndex + 1}</span> à{' '}
                  <span className="font-medium text-white">{Math.min(startIndex + searchesPerPage, filteredAndSortedSearches.length)}</span> sur{' '}
                  <span className="font-medium text-white">{filteredAndSortedSearches.length}</span> recherches
                </span>
                <span className="sm:hidden">
                  <span className="font-medium text-white">{startIndex + 1}-{Math.min(startIndex + searchesPerPage, filteredAndSortedSearches.length)}</span> sur{' '}
                  <span className="font-medium text-white">{filteredAndSortedSearches.length}</span>
                </span>
              </div>

              {/* Contrôles de pagination */}
              <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                {/* Bouton première page - masqué sur mobile */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="hidden lg:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Première page"
                >
                  <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Bouton page précédente */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Page précédente"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Numéros de pages - responsive */}
                <div className="hidden md:flex items-center gap-1">
                  {(() => {
                    const delta = 1; // Plus compact pour les écrans moyens
                    const range = [];
                    const rangeWithDots = [];

                    for (let i = Math.max(2, currentPage - delta); 
                         i <= Math.min(totalPages - 1, currentPage + delta); 
                         i++) {
                      range.push(i);
                    }

                    if (currentPage - delta > 2) {
                      rangeWithDots.push(1, '...');
                    } else {
                      rangeWithDots.push(1);
                    }

                    rangeWithDots.push(...range);

                    if (currentPage + delta < totalPages - 1) {
                      rangeWithDots.push('...', totalPages);
                    } else if (totalPages > 1) {
                      rangeWithDots.push(totalPages);
                    }

                    return rangeWithDots.map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-1.5 py-1 text-gray-400 text-xs sm:text-sm">...</span>
                        ) : (
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg border transition-all duration-200 text-xs sm:text-sm font-medium ${
                              currentPage === page
                                ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/25'
                                : 'border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ));
                  })()}
                </div>

                {/* Indicateur de page mobile/tablette */}
                <div className="md:hidden px-3 py-1.5 sm:py-2 bg-orange-600/20 border border-orange-500/30 rounded-lg text-orange-400 text-xs sm:text-sm font-medium">
                  {currentPage} / {totalPages}
                </div>

                {/* Bouton page suivante */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Page suivante"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Bouton dernière page - masqué sur mobile */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden lg:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Dernière page"
                >
                  <ChevronsRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null}
      <DeleteSearchConfirmDialog
        search={selectedSearchForDelete}
        isOpen={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default UserSearchHistoryModal; 