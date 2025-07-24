import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../components/NavigationManager';
import { useScrollToTop } from '../../hooks';
import {
  NovelHeader,
  LatestChapters,
  ChapterList,
  CommentsSection
} from '../../components/novel';
import UserNovelsModal from '../../components/members/UserNovelsModal';

// Données mockées - à remplacer par des vraies données API
const mockNovel = {
  id: 1,
  title: "Les Chroniques d'Aether",
  author: "Emma Laurent",
  authorId: 'author_1',
  image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop&crop=center",
  category: "Fantasy",
  status: "en_cours",
  chapters: 25,
  views: 12500,
  favorites: 1247,
  comments: 423,
  rating: 4.8,
  description: "Une épopée fantastique dans un monde où la magie et la technologie coexistent. Suivez l'aventure d'Aria, une jeune mage qui découvre qu'elle détient le pouvoir de changer le destin de deux mondes. Dans une quête pour sauver son royaume, elle devra affronter des ennemis redoutables et découvrir des vérités sur son passé qui bouleverseront tout ce qu'elle croyait savoir.",
  tags: ["Fantasy", "Magie", "Aventure", "Romance"],
  publishedAt: "2023-06-15",
  updatedAt: "2024-01-25",
  totalWords: 125000,
  isNew: true, // Si c'est un nouveau roman pour l'utilisateur
  lastReadChapter: null // Dernier chapitre lu par l'utilisateur
};

// Données mockées étendues pour plus de chapitres (simuler beaucoup de chapitres récents)
const mockChapters = [
  {
    id: 1,
    number: 1,
    title: "Prologue - Un nouveau monde",
    publishedAt: "2023-06-15",
    status: "published",
    wordCount: 2500,
    views: 1200,
    isRead: true
  },
  {
    id: 2,
    number: 2,
    title: "Chapitre 1 - L'éveil des pouvoirs",
    publishedAt: "2023-06-22",
    status: "published",
    wordCount: 3200,
    views: 1150,
    isRead: true
  },
  {
    id: 3,
    number: 3,
    title: "Chapitre 2 - La première mission",
    publishedAt: "2023-06-29",
    status: "published",
    wordCount: 2800,
    views: 1100,
    isRead: false
  },
  {
    id: 4,
    number: 4,
    title: "Chapitre 3 - Secrets du passé",
    publishedAt: "2023-07-06",
    status: "published",
    wordCount: 3500,
    views: 950,
    isRead: false
  },
  {
    id: 5,
    number: 5,
    title: "Chapitre 4 - L'alliance inattendue",
    publishedAt: "2023-07-13",
    status: "published",
    wordCount: 3100,
    views: 890,
    isRead: false
  },
  {
    id: 6,
    number: 6,
    title: "Chapitre 5 - La révélation",
    publishedAt: "2024-01-20",
    status: "published",
    wordCount: 4200,
    views: 820,
    isRead: false
  },
  {
    id: 7,
    number: 7,
    title: "Chapitre 6 - Le combat final",
    publishedAt: "2024-01-21",
    status: "published",
    wordCount: 3800,
    views: 750,
    isRead: false
  },
  {
    id: 8,
    number: 8,
    title: "Chapitre 7 - Nouveau départ",
    publishedAt: "2024-01-22",
    status: "published",
    wordCount: 3600,
    views: 680,
    isRead: false
  },
  {
    id: 9,
    number: 9,
    title: "Chapitre 8 - Le mystère s'épaissit",
    publishedAt: "2024-01-23",
    status: "published",
    wordCount: 3900,
    views: 620,
    isRead: false
  },
  {
    id: 10,
    number: 10,
    title: "Chapitre 9 - Retour aux sources",
    publishedAt: "2024-01-24",
    status: "published",
    wordCount: 4100,
    views: 580,
    isRead: false
  },
  {
    id: 11,
    number: 11,
    title: "Chapitre 10 - Une nouvelle menace",
    publishedAt: "2024-01-25",
    status: "published",
    wordCount: 3700,
    views: 520,
    isRead: false
  },
  {
    id: 12,
    number: 12,
    title: "Chapitre 11 - L'union fait la force",
    publishedAt: "2024-01-26",
    status: "published",
    wordCount: 4000,
    views: 480,
    isRead: false
  }
];

// Données mockées avec réponses
const mockReplies = {
  1: [
    {
      id: 101,
      user: { name: "Alex Rousseau", avatar: null, isAuthor: false },
      content: "Je suis totalement d'accord ! L'auteur maîtrise vraiment son art.",
      publishedAt: "2024-01-25T11:00:00Z",
      likes: 3,
      isLiked: false
    },
    {
      id: 102,
      user: { name: "Emma Laurent", avatar: null, isAuthor: true },
      content: "Merci beaucoup pour vos encouragements ! 😊",
      publishedAt: "2024-01-25T11:30:00Z",
      likes: 8,
      isLiked: true
    }
  ],
  3: [
    {
      id: 103,
      user: { name: "Julie Martin", avatar: null, isAuthor: false },
      content: "Oui ! J'ai hâte de voir comment ça va évoluer !",
      publishedAt: "2024-01-24T21:00:00Z",
      likes: 5,
      isLiked: false
    }
  ]
};

const mockComments = [
  {
    id: 1,
    user: {
      name: "Marie Dubois",
      avatar: null,
      isAuthor: false
    },
    content: "Absolument captivant ! L'univers est si bien construit et les personnages si attachants. J'ai hâte de lire la suite !",
    publishedAt: "2024-01-25T10:30:00Z",
    likes: 15,
    replies: 2,
    isLiked: false
  },
  {
    id: 2,
    user: {
      name: "Pierre Martin",
      avatar: null,
      isAuthor: false
    },
    content: "Emma Laurent a vraiment un talent pour nous transporter dans son monde. Chaque chapitre me laisse sur ma faim !",
    publishedAt: "2024-01-24T18:45:00Z",
    likes: 12,
    replies: 1,
    isLiked: true
  },
  {
    id: 3,
    user: {
      name: "Emma Laurent",
      avatar: null,
      isAuthor: true
    },
    content: "Merci pour tous vos commentaires encourageants ! Le prochain chapitre arrive bientôt avec de grandes révélations 😊",
    publishedAt: "2024-01-24T20:15:00Z",
    likes: 45,
    replies: 1,
    isLiked: false
  },
  {
    id: 4,
    user: {
      name: "Sophie Durand",
      avatar: null,
      isAuthor: false
    },
    content: "J'adore cette série ! Les rebondissements sont parfaitement dosés et l'écriture est fluide. Bravo !",
    publishedAt: "2024-01-23T14:20:00Z",
    likes: 8,
    replies: 0,
    isLiked: false
  },
  {
    id: 5,
    user: {
      name: "Lucas Bernard",
      avatar: null,
      isAuthor: false
    },
    content: "Le développement des personnages est exceptionnel. On s'attache vraiment à chacun d'eux.",
    publishedAt: "2024-01-22T09:15:00Z",
    likes: 6,
    replies: 0,
    isLiked: true
  }
];

const mockNovelsByAuthor = {
  1: [
    {
      id: 101,
      title: "Les Chroniques d'Aether",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
      description: "Une épopée fantastique dans un monde où la magie et la technologie s'affrontent.",
      chapters: 25,
      views: 12500,
      likes: 1247,
      comments: 423,
      status: "in_progress"
    },
    {
      id: 102,
      title: "Le Souffle du Nord",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=center",
      description: "Un voyage initiatique à travers des terres gelées et hostiles.",
      chapters: 18,
      views: 8200,
      likes: 900,
      comments: 120,
      status: "completed"
    },
    {
      id: 103,
      title: "L'Éveil des Ombres",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=400&fit=crop&crop=center",
      description: "Un roman sombre où les secrets de famille refont surface.",
      chapters: 20,
      views: 9500,
      likes: 1100,
      comments: 210,
      status: "in_progress"
    },
    {
      id: 104,
      title: "La Légende du Phénix",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=400&fit=crop&crop=center",
      description: "Une aventure épique à travers des terres en feu.",
      chapters: 22,
      views: 10400,
      likes: 980,
      comments: 180,
      status: "completed"
    },
    {
      id: 105,
      title: "Les Jardins du Temps",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=400&fit=crop&crop=center",
      description: "Un voyage poétique entre passé et futur.",
      chapters: 16,
      views: 6700,
      likes: 800,
      comments: 90,
      status: "in_progress"
    }
  ]
};

const NovelDetails = () => {
  const { id } = useParams();
  const { navigateToChapter } = useNavigation();
  useScrollToTop();
  
  // États pour les filtres des chapitres
  const [chapterFilter, setChapterFilter] = useState('all');
  const [chapterSearch, setChapterSearch] = useState('');
  const [chapterSort, setChapterSort] = useState('newest');
  
  // États pour la pagination des chapitres (50 par page)
  const [currentChapterPage, setCurrentChapterPage] = useState(1);
  const chaptersPerPage = 50;
  
  // États pour les derniers chapitres
  const [showAllLatestChapters, setShowAllLatestChapters] = useState(false);
  const [currentLatestChapterPage, setCurrentLatestChapterPage] = useState(1);
  const latestChaptersPerPage = 6;
  
  // États pour les commentaires
  const [commentSort, setCommentSort] = useState('newest');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  // États pour les réponses
  const [expandedComments, setExpandedComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // États pour la pagination des commentaires
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 3;
  
  // États pour les interactions
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedNovels, setSelectedNovels] = useState([]);

  // Filtrage et tri des chapitres
  const filteredAndSortedChapters = useMemo(() => {
    let filtered = mockChapters.filter(chapter => {
      const matchesSearch = chapter.title.toLowerCase().includes(chapterSearch.toLowerCase());
      const matchesFilter = chapterFilter === 'all' || 
                           (chapterFilter === 'read' && chapter.isRead) ||
                           (chapterFilter === 'unread' && !chapter.isRead);
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      if (chapterSort === 'oldest') {
        return new Date(a.publishedAt) - new Date(b.publishedAt);
      } else {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });

    return filtered;
  }, [chapterSearch, chapterFilter, chapterSort]);

  // Pagination des chapitres
  const totalChapterPages = Math.ceil(filteredAndSortedChapters.length / chaptersPerPage);
  const startChapterIndex = (currentChapterPage - 1) * chaptersPerPage;
  const currentChapters = filteredAndSortedChapters.slice(startChapterIndex, startChapterIndex + chaptersPerPage);

  // Adapter les données des commentaires pour le nouveau format
  const adaptedComments = mockComments.map(comment => ({
    ...comment,
    author: comment.user?.name || 'Utilisateur anonyme',
    avatar: comment.user?.avatar,
    createdAt: comment.publishedAt,
    repliesCount: comment.replies || 0
  }));

  // Adapter les données des réponses pour le nouveau format
  const adaptedReplies = {};
  Object.keys(mockReplies).forEach(commentId => {
    adaptedReplies[commentId] = mockReplies[commentId].map(reply => ({
      ...reply,
      author: reply.user?.name || 'Utilisateur anonyme',
      avatar: reply.user?.avatar,
      createdAt: reply.publishedAt
    }));
  });

  // Tri des commentaires adaptés
  const sortedAdaptedComments = useMemo(() => {
    const sorted = [...adaptedComments];
    switch (commentSort) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'likes':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [adaptedComments, commentSort]);

  // Calcul de la pagination des commentaires
  const totalCommentPages = Math.ceil(sortedAdaptedComments.length / commentsPerPage);

  // Obtenir les derniers chapitres ajoutés avec pagination
  const allLatestChapters = useMemo(() => {
    return [...mockChapters]
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .filter((_, index) => new Date(mockChapters[index]?.publishedAt || 0) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // Derniers 30 jours
  }, []);

  const totalLatestChapterPages = Math.ceil(allLatestChapters.length / latestChaptersPerPage);
  const startLatestChapterIndex = (currentLatestChapterPage - 1) * latestChaptersPerPage;
  const currentLatestChapters = showAllLatestChapters 
    ? allLatestChapters.slice(startLatestChapterIndex, startLatestChapterIndex + latestChaptersPerPage)
    : allLatestChapters.slice(0, 3);

  // Fonctions utilitaires
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "il y a 1 jour";
    if (diffDays < 7) return `il y a ${diffDays} jours`;
    if (diffDays < 30) return `il y a ${Math.ceil(diffDays / 7)} semaine${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR');
  };

  const getAvatarInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Handlers
  const handleChapterClick = (chapter) => {
    console.log('Lecture du chapitre:', chapter.title);
    navigateToChapter(id, chapter.number);
  };

  const handleStartReading = () => {
    if (mockNovel.lastReadChapter) {
      // Continuer la lecture au dernier chapitre lu
      navigateToChapter(id, mockNovel.lastReadChapter + 1);
    } else {
      // Commencer par le premier chapitre
      navigateToChapter(id, 1);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    console.log('Nouveau commentaire:', newComment);
    setNewComment('');
    setShowCommentForm(false);
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    console.log('Nouvelle réponse pour le commentaire', commentId, ':', replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  const handleCommentLike = (commentId) => {
    console.log('Like commentaire:', commentId);
  };

  const handleReplyLike = (commentId, replyId) => {
    console.log('Like réponse:', commentId, replyId);
  };

  const handleToggleReplies = (commentId) => {
    setExpandedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  // Handler pour ouvrir la popup sur le nom de l'auteur
  const handleAuthorClick = () => {
    setSelectedUser({ name: mockNovel.author, role: 'author' });
    setSelectedNovels(mockNovelsByAuthor[1] || []);
    setOpenModal(true);
  };

  return (
    <div className="min-h-screen">
      
      {/* Header du roman */}
      <div className="relative">
        <NovelHeader
          novel={mockNovel}
          isFavorited={isFavorited}
          setIsFavorited={setIsFavorited}
          isBookmarked={isBookmarked}
          setIsBookmarked={setIsBookmarked}
          onStartReading={handleStartReading}
          onAuthorClick={handleAuthorClick}
        />
      </div>

      {/* Section Derniers chapitres ajoutés */}
      <LatestChapters
        chapters={currentLatestChapters}
        showAllLatestChapters={showAllLatestChapters}
        setShowAllLatestChapters={setShowAllLatestChapters}
        currentLatestChapterPage={currentLatestChapterPage}
        setCurrentLatestChapterPage={setCurrentLatestChapterPage}
        totalLatestChapterPages={totalLatestChapterPages}
        onChapterClick={handleChapterClick}
        formatDate={formatDate}
      />

      {/* Section Chapitres avec pagination et tri améliorés */}
      <ChapterList
        chapters={currentChapters}
        chapterFilter={chapterFilter}
        setChapterFilter={setChapterFilter}
        chapterSearch={chapterSearch}
        setChapterSearch={setChapterSearch}
        chapterSort={chapterSort}
        setChapterSort={setChapterSort}
        currentChapterPage={currentChapterPage}
        setCurrentChapterPage={setCurrentChapterPage}
        totalChapterPages={totalChapterPages}
        onChapterClick={handleChapterClick}
        formatDate={formatDate}
      />

      {/* Section Commentaires avec système de réponses */}
      <CommentsSection
        comments={sortedAdaptedComments.slice((currentCommentPage - 1) * commentsPerPage, currentCommentPage * commentsPerPage)}
        replies={adaptedReplies}
        commentSort={commentSort}
        setCommentSort={setCommentSort}
        showCommentForm={showCommentForm}
        setShowCommentForm={setShowCommentForm}
        newComment={newComment}
        setNewComment={setNewComment}
        currentCommentPage={currentCommentPage}
        setCurrentCommentPage={setCurrentCommentPage}
        totalCommentPages={totalCommentPages}
        expandedComments={expandedComments}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        replyText={replyText}
        setReplyText={setReplyText}
        onCommentSubmit={handleCommentSubmit}
        onCommentLike={handleCommentLike}
        onReplySubmit={handleReplySubmit}
        onReplyLike={handleReplyLike}
        onToggleReplies={handleToggleReplies}
        formatDate={formatDate}
        getAvatarInitials={getAvatarInitials}
      />
      {/* Popup romans de l'auteur */}
      <UserNovelsModal open={openModal} onClose={() => setOpenModal(false)} user={selectedUser} novels={selectedNovels} />

    </div>
  );
};

export default NovelDetails; 