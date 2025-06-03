const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

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
      // Vérifier si le profil existe
      const profile = await this.getProfileByUserId(userId);
      
      if (!profile) {
        await this.createProfile(userId);
      }
      
      // Générer un nom de fichier unique
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `avatars/${userId}/${uuidv4()}${fileExtension}`;
      
      // Paramètres pour S3
      const params = {
        Bucket: this.bucket,
        Key: uniqueFileName,
        Body: imageBuffer,
        ContentType: this._getContentType(fileExtension),
        ACL: 'public-read'
      };
      
      // Supprimer l'ancien avatar si existant
      if (profile && profile.avatar_path) {
        await this._deleteFileFromS3(profile.avatar_path);
      }
      
      // Uploader le nouvel avatar
      const uploadResult = await s3.upload(params).promise();
      
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

  // Méthode privée pour supprimer un fichier de S3
  async _deleteFileFromS3(filePath) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: filePath
      };
      
      await s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier S3 :', error);
      return false;
    }
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