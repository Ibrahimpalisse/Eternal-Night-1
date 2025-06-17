const { z } = require('zod');

// Classe de validation pour les formulaires
class FormValidation {
  // Validation du nom d'utilisateur
  static username = z
    .string()
    .min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
    .max(30, { message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" })
    .regex(/^[a-zA-Z0-9_-]+$/, { 
      message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores" 
    });

  // Validation de l'email
  static email = z
    .string()
    .email({ message: "Format d'email invalide" })
    .min(5, { message: "L'email est trop court" })
    .max(255, { message: "L'email est trop long" });

  // Validation du mot de passe
  static password = z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .max(100, { message: "Le mot de passe est trop long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    });

  // Validation d'image
  static image = z
    .instanceof(Buffer, { message: "Le fichier doit être un buffer valide" })
    .refine((buffer) => buffer.length > 0, { message: "Le fichier ne peut pas être vide" })
    .refine((buffer) => buffer.length <= 5 * 1024 * 1024, { message: "La taille du fichier ne peut pas dépasser 5 Mo" });

  // Schéma pour la validation d'avatar
  static avatarSchema = z.object({
    userId: z.number().int().positive({ message: "L'ID utilisateur doit être un nombre positif" }),
    fileName: z
      .string()
      .min(1, { message: "Le nom du fichier est requis" })
      .refine(
        (name) => /\.(jpg|jpeg|png|gif|webp)$/i.test(name),
        { message: "Format de fichier non pris en charge. Utilisez JPG, PNG, GIF ou WEBP" }
      )
  });

  // Schéma complet pour le formulaire de connexion
  static loginSchema = z.object({
    email: this.email,
    password: z.string().min(1, { message: "Le mot de passe est requis" })
  });

  // Schéma complet pour le formulaire d'inscription
  static registerSchema = z.object({
    name: this.username,
    email: this.email,
    password: this.password
  });

  // Schéma pour la vérification d'email
  static verifyEmailSchema = z.object({
    email: this.email,
    code: z.string().length(6, { message: "Le code de vérification doit contenir 6 caractères" })
  });

  // Schéma pour la demande de réinitialisation de mot de passe
  static forgotPasswordSchema = z.object({
    email: this.email
  });

  // Schéma pour la réinitialisation de mot de passe
  static resetPasswordSchema = z.object({
    code: z.string().min(1, { message: "Le code de réinitialisation est requis" }),
    password: this.password
  });

  // Schéma pour la déconnexion
  static logoutSchema = z.object({
    deviceId: z.string().optional(),
    allDevices: z.boolean().optional(),
    reason: z.string().optional()
  }).strict().refine(data => {
    // Au moins l'un des champs doit être présent pour une requête valide
    // Si aucun champ n'est présent, c'est une déconnexion standard
    return true;
  }, {
    message: "La requête est valide"
  });

  // Schéma pour la mise à jour du nom
  static updateNameSchema = z.object({
    name: this.username
  });

  // Schéma pour demander un changement d'email
  static updateEmailSchema = z.object({
    email: this.email
  });

  // Schéma pour vérifier le changement d'email
  static verifyEmailChangeSchema = z.object({
    code: z.string().length(6, { message: "Le code de vérification doit contenir 6 caractères" })
  });

  // Schéma pour vérifier le mot de passe actuel
  static checkPasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis" })
  });

  // Schéma pour mettre à jour le mot de passe
  static updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis" }),
    newPassword: this.password,
    confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise" })
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  }).refine((data) => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ["newPassword"]
  });

  // Fonction pour valider un champ spécifique
  static validateField(field, value) {
    try {
      if (field === 'name' || field === 'username') {
        this.username.parse(value);
      } else if (field === 'email') {
        this.email.parse(value);
      } else if (field === 'password') {
        this.password.parse(value);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Champ invalide" 
      };
    }
  }

  // Fonction pour valider si une chaîne ne contient que des chiffres
  static validateDigits(value) {
    try {
      z.string().regex(/^\d+$/, { message: "Le champ doit contenir uniquement des chiffres" }).parse(value);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Champ invalide" 
      };
    }
  }

  // Middleware de validation pour les requêtes Express
  static validate(schema) {
    return (req, res, next) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        const errors = {};
        
        error.errors.forEach(err => {
          const path = err.path[0];
          errors[path] = err.message;
        });
        
        return res.status(400).json({ 
          success: false, 
          message: "Erreur de validation", 
          errors 
        });
      }
    };
  }

  // Validation sécurisée des fichiers d'avatar
  static validateAvatarFile(file, buffer) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;
    
    // Vérifications de base
    if (!file) {
      return { success: false, error: "Aucun fichier fourni" };
    }
    
    if (!file.originalname) {
      return { success: false, error: "Nom de fichier manquant" };
    }
    
    // Validation du nom de fichier permissive - accepte tout sauf les caractères dangereux
    // Vérifier que le fichier a une extension valide
    if (!ALLOWED_EXTENSIONS.test(file.originalname)) {
      return { 
        success: false, 
        error: "Extension de fichier non autorisée. Utilisez JPG, JPEG, PNG, GIF ou WEBP" 
      };
    }
    
    // Vérifier SEULEMENT les caractères vraiment dangereux pour la sécurité
    const dangerousPatterns = [
      /\.\./,           // Path traversal (../)
      /[<>:"|?*\\]/,    // Caractères interdits dans les noms de fichiers système
      /[\x00-\x1f]/,    // Caractères de contrôle (non-imprimables)
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i, // Noms réservés Windows (plus précis)
    ];
    
    // Vérifier le nom complet
    for (const pattern of dangerousPatterns) {
      if (pattern.test(file.originalname)) {
        return { 
          success: false, 
          error: "Nom de fichier contient des caractères système non autorisés" 
        };
      }
    }
    
    // Vérifier la longueur (empêcher les noms trop longs)
    if (file.originalname.length > 255) {
      return { 
        success: false, 
        error: "Le nom de fichier est trop long (maximum 255 caractères)" 
      };
    }
    
    // Vérification du type MIME
    if (!ALLOWED_TYPES.includes(file.mimetype.toLowerCase())) {
      return { 
        success: false, 
        error: "Type MIME non autorisé. Seules les images sont acceptées" 
      };
    }
    
    // Vérification de la taille
    if (file.size > MAX_SIZE) {
      return { 
        success: false, 
        error: "Le fichier ne peut pas dépasser 5MB" 
      };
    }
    
    // Vérification du buffer si fourni
    if (buffer) {
      if (!Buffer.isBuffer(buffer)) {
        return { success: false, error: "Buffer invalide" };
      }
      
      if (buffer.length === 0) {
        return { success: false, error: "Le fichier ne peut pas être vide" };
      }
      
      // Vérification flexible de la taille du buffer (peut différer légèrement à cause de l'encoding)
      const sizeDifference = Math.abs(buffer.length - file.size);
      const maxSizeDifference = file.size * 0.1; // 10% de tolérance
      
      if (sizeDifference > maxSizeDifference && sizeDifference > 1000) {
        return { success: false, error: "Taille du buffer incohérente" };
      }
      
      // Vérification basique de la signature du fichier (magic bytes)
      if (!this._validateImageSignature(buffer)) {
        return { 
          success: false, 
          error: "Le fichier ne semble pas être une image valide" 
        };
      }
    }
    
    return { success: true };
  }

  // Vérification des signatures de fichiers (magic bytes)
  static _validateImageSignature(buffer) {
    if (!buffer || buffer.length < 4) return false;
    
    // Signatures des formats d'image supportés
    const signatures = {
      jpeg: [
        [0xFF, 0xD8, 0xFF], // JPEG
      ],
      png: [
        [0x89, 0x50, 0x4E, 0x47], // PNG
      ],
      gif: [
        [0x47, 0x49, 0x46, 0x38], // GIF
      ],
      webp: [
        [0x52, 0x49, 0x46, 0x46], // RIFF (WebP commence par RIFF)
      ]
    };
    
    // Vérifier chaque signature
    for (const format of Object.keys(signatures)) {
      for (const signature of signatures[format]) {
        let matches = true;
        for (let i = 0; i < signature.length; i++) {
          if (buffer[i] !== signature[i]) {
            matches = false;
            break;
          }
        }
        if (matches) {
          // Pour WebP, vérifier aussi la signature complète
          if (format === 'webp') {
            if (buffer.length >= 12) {
              const webpSig = buffer.subarray(8, 12);
              if (webpSig.toString() === 'WEBP') {
                return true;
              }
            }
          } else {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  // Validation des noms de fichier permissive mais sécurisée
  static validateFileName(fileName) {
    if (!fileName || typeof fileName !== 'string') {
      return { success: false, error: "Nom de fichier manquant" };
    }
    
    // Vérifier la longueur
    if (fileName.length > 255) {
      return { 
        success: false, 
        error: "Le nom de fichier est trop long (maximum 255 caractères)" 
      };
    }
    
    // Vérifier que le fichier a une extension valide
    const validExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!validExtensions.test(fileName)) {
      return { 
        success: false, 
        error: "Extension de fichier non autorisée. Utilisez JPG, JPEG, PNG, GIF ou WEBP" 
      };
    }
    
    // Vérifier SEULEMENT les caractères vraiment dangereux
    const dangerousPatterns = [
      /\.\./,           // Path traversal (../)
      /[<>:"|?*\\]/,    // Caractères interdits dans les noms de fichiers système
      /[\x00-\x1f]/,    // Caractères de contrôle (non-imprimables)
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i, // Noms réservés Windows
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(fileName)) {
        return { 
          success: false, 
          error: "Nom de fichier contient des caractères système non autorisés" 
        };
      }
    }
    
    return { success: true };
  }
}

module.exports = FormValidation;
