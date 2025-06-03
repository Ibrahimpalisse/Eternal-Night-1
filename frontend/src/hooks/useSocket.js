import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

/**
 * Hook personnalisé pour gérer la connexion Socket.IO
 * @param {string} url - URL du serveur Socket.IO
 * @param {Object} options - Options de configuration Socket.IO
 * @returns {Object} - Objet contenant le socket et son statut
 */
const useSocket = (url = import.meta.env.VITE_API_URL || 'http://localhost:4000', options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const isInitialized = useRef(false);
  
  // Fonction pour authentifier l'utilisateur sur le socket
  const authenticateUser = useCallback((userId) => {
    if (socketRef.current && socketRef.current.connected && userId) {
      socketRef.current.emit('authenticate', userId);
      console.log(`Socket authentifié pour l'utilisateur ${userId}`);
    }
  }, []);

  useEffect(() => {
    // Désactiver Socket.IO temporairement en mode développement
    if (import.meta.env.DEV) {
      console.log('Socket.IO: Désactivé en mode développement');
      setIsConnected(false);
      return;
    }
    
    // Éviter les connexions multiples
    if (isInitialized.current || socketRef.current) {
      return;
    }
    
    isInitialized.current = true;
    
    // Configuration de base pour Socket.IO
    const socketOptions = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
      forceNew: true,
      transports: ['polling', 'websocket'], // Commencer par polling puis upgrader
      upgrade: true,
      ...options
    };
    
    console.log('Socket.IO: Initialisation de la connexion...');
    
    try {
      // Créer une nouvelle connexion socket
      const socketInstance = io(url, socketOptions);
      
      socketRef.current = socketInstance;
    
    // Configurer les écouteurs d'événements
    socketInstance.on('connect', () => {
      console.log('Socket.IO: Connecté au serveur');
      setIsConnected(true);
        setSocket(socketInstance);
      });
      
      socketInstance.on('disconnect', (reason) => {
        console.log('Socket.IO: Déconnecté du serveur', reason);
        setIsConnected(false);
    });
    
      socketInstance.on('connect_error', (error) => {
        console.error('Socket.IO: Erreur de connexion', error.message);
      setIsConnected(false);
      });
      
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log('Socket.IO: Reconnecté après', attemptNumber, 'tentatives');
        setIsConnected(true);
    });
    
      socketInstance.on('reconnect_error', (error) => {
        console.error('Socket.IO: Erreur de reconnexion', error.message);
    });
    
      socketInstance.on('reconnect_failed', () => {
        console.error('Socket.IO: Échec de reconnexion après toutes les tentatives');
        setIsConnected(false);
      });
    } catch (error) {
      console.error('Socket.IO: Erreur lors de l\'initialisation', error);
      setIsConnected(false);
    }
    
    // Nettoyage à la destruction du composant
    return () => {
      console.log('Socket.IO: Nettoyage de la connexion');
      
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      }
      
      setSocket(null);
      setIsConnected(false);
      isInitialized.current = false;
    };
  }, []); // Pas de dépendances pour éviter les réinitialisations
  
  return { socket, isConnected, authenticateUser };
};

export default useSocket; 