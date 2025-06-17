class Profile {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  }

  // Méthode générique pour les appels API avec gestion d'erreur
  async fetchWithErrorHandling(url, options, errorMessage) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || errorMessage);
        error.status = response.status;
        throw error;
      }
      
      return await response.json();
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
}

export default new Profile(); 