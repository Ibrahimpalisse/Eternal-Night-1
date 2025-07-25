require('dotenv').config();
// Assurez-vous que db.js se connecte et gère les erreurs, ou supprimez l'exigence si non utilisé pour le moment
// require('./db') // Affiche le log de connexion à la base

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
// const mysql = require('mysql2'); // Commenté si non utilisé directement ici

// Importer votre middleware de sécurité principal
const securityMiddleware = require('./middleware/SecurityMiddleware');

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authorRoutes = require('./routes/authorRoutes');

// Importer le service Socket.IO
const socketService = require('./services/socketService');
const corsMiddleware = require('./middleware/CorsMiddleware');

const port = process.env.PORT || 4000;


// On ne démarre le serveur qu'après la connexion réussie à la BDD
// Si db.js est synchrone ou si la connexion est gérée ailleurs, sinon, placez le code ci-dessous dans le callback de succès de la connexion BDD
    const app = express();
    const server = http.createServer(app);

    // Configuration Socket.IO - utiliser le même middleware CORS que pour l'application
    const io = new Server(server, {
      cors: corsMiddleware.corsOptions
    });

    // Initialiser le service Socket.IO avec l'instance io
    socketService.init(io);

    // --- Début Application des Middlewares de Sécurité ---
    console.log('Appliquer les middlewares de sécurité...');

    // Appliquer les middlewares configurés dans SecurityMiddleware
    // Cela inclura CORS et Rate Limit globalement comme défini dans SecurityMiddleware.js
    securityMiddleware.configureApp(app);

    console.log('Middlewares de sécurité (CORS, Rate Limit) appliqués globalement.');

    // Express body-parser middleware (souvent nécessaire pour traiter les corps de requêtes JSON/URL-encodées)
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.JWT_REFRESH_SECRET || 'votre_secret_cookies'));
    console.log('Middlewares Express JSON/URL-encoded appliqués.');

    // --- Fin Application des Middlewares de Sécurité ---

    // Utiliser les routes
    app.use('/api/auth', authRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/authors', authorRoutes);

    // Exemple de route basique
    app.get('/', (req, res) => {
      console.log('Route GET / atteinte.');
      res.send('API en ligne');
    });

    // Exemple de route protégée par JWT et Rôle
    // Note: Les middlewares authenticateToken() et authorizeRoles()
    // doivent être correctement implémentés et exportés par JwtMiddleware et RoleMiddleware
    // et potentiellement appliqués ici ou via un routeur.
    // Si securityMiddleware.configureApp n'applique pas ces middlewares sur toutes les routes,
    // vous devrez les ajouter spécifiquement ici ou sur un groupe de routes.
    // Supposons qu'ils soient appliqués sur cette route pour l'exemple:
    console.log('Définition de la route /protected avec JWT et Rôle middleware...');
    app.get('/protected', 
        securityMiddleware.jwt.authenticateToken(), // Applique le middleware JWT
        securityMiddleware.role.authorizeRoles('admin', 'super_admin'), // Applique le middleware de rôle
        (req, res) => {
        console.log('Route GET /protected atteinte APRES JWT et Rôle middleware.');
        console.log('Utilisateur authentifié:', req.user); // req.user sera défini par authenticateToken
        res.send('Ceci est une ressource protégée.');
    });
    console.log('Route /protected définie.');


    // Gérer les erreurs (optionnel mais recommandé, placez après les routes)
    app.use((err, req, res, next) => {
        console.error('--- Erreur détectée par middleware de gestion d\'erreurs ---');
        console.error(err.stack);
        if (err.message === 'Not allowed by CORS') {
            res.status(403).send('Not allowed by CORS');
        } else if (err.name === 'UnauthorizedError') { // Exemple pour express-jwt si utilisé
            res.status(401).send('Invalid Token');
        }
         else if (err.message === 'Trop de requêtes de votre IP, veuillez réessayer plus tard.') { // Message de rate limit
            res.status(429).send(err.message);
        }
        else {
            res.status(500).send('Something broke!');
        }
         console.log('--- Fin de l\'erreur ---');
    });


    server.listen(port, () => {
      console.log(`Serveur backend sur http://localhost:${port}`);
      console.log('Application prête.');
    });