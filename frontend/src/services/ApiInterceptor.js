class ApiInterceptor {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process the failed queue of requests after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Enhanced fetch with automatic token refresh
  async fetchWithTokenRefresh(url, options = {}) {
    try {
      // Add credentials to include cookies
      const requestOptions = {
        ...options,
        credentials: 'include'
      };

      let response = await fetch(url, requestOptions);

      // If we get a 401/403 and we're not already refreshing, try to refresh token
      if ((response.status === 401 || response.status === 403) && !this.isRefreshing) {
        // Check if this is a token-related error
        const errorData = await response.clone().json().catch(() => ({}));
        
        if (errorData.message && (
          errorData.message.includes('Token invalide') ||
          errorData.message.includes('Token requis') ||
          errorData.message.includes('expiré') ||
          errorData.message.includes('expired')
        )) {
          this.isRefreshing = true;

          try {
            // Attempt to refresh the token
            const refreshResponse = await fetch('/api/auth/refresh-token', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (refreshResponse.ok) {
              this.isRefreshing = false;
              this.processQueue(null, true);

              // Retry the original request
              response = await fetch(url, requestOptions);
            } else {
              // Refresh failed
              this.isRefreshing = false;
              this.processQueue(new Error('Token refresh failed'), null);
              
              // Redirect to login or trigger logout
              this.handleAuthenticationFailure();
            }
          } catch (refreshError) {
            this.isRefreshing = false;
            this.processQueue(refreshError, null);
            this.handleAuthenticationFailure();
          }
        }
      } else if (this.isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry the request after token refresh
          return fetch(url, requestOptions);
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Handle authentication failure (redirect to login, etc.)
  handleAuthenticationFailure() {
    // This could dispatch an event or call a callback to handle logout
    console.log('🚪 Échec de l\'authentification - redirection nécessaire');
    
    // Dispatch custom event for logout
    window.dispatchEvent(new CustomEvent('auth:logout', {
      detail: { reason: 'Token refresh failed' }
    }));
  }

  // Wrapper methods for common HTTP methods
  async get(url, options = {}) {
    return this.fetchWithTokenRefresh(url, {
      ...options,
      method: 'GET'
    });
  }

  async post(url, data, options = {}) {
    return this.fetchWithTokenRefresh(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }

  async put(url, data, options = {}) {
    return this.fetchWithTokenRefresh(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }

  async delete(url, options = {}) {
    return this.fetchWithTokenRefresh(url, {
      ...options,
      method: 'DELETE'
    });
  }
}

// Export a singleton instance
export default new ApiInterceptor(); 