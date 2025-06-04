import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import UserService from '../services/User';
import useSocket from '../hooks/useSocket';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize socket connection
  const { socket, isConnected, authenticateUser } = useSocket();

  // Memoize handleForceLogout to prevent effect loops
  const handleForceLogout = useCallback((reason) => {
    console.log('Force logout triggered:', reason);
    setUser(null);
    setError(null);
  }, []);

  // Check user session on mount only
  useEffect(() => {
    checkUserSession();
    
    // Listen for authentication failures from API interceptor
    const handleAuthLogout = (event) => {
      console.log('🔒 Événement de déconnexion reçu:', event.detail?.reason);
      handleForceLogout(event.detail?.reason || 'Authentication failed');
    };
    
    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [handleForceLogout]);

  // Check if user has an active session
  const checkUserSession = async () => {
    try {
      setLoading(true);
      const response = await UserService.getMe();
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Setup socket authentication and listeners when socket connects and user is available
  useEffect(() => {
    if (socket && isConnected && user && user.id) {
      authenticateUser(user.id);
      UserService.setupSocketListeners(socket, handleForceLogout);
      
      return () => {
        UserService.detachSocketListeners();
      };
    }
  }, [socket, isConnected, user?.id, authenticateUser, handleForceLogout]);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await UserService.login(credentials);
      
      if (!response.success) {
        if (response.requiresVerification) {
          setError({ 
            type: 'verification', 
            message: response.message || 'Veuillez vérifier votre email avant de vous connecter',
            email: credentials.email
          });
          return { 
            success: false, 
            requiresVerification: true,
            email: credentials.email,
            message: response.message
          };
        }
        
        setError({
          type: 'auth',
          message: response.message || 'Échec de connexion'
        });
        
        return { success: false, message: response.message };
      }
      
      // Login successful - get fresh user data
      let userData = response.user;
      if (!userData) {
        const userResponse = await UserService.getMe();
        if (userResponse.success) {
          userData = userResponse.user;
        }
      }
      
      if (userData) {
      setUser(userData);
      }
      
      return { success: true, user: userData };
    } catch (error) {
      setError({
        type: 'error',
        message: error.message || 'Une erreur est survenue lors de la connexion'
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call backend logout API
      await UserService.logout();
      
      // Clear local state
      setUser(null);
      setError(null);
      
      return { success: true };
    } catch (error) {
      // Clear local state even if API call fails
    setUser(null);
      setError(null);
      return { success: true, local: true };
    } finally {
      setLoading(false);
    }
  };

  // Logout from all sessions
  const logoutAllSessions = async () => {
    try {
      setLoading(true);
      
      // Call backend logout all sessions API
      await UserService.logoutAllSessions();
      
      // Clear local state
      setUser(null);
      setError(null);
      
      return { success: true };
    } catch (error) {
      // Clear local state even if API call fails
      setUser(null);
      setError(null);
      return { success: true, local: true };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
        const response = await UserService.getMe();
        
        if (response.success && response.user) {
          setUser(response.user);
      } else {
        setUser(null);
      }
      
      return response;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await UserService.refreshToken();
      
      if (response.success) {
        console.log('✅ Token rafraîchi avec succès depuis AuthContext');
        return { success: true };
      } else {
        console.log('❌ Échec du rafraîchissement du token');
        // Si le refresh token échoue, déconnecter l'utilisateur
        setUser(null);
        setError({
          type: 'session',
          message: 'Votre session a expiré. Veuillez vous reconnecter.'
        });
        return { success: false, message: 'Session expirée' };
      }
    } catch (error) {
      console.log('❌ Erreur lors du rafraîchissement du token:', error.message);
      // Si le refresh token échoue, déconnecter l'utilisateur
      setUser(null);
      setError({
        type: 'session',
        message: 'Votre session a expiré. Veuillez vous reconnecter.'
      });
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    logoutAllSessions,
    refreshUser,
    refreshToken,
    loading,
    error,
    setUser,
    setError,
    isSocketConnected: isConnected
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 