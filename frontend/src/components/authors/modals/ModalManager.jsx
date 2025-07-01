import React, { useState, createContext, useContext } from 'react';

// Contexte pour la gestion des modales
const ModalContext = createContext();

// Hook pour utiliser le contexte des modales
export const useModalManager = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalManager must be used within a ModalProvider');
  }
  return context;
};

// Provider pour la gestion des modales
export const ModalProvider = ({ children }) => {
  const [modalStack, setModalStack] = useState([]);

  // Ouvrir une nouvelle modale
  const openModal = (modalConfig) => {
    setModalStack(prev => [...prev, modalConfig]);
  };

  // Fermer la modale courante
  const closeModal = () => {
    setModalStack(prev => prev.slice(0, -1));
  };

  // Fermer toutes les modales
  const closeAllModals = () => {
    setModalStack([]);
  };

  // Remplacer la modale courante par une nouvelle
  const replaceModal = (modalConfig) => {
    setModalStack(prev => [...prev.slice(0, -1), modalConfig]);
  };

  // Obtenir la modale courante
  const getCurrentModal = () => {
    return modalStack[modalStack.length - 1] || null;
  };

  // Vérifier s'il y a des modales ouvertes
  const hasOpenModals = () => {
    return modalStack.length > 0;
  };

  const value = {
    modalStack,
    openModal,
    closeModal,
    closeAllModals,
    replaceModal,
    getCurrentModal,
    hasOpenModals
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  );
};

// Composant pour rendre les modales
const ModalRenderer = () => {
  const { getCurrentModal } = useModalManager();
  const currentModal = getCurrentModal();

  if (!currentModal) return null;

  const { component: Component, props } = currentModal;
  
  return <Component {...props} />;
};

// Types de modales disponibles
export const MODAL_TYPES = {
  NOVEL_DETAILS: 'NOVEL_DETAILS',
  NOVEL_EDIT: 'NOVEL_EDIT',
  NOVEL_CREATE: 'NOVEL_CREATE',
  NOVEL_DELETE: 'NOVEL_DELETE',
  NOVEL_REQUEST: 'NOVEL_REQUEST',
  PUBLISH_CONFIRMATION: 'PUBLISH_CONFIRMATION',
  DELETE_CONFIRMATION: 'DELETE_CONFIRMATION',
  EDIT_CONFIRMATION: 'EDIT_CONFIRMATION'
}; 