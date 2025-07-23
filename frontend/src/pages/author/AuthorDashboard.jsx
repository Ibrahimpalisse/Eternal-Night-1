import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollToTop } from '../../hooks';
import AuthorSlideNav from '../../components/authors/AuthorSlideNav';
import { ToastProvider } from '../../contexts/ToastContext';
import TokenRefreshNotification from '../../components/ui/TokenRefreshNotification';
import { useNavigate } from 'react-router-dom';
import { 
  Menu,
  BookOpen, 
  FileText, 
  Users, 
  MessageSquare, 
  Heart, 
  Eye, 
  TrendingUp, 
  Calendar,
  PenTool,
  Plus,
  BarChart3
} from 'lucide-react';
import MyNovels from './MyNovels';
import MyChapters from './MyChapters';
import AuthorStats from './AuthorStats';
import AuthorPosts from './AuthorPosts';

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

// Données mockées pour le dashboard
const mockDashboardData = {
  stats: {
    novels: { total: 8, change: '+2', changeType: 'positive' },
    chapters: { total: 69, change: '+8', changeType: 'positive' },
    readers: { total: 12500, change: '+127', changeType: 'positive' },
    comments: { total: 505, change: '+23', changeType: 'positive' },
    likes: { total: 3033, change: '+45', changeType: 'positive' },
    posts: { total: 15, change: '+3', changeType: 'positive' }
  },

  topNovels: [
    {
      id: 1,
      title: 'Les Chroniques d\'Aether',
      status: 'published',
      views: 12500,
      likes: 324,
      chapters: 25,
      lastUpdate: '2024-01-20'
    },
    {
      id: 2,
      title: 'L\'Empire des Ombres',
      status: 'published',
      views: 9800,
      likes: 287,
      chapters: 18,
      lastUpdate: '2024-01-18'
    },
    {
      id: 3,
      title: 'La Prophétie Oubliée',
      status: 'accepted',
      views: 7650,
      likes: 198,
      chapters: 12,
      lastUpdate: '2024-01-15'
    }
  ]
};

// Composant pour les cartes de statistiques améliorées
const StatCard = ({ title, value, change, changeType, icon: Icon, color, href }) => (
  <div className={`relative bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer overflow-hidden`}>
    {/* Gradient d'accent subtil */}
    <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-${color}-600/10 opacity-60`} />
    
    {/* Contenu principal */}
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
          <p className={`text-3xl md:text-4xl font-bold text-${color}-400 mb-2 leading-none`}>{value}</p>
          {change && (
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
              <span className="text-gray-400 text-sm">cette semaine</span>
            </div>
          )}
    </div>

        {/* Icône avec effet de halo */}
        <div className="relative">
          <div className={`absolute inset-0 bg-${color}-400/20 rounded-xl blur-lg scale-150`} />
          <div className={`relative p-3 rounded-xl bg-${color}-500/20 border border-${color}-500/30 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-7 h-7 text-${color}-400`} />
          </div>
        </div>
      </div>
      </div>

    {/* Effet de bordure animé au hover */}
    <div className={`absolute inset-0 border-2 border-${color}-500/0 group-hover:border-${color}-500/30 rounded-2xl transition-all duration-300`} />
  </div>
);

// Composant pour les romans populaires
const TopNovelCard = ({ novel }) => {
  const statusConfig = {
    published: { label: 'Publié', color: 'green' },
    accepted: { label: 'Accepté', color: 'blue' },
    pending: { label: 'En attente', color: 'yellow' },
    draft: { label: 'Brouillon', color: 'gray' }
  };
  
  const status = statusConfig[novel.status] || statusConfig.draft;
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-medium truncate flex-1 pr-2">{novel.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${status.color}-500/20 text-${status.color}-400 border border-${status.color}-500/30 whitespace-nowrap`}>
          {status.label}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="text-center">
          <p className="text-gray-400">Vues</p>
          <p className="text-white font-semibold">{novel.views.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400">Likes</p>
          <p className="text-white font-semibold">{novel.likes}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400">Chapitres</p>
          <p className="text-white font-semibold">{novel.chapters}</p>
        </div>
      </div>
    </div>
  );
};

// Composant principal du dashboard
const AuthorDashboardContent = () => {
  const data = mockDashboardData;
  const navigate = useNavigate();
  
  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      {/* En-tête avec actions rapides */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard Auteur</h1>
          <p className="text-gray-400">Bienvenue dans votre espace créatif</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/author/novels')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            Nouveau Roman
          </button>
          <button 
            onClick={() => navigate('/author/chapters')}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
          >
            <FileText className="w-4 h-4" />
            Voir tous les chapitres
          </button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Romans"
          value={data.stats.novels.total}
          change={data.stats.novels.change}
          changeType={data.stats.novels.changeType}
          icon={BookOpen}
          color="blue"
          href="/author/novels"
        />
        <StatCard
          title="Chapitres"
          value={data.stats.chapters.total}
          change={data.stats.chapters.change}
          changeType={data.stats.chapters.changeType}
          icon={FileText}
          color="green"
          href="/author/chapters"
        />
        <StatCard
          title="Lecteurs"
          value={data.stats.readers.total.toLocaleString()}
          change={data.stats.readers.change}
          changeType={data.stats.readers.changeType}
          icon={Users}
          color="yellow"
        />
        <StatCard
          title="Commentaires"
          value={data.stats.comments.total}
          change={data.stats.comments.change}
          changeType={data.stats.comments.changeType}
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Likes"
          value={data.stats.likes.total.toLocaleString()}
          change={data.stats.likes.change}
          changeType={data.stats.likes.changeType}
          icon={Heart}
          color="pink"
        />
        <StatCard
          title="Posts"
          value={data.stats.posts.total}
          change={data.stats.posts.change}
          changeType={data.stats.posts.changeType}
          icon={PenTool}
          color="orange"
          href="/author/posts"
        />
          </div>



      {/* Romans populaires */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          Romans Populaires
        </h2>
        <div className="space-y-3">
          {data.topNovels.map((novel) => (
            <TopNovelCard key={novel.id} novel={novel} />
          ))}
        </div>
        <button 
          onClick={() => navigate('/author/novels')}
          className="w-full mt-4 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
        >
          Voir tous les romans →
        </button>
    </div>
  </div>
);
};

// AuthorNovels maintenant remplacé par le composant MyNovels importé

// AuthorChapters maintenant remplacé par le composant MyChapters importé

const AuthorWrite = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-white mb-6">Écrire</h1>
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
      <p className="text-gray-400">Éditeur de texte - En développement</p>
    </div>
  </div>
);

const AuthorComments = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-white mb-6">Commentaires</h1>
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
      <p className="text-gray-400">Gestion des commentaires - En développement</p>
    </div>
  </div>
);

const AuthorSettings = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-white mb-6">Paramètres</h1>
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
      <p className="text-gray-400">Paramètres auteur - En développement</p>
    </div>
  </div>
);

const AuthorDashboard = () => {
  useScrollToTop();
  const { user, loading } = useAuth();
  
  // TOUS les hooks doivent être ici, AVANT tout return conditionnel
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('authorSidebarOpen');
    const isMobileCheck = window.innerWidth < 768;
    if (isMobileCheck) return false;
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Hook pour détecter la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // pas de dépendance sidebarOpen pour éviter les boucles

  // Calculer la marge gauche selon l'état de la sidebar et la taille d'écran
  const getContentMargin = () => {
    if (isMobile) {
      return 'ml-0';
    } else if (isTablet) {
      return sidebarOpen ? 'ml-64' : 'ml-14';
    } else {
      return sidebarOpen ? 'ml-64' : 'ml-16';
    }
  };

  // Fonction pour changer l'état de la sidebar et le sauvegarder
  const toggleSidebar = (newState) => {
    const state = newState !== undefined ? newState : !sidebarOpen;
    setSidebarOpen(state);
    if (!isMobile) {
      localStorage.setItem('authorSidebarOpen', JSON.stringify(state));
    }
  };

  // Vérifier si l'utilisateur est en cours de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/30 border-t-blue-500"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  if (!user.roles?.includes('author')) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col" style={{ isolation: 'auto' }}>
        {/* Navigation latérale */}
        <AuthorSlideNav 
          isOpen={sidebarOpen} 
          onToggle={() => toggleSidebar()}
        />

        {/* Contenu principal */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${getContentMargin()}`}>
          {/* Header */}
          <header className="bg-slate-900/50 border-b border-slate-700/50 px-4 md:px-6 py-4 w-full">
            <div className="flex items-center justify-between max-w-[1920px] mx-auto w-full">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => toggleSidebar()}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Menu className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-lg md:text-2xl font-bold text-white">Espace Auteur</h1>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-gray-300 text-sm md:text-base hidden sm:block">
                  {user.name || user.username}
                </span>
                <div className="relative">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {getUserAvatar(user) ? (
                      <img 
                        src={getUserAvatar(user)}
                        alt={`${user.name || user.username}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span className="text-white font-medium text-sm md:text-base" style={getUserAvatar(user) ? {display: 'none'} : {}}>
                      {(user.name || user.username)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Container du contenu avec scroll */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="max-w-[1920px] mx-auto w-full">
          <Routes>
            <Route path="/" element={<AuthorDashboardContent />} />
            <Route path="/novels" element={<MyNovels />} />
            <Route path="/chapters" element={<MyChapters />} />
            <Route path="/write" element={<AuthorWrite />} />
            <Route path="/comments" element={<AuthorComments />} />
            <Route path="/stats" element={<AuthorStats />} />
            <Route path="/settings" element={<AuthorSettings />} />
                <Route path="/posts" element={<AuthorPosts />} />
          </Routes>
            </div>
          </div>
        </div>
        
        <TokenRefreshNotification />
      </div>
    </ToastProvider>
  );
};

export default AuthorDashboard; 