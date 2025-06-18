import React from 'react';
import { 
  Shield, 
  Edit3, 
  Users as UsersIcon, 
  UserX, 
  AlertTriangle,
  UserCheck,
  EyeOff
} from 'lucide-react';

// Fonctions pour les icônes de rôles
export const getRoleIcon = (role) => {
  switch(role) {
    case 'super_admin': return <Shield className="w-4 h-4 text-red-500" />;
    case 'admin': return <Shield className="w-4 h-4 text-red-400" />;
    case 'content_editor': return <Edit3 className="w-4 h-4 text-blue-400" />;
    case 'author': return <Edit3 className="w-4 h-4 text-blue-400" />;
    case 'user': return <UsersIcon className="w-4 h-4 text-purple-400" />;
    case 'blocked': return <UserX className="w-4 h-4 text-red-400" />;
    case 'author_suspended': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    default: return <UsersIcon className="w-4 h-4 text-gray-400" />;
  }
};

export const getRoleIcons = (roles) => {
  return roles.map((role, index) => (
    <span key={role} className="flex items-center">
      {getRoleIcon(role)}
      {index < roles.length - 1 && <span className="mx-1">+</span>}
    </span>
  ));
};

// Fonctions pour les badges de rôles
export const getRoleBadge = (role) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch(role) {
    case 'super_admin': return `${baseClasses} bg-red-600/20 text-red-500 border border-red-600/30`;
    case 'admin': return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
    case 'content_editor': return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
    case 'author': return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
    case 'user': return `${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`;
    case 'blocked': return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
    case 'author_suspended': return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
    default: return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
  }
};

export const getRoleDisplayName = (role) => {
  switch(role) {
    case 'super_admin': return 'Super Admin';
    case 'admin': return 'Admin';
    case 'content_editor': return 'Éditeur';
    case 'author': return 'Auteur';
    case 'user': return 'Utilisateur';
    case 'blocked': return 'Bloqué';
    case 'author_suspended': return 'Auteur suspendu';
    default: return role;
  }
};

export const getRoleBadges = (roles, maxVisible = 3) => {
  if (roles.length <= maxVisible) {
    return roles.map((role) => (
      <span key={role} className={getRoleBadge(role)}>
        {getRoleDisplayName(role)}
      </span>
    ));
  }

  // Afficher les premiers rôles + compteur
  const visibleRoles = roles.slice(0, maxVisible);
  const remainingRoles = roles.slice(maxVisible);
  const remainingCount = roles.length - maxVisible;

  return (
    <>
      {visibleRoles.map((role) => (
        <span key={role} className={getRoleBadge(role)}>
          {getRoleDisplayName(role)}
        </span>
      ))}
      <span 
        className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-help"
        title={`Autres rôles: ${remainingRoles.map(role => getRoleDisplayName(role)).join(', ')}`}
      >
        +{remainingCount}
      </span>
    </>
  );
};

export const getRoleDisplayText = (roles) => {
  const roleTexts = roles.map(role => getRoleDisplayName(role));
  return roleTexts.join(' + ');
};

// Fonctions pour les statuts
export const getStatusIcon = (status) => {
  switch(status) {
    case 'active': return <UserCheck className="w-4 h-4 text-green-400" />;
    case 'suspended': return <UserX className="w-4 h-4 text-red-400" />;
    case 'blocked': return <EyeOff className="w-4 h-4 text-gray-400" />;
    default: return <UsersIcon className="w-4 h-4 text-gray-400" />;
  }
};

export const getStatusBadge = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch(status) {
    case 'active': return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
    case 'suspended': return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
    case 'blocked': return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    default: return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
  }
};

export const getStatusDisplayName = (status) => {
  switch(status) {
    case 'active': return 'Activé';
    case 'suspended': return 'Suspendu'; 
    case 'blocked': return 'Bloqué';
    default: return status;
  }
};

// Fonction pour déterminer le statut intelligent basé sur les rôles
export const getSmartStatus = (user) => {
  const { roles, status } = user;
  
  // Si l'utilisateur a des rôles spéciaux suspendus/bloqués
  if (roles.includes('blocked')) {
    return {
      status: 'blocked',
      displayName: 'Bloqué',
      actionText: 'Débloquer',
      canActivate: true,
      priority: 'high'
    };
  }
  
  if (roles.includes('author_suspended')) {
    return {
      status: 'author_suspended', 
      displayName: 'Auteur Suspendu',
      actionText: 'Réactiver Auteur',
      canActivate: true,
      priority: 'medium'
    };
  }
  
  // Statut normal basé sur le status général
  switch(status) {
    case 'suspended':
      return {
        status: 'suspended',
        displayName: 'Suspendu',
        actionText: 'Activer',
        canActivate: true,
        priority: 'medium'
      };
    case 'blocked':
      return {
        status: 'blocked',
        displayName: 'Bloqué',
        actionText: 'Débloquer', 
        canActivate: true,
        priority: 'high'
      };
    case 'active':
    default:
      // Vérifier les rôles importants pour l'action
      const hasImportantRoles = roles.some(role => 
        ['super_admin', 'admin', 'content_editor', 'author'].includes(role)
      );
      
      return {
        status: 'active',
        displayName: 'Activé',
        actionText: hasImportantRoles ? 'Désactiver' : 'Suspendre',
        canActivate: false,
        priority: 'low'
      };
  }
};

// Fonction pour obtenir l'icône de statut intelligent
export const getSmartStatusIcon = (user) => {
  const smartStatus = getSmartStatus(user);
  return getStatusIcon(smartStatus.status);
};

// Fonction pour obtenir le badge de statut intelligent  
export const getSmartStatusBadge = (user) => {
  const smartStatus = getSmartStatus(user);
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  
  switch(smartStatus.priority) {
    case 'high':
      return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
    case 'medium':
      return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
    case 'low':
    default:
      return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
  }
};

// Fonction pour les badges des œuvres
export const getStatusBadgeForWork = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch(status) {
    case 'Publié': return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
    case 'En cours': return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
    default: return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
  }
};

// Fonction pour vérifier si un utilisateur est auteur (normal ou suspendu)
export const isAuthorUser = (user) => {
  return user.roles.includes('author') || user.roles.includes('author_suspended');
};

// Fonctions de filtrage
export const filterUsers = (users, searchTerm, filterRole, filterStatus) => {
  return users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.roles.includes(filterRole);
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });
};

// Fonctions de pagination
export const getPaginatedData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    paginatedData: data.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalPages: Math.ceil(data.length / itemsPerPage)
  };
};

export const getPageNumbers = (currentPage, totalPages, maxVisiblePages = 5) => {
  const pages = [];
  
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }
  
  return pages;
}; 