import { Link } from 'react-router-dom';
import { 
  Search, Bell, Menu, X, Home, BookOpen, Bookmark, User, Settings,
  Shield, LogOut, LogIn, UserPlus
} from 'lucide-react';
import { SearchDialog } from "../..//components";
import { getUserAvatar, getUserDisplayName, formatUserRole, getRoleColors } from '../../utils/userUtils';

const NavbarMobile = ({ 
  user, 
  unreadCount, 
  isMenuOpen, 
  toggleMenu, 
  setIsLogoutDialogOpen,
  isSocketConnected 
}) => {
  const handleMenuItemClick = () => {
    toggleMenu(); // Fermer le menu après avoir cliqué sur un item
  };

  const navItems = [
    { to: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    { to: "/library", icon: <BookOpen className="w-5 h-5" />, label: "Library" },
    ...(user ? [{ to: "/bookmarks", icon: <Bookmark className="w-5 h-5" />, label: "Bookmarks" }] : []),
    { to: "/members", icon: <User className="w-5 h-5" />, label: "Membres" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <SearchDialog 
          trigger={
            <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 touch-manipulation">
              <Search className="w-4 h-4" />
            </button>
          } 
        />

        {user && (
          <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 touch-manipulation">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}

        <button
          onClick={toggleMenu}
          className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 touch-manipulation z-50"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 md:hidden">
          <div className="flex flex-col h-full pt-16 sm:pt-20">
            {user ? (
              <>
                {/* User Info Section */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-white/10">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-full blur-lg"></div>
                      <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                        {getUserAvatar(user) ? (
                          <img 
                            src={getUserAvatar(user)}
                            alt={`${getUserDisplayName(user)}'s profile`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span 
                          className="w-full h-full flex items-center justify-center text-white/90 font-medium text-lg sm:text-xl" 
                          style={getUserAvatar(user) ? {display: 'none'} : {}}
                        >
                          {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Socket connection indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                        isSocketConnected ? 'bg-green-500' : 'bg-red-500'
                      } shadow-lg`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-base sm:text-lg truncate">
                        {getUserDisplayName(user)}
                      </div>
                      <div className="text-white/60 text-sm truncate">{user.email}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.roles && user.roles.map((role) => (
                          <span key={role} className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColors(role)}`}>
                            {formatUserRole(role)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={handleMenuItemClick}
                      className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
                    >
                      <div className="text-purple-400">
                        {item.icon}
                      </div>
                      <span className="font-medium text-base sm:text-lg">{item.label}</span>
                    </Link>
                  ))}

                  {/* Profile Links */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <Link
                      to="/user/profil"
                      onClick={handleMenuItemClick}
                      className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
                    >
                      <div className="text-blue-400">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-base sm:text-lg">Mon Profil</span>
                    </Link>

                    <Link
                      to="/user/profil?tab=settings"
                      onClick={handleMenuItemClick}
                      className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
                    >
                      <div className="text-green-400">
                        <Settings className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-base sm:text-lg">Paramètres</span>
                    </Link>
                  </div>

                  {/* Dashboard Links */}
                  {(user.roles?.includes('author') || user.roles?.includes('super_admin')) && (
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      {user.roles?.includes('author') && (
                        <Link
                          to="/author"
                          onClick={handleMenuItemClick}
                          className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
                        >
                          <div className="text-purple-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-base sm:text-lg">Dashboard Auteur</span>
                        </Link>
                      )}

                      {user.roles?.includes('super_admin') && (
                        <Link
                          to="/admin"
                          onClick={handleMenuItemClick}
                          className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
                        >
                          <div className="text-red-400">
                            <Shield className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-base sm:text-lg">Dashboard Admin</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <div className="p-4 sm:p-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsLogoutDialogOpen(true);
                      toggleMenu();
                    }}
                    className="flex items-center space-x-3 w-full p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-base sm:text-lg">Déconnexion</span>
                  </button>
                </div>
              </>
            ) : (
              // Not logged in - Show auth options
              <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 space-y-4">
                <div className="text-center mb-8">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Bienvenue sur Night Novels</h2>
                  <p className="text-white/60 text-sm sm:text-base">Connectez-vous pour accéder à toutes les fonctionnalités</p>
                </div>

                <Link
                  to="/auth/login"
                  onClick={handleMenuItemClick}
                  className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 active:scale-95"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium text-base sm:text-lg">Se connecter</span>
                </Link>

                <Link
                  to="/auth/register"
                  onClick={handleMenuItemClick}
                  className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-purple-500/20 border border-purple-500/50 text-white hover:bg-purple-500/30 hover:border-purple-500/70 transition-all duration-300 active:scale-95"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium text-base sm:text-lg">S'inscrire</span>
                </Link>

                {/* Guest Navigation */}
                <div className="pt-6 border-t border-white/10 space-y-2">
                  {navItems.slice(0, 2).map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={handleMenuItemClick}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
                    >
                      <div className="text-purple-400">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMobile; 