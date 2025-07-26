import React, { useState } from 'react';
import { CheckCircle, X, Clock, Trash2, Eye, Heart, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const Icon = notification.icon;

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    onDelete(notification.id);
  };

  const handleAnnouncementClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    console.log('Annonce cliquée:', notification.id);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    console.log('Like cliqué pour l\'annonce:', notification.id, 'État:', !isLiked ? 'liké' : 'déliké');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;
    return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
  };

  const isAnnouncementWithImage = (notification.type === 'announcement' || notification.type === 'general') && notification.image;

  if (isAnnouncementWithImage) {
    return (
      <div
        className={`relative bg-white/5 border rounded-xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:bg-white/10 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 ${
          notification.isRead
            ? 'border-white/10 opacity-75'
            : `${notification.borderColor} shadow-lg shadow-purple-500/10`
        }`}
        onClick={handleAnnouncementClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image à gauche, affichée entièrement */}
          <div className="flex-shrink-0 w-full sm:w-48 h-48 bg-black/10 flex items-center justify-center">
            <img
              src={notification.image}
              alt={notification.title}
              className="w-full h-full object-contain rounded-t-xl sm:rounded-l-xl sm:rounded-t-none bg-white"
              style={{ backgroundColor: '#fff' }}
            />
          </div>

          {/* Contenu à droite */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-lg ${notification.bgColor} border ${notification.borderColor}`}>
                  <Icon className={`w-4 h-4 ${notification.color}`} />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${notification.type === 'announcement' ? 'bg-blue-500/20 border-blue-400/30 text-blue-300' : 'bg-gray-500/20 border-gray-400/30 text-gray-300'}`}>{notification.type === 'announcement' ? 'Annonce' : 'Général'}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                {notification.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                {notification.message}
              </p>
            </div>
            {/* Metadata et actions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>245</span>
                  </div>
                  <button
                    className={`flex items-center space-x-1 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-1 focus:ring-offset-transparent rounded p-1 hover:scale-110 ${
                      isLiked
                        ? 'text-red-400'
                        : 'text-gray-500 hover:text-red-400'
                    }`}
                    onClick={handleLikeClick}
                    aria-label={isLiked ? 'Retirer le like' : 'Ajouter un like'}
                    aria-pressed={isLiked}
                    title={isLiked ? 'Retirer le like' : 'Ajouter un like'}
                  >
                    <Heart className={`w-3 h-3 transition-all duration-200 ${isLiked ? 'fill-current scale-110' : ''}`} />
                    <span className="font-medium">{isLiked ? '33' : '32'}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatTimeAgo(notification.timestamp)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead();
                      }}
                      className="h-8 px-3 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 hover:border-green-500/40 transition-all duration-200 hover:scale-105"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Marquer comme lu
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="h-8 px-3 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Notification standard
  return (
    <div
      className={`relative bg-white/5 border rounded-xl p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 transform hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/10 ${
        notification.isRead
          ? 'border-white/10 opacity-75'
          : `${notification.borderColor} shadow-lg shadow-purple-500/10`
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!notification.isRead && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse" />
      )}
      <div className="flex items-start space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${notification.bgColor} border ${notification.borderColor} transition-all duration-200 hover:scale-110`}>
          <Icon className={`w-4 h-4 ${notification.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {notification.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center space-x-2">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsRead}
              className="h-7 px-2 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 hover:border-green-500/40 transition-all duration-200 hover:scale-105"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Lu
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(notification.timestamp)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-7 px-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

    </div>
  );
};

export default NotificationCard; 