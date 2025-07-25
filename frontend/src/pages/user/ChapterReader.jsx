import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from "../../components";
import { useScrollToTopOnChange } from '../../hooks';
import {
  ChapterHeader,
  ChapterMobileMenu,
  ReadingSettings,
  ChapterContent,
  ChapterNavigation
} from '../../components/reader';
import CommentsSection from '../../components/novel/CommentsSection';
import { Maximize2, Minimize2, Sun, Moon } from 'lucide-react';

// Données mockées pour tous les chapitres du roman
const mockAllChapters = [
  {
    id: 1,
    number: 1,
    title: "Prologue - Un nouveau monde",
    isRead: false
  },
  {
    id: 2,
    number: 2,
    title: "Chapitre 1 - L'éveil des pouvoirs",
    isRead: false
  },
  {
    id: 3,
    number: 3,
    title: "Chapitre 2 - Les émissaires",
    isRead: false
  },
  {
    id: 4,
    number: 4,
    title: "Chapitre 3 - Le premier contact",
    isRead: false
  },
  {
    id: 5,
    number: 5,
    title: "Chapitre 4 - L'alliance inattendue",
    isRead: false
  },
  {
    id: 6,
    number: 6,
    title: "Chapitre 5 - La révélation",
    isRead: false
  },
  {
    id: 7,
    number: 7,
    title: "Chapitre 6 - Le combat final",
    isRead: false
  },
  {
    id: 8,
    number: 8,
    title: "Chapitre 7 - Nouveau départ",
    isRead: false
  },
  {
    id: 9,
    number: 9,
    title: "Chapitre 8 - Le mystère s'épaissit",
    isRead: false
  },
  {
    id: 10,
    number: 10,
    title: "Chapitre 9 - L'ultime sacrifice",
    isRead: false
  }
];

// Données mockées pour le chapitre
const mockChapterData = {
  1: {
    id: 1,
    number: 1,
    title: "Prologue - Un nouveau monde",
    novel: {
      id: 1,
      title: "Les Chroniques d'Eternia",
      author: "Emma Laurent"
    },
    content: `
      Dans les brumes matinales qui enveloppaient la cité d'Eternia, Aria se dressait sur les remparts de cristal, contemplant l'horizon où deux soleils se levaient lentement. Le premier, d'un éclat doré familier, réchauffait son visage comme il l'avait fait chaque matin de ses dix-huit années d'existence. Le second, plus petit et d'une teinte argentée mystérieuse, était apparu il y a trois jours, bouleversant l'ordre naturel du monde.

      "Encore ce rêve étrange," murmura-t-elle en portant une main à son front où perlaient quelques gouttes de sueur froide. Depuis l'apparition du second soleil, ses nuits étaient peuplées de visions incompréhensibles : des terres désolées, des créatures d'ombre et de lumière, et surtout cette voix qui l'appelait sans cesse.

      Les habitants d'Eternia s'étaient rassemblés sur la place centrale, leurs visages marqués par l'inquiétude et la confusion. Les Anciens parlaient de prophéties oubliées, tandis que les plus jeunes y voyaient le signe d'une transformation imminente. Aria, elle, sentait au fond de son être que ce changement la concernait directement.

      Son mentor, Maître Kellan, apparut silencieusement à ses côtés, sa longue robe bleue flottant dans la brise matinale. Ses yeux, d'un gris perçant qui semblait voir au-delà des apparences, se posèrent sur le double soleil avec une expression grave.

      "Le temps est venu, Aria," dit-il de sa voix profonde qui résonnait toujours avec une autorité naturelle. "Les Chroniques parlent de ce jour depuis des millénaires. Deux mondes sur le point de se rencontrer, et toi... tu es la clé de leur destinée."

      Aria se tourna vers lui, le cœur battant. "Maître, je ne comprends pas. Que voulez-vous dire par 'la clé' ? Je ne suis qu'une apprentie mage, mes pouvoirs sont encore si faibles..."

      Un sourire énigmatique éclaira le visage buriné de Kellan. "Les plus grandes forces ne se mesurent pas toujours à l'éclat qu'elles produisent, mon enfant. Parfois, c'est dans le silence et la subtilité qu'elles révèlent leur véritable puissance."

      Il tendit la main vers l'horizon, et Aria suivit son geste. Au loin, elle distingua une forme sombre qui approchait rapidement : un groupe de cavaliers vêtus d'armures scintillantes, leurs bannières claquant au vent. Mais quelque chose clochait dans leur apparence, comme s'ils n'appartenaient pas tout à fait à ce monde.

      "Ils arrivent," murmura Kellan. "Les émissaires de l'Autre Monde. Et avec eux, ton véritable voyage commence."

      Aria sentit une énergie inconnue pulser en elle, répondant à la proximité de ces étrangers. Ses mains se mirent à briller d'une lueur dorée qu'elle n'avait jamais vue auparavant, et pour la première fois, elle comprit que sa vie allait basculer à jamais.

      Le destin des deux mondes reposait désormais entre ses mains, qu'elle le veuille ou non.
    `,
    wordCount: 1205,
    readingTime: 5,
    publishedAt: "2023-06-15",
    views: 1250,
    likes: 89,
    comments: 45,
    previousChapter: null,
    nextChapter: 2
  }
};

// Données mockées pour les commentaires du chapitre
const mockChapterComments = [
  {
    id: 1,
    author: "Marie Dubois",
    content: "Quel début magnifique ! J'adore déjà l'atmosphère mystérieuse avec ces deux soleils. Aria semble être un personnage très intéressant.",
    createdAt: "2023-06-16T10:30:00Z",
    likes: 12,
    isLiked: false,
    repliesCount: 2
  },
  {
    id: 2,
    author: "Thomas Martin",
    content: "L'écriture est vraiment immersive. On se croirait vraiment dans ce monde fantastique. Hâte de voir comment Aria va évoluer !",
    createdAt: "2023-06-16T14:20:00Z",
    likes: 8,
    isLiked: true,
    repliesCount: 1
  },
  {
    id: 3,
    author: "Sophie Laurent",
    content: "J'ai adoré la description des deux soleils et l'ambiance mystérieuse. Ce prologue donne vraiment envie de continuer !",
    createdAt: "2023-06-16T16:45:00Z",
    likes: 15,
    isLiked: false,
    repliesCount: 0
  }
];

const mockChapterReplies = {
  1: [
    {
      id: 1,
      author: "Emma Laurent",
      content: "Merci beaucoup ! J'ai voulu créer une atmosphère unique dès le début. Aria va beaucoup évoluer dans les prochains chapitres !",
      createdAt: "2023-06-16T11:00:00Z",
      likes: 5,
      isLiked: false
    },
    {
      id: 2,
      author: "Pierre Moreau",
      content: "Totalement d'accord ! L'idée des deux soleils est brillante.",
      createdAt: "2023-06-16T12:15:00Z",
      likes: 3,
      isLiked: false
    }
  ],
  2: [
    {
      id: 3,
      author: "Emma Laurent",
      content: "Merci Thomas ! C'était important pour moi de créer cette immersion dès le premier chapitre.",
      createdAt: "2023-06-16T15:00:00Z",
      likes: 4,
      isLiked: false
    }
  ]
};

const ChapterReader = () => {
  const { novelId, chapterNumber } = useParams();
  const { navigateToChapter, navigateToNovel, goBack } = useNavigation();

  // États pour la lecture
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // États pour le menu des chapitres
  const [isChaptersMenuOpen, setIsChaptersMenuOpen] = useState(false);
  const [chapterSearch, setChapterSearch] = useState('');
  
  // États pour les paramètres de lecture
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [lineHeight, setLineHeight] = useState(1.6);
  
  // États pour les interactions
  const [isBookmarked, setIsBookmarked] = useState(false);

  // États pour les commentaires du chapitre
  const [comments, setComments] = useState(mockChapterComments);
  const [replies, setReplies] = useState(mockChapterReplies);
  const [commentSort, setCommentSort] = useState('newest');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [totalCommentPages] = useState(1);
  const [expandedComments, setExpandedComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Mode lecture immersive/plein écran
  const [isImmersive, setIsImmersive] = useState(false);
  const immersiveRef = React.useRef(null);
  // Mode nuit/jour pour le mode immersif (persistant dans localStorage)
  const [isNightMode, setIsNightMode] = useState(() => {
    try {
      const saved = localStorage.getItem('chapterReaderNightMode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (error) {
      return true; // Fallback si localStorage n'est pas disponible
    }
  });

  // Sauvegarder le mode nuit/jour dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chapterReaderNightMode', JSON.stringify(isNightMode));
    } catch (error) {
      // Ignorer les erreurs localStorage (mode privé, etc.)
    }
  }, [isNightMode]);

  // Données du chapitre actuel
  const chapterData = mockChapterData[chapterNumber] || mockChapterData[1];

  // Filtrage des chapitres selon la recherche
  const filteredChapters = mockAllChapters.filter(chapter =>
    chapter.title.toLowerCase().includes(chapterSearch.toLowerCase()) ||
    chapter.number.toString().includes(chapterSearch)
  );

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup quand le composant se démonte
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Scroll vers le haut quand le chapitre change
  useScrollToTopOnChange(chapterNumber);

  // Gérer l'entrée/sortie du mode plein écran navigateur
  useEffect(() => {
    if (isImmersive && immersiveRef.current) {
      if (document.fullscreenEnabled) {
        immersiveRef.current.requestFullscreen?.();
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
    // Nettoyage si on quitte la page
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
  }, [isImmersive]);

  // Fonctions de navigation
  const goToPreviousChapter = () => {
    if (chapterData.previousChapter) {
      navigateToChapter(novelId, chapterData.previousChapter);
    }
  };

  const goToNextChapter = () => {
    if (chapterData.nextChapter) {
      navigateToChapter(novelId, chapterData.nextChapter);
    }
  };

  const goBackToNovel = () => {
    goBack('chapter');
  };

  const goToChapter = (chapterNum) => {
    navigateToChapter(novelId, chapterNum);
    setIsChaptersMenuOpen(false);
    setChapterSearch('');
    
    // Scroll vers le haut après un court délai pour laisser le temps à la navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    // Scroll supplémentaire avec délai plus long pour les téléphones problématiques
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
  };

  // Fonctions pour les commentaires
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "Vous", // Remplacer par le nom de l'utilisateur connecté
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      repliesCount: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setShowCommentForm(false);
  };

  const handleCommentLike = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked 
          }
        : comment
    ));
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      author: "Vous", // Remplacer par le nom de l'utilisateur connecté
      content: replyText,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setReplies(prev => ({
      ...prev,
      [commentId]: [...(prev[commentId] || []), reply]
    }));

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, repliesCount: comment.repliesCount + 1 }
        : comment
    ));

    setReplyText('');
    setReplyingTo(null);
  };

  const handleReplyLike = (commentId, replyId) => {
    setReplies(prev => ({
      ...prev,
      [commentId]: prev[commentId]?.map(reply => 
        reply.id === replyId 
          ? { 
              ...reply, 
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
              isLiked: !reply.isLiked 
            }
          : reply
      ) || []
    }));
  };

  const handleToggleReplies = (commentId) => {
    setExpandedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAvatarInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen" ref={immersiveRef}>
      
      {/* Header avec barre de progression */}
      {!isImmersive && (
        <ChapterHeader
          chapterData={chapterData}
          isBookmarked={isBookmarked}
          setIsBookmarked={setIsBookmarked}
          setIsSettingsOpen={setIsSettingsOpen}
          setIsMenuOpen={setIsMenuOpen}
          goBackToNovel={goBackToNovel}
          isChaptersMenuOpen={isChaptersMenuOpen}
          setIsChaptersMenuOpen={setIsChaptersMenuOpen}
          chapterSearch={chapterSearch}
          setChapterSearch={setChapterSearch}
          filteredChapters={filteredChapters}
          goToChapter={goToChapter}
          chapterNumber={chapterNumber}
          isImmersive={isImmersive}
          setIsImmersive={setIsImmersive}
        />
      )}

      {/* Menu mobile */}
      {!isImmersive && (
        <ChapterMobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          chapterSearch={chapterSearch}
          setChapterSearch={setChapterSearch}
          filteredChapters={filteredChapters}
          goToChapter={goToChapter}
          chapterNumber={chapterNumber}
        />
      )}

      {/* Paramètres de lecture */}
      {!isImmersive && (
        <ReadingSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
        />
      )}

      {/* Contenu du chapitre */}
      <div
        className={
          isImmersive
            ? `fixed inset-0 z-50 flex flex-col items-center justify-center overflow-auto transition-colors duration-300 ${
                isNightMode
                  ? 'bg-black/95 text-white'
                  : 'bg-white text-gray-900'
              }`
            : ''
        }
      >
        <ChapterContent
          chapterData={chapterData}
          fontSize={fontSize}
          fontFamily={fontFamily}
          lineHeight={lineHeight}
          setReadingProgress={setReadingProgress}
        />
        {isImmersive && (
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button
              onClick={() => setIsNightMode((v) => !v)}
              className="p-3 rounded-full bg-slate-800/80 border border-slate-600/60 text-white hover:bg-slate-700/90 transition-colors shadow-lg"
              aria-label={isNightMode ? 'Passer en mode jour' : 'Passer en mode nuit'}
            >
              {isNightMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsImmersive(false)}
              className="p-3 rounded-full bg-slate-800/80 border border-slate-600/60 text-white hover:bg-slate-700/90 transition-colors shadow-lg"
              aria-label="Quitter le mode lecture immersive"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation des chapitres */}
      {!isImmersive && (
        <ChapterNavigation
          chapterData={chapterData}
          goToPreviousChapter={goToPreviousChapter}
          goToNextChapter={goToNextChapter}
        />
      )}

      {/* Section des commentaires du chapitre */}
      {!isImmersive && (
        <CommentsSection
          comments={comments}
          replies={replies}
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
      )}
    </div>
  );
};

export default ChapterReader;