import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailsModal, EditModal, QuickActionModal } from './modals/AuthorContentModals';
import DeleteContentDialog from './DeleteContentDialog';
import { CategoryFilter, StatusFilter, AuthorFilter } from './filters';
import { ActionMenu, Pagination } from './table';
import { 
  BookOpen,
  Search,
  User,
  Clock,
  CheckCircle,
  Pause,
  EyeOff
} from 'lucide-react';

const AuthorsContent = () => {
  const navigate = useNavigate();
  
  // États pour la gestion de l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [filterCategories, setFilterCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // États pour les modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quickActionType, setQuickActionType] = useState('');

  // Liste des auteurs disponibles
  const availableAuthors = [
    { id: 1, name: 'Alice Martin' },
    { id: 2, name: 'Bob Dupont' },
    { id: 3, name: 'Claire Rousseau' },
    { id: 4, name: 'David Leroy' },
    { id: 5, name: 'Emma Dubois' },
    { id: 6, name: 'Marc Laurent' },
    { id: 7, name: 'Sophie Martin' }
  ];

  // Liste des statuts disponibles
  const availableStatuses = [
    { value: 'pending', label: 'En attente' },
    { value: 'ready_for_acceptance', label: 'Vérifié' },
    { value: 'accepted_unpublished', label: 'Accepté' },
    { value: 'published', label: 'Publié' },
    { value: 'unpublished', label: 'Dépublié' }
  ];

  // Liste des catégories disponibles
  const availableCategories = [
    'Fantasy', 'Sci-Fi', 'Romance', 'Thriller', 'Horreur', 
    'Mystère', 'Historique', 'Aventure', 'Drame'
  ];
  
  // Données simulées pour les romans
  const mockNovels = [
    {
      id: 1,
      title: 'Les Chroniques d\'Eldoria',
      author: 'Alice Martin',
      authorId: 1,
      status: 'pending',
      categories: ['fantasy', 'adventure'],
      description: 'Une épopée fantastique dans un monde magique rempli de créatures mystérieuses...',
      coverImage: null,
      submittedAt: '2024-01-20',
      chaptersCount: 0,
      chapterCount: 0,
      views: 0,
      isVerified: false,
      isCompleted: false,
      comment: ''
    },
    {
      id: 2,
      title: 'Cyberpunk 2177',
      author: 'Bob Dupont',
      authorId: 2,
      status: 'accepted_unpublished',
      categories: ['sci-fi', 'thriller'],
      description: 'Dans un futur dystopique, un hacker tente de renverser le système...',
      coverImage: null,
      submittedAt: '2024-01-15',
      chaptersCount: 5,
      chapterCount: 5,
      views: 1250,
      isVerified: true,
      isCompleted: false,
      comment: 'Roman de qualité, bien écrit et captivant.'
    },
    {
      id: 3,
      title: 'Romance à Paris',
      author: 'Claire Rousseau',
      authorId: 3,
      status: 'published',
      categories: ['romance', 'drama'],
      description: 'Une histoire d\'amour moderne dans la ville lumière...',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
      submittedAt: '2024-01-10',
      chaptersCount: 12,
      chapterCount: 12,
      views: 5420,
      publishedBy: 'author',
      isVerified: true,
      isCompleted: true,
      comment: 'Excellent roman romantique avec une belle écriture.'
    },
    {
      id: 5,
      title: 'Aventures Spatiales',
      author: 'Emma Dubois',
      authorId: 5,
      status: 'published',
      categories: ['sci-fi', 'adventure'],
      description: 'Un voyage épique à travers les galaxies...',
      coverImage: null,
      submittedAt: '2024-01-25',
      chaptersCount: 8,
      chapterCount: 8,
      views: 3200,
      publishedBy: 'admin',
      isVerified: true,
      isCompleted: false,
      comment: 'Roman de science-fiction divertissant et bien construit.'
    },
    {
      id: 6,
      title: 'Thriller Urbain',
      author: 'Marc Laurent',
      authorId: 6,
      status: 'ready_for_acceptance',
      categories: ['thriller', 'mystery'],
      description: 'Un suspense haletant dans les rues de la ville...',
      coverImage: null,
      submittedAt: '2024-01-28',
      chaptersCount: 3,
      chapterCount: 3,
      views: 150,
      isVerified: true,
      isCompleted: false,
      comment: 'Roman vérifié et prêt pour acceptation'
    },
    {
      id: 7,
      title: 'Conte Fantastique',
      author: 'Sophie Martin',
      authorId: 7,
      status: 'accepted_unpublished',
      categories: ['fantasy'],
      description: 'Un conte moderne plein de magie...',
      coverImage: null,
      submittedAt: '2024-01-30',
      chaptersCount: 3,
      chapterCount: 3,
      views: 450,
      isVerified: true,
      isCompleted: false,
      comment: 'Conte charmant avec une belle imagination.'
    },
    {
      id: 8,
      title: 'Le Mystère de la Forêt Noire',
      author: 'David Leroy',
      authorId: 4,
      status: 'unpublished',
      categories: ['mystery', 'horror'],
      description: 'Un roman mystérieux qui a été dépublié suite à des signalements...',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop',
      submittedAt: '2024-01-12',
      chaptersCount: 15,
      chapterCount: 15,
      views: 2800,
      unpublishReason: 'Contenu signalé par plusieurs lecteurs',
      isVerified: true,
      isCompleted: true,
      comment: 'Roman dépublié suite à des signalements de contenu inapproprié.'
    },
    {
      id: 9,
      title: 'L\'Épopée Fantastique',
      author: 'Alice Moreau',
      authorId: 8,
      status: 'published',
      categories: ['fantasy', 'adventure', 'historical', 'romance'],
      description: 'Une épopée fantastique mêlant aventure, histoire et romance dans un monde magique...',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
      submittedAt: '2024-02-01',
      chaptersCount: 20,
      chapterCount: 20,
      views: 8500,
      publishedBy: 'admin',
      isVerified: true,
      isCompleted: true,
      comment: 'Roman exceptionnel mêlant plusieurs genres avec brio.'
    },
    {
      id: 10,
      title: 'Cyber-Thriller Dystopique',
      author: 'Thomas Girard',
      authorId: 9,
      status: 'accepted_unpublished',
      categories: ['sci-fi', 'thriller', 'mystery'],
      description: 'Un thriller cyberpunk dans un futur dystopique plein de mystères...',
      coverImage: null,
      submittedAt: '2024-02-03',
      chaptersCount: 7,
      chapterCount: 7,
      views: 920,
      isVerified: true,
      isCompleted: false,
      comment: 'Excellent mélange de genres, très bien écrit.'
    }
  ];

  // Fonction pour obtenir le statut badge
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'pending': 
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case 'ready_for_acceptance': 
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case 'accepted_unpublished': 
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      case 'published': 
        return `${baseClasses} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`;
      case 'unpublished': 
        return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
      default: 
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'ready_for_acceptance': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'accepted_unpublished': return <Pause className="w-4 h-4 text-blue-400" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'unpublished': return <EyeOff className="w-4 h-4 text-orange-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'ready_for_acceptance': return 'Vérifié';
      case 'accepted_unpublished': return 'Accepté';
      case 'published': return 'Publié';
      case 'unpublished': return 'Dépublié';
      default: return 'Inconnu';
    }
  };

  // Fonctions de gestion des actions
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteDialog(true);
  };

  const handleQuickAction = (item, actionType) => {
    // Gérer certaines actions directement sans modal
    if (actionType === 'accept') {
      handleAcceptNovel(item);
      return;
    }
    if (actionType === 'reject') {
      handleRejectNovel(item);
      return;
    }
    if (actionType === 'publish') {
      handlePublishNovel(item);
      return;
    }
    if (actionType === 'unpublish') {
      handleUnpublishNovel(item);
      return;
    }
    if (actionType === 'republish') {
      handleRepublishNovel(item);
      return;
    }
    
    // Pour les autres actions, utiliser le modal
    setSelectedItem(item);
    setQuickActionType(actionType);
    setShowQuickActionModal(true);
  };

  // Fonction pour accepter un roman vérifié
  const handleAcceptNovel = (novel) => {
    const updatedNovel = {
      ...novel,
      status: 'accepted_unpublished',
      moderationStatus: 'approved',
      acceptedAt: new Date().toISOString(),
      acceptedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    console.log('Roman accepté:', updatedNovel.title);
    // Ici vous pourriez mettre à jour l'état ou faire un appel API
  };

  // Fonction pour refuser un roman vérifié
  const handleRejectNovel = (novel) => {
    const updatedNovel = {
      ...novel,
      status: 'pending',
      moderationStatus: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    console.log('Roman refusé:', updatedNovel.title);
    // Ici vous pourriez mettre à jour l'état ou faire un appel API
  };

  // Fonction pour publier un roman accepté
  const handlePublishNovel = (novel) => {
    const updatedNovel = {
      ...novel,
      status: 'published',
      publishedAt: new Date().toISOString(),
      publishedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    console.log('Roman publié:', updatedNovel.title);
    // Ici vous pourriez mettre à jour l'état ou faire un appel API
  };

  // Fonction pour dépublier un roman publié
  const handleUnpublishNovel = (novel) => {
    const updatedNovel = {
      ...novel,
      status: 'unpublished',
      unpublishedAt: new Date().toISOString(),
      unpublishedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    console.log('Roman dépublié:', updatedNovel.title);
    // Ici vous pourriez mettre à jour l'état ou faire un appel API
  };

  // Fonction pour republier un roman dépublié
  const handleRepublishNovel = (novel) => {
    const updatedNovel = {
      ...novel,
      status: 'published',
      republishedAt: new Date().toISOString(),
      republishedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    console.log('Roman republié:', updatedNovel.title);
    // Ici vous pourriez mettre à jour l'état ou faire un appel API
  };

  const handleViewChapters = (item) => {
    navigate('/admin/chapters', { 
      state: { romanData: item }
    });
  };

  const confirmDelete = async (item, password) => {
    console.log('Supprimer:', item, 'avec mot de passe:', password);
    setShowDeleteDialog(false);
  };

  // Filtrage des données
  const filteredData = mockNovels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         novel.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || novel.status === filterStatus;
    const matchesAuthor = filterAuthor === 'all' || novel.authorId.toString() === filterAuthor;
    const matchesCategories = filterCategories.length === 0 || 
                             filterCategories.some(cat => novel.categories.includes(cat));
    
    return matchesSearch && matchesStatus && matchesAuthor && matchesCategories;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Calcul des statistiques
  const stats = {
    novels: {
      total: mockNovels.length,
      pending: mockNovels.filter(n => n.status === 'pending').length,
      verified: mockNovels.filter(n => n.status === 'ready_for_acceptance').length,
      accepted: mockNovels.filter(n => n.status === 'accepted_unpublished').length,
      published: mockNovels.filter(n => n.status === 'published').length
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-slate-800/30 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Gestion des Romans ({stats.novels.total})
          </h2>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm truncate">En attente</p>
              <p className="text-white text-lg sm:text-xl font-bold">
                {stats.novels.pending}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm truncate">Vérifiés</p>
              <p className="text-white text-lg sm:text-xl font-bold">
                {stats.novels.verified}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm truncate">Acceptés</p>
              <p className="text-white text-lg sm:text-xl font-bold">
                {stats.novels.accepted}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm truncate">Publiés</p>
              <p className="text-white text-lg sm:text-xl font-bold">
                {stats.novels.published}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm truncate">Total</p>
              <p className="text-white text-lg sm:text-xl font-bold">
                {stats.novels.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 lg:p-6 border border-slate-700/50" style={{ zIndex: 1 }}>
        <div className="space-y-4 lg:space-y-6">
          {/* Recherche - Pleine largeur */}
          <div className="w-full">
            <div className="relative max-w-none">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un roman par titre ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 lg:py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm lg:text-base transition-all duration-200"
              />
            </div>
          </div>
          
          {/* Filtres - Layout grid moderne pour desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {/* Filtre de statut */}
            <div className="lg:col-span-1">
              <StatusFilter
                selectedStatus={filterStatus}
                onStatusChange={setFilterStatus}
                availableStatuses={availableStatuses}
              />
            </div>
            
            {/* Filtre d'auteur */}
            <div className="lg:col-span-1">
              <AuthorFilter
                selectedAuthor={filterAuthor}
                onAuthorChange={setFilterAuthor}
                availableAuthors={availableAuthors}
              />
            </div>
            
            {/* Filtre par catégories - Prend 2 colonnes sur large écran */}
            <div className="md:col-span-2 lg:col-span-2">
              <CategoryFilter
                selectedCategories={filterCategories}
                onCategoriesChange={setFilterCategories}
                availableCategories={availableCategories}
              />
            </div>
          </div>
          
          {/* Résumé des filtres actifs (desktop uniquement) */}
          {(filterStatus !== 'all' || filterAuthor !== 'all' || filterCategories.length > 0) && (
            <div className="hidden lg:flex items-center gap-3 pt-2 border-t border-slate-700/50">
              <span className="text-sm text-gray-400 font-medium">Filtres actifs:</span>
              <div className="flex flex-wrap gap-2">
                {filterStatus !== 'all' && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
                    {filterStatus === 'pending' && 'En attente'}
                    {filterStatus === 'accepted_unpublished' && 'Accepté'}
                    {filterStatus === 'published' && 'Publié'}
                    {filterStatus === 'unpublished' && 'Dépublié'}
                  </span>
                )}
                {filterAuthor !== 'all' && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
                    {availableAuthors.find(a => a.id.toString() === filterAuthor)?.name}
                  </span>
                )}
                {filterCategories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                    {cat}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterAuthor('all');
                  setFilterCategories([]);
                }}
                className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium hover:bg-red-500/30 transition-colors"
              >
                Effacer tout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table/Liste - Optimisée pour mobile */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
        {/* Version mobile - Cards */}
        <div className="block sm:hidden">
          <div className="divide-y divide-slate-700/50">
            {currentItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-700/25 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {item.author} • {item.chaptersCount} chapitres
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(item.status)}
                        <span className={getStatusBadge(item.status)}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      {item.categories && item.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.categories.slice(0, 3).map(categoryId => {
                            const categoryMap = {
                              'fantasy': { name: 'Fantasy', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                              'sci-fi': { name: 'Sci-Fi', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                              'romance': { name: 'Romance', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
                              'thriller': { name: 'Thriller', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                              'horror': { name: 'Horreur', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
                              'mystery': { name: 'Mystère', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
                              'historical': { name: 'Historique', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                              'adventure': { name: 'Aventure', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                              'drama': { name: 'Drame', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
                            };
                            const category = categoryMap[categoryId];
                            
                            if (!category) return null;
                            
                            return (
                              <span
                                key={categoryId}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${category.color}`}
                              >
                                {category.name}
                              </span>
                            );
                          })}
                          {item.categories.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-slate-500/30 bg-slate-500/20 text-slate-400">
                              +{item.categories.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ActionMenu
                      item={item}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onQuickAction={handleQuickAction}
                      onViewChapters={handleViewChapters}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version desktop - Table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="w-1/3 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Roman
                </th>
                <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Catégorie
                </th>
                <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="w-16 px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/25 transition-colors">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate text-sm sm:text-base">{item.title}</p>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {item.chaptersCount} chapitres
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-white truncate text-sm">{item.author}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={getStatusBadge(item.status)}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.categories && item.categories.length > 0 ? (
                        item.categories.slice(0, 2).map(categoryId => {
                          const categoryMap = {
                            'fantasy': { name: 'Fantasy', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                            'sci-fi': { name: 'Sci-Fi', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                            'romance': { name: 'Romance', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
                            'thriller': { name: 'Thriller', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                            'horror': { name: 'Horreur', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
                            'mystery': { name: 'Mystère', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
                            'historical': { name: 'Historique', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                            'adventure': { name: 'Aventure', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                            'drama': { name: 'Drame', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
                          };
                          const category = categoryMap[categoryId];
                          
                          if (!category) return null;
                          
                          return (
                            <span
                              key={categoryId}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${category.color}`}
                            >
                              {category.name}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-400 text-xs italic">Aucune catégorie</span>
                      )}
                      {item.categories && item.categories.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-slate-500/30 bg-slate-500/20 text-slate-400">
                          +{item.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden lg:table-cell">
                    <span className="text-gray-300 text-sm">{item.submittedAt}</span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <ActionMenu
                      item={item}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onQuickAction={handleQuickAction}
                      onViewChapters={handleViewChapters}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun élément trouvé */}
        {currentItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">Aucun roman trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modales */}
      <DeleteContentDialog
        isOpen={showDeleteDialog}
        setIsOpen={setShowDeleteDialog}
        item={selectedItem}
        type="novels"
        onConfirm={confirmDelete}
      />

      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        item={selectedItem}
        type="novels"
        onEdit={handleEdit}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
        type="novels"
        onSave={(formData, imageFile) => {
          console.log('Sauvegarder:', formData, imageFile);
          setShowEditModal(false);
        }}
      />

      <QuickActionModal
        isOpen={showQuickActionModal}
        onClose={() => setShowQuickActionModal(false)}
        item={selectedItem}
        actionType={quickActionType}
        onConfirm={async (reason) => {
          console.log('Action confirmée:', quickActionType, selectedItem, reason);
          setShowQuickActionModal(false);
        }}
      />
    </div>
  );
};

export default AuthorsContent; 