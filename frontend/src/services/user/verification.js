import { securityStorage } from '../../utils/securityStorage';

// Services de vérification et gestion des mots de passe
export class VerificationService {
  constructor(baseService) {
    this.baseService = baseService;
    this.apiUrl = baseService.apiUrl;
  }

  // Vérification de l'email avec le code reçu
  async verifyEmail(email, code) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/verify-email`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code })
        },
        'Erreur lors de la vérification de l\'email'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Renvoyer l'email de vérification
  async resendVerification(email) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/resend-verification`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        },
        'Erreur lors du renvoi de l\'email de vérification'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Demande de réinitialisation de mot de passe
  async forgotPassword(email) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/forgot-password`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        },
        'Erreur lors de la demande de réinitialisation'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Réinitialisation du mot de passe avec le code
  async resetPassword(code, password) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/reset-password`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, password })
        },
        'Erreur lors de la réinitialisation du mot de passe'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier la validité du code de réinitialisation
  async checkResetToken(code) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/check-reset-token`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        },
        'Erreur lors de la vérification du code'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier le mot de passe actuel
  async checkPassword(password) {
    try {
      const token = securityStorage.getItem('token');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/user/check-password`, 
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password })
        },
        'Erreur lors de la vérification du mot de passe'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier le mot de passe actuel (méthode alternative)
  async verifyCurrentPassword(currentPassword) {
    try {
      const token = securityStorage.getItem('token');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/user/verify-password`, 
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ currentPassword })
        },
        'Erreur lors de la vérification du mot de passe'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Changer l'email - vérifier le code de changement
  async verifyEmailChange(code) {
    try {
      const token = securityStorage.getItem('token');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/user/verify-email-change`, 
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        },
        'Erreur lors de la vérification du changement d\'email'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier la disponibilité d'un email
  async checkEmailAvailability(email) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/check-email`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        },
        'Erreur lors de la vérification de l\'email'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
} 