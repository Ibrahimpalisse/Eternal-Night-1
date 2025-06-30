class Profile {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  }

  // Méthode générique pour les appels API avec gestion d'erreur
  async fetchWithErrorHandling(url, options, errorMessage) {
    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type') || '';
      
      if (!response.ok) {
        let errorData;
        if (contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          errorData = { message: text };
        }
        // Cas particulier 429
        if (response.status === 429) {
          throw new Error(errorData.message || 'Trop de requêtes, réessayez plus tard.');
        }
        const error = new Error(errorData.message || errorMessage);
        error.status = response.status;
        throw error;
      }
      
      if (contentType.includes('application/json')) {
      return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  }

  // Récupérer le profil complet avec les descriptions des rôles
  async getProfile() {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        },
        'Erreur lors de la récupération du profil'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(profileData)
        },
        'Erreur lors de la mise à jour du profil'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  // Mettre à jour l'avatar
  async updateAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/avatar`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        },
        'Erreur lors de la mise à jour de l\'avatar'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avatar:', error);
      throw error;
    }
  }

  // Supprimer l'avatar
  async removeAvatar() {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/avatar`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        },
        'Erreur lors de la suppression de l\'avatar'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avatar:', error);
      throw error;
    }
  }

  // Vérifier le mot de passe actuel
  async verifyCurrentPassword(currentPassword) {
    try {
      const response = await fetch(`${this.apiUrl}/profile/password/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword })
      });

      const data = await response.json();

      // Gérer spécifiquement les rate limits avec informations détaillées
      if (response.status === 429) {
        console.warn('Rate limit atteint:', data);
        
        // Si c'est une suspension de session, marquer dans localStorage avec expiration
        if (data.suspendSession) {
          const blockExpiry = Date.now() + (data.retryAfter * 1000); // retryAfter en secondes
          localStorage.setItem('security_block_expiry', blockExpiry.toString());
          localStorage.setItem('security_block_reason', 'password_attempts');
        }
        
        // Créer une erreur avec toutes les informations de rate limiting
        const error = new Error(data.message || 'Trop de tentatives');
        error.isRateLimit = true;
        error.suspendSession = data.suspendSession;
        error.attemptsRemaining = data.attemptsRemaining;
        error.currentAttempts = data.currentAttempts;
        error.maxAttempts = data.maxAttempts;
        error.retryAfter = data.retryAfter;
        
        throw error;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la vérification du mot de passe');
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification du mot de passe:', error);
      throw error;
    }
  }

  // Mettre à jour le mot de passe
  async updatePassword(passwordData) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(passwordData)
        },
        'Erreur lors de la mise à jour du mot de passe'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw error;
    }
  }

  // Vérifier la disponibilité d'un email
  async checkEmailAvailability(email) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/check-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email })
        },
        'Erreur lors de la vérification de la disponibilité de l\'email'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      throw error;
    }
  }

  // Demander un changement d'email
  async requestEmailChange(email) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/email`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email })
        },
        'Erreur lors de la demande de changement d\'email'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la demande de changement d\'email:', error);
      throw error;
    }
  }

  // Vérifier le code de changement d'email
  async verifyEmailChange(code) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/profile/email/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code })
        },
        'Erreur lors de la vérification du changement d\'email'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification du changement d\'email:', error);
      throw error;
    }
  }

  // Vérifier si l'utilisateur est actuellement bloqué par sécurité
  checkSecurityBlock() {
    const blockExpiry = localStorage.getItem('security_block_expiry');
    const blockReason = localStorage.getItem('security_block_reason');
    
    if (!blockExpiry) {
      return { blocked: false };
    }
    
    const expiryTime = parseInt(blockExpiry);
    const now = Date.now();
    
    // Si le blocage a expiré, nettoyer
    if (now >= expiryTime) {
      localStorage.removeItem('security_block_expiry');
      localStorage.removeItem('security_block_reason');
      return { blocked: false };
    }
    
    // Blocage encore actif
    const remainingTime = Math.ceil((expiryTime - now) / 1000);
    return {
      blocked: true,
      reason: blockReason,
      remainingTime: remainingTime,
      expiryTime: expiryTime
    };
  }

  // Nettoyer le blocage de sécurité (en cas de déconnexion manuelle)
  clearSecurityBlock() {
    localStorage.removeItem('security_block_expiry');
    localStorage.removeItem('security_block_reason');
  }
}

// Créer l'instance et l'exporter
const ProfileService = new Profile();

// Rendre l'instance disponible globalement pour les autres services
window.Profile = ProfileService;

export default ProfileService; 