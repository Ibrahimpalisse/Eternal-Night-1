const pool = require('../db');

class Author {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.pseudo = data.pseudo;
    this.description = data.description;
    this.website_url = data.website_url;
    this.twitter_url = data.twitter_url;
    this.instagram_url = data.instagram_url;
    this.status = data.status || 'pending';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Créer un nouvel auteur dans la base de données
  static async create(authorData) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO authors (user_id, pseudo, description, website_url, twitter_url, instagram_url, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          authorData.user_id,
          authorData.pseudo,
          authorData.description || null,
          authorData.website_url || null,
          authorData.twitter_url || null,
          authorData.instagram_url || null,
          authorData.status || 'pending'
        ]
      );

      return new Author({ id: result.insertId, ...authorData });
    } catch (error) {
      console.error('Erreur lors de la création de l\'auteur:', error);
      throw error;
    }
  }

  // Trouver un auteur par user_id
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM authors WHERE user_id = ?',
        [userId]
      );

      return rows.length > 0 ? new Author(rows[0]) : null;
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'auteur:', error);
      throw error;
    }
  }

  // Récupérer tous les auteurs avec pagination
  static async findAll(page = 1, limit = 10) {
    try {
      // S'assurer que page et limit sont des entiers
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;

      // Récupérer les auteurs seulement (sans JOIN pour éviter les problèmes)
      const [rows] = await pool.execute(
        `SELECT * FROM authors ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
      );

      // Compter le total
      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM authors'
      );

      return {
        authors: rows.map(row => new Author(row)),
        total: countResult[0].total,
        page,
        limit,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des auteurs:', error);
      throw error;
    }
  }

  // Vérifier si un utilisateur est déjà auteur
  static async isAuthor(userId) {
    const author = await this.findByUserId(userId);
    return author !== null;
  }

  // Mettre à jour un auteur
  async update(updateData) {
    try {
      const [result] = await pool.execute(
        `UPDATE authors 
         SET pseudo = ?, description = ?, website_url = ?, twitter_url = ?, instagram_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          updateData.pseudo || this.pseudo,
          updateData.description || this.description,
          updateData.website_url || this.website_url,
          updateData.twitter_url || this.twitter_url,
          updateData.instagram_url || this.instagram_url,
          updateData.status || this.status,
          this.id
        ]
      );
      
      // Mettre à jour les propriétés de l'instance
      Object.assign(this, updateData);
      
      return this;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'auteur:', error);
      throw error;
    }
  }

  // Approuver une candidature
  static async approve(authorId) {
    try {
      const [result] = await pool.execute(
        'UPDATE authors SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['approved', authorId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de l\'approbation de l\'auteur:', error);
      throw error;
    }
  }

  // Rejeter une candidature
  static async reject(authorId) {
    try {
      const [result] = await pool.execute(
        'UPDATE authors SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['rejected', authorId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors du rejet de l\'auteur:', error);
      throw error;
    }
  }

  // Récupérer les candidatures par statut
  static async findByStatus(status, page = 1, limit = 10) {
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;

      const [rows] = await pool.execute(
        `SELECT * FROM authors WHERE status = ? ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        [status]
      );

      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM authors WHERE status = ?',
        [status]
      );

      return {
        authors: rows.map(row => new Author(row)),
        total: countResult[0].total,
        page,
        limit,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des auteurs par statut:', error);
      throw error;
    }
  }

  // Récupérer le statut d'une candidature par user_id
  static async getApplicationStatus(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT status FROM authors WHERE user_id = ?',
        [userId]
      );
      return rows.length > 0 ? rows[0].status : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  }
}

module.exports = Author; 