import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  MessageSquare, 
  MessageCircle,
  Calendar, 
  Clock, 
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  Trash2,
  BookOpen,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Reply,
  Heart,
  UserCheck,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

// Import des données JSON
import commentsData from '../../../data/commentsData.json';

// Composant de confirmation pour supprimer un commentaire
const DeleteCommentConfirmDialog = ({ isOpen, onClose, comment, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !comment) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(comment);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Supprimer le commentaire</h3>
            <p className="text-sm text-red-400">Cette action est irréversible</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Êtes-vous sûr de vouloir supprimer ce commentaire ?
          </p>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-gray-300 text-sm italic">"{comment.content}"</p>
            <p className="text-gray-400 text-xs mt-2">
              Publié le {new Date(comment.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 border border-red-500 rounded-lg text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

// Composant de confirmation pour supprimer un like
const DeleteLikeConfirmDialog = ({ isOpen, onClose, like, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !like) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(like);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Supprimer le like</h3>
            <p className="text-sm text-red-400">Cette action est irréversible</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Êtes-vous sûr de vouloir supprimer le like de{' '}
            <span className="font-medium text-white">{like.name}</span> ?
          </p>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {like.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{like.name}</p>
                <p className="text-gray-400 text-xs">
                  A liké le {new Date(like.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 border border-red-500 rounded-lg text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

// Composant pour afficher les réponses dans une popup
const RepliesModal = ({ comment, isOpen, onClose, onUserClick }) => {
  const [selectedReplyForLikes, setSelectedReplyForLikes] = useState(null);
  const [showReplyLikesModal, setShowReplyLikesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReplyForDelete, setSelectedReplyForDelete] = useState(null);
  const [showDeleteReplyDialog, setShowDeleteReplyDialog] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const replies = (comment && commentsData.replies[comment.id]) || [];

  // Filtrage et tri des réponses
  const filteredAndSortedReplies = useMemo(() => {
    let filtered = replies.filter(reply => {
      const matchesSearch = reply.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reply.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const replyDate = new Date(reply.date);
      const matchesDateFrom = !filterDateFrom || replyDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || replyDate <= new Date(filterDateTo + 'T23:59:59');
      
      return matchesSearch && matchesDateFrom && matchesDateTo;
    });

    // Tri par date uniquement
    filtered.sort((a, b) => {
      const comparison = new Date(a.date) - new Date(b.date);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [replies, searchTerm, filterDateFrom, filterDateTo, sortBy, sortOrder]);

  const handleShowReplyLikes = (reply) => {
    setSelectedReplyForLikes(reply);
    setShowReplyLikesModal(true);
  };

  const handleCloseReplyLikes = () => {
    setShowReplyLikesModal(false);
    setSelectedReplyForLikes(null);
  };

  const handleDeleteReply = (reply) => {
    setSelectedReplyForDelete(reply);
    setShowDeleteReplyDialog(true);
  };

  const handleCloseDeleteReply = () => {
    setShowDeleteReplyDialog(false);
    setSelectedReplyForDelete(null);
  };

  const confirmDeleteReply = async (reply) => {
    console.log('Suppression de la réponse:', reply);
    // Ici vous implémenteriez la logique de suppression
    // Par exemple: await deleteReply(reply.id);
  };

  // Early return après tous les hooks
  if (!isOpen || !comment) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getAvatarInitials = (name) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  const toggleReplyExpansion = (replyId) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  const truncateReplyText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-700/50 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Reply className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">Réponses au commentaire</h3>
                <p className="text-gray-400 text-xs sm:text-sm truncate">{filteredAndSortedReplies.length} sur {replies.length} réponse{replies.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  showFilters 
                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                    : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                title={showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtres pour les réponses */}
        {showFilters && (
          <div className="border-b border-slate-700/50 p-2 sm:p-4 bg-slate-800/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Recherche */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Contenu ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Date de début */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Date de début</label>
              <input
                type="datetime-local"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-xs sm:text-sm"
              />
            </div>

            {/* Date de fin */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Date de fin</label>
              <input
                type="datetime-local"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-xs sm:text-sm"
              />
            </div>

            {/* Ordre */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Ordre</label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full px-2 sm:px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-600/50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                title={sortOrder === 'asc' ? 'Plus anciens en premier' : 'Plus récents en premier'}
              >
                {sortOrder === 'asc' ? (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Plus anciens</span>
                    <span className="sm:hidden">Anciens</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Plus récents</span>
                    <span className="sm:hidden">Récents</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bouton réinitialiser */}
          {(searchTerm || filterDateFrom || filterDateTo || sortOrder !== 'desc') && (
            <div className="mt-3 sm:mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                  setSortOrder('desc');
                }}
                className="px-3 sm:px-4 py-2 text-xs bg-gray-600/50 hover:bg-gray-500/50 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Réinitialiser</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>
          )}
        </div>
        )}

        {/* Commentaire original */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/20">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400">Commentaire original</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-2">{comment.content}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {comment.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <Reply className="w-3 h-3" />
                {comment.replies} réponse{comment.replies > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Liste des réponses */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredAndSortedReplies.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedReplies.map((reply) => (
                <div key={reply.id} className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${getAvatarColor(reply.author)} ${reply.author.startsWith('Auteur -') ? 'ring-2 ring-green-400' : ''}`}>
                      {getAvatarInitials(reply.author)}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      {/* En-tête */}
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => onUserClick && onUserClick(reply.author)}
                          className={`font-medium text-sm ${reply.author.startsWith('Auteur -') ? 'text-green-400 hover:text-green-300' : 'text-white hover:text-blue-400'} transition-colors cursor-pointer hover:underline text-left`}
                          title={`Voir les informations de ${reply.author}`}
                        >
                          {reply.author}
                        </button>
                        <span className="text-xs text-gray-400">
                          {formatDate(reply.date)} à {formatTime(reply.date)}
                        </span>
                      </div>
                      
                      {/* Contenu de la réponse */}
                      <div className="mb-3">
                        <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                          <div className={`overflow-hidden transition-all duration-300 ${
                            expandedReplies.has(reply.id) 
                              ? 'max-h-80 overflow-y-auto custom-scrollbar' 
                              : 'max-h-24'
                          }`}>
                            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {expandedReplies.has(reply.id) 
                                ? reply.content 
                                : truncateReplyText(reply.content, 150)
                              }
                            </p>
                          </div>
                          {reply.content.length > 150 && (
                            <div className="mt-2 pt-2 border-t border-slate-600/20 flex items-center justify-between">
                              <button
                                onClick={() => toggleReplyExpansion(reply.id)}
                                className="px-2.5 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-all font-medium text-xs flex items-center gap-1.5"
                              >
                                {expandedReplies.has(reply.id) ? (
                                  <>
                                    <ChevronUp className="w-3 h-3" />
                                    Voir moins
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3 h-3" />
                                    Voir plus
                                  </>
                                )}
                              </button>
                              <span className="text-xs text-gray-500">
                                {reply.content.length} caractères
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Statistiques et actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          {reply.likedBy ? (
                            <button
                              onClick={() => handleShowReplyLikes(reply)}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300 transition-all group"
                            >
                              <Heart className="w-3 h-3 group-hover:fill-current" />
                              <span className="font-medium">{reply.likes} likes</span>
                              <span className="text-xs">• Voir qui</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-600/20 border border-slate-600/30 text-gray-400">
                              <Heart className="w-3 h-3" />
                              <span>{reply.likes} likes</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Bouton de suppression */}
                        <button
                          onClick={() => handleDeleteReply(reply)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all hover:scale-105"
                          title="Supprimer la réponse"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Reply className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-lg mb-2">Aucune réponse</p>
              <p className="text-sm">Ce commentaire n'a pas encore de réponses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const replyLikesModal = showReplyLikesModal && selectedReplyForLikes && (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseReplyLikes();
        }
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Personnes qui ont liké la réponse</h3>
                <p className="text-gray-400 text-sm">{selectedReplyForLikes.likedBy?.length || 0} personne{(selectedReplyForLikes.likedBy?.length || 0) > 1 ? 's' : ''}</p>
              </div>
            </div>
            <button 
              onClick={handleCloseReplyLikes}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Réponse originale */}
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/20">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">Réponse de</span>
              <span className={`font-medium text-sm ${selectedReplyForLikes.author.startsWith('Auteur -') ? 'text-green-400' : 'text-white'}`}>
                {selectedReplyForLikes.author}
              </span>
              {selectedReplyForLikes.author.startsWith('Auteur -') && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                  <UserCheck className="w-3 h-3" />
                  <span>Auteur</span>
                </div>
              )}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{selectedReplyForLikes.content}</p>
          </div>
        </div>

        {/* Liste des personnes qui ont liké */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {selectedReplyForLikes.likedBy && selectedReplyForLikes.likedBy.length > 0 ? (
            <div className="space-y-3">
              {selectedReplyForLikes.likedBy.map((person) => (
                <div key={person.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${getAvatarColor(person.name)}`}>
                    {getAvatarInitials(person.name)}
                  </div>
                  
                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUserClick && onUserClick(person.name)}
                        className="font-medium text-white text-sm hover:text-blue-400 transition-colors cursor-pointer hover:underline"
                        title={`Voir les informations de ${person.name}`}
                      >
                        {person.name}
                      </button>
                      {person.isAuthor && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                          <UserCheck className="w-3 h-3" />
                          <span>Auteur</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDate(person.date)} à {formatTime(person.date)}
                    </p>
                  </div>
                  
                  {/* Bouton de suppression */}
                  <button
                    onClick={() => {
                      // Logique pour supprimer le like
                      console.log('Supprimer le like de:', person.name);
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                    title="Supprimer ce like"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-sm">Aucun like pour cette réponse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      {replyLikesModal && createPortal(replyLikesModal, document.body)}
      <DeleteCommentConfirmDialog
        comment={selectedReplyForDelete}
        isOpen={showDeleteReplyDialog}
        onClose={handleCloseDeleteReply}
        onConfirm={confirmDeleteReply}
      />
    </>
  );
};

// Composant pour afficher qui a liké le commentaire
const LikesHistoryModal = ({ comment, isOpen, onClose, onUserClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLikeForDelete, setSelectedLikeForDelete] = useState(null);
  const [showDeleteLikeDialog, setShowDeleteLikeDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrage et tri des likes
  const filteredAndSortedLikes = useMemo(() => {
    if (!comment || !comment.likedBy) return [];
    
    let filtered = comment.likedBy.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const likeDate = new Date(person.date);
      const matchesDateFrom = !filterDateFrom || likeDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || likeDate <= new Date(filterDateTo + 'T23:59:59');
      
      return matchesSearch && matchesDateFrom && matchesDateTo;
    });

    // Tri par date uniquement
    filtered.sort((a, b) => {
      const comparison = new Date(a.date) - new Date(b.date);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [comment?.likedBy, searchTerm, filterDateFrom, filterDateTo, sortBy, sortOrder]);

  const handleDeleteLike = (like) => {
    setSelectedLikeForDelete(like);
    setShowDeleteLikeDialog(true);
  };

  const handleCloseDeleteLike = () => {
    setShowDeleteLikeDialog(false);
    setSelectedLikeForDelete(null);
  };

  const confirmDeleteLike = async (like) => {
    console.log('Suppression du like:', like);
    // Ici vous implémenteriez la logique de suppression
    // Par exemple: await deleteLike(like.id);
  };

  if (!isOpen || !comment || !comment.likedBy) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-700/50 w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">Personnes qui ont liké</h3>
                <p className="text-gray-400 text-xs sm:text-sm truncate">{filteredAndSortedLikes.length} sur {comment.likedBy.length} like{comment.likedBy.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  showFilters 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                title={showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtres pour les likes */}
        {showFilters && (
          <div className="border-b border-slate-700/50 p-2 sm:p-4 bg-slate-800/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Recherche */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom de la personne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Date de début */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Date de début</label>
              <input
                type="datetime-local"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-xs sm:text-sm"
              />
            </div>

            {/* Date de fin */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Date de fin</label>
              <input
                type="datetime-local"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-xs sm:text-sm"
              />
            </div>

            {/* Ordre */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-medium text-gray-400">Ordre</label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full px-2 sm:px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-600/50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                title={sortOrder === 'asc' ? 'Plus anciens en premier' : 'Plus récents en premier'}
              >
                {sortOrder === 'asc' ? (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Plus anciens</span>
                    <span className="sm:hidden">Anciens</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Plus récents</span>
                    <span className="sm:hidden">Récents</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bouton réinitialiser */}
          {(searchTerm || filterDateFrom || filterDateTo || sortOrder !== 'desc') && (
            <div className="mt-3 sm:mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                  setSortOrder('desc');
                }}
                className="px-3 sm:px-4 py-2 text-xs bg-gray-600/50 hover:bg-gray-500/50 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Réinitialiser</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>
          )}
        </div>
        )}

        {/* Commentaire */}
        <div className="p-3 sm:p-6 border-b border-slate-700/50">
          <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-700/50">
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{comment.content}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-green-400" />
                {comment.likes} likes
              </span>
            </div>
          </div>
        </div>

        {/* Liste des personnes */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar">
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-white font-medium text-xs sm:text-sm flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Personnes qui ont aimé ce commentaire
            </h4>
            
            <div className="grid gap-2 sm:gap-3">
              {filteredAndSortedLikes.map((person) => (
                <div key={person.id} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-700/30 transition-colors">
                  {/* Avatar */}
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm ${getAvatarColor(person.name)} ${person.isAuthor ? 'ring-2 ring-green-400' : ''} flex-shrink-0`}>
                    {person.avatar}
                  </div>
                  
                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <button
                        onClick={() => onUserClick && onUserClick(person.name)}
                        className={`font-medium text-xs sm:text-sm ${person.isAuthor ? 'text-green-400 hover:text-green-300' : 'text-white hover:text-blue-400'} truncate transition-colors cursor-pointer hover:underline`}
                        title={`Voir les informations de ${person.name}`}
                      >
                        {person.name}
                      </button>
                      {person.isAuthor && (
                        <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30 flex-shrink-0">
                          <UserCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Auteur</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400 mt-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="truncate">{formatDate(person.date)} à {formatTime(person.date)}</span>
                    </div>
                  </div>
                  
                  {/* Bouton de suppression */}
                  <button
                    onClick={() => handleDeleteLike(person)}
                    className="p-1 sm:p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                    title="Supprimer ce like"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            {filteredAndSortedLikes.length === 0 && comment.likedBy.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p>Aucun like pour ce commentaire</p>
              </div>
            )}
            
            {filteredAndSortedLikes.length === 0 && comment.likedBy.length > 0 && (
              <div className="text-center py-8 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-lg mb-2">Aucun résultat</p>
                <p className="text-sm">Aucun like ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      <DeleteLikeConfirmDialog
        like={selectedLikeForDelete}
        isOpen={showDeleteLikeDialog}
        onClose={handleCloseDeleteLike}
        onConfirm={confirmDeleteLike}
      />
    </>
  );
};

// Composant TypeFilter moderne
const TypeFilter = ({ selectedType, onTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const typeOptions = [
    { 
      value: 'all', 
      label: 'Tous les types', 
      icon: Filter, 
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30'
    },
    { 
      value: 'chapter', 
      label: 'Chapitres', 
      icon: FileText, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      value: 'novel', 
      label: 'Romans', 
      icon: BookOpen, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculer la position du dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dropdownWidth = buttonRect.width;
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;
      
      // Ajuster horizontalement si débordement
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      
      // Ajuster verticalement si débordement
      if (top + 200 > viewportHeight) {
        top = buttonRect.top - 200 - 8;
      }
      
      setDropdownPosition({
        top: Math.max(10, top),
        left: Math.max(10, left),
        width: dropdownWidth
      });
    }
  }, [isOpen]);

  // Fermer le dropdown avec gestion intelligente du scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => setIsOpen(false);
    
    const handleScroll = (event) => {
      if (dropdownRef.current && (
          dropdownRef.current.contains(event.target) || 
          dropdownRef.current === event.target
        )) {
        return;
      }
      setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const selectedOption = typeOptions.find(option => option.value === selectedType);

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[9999] overflow-hidden"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '200px'
      }}
    >
      <div className="p-0">
        <div className="space-y-0">
          {typeOptions.map(option => {
            const isSelected = selectedType === option.value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onTypeChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-b border-slate-700/30 last:border-b-0 ${
                  isSelected
                    ? 'bg-slate-700/50 text-white border-l-4 border-l-blue-500'
                    : 'text-gray-300 hover:bg-slate-700/30 hover:text-white'
                }`}
              >
                <option.icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? option.color : 'text-gray-400'}`} />
                <span className="text-sm">{option.label}</span>
                {isSelected && (
                  <div className="ml-auto">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50 transition-all justify-between group"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {selectedOption && (
            <selectedOption.icon 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                selectedOption.value !== 'all' ? selectedOption.color : 'text-gray-400'
              }`} 
            />
          )}
          <span className="text-xs sm:text-sm truncate text-gray-200">
            {selectedOption?.label || 'Sélectionner un type'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform flex-shrink-0 text-gray-400 group-hover:text-gray-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};



const UserCommentsHistoryModal = ({ user, isOpen, onClose, onUserClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterTimeFrom, setFilterTimeFrom] = useState('');
  const [filterTimeTo, setFilterTimeTo] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCommentForLikes, setSelectedCommentForLikes] = useState(null);
  const [showLikesHistory, setShowLikesHistory] = useState(false);
  const [selectedCommentForReplies, setSelectedCommentForReplies] = useState(null);
  const [showRepliesModal, setShowRepliesModal] = useState(false);
  const [selectedCommentForDelete, setSelectedCommentForDelete] = useState(null);
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const commentsPerPage = 3; // Réduit pour pouvoir tester la pagination

  // Données simulées des réponses aux commentaires (anciennement)
  const oldMockReplies = {
    1: [
      {
        id: 101,
        parentId: 1,
        author: "Pierre Martin",
        content: "Je suis totalement d'accord ! Ce chapitre était vraiment captivant.",
        date: "2024-01-21T15:15:00Z",
        likes: 5
      },
      {
        id: 102,
        parentId: 1,
        author: "Sophie Dubois",
        content: "L'évolution du personnage principal dans ce chapitre est remarquable.",
        date: '2024-01-21T16:22:00Z',
        likes: 8
      },
      {
        id: 103,
        parentId: 1,
        author: "Marc Laurent",
        content: "Merci pour cette analyse ! J'avais raté certains détails.",
        date: '2024-01-21T18:45:00Z',
        likes: 2
      }
    ],
    2: [
      {
        id: 104,
        parentId: 2,
        author: "Auteur - Claire Rousseau",
        content: "Merci pour votre retour ! Ce personnage aura effectivement plus de développement dans les prochains chapitres.",
        date: '2024-01-20T17:30:00Z',
        likes: 12
      }
    ],
    3: [
      {
        id: 105,
        parentId: 3,
        author: "Emma Dubois",
        content: "Je partage votre avis ! Ce roman est vraiment exceptionnel.",
        date: '2024-01-19T11:30:00Z',
        likes: 6
      },
      {
        id: 106,
        parentId: 3,
        author: "David Leroy",
        content: "L'univers créé par l'auteur est vraiment immersif.",
        date: '2024-01-19T14:20:00Z',
        likes: 4
      },
      {
        id: 107,
        parentId: 3,
        author: "Auteur - Claire Rousseau",
        content: "Merci beaucoup pour vos encouragements ! Cela me motive énormément.",
        date: '2024-01-19T19:45:00Z',
        likes: 15
      },
      {
        id: 108,
        parentId: 3,
        author: "Alice Martin",
        content: "Vivement la suite ! Vous avez un talent incroyable.",
        date: '2024-01-19T20:15:00Z',
        likes: 7
      },
      {
        id: 109,
        parentId: 3,
        author: "Bob Dupont",
        content: "Ce roman mérite vraiment plus de visibilité !",
        date: '2024-01-20T08:30:00Z',
        likes: 9
      },
      {
        id: 110,
        parentId: 3,
        author: "Marie Legrand",
        content: "J'ai dévoré tous les chapitres disponibles en une nuit !",
        date: '2024-01-20T22:10:00Z',
        likes: 11
      },
      {
        id: 111,
        parentId: 3,
        author: "Thomas Petit",
        content: "L'intrigue est vraiment bien ficelée, bravo !",
        date: '2024-01-21T09:45:00Z',
        likes: 3
      }
    ],
    4: [
      {
        id: 112,
        parentId: 4,
        author: "Auteur - Claire Rousseau",
        content: "Merci de me l'avoir signalé ! Je vais clarifier ce passage dans la prochaine révision.",
        date: '2024-01-18T21:00:00Z',
        likes: 6
      },
      {
        id: 113,
        parentId: 4,
        author: "Paul Moreau",
        content: "Je pense que le passage fait référence aux événements du chapitre précédent.",
        date: '2024-01-19T08:15:00Z',
        likes: 3
      }
    ],
    6: [
      {
        id: 114,
        parentId: 6,
        author: "Julie Roux",
        content: "Pareil ! J'attends avec impatience chaque nouveau chapitre.",
        date: '2024-01-16T10:45:00Z',
        likes: 8
      },
      {
        id: 115,
        parentId: 6,
        author: "Nicolas Blanc",
        content: "Cette série est vraiment addictive, impossible de s'arrêter !",
        date: '2024-01-16T14:20:00Z',
        likes: 5
      },
      {
        id: 116,
        parentId: 6,
        author: "Auteur - Alex Chen",
        content: "Merci pour votre soutien ! Le prochain chapitre arrive bientôt.",
        date: '2024-01-16T18:30:00Z',
        likes: 12
      },
      {
        id: 117,
        parentId: 6,
        author: "Camille Durand",
        content: "L'univers cyberpunk est vraiment bien construit dans cette histoire.",
        date: '2024-01-17T07:50:00Z',
        likes: 7
      }
    ],
    7: [
      {
        id: 118,
        parentId: 7,
        author: "Lucas Martin",
        content: "Les descriptions sont effectivement magnifiques ! On visualise parfaitement les scènes.",
        date: '2024-01-15T15:30:00Z',
        likes: 6
      },
      {
        id: 119,
        parentId: 7,
        author: "Isabelle Dumont",
        content: "L'auteur a vraiment un don pour créer des atmosphères immersives.",
        date: '2024-01-15T17:45:00Z',
        likes: 4
      },
      {
        id: 120,
        parentId: 7,
        author: "Auteur - Claire Rousseau",
        content: "Merci ! J'essaie toujours de créer des images vivantes avec mes mots.",
        date: '2024-01-15T20:20:00Z',
        likes: 9
      },
      {
        id: 121,
        parentId: 7,
        author: "Kevin Leblanc",
        content: "Ce chapitre était particulièrement visuel, j'ai adoré !",
        date: '2024-01-16T06:15:00Z',
        likes: 5
      },
      {
        id: 122,
        parentId: 7,
        author: "Nathalie Girard",
        content: "Vos descriptions me rappellent les grands maîtres de la fantasy !",
        date: '2024-01-16T11:40:00Z',
        likes: 8
      }
    ],
    8: [
      {
        id: 123,
        parentId: 8,
        author: "Gabriel Roussel",
        content: "L'arc de développement du protagoniste est vraiment bien pensé.",
        date: '2024-01-14T13:20:00Z',
        likes: 7
      },
      {
        id: 124,
        parentId: 8,
        author: "Auteur - Claire Rousseau",
        content: "Merci ! C'était important pour moi de montrer cette évolution de manière naturelle.",
        date: '2024-01-14T19:10:00Z',
        likes: 10
      }
    ],
    9: [
      {
        id: 125,
        parentId: 9,
        author: "Auteur - Alex Chen",
        content: "Merci pour votre retour constructif ! Je vais vérifier ce point dans la prochaine révision.",
        date: '2024-01-13T18:15:00Z',
        likes: 4
      }
    ],
    10: [
      {
        id: 126,
        parentId: 10,
        author: "Sandra Moreau",
        content: "Totalement d'accord ! J'ai partagé sur tous mes réseaux.",
        date: '2024-01-12T09:30:00Z',
        likes: 8
      },
      {
        id: 127,
        parentId: 10,
        author: "François Dupuis",
        content: "Ce roman mérite vraiment d'être plus connu !",
        date: '2024-01-12T11:45:00Z',
        likes: 6
      },
      {
        id: 128,
        parentId: 10,
        author: "Auteur - Claire Rousseau",
        content: "Merci infiniment pour votre soutien ! Cela me touche énormément.",
        date: '2024-01-12T14:20:00Z',
        likes: 12
      },
      {
        id: 129,
        parentId: 10,
        author: "Lucie Bernard",
        content: "J'ai recommandé à tous mes amis, ils ont adoré aussi !",
        date: '2024-01-12T16:30:00Z',
        likes: 9
      },
      {
        id: 130,
        parentId: 10,
        author: "Vincent Legrand",
        content: "Excellent travail, continuez comme ça !",
        date: '2024-01-12T19:45:00Z',
        likes: 5
      },
      {
        id: 131,
        parentId: 10,
        author: "Amélie Roussel",
        content: "Hâte de voir la suite de cette saga !",
        date: '2024-01-13T07:20:00Z',
        likes: 7
      },
      {
        id: 132,
        parentId: 10,
        author: "Maxime Blanc",
        content: "Les personnages sont vraiment attachants.",
        date: '2024-01-13T10:15:00Z',
        likes: 6
      },
      {
        id: 133,
        parentId: 10,
        author: "Caroline Petit",
        content: "L'intrigue est captivante du début à la fin !",
        date: '2024-01-13T15:40:00Z',
        likes: 8
      }
    ],
    11: [
      {
        id: 134,
        parentId: 11,
        author: "Julien Martin",
        content: "Cette révélation m'a laissé sans voix ! Brillant !",
        date: '2024-01-11T20:30:00Z',
        likes: 15
      },
      {
        id: 135,
        parentId: 11,
        author: "Auteur - Alex Chen",
        content: "J'ai travaillé dur sur cette révélation, merci pour vos encouragements !",
        date: '2024-01-11T22:15:00Z',
        likes: 18
      },
      {
        id: 136,
        parentId: 11,
        author: "Patricia Durand",
        content: "Je n'avais absolument rien vu venir, chapeau !",
        date: '2024-01-12T06:45:00Z',
        likes: 12
      },
      {
        id: 137,
        parentId: 11,
        author: "Benjamin Roux",
        content: "Ce retournement de situation était parfaitement amené.",
        date: '2024-01-12T09:20:00Z',
        likes: 10
      },
      {
        id: 138,
        parentId: 11,
        author: "Sylvie Moreau",
        content: "J'ai relu le chapitre trois fois tellement j'étais surprise !",
        date: '2024-01-12T12:30:00Z',
        likes: 14
      },
      {
        id: 139,
        parentId: 11,
        author: "Antoine Girard",
        content: "Maintenant j'ai encore plus hâte de connaître la suite !",
        date: '2024-01-12T15:45:00Z',
        likes: 11
      },
      {
        id: 140,
        parentId: 11,
        author: "Céline Lefebvre",
        content: "Les indices étaient là depuis le début, génial !",
        date: '2024-01-12T18:20:00Z',
        likes: 13
      },
      {
        id: 141,
        parentId: 11,
        author: "Olivier Dubois",
        content: "Cette twist va marquer l'histoire de la science-fiction !",
        date: '2024-01-12T20:10:00Z',
        likes: 16
      },
      {
        id: 142,
        parentId: 11,
        author: "Martine Blanc",
        content: "Bravo pour cette écriture magistrale !",
        date: '2024-01-13T08:30:00Z',
        likes: 9
      },
      {
        id: 143,
        parentId: 11,
        author: "Gérard Rousseau",
        content: "Même ma femme qui ne lit jamais de SF a adoré !",
        date: '2024-01-13T11:15:00Z',
        likes: 8
      },
      {
        id: 144,
        parentId: 11,
        author: "Nadia Laurent",
        content: "Ce niveau d'écriture mérite vraiment un prix littéraire !",
        date: '2024-01-13T14:45:00Z',
        likes: 17
      },
      {
        id: 145,
        parentId: 11,
        author: "Fabrice Dumont",
        content: "L'auteur maîtrise parfaitement son art !",
        date: '2024-01-13T17:20:00Z',
        likes: 12
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'visible':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'hidden':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'chapter':
        return <FileText className="w-4 h-4" />;
      case 'novel':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'chapter':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'novel':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Filtrage et tri des commentaires
  const filteredAndSortedComments = useMemo(() => {
    let filtered = commentsData.comments.filter(comment => {
      const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           comment.targetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           comment.romanTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || comment.type === filterType;
      
      const commentDate = new Date(comment.date);
      
      // Filtrage par date
      const matchesDateFrom = !filterDateFrom || commentDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || commentDate <= new Date(filterDateTo + 'T23:59:59');
      
      // Filtrage par heure
      let matchesTimeFrom = true;
      let matchesTimeTo = true;
      
      if (filterTimeFrom) {
        const commentTime = commentDate.toTimeString().slice(0, 5); // Format HH:MM
        matchesTimeFrom = commentTime >= filterTimeFrom;
      }
      
      if (filterTimeTo) {
        const commentTime = commentDate.toTimeString().slice(0, 5); // Format HH:MM
        matchesTimeTo = commentTime <= filterTimeTo;
      }
      
      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo && matchesTimeFrom && matchesTimeTo;
    });

    // Tri par date uniquement
    filtered.sort((a, b) => {
      const comparison = new Date(a.date) - new Date(b.date);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [commentsData.comments, searchTerm, filterType, filterDateFrom, filterDateTo, filterTimeFrom, filterTimeTo, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedComments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = filteredAndSortedComments.slice(startIndex, startIndex + commentsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };



  const handleViewComment = (comment) => {
    console.log('Voir le commentaire:', comment);
    // Ici vous pourriez ouvrir une modale de détail ou naviguer vers le contenu
  };

  const handleDeleteComment = (comment) => {
    setSelectedCommentForDelete(comment);
    setShowDeleteCommentDialog(true);
  };

  const handleCloseDeleteComment = () => {
    setShowDeleteCommentDialog(false);
    setSelectedCommentForDelete(null);
  };

  const confirmDeleteComment = async (comment) => {
    console.log('Suppression du commentaire:', comment);
    // Ici vous implémenteriez la logique de suppression
    // Par exemple: await deleteComment(comment.id);
  };



  const handleShowLikesHistory = (comment) => {
    setSelectedCommentForLikes(comment);
    setShowLikesHistory(true);
  };

  const handleCloseLikesHistory = () => {
    setShowLikesHistory(false);
    setSelectedCommentForLikes(null);
  };

  const handleShowRepliesModal = (comment) => {
    setSelectedCommentForReplies(comment);
    setShowRepliesModal(true);
  };

  const handleCloseRepliesModal = () => {
    setShowRepliesModal(false);
    setSelectedCommentForReplies(null);
  };

  const getRepliesForComment = (commentId) => {
    return commentsData.replies[commentId] || [];
  };

  const formatReplyDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !user) return null;

  // Styles CSS simples pour le scroll
  const scrollStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(71, 85, 105, 0.2);
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(71, 85, 105, 0.6);
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(100, 116, 139, 0.8);
    }
  `;

  const modalContent = (
    <>
      <style>{scrollStyles}</style>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-700/50 w-full max-w-6xl h-[95vh] sm:h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Historique des commentaires</h2>
                <p className="text-xs sm:text-sm text-gray-400 truncate">Commentaires de {user.name} • {filteredAndSortedComments.length} trouvé(s)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  showFilters 
                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                    : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                title={showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex-shrink-0 p-3 sm:p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="space-y-3 sm:space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher dans les commentaires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-700/30 rounded-lg sm:rounded-xl border border-slate-600/30">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Type</label>
                  <TypeFilter selectedType={filterType} onTypeChange={(value) => setFilterType(value)} />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Date de début</label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full p-2 text-sm sm:text-base bg-slate-600/50 border border-slate-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full p-2 text-sm sm:text-base bg-slate-600/50 border border-slate-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Heure de début</label>
                  <input
                    type="time"
                    value={filterTimeFrom}
                    onChange={(e) => setFilterTimeFrom(e.target.value)}
                    className="w-full p-2 text-sm sm:text-base bg-slate-600/50 border border-slate-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Heure de fin</label>
                  <input
                    type="time"
                    value={filterTimeTo}
                    onChange={(e) => setFilterTimeTo(e.target.value)}
                    className="w-full p-2 text-sm sm:text-base bg-slate-600/50 border border-slate-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Ordre</label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full p-2 bg-slate-600/50 border border-slate-500/50 rounded-lg text-white hover:bg-slate-500/50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    title={sortOrder === 'asc' ? 'Plus anciens en premier' : 'Plus récents en premier'}
                  >
                    {sortOrder === 'asc' ? (
                      <>
                        <SortAsc className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Plus anciens</span>
                        <span className="sm:hidden">Anciens</span>
                      </>
                    ) : (
                      <>
                        <SortDesc className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Plus récents</span>
                        <span className="sm:hidden">Récents</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Bouton réinitialiser les filtres */}
            {(searchTerm || filterType !== 'all' || filterDateFrom || filterDateTo || filterTimeFrom || filterTimeTo) && (
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterDateFrom('');
                    setFilterDateTo('');
                    setFilterTimeFrom('');
                    setFilterTimeTo('');
                    setSortOrder('desc');
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-600/50 hover:bg-slate-500/50 rounded-lg border border-slate-500/50 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Réinitialiser les filtres</span>
                  <span className="sm:hidden">Réinitialiser</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Liste des commentaires */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 sm:p-6">
            {currentComments.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
              {currentComments.map((comment) => (
                <div key={comment.id} className="bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-700/50 p-3 sm:p-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      {/* En-tête du commentaire */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="text-xs text-gray-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDate(comment.date)}
                        </div>
                      </div>

                      {/* Cible du commentaire */}
                      <div className="mb-2 sm:mb-3">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Commentaire sur :</p>
                        <div className="mb-1">
                          {comment.type === 'chapter' ? (
                            <span className="text-white font-medium text-xs sm:text-sm">Chapitre {comment.targetId} - {comment.targetTitle}</span>
                          ) : (
                            <span className="text-white font-medium text-xs sm:text-sm">{comment.romanTitle}</span>
                          )}
                        </div>
                        {comment.type === 'chapter' && (
                          <p className="text-gray-400 text-xs">Roman : {comment.romanTitle}</p>
                        )}
                      </div>

                      {/* Contenu du commentaire */}
                      <div className="mb-3 sm:mb-4">
                        <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30">
                          <div className={`overflow-hidden transition-all duration-300 ${
                            expandedComments.has(comment.id) 
                              ? 'max-h-96 overflow-y-auto custom-scrollbar' 
                              : 'max-h-32'
                          }`}>
                            <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                              {expandedComments.has(comment.id) 
                                ? comment.content 
                                : truncateText(comment.content, 200)
                              }
                            </p>
                          </div>
                          {comment.content.length > 200 && (
                            <div className="mt-3 pt-3 border-t border-slate-600/30 flex items-center justify-between">
                              <button
                                onClick={() => toggleCommentExpansion(comment.id)}
                                className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-all font-medium text-xs sm:text-sm flex items-center gap-2"
                              >
                                {expandedComments.has(comment.id) ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    Voir moins
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    Voir plus
                                  </>
                                )}
                              </button>
                              <span className="text-xs text-gray-500">
                                {comment.content.length} caractères
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Statistiques et actions de réponse */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400">
                          {comment.likedBy ? (
                            <button
                              onClick={() => handleShowLikesHistory(comment)}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300 transition-all group"
                            >
                              <Heart className="w-3 h-3 group-hover:fill-current" />
                              <span className="font-medium">{comment.likes} likes</span>
                              <span className="text-xs">• Voir qui</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-600/20 border border-slate-600/30">
                              <Heart className="w-3 h-3" />
                              <span>{comment.likes} likes</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-600/20 border border-slate-600/30">
                            <Reply className="w-3 h-3" />
                            <span>{comment.replies} réponse{comment.replies > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        
                        {comment.replies > 0 && (
                          <button
                            onClick={() => handleShowRepliesModal(comment)}
                            className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Voir les réponses
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleViewComment(comment)}
                        className="p-2 sm:p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-all hover:scale-105"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment)}
                        className="p-2 sm:p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all hover:scale-105"
                        title="Supprimer le commentaire"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>


                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg mb-2">Aucun commentaire trouvé</p>
              <p className="text-gray-500 text-sm">Aucun commentaire ne correspond à vos critères de recherche.</p>
            </div>
          )}
          </div>
        </div>

        {/* Pagination simple et moderne */}
        {totalPages > 1 && (
          <div className="border-t border-slate-700/50 p-4 sm:p-6 bg-slate-800/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Informations de pagination */}
              <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                Affichage de <span className="font-medium text-white">{startIndex + 1}</span> à{' '}
                <span className="font-medium text-white">{Math.min(startIndex + commentsPerPage, filteredAndSortedComments.length)}</span> sur{' '}
                <span className="font-medium text-white">{filteredAndSortedComments.length}</span> commentaires
              </div>

              {/* Contrôles de pagination */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Bouton première page - masqué sur mobile */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="hidden md:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Première page"
                >
                  <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {/* Bouton page précédente */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Page précédente"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {/* Numéros de pages - responsive */}
                <div className="hidden sm:flex items-center gap-1">
                  {(() => {
                    const delta = 2;
                    const range = [];
                    const rangeWithDots = [];

                    for (let i = Math.max(2, currentPage - delta); 
                         i <= Math.min(totalPages - 1, currentPage + delta); 
                         i++) {
                      range.push(i);
                    }

                    if (currentPage - delta > 2) {
                      rangeWithDots.push(1, '...');
                    } else {
                      rangeWithDots.push(1);
                    }

                    rangeWithDots.push(...range);

                    if (currentPage + delta < totalPages - 1) {
                      rangeWithDots.push('...', totalPages);
                    } else if (totalPages > 1) {
                      rangeWithDots.push(totalPages);
                    }

                    return rangeWithDots.map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-2 py-1 text-gray-400 text-sm">...</span>
                        ) : (
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200 text-sm font-medium ${
                              currentPage === page
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                                : 'border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ));
                  })()}
                </div>

                {/* Indicateur de page mobile */}
                <div className="sm:hidden px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium">
                  {currentPage} / {totalPages}
                </div>

                {/* Bouton page suivante */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Page suivante"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {/* Bouton dernière page - masqué sur mobile */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden md:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Dernière page"
                >
                  <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      <RepliesModal 
        comment={selectedCommentForReplies}
        isOpen={showRepliesModal}
        onClose={handleCloseRepliesModal}
        onUserClick={onUserClick}
      />
      <LikesHistoryModal 
        comment={selectedCommentForLikes}
        isOpen={showLikesHistory}
        onClose={handleCloseLikesHistory}
        onUserClick={onUserClick}
      />
      <DeleteCommentConfirmDialog
        comment={selectedCommentForDelete}
        isOpen={showDeleteCommentDialog}
        onClose={handleCloseDeleteComment}
        onConfirm={confirmDeleteComment}
      />
    </>
  );
};

export default UserCommentsHistoryModal;