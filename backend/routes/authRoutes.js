const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const securityMiddleware = require('../middleware/SecurityMiddleware');
const FormValidation = require('../utils/validation');

// Routes publiques (pas besoin d'authentification)
// Mais protégées contre les attaques par force brute avec le rate limiter
// Et validées avec Zod
router.post('/register', 
    securityMiddleware.rateLimit.getDefaultLimiter(), 
    FormValidation.validate(FormValidation.registerSchema),
    authController.register
);

router.post('/login', 
    securityMiddleware.rateLimit.getDefaultLimiter(), 
    FormValidation.validate(FormValidation.loginSchema),
    authController.login
);

router.post('/verify-email', 
    securityMiddleware.rateLimit.getDefaultLimiter(), 
    FormValidation.validate(FormValidation.verifyEmailSchema),
    authController.verifyEmail
);

router.post('/resend-verification', 
    securityMiddleware.rateLimit.getDefaultLimiter(), 
    FormValidation.validate(FormValidation.forgotPasswordSchema), // Utiliser le même schéma que pour forgot-password (email uniquement)
    authController.resendVerification
);

router.post('/forgot-password', 
    securityMiddleware.rateLimit.getDefaultLimiter(), 
    FormValidation.validate(FormValidation.forgotPasswordSchema),
    authController.forgotPassword
);

router.post('/reset-password', 
    securityMiddleware.rateLimit.getDefaultLimiter(), 
    FormValidation.validate(FormValidation.resetPasswordSchema),
    authController.resetPassword
);

// Route protégée nécessitant une authentification
router.get('/me', 
    securityMiddleware.jwt.authenticateToken(),
    authController.getCurrentUser
);

// Nouvelle route pour obtenir les informations utilisateur en temps réel (y compris les connexions actives)
router.get('/me/realtime', 
    securityMiddleware.jwt.authenticateToken(),
    authController.getRealtimeUserInfo
);

// Route pour rafraîchir le token
router.post('/refresh-token', authController.refreshToken);

// Route pour vérifier la validité d'un token de réinitialisation
router.get('/check-reset-token', authController.checkResetToken);

// Route pour la déconnexion
router.post('/logout',
    securityMiddleware.jwt.authenticateToken(),
    authController.logout
);

// Route pour se déconnecter de toutes les sessions
router.post('/logout-all-sessions', 
    securityMiddleware.jwt.authenticateToken(),
    authController.logoutAllSessions
);

module.exports = router; 