const Profile = require('../models/Profile');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

// Contrôleur pour la gestion des profils
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer les informations complètes de l'utilisateur
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Construire l'URL complète de l'avatar si disponible
    let avatarUrl = null;
    if (user.profile && user.profile.avatar_path) {
      avatarUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${user.profile.avatar_path}`;
    }
    
    res.json({
      success: true,
      user: {
        ...user,
        profile: {
          ...user.profile,
          avatarUrl
        }
      },
      profile: user.profile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération du profil'
    });
  }
};

// Contrôleur pour la mise à jour de l'avatar
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été téléchargé'
      });
    }
    
    // Mettre à jour l'avatar
    const result = await Profile.updateAvatar(userId, file.buffer, file.originalname);
    
    res.json({
      success: true,
      avatarPath: result.avatarPath,
      avatarUrl: result.avatarUrl,
      message: 'Avatar mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avatar :', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour de l\'avatar'
    });
  }
};

// Contrôleur pour la suppression de l'avatar
exports.removeAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Supprimer l'avatar
    const result = await Profile.removeAvatar(userId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avatar :', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la suppression de l\'avatar'
    });
  }
};

// Contrôleur pour la mise à jour du profil
exports.updateProfile = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est authentifié (req.user est défini par le middleware d'authentification)
    const userId = req.user.id;
    
    // Récupérer les données du profil depuis le corps de la requête
    const { bio, location, website } = req.body;
    
    // Mettre à jour le profil
    const result = await Profile.updateProfile(userId, { bio, location, website });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      profile: result.profile
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour du profil'
    });
  }
};

// Contrôleur pour récupérer le profil d'un autre utilisateur (version publique)
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Récupérer le profil de l'utilisateur
    const profile = await Profile.getProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé'
      });
    }
    
    // Construire l'URL complète de l'avatar si disponible
    let avatarUrl = null;
    if (profile.avatar_path) {
      avatarUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${profile.avatar_path}`;
    }
    
    // Ne renvoyer que les informations publiques
    res.json({
      success: true,
      profile: {
        userId: profile.user_id,
        avatarUrl
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération du profil'
    });
  }
};

// Contrôleur pour demander un changement d'email
exports.requestEmailChange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;
    
    // Vérifier si l'utilisateur existe
    const currentUser = await User.getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Vérifier si le nouvel email est différent de l'actuel
    if (currentUser.email === email) {
      return res.status(400).json({
        success: false,
        message: 'Le nouvel email doit être différent de l\'email actuel'
      });
    }
    
    // Vérifier si l'email n'est pas déjà utilisé par un autre utilisateur
    const existingUser = await User.findByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé par un autre compte'
      });
    }
    
    // Utiliser Profile pour générer et stocker le code
    const result = await Profile.requestEmailChange(userId, email);
    
    if (result.success) {
      // Envoyer l'email de vérification au nouvel email
      await sendVerificationEmail(email, result.verificationCode);
      
      res.json({
        success: true,
        message: 'Un code de vérification a été envoyé à votre nouvelle adresse email. Veuillez vérifier votre boîte de réception.',
        email: email
      });
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur lors de la demande de changement d\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la demande de changement d\'email'
    });
  }
};

// Contrôleur pour vérifier le code et confirmer le changement d'email
exports.verifyEmailChange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;
    
    // Utiliser Profile pour vérifier le code et effectuer le changement
    const result = await Profile.verifyEmailChange(userId, code);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Email mis à jour avec succès',
        email: result.newEmail
      });
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification du changement d\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la vérification du changement d\'email'
    });
  }
};

// Contrôleur pour vérifier la disponibilité d'un email
exports.checkEmailAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await User.findByEmail(email);
    const isAvailable = !existingUser || existingUser.id === userId;
    
    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable ? 'Email disponible' : 'Cet email est déjà utilisé par un autre compte'
    });
    
  } catch (error) {
    console.error('Erreur lors de la vérification de la disponibilité de l\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la vérification de l\'email'
    });
  }
}; 