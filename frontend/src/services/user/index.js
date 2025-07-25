// Import des services modulaires
import { AuthService } from './auth';
import { VerificationService } from './verification';
import { ProfileService } from './profile';

// Service de base avec les utilitaires communs
class BaseUserService {
  constructor() {
    // URL de base de l'API, à configurer selon votre environnement
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    // Variable pour suivre l'état de l'affichage du toast de rate limit
    this.rateLimitToastDisplayed = false;
    this.rateLimitToastTimeout = null;
    // Token refresh timer
    this.refreshTokenInterval = null;
    // Dernière fois que le token a été rafraîchi
    this.lastTokenRefresh = null;
    // Intervalle de rafraîchissement (45 minutes)
    this.refreshInterval = 45 * 60 * 1000;
    // Référence aux données utilisateur en mémoire (non persistantes)
    this.userDataInMemory = null;
    // Référence au socket
    this.socket = null;
    // Callback pour la déconnexion forcée
    this.forceLogoutCallback = null;
  }

  // Configuration du timer de rafraîchissement du token
  setupRefreshTokenTimer() {
    // Nettoyer tout intervalle existant
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
    }
    
    // Si l'utilisateur est connecté
    if (this.auth.isLoggedIn()) {
      // Démarrer un intervalle pour rafraîchir le token
      // Rafraîchir toutes les 90 minutes (token expire après 2h)
      this.refreshTokenInterval = setInterval(async () => {
        try {
          // Vérifier si le dernier rafraîchissement date de moins de 60 minutes
          if (this.lastTokenRefresh && Date.now() - this.lastTokenRefresh < 60 * 60 * 1000) {
            return; // Éviter les rafraîchissements trop fréquents
          }
          
          console.log('🔄 Rafraîchissement automatique du token...');
          // Rafraîchir le token
          await this.auth.refreshToken();
          console.log('✅ Token rafraîchi avec succès');
        } catch (error) {
          console.log('❌ Erreur lors du rafraîchissement automatique:', error.message);
          // Si le rafraîchissement échoue, déconnecter l'utilisateur seulement si c'est une erreur d'expiration
          if (error.message.includes('invalide') || error.message.includes('expiré') || error.message.includes('expired')) {
            await this.auth.handleForceLogout('Token de rafraîchissement expiré');
          }
        }
      }, this.refreshInterval); // 90 minutes
    }
  }

  // Méthode utilitaire pour gérer les erreurs et les requêtes
  async fetchWithErrorHandling(url, options, defaultErrorMessage) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        // Gestion spécifique des codes de statut
        switch (response.status) {
          case 401:
            if (data.message && data.message.includes('Token')) {
              await this.auth.handleForceLogout('Token invalide ou expiré');
              throw new Error('Session expirée. Veuillez vous reconnecter.');
            }
            throw new Error(data.message || 'Accès non autorisé');
          
          case 403:
            throw new Error(data.message || 'Accès interdit');
          
          case 404:
            throw new Error(data.message || 'Ressource non trouvée');
          
          case 429:
            // Rate limiting
            if (!this.rateLimitToastDisplayed) {
              this.rateLimitToastDisplayed = true;
              console.warn('Rate limit atteint. Veuillez patienter.');
              
              // Réinitialiser le flag après 30 secondes
              if (this.rateLimitToastTimeout) {
                clearTimeout(this.rateLimitToastTimeout);
              }
              this.rateLimitToastTimeout = setTimeout(() => {
                this.rateLimitToastDisplayed = false;
              }, 30000);
            }
            throw new Error(data.message || 'Trop de tentatives. Veuillez patienter.');
          
          case 500:
            throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
          
          default:
            throw new Error(data.message || defaultErrorMessage);
        }
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      }
      throw error;
    }
  }
}

// Service principal qui combine tous les modules
class UserService extends BaseUserService {
  constructor() {
    super();
    
    // Initialisation des services modulaires
    this.auth = new AuthService(this);
    this.verification = new VerificationService(this);
    this.profile = new ProfileService(this);
    
    // Démarrer le timer de rafraîchissement si un token existe
    this.setupRefreshTokenTimer();
  }

  // Méthodes de compatibilité pour l'ancien API (délégation)
  async register(userData) {
    return this.auth.register(userData);
  }

  async login(credentials) {
    return this.auth.login(credentials);
  }

  async logout() {
    return this.auth.logout();
  }

  async refreshToken() {
    return this.auth.refreshToken();
  }

  async verifyEmail(email, code) {
    return this.verification.verifyEmail(email, code);
  }

  async resendVerification(email) {
    return this.verification.resendVerification(email);
  }

  async forgotPassword(email) {
    return this.verification.forgotPassword(email);
  }

  async resetPassword(code, password) {
    return this.verification.resetPassword(code, password);
  }

  async getMe() {
    return this.profile.getMe();
  }

  async checkResetToken(code) {
    return this.verification.checkResetToken(code);
  }

  async getRealtimeInfo() {
    return this.profile.getRealtimeInfo();
  }

  async logoutAllSessions() {
    return this.auth.logoutAllSessions();
  }

  async handleForceLogout(reason) {
    return this.auth.handleForceLogout(reason);
  }

  async checkPassword(password) {
    return this.verification.checkPassword(password);
  }

  async verifyCurrentPassword(currentPassword) {
    return this.verification.verifyCurrentPassword(currentPassword);
  }

  async updatePassword(passwordData) {
    return this.profile.updatePassword(passwordData);
  }

  async updateName(name) {
    return this.profile.updateName(name);
  }

  async updateEmail(email) {
    return this.profile.updateEmail(email);
  }

  async verifyEmailChange(code) {
    return this.verification.verifyEmailChange(code);
  }

  async checkEmailAvailability(email) {
    return this.verification.checkEmailAvailability(email);
  }

  async updateAvatar(file) {
    return this.profile.updateAvatar(file);
  }

  async removeAvatar() {
    return this.profile.removeAvatar();
  }

  // Méthodes utilitaires
  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  getToken() {
    return this.auth.getToken();
  }

  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  // Setter pour le callback de déconnexion forcée
  setForceLogoutCallback(callback) {
    this.forceLogoutCallback = callback;
  }

  // Setter pour le socket
  setSocket(socket) {
    this.socket = socket;
  }
}

// Export par défaut du service principal
export default UserService;

// Exports nommés pour les services modulaires
export { AuthService, VerificationService, ProfileService }; 