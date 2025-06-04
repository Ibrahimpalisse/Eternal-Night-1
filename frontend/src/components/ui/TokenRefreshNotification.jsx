import React, { useState, useEffect } from 'react';

const TokenRefreshNotification = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Listen for token refresh events
    const handleTokenRefresh = () => {
      setNotification({
        type: 'info',
        message: 'Session rafraîchie avec succès',
        icon: '🔄'
      });
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    };

    const handleTokenRefreshFailed = () => {
      setNotification({
        type: 'warning',
        message: 'Votre session a expiré. Veuillez vous reconnecter.',
        icon: '⚠️'
      });
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    };

    // Listen for custom events
    window.addEventListener('token:refreshed', handleTokenRefresh);
    window.addEventListener('token:refresh-failed', handleTokenRefreshFailed);

    return () => {
      window.removeEventListener('token:refreshed', handleTokenRefresh);
      window.removeEventListener('token:refresh-failed', handleTokenRefreshFailed);
    };
  }, []);

  if (!notification) return null;

  const getNotificationStyles = () => {
    const baseStyles = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 transform';
    
    switch (notification.type) {
      case 'info':
        return `${baseStyles} bg-blue-900/90 border-blue-500/30 text-blue-200 backdrop-blur-sm`;
      case 'warning':
        return `${baseStyles} bg-yellow-900/90 border-yellow-500/30 text-yellow-200 backdrop-blur-sm`;
      case 'error':
        return `${baseStyles} bg-red-900/90 border-red-500/30 text-red-200 backdrop-blur-sm`;
      default:
        return `${baseStyles} bg-gray-900/90 border-gray-500/30 text-gray-200 backdrop-blur-sm`;
    }
  };

  return (
    <div className={getNotificationStyles()}>
      <div className="flex items-center space-x-3">
        <span className="text-lg">{notification.icon}</span>
        <span className="text-sm font-medium">{notification.message}</span>
        <button
          onClick={() => setNotification(null)}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TokenRefreshNotification; 