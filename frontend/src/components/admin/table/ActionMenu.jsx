import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Check,
  X,
  EyeOff,
  Pause,
  FileText,
  MessageCircle,
  Activity,
  Search
} from 'lucide-react';

// Hook personnalisé pour le portal
const usePortal = () => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    // Créer un élément div pour le portal s'il n'existe pas
    let element = document.getElementById('action-menu-portal');
    if (!element) {
      element = document.createElement('div');
      element.id = 'action-menu-portal';
      element.style.position = 'relative';
      element.style.zIndex = '999999';
      document.body.appendChild(element);
    }
    setPortalElement(element);

    // Nettoyer lors du démontage du composant
    return () => {
      if (element && element.parentNode && !document.querySelector('[data-portal-active]')) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  return portalElement;
};

// Hook personnalisé pour la détection responsive
const useResponsiveDetection = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

// Hook pour le positionnement intelligent
const useSmartPositioning = (isOpen, buttonRef, menuHeight = 250) => {
  const [position, setPosition] = useState({
    style: {},
    placement: 'bottom-right'
  });

  const viewport = useResponsiveDetection();

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const calculatePosition = () => {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const padding = viewport.isMobile ? 16 : 20;
      const menuWidth = viewport.isMobile ? Math.min(280, viewport.width - 32) : 240;
      
      // Calcul des espaces disponibles
      const spaceAbove = buttonRect.top;
      const spaceBelow = viewport.height - buttonRect.bottom;
      const spaceLeft = buttonRect.left;
      const spaceRight = viewport.width - buttonRect.right;

      let placement = 'bottom-right';
      let style = {};

      // Déterminer la position verticale
      if (spaceBelow >= menuHeight + padding) {
        // Assez d'espace en bas
        style.top = buttonRect.bottom + 8;
        placement = placement.replace('top', 'bottom');
      } else if (spaceAbove >= menuHeight + padding) {
        // Assez d'espace en haut
        style.bottom = viewport.height - buttonRect.top + 8;
        placement = placement.replace('bottom', 'top');
      } else {
        // Espace limité, centrer verticalement si possible
        const availableHeight = Math.max(spaceAbove, spaceBelow) - padding;
        style.top = Math.max(padding, buttonRect.top - (menuHeight - availableHeight) / 2);
        style.maxHeight = availableHeight;
        placement = 'center-right';
      }

      // Déterminer la position horizontale
      if (spaceRight >= menuWidth + padding) {
        // Assez d'espace à droite
        style.left = buttonRect.right - menuWidth;
        placement = placement.replace('left', 'right');
      } else if (spaceLeft >= menuWidth + padding) {
        // Assez d'espace à gauche
        style.right = viewport.width - buttonRect.left;
        placement = placement.replace('right', 'left');
      } else {
        // Sur mobile, centrer horizontalement
        if (viewport.isMobile) {
          style.left = padding;
          style.right = padding;
          style.width = 'auto';
          placement = placement.includes('top') ? 'top-center' : 'bottom-center';
        } else {
          style.right = padding;
          placement = placement.replace('left', 'right');
        }
      }

      style.width = viewport.isMobile ? 'auto' : menuWidth;

      setPosition({ style, placement });
    };

    // Utiliser requestAnimationFrame pour des calculs fluides
    const rafId = requestAnimationFrame(calculatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, viewport, menuHeight]);

  return position;
};

const ActionMenu = ({ item, onView, onEdit, onDelete, onQuickAction, onViewChapters, onViewComments, onViewLoginHistory, onViewSearchHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const viewport = useResponsiveDetection();
  const portalElement = usePortal();
  const { style: dropdownStyle, placement } = useSmartPositioning(isOpen, buttonRef);

  // Gestion des clics en dehors avec optimisation
  useEffect(() => {
    if (!isOpen) return;

    const handleInteraction = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Support des interactions tactiles et souris
    document.addEventListener('mousedown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('mousedown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [isOpen]);

  // Gestion intelligente du scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (event) => {
      // Ne pas fermer si on scrolle dans le menu lui-même
      if (menuRef.current && (
          menuRef.current.contains(event.target) || 
          menuRef.current === event.target
        )) {
        return; // Garder le menu ouvert
      }
      // Fermer si on scrolle sur la page
      setIsOpen(false);
    };

    // Utiliser capture: true pour intercepter le scroll avant qu'il n'atteigne les éléments enfants
    document.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  // Gestion du clavier pour l'accessibilité
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Mémorisation des actions de statut pour optimiser les performances
  const statusActions = useMemo(() => {
    switch (item.status) {
      case 'pending':
        // Pour les chapitres en attente : pas d'actions d'acceptation/refus disponibles
        return [];
      case 'ready_for_acceptance':
        // Pour les chapitres vérifiés : afficher accepter et refuser
        return [
          { 
            label: 'Accepter', 
            action: () => onQuickAction(item, 'accept'), 
            icon: Check, 
            color: 'text-green-400 hover:text-green-300',
            hoverBg: 'hover:bg-green-500/10'
          },
          { 
            label: 'Refuser', 
            action: () => onQuickAction(item, 'reject'), 
            icon: X, 
            color: 'text-red-400 hover:text-red-300',
            hoverBg: 'hover:bg-red-500/10'
          }
        ];
      case 'accepted_unpublished':
        // Pour les chapitres acceptés : option de publication
        return [
          { 
            label: 'Publier', 
            action: () => onQuickAction(item, 'publish'), 
            icon: Eye, 
            color: 'text-blue-400 hover:text-blue-300',
            hoverBg: 'hover:bg-blue-500/10'
          }
        ];
      case 'published':
        return [
          { 
            label: 'Dépublier', 
            action: () => onQuickAction(item, 'unpublish'), 
            icon: EyeOff, 
            color: 'text-orange-400 hover:text-orange-300',
            hoverBg: 'hover:bg-orange-500/10'
          }
        ];
      case 'unpublished':
        return [
          { 
            label: 'Republier', 
            action: () => onQuickAction(item, 'republish'), 
            icon: Eye, 
            color: 'text-blue-400 hover:text-blue-300',
            hoverBg: 'hover:bg-blue-500/10'
          }
        ];
      default:
        return [];
    }
  }, [item.status, item, onQuickAction]);

  // Callbacks optimisés
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleActionClick = useCallback((action) => {
    action();
    setIsOpen(false);
  }, []);

  const handleViewClick = useCallback(() => {
    onView(item);
    setIsOpen(false);
  }, [onView, item]);

  const handleEditClick = useCallback(() => {
    onEdit(item);
    setIsOpen(false);
  }, [onEdit, item]);

  const handleDeleteClick = useCallback(() => {
    onDelete(item);
    setIsOpen(false);
  }, [onDelete, item]);

  const handleViewChaptersClick = useCallback(() => {
    if (onViewChapters) {
      onViewChapters(item);
      setIsOpen(false);
    }
  }, [onViewChapters, item]);

  const handleViewCommentsClick = useCallback(() => {
    if (onViewComments) {
      onViewComments(item);
      setIsOpen(false);
    }
  }, [onViewComments, item]);

  const handleViewLoginHistoryClick = useCallback(() => {
    if (onViewLoginHistory) {
      onViewLoginHistory(item);
      setIsOpen(false);
    }
  }, [onViewLoginHistory, item]);

  const handleViewSearchHistoryClick = useCallback(() => {
    if (onViewSearchHistory) {
      onViewSearchHistory(item);
      setIsOpen(false);
    }
  }, [onViewSearchHistory, item]);

  // Classes CSS adaptatives selon le viewport
  const buttonClasses = useMemo(() => {
    const base = "relative rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-500/50";
    return viewport.isMobile ? `${base} p-3 touch-manipulation` : `${base} p-2`;
  }, [viewport.isMobile]);

  const iconSize = viewport.isMobile ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={buttonClasses}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Menu d'actions"
      >
        <MoreHorizontal className={`${iconSize} text-white/70 group-hover:text-white transition-colors`} />
      </button>

      {isOpen && portalElement && createPortal(
        <>
          {/* Backdrop pour mobile */}
          {viewport.isMobile && (
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              style={{ zIndex: 999998 }}
              onClick={() => setIsOpen(false)}
            />
          )}
          
          {/* Menu dropdown */}
          <div 
            ref={menuRef}
            data-portal-active="true"
            className={`
              bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl
              ${viewport.isMobile ? 'mx-4' : ''}
              ${placement.includes('center') ? 'transform-gpu' : ''}
            `}
            style={{ 
              position: 'fixed',
              zIndex: 999999,
              ...dropdownStyle,
              // Animation d'entrée moderne
              animation: 'slideIn 0.15s ease-out',
            }}
            role="menu"
            aria-orientation="vertical"
          >
            <div className={`${viewport.isMobile ? 'py-3' : 'py-2'}`}>
              {/* Actions principales */}
              <button
                onClick={handleViewClick}
                className={`
                  w-full text-left text-white/80 hover:text-white hover:bg-white/10 
                  transition-all duration-150 flex items-center
                  ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                `}
                role="menuitem"
              >
                <Eye className={`${iconSize} mr-3 flex-shrink-0`} />
                <span>Voir les détails</span>
              </button>
              
              <button
                onClick={handleEditClick}
                className={`
                  w-full text-left text-white/80 hover:text-white hover:bg-white/10 
                  transition-all duration-150 flex items-center
                  ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                `}
                role="menuitem"
              >
                <Edit3 className={`${iconSize} mr-3 flex-shrink-0`} />
                <span>Modifier</span>
              </button>

              {/* Voir les chapitres - seulement si onViewChapters est fourni */}
              {onViewChapters && (
                <button
                  onClick={handleViewChaptersClick}
                  className={`
                    w-full text-left text-white/80 hover:text-white hover:bg-white/10 
                    transition-all duration-150 flex items-center
                    ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                  `}
                  role="menuitem"
                >
                  <FileText className={`${iconSize} mr-3 flex-shrink-0`} />
                  <span>Voir les chapitres</span>
                </button>
              )}

              {/* Voir les commentaires - seulement si onViewComments est fourni */}
              {onViewComments && (
                <button
                  onClick={handleViewCommentsClick}
                  className={`
                    w-full text-left text-white/80 hover:text-white hover:bg-white/10 
                    transition-all duration-150 flex items-center
                    ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                  `}
                  role="menuitem"
                >
                  <MessageCircle className={`${iconSize} mr-3 flex-shrink-0`} />
                  <span>Historique des commentaires</span>
                </button>
              )}

              {/* Voir l'historique des connexions - seulement si onViewLoginHistory est fourni */}
              {onViewLoginHistory && (
                <button
                  onClick={handleViewLoginHistoryClick}
                  className={`
                    w-full text-left text-white/80 hover:text-white hover:bg-white/10 
                    transition-all duration-150 flex items-center
                    ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                  `}
                  role="menuitem"
                >
                  <Activity className={`${iconSize} mr-3 flex-shrink-0`} />
                  <span>Historique des connexions</span>
                </button>
              )}

              {/* Voir l'historique de recherche - seulement si onViewSearchHistory est fourni */}
              {onViewSearchHistory && (
                <button
                  onClick={handleViewSearchHistoryClick}
                  className={`
                    w-full text-left text-white/80 hover:text-white hover:bg-white/10 
                    transition-all duration-150 flex items-center
                    ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                  `}
                  role="menuitem"
                >
                  <Search className={`${iconSize} mr-3 flex-shrink-0`} />
                  <span>Historique de recherche</span>
                </button>
              )}

              {/* Actions de statut */}
              {statusActions.length > 0 && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  {statusActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleActionClick(action.action)}
                      className={`
                        w-full text-left transition-all duration-150 flex items-center
                        ${action.color} ${action.hoverBg}
                        ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                      `}
                      role="menuitem"
                    >
                      <action.icon className={`${iconSize} mr-3 flex-shrink-0`} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </>
              )}

              {/* Action de suppression */}
              <div className="border-t border-white/10 my-2" />
              <button
                onClick={handleDeleteClick}
                className={`
                  w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 
                  transition-all duration-150 flex items-center
                  ${viewport.isMobile ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
                `}
                role="menuitem"
              >
                <Trash2 className={`${iconSize} mr-3 flex-shrink-0`} />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </>,
        portalElement
      )}


    </div>
  );
};

export default ActionMenu; 