import React, { useState, useEffect } from 'react';
import { Plus, Users, Heart, MessageCircle, Eye } from 'lucide-react';
import DropdownFilter from '../../components/common/DropdownFilter';
import { 
  StatsCard, 
  PostCard, 
  PostModal, 
  DeletePostModal, 
  SearchBar 
} from '../../components/authors/posts';

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données de test pour les abonnés (juste pour le compteur)
  const mockSubscribers = [
    { id: 1, name: 'Alice Martin', avatar: null, subscribedAt: '2024-01-10', isActive: true },
    { id: 2, name: 'Bob Dupont', avatar: null, subscribedAt: '2024-01-08', isActive: true },
    { id: 3, name: 'Claire Moreau', avatar: null, subscribedAt: '2024-01-05', isActive: false },
    { id: 4, name: 'David Bernard', avatar: null, subscribedAt: '2024-01-03', isActive: true },
    { id: 5, name: 'Emma Rousseau', avatar: null, subscribedAt: '2024-01-01', isActive: true }
  ];

  // Données de test avec exemples d'images
  const mockPosts = [
    {
      id: 1,
      title: "Nouvelle histoire en cours d'écriture",
      content: "Bonjour chers lecteurs ! Je travaille actuellement sur une nouvelle série qui vous plaira sûrement. Cette histoire mélange aventure et mystère dans un univers fantastique unique...",
      status: 'published',
      type: 'announcement',
      createdAt: '2024-01-15',
      views: 245,
      likes: 32,
      comments: 8,
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
      views: 156,
      likes: 28,
      comments: 15,
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
      views: 0,
      likes: 0,
      comments: 0,
      image: null,
      imagePreview: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop&crop=center'
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreatePost = (postData) => {
    const post = {
      id: posts.length + 1,
      title: postData.title,
      content: postData.content,
      status: postData.status,
      type: postData.type,
      image: postData.image,
      imagePreview: postData.imagePreview,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      comments: 0
    };
    setPosts([post, ...posts]);
  };

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
        imagePreview: postData.imagePreview
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

  const activeSubscribers = mockSubscribers.filter(sub => sub.isActive);

  // Options pour le dropdown de filtre de statut
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'published', label: 'Publiés' },
    { value: 'draft', label: 'Brouillons' }
  ];

  // Données pour les cartes de statistiques
  const statsData = [
    {
      title: 'Total Posts',
      value: posts.length,
      subtitle: '+2 ce mois',
      icon: MessageCircle,
      color: 'blue'
    },
    {
      title: 'Vues Total',
      value: posts.reduce((total, post) => total + post.views, 0),
      subtitle: '+15% cette semaine',
      icon: Eye,
      color: 'green'
    },
    {
      title: 'Likes Total',
      value: posts.reduce((total, post) => total + post.likes, 0),
      subtitle: '+8 aujourd\'hui',
      icon: Heart,
      color: 'pink'
    }
    // Abonnés supprimé
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Mes Posts</h1>
          <p className="text-gray-400">Partagez des actualités et communiquez avec vos lecteurs</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Nouveau Post
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center items-stretch mb-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un post..."
        />
        
        <div className="w-full sm:w-auto sm:min-w-[180px]">
          <DropdownFilter
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </div>
      </div>

      {/* Liste des posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun post trouvé</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Créer votre premier post
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <PostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        title="Créer un nouveau post"
      />

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

export default AuthorPosts; 