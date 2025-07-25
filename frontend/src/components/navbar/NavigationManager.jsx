import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveScrollPosition, getNovelChapterHistory } from '../../hooks/useScrollToTop';

// Contexte pour partager les fonctions de navigation
const NavigationContext = createContext();

/**
 * Hook personnalisé pour utiliser les fonctions de navigation
 */
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

/**
 * Composant provider pour la navigation
 */
export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Sauvegarder la position actuelle avant de naviguer
   */
  const saveCurrentPosition = useCallback(() => {
    saveScrollPosition(location.pathname);
  }, [location.pathname]);

  /**
   * Naviguer vers un roman avec gestion du state
   */
  const navigateToNovel = useCallback((novelId, from = 'home') => {
    saveCurrentPosition();
    navigate(`/novel/${novelId}`, { 
      state: { from } 
    });
  }, [navigate, saveCurrentPosition]);

  /**
   * Naviguer vers un chapitre
   */
  const navigateToChapter = useCallback((novelId, chapterNumber) => {
    saveCurrentPosition();
    navigate(`/read/${novelId}/chapter/${chapterNumber}`);
  }, [navigate, saveCurrentPosition]);

  /**
   * Retourner à la page précédente avec gestion intelligente
   * Amélioré pour gérer les navigations entre novel et chapitre
   */
  const goBack = useCallback((from) => {
    console.log('NavigationManager: Retour arrière vers', from);
    
    // Obtenir l'historique novel-chapitre
    const novelChapterHistory = getNovelChapterHistory();
    console.log('Historique novel-chapitre:', novelChapterHistory);
    
    // Vérifier si on est sur une page novel et s'il y a un historique novel-chapitre
    const isOnNovelPage = location.pathname.startsWith('/novel/');
    const lastNavigation = novelChapterHistory[novelChapterHistory.length - 1];
    
    if (isOnNovelPage && lastNavigation && lastNavigation.from === 'chapter' && lastNavigation.to === 'novel') {
      // Si on vient de revenir du chapitre vers le novel, retourner à la page d'origine
      console.log('Retour depuis novel vers la page d\'origine:', from);
      if (from === 'library') {
        navigate('/library');
      } else if (from === 'home') {
        navigate('/');
      } else {
        // Fallback : retour à la page précédente
        navigate(-1);
      }
    } else {
      // Comportement normal : retour à la page précédente
      console.log('Retour normal vers la page précédente');
      navigate(-1);
    }
  }, [navigate, location.pathname]);

  /**
   * Retourner à la page d'accueil
   */
  const goHome = useCallback(() => {
    saveCurrentPosition();
    navigate('/');
  }, [navigate, saveCurrentPosition]);

  /**
   * Naviguer vers la bibliothèque
   */
  const goToLibrary = useCallback(() => {
    saveCurrentPosition();
    navigate('/library');
  }, [navigate, saveCurrentPosition]);

  /**
   * Naviguer vers une page spécifique
   */
  const goToPage = useCallback((path, state = {}) => {
    saveCurrentPosition();
    navigate(path, { state });
  }, [navigate, saveCurrentPosition]);

  const navigationFunctions = {
    navigateToNovel,
    navigateToChapter,
    goBack,
    goHome,
    goToLibrary,
    goToPage,
    currentLocation: location
  };

  return (
    <NavigationContext.Provider value={navigationFunctions}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider; 