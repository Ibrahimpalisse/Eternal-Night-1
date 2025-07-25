import { securityStorage } from '../../utils/securityStorage';

// Services d'authentification
export class AuthService {
  constructor(baseService) {
    this.baseService = baseService;
    this.apiUrl = baseService.apiUrl;
  }

  // Inscription d'un nouvel utilisateur
  async register(userData) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/register`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        },
        'Erreur lors de l\'inscription'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Connexion d'un utilisateur
  async login(credentials) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/login`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include',
        },
        'Erreur lors de la connexion'
      );

      if (response.success && response.data && response.data.token) {
        // Stocker le token et les informations utilisateur
        securityStorage.setItem('token', response.data.token, 120);
        securityStorage.setItem('user', JSON.stringify(response.data.user), 120);
        securityStorage.setItem('refreshToken', response.data.refreshToken, 240);
        
        // Configurer les données utilisateur en mémoire
        this.baseService.userDataInMemory = response.data.user;
        
        // Démarrer le timer de rafraîchissement du token
        this.baseService.setupRefreshTokenTimer();
        
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion de l'utilisateur
  async logout() {
    try {
      const token = securityStorage.getItem('token');
      if (token) {
        try {
          const response = await this.baseService.fetchWithErrorHandling(
            `${this.apiUrl}/auth/logout`, 
            {
              method: 'POST',
              credentials: 'include',
            },
            'Erreur lors de la déconnexion'
          );
        } catch (error) {
          // Ne pas bloquer la déconnexion si l'API échoue
          console.warn('Erreur lors de la déconnexion côté serveur:', error.message);
        }
      }

      // Nettoyer le stockage local et les données en mémoire
      securityStorage.clear();
      this.baseService.userDataInMemory = null;
      
      // Nettoyer le timer de rafraîchissement
      if (this.baseService.refreshTokenInterval) {
        clearInterval(this.baseService.refreshTokenInterval);
        this.baseService.refreshTokenInterval = null;
      }

      return { success: true, message: 'Déconnexion réussie' };
    } catch (error) {
      throw error;
    }
  }

  // Rafraîchir le token
  async refreshToken() {
    try {
      const refreshToken = securityStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Token de rafraîchissement manquant');
      }

      const response = await fetch(`${this.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Token de rafraîchissement invalide ou expiré');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Mettre à jour les tokens
        securityStorage.setItem('token', data.data.token, 120);
        if (data.data.refreshToken) {
          securityStorage.setItem('refreshToken', data.data.refreshToken, 240);
        }
        
        // Mettre à jour le timestamp du dernier rafraîchissement
        this.baseService.lastTokenRefresh = Date.now();
        
        return data;
      } else {
        throw new Error(data.message || 'Erreur lors du rafraîchissement du token');
      }
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion de toutes les sessions
  async logoutAllSessions() {
    try {
      const token = securityStorage.getItem('token');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      // Affichage d'une notification de confirmation
      const confirmLogout = window.confirm(
        'Êtes-vous sûr de vouloir vous déconnecter de tous les appareils ? Cette action est irréversible.'
      );
      
      if (!confirmLogout) {
        return { success: false, message: 'Action annulée par l\'utilisateur' };
      }

      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/logout-all`, 
        {
          method: 'POST',
          credentials: 'include',
        },
        'Erreur lors de la déconnexion de tous les appareils'
      );

      if (response.success) {
        // Nettoyer le stockage local
        securityStorage.clear();
        this.baseService.userDataInMemory = null;
        
        // Nettoyer le timer de rafraîchissement
        if (this.baseService.refreshTokenInterval) {
          clearInterval(this.baseService.refreshTokenInterval);
          this.baseService.refreshTokenInterval = null;
        }

        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Gestion de la déconnexion forcée
  async handleForceLogout(reason) {
    try {
      console.log('🚨 Déconnexion forcée détectée:', reason);
      
      // Nettoyer immédiatement le stockage local
      securityStorage.clear();
      this.baseService.userDataInMemory = null;
      
      // Nettoyer le timer de rafraîchissement
      if (this.baseService.refreshTokenInterval) {
        clearInterval(this.baseService.refreshTokenInterval);
        this.baseService.refreshTokenInterval = null;
      }

      // Appeler le callback de déconnexion forcée si défini
      if (this.baseService.forceLogoutCallback) {
        this.baseService.forceLogoutCallback(reason);
      }

      // Redirection vers la page de connexion
      window.location.href = '/auth/login?forced=true&reason=' + encodeURIComponent(reason);
      
      return { success: true, message: 'Déconnexion forcée effectuée' };
    } catch (error) {
      console.error('Erreur lors de la déconnexion forcée:', error);
      // En cas d'erreur, forcer quand même la redirection
      window.location.href = '/auth/login?forced=true';
      throw error;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn() {
    return !!securityStorage.getItem('token');
  }

  // Obtenir le token actuel
  getToken() {
    return securityStorage.getItem('token');
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    if (this.baseService.userDataInMemory) {
      return this.baseService.userDataInMemory;
    }
    
    const userData = securityStorage.getItem('user');
    if (userData) {
      try {
        this.baseService.userDataInMemory = JSON.parse(userData);
        return this.baseService.userDataInMemory;
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        // Nettoyer les données corrompues
        securityStorage.removeItem('user');
        return null;
      }
    }
    
    return null;
  }
} 