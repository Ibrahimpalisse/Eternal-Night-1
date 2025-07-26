 -- =====================================================
-- DATABASE STRUCTURE FOR NIGHT NOVELS APPLICATION
-- =====================================================
-- Analyse complète basée sur le frontend React
-- Structure moderne et sécurisée pour une plateforme de lecture
-- =====================================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS `night-novels` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `night-novels`;

-- =====================================================
-- 1. TABLES DE BASE - UTILISATEURS ET AUTHENTIFICATION
-- =====================================================

-- Table des utilisateurs principaux
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nom complet de l\'utilisateur',
  `username` VARCHAR(100) UNIQUE COMMENT 'Nom d\'utilisateur unique (optionnel)',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email de connexion',
  `password` VARCHAR(255) NOT NULL COMMENT 'Mot de passe hashé',
  `avatar_url` VARCHAR(500) COMMENT 'URL de l\'avatar utilisateur (S3/CDN)',
  `bio` TEXT COMMENT 'Biographie de l\'utilisateur',
  `status` ENUM('active', 'blocked', 'suspended', 'deleted') DEFAULT 'active' COMMENT 'Statut du compte',
  `email_verified_at` TIMESTAMP NULL COMMENT 'Date de vérification de l\'email',
  `last_login_at` TIMESTAMP NULL COMMENT 'Dernière connexion',
  `last_activity_at` TIMESTAMP NULL COMMENT 'Dernière activité',
  `preferences` JSON COMMENT 'Préférences utilisateur (thème, notifications, etc.)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_email` (`email`),
  INDEX `idx_username` (`username`),
  INDEX `idx_status` (`status`),
  INDEX `idx_last_activity` (`last_activity_at`)
) ENGINE=InnoDB COMMENT='Table principale des utilisateurs';

-- Table de vérification et sécurité
CREATE TABLE `user_verifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `email_verification_code` VARCHAR(6) COMMENT 'Code de vérification email',
  `email_verification_expires` DATETIME COMMENT 'Expiration du code email',
  `is_email_verified` BOOLEAN DEFAULT FALSE COMMENT 'Email vérifié',
  `password_reset_token` VARCHAR(255) COMMENT 'Token de réinitialisation mot de passe',
  `password_reset_code` VARCHAR(6) COMMENT 'Code de réinitialisation mot de passe',
  `password_reset_expires` DATETIME COMMENT 'Expiration reset password',
  `email_change_code` VARCHAR(6) COMMENT 'Code de changement d\'email',
  `email_change_expires` TIMESTAMP NULL COMMENT 'Expiration changement email',
  `pending_email` VARCHAR(255) COMMENT 'Nouvel email en attente de validation',
  `two_factor_enabled` BOOLEAN DEFAULT FALSE COMMENT 'Authentification 2FA activée',
  `two_factor_secret` VARCHAR(255) COMMENT 'Secret 2FA',
  `backup_codes` JSON COMMENT 'Codes de sauvegarde 2FA',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_verification` (`user_id`)
) ENGINE=InnoDB COMMENT='Table de vérification et sécurité des comptes';

-- Table des rôles
CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nom du rôle (user, author, admin, etc.)',
  `display_name` VARCHAR(100) NOT NULL COMMENT 'Nom affiché du rôle',
  `description` TEXT COMMENT 'Description du rôle',
  `permissions` JSON COMMENT 'Permissions spécifiques du rôle',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Rôle actif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_role_name` (`name`)
) ENGINE=InnoDB COMMENT='Table des rôles système';

-- Table pivot utilisateur-rôle
CREATE TABLE `user_roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  `assigned_by` INT UNSIGNED COMMENT 'Qui a assigné ce rôle',
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date d\'assignation',
  `expires_at` TIMESTAMP NULL COMMENT 'Date d\'expiration du rôle (optionnel)',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Rôle actif',
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_user_role` (`user_id`, `role_id`),
  INDEX `idx_user_roles` (`user_id`, `role_id`)
) ENGINE=InnoDB COMMENT='Association utilisateurs-rôles';

-- =====================================================
-- 2. TABLES AUTEURS ET CANDIDATURES
-- =====================================================

-- Table des auteurs
CREATE TABLE `authors` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `pen_name` VARCHAR(100) NOT NULL COMMENT 'Nom de plume de l\'auteur',
  `bio` TEXT COMMENT 'Biographie de l\'auteur',
  `website_url` VARCHAR(500) COMMENT 'Site web personnel',
  `social_links` JSON COMMENT 'Liens réseaux sociaux (Twitter, Instagram, etc.)',
  `status` ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending' COMMENT 'Statut de la candidature',
  `specialties` JSON COMMENT 'Spécialités littéraires de l\'auteur',
  `writing_experience` TEXT COMMENT 'Expérience d\'écriture',
  `approved_at` TIMESTAMP NULL COMMENT 'Date d\'approbation',
  `approved_by` INT UNSIGNED COMMENT 'Admin qui a approuvé',
  `rejection_reason` TEXT COMMENT 'Raison du rejet',
  `suspension_reason` TEXT COMMENT 'Raison de la suspension',
  `suspended_until` TIMESTAMP NULL COMMENT 'Date de fin de suspension',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_author_status` (`status`),
  INDEX `idx_author_user` (`user_id`)
) ENGINE=InnoDB COMMENT='Table des auteurs approuvés et candidatures';

-- Historique des candidatures d'auteur
CREATE TABLE `author_application_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_id` INT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'suspended') NOT NULL,
  `reason` TEXT COMMENT 'Raison du changement de statut',
  `processed_by` INT UNSIGNED COMMENT 'Admin qui a traité',
  `notes` TEXT COMMENT 'Notes internes',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`processed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_application_history` (`author_id`, `created_at`)
) ENGINE=InnoDB COMMENT='Historique des candidatures et changements de statut';

-- =====================================================
-- 3. TABLES CONTENU - ROMANS ET CATÉGORIES
-- =====================================================

-- Table des catégories
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nom de la catégorie',
  `slug` VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL-friendly name',
  `description` TEXT COMMENT 'Description de la catégorie',
  `color` VARCHAR(7) COMMENT 'Couleur hex pour l\'UI',
  `icon` VARCHAR(50) COMMENT 'Icône représentative',
  `parent_id` INT UNSIGNED COMMENT 'Catégorie parente (pour sous-catégories)',
  `sort_order` INT DEFAULT 0 COMMENT 'Ordre d\'affichage',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Catégorie active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  INDEX `idx_category_slug` (`slug`),
  INDEX `idx_category_parent` (`parent_id`)
) ENGINE=InnoDB COMMENT='Catégories et genres littéraires';

-- Table des tags
CREATE TABLE `tags` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nom du tag',
  `slug` VARCHAR(50) NOT NULL UNIQUE COMMENT 'URL-friendly name',
  `description` TEXT COMMENT 'Description du tag',
  `usage_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre d\'utilisations',
  `is_featured` BOOLEAN DEFAULT FALSE COMMENT 'Tag mis en avant',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_tag_slug` (`slug`),
  INDEX `idx_tag_usage` (`usage_count` DESC)
) ENGINE=InnoDB COMMENT='Tags pour classification fine du contenu';

-- Table des romans/novels
CREATE TABLE `novels` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT 'Titre du roman',
  `slug` VARCHAR(255) NOT NULL UNIQUE COMMENT 'URL-friendly title',
  `description` TEXT COMMENT 'Synopsis/description',
  `cover_image_url` VARCHAR(500) COMMENT 'URL de l\'image de couverture',
  `status` ENUM('draft', 'pending', 'published', 'completed', 'hiatus', 'dropped') DEFAULT 'draft' COMMENT 'Statut de publication',
  `visibility` ENUM('public', 'private', 'subscribers_only') DEFAULT 'public' COMMENT 'Visibilité du roman',
  `content_rating` ENUM('everyone', 'teen', 'mature', 'adult') DEFAULT 'everyone' COMMENT 'Classification du contenu',
  `language` VARCHAR(10) DEFAULT 'fr' COMMENT 'Langue du contenu',
  `word_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre total de mots',
  `chapter_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de chapitres',
  `view_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de vues',
  `like_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de likes',
  `bookmark_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de favoris',
  `comment_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de commentaires',
  `rating_average` DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Note moyenne (0.00-5.00)',
  `rating_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre d\'évaluations',
  `is_featured` BOOLEAN DEFAULT FALSE COMMENT 'Roman mis en avant',
  `is_completed` BOOLEAN DEFAULT FALSE COMMENT 'Roman terminé',
  `published_at` TIMESTAMP NULL COMMENT 'Date de première publication',
  `completed_at` TIMESTAMP NULL COMMENT 'Date de completion',
  `last_chapter_at` TIMESTAMP NULL COMMENT 'Date du dernier chapitre',
  `seo_title` VARCHAR(255) COMMENT 'Titre SEO',
  `seo_description` TEXT COMMENT 'Description SEO',
  `seo_keywords` TEXT COMMENT 'Mots-clés SEO',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE CASCADE,
  INDEX `idx_novel_author` (`author_id`),
  INDEX `idx_novel_status` (`status`),
  INDEX `idx_novel_slug` (`slug`),
  INDEX `idx_novel_popularity` (`view_count` DESC, `like_count` DESC),
  INDEX `idx_novel_published` (`published_at` DESC),
  FULLTEXT KEY `ft_novel_content` (`title`, `description`)
) ENGINE=InnoDB COMMENT='Table des romans/histoires';

-- Table pivot novel-catégories
CREATE TABLE `novel_categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `novel_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE COMMENT 'Catégorie principale',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`novel_id`) REFERENCES `novels`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_novel_category` (`novel_id`, `category_id`),
  INDEX `idx_novel_categories` (`novel_id`, `category_id`)
) ENGINE=InnoDB COMMENT='Association romans-catégories';

-- Table pivot novel-tags
CREATE TABLE `novel_tags` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `novel_id` INT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`novel_id`) REFERENCES `novels`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_novel_tag` (`novel_id`, `tag_id`),
  INDEX `idx_novel_tags` (`novel_id`, `tag_id`)
) ENGINE=InnoDB COMMENT='Association romans-tags';

-- =====================================================
-- 4. TABLES CHAPITRES ET CONTENU
-- =====================================================

-- Table des chapitres
CREATE TABLE `chapters` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `novel_id` INT UNSIGNED NOT NULL,
  `chapter_number` INT UNSIGNED NOT NULL COMMENT 'Numéro du chapitre',
  `title` VARCHAR(255) NOT NULL COMMENT 'Titre du chapitre',
  `slug` VARCHAR(255) NOT NULL COMMENT 'URL-friendly title',
  `content` LONGTEXT COMMENT 'Contenu du chapitre',
  `summary` TEXT COMMENT 'Résumé du chapitre',
  `word_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de mots',
  `status` ENUM('draft', 'pending', 'published', 'scheduled') DEFAULT 'draft' COMMENT 'Statut de publication',
  `visibility` ENUM('public', 'subscribers_only', 'premium') DEFAULT 'public' COMMENT 'Visibilité du chapitre',
  `view_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de vues',
  `like_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de likes',
  `comment_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de commentaires',
  `reading_time` INT UNSIGNED COMMENT 'Temps de lecture estimé (minutes)',
  `is_free` BOOLEAN DEFAULT TRUE COMMENT 'Chapitre gratuit',
  `price` DECIMAL(8,2) COMMENT 'Prix si payant',
  `published_at` TIMESTAMP NULL COMMENT 'Date de publication',
  `scheduled_at` TIMESTAMP NULL COMMENT 'Date de publication programmée',
  `seo_title` VARCHAR(255) COMMENT 'Titre SEO',
  `seo_description` TEXT COMMENT 'Description SEO',
  `author_notes` TEXT COMMENT 'Notes de l\'auteur',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`novel_id`) REFERENCES `novels`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_novel_chapter` (`novel_id`, `chapter_number`),
  INDEX `idx_chapter_novel` (`novel_id`),
  INDEX `idx_chapter_status` (`status`),
  INDEX `idx_chapter_published` (`published_at` DESC),
  INDEX `idx_chapter_number` (`novel_id`, `chapter_number`),
  FULLTEXT KEY `ft_chapter_content` (`title`, `content`, `summary`)
) ENGINE=InnoDB COMMENT='Table des chapitres';

-- Table de modération des chapitres
CREATE TABLE `chapter_moderations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `chapter_id` INT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'needs_revision') DEFAULT 'pending',
  `moderator_id` INT UNSIGNED COMMENT 'Modérateur qui a traité',
  `feedback` TEXT COMMENT 'Commentaires du modérateur',
  `moderated_at` TIMESTAMP NULL COMMENT 'Date de modération',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_chapter_moderation` (`chapter_id`, `status`)
) ENGINE=InnoDB COMMENT='Modération des chapitres';

-- =====================================================
-- 5. TABLES INTERACTIONS UTILISATEURS
-- =====================================================

-- Table des likes/favoris
CREATE TABLE `user_likes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `likeable_type` ENUM('novel', 'chapter', 'comment', 'post') NOT NULL COMMENT 'Type de contenu liké',
  `likeable_id` INT UNSIGNED NOT NULL COMMENT 'ID du contenu liké',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_like` (`user_id`, `likeable_type`, `likeable_id`),
  INDEX `idx_likes_content` (`likeable_type`, `likeable_id`),
  INDEX `idx_likes_user` (`user_id`)
) ENGINE=InnoDB COMMENT='Système de likes/favoris';

-- Table des favoris/bookmarks
CREATE TABLE `user_bookmarks` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `bookmarkable_type` ENUM('novel', 'chapter') NOT NULL COMMENT 'Type de contenu en favori',
  `bookmarkable_id` INT UNSIGNED NOT NULL COMMENT 'ID du contenu en favori',
  `folder_name` VARCHAR(100) COMMENT 'Nom du dossier de classement',
  `notes` TEXT COMMENT 'Notes personnelles',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_bookmark` (`user_id`, `bookmarkable_type`, `bookmarkable_id`),
  INDEX `idx_bookmarks_content` (`bookmarkable_type`, `bookmarkable_id`),
  INDEX `idx_bookmarks_user` (`user_id`)
) ENGINE=InnoDB COMMENT='Système de favoris/bookmarks';

-- Table de suivi de lecture
CREATE TABLE `reading_progress` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `novel_id` INT UNSIGNED NOT NULL,
  `chapter_id` INT UNSIGNED COMMENT 'Dernier chapitre lu',
  `progress_percentage` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Progression en % du chapitre',
  `last_read_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reading_time_seconds` INT UNSIGNED DEFAULT 0 COMMENT 'Temps de lecture total',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`novel_id`) REFERENCES `novels`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_user_novel_progress` (`user_id`, `novel_id`),
  INDEX `idx_reading_progress` (`user_id`, `last_read_at` DESC)
) ENGINE=InnoDB COMMENT='Suivi de progression de lecture';

-- Table des évaluations/ratings
CREATE TABLE `user_ratings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `novel_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL COMMENT 'Note de 1 à 5',
  `review` TEXT COMMENT 'Commentaire de review',
  `is_verified_reader` BOOLEAN DEFAULT FALSE COMMENT 'Lecteur vérifié (a lu au moins X chapitres)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`novel_id`) REFERENCES `novels`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_novel_rating` (`user_id`, `novel_id`),
  INDEX `idx_ratings_novel` (`novel_id`, `rating` DESC),
  CHECK (`rating` >= 1 AND `rating` <= 5)
) ENGINE=InnoDB COMMENT='Évaluations et reviews des romans';

-- =====================================================
-- 6. SYSTÈME DE COMMENTAIRES
-- =====================================================

-- Table des commentaires
CREATE TABLE `comments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `commentable_type` ENUM('novel', 'chapter', 'post') NOT NULL COMMENT 'Type de contenu commenté',
  `commentable_id` INT UNSIGNED NOT NULL COMMENT 'ID du contenu commenté',
  `parent_id` INT UNSIGNED COMMENT 'ID du commentaire parent (pour réponses)',
  `content` TEXT NOT NULL COMMENT 'Contenu du commentaire',
  `status` ENUM('published', 'pending', 'hidden', 'deleted') DEFAULT 'published' COMMENT 'Statut du commentaire',
  `like_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de likes',
  `reply_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de réponses',
  `is_spoiler` BOOLEAN DEFAULT FALSE COMMENT 'Contient des spoilers',
  `is_pinned` BOOLEAN DEFAULT FALSE COMMENT 'Commentaire épinglé',
  `edited_at` TIMESTAMP NULL COMMENT 'Date de dernière modification',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE,
  INDEX `idx_comments_content` (`commentable_type`, `commentable_id`),
  INDEX `idx_comments_parent` (`parent_id`),
  INDEX `idx_comments_user` (`user_id`),
  INDEX `idx_comments_status` (`status`),
  FULLTEXT KEY `ft_comment_content` (`content`)
) ENGINE=InnoDB COMMENT='Système de commentaires universel';

-- =====================================================
-- 7. SYSTÈME DE SIGNALEMENTS ET MODÉRATION
-- =====================================================

-- Table des signalements
CREATE TABLE `reports` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `reporter_id` INT UNSIGNED NOT NULL COMMENT 'Utilisateur qui signale',
  `reported_type` ENUM('novel', 'chapter', 'comment', 'post', 'user') NOT NULL COMMENT 'Type de contenu signalé',
  `reported_id` INT UNSIGNED NOT NULL COMMENT 'ID du contenu signalé',
  `reported_user_id` INT UNSIGNED COMMENT 'Utilisateur propriétaire du contenu',
  `reason` ENUM('harassment', 'spoiler', 'spam', 'inappropriate', 'copyright', 'violence', 'adult_content', 'fake_content', 'other') NOT NULL COMMENT 'Raison du signalement',
  `description` TEXT COMMENT 'Description détaillée',
  `status` ENUM('pending', 'in_review', 'resolved', 'dismissed') DEFAULT 'pending' COMMENT 'Statut du signalement',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium' COMMENT 'Priorité de traitement',
  `moderator_id` INT UNSIGNED COMMENT 'Modérateur assigné',
  `resolution` TEXT COMMENT 'Résolution prise',
  `resolved_at` TIMESTAMP NULL COMMENT 'Date de résolution',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reported_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_reports_content` (`reported_type`, `reported_id`),
  INDEX `idx_reports_status` (`status`, `priority`),
  INDEX `idx_reports_moderator` (`moderator_id`)
) ENGINE=InnoDB COMMENT='Système de signalements et modération';

-- Table des actions de modération
CREATE TABLE `moderation_actions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `moderator_id` INT UNSIGNED NOT NULL,
  `target_type` ENUM('user', 'novel', 'chapter', 'comment', 'post') NOT NULL COMMENT 'Type de cible',
  `target_id` INT UNSIGNED NOT NULL COMMENT 'ID de la cible',
  `action` ENUM('warn', 'hide', 'delete', 'ban', 'unban', 'approve', 'reject') NOT NULL COMMENT 'Action effectuée',
  `reason` TEXT NOT NULL COMMENT 'Raison de l\'action',
  `duration` INT COMMENT 'Durée en heures (pour ban temporaire)',
  `report_id` INT UNSIGNED COMMENT 'Signalement lié',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON DELETE SET NULL,
  INDEX `idx_moderation_target` (`target_type`, `target_id`),
  INDEX `idx_moderation_moderator` (`moderator_id`)
) ENGINE=InnoDB COMMENT='Historique des actions de modération';

-- =====================================================
-- 8. SYSTÈME DE POSTS/ACTUALITÉS AUTEURS
-- =====================================================

-- Table des posts d'auteurs
CREATE TABLE `author_posts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT 'Titre du post',
  `content` LONGTEXT NOT NULL COMMENT 'Contenu du post',
  `type` ENUM('announcement', 'update', 'general', 'poll') DEFAULT 'general' COMMENT 'Type de post',
  `status` ENUM('draft', 'published', 'scheduled') DEFAULT 'draft' COMMENT 'Statut de publication',
  `visibility` ENUM('public', 'subscribers_only') DEFAULT 'public' COMMENT 'Visibilité du post',
  `image_url` VARCHAR(500) COMMENT 'Image d\'illustration',
  `view_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de vues',
  `like_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de likes',
  `comment_count` INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de commentaires',
  `is_pinned` BOOLEAN DEFAULT FALSE COMMENT 'Post épinglé',
  `published_at` TIMESTAMP NULL COMMENT 'Date de publication',
  `scheduled_at` TIMESTAMP NULL COMMENT 'Date de publication programmée',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE CASCADE,
  INDEX `idx_posts_author` (`author_id`),
  INDEX `idx_posts_status` (`status`),
  INDEX `idx_posts_published` (`published_at` DESC),
  FULLTEXT KEY `ft_post_content` (`title`, `content`)
) ENGINE=InnoDB COMMENT='Posts et actualités des auteurs';

-- =====================================================
-- 9. SYSTÈME D\'ABONNEMENTS ET NOTIFICATIONS
-- =====================================================

-- Table des abonnements aux auteurs
CREATE TABLE `user_subscriptions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `notification_types` JSON COMMENT 'Types de notifications souhaitées',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Abonnement actif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_author_subscription` (`user_id`, `author_id`),
  INDEX `idx_subscriptions_author` (`author_id`)
) ENGINE=InnoDB COMMENT='Abonnements aux auteurs';

-- Table des notifications
CREATE TABLE `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('new_chapter', 'author_post', 'comment_reply', 'like', 'follow', 'system', 'moderation') NOT NULL COMMENT 'Type de notification',
  `title` VARCHAR(255) NOT NULL COMMENT 'Titre de la notification',
  `message` TEXT COMMENT 'Message de la notification',
  `data` JSON COMMENT 'Données additionnelles (IDs, liens, etc.)',
  `is_read` BOOLEAN DEFAULT FALSE COMMENT 'Notification lue',
  `priority` ENUM('low', 'normal', 'high') DEFAULT 'normal' COMMENT 'Priorité d\'affichage',
  `expires_at` TIMESTAMP NULL COMMENT 'Date d\'expiration de la notification',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_notifications_user` (`user_id`, `is_read`),
  INDEX `idx_notifications_type` (`type`),
  INDEX `idx_notifications_created` (`created_at` DESC)
) ENGINE=InnoDB COMMENT='Système de notifications';

-- =====================================================
-- 10. STATISTIQUES ET ANALYTICS
-- =====================================================

-- Table des vues/consultations
CREATE TABLE `view_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED COMMENT 'Utilisateur (null si anonyme)',
  `viewable_type` ENUM('novel', 'chapter', 'post') NOT NULL COMMENT 'Type de contenu vu',
  `viewable_id` INT UNSIGNED NOT NULL COMMENT 'ID du contenu vu',
  `ip_address` VARCHAR(45) COMMENT 'Adresse IP du visiteur',
  `user_agent` TEXT COMMENT 'User agent du navigateur',
  `referrer` VARCHAR(500) COMMENT 'Page de provenance',
  `session_id` VARCHAR(100) COMMENT 'ID de session',
  `view_duration` INT UNSIGNED COMMENT 'Durée de consultation en secondes',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_views_content` (`viewable_type`, `viewable_id`),
  INDEX `idx_views_user` (`user_id`),
  INDEX `idx_views_date` (`created_at`),
  INDEX `idx_views_ip` (`ip_address`)
) ENGINE=InnoDB COMMENT='Logs de consultation pour analytics';

-- Table des statistiques quotidiennes
CREATE TABLE `daily_stats` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NOT NULL COMMENT 'Date des statistiques',
  `stat_type` ENUM('site', 'novel', 'author', 'chapter') NOT NULL COMMENT 'Type de statistique',
  `target_id` INT UNSIGNED COMMENT 'ID de la cible (null pour stats site)',
  `total_views` INT UNSIGNED DEFAULT 0 COMMENT 'Vues totales',
  `unique_views` INT UNSIGNED DEFAULT 0 COMMENT 'Vues uniques',
  `total_likes` INT UNSIGNED DEFAULT 0 COMMENT 'Likes totaux',
  `total_comments` INT UNSIGNED DEFAULT 0 COMMENT 'Commentaires totaux',
  `new_users` INT UNSIGNED DEFAULT 0 COMMENT 'Nouveaux utilisateurs',
  `active_users` INT UNSIGNED DEFAULT 0 COMMENT 'Utilisateurs actifs',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY `unique_daily_stat` (`date`, `stat_type`, `target_id`),
  INDEX `idx_daily_stats_date` (`date` DESC),
  INDEX `idx_daily_stats_type` (`stat_type`, `target_id`)
) ENGINE=InnoDB COMMENT='Statistiques quotidiennes agrégées';

-- =====================================================
-- 11. TABLES DE CONFIGURATION SYSTÈME
-- =====================================================

-- Table des paramètres système
CREATE TABLE `system_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clé du paramètre',
  `value` LONGTEXT COMMENT 'Valeur du paramètre',
  `type` ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string' COMMENT 'Type de données',
  `category` VARCHAR(50) DEFAULT 'general' COMMENT 'Catégorie du paramètre',
  `description` TEXT COMMENT 'Description du paramètre',
  `is_public` BOOLEAN DEFAULT FALSE COMMENT 'Visible côté client',
  `updated_by` INT UNSIGNED COMMENT 'Administrateur qui a modifié',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_settings_category` (`category`)
) ENGINE=InnoDB COMMENT='Paramètres et configuration système';

-- Table des logs système
CREATE TABLE `system_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `level` ENUM('debug', 'info', 'warning', 'error', 'critical') NOT NULL COMMENT 'Niveau de log',
  `message` TEXT NOT NULL COMMENT 'Message de log',
  `context` JSON COMMENT 'Contexte et données additionnelles',
  `user_id` INT UNSIGNED COMMENT 'Utilisateur concerné',
  `ip_address` VARCHAR(45) COMMENT 'Adresse IP',
  `user_agent` TEXT COMMENT 'User agent',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_logs_level` (`level`),
  INDEX `idx_logs_date` (`created_at` DESC),
  INDEX `idx_logs_user` (`user_id`)
) ENGINE=InnoDB COMMENT='Logs système pour monitoring et debug';

-- =====================================================
-- INSERTION DES DONNÉES DE BASE
-- =====================================================

-- Insérer les rôles par défaut
INSERT INTO `roles` (`name`, `display_name`, `description`, `permissions`) VALUES
('super_admin', 'Super Administrateur', 'Accès complet à toutes les fonctionnalités', '["*"]'),
('admin', 'Administrateur', 'Gestion des utilisateurs et du contenu', '["manage_users", "manage_content", "moderate"]'),
('content_editor', 'Éditeur de Contenu', 'Modération et édition du contenu', '["moderate_content", "edit_content"]'),
('author', 'Auteur', 'Publication de romans et chapitres', '["create_novels", "create_chapters", "create_posts"]'),
('premium_user', 'Utilisateur Premium', 'Accès aux contenus premium', '["access_premium"]'),
('user', 'Utilisateur', 'Lecture et interaction de base', '["read", "comment", "like", "bookmark"]'),
('blocked', 'Utilisateur Bloqué', 'Compte suspendu', '[]');

-- Insérer les catégories de base
INSERT INTO `categories` (`name`, `slug`, `description`, `color`, `sort_order`) VALUES
('Fantasy', 'fantasy', 'Romans fantastiques avec magie et créatures mythiques', '#8B5CF6', 1),
('Science-Fiction', 'science-fiction', 'Histoires futuristes et technologiques', '#06B6D4', 2),
('Romance', 'romance', 'Histoires d\'amour et relations sentimentales', '#EC4899', 3),
('Mystère', 'mystere', 'Romans policiers et énigmes', '#6B7280', 4),
('Aventure', 'aventure', 'Récits d\'action et d\'exploration', '#F59E0B', 5),
('Thriller', 'thriller', 'Suspense et tension psychologique', '#EF4444', 6),
('Contemporain', 'contemporain', 'Histoires de la vie moderne', '#10B981', 7),
('Historique', 'historique', 'Romans situés dans le passé', '#92400E', 8),
('Young Adult', 'young-adult', 'Littérature pour jeunes adultes', '#7C3AED', 9),
('Horreur', 'horreur', 'Histoires effrayantes et surnaturelles', '#1F2937', 10);

-- Insérer des tags populaires
INSERT INTO `tags` (`name`, `slug`, `description`) VALUES
('Magie', 'magie', 'Présence d\'éléments magiques'),
('Dragon', 'dragon', 'Présence de dragons'),
('Épée', 'epee', 'Combats à l\'épée'),
('Royaume', 'royaume', 'Politique royale et nobles'),
('Académie', 'academie', 'Cadre scolaire ou d\'apprentissage'),
('Voyage', 'voyage', 'Quête ou périple'),
('Guerre', 'guerre', 'Conflits et batailles'),
('Prophétie', 'prophetie', 'Prédictions et destinée'),
('Apprentissage', 'apprentissage', 'Formation et développement'),
('Amitié', 'amitie', 'Relations d\'amitié fortes');

-- Insérer les paramètres système de base
INSERT INTO `system_settings` (`key`, `value`, `type`, `category`, `description`, `is_public`) VALUES
('site_name', 'Night Novels', 'string', 'general', 'Nom du site', TRUE),
('site_description', 'Plateforme de lecture de romans en ligne', 'string', 'general', 'Description du site', TRUE),
('max_chapters_per_novel', '1000', 'number', 'content', 'Nombre maximum de chapitres par roman', FALSE),
('min_words_per_chapter', '500', 'number', 'content', 'Nombre minimum de mots par chapitre', FALSE),
('moderation_enabled', 'true', 'boolean', 'moderation', 'Modération activée', FALSE),
('registration_enabled', 'true', 'boolean', 'users', 'Inscription ouverte', TRUE),
('email_verification_required', 'true', 'boolean', 'users', 'Vérification email obligatoire', FALSE),
('max_file_size_mb', '10', 'number', 'uploads', 'Taille maximale des fichiers en MB', FALSE);

-- =====================================================
-- INDEX ET OPTIMISATIONS SUPPLÉMENTAIRES
-- =====================================================

-- Index composites pour améliorer les performances
CREATE INDEX `idx_novels_status_published` ON `novels` (`status`, `published_at` DESC);
CREATE INDEX `idx_chapters_novel_published` ON `chapters` (`novel_id`, `published_at` DESC);
CREATE INDEX `idx_comments_content_created` ON `comments` (`commentable_type`, `commentable_id`, `created_at` DESC);
CREATE INDEX `idx_user_likes_type_created` ON `user_likes` (`likeable_type`, `created_at` DESC);

-- =====================================================
-- TRIGGERS POUR MAINTENIR LES COMPTEURS
-- =====================================================

-- Trigger pour maintenir le compteur de chapitres dans novels
DELIMITER $$
CREATE TRIGGER `update_novel_chapter_count_insert` 
AFTER INSERT ON `chapters` 
FOR EACH ROW
BEGIN
  UPDATE `novels` 
  SET `chapter_count` = (
    SELECT COUNT(*) FROM `chapters` 
    WHERE `novel_id` = NEW.novel_id AND `status` = 'published'
  )
  WHERE `id` = NEW.novel_id;
END$$

CREATE TRIGGER `update_novel_chapter_count_delete` 
AFTER DELETE ON `chapters` 
FOR EACH ROW
BEGIN
  UPDATE `novels` 
  SET `chapter_count` = (
    SELECT COUNT(*) FROM `chapters` 
    WHERE `novel_id` = OLD.novel_id AND `status` = 'published'
  )
  WHERE `id` = OLD.novel_id;
END$$

-- Trigger pour maintenir le compteur de likes
CREATE TRIGGER `update_like_count_insert` 
AFTER INSERT ON `user_likes` 
FOR EACH ROW
BEGIN
  CASE NEW.likeable_type
    WHEN 'novel' THEN
      UPDATE `novels` SET `like_count` = `like_count` + 1 WHERE `id` = NEW.likeable_id;
    WHEN 'chapter' THEN
      UPDATE `chapters` SET `like_count` = `like_count` + 1 WHERE `id` = NEW.likeable_id;
    WHEN 'comment' THEN
      UPDATE `comments` SET `like_count` = `like_count` + 1 WHERE `id` = NEW.likeable_id;
    WHEN 'post' THEN
      UPDATE `author_posts` SET `like_count` = `like_count` + 1 WHERE `id` = NEW.likeable_id;
  END CASE;
END$$

CREATE TRIGGER `update_like_count_delete` 
AFTER DELETE ON `user_likes` 
FOR EACH ROW
BEGIN
  CASE OLD.likeable_type
    WHEN 'novel' THEN
      UPDATE `novels` SET `like_count` = `like_count` - 1 WHERE `id` = OLD.likeable_id;
    WHEN 'chapter' THEN
      UPDATE `chapters` SET `like_count` = `like_count` - 1 WHERE `id` = OLD.likeable_id;
    WHEN 'comment' THEN
      UPDATE `comments` SET `like_count` = `like_count` - 1 WHERE `id` = OLD.likeable_id;
    WHEN 'post' THEN
      UPDATE `author_posts` SET `like_count` = `