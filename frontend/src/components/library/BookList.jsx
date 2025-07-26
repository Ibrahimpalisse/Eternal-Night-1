import React from 'react';
import { BookOpen, Heart, MessageCircle, Clock, CheckCircle, Eye } from 'lucide-react';
import ResponsiveStatusBadge from '../ui/ResponsiveStatusBadge';
import RankingBadge from '../ui/RankingBadge';

const BookList = ({ books, onBookClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'terminé':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'en_cours':
        return <Clock className="w-4 h-4 text-orange-400" />;
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

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun roman trouvé</h3>
          <p className="text-gray-500 text-sm">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {books.map((book, index) => {
        return (
          <div
            key={book.id}
            onClick={() => onBookClick && onBookClick(book)}
            className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 flex items-center hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer group"
          >
            <div className="flex gap-2 sm:gap-4">
              {/* Image */}
              <div className="relative w-16 h-24 sm:w-28 sm:h-40 flex-shrink-0">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Placeholder CSS quand l'image ne charge pas */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white font-bold text-lg hidden"
                  style={{ display: 'none' }}
                >
                  {book.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute top-1 right-1">
                  <ResponsiveStatusBadge 
                    status={book.status} 
                    size="small"
                    showText={false}
                    className="backdrop-blur-sm"
                  />
                </div>
                {/* Badge de classement */}
                <div className="absolute bottom-1 left-1">
                  <RankingBadge ranking={index + 1} size="small" />
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-purple-300 transition-colors truncate">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">par {book.author}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                  {book.description}
                </p>

                <div className="flex items-center gap-3 sm:gap-5 text-gray-400 text-xs sm:text-sm flex-wrap">
                  <span className="flex items-center gap-2 hover:text-blue-300 transition-colors duration-200 min-w-0">
                    <BookOpen className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline font-medium">{book.chapters} chapitres</span>
                    <span className="sm:hidden font-medium">{book.chapters}</span>
                  </span>
                  <span className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 min-w-0">
                    <Eye className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline font-medium">{book.views?.toLocaleString() || 0} vues</span>
                    <span className="sm:hidden font-medium">{book.views?.toLocaleString() || 0}</span>
                  </span>
                  <span className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 min-w-0">
                    <Heart className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline font-medium">{book.favorites?.toLocaleString() || 0} favoris</span>
                    <span className="sm:hidden font-medium">{book.favorites?.toLocaleString() || 0}</span>
                  </span>
                  <span className="flex items-center gap-2 hover:text-green-300 transition-colors duration-200 min-w-0">
                    <MessageCircle className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{book.comments}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* CSS pour line-clamp */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BookList; 