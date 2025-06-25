import { z } from 'zod';

// Classe de validation pour les formulaires
export class FormValidation {
  // Validation des prénoms et noms
  static firstName = z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères" })
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { 
      message: "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes" 
    });

  static lastName = z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" })
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { 
      message: "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes" 
    });

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

  // Validation de l'URL d'une image
  static imageUrl = z
    .string()
    .url({ message: "Format d'URL invalide" })
    .regex(/\.(jpeg|jpg|gif|png|webp)$/i, { message: "L'URL doit pointer vers une image (jpeg, jpg, gif, png, webp)" });

  // Validation du nom d'auteur
  static authorName = z
    .string()
    .min(2, { message: "Le nom d'auteur doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom d'auteur ne peut pas dépasser 50 caractères" })
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, { 
      message: "Le nom d'auteur ne peut contenir que des lettres, chiffres, espaces et tirets" 
    });

  // Validation de la motivation pour rejoindre les auteurs
  static authorMotivation = z
    .string()
    .min(100, { message: "La motivation doit contenir au moins 100 caractères" })
    .max(1000, { message: "La motivation ne peut pas dépasser 1000 caractères" })
    .refine(value => value.trim().length >= 100, {
      message: "La motivation doit contenir au moins 100 caractères significatifs"
    });

  // Validation des liens sociaux (optionnels)
  static socialUrl = z
    .string()
    .optional()
    .refine(value => !value || z.string().url().safeParse(value).success, {
      message: "Format d'URL invalide"
    });

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

  // Schéma pour le changement de mot de passe (avec mot de passe actuel)
  static changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis" }),
    password: this.password,
    confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise" })
  }).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  }).refine(data => data.currentPassword !== data.password, {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ["password"]
  });

  // Nouveau : Schéma pour la modification d'email utilisateur
  static changeEmailSchema = z.object({
    newEmail: this.email,
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis pour changer l'email" }),
    verificationCode: z.string()
      .length(6, { message: "Le code de vérification doit contenir exactement 6 chiffres" })
      .regex(/^\d{6}$/, { message: "Le code de vérification doit contenir uniquement des chiffres" })
      .optional()
  });

  // Nouveau : Schéma pour la modification du nom/prénom utilisateur
  static changeNameSchema = z.object({
    firstName: this.firstName,
    lastName: this.lastName,
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis pour modifier vos informations personnelles" })
  });

  // Nouveau : Schéma pour la modification du profil utilisateur (sans mot de passe)
  static updateProfileSchema = z.object({
    firstName: this.firstName,
    lastName: this.lastName,
    bio: z.string().max(500, "La biographie ne peut pas dépasser 500 caractères").optional(),
    username: this.username.optional()
  });

  // Schéma pour le formulaire de candidature auteur
  static authorApplicationSchema = z.object({
    authorName: this.authorName,
    reason: this.authorMotivation,
    socialLinks: z.object({
      website: this.socialUrl,
      twitter: this.socialUrl,
      instagram: this.socialUrl
    }).optional(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "Vous devez accepter les conditions d'utilisation"
    })
  });

  // Nouveau : Schéma pour la validation d'heure (HH:MM)
  static timeSchema = z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Format d'heure invalide. Utilisez HH:MM (ex: 14:30)"
    })
    .refine(value => {
      const [hours, minutes] = value.split(':').map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }, {
      message: "Heure invalide. Les heures doivent être entre 00-23 et les minutes entre 00-59"
    });

  // Nouveau : Schéma pour la validation de code de vérification (6 chiffres)
  static verificationCodeSchema = z
    .string()
    .length(6, { message: "Le code de vérification doit contenir exactement 6 chiffres" })
    .regex(/^\d{6}$/, { message: "Le code de vérification doit contenir uniquement des chiffres" });

  // Nouveau : Schéma pour la validation d'un digit unique (0-9)
  static digitSchema = z
    .string()
    .length(1, { message: "Doit être un seul caractère" })
    .regex(/^\d$/, { message: "Doit être un chiffre entre 0 et 9" });

  // Nouveau : Schéma pour la validation de titre de chapitre
  static chapterTitleSchema = z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères" })
    .max(200, { message: "Le titre ne peut pas dépasser 200 caractères" })
    .trim()
    .refine(value => value.length > 0, {
      message: "Le titre ne peut pas être vide"
    });

  // Nouveau : Schéma pour la validation de contenu de chapitre
  static chapterContentSchema = z
    .string()
    .min(100, { message: "Le contenu doit contenir au moins 100 caractères" })
    .max(50000, { message: "Le contenu ne peut pas dépasser 50 000 caractères" })
    .trim()
    .refine(value => value.length >= 100, {
      message: "Le contenu doit contenir au moins 100 caractères significatifs"
    });

  // Nouveau : Schéma pour la validation de numéro de chapitre
  static chapterNumberSchema = z
    .number()
    .int({ message: "Le numéro de chapitre doit être un nombre entier" })
    .positive({ message: "Le numéro de chapitre doit être positif" })
    .max(9999, { message: "Le numéro de chapitre ne peut pas dépasser 9999" });

  // Nouveau : Schéma complet pour l'édition de chapitre (sans références circulaires)
  static chapterEditSchema = z.object({
    chapterNumber: z.number()
      .int({ message: "Le numéro de chapitre doit être un nombre entier" })
      .positive({ message: "Le numéro de chapitre doit être positif" })
      .max(9999, { message: "Le numéro de chapitre ne peut pas dépasser 9999" }),
    title: z.string()
      .min(3, { message: "Le titre doit contenir au moins 3 caractères" })
      .max(200, { message: "Le titre ne peut pas dépasser 200 caractères" })
      .trim()
      .refine(value => value.length > 0, {
        message: "Le titre ne peut pas être vide"
      }),
    content: z.string()
      .min(100, { message: "Le contenu doit contenir au moins 100 caractères" })
      .max(50000, { message: "Le contenu ne peut pas dépasser 50 000 caractères" })
      .trim()
      .refine(value => value.length >= 100, {
        message: "Le contenu doit contenir au moins 100 caractères significatifs"
      }),
    comment: z.string().max(1000, { message: "Le commentaire ne peut pas dépasser 1000 caractères" }).optional(),
    isVerified: z.boolean().optional()
  });

  // Nouveau : Schéma pour la validation de recherche
  static searchQuerySchema = z
    .string()
    .min(1, { message: "La recherche ne peut pas être vide" })
    .max(500, { message: "La recherche ne peut pas dépasser 500 caractères" })
    .trim()
    .refine(value => value.length > 0, {
      message: "La recherche doit contenir au moins un caractère"
    });

  // Nouveau : Schéma pour la validation de nom de fichier sécurisé
  static fileNameSchema = z
    .string()
    .min(1, { message: "Le nom de fichier ne peut pas être vide" })
    .max(255, { message: "Le nom de fichier ne peut pas dépasser 255 caractères" })
    .regex(/^[a-zA-Z0-9._-]+\.(jpeg|jpg|png|gif|webp)$/i, {
      message: "Nom de fichier invalide. Utilisez uniquement des lettres, chiffres, points, tirets et underscores avec une extension valide"
    })
    .refine(value => !value.includes('..'), {
      message: "Le nom de fichier ne peut pas contenir '..' pour des raisons de sécurité"
    })
    .refine(value => {
      const dangerousNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;
      return !dangerousNames.test(value);
    }, {
      message: "Nom de fichier réservé par le système non autorisé"
    });

  // Nouveau : Schéma pour la validation de date/heure combinée
  static dateTimeSchema = z.object({
    date: z.date({ message: "Date invalide" }),
    time: z.string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Format d'heure invalide. Utilisez HH:MM (ex: 14:30)"
      })
      .refine(value => {
        const [hours, minutes] = value.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, {
        message: "Heure invalide. Les heures doivent être entre 00-23 et les minutes entre 00-59"
      })
      .optional()
  }).refine(data => {
    if (data.time) {
      const [hours, minutes] = data.time.split(':').map(Number);
      const dateTime = new Date(data.date);
      dateTime.setHours(hours, minutes, 0, 0);
      return dateTime > new Date();
    }
    return true;
  }, {
    message: "La date et l'heure doivent être dans le futur"
  });

  // Nouveau : Schéma pour la validation de pagination
  static paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  });

  // Fonction pour analyser un mot de passe et retourner les erreurs spécifiques
  static analyzePassword(password) {
    if (!password || typeof password !== 'string') {
      return { success: false, error: "Veuillez saisir un mot de passe" };
    }

    const errors = [];
    const missing = [];

    // Vérifier la longueur
    if (password.length < 8) {
      missing.push("caractères supplémentaires");
      errors.push(`Ajoutez ${8 - password.length} caractère(s) supplémentaire(s)`);
    }

    // Vérifier les lettres minuscules
    if (!/[a-z]/.test(password)) {
      missing.push("lettre minuscule");
      errors.push("Ajoutez au moins une lettre minuscule (a-z)");
    }

    // Vérifier les lettres majuscules
    if (!/[A-Z]/.test(password)) {
      missing.push("lettre majuscule");
      errors.push("Ajoutez au moins une lettre majuscule (A-Z)");
    }

    // Vérifier les chiffres
    if (!/\d/.test(password)) {
      missing.push("chiffre");
      errors.push("Ajoutez au moins un chiffre (0-9)");
    }

    // Vérifier les caractères spéciaux
    if (!/[@$!%*?&]/.test(password)) {
      missing.push("caractère spécial");
      errors.push("Ajoutez au moins un caractère spécial (@$!%*?&)");
    }

    // Si aucune erreur, mot de passe valide
    if (errors.length === 0) {
      return { success: true };
    }

    // Créer un message personnalisé selon ce qui manque
    let message;
    if (errors.length === 1) {
      message = errors[0];
    } else if (errors.length === 2) {
      message = `${errors[0]} et ${errors[1].toLowerCase()}`;
    } else {
      const lastError = errors.pop();
      message = `${errors.join(", ")} et ${lastError.toLowerCase()}`;
    }

    return {
      success: false,
      error: message,
      missing: missing,
      detailedErrors: errors
    };
  }

  // Fonction pour valider un champ spécifique avec analyse dynamique
  static validateField(field, value) {
    try {
      if (field === 'username') {
        this.username.parse(value);
      } else if (field === 'email') {
        this.email.parse(value);
      } else if (field === 'password') {
        // Utilisation du schéma Zod standard pour la cohérence
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
      } else if (formType === 'changePassword') {
        this.changePasswordSchema.parse(data);
      } else if (formType === 'changeEmail') {
        this.changeEmailSchema.parse(data);
      } else if (formType === 'changeName') {
        this.changeNameSchema.parse(data);
      } else if (formType === 'updateProfile') {
        this.updateProfileSchema.parse(data);
      } else if (formType === 'authorApplication') {
        this.authorApplicationSchema.parse(data);
      } else if (formType === 'chapterEdit') {
        this.chapterEditSchema.parse(data);
      } else if (formType === 'adminUserEdit') {
        this.adminUserEditSchema.parse(data);
      } else if (formType === 'contentManagement') {
        this.contentManagementSchema.parse(data);
      }
      return { success: true };
    } catch (error) {
      const errors = {};
      
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      
      return { 
        success: false, 
        errors 
      };
    }
  }

  // Nouvelle fonction : Valider un code de vérification
  static validateVerificationCode(code) {
    try {
      this.verificationCodeSchema.parse(code);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Code de vérification invalide" 
      };
    }
  }

  // Nouvelle fonction : Valider une heure
  static validateTime(time) {
    try {
      this.timeSchema.parse(time);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Format d'heure invalide" 
      };
    }
  }

  // Nouvelle fonction : Valider un nom de fichier
  static validateFileName(fileName) {
    try {
      this.fileNameSchema.parse(fileName);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Nom de fichier invalide" 
      };
    }
  }

  // Nouvelle fonction : Valider une requête de recherche
  static validateSearchQuery(query) {
    try {
      this.searchQuerySchema.parse(query);
      return { success: true, query: query.trim() };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Recherche invalide" 
      };
    }
  }

  // Nouvelle fonction : Valider des paramètres de pagination
  static validatePagination(params) {
    try {
      const validated = this.paginationSchema.parse(params);
      return { success: true, data: validated };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Paramètres de pagination invalides" 
      };
    }
  }

  // Nouvelle fonction : Valider un chapitre complet
  static validateChapter(chapterData) {
    try {
      // Convertir chapterNumber en nombre si c'est une chaîne
      const dataToValidate = {
        ...chapterData,
        chapterNumber: typeof chapterData.chapterNumber === 'string' 
          ? parseInt(chapterData.chapterNumber) || 0 
          : chapterData.chapterNumber
      };
      
      const validated = this.chapterEditSchema.parse(dataToValidate);
      return { success: true, data: validated };
    } catch (error) {
      const errors = {};
      
      error.errors.forEach(err => {
        const fieldName = err.path[0];
        if (!errors[fieldName]) {
          errors[fieldName] = err.message;
        }
      });
      
      return { 
        success: false, 
        errors 
      };
    }
  }

  // Fonction utilitaire pour valider en temps réel
  static validateFieldLive(schema, value) {
    try {
      schema.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || "Valeur invalide" 
      };
    }
  }

  // Nouveau : Schéma pour l'édition de profil utilisateur côté admin
  static adminUserEditSchema = z.object({
    firstName: z.string()
      .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
      .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères" })
      .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes" })
      .optional(),
    lastName: z.string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
      .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" })
      .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes" })
      .optional(),
    email: z.string()
      .email({ message: "Format d'email invalide" })
      .min(5, { message: "L'email doit contenir au moins 5 caractères" })
      .max(100, { message: "L'email ne peut pas dépasser 100 caractères" }),
    bio: z.string().max(500, "La biographie ne peut pas dépasser 500 caractères").optional(),
    status: z.enum(['active', 'inactive', 'suspended'], {
      errorMap: () => ({ message: "Statut invalide" })
    }),
    roles: z.array(z.string()).min(1, "Au moins un rôle doit être sélectionné"),
    verifiedAt: z.string().nullable().optional(),
    lastLoginAt: z.string().nullable().optional()
  });

  // Nouveau : Schéma pour la validation du mot de passe admin (suppression utilisateur)
  static adminPasswordConfirmSchema = z.object({
    password: z.string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
      })
  });

  // Nouveau : Schéma pour la gestion de contenu (romans/nouvelles)
  static contentManagementSchema = z.object({
    title: z.string()
      .min(1, "Le titre est requis")
      .max(200, "Le titre ne peut pas dépasser 200 caractères")
      .trim(),
    description: z.string()
      .max(2000, "La description ne peut pas dépasser 2000 caractères")
      .optional(),
    categories: z.array(z.string()).min(1, "Au moins une catégorie doit être sélectionnée"),
    status: z.enum(['pending', 'accepted', 'rejected', 'published'], {
      errorMap: () => ({ message: "Statut invalide" })
    }),
    authorId: z.number().positive("Un auteur doit être sélectionné"),
    isVerified: z.boolean(),
    isCompleted: z.boolean().optional(),
    chapterCount: z.number().min(0, "Le nombre de chapitres ne peut pas être négatif").optional(),
    comment: z.string().max(1000, "Le commentaire ne peut pas dépasser 1000 caractères").optional()
  });

  // Nouveau : Schéma pour les actions rapides (accepter/refuser)
  static quickActionSchema = z.object({
    actionType: z.enum(['accept', 'reject', 'publish', 'unpublish'], {
      errorMap: () => ({ message: "Type d'action invalide" })
    }),
    reason: z.string().min(1, "La raison est requise").max(500, "La raison ne peut pas dépasser 500 caractères").optional()
  }).refine((data) => {
    // La raison est obligatoire pour les refus et dépublications
    if ((data.actionType === 'reject' || data.actionType === 'unpublish') && !data.reason) {
      return false;
    }
    return true;
  }, {
    message: "La raison est obligatoire pour cette action",
    path: ["reason"]
  });

  // Nouveau : Schéma pour les filtres de recherche admin
  static adminFilterSchema = z.object({
    searchTerm: z.string().max(100, "Le terme de recherche ne peut pas dépasser 100 caractères").optional(),
    status: z.string().optional(),
    role: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    sortBy: z.enum(['name', 'email', 'createdAt', 'lastLoginAt', 'status'], {
      errorMap: () => ({ message: "Critère de tri invalide" })
    }).optional(),
    sortOrder: z.enum(['asc', 'desc'], {
      errorMap: () => ({ message: "Ordre de tri invalide" })
    }).optional()
  });

  // Nouveau : Schéma pour la validation des heures de filtre
  static timeFilterSchema = z.object({
    timeFrom: z.string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Format d'heure invalide. Utilisez HH:MM (ex: 14:30)"
      })
      .refine(value => {
        const [hours, minutes] = value.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, {
        message: "Heure invalide. Les heures doivent être entre 00-23 et les minutes entre 00-59"
      })
      .optional(),
    timeTo: z.string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Format d'heure invalide. Utilisez HH:MM (ex: 14:30)"
      })
      .refine(value => {
        const [hours, minutes] = value.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, {
        message: "Heure invalide. Les heures doivent être entre 00-23 et les minutes entre 00-59"
      })
      .optional()
  }).refine((data) => {
    if (data.timeFrom && data.timeTo) {
      const [fromHours, fromMinutes] = data.timeFrom.split(':').map(Number);
      const [toHours, toMinutes] = data.timeTo.split(':').map(Number);
      const fromTime = fromHours * 60 + fromMinutes;
      const toTime = toHours * 60 + toMinutes;
      return fromTime < toTime;
    }
    return true;
  }, {
    message: "L'heure de début doit être antérieure à l'heure de fin",
    path: ["timeTo"]
  });

  // Nouveau : Schéma pour l'upload d'images
  static imageUploadSchema = z.object({
    file: z.instanceof(File, { message: "Un fichier valide est requis" }),
    maxSize: z.number().optional().default(10 * 1024 * 1024), // 10MB par défaut
    allowedTypes: z.array(z.string()).optional().default(['image/jpeg', 'image/png', 'image/webp'])
  }).refine((data) => {
    return data.file.size <= data.maxSize;
  }, {
    message: "La taille du fichier dépasse la limite autorisée",
    path: ["file"]
  }).refine((data) => {
    return data.allowedTypes.includes(data.file.type);
  }, {
    message: "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP",
    path: ["file"]
  });

  // Fonction pour valider les uploads d'images
  static validateImageUpload(file, maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
    try {
      this.imageUploadSchema.parse({ file, maxSize, allowedTypes });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Fichier invalide'
      };
    }
  }

  // Fonction pour valider les actions rapides admin
  static validateQuickAction(actionType, reason = '') {
    try {
      this.quickActionSchema.parse({ actionType, reason });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {})
      };
    }
  }

  // Fonction pour valider les filtres admin
  static validateAdminFilters(filters) {
    try {
      this.adminFilterSchema.parse(filters);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {})
      };
    }
  }
}
