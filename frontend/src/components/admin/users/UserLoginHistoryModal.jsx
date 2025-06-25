import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Activity, User, TrendingUp, Search, Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const UserLoginHistoryModal = ({ user, isOpen, onClose, onUserClick }) => {
  // États pour le filtrage
  const [searchDate, setSearchDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    if (diffDays <= 30) return `Il y a ${Math.ceil((diffDays - 1) / 7)} semaines`;
    return `Il y a ${Math.ceil((diffDays - 1) / 30)} mois`;
  };

  const loginHistory = user?.loginHistory || [];

  // Filtrage des connexions
  const filteredHistory = useMemo(() => {
    if (!searchDate || !user) return loginHistory;
    
    return loginHistory.filter(login => {
      const loginDate = new Date(login.date);
      const searchDateObj = new Date(searchDate);
      
      // Comparaison des dates (jour, mois, année)
      return loginDate.toDateString() === searchDateObj.toDateString();
    });
  }, [loginHistory, searchDate, user]);

  const handleClearFilters = () => {
    setSearchDate('');
  };

  const hasActiveFilters = searchDate;

  // Fonction pour générer les couleurs d'avatar basées sur le nom
  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-500';
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Vérification après tous les hooks
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
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg sm:rounded-xl border border-blue-500/30 flex-shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                Historique des connexions
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 truncate">
                Dernières connexions de {user.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>



        {/* Filtres */}
        <div className="border-b border-slate-700/50 bg-slate-800/30">
          {/* En-tête des filtres avec bouton toggle */}
          <div className="p-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filtres</span>
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {/* Indicateur de filtres actifs */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-blue-400">Filtre actif</span>
              </div>
            )}
          </div>

          {/* Contenu des filtres (collapsible) */}
          {showFilters && (
            <div className="px-4 pb-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Recherche par date */}
                <div className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Rechercher par date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                      placeholder="Sélectionner une date"
                    />
                  </div>
                </div>

                {/* Bouton réinitialiser */}
                {hasActiveFilters && (
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={handleClearFilters}
                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Réinitialiser
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compteur de résultats */}
          <div className="px-4 pb-4 text-sm text-gray-400">
            {filteredHistory.length === loginHistory.length ? (
              `${loginHistory.length} connexion${loginHistory.length > 1 ? 's' : ''} au total`
            ) : (
              `${filteredHistory.length} sur ${loginHistory.length} connexion${loginHistory.length > 1 ? 's' : ''}`
            )}
          </div>
        </div>

        {/* Statistics - Toujours visibles */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/50 bg-slate-800/20">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-slate-700/30 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <div className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-0.5 sm:mb-1">
                {filteredHistory.length}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 leading-tight">
                <span className="hidden sm:inline">Connexion{filteredHistory.length > 1 ? 's' : ''} trouvée{filteredHistory.length > 1 ? 's' : ''}</span>
                <span className="sm:hidden">Connexions</span>
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <div className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-0.5 sm:mb-1">
                {user ? new Set(filteredHistory.map(l => l.date)).size : 0}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 leading-tight">
                <span className="hidden sm:inline">Jours actifs</span>
                <span className="sm:hidden">Jours</span>
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <div className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-0.5 sm:mb-1">
                {user?.joinDate ? Math.ceil((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 leading-tight">
                <span className="hidden sm:inline">Jours depuis l'inscription</span>
                <span className="sm:hidden">Ancienneté</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: showFilters ? 'calc(95vh - 520px)' : 'calc(95vh - 420px)' }}>
          {filteredHistory.length > 0 ? (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredHistory.map((login, index) => {
                  // La première connexion est celle à l'index 0
                  const isFirst = index === 0;
                  return (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all hover:bg-slate-700/30 ${
                        isFirst 
                          ? 'bg-blue-500/10 border-blue-500/20' 
                          : 'bg-slate-700/20 border-slate-600/30'
                      }`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg mb-2 sm:mb-3 ${
                        isFirst 
                          ? 'bg-blue-500/20 border border-blue-500/30' 
                          : 'bg-slate-600/30 border border-slate-500/30'
                      }`}>
                        <Calendar className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          isFirst ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                      </div>
                      
                      <div className="flex items-start gap-2 mb-1 min-w-0">
                        <span className="text-white font-medium text-sm sm:text-base leading-tight flex-1 min-w-0">
                          {formatDate(login.date)}
                        </span>
                        {isFirst && (
                          <span className="px-1.5 sm:px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] sm:text-xs font-medium border border-blue-500/30 flex-shrink-0">
                            Dernière
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs sm:text-sm">
                          {getRelativeTime(login.date)}
                        </span>
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          isFirst ? 'bg-blue-400' : 'bg-gray-500'
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>




            </div>
          ) : (
            /* Empty State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                {searchDate ? (
                  <Search className="w-8 h-8 text-gray-500" />
                ) : (
                  <User className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <p className="text-gray-400 text-lg font-medium mb-2">
                {searchDate ? (
                  "Aucune connexion trouvée"
                ) : (
                  "Aucun historique de connexion"
                )}
              </p>
              <p className="text-gray-500 text-sm">
                {searchDate ? (
                  `Aucune connexion trouvée pour la date ${new Date(searchDate).toLocaleDateString('fr-FR')}.`
                ) : (
                  "Cet utilisateur ne s'est jamais connecté ou l'historique n'est pas disponible."
                )}
              </p>
            </div>
          )}
        </div>


      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default UserLoginHistoryModal; 