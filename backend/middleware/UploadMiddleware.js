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
      },
      fileFilter: this._fileFilter.bind(this)
    });
  }

  // Filtre pour les fichiers
  _fileFilter(req, file, cb) {
    // Vérifier le type MIME du fichier
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont autorisées'), false);
    }
    
    // Vérifier l'extension du fichier
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!allowedExtensions.test(file.originalname)) {
      return cb(new Error('Format de fichier non pris en charge. Utilisez JPG, PNG, GIF ou WEBP'), false);
    }
    
    cb(null, true);
  }

  // Middleware pour l'upload d'avatar
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
          
          // Valider l'ID utilisateur
          try {
            FormValidation.avatarSchema.parse({
              userId: parseInt(req.user.id, 10),
              fileName: req.file.originalname
            });
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: 'Validation échouée',
              errors: error.errors.map(err => err.message)
            });
          }
          
          next();
        } catch (error) {
          if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({
                success: false,
                message: 'La taille du fichier ne peut pas dépasser 5 Mo'
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