const express = require('express');
const router = express.Router();
const AuthorController = require('../controllers/authorController');
const jwtMiddleware = require('../middleware/JwtMiddleware');
const rateLimitMiddleware = require('../middleware/RateLimitMiddleware');

/**
 * GET /api/authors/status
 * Récupérer le statut de candidature de l'utilisateur connecté
 * Protection: JWT uniquement
 */
router.get('/status',
  jwtMiddleware.authenticateToken(),
  AuthorController.getApplicationStatus
);

/**
 * POST /api/authors/apply
 * Soumettre une candidature d'auteur
 * Protection: JWT + Rate limiting
 */
router.post('/apply', 
  rateLimitMiddleware.createUserBasedLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 5 tentatives par 15 minutes
    message: 'Trop de tentatives de candidature. Veuillez patienter avant de réessayer.'
  }),
  jwtMiddleware.authenticateToken(),
  AuthorController.submitApplication
);

/**
 * GET /api/authors
 * Récupérer tous les auteurs avec pagination
 * Public avec rate limiting léger
 */
router.get('/',
  rateLimitMiddleware.createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requêtes par 15 minutes
    message: 'Trop de requêtes pour consulter les auteurs. Veuillez patienter.'
  }),
  AuthorController.getAllAuthors
);

module.exports = router; 