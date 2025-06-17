const multer = require('multer');
const FormValidation = require('../utils/validation');

class UploadMiddleware {
  constructor() {
    // Configuration du stockage temporaire en mémoire
    this.storage = multer.memoryStorage();
    
    // Configuration de multer
    this.upload = multer({
      storage: this.storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 1, // Limite à 1 fichier
        fields: 10, // Limite le nombre de champs
      },
      fileFilter: this._fileFilter.bind(this)
    });
  }

  // Filtre pour les fichiers avec validation stricte
  _fileFilter(req, file, cb) {
    try {
      // Validation basique du nom de fichier
      const fileNameValidation = FormValidation.validateFileName(file.originalname);
      if (!fileNameValidation.success) {
        return cb(new Error(fileNameValidation.error), false);
      }
      
      // Vérifier le type MIME du fichier
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
        return cb(new Error('Type MIME non autorisé. Seules les images sont acceptées'), false);
      }
      
      // Vérifier l'extension du fichier
      const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
      if (!allowedExtensions.test(file.originalname)) {
        return cb(new Error('Extension de fichier non autorisée. Utilisez JPG, JPEG, PNG, GIF ou WEBP'), false);
      }
      
      cb(null, true);
    } catch (error) {
      cb(new Error('Erreur lors de la validation du fichier'), false);
    }
  }

  // Middleware pour l'upload d'avatar avec validation complète
  uploadAvatar() {
    return [
      this.upload.single('avatar'),
      (req, res, next) => {
        try {
          // Vérifier si un fichier a été téléchargé
          if (!req.file) {
            return res.status(400).json({
              success: false,
              message: 'Aucun fichier n\'a été téléchargé'
            });
          }
          
          // Validation complète du fichier avec le buffer
          const fileValidation = FormValidation.validateAvatarFile(req.file, req.file.buffer);
          if (!fileValidation.success) {
            return res.status(400).json({
              success: false,
              message: fileValidation.error
            });
          }
          
          // Valider l'ID utilisateur et les données
          try {
            FormValidation.avatarSchema.parse({
              userId: parseInt(req.user.id, 10),
              fileName: req.file.originalname
            });
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: 'Données de validation invalides',
              errors: error.errors?.map(err => err.message) || ['Erreur de validation']
            });
          }
          
          // Ajouter des informations de sécurité au fichier
          req.file.validated = true;
          req.file.validationTimestamp = new Date().toISOString();
          
          next();
        } catch (error) {
          console.error('Erreur dans uploadAvatar middleware:', error);
          
          if (error instanceof multer.MulterError) {
            switch (error.code) {
              case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                  success: false,
                  message: 'La taille du fichier ne peut pas dépasser 5 MB'
                });
              case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                  success: false,
                  message: 'Un seul fichier est autorisé'
                });
              case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                  success: false,
                  message: 'Champ de fichier inattendu'
                });
              default:
                return res.status(400).json({
                  success: false,
                  message: `Erreur de téléchargement: ${error.message}`
                });
            }
          }
          
          return res.status(500).json({
            success: false,
            message: error.message || 'Une erreur est survenue lors du téléchargement du fichier'
          });
        }
      }
    ];
  }
}

module.exports = new UploadMiddleware(); 