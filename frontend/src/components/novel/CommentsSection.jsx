import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  ThumbsUp
} from 'lucide-react';

const CommentsSection = ({ 
  comments,
  replies,
  commentSort,
  setCommentSort,
  showCommentForm,
  setShowCommentForm,
  newComment,
  setNewComment,
  currentCommentPage,
  setCurrentCommentPage,
  totalCommentPages,
  expandedComments,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  onCommentSubmit,
  onCommentLike,
  onReplySubmit,
  onReplyLike,
  onToggleReplies,
  formatDate,
  getAvatarInitials
}) => {
  
  // État pour le dropdown personnalisé du tri
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Options du tri avec icônes
  const sortOptions = [
    { value: 'newest', label: 'Plus récents', icon: Clock },
    { value: 'oldest', label: 'Plus anciens', icon: Clock },
    { value: 'likes', label: 'Plus likés', icon: ThumbsUp }
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === commentSort);
    return option ? option.label : 'Plus récents';
  };

  const handleSortChange = (value) => {
    setCommentSort(value);
    setIsSortDropdownOpen(false);
  };
  
  // Composant Pagination
  const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    if (totalPages <= 1) return null;

    return (
      <div className={`flex justify-center items-center gap-2 ${className}`}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1 max-w-xs overflow-x-auto scrollbar-hide">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                  currentPage === page
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-slate-600/50'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 sm:p-6 mb-8">
        
        {/* Header de la section commentaires */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Commentaires ({comments.length})
          </h2>
          
          {/* Tri des commentaires */}
          <div className="flex gap-3">
            {/* Dropdown personnalisé pour le tri */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center justify-between px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm hover:bg-slate-600/50 transition-colors min-w-[180px]"
              >
                <span>{getCurrentSortLabel()}</span>
                {isSortDropdownOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {isSortDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto min-w-[180px]">
                  {sortOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
                      >
                        <span className="text-white text-sm">{option.label}</span>
                        <div className="flex items-center gap-1 text-blue-400">
                          <IconComponent className="w-3 h-3" />
                          <span className="text-xs">
                            {option.value === 'newest' ? '↓' : option.value === 'oldest' ? '↑' : '♥'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="px-4 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-colors text-sm"
            >
              Commenter
            </button>
          </div>
        </div>

        {/* Formulaire de commentaire */}
        {showCommentForm && (
          <form onSubmit={onCommentSubmit} className="mb-6 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              rows={4}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-sm sm:text-base"
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="px-4 py-3 bg-slate-600/50 text-gray-300 rounded-xl hover:bg-slate-500/50 transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Publier
              </button>
            </div>
          </form>
        )}

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">Aucun commentaire</h3>
              <p className="text-gray-400">Soyez le premier à commenter ce roman !</p>
              {!showCommentForm && (
                <button
                  onClick={() => setShowCommentForm(true)}
                  className="mt-4 px-4 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-colors"
                >
                  Écrire un commentaire
                </button>
              )}
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                {/* En-tête du commentaire */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 text-xs sm:text-sm font-medium">
                      {comment.avatar ? (
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        getAvatarInitials(comment.author)
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-base">{comment.author}</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Actions du commentaire */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCommentLike(comment.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs sm:text-sm ${
                        comment.isLiked 
                          ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors text-xs sm:text-sm"
                    >
                      <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Répondre</span>
                    </button>
                  </div>
                </div>

                {/* Contenu du commentaire */}
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-3">
                  {comment.content}
                </p>

                {/* Formulaire de réponse */}
                {replyingTo === comment.id && (
                  <form 
                    onSubmit={(e) => onReplySubmit(e, comment.id)} 
                    className="mt-4 p-3 bg-slate-800/50 border border-slate-600/30 rounded-lg"
                  >
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 text-xs font-medium flex-shrink-0">
                        <User className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Répondre à ${comment.author}...`}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1 bg-slate-600/50 text-gray-300 rounded-lg hover:bg-slate-500/50 transition-colors text-xs"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                          >
                            Répondre
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Réponses */}
                {comment.repliesCount > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => onToggleReplies(comment.id)}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm mb-3"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        expandedComments.includes(comment.id) ? 'rotate-180' : ''
                      }`} />
                      <span>
                        {expandedComments.includes(comment.id) 
                          ? 'Masquer les réponses' 
                          : `Voir ${comment.repliesCount} réponse${comment.repliesCount > 1 ? 's' : ''}`
                        }
                      </span>
                    </button>

                    {/* Liste des réponses */}
                    {expandedComments.includes(comment.id) && replies[comment.id] && (
                      <div className="space-y-3 ml-4 border-l-2 border-slate-600/50 pl-4">
                        {replies[comment.id].map((reply) => (
                          <div key={reply.id} className="bg-slate-800/30 border border-slate-600/30 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 text-xs font-medium">
                                  {reply.avatar ? (
                                    <img 
                                      src={reply.avatar} 
                                      alt={reply.author} 
                                      className="w-full h-full rounded-full object-cover" 
                                    />
                                  ) : (
                                    getAvatarInitials(reply.author)
                                  )}
                                </div>
                                <div>
                                  <h5 className="text-white font-medium text-sm">{reply.author}</h5>
                                  <p className="text-gray-400 text-xs">{formatDate(reply.createdAt)}</p>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => onReplyLike(comment.id, reply.id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs ${
                                  reply.isLiked 
                                    ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                                    : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                <span>{reply.likes}</span>
                              </button>
                            </div>
                            
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination des commentaires */}
        <Pagination
          currentPage={currentCommentPage}
          totalPages={totalCommentPages}
          onPageChange={setCurrentCommentPage}
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default CommentsSection; 