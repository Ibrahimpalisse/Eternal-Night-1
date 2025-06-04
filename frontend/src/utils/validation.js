import { z } from 'zod';

// Classe de validation pour les formulaires
export class FormValidation {
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
    .min(2, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .max(100, { message: "Le mot de passe est trop long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    });

  // Validation de l'URL d'une image
  static imageUrl = z
    .string()
    .url({ message: "Format d'URL invalide" })
    .regex(/\.(jpeg|jpg|gif|png|webp)$/i, { message: "L'URL doit pointer vers une image (jpeg, jpg, gif, png, webp)" });

  // Validation sécurisée des fichiers d'avatar
  static validateAvatarFile(file) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!file) {
      return { success: false, error: "Aucun fichier sélectionné" };
    }
    
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Le fichier ne peut pas dépasser 5MB" };
    }
    
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return { success: false, error: "Format de fichier non autorisé. Utilisez JPEG, PNG, GIF ou WebP" };
    }
    
    // Vérification du nom de fichier pour éviter les attaques
    if (file.name && !/^[a-zA-Z0-9._-]+\.(jpeg|jpg|png|gif|webp)$/i.test(file.name)) {
      return { success: false, error: "Nom de fichier invalide" };
    }
    
    return { success: true };
  }

  // Validation et sanitisation des URLs d'images
  static validateImageUrl(url) {
    try {
      // Validation de base
      const urlValidation = this.imageUrl.parse(url);
      
      // Vérifications de sécurité supplémentaires
      const parsedUrl = new URL(url);
      
      // Bloquer les protocoles dangereux
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return { success: false, error: "Seuls les protocoles HTTP et HTTPS sont autorisés" };
      }
      
      // Bloquer les IP locales (optionnel, selon vos besoins)
      const hostname = parsedUrl.hostname;
      if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
        return { success: false, error: "Les URLs locales ne sont pas autorisées" };
      }
      
      return { success: true, url: urlValidation };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || "URL invalide" 
      };
    }
  }

  // Schéma complet pour le formulaire de connexion
  static loginSchema = z.object({
    email: this.email,
    password: z.string().min(1, { message: "Le mot de passe est requis" }),
    rememberMe: z.boolean().optional()
  });

  // Schéma complet pour le formulaire d'inscription
  static registerSchema = z.object({
    username: this.username,
    email: this.email,
    password: this.password,
    confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise" }),
    terms: z.boolean().refine(val => val === true, {
      message: "Vous devez accepter les conditions d'utilisation"
    })
  }).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  });

  // Schéma pour le formulaire de mot de passe oublié
  static forgotPasswordSchema = z.object({
    email: this.email
  });

  // Schéma pour le formulaire de réinitialisation de mot de passe
  static resetPasswordSchema = z.object({
    password: this.password,
    confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise" })
  }).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  });

  // Fonction pour valider un champ spécifique
  static validateField(field, value) {
    try {
      if (field === 'username') {
        this.username.parse(value);
      } else if (field === 'email') {
        this.email.parse(value);
      } else if (field === 'password') {
        this.password.parse(value);
      } else if (field === 'imageUrl') {
        return this.validateImageUrl(value);
      } else if (field === 'terms') {
        z.boolean().refine(val => val === true, {
          message: "Vous devez accepter les conditions d'utilisation"
        }).parse(value);
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

  // Fonction pour valider un formulaire complet
  static validateForm(formType, data) {
    try {
      if (formType === 'login') {
        this.loginSchema.parse(data);
      } else if (formType === 'register') {
        this.registerSchema.parse(data);
      } else if (formType === 'forgotPassword') {
        this.forgotPasswordSchema.parse(data);
      } else if (formType === 'resetPassword') {
        this.resetPasswordSchema.parse(data);
      }
      return { success: true };
    } catch (error) {
      const errors = {};
      
      error.errors.forEach(err => {
        const path = err.path[0];
        errors[path] = err.message;
      });
      
      return { 
        success: false, 
        errors 
      };
    }
  }
}
