const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const securityMiddleware = require('../middleware/SecurityMiddleware');
const uploadMiddleware = require('../middleware/UploadMiddleware');
const FormValidation = require('../utils/validation');

// Middleware d'authentification
const authenticate = securityMiddleware.jwt.authenticateToken();

// Routes protégées (nécessitent une authentification)
router.get('/me', authenticate, profileController.getProfile);
router.post('/avatar', authenticate, ...uploadMiddleware.uploadAvatar(), profileController.updateAvatar);
router.delete('/avatar', authenticate, profileController.removeAvatar);
router.put('/update', authenticate, profileController.updateProfile);

// Routes pour la gestion de l'email
router.put('/email', 
    authenticate,
    securityMiddleware.rateLimit.getDefaultLimiter(),
    FormValidation.validate(FormValidation.updateEmailSchema),
    profileController.requestEmailChange
);

router.post('/email/verify', 
    authenticate,
    securityMiddleware.rateLimit.getDefaultLimiter(),
    FormValidation.validate(FormValidation.verifyEmailChangeSchema),
    profileController.verifyEmailChange
);

// Route pour vérifier la disponibilité d'un email
router.post('/check-email', 
    authenticate,
    securityMiddleware.rateLimit.getDefaultLimiter(),
    profileController.checkEmailAvailability
);

// Routes pour la gestion du mot de passe
router.post('/password/verify', 
    authenticate,
    securityMiddleware.rateLimit.createPasswordVerificationLimiter(),
    FormValidation.validate(FormValidation.checkPasswordSchema),
    profileController.verifyCurrentPassword
);

router.put('/password', 
    authenticate,
    securityMiddleware.rateLimit.createUserBasedLimiter({
        windowMs: 60 * 60 * 1000, // 1 heure
        max: 3, // Maximum 3 changements de mot de passe par heure
        message: 'Trop de tentatives de changement de mot de passe. Réessayez plus tard.'
    }),
    FormValidation.validate(FormValidation.updatePasswordSchema),
    profileController.updatePassword
);

// Route publique pour récupérer le profil d'un utilisateur (limité aux informations publiques)
router.get('/user/:userId', profileController.getUserProfile);

module.exports = router; 