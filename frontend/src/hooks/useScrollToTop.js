import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Hook personnalisé pour forcer le scroll vers le haut lors des changements de page
 * Compatible avec tous les navigateurs et téléphones
 */
export const useScrollToTop = (dependencies = []) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Ne scroll en haut QUE si navigationType est 'PUSH' (nouvelle page)
    if (navigationType === 'PUSH') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    }
    // Si navigationType === 'POP', on laisse le scroll natif du navigateur
  }, [location.pathname, location.search, navigationType, ...dependencies]);
};

/**
 * Hook pour scroll vers le haut lors des changements de paramètres spécifiques
 * Utile pour les pages avec des paramètres dynamiques
 */
export const useScrollToTopOnChange = (...dependencies) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }, dependencies);
};

export default useScrollToTop; 
 
 
 
 