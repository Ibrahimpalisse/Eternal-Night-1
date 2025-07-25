import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useSocket from '../../hooks/useSocket';
import useNotifications from '../../hooks/useNotifications';
import LogoutConfirmDialog from "../dialogs/LogoutConfirmDialog.jsx";
import NavbarLogo from './NavbarLogo';
import NavbarMenu from './NavbarMenu';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarMobile from './NavbarMobile';

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

  // Empêcher le défilement du body quand le menu mobile est ouvert
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
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-black border-b border-white/10 shadow-lg fixed w-full top-0 left-0 z-50">
        <div className="mx-auto relative max-w-7xl">
          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <NavbarLogo />

            {/* Desktop Navigation Menu */}
            <NavbarMenu />

            {/* User Menu */}
            <NavbarUserMenu 
              user={user}
              unreadCount={unreadCount}
              isMoreMenuOpen={isMoreMenuOpen}
              setIsMoreMenuOpen={setIsMoreMenuOpen}
              setIsLogoutDialogOpen={setIsLogoutDialogOpen}
              isSocketConnected={isSocketConnected}
            />
          </div>

          {/* Mobile Navbar */}
          <div className="flex md:hidden items-center justify-between h-14 px-3 sm:h-16 sm:px-4">
            {/* Mobile Logo */}
            <NavbarLogo isMobile={true} />

            {/* Mobile Actions */}
            <NavbarMobile 
              user={user}
              unreadCount={unreadCount}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              setIsLogoutDialogOpen={setIsLogoutDialogOpen}
              isSocketConnected={isSocketConnected}
            />
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;