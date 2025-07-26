import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, MessageSquare, Eye, Heart, Filter, TrendingUp, TrendingDown, UserCheck, Users } from 'lucide-react';
import DropdownFilter from '../../common/DropdownFilter';
import { PostCard, PostModal, DeletePostModal } from '../../authors/posts';
import { Pagination } from '../table';

// Données mockées étendues avec plusieurs auteurs
const mockAuthors = [
  { id: 1, name: 'Alice Martin', avatar: null, email: 'alice@example.com' },
  { id: 2, name: 'Bob Dupont', avatar: null, email: 'bob@example.com' },
  { id: 3, name: 'Claire Rousseau', avatar: null, email: 'claire@example.com' },
  { id: 4, name: 'David Leroy', avatar: null, email: 'david@example.com' },
  { id: 5, name: 'Emma Dubois', avatar: null, email: 'emma@example.com' },
  { id: 6, name: 'Marc Laurent', avatar: null, email: 'marc@example.com' },
  { id: 7, name: 'Sophie Martin', avatar: null, email: 'sophie@example.com' }
];

const mockAllAuthorPosts = [
  {
    id: 1,
    title: "Nouvelle histoire en cours d'écriture",
    content: "Bonjour chers lecteurs ! Je travaille actuellement sur une nouvelle série qui vous plaira sûrement. Cette histoire mélange aventure et mystère dans un univers fantastique unique...",
    status: 'published',
    type: 'announcement',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    views: 245,
    likes: 32,
    comments: 8,
    authorId: 1,
    authorName: 'Alice Martin',
    image: null,
    imagePreview: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop&crop=center'
  },
  {
    id: 2,
    title: "Merci pour vos commentaires",
    content: "Je voulais vous remercier pour tous vos retours positifs sur le dernier chapitre. Vos commentaires m'inspirent énormément et m'aident à améliorer mon écriture !",
    status: 'published',
    type: 'general',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-13',
    views: 156,
    likes: 28,
    comments: 15,
    authorId: 2,
    authorName: 'Bob Dupont',
    image: null,
    imagePreview: null
  },
  {
    id: 3,
    title: "Pause dans la publication",
    content: "Je vais prendre une petite pause la semaine prochaine pour me concentrer sur l'intrigue du prochain chapitre. J'ai quelques idées passionnantes à développer...",
    status: 'draft',
    type: 'announcement',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    views: 0,
    likes: 0,
    comments: 0,
    authorId: 3,
    authorName: 'Claire Rousseau',
    image: null,
    imagePreview: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop&crop=center'
  },
  {
    id: 4,
    title: "Nouveau chapitre disponible !",
    content: "Le chapitre 25 de 'Les Gardiens de l'Aube' est maintenant disponible ! Découvrez ce qui arrive à nos héros dans cette nouvelle aventure palpitante.",
    status: 'published',
    type: 'announcement',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    views: 320,
    likes: 45,
    comments: 12,
    authorId: 4,
    authorName: 'David Leroy',
    image: null,
    imagePreview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center'
  },
  {
    id: 5,
    title: "Question aux lecteurs",
    content: "J'aimerais avoir votre avis sur la direction que prend l'histoire. Quel personnage aimeriez-vous voir davantage développé ?",
    status: 'published',
    type: 'general',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11',
    views: 89,
    likes: 15,
    comments: 23,
    authorId: 5,
    authorName: 'Emma Dubois',
    image: null,
    imagePreview: null
  },
  {
    id: 6,
    title: "Concours de fan art !",
    content: "Je lance un concours de fan art pour mes romans ! Les meilleurs dessins seront intégrés dans les prochains chapitres. Participez nombreux !",
    status: 'published',
    type: 'announcement',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    views: 412,
    likes: 67,
    comments: 34,
    authorId: 6,
    authorName: 'Marc Laurent',
    image: null,
    imagePreview: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop&crop=center'
  },
  {
    id: 7,
    title: "Mise à jour du calendrier",
    content: "Petite mise à jour concernant le planning de publication. Les chapitres sortiront désormais tous les mardis et vendredis !",
    status: 'published',
    type: 'general',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-09',
    views: 203,
    likes: 38,
    comments: 7,
    authorId: 7,
    authorName: 'Sophie Martin',
    image: null,
    imagePreview: null
  },
  {
    id: 8,
    title: "Réflexions sur l'écriture",
    content: "Aujourd'hui je voulais partager avec vous quelques réflexions sur mon processus d'écriture et comment je développe mes personnages...",
    status: 'draft',
    type: 'general',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    views: 0,
    likes: 0,
    comments: 0,
    authorId: 1,
    authorName: 'Alice Martin',
    image: null,
    imagePreview: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&h=400&fit=crop&crop=center'
  }
];

export default function AdminAuthorPostsSection() {
  const [posts, setPosts] = useState(mockAllAuthorPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);
  
  // États pour les modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Options pour les filtres
  const authorOptions = [
    { 
      value: 'all', 
      label: 'Tous les auteurs',
      icon: Users,
      color: 'text-gray-400'
    },
    ...mockAuthors.map(author => ({ 
      value: author.id.toString(), 
      label: author.name,
      icon: User,
      color: 'text-blue-400'
    }))
  ];

  const sortOptions = [
    { 
      value: 'date_desc', 
      label: 'Plus récents',
      icon: TrendingDown,
      color: 'text-blue-400'
    },
    { 
      value: 'date_asc', 
      label: 'Plus anciens',
      icon: TrendingUp,
      color: 'text-gray-400'
    },
    { 
      value: 'views_desc', 
      label: 'Plus vus',
      icon: Eye,
      color: 'text-purple-400'
    },
    { 
      value: 'likes_desc', 
      label: 'Plus aimés',
      icon: Heart,
      color: 'text-red-400'
    },
    { 
      value: 'author_asc', 
      label: 'Auteur A-Z',
      icon: UserCheck,
      color: 'text-cyan-400'
    },
    { 
      value: 'author_desc', 
      label: 'Auteur Z-A',
      icon: UserCheck,
      color: 'text-orange-400'
    }
  ];

  // Filtrage et tri des posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAuthor = filterAuthor === 'all' || post.authorId.toString() === filterAuthor;
      
      return matchesSearch && matchesAuthor;
    });

    // Tri
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'views_desc':
          return b.views - a.views;
        case 'likes_desc':
          return b.likes - a.likes;
        case 'comments_desc':
          return b.comments - a.comments;
        case 'author_asc':
          return a.authorName.localeCompare(b.authorName);
        case 'author_desc':
          return b.authorName.localeCompare(a.authorName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchTerm, filterAuthor, sortBy]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

  // Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterAuthor, sortBy]);

  // Statistiques
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterAuthor('all');
    setSortBy('date_desc');
  };

  const hasActiveFilters = searchTerm || filterAuthor !== 'all' || sortBy !== 'date_desc';

  // Fonctions pour les modals
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = (postData) => {
    setPosts(posts.map(post => 
      post.id === selectedPost.id ? { 
        ...post, 
        title: postData.title,
        content: postData.content,
        status: postData.status,
        type: postData.type,
        image: postData.image,
        imagePreview: postData.imagePreview,
        updatedAt: new Date().toISOString().split('T')[0]
      } : post
    ));
    setSelectedPost(null);
  };

  const handleDeletePost = (post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = () => {
    setPosts(posts.filter(post => post.id !== selectedPost.id));
    setSelectedPost(null);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 w-full min-w-0 overflow-hidden">
      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="bg-slate-800/80 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-center border border-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
          <div className="flex items-center mb-1">
            <span className="text-xs sm:text-sm text-gray-400">Total Posts</span>
          </div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-white">{totalPosts}</p>
        </div>
        
        <div className="bg-slate-800/80 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-center border border-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-400">Publiés</span>
          </div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-green-400">{publishedPosts}</p>
        </div>
        
        <div className="bg-slate-800/80 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-center border border-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-400">Brouillons</span>
          </div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-yellow-400">{draftPosts}</p>
        </div>
        
        <div className="bg-slate-800/80 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-center border border-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm text-gray-400">Vues</span>
          </div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-400">{totalViews.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-800/80 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-center border border-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
            <span className="text-xs sm:text-sm text-gray-400">Likes</span>
          </div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-pink-400">{totalLikes.toLocaleString()}</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-3 sm:p-4 md:p-6 w-full overflow-hidden">
        <div className="space-y-3 sm:space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par titre, contenu ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
            />
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <DropdownFilter
              label="Auteur"
              options={authorOptions}
              value={filterAuthor}
              onChange={setFilterAuthor}
            />
            <DropdownFilter
              label="Tri"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="w-full px-3 sm:px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 disabled:bg-gray-700/30 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Filtres actifs */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-700/50">
              <span className="text-gray-400 text-xs sm:text-sm">Filtres actifs:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs">
                  "{searchTerm}"
                </span>
              )}
              {filterAuthor !== 'all' && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs">
                  {authorOptions.find(opt => opt.value === filterAuthor)?.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
        <span>
          {filteredAndSortedPosts.length} post{filteredAndSortedPosts.length !== 1 ? 's' : ''} trouvé{filteredAndSortedPosts.length !== 1 ? 's' : ''}
          {hasActiveFilters && ` (sur ${totalPosts} au total)`}
        </span>
        <span>
          Page {currentPage} sur {totalPages || 1}
        </span>
      </div>

      {/* Liste des posts */}
      <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          <div className="text-center py-8 sm:py-12">
            <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-400 text-base sm:text-lg mb-2">Aucun post trouvé</p>
            <p className="text-gray-500 text-xs sm:text-sm">
              {hasActiveFilters 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Aucun post d\'auteur disponible'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modals */}
      <PostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdatePost}
        post={selectedPost}
        title="Modifier le post"
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        post={selectedPost}
        onConfirm={confirmDeletePost}
      />
    </div>
  );
}; 