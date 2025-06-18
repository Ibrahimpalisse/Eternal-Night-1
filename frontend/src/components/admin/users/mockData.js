// Données simulées des utilisateurs avec tous les rôles
export const mockUsers = [
  {
    id: 1,
    name: 'Alice Martin',
    email: 'alice.martin@example.com',
    roles: ['user'],
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: 2,
    name: 'Bob Dupont',
    email: 'bob.dupont@example.com',
    roles: ['user', 'author'],
    status: 'active',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19'
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
    lastLogin: '2024-01-20'
  },
  {
    id: 5,
    name: 'Emma Bernard',
    email: 'emma.bernard@example.com',
    roles: ['user', 'author'],
    status: 'suspended',
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
    lastLogin: '2024-01-10'
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
    status: 'suspended',
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
    status: 'suspended',
    joinDate: '2023-12-30',
    lastLogin: '2024-01-16'
  },
  {
    id: 16,
    name: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    roles: ['user', 'author', 'admin'],
    status: 'active',
    joinDate: '2023-11-15',
    lastLogin: '2024-01-21'
  },
  {
    id: 17,
    name: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    roles: ['author'],
    status: 'active',
    joinDate: '2024-01-03',
    lastLogin: '2024-01-20'
  },
  {
    id: 18,
    name: 'Admin Principal',
    email: 'admin@example.com',
    roles: ['super_admin'],
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
    name: 'Auteur Bloqué',
    email: 'auteur.bloque@example.com',
    roles: ['user', 'blocked'],
    status: 'active',
    joinDate: '2023-12-01',
    lastLogin: '2024-01-10'
  },
  {
    id: 21,
    name: 'Auteur Suspendu',
    email: 'auteur.suspendu@example.com',
    roles: ['user', 'author_suspended'],
    status: 'active',
    joinDate: '2023-11-01',
    lastLogin: '2024-01-05'
  }
];

// Données simulées des œuvres d'auteurs
export const mockWorks = {
  2: [ // Bob Dupont
    { id: 1, title: "Les Mystères de la Nuit", genre: "Fantastique", status: "Publié", chapters: 25, views: 15420, rating: 4.8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 2, title: "L'Écho des Âmes", genre: "Romance", status: "En cours", chapters: 12, views: 8930, rating: 4.6, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" }
  ],
  5: [ // Emma Bernard
    { id: 3, title: "Chroniques d'un Monde Perdu", genre: "Science-fiction", status: "Publié", chapters: 40, views: 23100, rating: 4.9, image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400" },
    { id: 4, title: "Le Jardin Secret", genre: "Drame", status: "En cours", chapters: 3, views: 1250, rating: 4.1, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" }
  ],
  7: [ // Gabrielle Simon
    { id: 5, title: "Aventures Maritimes", genre: "Aventure", status: "Publié", chapters: 18, views: 12750, rating: 4.5, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400" }
  ],
  11: [ // Karine Leclerc
    { id: 6, title: "L'Art de la Guerre", genre: "Historique", status: "En cours", chapters: 8, views: 5200, rating: 4.3, image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400" },
    { id: 7, title: "Contes de Fées Modernes", genre: "Fantastique", status: "Publié", chapters: 15, views: 9800, rating: 4.7, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }
  ],
  14: [ // Nicolas Petit
    { id: 8, title: "Thriller Urbain", genre: "Thriller", status: "Publié", chapters: 22, views: 18600, rating: 4.6, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" }
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
    { id: 24, title: "Nouvelle Génération", genre: "Young Adult", status: "En cours", chapters: 6, views: 3400, rating: 4.2, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" }
  ]
}; 