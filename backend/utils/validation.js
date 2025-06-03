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
}

module.exports = FormValidation;
