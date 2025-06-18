const User = require('../models/User');
const Author = require('../models/Author');

class AuthorController {
  /**
   * Soumettre une candidature d'auteur
   * POST /api/authors/apply
   */
  static async submitApplication(req, res) {
    try {
      console.log('🚀 === DÉBUT TRAITEMENT CANDIDATURE AUTEUR ===');
      console.log('📥 Réception d\'une candidature d\'auteur...');
      console.log('📋 Données reçues:', req.body);
      console.log('👤 Utilisateur authentifié:', req.user);
      console.log('🍪 Cookies reçus:', Object.keys(req.cookies || {}));
      console.log('🔑 Headers Authorization:', req.headers['authorization'] ? 'présent' : 'absent');
      
      const userId = req.user.id;
      const { authorName, reason, socialLinks, acceptTerms } = req.body;

      // Validation des données requises
      if (!authorName || !reason || !acceptTerms) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs obligatoires doivent être remplis'
        });
      }

      // Validation de la longueur de la motivation
      if (reason.length < 100 || reason.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'La motivation doit contenir entre 100 et 1000 caractères'
        });
      }

      // Vérifier si l'utilisateur existe
      const user = await User.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier si l'utilisateur est déjà auteur
      const existingAuthor = await Author.findByUserId(userId);
      if (existingAuthor) {
        return res.status(409).json({
          success: false,
          message: 'Vous êtes déjà auteur sur notre plateforme'
        });
      }

      // Créer la candidature en statut "pending"
      const newAuthor = await Author.create({
        user_id: userId,
        pseudo: authorName,
        description: reason,
        website_url: socialLinks?.website || null,
        twitter_url: socialLinks?.twitter || null,
        instagram_url: socialLinks?.instagram || null,
        status: 'pending'
      });

      console.log('Nouvelle candidature d\'auteur créée:', {
        authorId: newAuthor.id,
        userId,
        pseudo: authorName,
        status: 'pending',
        timestamp: new Date().toISOString()
      });

      // Réponse de succès
      res.status(201).json({
        success: true,
        message: 'Votre candidature a été soumise avec succès ! Vous recevrez une notification une fois qu\'un administrateur l\'aura examinée.',
        data: {
          authorId: newAuthor.id,
          pseudo: newAuthor.pseudo,
          status: 'pending',
          createdAt: newAuthor.created_at
        }
      });

    } catch (error) {
      console.error('Erreur lors de la soumission de candidature:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur lors de la soumission de votre candidature'
      });
    }
  }

  /**
   * Récupérer le statut de candidature de l'utilisateur connecté
   * GET /api/authors/status
   */
  static async getApplicationStatus(req, res) {
    try {
      const userId = req.user.id;
      
      const status = await Author.getApplicationStatus(userId);
      
      res.status(200).json({
        success: true,
        data: {
          hasApplication: status !== null,
          status: status,
          canApply: status === null || status === 'rejected'
        }
      });
      
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du statut de candidature'
      });
    }
  }

  /**
   * Récupérer tous les auteurs avec pagination
   * GET /api/authors
   */
  static async getAllAuthors(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Récupérer les auteurs depuis la base de données
      const result = await Author.findAll(page, limit);

      res.status(200).json({
        success: true,
        data: {
          authors: result.authors.map(author => ({
            id: author.id,
            pseudo: author.pseudo,
            description: author.description,
            websiteUrl: author.website_url,
            twitterUrl: author.twitter_url,
            instagramUrl: author.instagram_url,
            joinedAt: author.created_at,
            status: 'active'
          })),
          pagination: {
            current_page: result.page,
            per_page: result.limit,
            total: result.total,
            total_pages: result.totalPages
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des auteurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur lors de la récupération des auteurs'
      });
    }
  }
}

module.exports = AuthorController; 