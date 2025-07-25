import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Bookmark, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NavbarMenu = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Check if path matches current location
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/user/profil') {
      return location.pathname === '/user/profil' && !location.search.includes('tab=settings');
    }
    if (path === '/user/profil?tab=settings') {
      return location.pathname === '/user/profil' && location.search.includes('tab=settings');
    }
    return location.pathname.startsWith(path);
  };

  // Navigation items for desktop menu
  const navItems = [
    { to: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    { to: "/library", icon: <BookOpen className="w-5 h-5" />, label: "Library" },
    ...(user ? [{ to: "/bookmarks", icon: <Bookmark className="w-5 h-5" />, label: "Bookmarks" }] : []),
    { to: "/members", icon: <User className="w-5 h-5" />, label: "Membres" },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center px-4 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                active ? 'bg-white/10' : 'hover:bg-white/10'
              } ${active ? 'relative' : ''}`}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full"></div>
              )}
              <div className={`relative ${active ? 'text-white' : 'text-white/70 group-hover:text-white'} transition-colors duration-300`}>
                {item.icon}
              </div>
              <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/70 group-hover:text-white'} transition-colors duration-300 relative`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavbarMenu; 