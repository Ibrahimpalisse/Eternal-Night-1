const Profile = require('../models/Profile');

// Contrôleur pour la gestion des profils
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
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
    
    res.json({
      success: true,
      profile: {
        ...profile,
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