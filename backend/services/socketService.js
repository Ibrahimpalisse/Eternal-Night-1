const socketService = {
  io: null,
  // Map pour stocker les connexions socket par utilisateur
  userSockets: new Map(),
  
  // Initialiser le service avec l'instance de Socket.IO
  init(io) {
    this.io = io;
    console.log('Socket.IO service initialized');
    
    // Configurer les événements de base
    if (this.io) {
      this.io.on('connection', (socket) => {
        // Associer un socket à un utilisateur lors de l'authentification
        socket.on('authenticate', (userId) => {
          if (userId) {
            console.log(`User ${userId} authenticated on socket ${socket.id}`);
            this.addUserSocket(userId, socket);
            
            // Nettoyer la connexion lors de la déconnexion
            socket.on('disconnect', () => {
              console.log(`Socket ${socket.id} disconnected, removing from user ${userId}`);
              this.removeUserSocket(userId, socket.id);
            });
          }
        });
      });
    }
  },
  
  // Ajouter un socket à un utilisateur
  addUserSocket(userId, socket) {
    if (!userId || !socket) return;
    
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Map());
    }
    
    this.userSockets.get(userId).set(socket.id, socket);
  },
  
  // Supprimer un socket pour un utilisateur
  removeUserSocket(userId, socketId) {
    if (!userId || !socketId) return;
    
    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(socketId);
      
      // Si l'utilisateur n'a plus de sockets, supprimer l'entrée
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
      }
    }
  },
  
  // Émettre un événement à tous les sockets d'un utilisateur spécifique
  emitToUser(userId, event, data) {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }
    
    if (this.userSockets.has(userId)) {
      const userSocketMap = this.userSockets.get(userId);
      
      for (const socket of userSocketMap.values()) {
        socket.emit(event, data);
      }
      
      console.log(`Emitted ${event} event to user ${userId} on ${userSocketMap.size} sockets`);
      return true;
    } else {
      console.log(`No active sockets for user ${userId}`);
      return false;
    }
  },
  
  // Émettre un événement pour l'expiration d'un token de réinitialisation de mot de passe
  emitPasswordResetTokenExpired(userId) {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }
    
    // Émettre l'événement à tous les clients (on peut cibler spécifiquement si on garde une trace des connexions des utilisateurs)
    this.io.emit('passwordResetTokenExpired', { userId });
    console.log(`Emitted passwordResetTokenExpired event for user ${userId}`);
  },
  
  // Émettre un événement de déconnexion forcée (par exemple en cas de suppression de compte, de bannissement, etc.)
  emitForceLogout(userId, reason = 'Session expired') {
    const emitted = this.emitToUser(userId, 'forceLogout', { 
      reason,
      timestamp: new Date().toISOString()
    });
    
    if (emitted) {
      console.log(`Force logout emitted to user ${userId} with reason: ${reason}`);
    }
    
    return emitted;
  },
  
  // Émettre un événement de session expirée pour un utilisateur spécifique
  emitSessionExpired(userId) {
    return this.emitForceLogout(userId, 'Session expired');
  }
};

module.exports = socketService; 