const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const FormValidation = require('../utils/validation');

// Validation des variables d'environnement AWS
const validateAWSConfig = () => {
  const requiredVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_DEFAULT_REGION', 'AWS_BUCKET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Configuration AWS S3 incomplète. Variables manquantes: ${missingVars.join(', ')}. Veuillez consulter AWS_SETUP_GUIDE.md`);
  }
};

// Valider la configuration AWS au démarrage
try {
  validateAWSConfig();
  console.log('✅ Configuration AWS S3 validée.');
} catch (error) {
  console.error(`❌ Erreur de configuration AWS: ${error.message}`);
  // L'application continuera, mais les fonctionnalités S3 échoueront avec des erreurs claires.
}

// Configuration d'AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
});

class Profile {
  constructor() {
    this.db = db;
    this.bucket = process.env.AWS_BUCKET || 'eternal-night';
  }

  // Obtenir le profil d'un utilisateur
  async getProfileByUserId(userId) {
    try {
      const [rows] = await this.db.execute(
        'SELECT * FROM profile WHERE user_id = ?',
        [userId]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error);
      throw error;
    }
  }

  // Obtenir le profil utilisateur avec URL avatar construite (déplacé depuis User.js)
  async getUserProfile(userId) {
    try {
      const [rows] = await this.db.execute('SELECT avatar_path FROM profile WHERE user_id = ?', [userId]);
      
      if (!rows.length) {
        return {};
      }
      
      const profile = rows[0];
      
      // Construire l'URL complète de l'avatar si disponible
      let avatarUrl = null;
      if (profile.avatar_path) {
        avatarUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${profile.avatar_path}`;
      }
      
      return {
        ...profile,
        avatarUrl
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      throw error;
    }
  }

  // Récupérer les rôles d'un utilisateur (déplacé depuis User.js)
  async getUserRoles(userId) {
    try {
      const [rows] = await this.db.execute(`
        SELECT r.role 
        FROM roles r
        JOIN role_user ru ON r.id = ru.role_id
        WHERE ru.user_id = ?
      `, [userId]);
      
      return rows.map(row => row.role);
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
      throw error;
    }
  }

  // Récupérer les rôles avec descriptions d'un utilisateur (déplacé depuis User.js)
  async getUserRolesWithDescription(userId) {
    try {
      const [rows] = await this.db.execute(`
        SELECT r.role, r.description
        FROM roles r
        JOIN role_user ru ON r.id = ru.role_id
        WHERE ru.user_id = ?
      `, [userId]);
      
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles avec descriptions:', error);
      throw error;
    }
  }

  // Récupérer toutes les descriptions des rôles disponibles
  async getAllRolesDescriptions() {
    try {
      const [rows] = await this.db.execute(`
        SELECT role, description 
        FROM roles 
        ORDER BY role ASC
      `);
      
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des descriptions des rôles:', error);
      throw error;
    }
  }

  // Récupérer la description d'un rôle spécifique
  async getRoleDescription(roleName) {
    try {
      const [rows] = await this.db.execute(`
        SELECT role, description 
        FROM roles 
        WHERE role = ?
      `, [roleName]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la description du rôle:', error);
      throw error;
    }
  }

  // Créer un profil pour un utilisateur
  async createProfile(userId) {
    try {
      const [result] = await this.db.execute(
        'INSERT INTO profile (user_id) VALUES (?)',
        [userId]
      );
      
      return {
        success: true,
        profileId: result.insertId,
        message: 'Profil créé avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la création du profil :', error);
      throw error;
    }
  }

  // Mettre à jour les informations du profil
  async updateProfile(userId, profileData) {
    try {
      // Vérifier si le profil existe
      let profile = await this.getProfileByUserId(userId);
      
      // Créer le profil s'il n'existe pas
      if (!profile) {
        await this.createProfile(userId);
      }
      
      // Filtrer les données pour ne garder que les champs valides
      const validFields = ['bio', 'location', 'website'];
      const fieldsToUpdate = Object.keys(profileData)
        .filter(key => validFields.includes(key) && profileData[key] !== undefined);
      
      if (fieldsToUpdate.length === 0) {
        return {
          success: false,
          message: 'Aucune donnée valide à mettre à jour'
        };
      }
      
      // Construire la requête SQL
      const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
      const values = fieldsToUpdate.map(field => profileData[field]);
      values.push(userId);
      
      // Exécuter la mise à jour
      await this.db.execute(
        `UPDATE profile SET ${setClause} WHERE user_id = ?`,
        values
      );
      
      // Récupérer le profil mis à jour
      profile = await this.getProfileByUserId(userId);
      
      return {
        success: true,
        message: 'Profil mis à jour avec succès',
        profile
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      throw error;
    }
  }

  // Mettre à jour l'avatar d'un utilisateur
  async updateAvatar(userId, imageBuffer, fileName) {
    try {
      // Valider les paramètres d'entrée
      if (!userId || !imageBuffer || !fileName) {
        throw new Error('Paramètres manquants pour la mise à jour de l\'avatar');
      }

      // Valider la configuration AWS avant toute opération
      validateAWSConfig();

      // Validation supplémentaire du fichier
      const mockFile = {
        originalname: fileName,
        size: imageBuffer.length,
        mimetype: this._getMimeTypeFromExtension(path.extname(fileName))
      };
      
      const fileValidation = FormValidation.validateAvatarFile(mockFile, imageBuffer);
      if (!fileValidation.success) {
        throw new Error(`Validation du fichier échouée: ${fileValidation.error}`);
      }

      // Vérifier si le profil existe
      let profile = await this.getProfileByUserId(userId);
      
      if (!profile) {
        // Créer le profil et le récupérer pour avoir l'ID
        await this.createProfile(userId);
        profile = await this.getProfileByUserId(userId); 
      }
      
      // Générer un nom de fichier unique et sécurisé
      const fileExtension = path.extname(fileName);
      const sanitizedFileName = this._sanitizeFileName(fileName);
      const uniqueFileName = `avatars/${userId}/${uuidv4()}_${sanitizedFileName}${fileExtension}`;
      
      const params = {
        Bucket: this.bucket,
        Key: uniqueFileName,
        Body: imageBuffer,
        ContentType: this._getContentType(fileExtension),
        ACL: 'public-read',
        Metadata: {
          'upload-timestamp': new Date().toISOString(),
          'user-id': userId.toString(),
          'original-filename': sanitizedFileName
        }
      };
      
      // Supprimer l'ancien avatar S3 si existant
      if (profile && profile.avatar_path) {
        try {
          await this._deleteFileFromS3(profile.avatar_path);
        } catch (deleteError) {
          console.warn('Impossible de supprimer l\'ancien avatar:', deleteError.message);
        }
      }
      
      // Uploader vers S3 avec timeout
      const uploadResult = await Promise.race([
        s3.upload(params).promise(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de 30s dépassé lors de l\'upload vers S3')), 30000)
        )
      ]);
      
      // Mettre à jour le chemin dans la base de données
      await this.db.execute(
        'UPDATE profile SET avatar_path = ? WHERE user_id = ?',
        [uniqueFileName, userId]
      );
      
      return {
        success: true,
        avatarPath: uniqueFileName,
        avatarUrl: uploadResult.Location,
        message: 'Avatar mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avatar :', error);
      
      // Gestion des erreurs spécifiques AWS
      if (error.code === 'NoSuchBucket') {
        throw new Error('Bucket S3 introuvable. Vérifiez la configuration AWS.');
      } else if (error.code === 'InvalidAccessKeyId') {
        throw new Error('Clés d\'accès AWS invalides.');
      } else if (error.code === 'SignatureDoesNotMatch') {
        throw new Error('Signature AWS invalide. Vérifiez vos clés d\'accès.');
      } else if (error.code === 'AccessDenied') {
        throw new Error('Accès refusé au bucket S3. Vérifiez les permissions IAM.');
      }
      
      throw error;
    }
  }

  // Supprimer l'avatar d'un utilisateur
  async removeAvatar(userId) {
    try {
      const profile = await this.getProfileByUserId(userId);
      
      if (!profile || !profile.avatar_path) {
        return {
          success: false,
          message: 'Aucun avatar à supprimer'
        };
      }
      
      // Supprimer le fichier de S3
      await this._deleteFileFromS3(profile.avatar_path);
      
      // Mettre à jour la base de données
      await this.db.execute(
        'UPDATE profile SET avatar_path = NULL WHERE user_id = ?',
        [userId]
      );
      
      return {
        success: true,
        message: 'Avatar supprimé avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avatar :', error);
      throw error;
    }
  }

  // Méthode privée pour obtenir le type MIME depuis l'extension
  _getMimeTypeFromExtension(extension) {
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  // Méthode privée pour nettoyer le nom de fichier
  _sanitizeFileName(fileName) {
    if (!fileName) return 'unknown';
    
    // Remplacer les caractères dangereux et conserver seulement les caractères sûrs
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  // Méthode privée pour supprimer un fichier de S3 avec retry
  async _deleteFileFromS3(filePath) {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const params = {
          Bucket: this.bucket,
          Key: filePath
        };
        
        await s3.deleteObject(params).promise();
        return true;
      } catch (error) {
        attempt++;
        console.error(`Tentative ${attempt} de suppression échouée:`, error.message);
        
        if (attempt >= maxRetries) {
          throw error;
        }
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return false;
  }

  // Méthode privée pour déterminer le type de contenu
  _getContentType(extension) {
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}

module.exports = new Profile(); 