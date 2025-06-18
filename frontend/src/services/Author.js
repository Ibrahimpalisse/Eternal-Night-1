import api from './ApiInterceptor';

class AuthorService {
  /**
   * Récupérer le statut de candidature de l'utilisateur connecté
   * @returns {Promise<Object>} - Statut de la candidature
   */
  static async getApplicationStatus() {
    try {
      console.log('📋 Récupération du statut de candidature...');
      
      const response = await api.get('/authors/status');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Statut récupéré:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur dans getApplicationStatus:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Soumettre une candidature d'auteur
   * @param {Object} applicationData - Données de la candidature
   * @returns {Promise<Object>} - Réponse de l'API
   */
  static async submitApplication(applicationData) {
    try {
      console.log('🚀 Envoi de la candidature vers l\'API...');
      console.log('📋 Données envoyées:', applicationData);
      
      const response = await api.post('/authors/apply', applicationData);
      console.log('✅ Réponse API reçue:', response);
      
      if (!response.ok) {
        console.log('❌ Réponse non-OK:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Données d\'erreur:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Données de succès:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur dans submitApplication:', error);
      throw this.handleError(error);
    }
  }



  /**
   * Récupérer tous les auteurs avec pagination (public)
   * @param {Object} params - Paramètres de pagination
   * @returns {Promise<Object>} - Liste des auteurs avec pagination
   */
  static async getAllAuthors(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      const url = `/authors?page=${page}&limit=${limit}`;
      const response = await api.get(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gérer les erreurs de l'API
   * @param {Error} error - Erreur de l'API
   * @returns {Error} - Erreur formatée
   */
  static handleError(error) {
    // Si l'erreur a déjà un message explicite, le retourner
    if (error.message) {
      return error;
    }
    
    // Gestion pour les réponses fetch
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.status === 401) {
      return new Error('Vous devez être connecté pour effectuer cette action');
    }
    
    if (error.response?.status === 403) {
      return new Error('Vous n\'avez pas les permissions nécessaires');
    }
    
    if (error.response?.status === 404) {
      return new Error('Ressource non trouvée');
    }
    
    if (error.response?.status === 409) {
      return new Error(error.response.data?.message || 'Conflit de données');
    }
    
    if (error.response?.status === 429) {
      return new Error('Trop de tentatives, veuillez réessayer plus tard');
    }
    
    if (error.response?.status >= 500) {
      return new Error('Erreur serveur, veuillez réessayer plus tard');
    }
    
    return new Error('Erreur de connexion');
  }
}

export default AuthorService; 