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

// Route publique pour récupérer le profil d'un utilisateur (limité aux informations publiques)
router.get('/user/:userId', profileController.getUserProfile);

module.exports = router; 