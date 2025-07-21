import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Routes, Route } from 'react-router-dom';
import { SlideNav, DashboardContent, UsersContent } from '../../components/admin';
import ContentAuthors from './ContentAuthors';
import ChapterContent from './ChapterContent';
import AuthorApplications from './AuthorApplications';
import Stats from './Stats';
import Notifications from './Notifications';
import { ToastProvider } from '../../contexts/ToastContext';
import TokenRefreshNotification from '../../components/ui/TokenRefreshNotification';
import { 
  Menu
} from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  // Récupérer l'état de la sidebar depuis localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
    const isMobileCheck = window.innerWidth < 768;
    // Sur mobile, toujours commencer fermé, sinon utiliser la valeur sauvegardée
    if (isMobileCheck) {
      return false;
    }
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Fonction pour changer l'état de la sidebar et le sauvegarder
  const toggleSidebar = (newState) => {
    const state = newState !== undefined ? newState : !sidebarOpen;
    setSidebarOpen(state);
    
    // Ne sauvegarder l'état que pour desktop/tablet, pas pour mobile
    if (!isMobile) {
      localStorage.setItem('adminSidebarOpen', JSON.stringify(state));
    }
  };

  // Hook pour détecter la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Sur mobile, fermer automatiquement pour une meilleure UX
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Suppression de la dépendance sidebarOpen pour éviter les boucles

  // Calculer la marge gauche selon l'état de la sidebar et la taille d'écran
  const getContentMargin = () => {
    if (isMobile) {
      return 'ml-0'; // Pas de marge sur mobile
    } else if (isTablet) {
      return sidebarOpen ? 'ml-64' : 'ml-14';
    } else {
      return sidebarOpen ? 'ml-64' : 'ml-16';
    }
  };

  // Vérifier si l'utilisateur est connecté et est super admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/30 border-t-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Vérifier si l'utilisateur a le rôle super_admin
  const isSuperAdmin = user.roles?.includes('super_admin');
  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex">
        {/* Navigation latérale */}
        <SlideNav 
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
              <h1 className="text-lg md:text-2xl font-bold text-white">Dashboard Admin</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm md:text-base hidden sm:block">{user.name}</span>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-white/10 rounded-full blur-lg"></div>
                <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                  {user.profile?.avatarUrl || user.avatar || user.avatarUrl ? (
                    <img 
                      src={user.profile?.avatarUrl || user.avatar || user.avatarUrl}
                      alt={`${user.name || user.username}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className="w-full h-full flex items-center justify-center text-white/90 font-medium text-sm md:text-base" 
                    style={user.profile?.avatarUrl || user.avatar || user.avatarUrl ? {display: 'none'} : {}}
                  >
                    {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu des pages admin */}
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/applications" element={<AuthorApplications />} />
          <Route path="/users" element={<UsersContent />} />
          <Route path="/authorsContent" element={<ContentAuthors />} />
          <Route path="/chapters" element={<ChapterContent />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
      
      <TokenRefreshNotification />
    </div>
    </ToastProvider>
  );
};

export default Dashboard; 