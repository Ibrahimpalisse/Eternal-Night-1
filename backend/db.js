require('dotenv').config();
const mysql = require('mysql2/promise');

// Configuration de la base de données adaptée à Docker
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3307, // Port 3307 par défaut pour Docker
  user: process.env.DB_USER || 'user', // Utilisateur par défaut basé sur docker-compose.yml
  password: process.env.DB_PASSWORD || 'password', // Mot de passe par défaut basé sur docker-compose.yml
  database: process.env.DB_NAME || 'eternal-night', // Base de données par défaut basée sur docker-compose.yml
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Debug: Afficher la configuration utilisée
console.log('🔧 Configuration DB utilisée:');
console.log(`  Host: ${dbConfig.host}`);
console.log(`  Port: ${dbConfig.port}`);
console.log(`  User: ${dbConfig.user}`);
console.log(`  Database: ${dbConfig.database}`);

// Création d'un pool de connexions avec la version promise de mysql2
const pool = mysql.createPool(dbConfig);

// Vérifier la connexion
pool.getConnection()
  .then(connection => {
    console.log('✅ Connecté à MySQL');
    connection.release(); // Libérer la connexion
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à MySQL:', err);
  });

module.exports = pool;