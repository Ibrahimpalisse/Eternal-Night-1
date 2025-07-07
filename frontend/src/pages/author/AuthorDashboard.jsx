import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthorSlideNav from '../../components/authors/AuthorSlideNav';
import { ToastProvider } from '../../contexts/ToastContext';
import TokenRefreshNotification from '../../components/ui/TokenRefreshNotification';
import { Menu } from 'lucide-react';
import MyNovels from './MyNovels';
import MyChapters from './MyChapters';

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

// Composants pour les différentes pages author (à créer plus tard)
const AuthorDashboardContent = () => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard Auteur</h1>
      <p className="text-gray-400">Bienvenue dans votre espace auteur</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Mes Romans</h3>
        <p className="text-3xl font-bold text-blue-400 mb-1">12</p>
        <p className="text-sm text-gray-400">+2 ce mois</p>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Chapitres</h3>
        <p className="text-3xl font-bold text-green-400 mb-1">156</p>
        <p className="text-sm text-gray-400">+8 cette semaine</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Lecteurs</h3>
        <p className="text-3xl font-bold text-yellow-400 mb-1">2.4K</p>
        <p className="text-sm text-gray-400">+127 ce mois</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Commentaires</h3>
        <p className="text-3xl font-bold text-purple-400 mb-1">89</p>
        <p className="text-sm text-gray-400">12 non lus</p>
      </div>
    </div>

    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Activité Récente</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <div>
            <p className="text-white">Nouveau chapitre publié: "Le Réveil de l'Ombre - Chapitre 15"</p>
            <p className="text-gray-400 text-sm">Il y a 2 heures</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <div>
            <p className="text-white">5 nouveaux commentaires sur "Les Gardiens Éternels"</p>
            <p className="text-gray-400 text-sm">Il y a 4 heures</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div>
            <p className="text-white">47 nouveaux abonnés cette semaine</p>
            <p className="text-gray-400 text-sm">Il y a 1 jour</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

const AuthorReaders = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-white mb-6">Lecteurs</h1>
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
      <p className="text-gray-400">Statistiques des lecteurs - En développement</p>
    </div>
  </div>
);

const AuthorStats = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-white mb-6">Statistiques</h1>
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
      <p className="text-gray-400">Statistiques détaillées - En développement</p>
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
      <div className="min-h-screen flex">
        {/* Navigation latérale */}
        <AuthorSlideNav 
          isOpen={sidebarOpen} 
          onToggle={() => toggleSidebar()}
        />

        {/* Contenu principal */}
        <div className={`flex-1 transition-all duration-300 ${getContentMargin()}`}>
          {/* Header */}
          <header className="bg-slate-900/50 border-b border-slate-700/50 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
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
                          // Fallback vers initiales si l'image ne charge pas
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

          {/* Contenu des pages */}
          <Routes>
            <Route path="/" element={<AuthorDashboardContent />} />
                            <Route path="/novels" element={<MyNovels />} />
            <Route path="/chapters" element={<MyChapters />} />
            <Route path="/write" element={<AuthorWrite />} />
            <Route path="/comments" element={<AuthorComments />} />
            <Route path="/readers" element={<AuthorReaders />} />
            <Route path="/stats" element={<AuthorStats />} />
            <Route path="/settings" element={<AuthorSettings />} />
          </Routes>
        </div>
        
        <TokenRefreshNotification />
      </div>
    </ToastProvider>
  );
};

export default AuthorDashboard; 