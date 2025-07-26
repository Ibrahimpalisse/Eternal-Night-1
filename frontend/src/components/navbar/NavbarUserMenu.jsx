import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Bell, Settings, User, BookOpen, Shield, LogOut, LogIn, UserPlus, Star
} from 'lucide-react';
import { SearchDialog } from "../..//components";
import { getUserAvatar } from '../../utils/userUtils';

const NavbarUserMenu = ({ 
  user, 
  unreadCount, 
  isMoreMenuOpen, 
  setIsMoreMenuOpen, 
  setIsLogoutDialogOpen,
  isSocketConnected 
}) => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  if (!user) {
    // Si l'utilisateur n'est pas connecté - Boutons Se connecter et S'inscrire
    return (
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
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Search button */}
      <SearchDialog 
        trigger={
          <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <Search className="w-4 h-4" />
          </button>
        } 
      />

      {/* Notifications with badge */}
      <Link
        to="/notifications"
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={toggleMoreMenu}
          className="flex items-center space-x-2 p-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-white/10 rounded-full blur-sm"></div>
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
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
              <span 
                className="w-full h-full flex items-center justify-center text-white/90 font-medium text-sm" 
                style={getUserAvatar(user) ? {display: 'none'} : {}}
              >
                {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Indicateur de connexion socket */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black ${
              isSocketConnected ? 'bg-green-500' : 'bg-red-500'
            } shadow-lg`}></div>
          </div>
          <span className="text-sm font-medium text-white/90 hidden lg:block max-w-24 truncate">
            {user.name || user.username}
          </span>
        </button>

        {/* Dropdown menu */}
        {isMoreMenuOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* User info header */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-full blur-lg"></div>
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
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
                    <span 
                      className="w-full h-full flex items-center justify-center text-white/90 font-medium text-lg" 
                      style={getUserAvatar(user) ? {display: 'none'} : {}}
                    >
                      {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold truncate">{user.name || user.username}</div>
                  <div className="text-white/60 text-sm truncate">{user.email}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.roles && user.roles.map((role) => (
                      <span key={role} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        role === 'super_admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        role === 'admin' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                        role === 'author' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {role === 'super_admin' ? 'Super Admin' :
                         role === 'admin' ? 'Admin' :
                         role === 'author' ? 'Auteur' :
                         'Utilisateur'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="p-2">
              <Link 
                to="/user/profil" 
                className="flex items-center space-x-2 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 group-hover:border-blue-500/50 transition-colors">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <span>Mon Profil</span>
              </Link>

              <Link 
                to="/notifications" 
                className="flex items-center space-x-2 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 group-hover:border-yellow-500/50 transition-colors">
                  <Bell className="w-4 h-4 text-yellow-400" />
                </div>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Dashboards links */}
              <div className="p-2 border-t border-white/10 mt-2">
                {user.roles?.includes('author') && (
                  <Link 
                    to="/author" 
                    className="flex items-center space-x-2 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                    }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 group-hover:border-blue-500/50 transition-colors">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                    </div>
                    <span>Dashboard Auteur</span>
                  </Link>
                )}

                {user.roles?.includes('super_admin') && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                    }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 group-hover:border-red-500/50 transition-colors">
                      <Shield className="w-4 h-4 text-red-400" />
                    </div>
                    <span>Dashboard Admin</span>
                  </Link>
                )}
              </div>

              {/* Logout */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarUserMenu; 