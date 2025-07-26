import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../../hooks';
import { Bell, Search, Filter, X, CheckCircle, AlertTriangle, Info, Star, Megaphone } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import NotificationCard from '../../components/notifications/NotificationCard';
import NotificationFilter from '../../components/notifications/NotificationFilter';

function Notifications() {
  useScrollToTop();
  
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');



  // Données de test pour les notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Avertissement de modération',
      message: 'Votre commentaire a été signalé et est en cours de modération.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
      isRead: false,
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      id: 2,
      type: 'congratulations',
      title: 'Félicitations !',
      message: 'Votre roman a atteint 1000 lecteurs ! Continuez comme ça !',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 heures ago
      isRead: true,
      icon: Star,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Alerte de sécurité',
      message: 'Une nouvelle connexion a été détectée sur votre compte.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 heures ago
      isRead: false,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Nouvelle histoire en cours d\'écriture',
      message: 'Bonjour chers lecteurs ! Je travaille actuellement sur une nouvelle série qui vous plaira sûrement. Cette histoire mélange aventure et mystère dans un univers fantastique unique...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 jour ago
      isRead: false,
      icon: Megaphone,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      type: 'general',
      title: 'Mise à jour du système',
      message: 'Le site sera en maintenance le 15 décembre de 2h à 4h du matin. Nous travaillons pour améliorer votre expérience de lecture.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours ago
      isRead: true,
      icon: Info,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      type: 'congratulations',
      title: 'Nouveau chapitre publié !',
      message: 'Votre chapitre "La bataille finale" a été publié avec succès.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours ago
      isRead: false,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ];

  useEffect(() => {
    // Charger les données directement
    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);



  // Filtrer les notifications
  useEffect(() => {
    let filtered = notifications;

    // Filtrer par type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedFilter);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, selectedFilter, searchQuery]);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">


        {/* Header amélioré */}
        <div className="mb-6 sm:mb-8 animate-in slide-in-from-top-2 duration-700 delay-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight flex items-center gap-3">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                Notifications
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-gray-400 text-xs sm:text-sm lg:text-base truncate">
                  {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes les notifications ont été lues'}
                </p>
                {unreadCount > 0 && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse flex-shrink-0"></div>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base w-full lg:w-auto"
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">Tout marquer comme lu</span>
                <span className="sm:hidden">Tout marquer lu</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filtres et recherche avec animation */}
        <div className="animate-in slide-in-from-top-2 duration-700 delay-300">
          <NotificationFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        {/* Liste des notifications avec animations */}
        <div className="mt-6 sm:mt-8 animate-in slide-in-from-top-2 duration-700 delay-500">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/5 border border-white/10 rounded-full p-4 sm:p-6 backdrop-blur-sm">
                  <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3 px-4">
                {searchQuery || selectedFilter !== 'all' ? 'Aucune notification trouvée' : 'Aucune notification'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base px-4 leading-relaxed">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez'
                  : 'Vous n\'avez pas encore de notifications. Elles apparaîtront ici dès qu\'il y en aura.'
                }
              </p>
              {(searchQuery || selectedFilter !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                  variant="ghost"
                  className="mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-sm"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="animate-in slide-in-from-top-2 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <NotificationCard
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDeleteNotification}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistiques en bas de page */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 animate-in slide-in-from-bottom-2 duration-700 delay-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Total</p>
                    <p className="text-base sm:text-lg font-semibold text-white">{notifications.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Non lues</p>
                    <p className="text-base sm:text-lg font-semibold text-white">{unreadCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Lues</p>
                    <p className="text-base sm:text-lg font-semibold text-white">{notifications.length - unreadCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications; 