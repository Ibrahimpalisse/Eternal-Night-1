class User {
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
    
    // Démarrer le timer de rafraîchissement si un token existe
    this.setupRefreshTokenTimer();
  }

  // Configuration du timer de rafraîchissement du token
  setupRefreshTokenTimer() {
    // Nettoyer tout intervalle existant
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
    }
    
    // Si l'utilisateur est connecté
    if (this.isLoggedIn()) {
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
          await this.refreshToken();
          console.log('✅ Token rafraîchi avec succès');
        } catch (error) {
          console.log('❌ Erreur lors du rafraîchissement automatique:', error.message);
          // Si le rafraîchissement échoue, déconnecter l'utilisateur seulement si c'est une erreur d'expiration
          if (error.message.includes('invalide') || error.message.includes('expiré') || error.message.includes('expired')) {
            console.log('🚪 Déconnexion automatique due à l\'expiration du token');
            this.handleForceLogout('Token refresh failed');
          }
        }
      }, 90 * 60 * 1000); // 90 minutes
    }
  }

  // Méthode pour rafraîchir le token
  async refreshToken() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include', // Inclure les cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        // Dispatch event for failed refresh
        window.dispatchEvent(new CustomEvent('token:refresh-failed'));
        throw new Error(error.message || 'Erreur lors du rafraîchissement du token');
      }

      const data = await response.json();
      
      // Mise à jour de la dernière fois que le token a été rafraîchi
      this.lastTokenRefresh = Date.now();

      // Dispatch event for successful refresh
      window.dispatchEvent(new CustomEvent('token:refreshed'));

      return data;
    } catch (error) {
      // Dispatch event for failed refresh if not already done
      if (!error.message.includes('Erreur lors du rafraîchissement')) {
        window.dispatchEvent(new CustomEvent('token:refresh-failed'));
      }
      throw error;
    }
  }

  // Méthode pour gérer les erreurs de rate limit et autres erreurs HTTP
  handleResponseError(response, data, defaultErrorMessage) {
    // Si c'est une erreur 429 (Too Many Requests)
    if (response.status === 429) {
      // Si un toast de rate limit n'est pas déjà affiché
      if (!this.rateLimitToastDisplayed) {
        this.rateLimitToastDisplayed = true;
        
        // Réinitialiser l'état après 5 secondes pour permettre de nouveaux toasts
        clearTimeout(this.rateLimitToastTimeout);
        this.rateLimitToastTimeout = setTimeout(() => {
          this.rateLimitToastDisplayed = false;
        }, 5000);
        
        throw new Error("Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.");
      } else {
        // Si un toast est déjà affiché, lancer une erreur silencieuse (sans message)
        const error = new Error("Rate limit reached");
        error.silent = true; // Marquer l'erreur comme silencieuse
        throw error;
      }
    }
    
    // Pour les autres types d'erreurs
    throw new Error(data.message || defaultErrorMessage);
  }

  // Méthode pour gérer les requêtes API avec gestion appropriée des réponses non-JSON
  async fetchWithErrorHandling(url, options, defaultErrorMessage) {
    console.log('fetchWithErrorHandling - Called with:', { url, options, defaultErrorMessage });
    
    try {
      console.log('fetchWithErrorHandling - About to call fetch...');
      const response = await fetch(url, options);
      console.log('fetchWithErrorHandling - fetch completed, response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: response.headers
      });
      
      // Si c'est une erreur 429 (Too Many Requests), elle peut ne pas être au format JSON
      if (response.status === 429) {
        console.log('fetchWithErrorHandling - Rate limit detected');
        // Si un toast de rate limit n'est pas déjà affiché
        if (!this.rateLimitToastDisplayed) {
          this.rateLimitToastDisplayed = true;
          
          // Réinitialiser l'état après 5 secondes pour permettre de nouveaux toasts
          clearTimeout(this.rateLimitToastTimeout);
          this.rateLimitToastTimeout = setTimeout(() => {
            this.rateLimitToastDisplayed = false;
          }, 5000);
          
          throw new Error("Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.");
        } else {
          // Si un toast est déjà affiché, lancer une erreur silencieuse
          const error = new Error("Rate limit reached");
          error.silent = true;
          throw error;
        }
      }
      
      // Pour les autres types de réponses, essayer de parser en JSON
      let data;
      try {
        console.log('fetchWithErrorHandling - About to parse response as JSON...');
        data = await response.json();
        console.log('fetchWithErrorHandling - JSON parsed successfully:', data);
      } catch (e) {
        console.log('fetchWithErrorHandling - JSON parsing failed, trying text:', e);
        // Si la réponse n'est pas du JSON valide, utiliser le texte brut si disponible
        const text = await response.text();
        console.log('fetchWithErrorHandling - Text response:', text);
        data = { message: text || defaultErrorMessage };
      }
      
      // Pour les erreurs d'authentification (401, 422, etc.), retourner les données JSON au lieu de lancer une erreur
      // Cela permet de traiter les messages d'erreur de connexion/inscription
      if (!response.ok) {
        console.log('fetchWithErrorHandling - Response not OK, status:', response.status);
        // Si c'est une erreur d'authentification avec des données JSON, les retourner
        if (response.status === 401 || response.status === 422 || response.status === 400 || response.status === 403) {
          console.log('fetchWithErrorHandling - Returning auth error data:', data);
          return data;
        }
        // Pour les autres erreurs (500, etc.), lancer une erreur
        console.log('fetchWithErrorHandling - Throwing error for status:', response.status);
        throw new Error(data.message || defaultErrorMessage);
      }
      
      console.log('fetchWithErrorHandling - Success, returning data:', data);
      return data;
    } catch (error) {
      console.log('fetchWithErrorHandling - Exception caught:', error);
      // Propager l'erreur
      throw error;
    }
  }

  // Méthode d'inscription
  async register(userData) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          credentials: 'include'
        },
        'Erreur lors de l\'inscription'
      );
      
      // Ne pas stocker les données utilisateur retournées
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode de connexion
  async login(credentials) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include'
        },
        'Erreur lors de la connexion'
      );
      
      // Vérifier si l'erreur est due à un compte non vérifié
      if (data && !data.success && data.message && (
          data.message.includes("non vérifi") || 
          data.message.includes("email non vérifi") || 
          data.message.includes("verifi") ||
          data.message.includes("verification") ||
          data.message.toLowerCase().includes("email not verified") ||
          data.message.toLowerCase().includes("verify your email") ||
          data.message.includes("vérifier votre email") ||
          data.message.includes("Veuillez vérifier votre email")
      )) {
        // Retourner un objet avec requiresVerification à true et l'email
        return { 
          requiresVerification: true, 
          email: credentials.email,
          success: false,
          message: data.message || "Veuillez vérifier votre email avant de vous connecter"
        };
      }
      
      // Si la connexion réussit, configurer le timer pour rafraîchir le token
      if (data && data.success) {
        // Stocker les informations utilisateur en mémoire uniquement, pas dans localStorage
        if (data.user) {
          this.userDataInMemory = data.user;
        }
        
        // Configurer le timer pour rafraîchir le token
        this.setupRefreshTokenTimer();
        this.lastTokenRefresh = Date.now();
      }
      
      return data;
    } catch (error) {
      
      // Vérifier si l'erreur contient un message de vérification d'email
      if (error.message && (
          error.message.includes("non vérifi") || 
          error.message.includes("email non vérifi") || 
          error.message.includes("verifi") ||
          error.message.includes("verification") ||
          error.message.toLowerCase().includes("email not verified") ||
          error.message.toLowerCase().includes("verify your email") ||
          error.message.includes("vérifier votre email") ||
          error.message.includes("Veuillez vérifier votre email")
      )) {
        // Retourner un objet avec requiresVerification à true au lieu de lancer l'erreur
        return { 
          requiresVerification: true, 
          email: credentials.email,
          success: false,
          message: error.message
        };
      }
      
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode de déconnexion
  async logout() {
    try {
      // Nettoyer l'intervalle de rafraîchissement du token
      if (this.refreshTokenInterval) {
        clearInterval(this.refreshTokenInterval);
        this.refreshTokenInterval = null;
      }
      
      // Nettoyer les données utilisateur en mémoire
      this.userDataInMemory = null;
      
      // Appeler l'API pour invalider les cookies côté serveur
      await fetch(`${this.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      }).catch(err => {
        // Continuer même en cas d'erreur
      });
      
      // Détacher l'écoute des événements socket si nécessaire
      this.detachSocketListeners();
      
      return { success: true, message: 'Déconnexion réussie' };
    } catch (error) {
      // Nettoyer les données en mémoire même en cas d'erreur
      this.userDataInMemory = null;
      return { success: true, message: 'Déconnexion locale réussie' };
    }
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn() {
    // On se fie uniquement à la présence des cookies qui sont automatiquement envoyés
    // avec les requêtes, donc on ne peut le vérifier qu'en faisant une requête API
    // On pourrait potentiellement utiliser document.cookie pour vérifier si le cookie existe
    // mais c'est peu fiable car les cookies HttpOnly ne sont pas visibles
    // On utilise donc cette méthode comme un complément à getMe() qui fait la vraie vérification
    return this.userDataInMemory !== null;
  }

  // Méthode pour obtenir l'utilisateur actuel depuis la mémoire
  getCurrentUser() {
    return this.userDataInMemory;
  }

  // Méthode pour vérifier l'email
  async verifyEmail(email, code) {
    console.log('User.verifyEmail - Method called with:', { email, code });
    console.log('User.verifyEmail - API URL will be:', `${this.apiUrl}/auth/verify-email`);
    
    try {
      console.log('User.verifyEmail - About to call fetchWithErrorHandling...');
      
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/verify-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
          credentials: 'include'
        },
        'Erreur lors de la vérification de l\'email'
      );
      
      console.log('User.verifyEmail - fetchWithErrorHandling returned:', data);
      return data;
    } catch (error) {
      console.log('User.verifyEmail - Error caught:', error);
      if (error.silent) {
        console.log('User.verifyEmail - Error is silent, returning silent response');
        return { success: false, silent: true };
      }
      console.log('User.verifyEmail - Throwing error:', error);
      throw error;
    }
  }

  // Méthode pour renvoyer le code de vérification
  async resendVerification(email) {
    console.log('User.resendVerification - Method called with email:', email);
    console.log('User.resendVerification - API URL will be:', `${this.apiUrl}/auth/resend-verification`);
    
    try {
      console.log('User.resendVerification - About to call fetchWithErrorHandling...');
      
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        },
        'Erreur lors du renvoi du code de vérification'
      );
      
      console.log('User.resendVerification - fetchWithErrorHandling returned:', data);
      return data;
    } catch (error) {
      console.log('User.resendVerification - Error caught:', error);
      if (error.silent) {
        console.log('User.resendVerification - Error is silent, returning silent response');
        return { success: false, silent: true };
      }
      console.log('User.resendVerification - Throwing error:', error);
      throw error;
    }
  }

  // Méthode pour la demande de réinitialisation de mot de passe
  async forgotPassword(email) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        },
        'Erreur lors de la demande de réinitialisation'
      );
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour réinitialiser le mot de passe
  async resetPassword(code, password) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, password }),
          credentials: 'include'
        },
        'Erreur lors de la réinitialisation du mot de passe'
      );
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour récupérer les informations de l'utilisateur connecté
  async getMe() {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        },
        'Erreur lors de la récupération des informations utilisateur'
      );
      
      // Mettre à jour les informations utilisateur uniquement en mémoire
      if (data.user) {
        this.userDataInMemory = data.user;
      } else {
        this.userDataInMemory = null;
      }
      
      return data;
    } catch (error) {
      if (error.status === 401) {
        // Si non authentifié, réinitialiser les données utilisateur
        this.userDataInMemory = null;
      }
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour vérifier la validité d'un token de réinitialisation
  async checkResetToken(code) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/check-reset-token?code=${code}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        },
        'Erreur lors de la vérification du token'
      );
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour récupérer les informations de l'utilisateur connecté en temps réel
  async getRealtimeInfo() {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/me/realtime`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        },
        'Erreur lors de la récupération des informations utilisateur en temps réel'
      );
      
      // Mettre à jour les informations utilisateur uniquement en mémoire
      if (data.user) {
        this.userDataInMemory = data.user;
      } else {
        this.userDataInMemory = null;
      }
      
      return data;
    } catch (error) {
      if (error.status === 401) {
        // Si non authentifié, réinitialiser les données utilisateur
        this.userDataInMemory = null;
      }
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour se déconnecter de toutes les sessions actives
  async logoutAllSessions() {
    try {
      // Nettoyer l'intervalle de rafraîchissement du token
      if (this.refreshTokenInterval) {
        clearInterval(this.refreshTokenInterval);
        this.refreshTokenInterval = null;
      }
      
      // Nettoyer les données utilisateur en mémoire
      this.userDataInMemory = null;
      
      // Appeler l'API pour déconnecter toutes les sessions
      await fetch(`${this.apiUrl}/auth/logout-all-sessions`, {
        method: 'POST',
        credentials: 'include'
      }).catch(err => {
        // Continuer même en cas d'erreur
      });
      
      // Détacher l'écoute des événements socket si nécessaire
      this.detachSocketListeners();
      
      return { success: true, message: 'Déconnexion de toutes les sessions réussie' };
    } catch (error) {
      // Nettoyer les données en mémoire même en cas d'erreur
      this.userDataInMemory = null;
      return { success: true, message: 'Déconnexion locale réussie' };
    }
  }

  // Configurer l'écoute des événements socket
  setupSocketListeners(socket, callback) {
    // Stocker la référence au socket
    this.socket = socket;
    
    // Enregistrer le callback de déconnexion forcée
    if (callback && typeof callback === 'function') {
      this.forceLogoutCallback = callback;
    }
    
    if (!this.socket) {
      return false;
    }
    
    // Écouter l'événement de déconnexion forcée
    this.socket.on('forceLogout', (data) => {
      
      // Nettoyer les données et cookies locaux
      this.handleForceLogout(data.reason || 'Session expirée');
    });
    
    // Écouter l'événement d'expiration de token de réinitialisation
    this.socket.on('passwordResetTokenExpired', (data) => {
      // Vous pouvez gérer cet événement si nécessaire
    });
    
    // Écouter les mises à jour des informations utilisateur en temps réel
    this.socket.on('userInfoUpdate', (data) => {
      
      // Mettre à jour les données utilisateur en mémoire
      if (data.user) {
        this.userDataInMemory = data.user;
        
        // Déclencher un événement personnalisé pour informer les composants de la mise à jour
        window.dispatchEvent(new CustomEvent('userInfoUpdate', { detail: data.user }));
      }
    });
    
    // Authentifier le socket avec l'ID utilisateur
    if (this.userDataInMemory && this.userDataInMemory.id) {
      this.socket.emit('authenticate', this.userDataInMemory.id);
    }
    
    return true;
  }
  
  // Détacher les écouteurs d'événements socket
  detachSocketListeners() {
    if (this.socket) {
      this.socket.off('forceLogout');
      this.socket.off('passwordResetTokenExpired');
      this.socket.off('userInfoUpdate');
      this.socket = null;
    }
    
    this.forceLogoutCallback = null;
  }
  
  // Gérer la déconnexion forcée
  handleForceLogout(reason) {
    // Nettoyer l'intervalle de rafraîchissement du token
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
      this.refreshTokenInterval = null;
    }
    
    // Nettoyer les données utilisateur en mémoire
    this.userDataInMemory = null;
    
    // Appeler le callback de déconnexion forcée si défini
    if (this.forceLogoutCallback && typeof this.forceLogoutCallback === 'function') {
      this.forceLogoutCallback(reason);
    }
  }

  // Méthode pour vérifier le mot de passe actuel
  async checkPassword(password) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/check-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
          credentials: 'include'
        },
        'Erreur lors de la vérification du mot de passe'
      );
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour mettre à jour le mot de passe
  async updatePassword(passwordData) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/user/password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passwordData),
          credentials: 'include'
        },
        'Erreur lors de la mise à jour du mot de passe'
      );
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour mettre à jour le nom d'utilisateur
  async updateUsername(username) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/user/username`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
          credentials: 'include'
        },
        'Erreur lors de la mise à jour du nom d\'utilisateur'
      );
      
      // Mettre à jour les données utilisateur en mémoire
      if (data.success && this.userDataInMemory) {
        this.userDataInMemory.username = username;
      }
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour mettre à jour l'email (lance le processus de vérification)
  async updateEmail(email) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/user/email`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        },
        'Erreur lors de la mise à jour de l\'email'
      );
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour vérifier le code de changement d'email
  async verifyEmailChange(verificationCode) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/user/email/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verificationCode }),
          credentials: 'include'
        },
        'Erreur lors de la vérification du changement d\'email'
      );
      
      // Mettre à jour les données utilisateur en mémoire
      if (data.success && data.email && this.userDataInMemory) {
        this.userDataInMemory.email = data.email;
      }
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour vérifier si un email est disponible
  async checkEmailAvailability(email) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/user/check-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        },
        'Erreur lors de la vérification de la disponibilité de l\'email'
      );
      
      return data;
    } catch (error) {
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }
}

export default new User();
