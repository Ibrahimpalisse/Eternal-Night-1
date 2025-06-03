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

  // Socket management
  const { socket, isConnected, authenticateUser } = useSocket();

  // Handle force logout from server
  const handleForceLogout = useCallback((reason) => {
    setUser(null);
    setError({
      type: 'force_logout',
      message: reason || 'Session expirée'
    });
  }, []);

  // Initialize user session on mount
  useEffect(() => {
    checkUserSession();
  }, []);

  // Check if user has an active session
  const checkUserSession = async () => {
    try {
      setLoading(true);
      const response = await UserService.getMe();
      
      if (response.success && response.user) {
        setUser(response.user);

        // Authenticate socket if connected
        if (socket && socket.connected && response.user.id) {
          authenticateUser(response.user.id);
          UserService.setupSocketListeners(socket, handleForceLogout);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

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
      
        // Setup socket if connected
        if (socket && socket.connected && userData.id) {
          authenticateUser(userData.id);
          UserService.setupSocketListeners(socket, handleForceLogout);
        }
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
          
        // Authenticate socket if connected
        if (socket && socket.connected && response.user.id) {
          authenticateUser(response.user.id);
          UserService.setupSocketListeners(socket, handleForceLogout);
        }
      } else {
        setUser(null);
      }
      
      return response;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  // Setup socket listeners when socket or user changes
  useEffect(() => {
    if (socket && user && user.id) {
      authenticateUser(user.id);
      UserService.setupSocketListeners(socket, handleForceLogout);
    }
    
    return () => {
    if (socket) {
        UserService.detachSocketListeners();
      }
    };
  }, [socket, user, authenticateUser, handleForceLogout]);

  const value = {
    user,
    login,
    logout,
    logoutAllSessions,
    refreshUser,
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