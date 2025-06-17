const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

class JwtMiddleware {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'votre_clé_secrète_jwt'; // Utiliser la variable d'environnement si elle existe
    this.refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'votre_clé_secrète_refresh'; // Clé pour les refresh tokens
    this.expiresIn = process.env.JWT_EXPIRES_IN || '2h'; // Utiliser la variable d'environnement si elle existe (étendu à 2h)
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // Durée de vie des refresh tokens
  }

  // Méthode pour vérifier le token
  authenticateToken() {
    return async (req, res, next) => {
      console.log('🔐 Middleware JWT: Vérification du token...');
      console.log('📋 Headers disponibles:', Object.keys(req.headers));
      console.log('🍪 Cookies disponibles:', Object.keys(req.cookies || {}));
      
      // Récupérer le token du cookie ou du header
      const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];
      
      if (!token) {
        console.log('❌ Middleware JWT: Aucun token trouvé.');
        console.log('🔍 Cookie access_token:', req.cookies.access_token ? 'présent' : 'absent');
        console.log('🔍 Header Authorization:', req.headers['authorization'] ? 'présent' : 'absent');
        return res.status(401).json({ message: 'Accès non autorisé. Token requis.' });
      }

      console.log('✅ Token trouvé, vérification en cours...');
      
      jwt.verify(token, this.secretKey, async (err, user) => {
        if (err) {
          console.log('❌ Middleware JWT: Token invalide.', err.message);
          
          // Si le token est expiré, tenter de le rafraîchir automatiquement
          if (err.name === 'TokenExpiredError') {
            console.log('🔄 Token expiré, tentative de rafraîchissement automatique...');
            
            const refreshToken = req.cookies.refresh_token;
            if (refreshToken) {
              try {
                // Vérifier le refresh token
                const decoded = this.verifyRefreshToken(refreshToken);
                
                // Récupérer l'utilisateur
                const User = require('../models/User');
                const refreshedUser = await User.getUserById(decoded.id);
                
                if (refreshedUser) {
                  // Récupérer les rôles
                  const roles = await Profile.getUserRoles(refreshedUser.id);
                  
                  // Générer un nouveau token
                  const newToken = this.generateToken({
                    id: refreshedUser.id,
                    email: refreshedUser.email,
                    roles
                  });
                  
                  // Mettre à jour le cookie
                  const cookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000 // 1 jour
                  };
                  
                  res.cookie('access_token', newToken, cookieOptions);
                  
                  // Ajouter les informations utilisateur à la requête
                  req.user = {
                    id: refreshedUser.id,
                    email: refreshedUser.email,
                    roles
                  };
                  
                  console.log('✅ Token rafraîchi automatiquement pour user:', refreshedUser.id);
                  return next();
                }
              } catch (refreshError) {
                console.log('❌ Erreur lors du rafraîchissement automatique:', refreshError.message);
              }
            }
          }
          
          return res.status(403).json({ message: 'Token invalide ou expiré.' });
        }
        
        console.log('✅ Token valide, vérification des rôles pour user ID:', user.id);
        
        // Vérifier si l'utilisateur a au moins un rôle
        try {
          const User = require('../models/User'); // Importer ici pour éviter les dépendances circulaires
          const roles = await Profile.getUserRoles(user.id);
          
          console.log('🎭 Rôles récupérés pour user', user.id, ':', roles);
          
          if (!roles || roles.length === 0) {
            console.log('❌ Utilisateur sans rôle. User ID:', user.id);
            return res.status(403).json({ message: 'Utilisateur sans rôle. Accès refusé.' });
          }
          
          // Ajouter les rôles à l'objet user dans la requête
          user.roles = roles;
          req.user = user;
          console.log('✅ Authentification réussie pour user:', user.id, 'avec rôles:', roles);
          next();
        } catch (error) {
          console.error('💥 Erreur lors de la vérification des rôles:', error);
          return res.status(500).json({ message: 'Erreur lors de la vérification des droits d\'accès.' });
        }
      });
    };
  }

  // Méthode pour générer un token d'accès
  generateToken(user) {
    console.log('Middleware JWT: Génération de token pour l\'utilisateur', user.id);
    return jwt.sign(user, this.secretKey, { expiresIn: this.expiresIn });
  }

  // Méthode pour générer un refresh token
  generateRefreshToken(user) {
    console.log('Middleware JWT: Génération de refresh token pour l\'utilisateur', user.id);
    return jwt.sign(user, this.refreshSecretKey, { expiresIn: this.refreshExpiresIn });
  }

  // Méthode pour vérifier un refresh token
  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshSecretKey);
  }

  // Méthode pour changer la clé secrète
  setSecretKey(newSecretKey) {
    this.secretKey = newSecretKey;
  }

  // Méthode pour changer la durée de validité du token
  setExpiresIn(newExpiresIn) {
    this.expiresIn = newExpiresIn;
  }
}

module.exports = new JwtMiddleware();