const rateLimit = require('express-rate-limit');

class RateLimitMiddleware {
  constructor() {
    this.defaultLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limite chaque IP à 100 requêtes par fenêtre
      message: 'Trop de requêtes de votre IP, veuillez réessayer plus tard.'
    });
  }

  // Méthode pour obtenir le limiteur par défaut
  getDefaultLimiter() {
    return this.defaultLimiter;
  }

  // Méthode pour créer un limiteur personnalisé
  createLimiter(options) {
    return rateLimit({
      windowMs: options.windowMs || 15 * 60 * 1000,
      max: options.max || 100,
      message: options.message || 'Trop de requêtes de votre IP, veuillez réessayer plus tard.',
      standardHeaders: true, // Retourner les en-têtes rate limit dans les réponses `RateLimit-*`
      legacyHeaders: false, // Désactiver les en-têtes `X-RateLimit-*`
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false,
      // Fonction personnalisée pour gérer les réponses de rate limit
      handler: options.handler || this.defaultHandler,
      // Fonction pour générer une clé unique par utilisateur au lieu de par IP
      keyGenerator: options.keyGenerator || this.defaultKeyGenerator,
      // Fonction pour ignorer certaines requêtes
      skip: options.skip || (() => false)
    });
  }

  // Gestionnaire par défaut pour les rate limits dépassés
  defaultHandler(req, res) {
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
      error: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }

  // Générateur de clé par défaut (IP)
  defaultKeyGenerator(req) {
    return req.ip;
  }

  // Créer un limiteur basé sur l'utilisateur connecté
  createUserBasedLimiter(options) {
    return this.createLimiter({
      ...options,
      keyGenerator: (req) => {
        // Utiliser l'ID utilisateur si disponible, sinon l'IP
        return req.user?.id ? `user_${req.user.id}` : req.ip;
      },
      handler: (req, res) => {
        // Log de sécurité pour les tentatives excessives
        const userId = req.user?.id;
        const ip = req.ip;
        const attemptsRemaining = req.rateLimit.remaining;
        const totalAllowed = req.rateLimit.limit;
        const currentAttempts = totalAllowed - attemptsRemaining;
        
        console.warn(`Rate limit dépassé - Utilisateur: ${userId || 'N/A'}, IP: ${ip}, Route: ${req.path}, Tentatives: ${currentAttempts}/${totalAllowed}`);
        
        res.status(429).json({
          success: false,
          message: options.message || 'Trop de tentatives. Accès suspendu temporairement.',
          error: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.round(req.rateLimit.resetTime / 1000),
          suspendSession: options.suspendSession || false,
          attemptsRemaining: attemptsRemaining,
          currentAttempts: currentAttempts,
          maxAttempts: totalAllowed
        });
      }
    });
  }

  // Limiteur spécial pour la vérification de mot de passe avec déconnexion forcée
  createPasswordVerificationLimiter() {
    return this.createUserBasedLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Maximum 5 tentatives
      message: 'Trop de tentatives de vérification de mot de passe incorrectes. Déconnexion forcée pour sécurité.',
      skipSuccessfulRequests: true, // Ne pas compter les vérifications réussies
      suspendSession: true // Indiquer qu'une déconnexion est nécessaire
    });
  }
}

module.exports = new RateLimitMiddleware();