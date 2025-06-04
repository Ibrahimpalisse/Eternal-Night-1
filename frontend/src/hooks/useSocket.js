import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

// Global socket instance to prevent multiple connections
let globalSocket = null;
let globalConnectionPromise = null;

/**
 * Hook personnalisé pour gérer la connexion Socket.IO
 * @param {string} url - URL du serveur Socket.IO
 * @param {Object} options - Options de configuration Socket.IO
 * @returns {Object} - Objet contenant le socket et son statut
 */
const useSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(globalSocket);
  const [isConnected, setIsConnected] = useState(globalSocket?.connected || false);
  const mountedRef = useRef(true);
  
  // Fonction pour authentifier l'utilisateur sur le socket
  const authenticateUser = useCallback((userId) => {
    if (globalSocket && globalSocket.connected && userId) {
      globalSocket.emit('authenticate', userId);
      console.log(`Socket authentifié pour l'utilisateur ${userId}`);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    // Si une connexion existe déjà, l'utiliser
    if (globalSocket && globalSocket.connected) {
      if (mountedRef.current) {
        setSocket(globalSocket);
        setIsConnected(true);
      }
      return;
    }
    
    // Si une connexion est en cours, attendre qu'elle se termine
    if (globalConnectionPromise) {
      globalConnectionPromise.then(() => {
        if (mountedRef.current && globalSocket) {
          setSocket(globalSocket);
          setIsConnected(globalSocket.connected);
        }
      });
      return;
    }
    
    // Créer une nouvelle connexion
    globalConnectionPromise = new Promise((resolve) => {
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
        path: '/socket.io/',
        ...options
      };
      
      console.log('Socket.IO: Initialisation de la connexion...', socketUrl);
      
      try {
        // Créer une nouvelle connexion socket
        const socketInstance = io(socketUrl, socketOptions);
        globalSocket = socketInstance;
    
    // Configurer les écouteurs d'événements
    socketInstance.on('connect', () => {
          console.log('Socket.IO: Connecté au serveur avec ID:', socketInstance.id);
          if (mountedRef.current) {
      setIsConnected(true);
            setSocket(socketInstance);
          }
          resolve();
        });
        
        socketInstance.on('disconnect', (reason) => {
          console.log('Socket.IO: Déconnecté du serveur:', reason);
          if (mountedRef.current) {
            setIsConnected(false);
      }
    });
    
        socketInstance.on('connect_error', (error) => {
          console.error('Socket.IO: Erreur de connexion:', error.message);
          if (mountedRef.current) {
      setIsConnected(false);
          }
          resolve();
        });
        
        socketInstance.on('reconnect', (attemptNumber) => {
          console.log('Socket.IO: Reconnecté après', attemptNumber, 'tentatives');
          if (mountedRef.current) {
            setIsConnected(true);
      }
        });
      
        socketInstance.on('reconnect_error', (error) => {
          console.error('Socket.IO: Erreur de reconnexion:', error.message);
        });
      
        socketInstance.on('reconnect_failed', () => {
          console.error('Socket.IO: Échec de reconnexion après toutes les tentatives');
          if (mountedRef.current) {
            setIsConnected(false);
        }
        });

        // Gérer les erreurs génériques
        socketInstance.on('error', (error) => {
          console.error('Socket.IO: Erreur générique:', error);
    });
    
      } catch (error) {
        console.error('Socket.IO: Erreur lors de l\'initialisation:', error);
        if (mountedRef.current) {
          setIsConnected(false);
        }
        globalConnectionPromise = null;
        resolve();
      }
    });
    
    // Nettoyage à la destruction du composant
    return () => {
      mountedRef.current = false;
    };
  }, []); // Pas de dépendances pour éviter les réinitialisations
  
  // Cleanup global lors du démontage complet
  useEffect(() => {
    return () => {
      // Ne pas fermer la connexion globale car d'autres composants peuvent l'utiliser
    };
  }, []);
  
  return { socket, isConnected, authenticateUser };
};

export default useSocket; 