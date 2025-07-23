import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Stockage global pour les positions de scroll
const scrollPositions = new Map();
// Stockage pour détecter les retours arrière
const navigationHistory = [];
// Stockage pour les navigations entre novel et chapitre
const novelChapterHistory = [];

/**
 * Hook personnalisé pour forcer le scroll vers le haut lors des changements de page
 * Compatible avec tous les navigateurs et téléphones
 * Amélioré pour gérer les navigations de retour
 */
export const useScrollToTop = (dependencies = []) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentPath = useRef(location.pathname);
  const isInitialMount = useRef(true);
  const previousPath = useRef(null);

  useEffect(() => {
    const path = location.pathname;
    
    console.log(`useScrollToTop: ${path} - Navigation type: ${navigationType}`);
    console.log(`Chemin précédent: ${previousPath.current}`);
    console.log('Historique de navigation:', navigationHistory);
    console.log('Historique novel-chapitre:', novelChapterHistory);
    
    // Ne pas sauvegarder lors du montage initial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      currentPath.current = path;
      previousPath.current = path;
      navigationHistory.push(path);
      console.log(`useScrollToTop: Montage initial pour ${path}`);
      return;
    }

    // Détecter si c'est un retour arrière
    const isBackNavigation = navigationType === 'POP' || 
                            (navigationHistory.length > 1 && 
                             navigationHistory[navigationHistory.length - 2] === path);

    // Détecter les navigations entre novel et chapitre
    const isNovelPath = path.startsWith('/novel/');
    const isChapterPath = path.startsWith('/read/');
    const previousIsNovel = previousPath.current?.startsWith('/novel/');
    const previousIsChapter = previousPath.current?.startsWith('/read/');

    // Gérer l'historique novel-chapitre
    if (isNovelPath && previousIsChapter) {
      // Retour du chapitre vers le novel
      novelChapterHistory.push({ from: 'chapter', to: 'novel', path });
      console.log('Retour du chapitre vers le novel');
    } else if (isChapterPath && previousIsNovel) {
      // Navigation du novel vers le chapitre
      novelChapterHistory.push({ from: 'novel', to: 'chapter', path });
      console.log('Navigation du novel vers le chapitre');
    }

    console.log(`Détection retour arrière: ${isBackNavigation}`);

    // Gérer le scroll selon le type de navigation
    if (navigationType === 'PUSH' && !isBackNavigation) {
      // Nouvelle page : scroll en haut
      console.log('Navigation PUSH - Scroll en haut');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    } else if (navigationType === 'POP' || isBackNavigation) {
      // Retour en arrière : restaurer la position sauvegardée
      const savedPosition = scrollPositions.get(path);
      console.log(`Navigation POP/RETOUR - Position sauvegardée pour ${path}: ${savedPosition}`);
      console.log('Toutes les positions sauvegardées:', Object.fromEntries(scrollPositions));
      
      if (savedPosition !== undefined && savedPosition > 0) {
        // Attendre que le DOM soit prêt et restaurer la position
        const restorePosition = () => {
          window.scrollTo({ top: savedPosition, behavior: 'instant' });
          console.log(`Restauration position: ${savedPosition} (actuel: ${window.scrollY})`);
        };
        
        // Première tentative immédiate
        restorePosition();
        
        // Retry après un délai pour s'assurer que le DOM est prêt
        setTimeout(restorePosition, 100);
        setTimeout(restorePosition, 300);
        setTimeout(restorePosition, 500);
        setTimeout(restorePosition, 1000);
      } else {
        // Si pas de position sauvegardée, scroll en haut
        console.log('Aucune position sauvegardée - Scroll en haut');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (navigationType === 'REPLACE') {
      // Navigation REPLACE : scroll en haut
      console.log('Navigation REPLACE - Scroll en haut');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Mettre à jour les chemins et l'historique
    previousPath.current = currentPath.current;
    currentPath.current = path;
    
    // Mettre à jour l'historique de navigation
    if (navigationType === 'PUSH' && !isBackNavigation) {
      navigationHistory.push(path);
    } else if (navigationType === 'POP' || isBackNavigation) {
      // Retirer le dernier élément car on revient en arrière
      navigationHistory.pop();
    }
    
    // Limiter la taille de l'historique
    if (navigationHistory.length > 10) {
      navigationHistory.shift();
    }
    if (novelChapterHistory.length > 5) {
      novelChapterHistory.shift();
    }
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

/**
 * Fonction utilitaire pour sauvegarder la position de scroll actuelle
 * À utiliser dans le NavigationManager uniquement
 */
export const saveScrollPosition = (pathname) => {
  const currentScrollPosition = window.scrollY;
  scrollPositions.set(pathname, currentScrollPosition);
  console.log(`Sauvegarde position pour ${pathname}: ${currentScrollPosition}`);
  console.log('État actuel des positions:', Object.fromEntries(scrollPositions));
};

/**
 * Fonction utilitaire pour obtenir l'historique novel-chapitre
 */
export const getNovelChapterHistory = () => {
  return [...novelChapterHistory];
};

/**
 * Fonction utilitaire pour nettoyer les positions sauvegardées
 */
export const clearScrollPositions = () => {
  scrollPositions.clear();
  navigationHistory.length = 0;
  novelChapterHistory.length = 0;
};

/**
 * Fonction utilitaire pour afficher les positions sauvegardées (debug)
 */
export const debugScrollPositions = () => {
  console.log('Positions sauvegardées:', Object.fromEntries(scrollPositions));
  console.log('Historique de navigation:', navigationHistory);
  console.log('Historique novel-chapitre:', novelChapterHistory);
  return Object.fromEntries(scrollPositions);
};

export default useScrollToTop; 
 
 
 
 