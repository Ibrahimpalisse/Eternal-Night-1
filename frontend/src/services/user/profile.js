import { securityStorage } from '../../utils/securityStorage';

// Services de gestion du profil utilisateur
export class ProfileService {
  constructor(baseService) {
    this.baseService = baseService;
    this.apiUrl = baseService.apiUrl;
  }

  // Obtenir les informations de l'utilisateur connecté
  async getMe() {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/me`,
        {
          method: 'GET',
          credentials: 'include',
        },
        'Erreur lors de la récupération des informations utilisateur'
      );

      if (response.success && response.data) {
        // Mettre à jour les données utilisateur en mémoire et dans le stockage
        this.baseService.userDataInMemory = response.data;
        securityStorage.setItem('user', JSON.stringify(response.data));
        return response;
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Obtenir les informations en temps réel
  async getRealtimeInfo() {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/me/realtime`,
        {
          method: 'GET',
          credentials: 'include',
        },
        'Erreur lors de la récupération des informations en temps réel'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour le mot de passe
  async updatePassword(passwordData) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/profile/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(passwordData),
          credentials: 'include',
        },
        'Erreur lors de la mise à jour du mot de passe'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour le nom
  async updateName(name) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/auth/update-name`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name }),
          credentials: 'include',
        },
        'Erreur lors de la mise à jour du nom'
      );

      if (response.success && response.data) {
        // Mettre à jour les données utilisateur en mémoire et dans le stockage
        this.baseService.userDataInMemory = response.data;
        try {
          securityStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour l'email
  async updateEmail(email) {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/profile/email`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email }),
          credentials: 'include',
        },
        'Erreur lors de la mise à jour de l\'email'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour l'avatar
  async updateAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/profile/avatar`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        },
        'Erreur lors de la mise à jour de l\'avatar'
      );

      if (response.success && response.data) {
        // Mettre à jour les données utilisateur en mémoire et dans le stockage
        this.baseService.userDataInMemory = response.data;
        try {
          securityStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Supprimer l'avatar
  async removeAvatar() {
    try {
      const response = await this.baseService.fetchWithErrorHandling(
        `${this.apiUrl}/profile/avatar`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
        'Erreur lors de la suppression de l\'avatar'
      );

      if (response.success && response.data) {
        // Mettre à jour les données utilisateur en mémoire et dans le stockage
        this.baseService.userDataInMemory = response.data;
        try {
          securityStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
} 