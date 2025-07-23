import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Share,
  Bookmark,
  Play
} from 'lucide-react';
import { ResponsiveStatusBadge } from '../ui';

const NovelHeader = ({ novel, isFavorited, setIsFavorited, isBookmarked, setIsBookmarked, onStartReading }) => {
  const navigate = useNavigate();

  const getAvatarInitials = (title) => {
    return title.split(' ').map(word => word[0]).join('').slice(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8">
      
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 text-gray-300 hover:text-white transition-colors mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Retour</span>
      </button>

      {/* Header du roman */}
      <div className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col md:flex-row">
          
          {/* Image de couverture avec badges en responsive */}
          <div className="relative w-full md:w-80 lg:w-96 flex-shrink-0">
            {/* Badges à droite de l'image en mode responsive */}
            <div className="absolute top-4 right-4 md:hidden flex items-center gap-2 z-10">
              <ResponsiveStatusBadge status={novel.status} />
              {novel.isNew && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold">
                  NOUVEAU
                </span>
              )}
            </div>
            
            <div className="aspect-[3/4] md:aspect-auto md:h-96 relative">
              {novel.image ? (
                <img
                  src={novel.image}
                  alt={novel.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700/50 to-slate-800/50"
                style={{ display: novel.image ? 'none' : 'flex' }}
              >
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto text-slate-400 mb-2" />
                  <span className="text-slate-300 text-xl font-bold">
                    {getAvatarInitials(novel.title)}
                  </span>
                </div>
              </div>
              
              {/* Overlay avec titre et auteur en bas de l'image - uniquement en responsive */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:hidden">
                <h1 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">
                  {novel.title}
                </h1>
                <p className="text-sm text-purple-300 opacity-90">
                  Par {novel.author}
                </p>
              </div>
            </div>
          </div>

          {/* Informations du roman */}
          <div className="flex-1 p-4 sm:p-6 md:p-8">
            
            {/* Titre et auteur - visibles uniquement sur desktop */}
            <div className="mb-4 hidden md:block">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {novel.title}
                </h1>
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <ResponsiveStatusBadge status={novel.status} />
                  {novel.isNew && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold">
                      NOUVEAU
                    </span>
                  )}
                </div>
              </div>
              <p className="text-lg text-purple-300 mb-4">
                Par {novel.author}
              </p>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-base sm:text-lg">{novel.chapters}</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Chapitres</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-base sm:text-lg">{(novel.views / 1000).toFixed(1)}k</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Vues</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-base sm:text-lg">{(novel.favorites / 1000).toFixed(1)}k</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Favoris</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-base sm:text-lg">{novel.comments}</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Commentaires</p>
              </div>
            </div>

            {/* Bouton principal de lecture */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={onStartReading}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">
                  {novel.lastReadChapter ? `Continuer la lecture (Ch. ${novel.lastReadChapter + 1})` : 'Commencer à lire'}
                </span>
              </button>
            </div>

            {/* Boutons d'action secondaires */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center md:justify-start">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl transition-all text-sm ${
                  isFavorited 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-red-500/20 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">
                  {isFavorited ? 'Retiré des likes' : 'Liker'}
                </span>
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl transition-all text-sm ${
                  isBookmarked 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-blue-500/20 hover:text-blue-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">
                  {isBookmarked ? 'Retiré des favoris' : 'Mettre en favori'}
                </span>
              </button>
              
              <button className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-slate-700/50 text-gray-300 border border-slate-600/50 rounded-xl hover:bg-slate-600/50 transition-all text-sm">
                <Share className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {novel.description}
              </p>
            </div>

            {/* Tags */}
            {novel.tags && novel.tags.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {novel.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700/50 text-gray-300 border border-slate-600/50 rounded-md text-xs sm:text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelHeader; 