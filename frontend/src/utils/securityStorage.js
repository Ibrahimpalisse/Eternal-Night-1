// Fonctions utilitaires sécurisées pour localStorage
export const securityStorage = {
  // Stocke une donnée avec expiration
  setItem: (key, value, expirationMinutes = 5) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + (expirationMinutes * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  // Récupère une donnée en vérifiant son expiration
  getItem: (key) => {
    const itemStr = localStorage.getItem(key);
    
    // Si l'élément n'existe pas, retourner null
    if (!itemStr) {
      return null;
    }
    
    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
      
      // Vérifier si l'élément a expiré
      if (now.getTime() > item.expiry) {
        // Si l'élément a expiré, le supprimer et retourner null
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (e) {
      // En cas d'erreur, supprimer l'élément pour éviter les problèmes
      localStorage.removeItem(key);
      return null;
    }
  },
  
  // Supprime une donnée
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  // Efface toutes les données
  clear: () => {
    localStorage.clear();
  }
}; 