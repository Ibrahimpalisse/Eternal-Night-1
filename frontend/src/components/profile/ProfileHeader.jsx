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
              
            </div>
            
            {/* Actions rapides */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            </div>
          </div>
          
          {/* Tous les badges sur la même ligne */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-3">
            {/* Badges de rôles */}
            {user?.rolesWithDescription && user.rolesWithDescription.length > 0 && (
              user.rolesWithDescription.map((roleData, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md transition-all duration-200 hover:bg-purple-700/40 hover:scale-105"
                  title={`Rôle: ${roleData.role}`}
                >
                  {roleData.description || roleData.role}
                </span>
              ))
            )}
            
            {/* Badges de statut */}
            {user?.isVerified && (
              <span className="inline-flex items-center px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-xs font-medium border border-green-500/50 shadow-md transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Email vérifié
              </span>
            )}
            
            {user?.profile?.premium && (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-full text-xs font-medium border border-yellow-500/50 shadow-md transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Premium
              </span>
            )}
            
            <span className="px-3 py-1 bg-gray-600/30 text-gray-200 rounded-full text-xs font-medium border border-gray-500/50 shadow-md transition-all duration-200">
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