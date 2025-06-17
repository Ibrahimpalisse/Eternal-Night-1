import React from 'react';

// Fonction pour obtenir l'avatar de l'utilisateur
const getUserAvatar = (user) => {
    if (!user) return null;
    
    // Priorité 1: avatarUrl direct (depuis l'API qui construit l'URL S3)
    if (user.profile && user.profile.avatarUrl) return user.profile.avatarUrl;
    
    // Priorité 2: avatar property
    if (user.avatar) return user.avatar;
    
    // Priorité 3: avatarUrl à la racine de l'objet user
    if (user.avatarUrl) return user.avatarUrl;
    
    // Priorité 4: construire l'URL S3 si on a avatar_path
    if (user.profile && user.profile.avatar_path) {
        // Si c'est déjà une URL complète, la retourner
        if (user.profile.avatar_path.startsWith('http')) {
            return user.profile.avatar_path;
        }
        // Sinon, essayer de construire l'URL S3
        const awsBucket = 'eternal-night'; // votre bucket
        const awsRegion = 'eu-north-1'; // votre région
        return `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${user.profile.avatar_path}`;
    }
    
    return null;
};

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-gray-900/50 rounded-lg border border-white/10 p-4 sm:p-6 mb-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar ou initiales */}
        <div className="relative">
          {getUserAvatar(user) ? (
            <img 
              src={getUserAvatar(user)} 
              alt={`Avatar de ${user.name}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-purple-500/30"
              onError={(e) => {
                // En cas d'erreur de chargement, afficher les initiales
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 ${
              getUserAvatar(user) ? 'hidden' : 'flex'
            }`}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        
        {/* Informations du profil */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {user?.name || 'Utilisateur'}
              </h1>
              <p className="text-sm sm:text-base text-gray-400 mb-2">
                {user?.email || 'email@example.com'}
              </p>
              
              {/* Affichage des descriptions des rôles */}
              {user?.rolesWithDescription && user.rolesWithDescription.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.rolesWithDescription.map((roleData, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      title={`Rôle: ${roleData.role}`}
                    >
                      {roleData.description || roleData.role}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Actions rapides */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button 
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Modifier le profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button 
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Partager le profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Badges et statut */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:space-x-4 mt-3">
            {user?.isVerified && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Email vérifié
              </span>
            )}
            
            {user?.profile?.premium && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs sm:text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Premium
              </span>
            )}
            
            <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs sm:text-sm">
              Membre depuis {user?.created_at ? 
                new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 
                'récemment'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 