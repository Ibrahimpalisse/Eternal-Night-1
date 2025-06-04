import { TOAST_TYPES } from '../components/Toast';

// Gestionnaire de toast global
let toastHandler = null;

// Fonction pour initialiser le gestionnaire de toast
export const initializeToastHandler = (handler) => {
  toastHandler = handler;
};

// Fonction utilitaire pour succès
export const successToast = (message, duration = 5000) => {
  if (toastHandler && toastHandler.success) {
    toastHandler.success(message, duration);
  }
};

// Fonction utilitaire pour erreur
export const errorToast = (message, duration = 5000) => {
  if (toastHandler && toastHandler.error) {
    toastHandler.error(message, duration);
  }
};

// Fonction utilitaire pour info
export const infoToast = (message, duration = 5000) => {
  if (toastHandler && toastHandler.info) {
    toastHandler.info(message, duration);
  }
};

// Fonction utilitaire pour warning
export const warningToast = (message, duration = 5000) => {
  if (toastHandler && toastHandler.warning) {
    toastHandler.warning(message, duration);
  }
}; 