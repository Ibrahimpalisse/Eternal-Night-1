const db = require('../db');
const jwtMiddleware = require('../middleware/JwtMiddleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const socketService = require('../services/socketService');
const bcrypt = require('bcrypt');
const Profile = require('./Profile');


class User {
  // Exposer la connexion à la base de données pour les contrôleurs
  static get db() {
    return db;
  }

  static async create(userData) {
    const { name, email, password } = userData;
    
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé.');
      }
      
      // Insérer l'utilisateur dans la base de données
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
        [name, email, password] // Utiliser name au lieu de username
      );
      
      const userId = result.insertId;
      
      // Créer une entrée de vérification pour l'utilisateur avec structure simplifiée
      const verificationCode = this.generateVerificationCode();
      await db.execute(
        'INSERT INTO verification (user_id, email_verification_code, email_verification_expires) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))',
        [userId, verificationCode]
      );
      
      // Créer un profil vide pour l'utilisateur
      await Profile.createProfile(userId);
      
      // Attribuer un rôle à l'utilisateur
      const role = await this.assignRole(userId);
      
      // Générer un token JWT avec le rôle
      const token = jwtMiddleware.generateToken({ id: userId, role });
      
      // Envoyer l'email de vérification
      await sendVerificationEmail(email, verificationCode);
      
      return { 
        success: true,
        userId,
        token,
        role,
        message: 'Inscription réussie. Veuillez vérifier votre email dans les 5 minutes.'
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }
  
  static generateVerificationCode() {
    // Générer un code à 6 chiffres
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  static generateToken() {
    // Générer un token aléatoire
    return require('crypto').randomBytes(32).toString('hex');
  }
  
  static async assignRole(userId) {
    try {
      // Vérifier si c'est le premier utilisateur
      const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
      const isFirstUser = userCount[0].count === 1;
      
      // Définir le rôle en fonction
      const role = isFirstUser ? 'super_admin' : 'user';
      
      // Récupérer l'ID du rôle
      const [roleRow] = await db.execute('SELECT id FROM roles WHERE role = ?', [role]);
      if (!roleRow.length) {
        throw new Error(`Rôle ${role} non trouvé dans la base de données`);
      }
      const roleId = roleRow[0].id;
      
      // Attribuer le rôle à l'utilisateur
      await db.execute('INSERT INTO role_user (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
      
      // Si premier utilisateur, attribuer aussi le rôle "user"
      if (isFirstUser) {
        const [userRoleRow] = await db.execute('SELECT id FROM roles WHERE role = ?', ['user']);
        if (userRoleRow.length) {
          await db.execute('INSERT INTO role_user (user_id, role_id) VALUES (?, ?)', [userId, userRoleRow[0].id]);
        }
      }
      
      return role;
    } catch (error) {
      console.error('Erreur lors de l\'attribution du rôle:', error);
      throw error;
    }
  }
  

  
  static async isEmailVerified(userId) {
    try {
      const [rows] = await db.execute('SELECT is_verified FROM verification WHERE user_id = ?', [userId]);
      return rows.length ? rows[0].is_verified : false;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de l\'email:', error);
      throw error;
    }
  }
  

  
  static async getUserById(userId) {
    try {
      const [rows] = await db.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [userId]);
      if (!rows.length) {
        return null;
      }
      
      const user = rows[0];
      const roles = await Profile.getUserRoles(userId);
      const rolesWithDescription = await Profile.getUserRolesWithDescription(userId);
      const isVerified = await this.isEmailVerified(userId);
      const profile = await Profile.getUserProfile(userId);
      
      return {
        ...user,
        roles,
        rolesWithDescription,
        isVerified,
        profile
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw error;
    }
  }

  // Méthode spéciale pour récupérer l'utilisateur avec son mot de passe (pour la vérification)
  static async getUserWithPassword(userId) {
    try {
      const [rows] = await db.execute('SELECT id, name, email, password, created_at FROM users WHERE id = ?', [userId]);
      if (!rows.length) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur avec mot de passe:', error);
      throw error;
    }
  }
  
  static async findByEmail(email) {
    try {
      console.log('Recherche de l\'utilisateur par email:', email);
      // Utiliser un try-catch explicite pour mieux détecter les erreurs
      try {
        const result = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        console.log('Résultat de la requête findByEmail:', result);
        
        // S'assurer que result est un tableau
        if (!Array.isArray(result)) {
          console.error('db.execute n\'a pas retourné un tableau:', result);
          return null;
        }
        
        const [rows] = result;
        
        // S'assurer que rows est un tableau
        if (!Array.isArray(rows)) {
          console.error('Les lignes retournées ne sont pas un tableau:', rows);
          return null;
        }
        
        return rows.length ? rows[0] : null;
      } catch (innerError) {
        console.error('Erreur lors de l\'exécution de la requête findByEmail:', innerError);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur par email:', error);
      throw error;
    }
  }
  
  static async verifyEmail(email, code) {
    try {
      // Trouver l'utilisateur par email
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('Utilisateur non trouvé.');
      }
      
      // Vérifier le code et s'assurer qu'il n'est pas expiré (structure simplifiée)
      const [rows] = await db.execute(
        'SELECT * FROM verification WHERE user_id = ? AND email_verification_code = ? AND email_verification_expires > NOW()',
        [user.id, code]
      );
      
      if (!rows.length) {
        throw new Error('Code de vérification invalide ou expiré.');
      }
      
      // Mettre à jour le statut de vérification
      await db.execute(
        'UPDATE verification SET is_verified = true WHERE user_id = ?',
        [user.id]
      );
      
      return { 
        success: true, 
        message: 'Email vérifié avec succès.'
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      throw error;
    }
  }
  
  static async resendVerificationCode(email) {
    try {
      // Trouver l'utilisateur par email
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('Utilisateur non trouvé.');
      }
      
      // Générer un nouveau code de vérification
      const verificationCode = this.generateVerificationCode();
      
      // Mettre à jour le code dans la base de données avec structure simplifiée
      await db.execute(
        'UPDATE verification SET email_verification_code = ?, email_verification_expires = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE user_id = ?',
        [verificationCode, user.id]
      );
      
      // Envoyer l'email avec le nouveau code
      await sendVerificationEmail(email, verificationCode);
      
      return { 
        success: true,
        message: 'Un nouveau code de vérification a été envoyé. Il expirera dans 5 minutes.'
      };
    } catch (error) {
      console.error('Erreur lors du renvoi du code de vérification:', error);
      throw error;
    }
  }

  static async requestPasswordReset(email) {
    try {
      // Trouver l'utilisateur par email
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('Aucun compte n\'est associé à cet email.');
      }
      
      // Générer un token de réinitialisation
      const resetToken = this.generateToken();
      
      // Générer un code de réinitialisation public (qui sera utilisé dans l'URL)
      const resetCode = require('crypto').randomBytes(16).toString('hex');
      
      // Enregistrer le token et le code dans la base de données avec structure simplifiée
      await db.execute(
        'UPDATE verification SET password_reset_token = ?, password_reset_code = ?, password_reset_expires = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE user_id = ?',
        [resetToken, resetCode, user.id]
      );
      
      // Envoyer l'email de réinitialisation avec le code au lieu du token
      await sendPasswordResetEmail(email, resetCode);
      
      // Planifier l'émission de l'événement d'expiration après 5 minutes
      setTimeout(() => {
        socketService.emitPasswordResetTokenExpired(user.id);
      }, 5 * 60 * 1000); // 5 minutes en millisecondes
      
      return {
        success: true,
        message: 'Un email de réinitialisation de mot de passe a été envoyé. Il expirera dans 5 minutes.'
      };
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
      throw error;
    }
  }

  static async resetPassword(code, newPassword) {
    try {
      // Vérifier le code et s'assurer qu'il n'est pas expiré
      const [rows] = await db.execute(
        'SELECT user_id, password_reset_token FROM verification WHERE password_reset_code = ? AND password_reset_expires > NOW()',
        [code]
      );
      
      if (!rows.length) {
        // Si le code est expiré ou invalide, émettre un événement via Socket.IO
        socketService.emitPasswordResetTokenExpired('unknown');
        throw new Error('Code de réinitialisation invalide ou expiré.');
      }
      
      const userId = rows[0].user_id;
      
      // Récupérer l'ancien mot de passe haché pour comparaison
      const [userRows] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);
      
      if (!userRows.length) {
        throw new Error('Utilisateur non trouvé.');
      }
      
      const oldHashedPassword = userRows[0].password;
      
      // Importer bcrypt pour le hachage et la comparaison
      
      // Vérifier que le nouveau mot de passe est différent de l'ancien
      const isSamePassword = await bcrypt.compare(newPassword, oldHashedPassword);
      if (isSamePassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'ancien.');
      }
      
      // Hasher le nouveau mot de passe
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Mettre à jour le mot de passe avec le mot de passe haché
      await db.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedNewPassword, userId]
      );
      
      // Invalider le token et le code
      await db.execute(
        'UPDATE verification SET password_reset_token = NULL, password_reset_code = NULL, password_reset_expires = NULL WHERE user_id = ?',
        [userId]
      );
      
      return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès.'
      };
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }

  // Méthode pour déconnecter un utilisateur avec notification socket
  static async logoutUser(userId, reason = 'Manual logout') {
    try {
      // Émettre l'événement de déconnexion via Socket.IO
      socketService.emitForceLogout(userId, reason);
      
      return {
        success: true,
        message: 'Déconnexion réussie',
        socketNotified: true
      };
    } catch (error) {
      console.error('Erreur lors de la déconnexion de l\'utilisateur:', error);
      throw error;
    }
  }
  
  // Méthode pour déconnecter tous les utilisateurs (utile pour maintenance)
  static async logoutAllUsers(reason = 'System maintenance') {
    try {
      // Émettre l'événement de déconnexion à tous les utilisateurs
      if (socketService.io) {
        socketService.io.emit('forceLogout', { 
          reason,
          timestamp: new Date().toISOString(),
          global: true
        });
      }
      
      return {
        success: true,
        message: 'Tous les utilisateurs ont été déconnectés',
        reason
      };
    } catch (error) {
      console.error('Erreur lors de la déconnexion de tous les utilisateurs:', error);
      throw error;
    }
  }
  
  // Méthode pour invalider une session spécifique (simplifiée pour JWT)
  static async invalidateSession(sessionId) {
    try {
      // Pour un système JWT, on se contente de logger
      console.log(`Session ${sessionId} marquée comme invalidée`);
      
      return {
        success: true,
        message: 'Session invalidée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'invalidation de la session:', error);
      throw error;
    }
  }
}

module.exports = User;