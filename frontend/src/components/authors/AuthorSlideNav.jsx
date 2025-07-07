import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoutConfirmDialog from '../LogoutConfirmDialog';
import openBookLogo from '../../assets/open-book.svg';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Settings,
  Home,
  LogOut,
  X,
  MessageSquare,
  Users,
  Edit,
  BookMarked,
  TrendingUp
} from 'lucide-react';

const AuthorSlideNav = ({ isOpen, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // États pour la gestion des modales
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Hook pour détecter la taille d'écran
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // md breakpoint
      setIsTablet(width >= 768 && width < 1024); // lg breakpoint
    };

    // Initial check
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fermer la sidebar sur mobile après navigation
  const handleMobileNavigation = () => {
    if (isMobile && isOpen) {
      onToggle();
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/author',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Mes Romans',
      path: '/author/novels',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: 'Chapitres',
      path: '/author/chapters',
      icon: <BookMarked className="w-5 h-5" />
    },
    {
      name: 'Lecteurs',
      path: '/author/readers',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Statistiques',
      path: '/author/stats',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: 'Paramètres',
      path: '/author/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  // Gestion de la largeur responsive
  const getNavWidth = () => {
    if (isMobile) {
      return 'w-80'; // Largeur fixe sur mobile (320px)
    } else if (isTablet) {
      return isOpen ? 'w-64' : 'w-14'; // Plus étroit sur tablette
    } else {
      return isOpen ? 'w-64' : 'w-16'; // Largeur normale sur desktop
    }
  };

  // Overlay pour mobile quand ouvert
  const showOverlay = isMobile && isOpen;

  return (
    <>
      {/* Overlay pour mobile */}
      {showOverlay && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-r border-white/20 transition-all duration-300 z-50 ${getNavWidth()} ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}>
        {/* Logo */}
        <div className={`flex items-center p-4 border-b border-white/20 transition-all duration-300 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-br from-blue-500/20 to-white/20 rounded-lg p-1.5 backdrop-blur-sm border border-white/20 transition-all duration-300 ${!isOpen ? 'hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20' : ''}`}>
              <img src={openBookLogo} alt="Night Novels" className="w-full h-full" />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">Night Novels</span>
                <span className="text-gray-400 text-xs">Author Panel</span>
              </div>
            )}
          </div>
          
          {/* Bouton de fermeture en mode mobile */}
          {isOpen && isMobile && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/author'}
                  onClick={handleMobileNavigation}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent'
                    } ${!isOpen ? 'justify-center' : ''}`
                  }
                >
                  <span className={`flex-shrink-0 transition-all duration-200 ${!isOpen ? 'group-hover:scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <>
                      <span className="font-medium">{item.name}</span>
                    </>
                  )}
                  
                  {/* Tooltip amélioré pour mode réduit - affiché seulement en mode réduit */}
                  {!isOpen && !isMobile && (isTablet || (!isMobile && !isTablet)) && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 whitespace-nowrap z-[60] shadow-xl border border-white/10 transform scale-95 group-hover:scale-100 group-focus:scale-100">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                      </div>
                      {/* Flèche du tooltip */}
                      <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/95 border-l border-b border-white/10 rotate-45"></div>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions du bas */}
        <div className="p-4 border-t border-white/20">
          <div className="space-y-2">
            {/* Retour au site */}
            <NavLink
              to="/"
              onClick={handleMobileNavigation}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent group relative focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 ${!isOpen ? 'justify-center' : ''}`}
            >
              <Home className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${!isOpen ? 'group-hover:scale-110' : ''}`} />
              {isOpen && <span className="font-medium">Retour au site</span>}
              
              {!isOpen && !isMobile && (isTablet || (!isMobile && !isTablet)) && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 whitespace-nowrap z-[60] shadow-xl border border-white/10 transform scale-95 group-hover:scale-100 group-focus:scale-100">
                  Retour au site
                  {/* Flèche du tooltip */}
                  <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/95 border-l border-b border-white/10 rotate-45"></div>
                </div>
              )}
            </NavLink>

            {/* Déconnexion */}
            <button
              onClick={handleLogoutClick}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent group relative focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 ${!isOpen ? 'justify-center' : ''}`}
            >
              <LogOut className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${!isOpen ? 'group-hover:scale-110' : ''}`} />
              {isOpen && <span className="font-medium">Déconnexion</span>}
              
              {!isOpen && !isMobile && (isTablet || (!isMobile && !isTablet)) && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 whitespace-nowrap z-[60] shadow-xl border border-white/10 transform scale-95 group-hover:scale-100 group-focus:scale-100">
                  Déconnexion
                  {/* Flèche du tooltip */}
                  <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/95 border-l border-b border-white/10 rotate-45"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        setIsOpen={setShowLogoutDialog}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default AuthorSlideNav; 