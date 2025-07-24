import React from 'react';
import { BookOpen, Heart, MessageCircle, Clock, CheckCircle, Eye, Calendar, User } from 'lucide-react';
import ResponsiveStatusBadge from '../ui/ResponsiveStatusBadge';

const BookCard = ({ book, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'terminé':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'en_cours':
        return <Clock className="w-3 h-3 text-orange-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'terminé':
        return 'bg-green-500/90';
      case 'en_cours':
        return 'bg-orange-500/90';
      default:
        return 'bg-gray-500/90';
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(book)}
      className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group cursor-pointer max-w-[12rem] w-full mx-auto sm:max-w-none"
      style={{ cursor: 'pointer' }}
    >
      {/* Image du livre */}
      <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Placeholder CSS quand l'image ne charge pas */}
        <div 
          className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-2xl sm:text-4xl hidden"
          style={{ display: 'none' }}
        >
          {book.title.slice(0, 2).toUpperCase()}
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

        {/* Badge statut */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <ResponsiveStatusBadge 
            status={book.status} 
            size="small"
            showText={false}
            className="backdrop-blur-sm"
          />
        </div>


      </div>

      {/* Contenu */}
      <div className="p-3 sm:p-4 lg:p-5">
        {/* Titre et auteur */}
        <div className="mb-2 sm:mb-3 lg:mb-4">
          <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">par {book.author}</p>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-3">
          {book.description}
        </p>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mt-3">
          <div className="flex items-center justify-start gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 min-w-0">
            <BookOpen className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{book.chapters}</span>
          </div>
          <div className="flex items-center justify-start gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 min-w-0">
            <Eye className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{book.views?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center justify-start gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 min-w-0">
            <Heart className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{book.favorites?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center justify-start gap-2 text-green-400 hover:text-green-300 transition-colors duration-200 min-w-0">
            <MessageCircle className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{book.comments}</span>
          </div>
        </div>
      </div>

      {/* CSS pour line-clamp */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BookCard; 