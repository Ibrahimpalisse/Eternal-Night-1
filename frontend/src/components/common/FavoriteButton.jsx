import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const FavoriteButton = ({ 
  bookId, 
  initialIsFavorite = false, 
  initialFavoriteCount = 0,
  onFavoriteChange,
  size = 'default',
  className = '',
  showCount = true 
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
  const [isLoading, setIsLoading] = useState(false);

  // Synchroniser avec les props si elles changent
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
    setFavoriteCount(initialFavoriteCount);
  }, [initialIsFavorite, initialFavoriteCount]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const newIsFavorite = !isFavorite;
      const newCount = newIsFavorite ? favoriteCount + 1 : favoriteCount - 1;

      // Mise à jour optimiste de l'UI
      setIsFavorite(newIsFavorite);
      setFavoriteCount(newCount);

      // TODO: Appel API pour sauvegarder l'état
      // await api.toggleFavorite(bookId, newIsFavorite);

      // Notifier le parent du changement
      if (onFavoriteChange) {
        onFavoriteChange(bookId, newIsFavorite, newCount);
      }

      // Simuler un délai d'API pour l'exemple
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      
      // Revenir à l'état précédent en cas d'erreur
      setIsFavorite(!isFavorite);
      setFavoriteCount(isFavorite ? favoriteCount + 1 : favoriteCount - 1);
      
      // TODO: Afficher un message d'erreur à l'utilisateur
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration des tailles (optimisée pour l'accessibilité)
  const sizeConfig = {
    small: {
      icon: 'w-4 h-4 sm:w-3 sm:h-3',
      button: 'p-2 sm:p-1.5',
      text: 'text-sm sm:text-xs',
      minHeight: 'min-h-[44px] sm:min-h-[32px]', // Touch target minimum
      minWidth: 'min-w-[44px] sm:min-w-auto'
    },
    default: {
      icon: 'w-5 h-5 sm:w-4 sm:h-4',
      button: 'p-2.5 sm:p-2',
      text: 'text-base sm:text-sm',
      minHeight: 'min-h-[44px]',
      minWidth: 'min-w-[44px] sm:min-w-auto'
    },
    large: {
      icon: 'w-6 h-6 sm:w-5 sm:h-5',
      button: 'p-3 sm:p-2.5',
      text: 'text-lg sm:text-base',
      minHeight: 'min-h-[48px]',
      minWidth: 'min-w-[48px] sm:min-w-auto'
    }
  };

  const config = sizeConfig[size] || sizeConfig.default;

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        group flex items-center justify-center gap-1.5 
        ${config.button} ${config.minHeight} ${config.minWidth}
        rounded-lg border border-transparent
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-lg
        ${isFavorite 
          ? 'text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 hover:border-red-500/30' 
          : 'text-gray-400 hover:text-red-400 bg-gray-500/5 hover:bg-red-500/10 hover:border-red-500/20'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
        ${className}
      `}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-label={`${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} (${favoriteCount} favoris actuellement)`}
      aria-pressed={isFavorite}
    >
      <div className="relative">
        <Heart 
          className={`
            ${config.icon} transition-all duration-300
            ${isFavorite ? 'fill-red-400 text-red-400 scale-110' : 'text-current'}
            ${isLoading ? 'animate-pulse' : ''}
            group-hover:scale-125
          `}
        />
        
        {/* Effet de coeur qui pulse quand on ajoute */}
        {isFavorite && !isLoading && (
          <Heart 
            className={`
              ${config.icon} absolute inset-0 fill-red-400 text-red-400 
              animate-ping opacity-75 pointer-events-none
            `}
            style={{
              animationDuration: '0.6s',
              animationIterationCount: '1'
            }}
          />
        )}
      </div>
      
      {showCount && (
        <span className={`${config.text} font-medium select-none transition-all duration-200`}>
          <span className="hidden sm:inline">{favoriteCount.toLocaleString()}</span>
          <span className="sm:hidden" aria-hidden="true">
            {favoriteCount >= 1000 ? `${Math.floor(favoriteCount/1000)}k` : favoriteCount}
          </span>
        </span>
      )}
    </button>
  );
};

export default FavoriteButton; 
 
 
 