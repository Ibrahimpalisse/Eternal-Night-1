import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Home, BookOpen, Bookmark, List, User, Settings, Bell, LogOut, LogIn, UserPlus, Menu, X, Search
} from 'lucide-react';
import openBookLogo from '../assets/open-book.svg';
import SearchDialog from './SearchDialog';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import useSocket from '../hooks/useSocket';
import useNotifications from '../hooks/useNotifications';

// Fonction pour obtenir l'avatar de l'utilisateur
const getUserAvatar = (user) => {
    if (!user) return null;
    
  // Essayer différentes propriétés d'avatar possibles
  if (user.avatar) return user.avatar;
  if (user.profile && user.profile.avatar_path) return user.profile.avatar_path;
  
  // Si nous avons une URL d'API, essayer de construire le chemin complet
  if (import.meta.env.VITE_API_URL && user.profile && user.profile.avatar_path) {
    return `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.profile.avatar_path}`;
    }
    
    return null;
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    
  const { user, logout, isSocketConnected } = useAuth();
  const { socket } = useSocket();
  
  // Utiliser le hook de notifications si disponible, sinon utiliser un état local
  const notificationsHook = typeof useNotifications === 'function' 
    ? useNotifications(false) 
    : { unreadCount: 3 };
  
  const unreadCount = notificationsHook.unreadCount || 0;

    // Use location hook to get current path
    const location = useLocation();

    // Empêcher le défilement du body quand le menu est ouvert
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);
    
    // Gérer la déconnexion
    const handleLogout = async () => {
        try {
            const result = await logout();
            
            // Rediriger vers la page de connexion après déconnexion
            if (result.success) {
                window.location.href = '/auth/login';
            }
        } catch (error) {
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMoreMenu = () => {
        setIsMoreMenuOpen(!isMoreMenuOpen);
    };

    // Check if path matches current location
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        if (path === '/settings') {
            return location.pathname === '/profile' && location.search.includes('tab=settings');
        }
        return location.pathname.startsWith(path);
    };

    // Navigation items for desktop menu
    const navItems = [
        { to: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    { to: "/user/home", icon: <User className="w-5 h-5" />, label: "Dashboard" },
        { to: "/library", icon: <BookOpen className="w-5 h-5" />, label: "Library" },
        { to: "/bookmarks", icon: <Bookmark className="w-5 h-5" />, label: "Bookmarks" },
        { to: "/readers", icon: <List className="w-5 h-5" />, label: "Best Readers" },
    ];

    return (
        <nav className="bg-black border-b border-white/10 shadow-lg fixed w-full top-0 left-0 z-50">
            <div className="mx-auto relative max-w-7xl">
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between h-16 px-4">
                    {/* Left side - Logo and brand */}
                    <div className="flex items-center relative z-20">
                        <Link to="/" className="flex items-center group">
                            <div className="relative text-white mr-4 transition-all duration-500 group-hover:scale-110">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-2xl blur-xl"></div>
                                <div className="relative p-2 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-500 group-hover:shadow-purple-500/20">
                                    <img src={openBookLogo} alt="Open Book Logo" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">Night Novels</span>
                                    <div className="h-4 w-[1px] bg-gradient-to-b from-white/5 via-white/10 to-white/5"></div>
                                    <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Beta</span>
                                </div>
                                <span className="text-[0.65rem] text-white/40 font-medium">Your Reading Journey</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Menu */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center px-4 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                            {navItems.map((item) => {
                                const active = isActive(item.to);
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${active ? 'bg-white/10' : 'hover:bg-white/10'} ${active ? 'relative' : ''}`}
                                    >
                                        {active && (
                                            <span className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                        )}
                                        <div className={`p-1 rounded-lg ${active ? 'text-purple-400' : 'text-white/70 group-hover:text-white'}`}>
                                            {item.icon}
                                        </div>
                                        <span className={`text-xs font-medium ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search Button */}
                        <SearchDialog
                            trigger={
                                <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                                    <Search className="w-4 h-4" />
                                </button>
                            }
                        />

                        {/* Si l'utilisateur est connecté */}
                        {user ? (
                            <>
                        {/* Notifications Button */}
                                <Link to="/notifications" className="relative">
                            <div className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95">
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-purple-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </div>
                                )}
                                <Bell className="w-4 h-4" />
                            </div>
                        </Link>

                                <div className="flex items-center">
                                    <div className="relative">
                                        <button 
                  onClick={toggleMoreMenu}
                                            className="group flex items-center space-x-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-white/10 rounded-full blur-lg"></div>
                                                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                                    {getUserAvatar(user) ? (
                                                        <img 
                                                            src={getUserAvatar(user)}
                                                            alt={`${user.name || user.username}'s profile`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <User className="w-4 h-4 text-white/80 group-hover:text-white" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                                                    {user.name || user.username}
                                                </span>
                    <span className="text-[0.65rem] text-white/40">
                      {isSocketConnected ? 'Connecté' : 'Connexion...'}
                    </span>
                                            </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${isSocketConnected ? 'bg-green-500/80 ring-4 ring-green-500/20' : 'bg-yellow-500/80 ring-4 ring-yellow-500/20'}`}></div>
                                        </button>

                                        {/* Menu utilisateur connecté */}
                                        {isMoreMenuOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsMoreMenuOpen(false)}
                                                />
                                                
                                                <div className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* En-tête du menu */}
                                                    <div className="p-4 border-b border-white/10">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative">
                                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-white/10 rounded-full blur-lg"></div>
                                                                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                                                    {getUserAvatar(user) ? (
                                                                        <img 
                                                                            src={getUserAvatar(user)}
                                                                            alt={`${user.name || user.username}'s profile`}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <User className="w-6 h-6 text-white/90" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-medium">
                                                                    {user.name || user.username}
                                                                </span>
                                                                <span className="text-sm text-white/50">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                      {/* Options du menu */}
                                                    <div className="p-2">
                                                        <Link 
                                                            to="/profile" 
                                                            className="flex items-center space-x-2 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                                            onClick={() => {
                                                                setIsMoreMenuOpen(false);
                                                                setIsMenuOpen(false);
                                                            }}
                                                        >
                                                            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                            <span>Voir le profil</span>
                                                        </Link>
                                                        <Link 
                                                            to="/profile?tab=settings" 
                                                            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                                            onClick={() => {
                                                                setIsMoreMenuOpen(false);
                                                                setIsMenuOpen(false);
                                                            }}
                                                        >
                                                            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                                                <Settings className="w-4 h-4" />
                                                            </div>
                                                            <span>Paramètres</span>
                                                        </Link>
                                                    </div>

                                                    {/* Actions de déconnexion */}
                                                    <div className="p-2 border-t border-white/10">
                                                        <button 
                                                            onClick={() => {
                                                                setIsLogoutDialogOpen(true);
                                                                setIsMoreMenuOpen(false);
                                                            }}
                                                            className="flex items-center space-x-2 p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
                                                        >
                                                            <LogOut className="w-4 h-4" />
                                                            <span>Déconnexion</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Si l'utilisateur n'est pas connecté - Boutons Se connecter et S'inscrire */
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/auth/login"
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="text-sm font-medium">Se connecter</span>
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 text-white hover:bg-purple-500/30 hover:border-purple-500/70 transition-all duration-300"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span className="text-sm font-medium">S'inscrire</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className="flex md:hidden items-center justify-between h-14 px-3 sm:h-16 sm:px-4">
                    {/* Left side - Logo and brand */}
                    <div className="flex items-center relative z-20">
                        <Link to="/" className="flex items-center group">
                            <div className="relative text-white mr-3 transition-all duration-500 group-hover:scale-110">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-2xl blur-xl"></div>
                                <div className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-500 group-hover:shadow-purple-500/20">
                                    <img src={openBookLogo} alt="Open Book Logo" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">Night Novels</span>
                                    <div className="h-3 sm:h-4 w-[1px] bg-gradient-to-b from-white/5 via-white/10 to-white/5"></div>
                                    <span className="text-[0.6rem] sm:text-xs text-white/50 uppercase tracking-wider font-medium">Beta</span>
                                </div>
                                <span className="text-[0.6rem] sm:text-[0.65rem] text-white/40 font-medium">Your Reading Journey</span>
                            </div>
                        </Link>
                    </div>

                    {/* Right side - Actions for mobile */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <SearchDialog 
                            trigger={
                                <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 touch-manipulation">
                                    <Search className="w-4 h-4" />
                                </button>
                            } 
                        />

                        {/* Si l'utilisateur est connecté */}
                        {user && (
                        <Link
                            to="/notifications"
                            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                            {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-purple-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </div>
                            )}
                            <Bell className="w-4 h-4" />
                        </Link>
                        )}

            {/* Mobile menu button */}
                        <button
                            className="md:hidden relative z-50 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? (
                                <X className="w-4 h-4" />
                            ) : (
                                <Menu className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout confirmation dialog */}
            <LogoutConfirmDialog 
                isOpen={isLogoutDialogOpen}
                setIsOpen={setIsLogoutDialogOpen}
                onConfirm={handleLogout}
            />

            {/* Mobile Menu */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/95 md:hidden z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="fixed top-0 left-0 h-[100dvh] w-[85vw] max-w-[320px] bg-black/95 backdrop-blur-xl border-r border-white/10 shadow-xl md:hidden z-50 overflow-hidden animate-in slide-in-from-left duration-300">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-black/50">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 p-1.5">
                                        <img src={openBookLogo} alt="Logo" className="w-full h-full" />
                                    </div>
                                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                        Night Novels
                                    </span>
                                </div>
                            </div>

                            {user && (
                                <div className="p-3 sm:p-4 border-b border-white/10 bg-black/50">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-white/10 rounded-full blur-lg"></div>
                                            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                                {getUserAvatar(user) ? (
                                                    <img 
                                                        src={getUserAvatar(user)}
                                                        alt={`${user.name || user.username}'s profile`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                                                        }}
                                                    />
                                                ) : (
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm sm:text-base text-white font-medium">{user.name || user.username}</span>
                                            <span className="text-xs sm:text-sm text-white/50">{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-5 sm:space-y-6 px-2 bg-transparent">
                                {/* Navigation Section */}
                                <div className="space-y-1">
                                    <div className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Navigation</div>
                                    <Link 
                                        to="/" 
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <Home className="w-4 h-4" />
                                        </div>
                                        <span>Accueil</span>
                                    </Link>

                                    <Link 
                                        to="/library" 
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/library') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/library') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <span>Bibliothèque</span>
                                    </Link>
                                    
                                    <Link 
                                        to="/bookmarks" 
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/bookmarks') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/bookmarks') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <Bookmark className="w-4 h-4" />
                                        </div>
                                        <span>Favoris</span>
                                    </Link>

                                    <Link 
                                        to="/readers" 
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/readers') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/readers') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <List className="w-4 h-4" />
                                        </div>
                                        <span>Meilleurs lecteurs</span>
                                    </Link>
                                </div>

                                {user && (
                                    <>
                                        {/* Profile Section */}
                                        <div className="space-y-1">
                                            <div className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Profil</div>
                                <Link 
                                    to="/profile" 
                                                className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${location.pathname === '/profile' && !location.search.includes('tab=settings') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className={`p-2 rounded-lg ${location.pathname === '/profile' && !location.search.includes('tab=settings') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span>Voir le profil</span>
                                </Link>
                                        </div>

                                        {/* Settings Section */}
                                        <div className="space-y-1">
                                            <div className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Paramètres</div>
                                            <Link 
                                                to="/profile?tab=settings" 
                                                className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/settings') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className={`p-2 rounded-lg ${isActive('/settings') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                                    <Settings className="w-4 h-4" />
                                                </div>
                                                <span>Paramètres</span>
                                    </Link>
                                        </div>
                                    </>
                                )}
                                </div>

                            {/* Bottom Section - Login/Logout */}
                                <div className="p-3 sm:p-4 mt-auto border-t border-white/10 bg-black/50">
                                {user ? (
                            <button 
                                            type="button"
                                onClick={() => {
                                    setIsLogoutDialogOpen(true);
                                                setIsMenuOpen(false);
                                }}
                                            className="flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors touch-manipulation active:bg-red-500/30"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Déconnexion</span>
                            </button>
                                ) : (
                                    <div className="space-y-3">
                                        <Link 
                                            to="/auth/login"
                                            className="flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors font-medium touch-manipulation active:bg-purple-700"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LogIn className="w-4 h-4" />
                                            <span>Connexion</span>
                                        </Link>
                                        <Link 
                                            to="/auth/register"
                                            className="flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors touch-manipulation active:bg-white/15"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            <span>Créer un compte</span>
                                        </Link>
                                        <p className="text-center text-xs text-white/40 px-2">
                                            Rejoignez notre communauté pour accéder à toutes les fonctionnalités
                                        </p>
                                </div>
                                )}
                        </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;