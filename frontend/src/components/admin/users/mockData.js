// Données simulées des utilisateurs avec tous les rôles
export const mockUsers = [
  {
    id: 1,
    name: 'Alice Martin',
    email: 'alice.martin@example.com',
    roles: ['user'],
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20',
    loginHistory: [
      { date: '2024-01-20', time: '14:30:25' },
      { date: '2024-01-19', time: '09:15:42' },
      { date: '2024-01-18', time: '16:22:18' },
      { date: '2024-01-17', time: '11:45:30' },
      { date: '2024-01-16', time: '13:20:15' }
    ]
  },
  {
    id: 2,
    name: 'Bob Dupont',
    email: 'bob.dupont@example.com',
    roles: ['user', 'author'],
    status: 'active',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19',
    loginHistory: [
      { date: '2024-01-19', time: '18:45:12' },
      { date: '2024-01-18', time: '08:30:45' },
      { date: '2024-01-17', time: '20:15:33' },
      { date: '2024-01-15', time: '12:22:18' }
    ]
  },
  {
    id: 3,
    name: 'Claire Rousseau',
    email: 'claire.rousseau@example.com',
    roles: ['user'],
    status: 'active',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-15'
  },
  {
    id: 4,
    name: 'David Leroy',
    email: 'david.leroy@example.com',
    roles: ['user', 'admin'],
    status: 'active',
    joinDate: '2023-12-20',
    lastLogin: '2024-01-20',
    loginHistory: [
      { date: '2024-01-20', time: '22:15:45' },
      { date: '2024-01-20', time: '15:30:22' },
      { date: '2024-01-19', time: '09:45:18' },
      { date: '2024-01-18', time: '14:20:35' },
      { date: '2024-01-17', time: '16:55:12' },
      { date: '2024-01-16', time: '10:30:45' }
    ]
  },
  {
    id: 5,
    name: 'Emma Bernard',
    email: 'emma.bernard@example.com',
    roles: ['user', 'author'],
    status: 'author_suspended',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-18'
  },
  {
    id: 6,
    name: 'François Moreau',
    email: 'francois.moreau@example.com',
    roles: ['user'],
    status: 'active',
    joinDate: '2024-01-12',
    lastLogin: '2024-01-19'
  },
  {
    id: 7,
    name: 'Gabrielle Simon',
    email: 'gabrielle.simon@example.com',
    roles: ['user', 'author'],
    status: 'active',
    joinDate: '2024-01-08',
    lastLogin: '2024-01-18'
  },
  {
    id: 8,
    name: 'Henri Dubois',
    email: 'henri.dubois@example.com',
    roles: ['user'],
    status: 'blocked',
    joinDate: '2024-01-03',
    lastLogin: '2024-01-10',
    loginHistory: [
      { date: '2024-01-10', time: '23:45:12' },
      { date: '2024-01-09', time: '21:30:25' },
      { date: '2024-01-08', time: '19:15:45' }
    ]
  },
  {
    id: 9,
    name: 'Isabelle Fournier',
    email: 'isabelle.fournier@example.com',
    roles: ['user', 'admin'],
    status: 'active',
    joinDate: '2023-12-15',
    lastLogin: '2024-01-20'
  },
  {
    id: 10,
    name: 'Julien Garnier',
    email: 'julien.garnier@example.com',
    roles: ['user'],
    status: 'blocked',
    joinDate: '2023-12-28',
    lastLogin: '2024-01-15'
  },
  {
    id: 11,
    name: 'Karine Leclerc',
    email: 'karine.leclerc@example.com',
    roles: ['user', 'author'],
    status: 'active',
    joinDate: '2024-01-06',
    lastLogin: '2024-01-19'
  },
  {
    id: 12,
    name: 'Louis Roux',
    email: 'louis.roux@example.com',
    roles: ['user'],
    status: 'active',
    joinDate: '2024-01-14',
    lastLogin: '2024-01-20'
  },
  {
    id: 13,
    name: 'Marie Blanc',
    email: 'marie.blanc@example.com',
    roles: ['user'],
    status: 'active',
    joinDate: '2024-01-02',
    lastLogin: '2024-01-12'
  },
  {
    id: 14,
    name: 'Nicolas Petit',
    email: 'nicolas.petit@example.com',
    roles: ['user', 'author'],
    status: 'active',
    joinDate: '2024-01-09',
    lastLogin: '2024-01-18'
  },
  {
    id: 15,
    name: 'Olivia Mercier',
    email: 'olivia.mercier@example.com',
    roles: ['user'],
    status: 'blocked',
    joinDate: '2023-12-30',
    lastLogin: '2024-01-16'
  },
  {
    id: 16,
    name: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    roles: ['user', 'admin', 'super_admin'],
    status: 'active',
    joinDate: '2023-11-15',
    lastLogin: '2024-01-21',
    loginHistory: [
      { date: '2024-01-21', time: '07:30:15' },
      { date: '2024-01-20', time: '19:45:22' },
      { date: '2024-01-19', time: '08:15:33' },
      { date: '2024-01-18', time: '17:30:45' },
      { date: '2024-01-17', time: '09:00:12' },
      { date: '2024-01-16', time: '20:15:30' },
      { date: '2024-01-15', time: '12:30:18' }
    ]
  },
  {
    id: 17,
    name: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    roles: ['user', 'author'],
    status: 'active',
    joinDate: '2024-01-03',
    lastLogin: '2024-01-20'
  },
  {
    id: 18,
    name: 'Admin Principal',
    email: 'admin@example.com',
    roles: ['user', 'author', 'content_editor', 'admin', 'super_admin'],
    status: 'active',
    joinDate: '2023-01-01',
    lastLogin: '2024-01-21'
  },
  {
    id: 19,
    name: 'Éditeur Contenu',
    email: 'editeur@example.com',
    roles: ['user', 'content_editor'],
    status: 'active',
    joinDate: '2023-06-15',
    lastLogin: '2024-01-20'
  },
  {
    id: 20,
    name: 'Martin Bloqué',
    email: 'martin.bloque@example.com',
    roles: ['blocked'],
    status: 'blocked',
    joinDate: '2023-12-01',
    lastLogin: '2024-01-10'
  },
  {
    id: 21,
    name: 'Jean Auteur Suspendu',
    email: 'jean.suspendu@example.com',
    roles: ['author_suspended'],
    status: 'author_suspended',
    joinDate: '2023-11-01',
    lastLogin: '2024-01-05'
  },
  {
    id: 22,
    name: 'Lucie Éditrice',
    email: 'lucie.editrice@example.com',
    roles: ['content_editor'],
    status: 'active',
    joinDate: '2023-08-15',
    lastLogin: '2024-01-21'
  },
  {
    id: 23,
    name: 'Thomas Admin',
    email: 'thomas.admin@example.com',
    roles: ['admin'],
    status: 'active',
    joinDate: '2023-07-10',
    lastLogin: '2024-01-20'
  },
  {
    id: 24,
    name: 'Sandra Bloquée',
    email: 'sandra.bloquee@example.com',
    roles: ['blocked'],
    status: 'blocked',
    joinDate: '2023-10-05',
    lastLogin: '2023-12-20'
  }
];

// Données simulées des œuvres d'auteurs
export const mockWorks = {
  2: [ // Bob Dupont
    { id: 1, title: "Les Mystères de la Nuit", genre: "Fantastique", status: "Publié", chapters: 25, views: 15420, rating: 4.8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 2, title: "L'Écho des Âmes", genre: "Romance", status: "En cours", chapters: 12, views: 8930, rating: 4.6, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" }
  ],
  5: [ // Emma Bernard (auteur suspendu)
    { id: 3, title: "Contes Oubliés", genre: "Fantastique", status: "Suspendu", chapters: 8, views: 2140, rating: 4.2, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" }
  ],
  7: [ // Gabrielle Simon
    { id: 4, title: "Voyage Intérieur", genre: "Développement personnel", status: "Publié", chapters: 15, views: 7820, rating: 4.5, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
    { id: 5, title: "Les Secrets du Temps", genre: "Science-fiction", status: "En cours", chapters: 6, views: 3240, rating: 4.3, image: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400" }
  ],
  11: [ // Karine Leclerc
    { id: 6, title: "Harmonie Parfaite", genre: "Romance", status: "Publié", chapters: 22, views: 12450, rating: 4.7, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" }
  ],
  14: [ // Nicolas Petit
    { id: 7, title: "Aventures Galactiques", genre: "Science-fiction", status: "En cours", chapters: 10, views: 5670, rating: 4.4, image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400" }
  ],
  16: [ // Pierre Durand - Auteur prolifique
    { id: 9, title: "Épopée Galactique", genre: "Science-fiction", status: "Publié", chapters: 35, views: 31200, rating: 4.9, image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400" },
    { id: 10, title: "Les Secrets du Temps", genre: "Fantastique", status: "En cours", chapters: 20, views: 16500, rating: 4.8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 11, title: "Romance Contemporaine", genre: "Romance", status: "Publié", chapters: 28, views: 14300, rating: 4.4, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
    { id: 12, title: "Légendes Urbaines", genre: "Fantastique", status: "Publié", chapters: 42, views: 28900, rating: 4.7, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400" },
    { id: 13, title: "Cyber Révolution", genre: "Science-fiction", status: "En cours", chapters: 15, views: 12400, rating: 4.5, image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400" },
    { id: 14, title: "Amour et Guerre", genre: "Romance", status: "Publié", chapters: 33, views: 19800, rating: 4.6, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
    { id: 15, title: "Mystères Anciens", genre: "Mystère", status: "En cours", chapters: 8, views: 2100, rating: 4.2, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
    { id: 16, title: "Aventures Spatiales", genre: "Science-fiction", status: "Publié", chapters: 29, views: 22100, rating: 4.8, image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400" },
    { id: 17, title: "Contes de Minuit", genre: "Horreur", status: "En cours", chapters: 12, views: 8750, rating: 4.3, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 18, title: "Héros Modernes", genre: "Action", status: "Publié", chapters: 38, views: 25600, rating: 4.7, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400" },
    { id: 19, title: "Poésie du Cœur", genre: "Poésie", status: "Publié", chapters: 16, views: 11300, rating: 4.2, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
    { id: 20, title: "Chroniques Perdues", genre: "Fantasy", status: "En cours", chapters: 22, views: 17800, rating: 4.6, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
    { id: 21, title: "L'Art de Vivre", genre: "Philosophie", status: "Publié", chapters: 25, views: 13200, rating: 4.4, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 22, title: "Récits d'Aventure", genre: "Aventure", status: "En cours", chapters: 5, views: 980, rating: 4.0, image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400" },
    { id: 23, title: "Nouvelles Frontières", genre: "Science-fiction", status: "Publié", chapters: 31, views: 20400, rating: 4.5, image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400" }
  ],
  17: [ // Sophie Laurent
    { id: 8, title: "Mémoires d'une Artiste", genre: "Biographie", status: "Publié", chapters: 18, views: 9320, rating: 4.6, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
    { id: 9, title: "Couleurs de l'Âme", genre: "Poésie", status: "En cours", chapters: 4, views: 1890, rating: 4.1, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }
  ]
};

// Fonction pour obtenir les œuvres d'un utilisateur
export const getUserWorks = (userId) => {
  return mockWorks[userId] || [];
};

// Fonction pour obtenir le rôle principal d'un utilisateur
export const getPrimaryRole = (roles) => {
  if (!roles || roles.length === 0) return 'user';
  
  // Ordre de priorité des rôles
  const rolePriority = {
    'super_admin': 1,
    'admin': 2,
    'content_editor': 3,
    'author': 4,
    'user': 5,
    'author_suspended': 6,
    'blocked': 7
  };
  
  return roles.reduce((primary, role) => {
    return (rolePriority[role] || 999) < (rolePriority[primary] || 999) ? role : primary;
  }, roles[0]);
};

// Fonction pour obtenir le label d'affichage d'un rôle
export const getRoleLabel = (role) => {
  const roleLabels = {
    'super_admin': 'Super Admin',
    'admin': 'Admin',
    'content_editor': 'Éditeur',
    'author': 'Auteur',
    'user': 'Utilisateur',
    'blocked': 'Bloqué',
    'author_suspended': 'Auteur suspendu'
  };
  
  return roleLabels[role] || 'Utilisateur';
};

// Fonction pour obtenir les couleurs d'un rôle
export const getRoleColors = (role) => {
  const roleColors = {
    'super_admin': 'bg-red-500/20 text-red-400 border-red-500/30',
    'admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'content_editor': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'author': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'user': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'blocked': 'bg-red-600/20 text-red-300 border-red-600/30',
    'author_suspended': 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30'
  };
  
  return roleColors[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

// Fonction pour obtenir les couleurs d'un statut
export const getStatusColors = (status) => {
  const statusColors = {
    'active': 'bg-green-500/20 text-green-400 border-green-500/30',
    'blocked': 'bg-red-500/20 text-red-400 border-red-500/30',
    'author_suspended': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };
  
  return statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

// Fonction pour obtenir le label d'affichage d'un statut
export const getStatusLabel = (status) => {
  const statusLabels = {
    'active': 'Actif',
    'blocked': 'Bloqué',
    'author_suspended': 'Auteur suspendu'
  };
  
  return statusLabels[status] || 'Inactif';
};

// Fonction de filtrage des utilisateurs
export const filterUsers = (users, searchTerm, filterRole, filterStatus) => {
  return users.filter(user => {
    // Filtrage par terme de recherche
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrage par rôle
    const matchesRole = filterRole === 'all' || 
      (user.roles && user.roles.includes(filterRole));
    
    // Filtrage par statut
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
};

// Fonction pour obtenir les données paginées
export const getPaginatedData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}; 