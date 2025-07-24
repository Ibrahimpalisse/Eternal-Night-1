import React from 'react';
import { Bookmark, BookOpen, Eye, Heart, MessageCircle, BookmarkX } from 'lucide-react';
import ResponsiveStatusBadge from '../ui/ResponsiveStatusBadge';

const NovelCard = ({ novel, viewMode, onNovelClick, onRemoveBookmark, formatRelativeTime }) => {
  return (
    <div 
      className={`group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer ${
        viewMode === 'list' ? 'flex gap-4 p-4' : ''
      }`}
      onClick={() => onNovelClick(novel)}
    >
      {/* Image du livre */}
      <div className={`relative overflow-hidden ${
        viewMode === 'list' ? 'w-20 h-28 flex-shrink-0' : 'h-48 sm:h-64 md:h-80'
      }`}>
        <img 
          src={novel.image}
          alt={novel.title}
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
          {novel.title.slice(0, 2).toUpperCase()}
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Badge statut */}
        <div className="absolute top-3 right-3">
          <ResponsiveStatusBadge 
            status={novel.status} 
            size="small"
            showText={false}
            className="backdrop-blur-sm"
          />
        </div>

        {/* Bouton supprimer favori */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveBookmark('novel', novel.id);
          }}
          className="absolute top-3 left-3 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <BookmarkX className="w-3 h-3" />
        </button>
      </div>

      {/* Contenu */}
      <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-3 sm:p-4 md:p-5'}>
        {/* Titre et auteur */}
        <div className="mb-2 sm:mb-4">
          <h3 className="text-white font-bold text-base sm:text-lg mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {novel.title}
          </h3>
          <p className="text-gray-400 text-sm">par {novel.author}</p>
        </div>

        {/* Statistiques */}
        <div className={`grid gap-3 sm:gap-4 text-xs sm:text-sm mt-3 ${
          viewMode === 'list' ? 'grid-cols-4' : 'grid-cols-2'
        }`}>
          <div className="flex items-center justify-start gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 min-w-0">
            <BookOpen className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{novel.chapters}</span>
          </div>
          <div className="flex items-center justify-start gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 min-w-0">
            <Eye className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{novel.views?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center justify-start gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 min-w-0">
            <Heart className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{novel.favorites?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center justify-start gap-2 text-green-400 hover:text-green-300 transition-colors duration-200 min-w-0">
            <MessageCircle className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium truncate">{novel.comments}</span>
          </div>
        </div>

        {/* Date d'ajout aux favoris */}
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Bookmark className="w-3 h-3" />
            Ajouté {formatRelativeTime(novel.bookmarkedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NovelCard; 