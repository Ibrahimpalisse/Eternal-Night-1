import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Bookmark, User, Heart, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';

const NavbarMenu = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderStyle, setSliderStyle] = useState({});
  const navRef = useRef(null);
  const itemRefs = useRef([]);

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
    { to: "/best-novels", icon: <Heart className="w-5 h-5" />, label: "Meilleurs" },
    { to: "/new-chapters", icon: <Plus className="w-5 h-5" />, label: "Nouveaux" },
    ...(user ? [{ to: "/bookmarks", icon: <Bookmark className="w-5 h-5" />, label: "Bookmarks" }] : []),
    { to: "/members", icon: <User className="w-5 h-5" />, label: "Membres" },
  ];

  // Update active index and slider position when location changes
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => isActive(item.to));
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      updateSliderPosition(currentIndex);
    }
  }, [location.pathname, navItems]);

  // Update slider position
  const updateSliderPosition = (index) => {
    if (itemRefs.current[index] && navRef.current) {
      const activeItem = itemRefs.current[index];
      const navContainer = navRef.current;
      
      const itemRect = activeItem.getBoundingClientRect();
      const navRect = navContainer.getBoundingClientRect();
      
      const left = itemRect.left - navRect.left;
      const width = itemRect.width;
      
      setSliderStyle({
        transform: `translateX(${left}px)`,
        width: `${width}px`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }
  };

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