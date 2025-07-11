require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  // Créer une connexion à MySQL sans spécifier une base de données
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password'
  });

  try {
    // Utiliser la base de données existante créée par Docker
    const dbName = 'eternal-night';
    console.log(`✅ Utilisation de la base de données ${dbName}`);

    // Utiliser la base de données
    await connection.query(`USE \`${dbName}\``);

    // Créer la table des utilisateurs
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table users créée ou déjà existante');

    // Créer la table des vérifications
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS verification (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email_verification_code VARCHAR(6),
        email_verification_expires DATETIME,
        is_verified BOOLEAN DEFAULT FALSE,
        password_reset_token VARCHAR(255),
        password_reset_code VARCHAR(255),
        password_reset_expires DATETIME,
        email_change_code VARCHAR(6),
        email_change_expires TIMESTAMP NULL,
        pending_email VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table verification créée ou déjà existante');

    // Créer la table des profils
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS profile (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        avatar_path VARCHAR(255) DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table profile créée ou déjà existante');

    // Créer la table des rôles
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table roles créée ou déjà existante');

    // Créer la table pivot user_role
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS role_user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        UNIQUE KEY user_role_unique (user_id, role_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table role_user créée ou déjà existante');

    // Créer la table des auteurs
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        pseudo VARCHAR(50) NOT NULL,
        description TEXT,
        website_url VARCHAR(255) DEFAULT NULL,
        twitter_url VARCHAR(255) DEFAULT NULL,
        instagram_url VARCHAR(255) DEFAULT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table authors créée ou déjà existante');

    // Insérer les rôles par défaut
    const roles = [
      ['super_admin', 'Super administrateur avec tous les droits'],
      ['admin', 'Administrateur du site'],
      ['content_editor', 'Éditeur de contenu'],
      ['author', 'Auteur de contenu'],
      ['user', 'Utilisateur standard'],
      ['blocked', 'Utilisateur bloqué'],
      ['author_suspended', 'Auteur suspendu']
    ];

    for (const [role, description] of roles) {
      await connection.execute(
        'INSERT IGNORE INTO roles (role, description) VALUES (?, ?)',
        [role, description]
      );
    }
    console.log('✅ Rôles par défaut insérés ou déjà existants');

    console.log('✅ Configuration de la base de données terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la configuration de la base de données:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase(); 