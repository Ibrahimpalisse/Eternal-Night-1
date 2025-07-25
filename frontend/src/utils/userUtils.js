// Fonction pour obtenir l'avatar de l'utilisateur
export const getUserAvatar = (user) => {
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

// Fonction pour obtenir les initiales de l'utilisateur
export const getUserInitials = (user) => {
  if (!user) return '';
  
  if (user.name) {
    return user.name.charAt(0).toUpperCase();
  }
  
  if (user.username) {
    return user.username.charAt(0).toUpperCase();
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

// Fonction pour obtenir le nom d'affichage de l'utilisateur
export const getUserDisplayName = (user) => {
  if (!user) return '';
  
  return user.name || user.username || user.email || 'Utilisateur';
};

// Fonction pour formater les rôles d'utilisateur
export const formatUserRole = (role) => {
  const roleMap = {
    'super_admin': 'Super Admin',
    'admin': 'Admin', 
    'author': 'Auteur',
    'user': 'Utilisateur'
  };
  
  return roleMap[role] || role;
};

// Fonction pour obtenir les couleurs CSS pour un rôle
export const getRoleColors = (role) => {
  const colorMap = {
    'super_admin': 'bg-red-500/20 text-red-300 border border-red-500/30',
    'admin': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    'author': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    'user': 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
  };
  
  return colorMap[role] || colorMap.user;
}; 