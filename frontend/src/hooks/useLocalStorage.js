import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer la persistance d'état dans localStorage
 * @param {string} key - Clé pour le localStorage
 * @param {any} defaultValue - Valeur par défaut si aucune valeur n'est sauvegardée
 * @returns {[any, function]} - [valeur, setter]
 */
export const useLocalStorage = (key, defaultValue) => {
  // Initialiser l'état avec la valeur du localStorage
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Erreur lors de la lecture du localStorage pour la clé "${key}":`, error);
      return defaultValue;
    }
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Erreur lors de la sauvegarde dans localStorage pour la clé "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

/**
 * Hook spécialisé pour le mode d'affichage (liste/grille)
 * @returns {['grid' | 'list', function]} - [viewMode, setViewMode]
 */
export const useViewMode = () => {
  return useLocalStorage('library-view-mode', 'grid');
};

/**
 * Hook spécialisé pour l'état des filtres (ouvert/fermé)
 * @returns {[boolean, function]} - [showFilters, setShowFilters]
 */
export const useFilterState = () => {
  return useLocalStorage('library-filters-open', true);
}; 