import React, { useState } from 'react';
import { Edit, Trash2, Eye, Heart, MessageCircle, Calendar } from 'lucide-react';

const PostCard = ({ post, onEdit, onDelete }) => {
  const [imageSize, setImageSize] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const aspectRatio = naturalWidth / naturalHeight;
    
    setImageSize({
      width: naturalWidth,
      height: naturalHeight,
      aspectRatio,
      isLandscape: aspectRatio > 1.2,
      isPortrait: aspectRatio < 0.8,
      isSquare: aspectRatio >= 0.8 && aspectRatio <= 1.2
    });
  };

  const getImageClasses = () => {
    if (!imageSize) {
      return "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-32 lg:w-56 lg:h-36";
    }

    if (imageSize.isLandscape) {
      return "w-40 h-24 sm:w-48 sm:h-28 md:w-56 md:h-32 lg:w-64 lg:h-36";
    } else if (imageSize.isPortrait) {
      return "w-24 h-32 sm:w-28 sm:h-40 md:w-32 md:h-48 lg:w-36 lg:h-56";
    } else {
      return "w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'announcement':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'general':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'update':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
      {/* Layout principal avec image à gauche */}
      <div className={`flex gap-6 ${!post.imagePreview ? 'flex-col' : ''}`}>
        {/* Image à gauche si présente */}
        {post.imagePreview && (
          <div className="flex-shrink-0">
            <img 
              src={post.imagePreview} 
              alt={post.title}
              className={`${getImageClasses()} object-cover rounded-lg transition-all duration-300`}
              onLoad={handleImageLoad}
              style={{
                objectPosition: 'center'
              }}
            />
            {imageSize && (
              <div className="mt-1 text-xs text-gray-500">
                {imageSize.width}×{imageSize.height}
                {imageSize.isLandscape && ' (Paysage)'}
                {imageSize.isPortrait && ' (Portrait)'}
                {imageSize.isSquare && ' (Carré)'}
              </div>
            )}
          </div>
        )}

        {/* Contenu principal à droite */}
        <div className="flex-1 min-w-0">
          {/* Header avec titre et badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {post.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                  {post.status === 'published' ? 'Publié' : 
                   post.status === 'draft' ? 'Brouillon' : 
                   post.status === 'scheduled' ? 'Programmé' : post.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(post.type)}`}>
                  {post.type === 'announcement' ? 'Annonce' :
                   post.type === 'general' ? 'Général' :
                   post.type === 'update' ? 'Mise à jour' : post.type}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(post)}
                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                title="Modifier"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(post)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="mb-4">
            <p className="text-gray-300 line-clamp-3">
              {post.content}
            </p>
          </div>
        </div>
      </div>

      {/* Footer avec stats et date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-400">
            <Eye size={16} />
            <span className="text-sm">{post.views || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Heart size={16} />
            <span className="text-sm">{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <MessageCircle size={16} />
            <span className="text-sm">{post.comments || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Calendar size={14} />
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 