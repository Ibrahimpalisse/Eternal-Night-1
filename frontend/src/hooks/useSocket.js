import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

/**
 * Hook personnalisé pour gérer la connexion Socket.IO
 * @param {string} url - URL du serveur Socket.IO
 * @param {Object} options - Options de configuration Socket.IO
 * @returns {Object} - Objet contenant le socket et son statut
 */
const useSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const isInitialized = useRef(false);
  const connectAttempted = useRef(false);
  
  // Fonction pour authentifier l'utilisateur sur le socket
  const authenticateUser = useCallback((userId) => {
    if (socketRef.current && socketRef.current.connected && userId) {
      socketRef.current.emit('authenticate', userId);
      console.log(`Socket authentifié pour l'utilisateur ${userId}`);
    }
  }, []);

  useEffect(() => {
    // Protection contre les connexions multiples en mode StrictMode
    if (isInitialized.current || connectAttempted.current) {
      return;
    }
    
    connectAttempted.current = true;
    
    // Corriger l'URL - enlever /api si présent et utiliser l'URL de base du serveur
    let socketUrl = url;
    if (!socketUrl) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      // Enlever /api de l'URL pour obtenir l'URL de base du serveur
      socketUrl = apiUrl.replace('/api', '').replace(/\/$/, '');
    }
    
    // Configuration de base pour Socket.IO
    const socketOptions = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['polling', 'websocket'],
      upgrade: true,
      path: '/socket.io/', // Explicit path
      ...options
    };
    
    console.log('Socket.IO: Initialisation de la connexion...', socketUrl);
    
    try {
      // Créer une nouvelle connexion socket avec namespace par défaut
      const socketInstance = io(socketUrl, socketOptions);
      
      socketRef.current = socketInstance;
      isInitialized.current = true;
    
    // Configurer les écouteurs d'événements
    socketInstance.on('connect', () => {
        console.log('Socket.IO: Connecté au serveur avec ID:', socketInstance.id);
      setIsConnected(true);
        setSocket(socketInstance);
      });
      
      socketInstance.on('disconnect', (reason) => {
        console.log('Socket.IO: Déconnecté du serveur:', reason);
        setIsConnected(false);
    });
    
      socketInstance.on('connect_error', (error) => {
        console.error('Socket.IO: Erreur de connexion:', error.message);
      setIsConnected(false);
      });
      
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log('Socket.IO: Reconnecté après', attemptNumber, 'tentatives');
        setIsConnected(true);
      });
    
      socketInstance.on('reconnect_error', (error) => {
        console.error('Socket.IO: Erreur de reconnexion:', error.message);
      });
    
      socketInstance.on('reconnect_failed', () => {
        console.error('Socket.IO: Échec de reconnexion après toutes les tentatives');
        setIsConnected(false);
      });

      // Gérer les erreurs génériques
      socketInstance.on('error', (error) => {
        console.error('Socket.IO: Erreur générique:', error);
    });
    
    } catch (error) {
      console.error('Socket.IO: Erreur lors de l\'initialisation:', error);
      setIsConnected(false);
      connectAttempted.current = false;
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
      connectAttempted.current = false;
    };
  }, []); // Pas de dépendances pour éviter les réinitialisations
  
  return { socket, isConnected, authenticateUser };
};

export default useSocket; 