import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  AlertTriangle, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  RotateCcw,
  Shield,
  Flag,
  UserCheck,
  SortAsc,
  SortDesc,
  ExternalLink,
  ChevronDown,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

// Import des données des commentaires et des modales utilisateur
import commentsData from '../../data/commentsData.json';
import UserDetailsModal from '../../components/admin/users/UserDetailsModal';
import UserEditModal from '../../components/admin/UserEditModal';

// Composant de confirmation pour les actions de modération
const ModerationConfirmDialog = ({ isOpen, onClose, comment, action, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');

  if (!isOpen || !comment) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'approve':
        return {
          title: 'Approuver le commentaire',
          description: 'Ce commentaire sera rendu visible et ne sera plus signalé',
          color: 'green',
          icon: Check,
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          buttonColor: 'bg-green-600 hover:bg-green-700 border-green-500'
        };
      case 'hide':
        return {
          title: 'Masquer le commentaire',
          description: 'Ce commentaire sera masqué mais conservé dans la base de données',
          color: 'yellow',
          icon: EyeOff,
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500'
        };
      case 'delete':
        return {
          title: 'Supprimer le commentaire',
          description: 'Cette action est irréversible. Le commentaire sera définitivement supprimé.',
          color: 'red',
          icon: Trash2,
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          buttonColor: 'bg-red-600 hover:bg-red-700 border-red-500'
        };
      default:
        return { 
          title: '', 
          description: '', 
          color: 'gray', 
          icon: X,
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30',
          buttonColor: 'bg-gray-600 hover:bg-gray-700 border-gray-500'
        };
    }
  };

  const actionConfig = getActionConfig();
  const IconComponent = actionConfig.icon;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(comment, action, reason);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
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
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 ${actionConfig.bgColor} rounded-xl ${actionConfig.borderColor} border`}>
            <IconComponent className={`w-5 h-5 ${actionConfig.textColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{actionConfig.title}</h3>
            <p className={`text-sm ${actionConfig.textColor}`}>{actionConfig.description}</p>
          </div>
        </div>

        {/* Commentaire */}
        <div className="mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {comment.author ? comment.author.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">{comment.author || 'Utilisateur inconnu'}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(comment.date).toLocaleDateString('fr-FR')} • {comment.romanTitle}
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm italic">"{comment.content}"</p>
          </div>
        </div>

        {/* Raison (optionnelle) */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            Raison de la modération (optionnel)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Expliquez brièvement la raison de cette action..."
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
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
            className={`flex-1 px-4 py-2 ${actionConfig.buttonColor} rounded-lg text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <IconComponent className="w-4 h-4" />
                Confirmer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

// Composant wrapper pour UserDetailsModal avec accès direct à l'édition
const UserDetailsModalWithEdit = ({ user, isOpen, onClose, onUserUpdate, onOpenUserEdit }) => {
  const handleUserEdit = (userToEdit, previousModal) => {
    console.log('Tentative d\'édition de l\'utilisateur:', userToEdit);
    
    // Fermer d'abord la modale de détails
    onClose();
    
    // Puis avec un délai, ouvrir la modale d'édition via le parent
    setTimeout(() => {
      console.log('Demande d\'ouverture de la modale d\'édition...');
      onOpenUserEdit(userToEdit);
    }, 150);
  };

  return (
    <UserDetailsModal
      user={user}
      isOpen={isOpen}
      onClose={onClose}
      onEdit={handleUserEdit}
    />
  );
};

// Composant de menu d'actions pour les commentaires
const CommentActionMenu = ({ comment, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const actions = [
    {
      id: 'approve',
      label: 'Approuver',
      icon: Check,
      color: 'text-green-400 hover:text-green-300',
      bgColor: 'hover:bg-green-500/10',
      description: 'Approuver le commentaire'
    },
    {
      id: 'hide',
      label: 'Masquer',
      icon: EyeOff,
      color: 'text-yellow-400 hover:text-yellow-300',
      bgColor: 'hover:bg-yellow-500/10',
      description: 'Masquer le commentaire'
    },
    {
      id: 'delete',
      label: 'Supprimer',
      icon: Trash2,
      color: 'text-red-400 hover:text-red-300',
      bgColor: 'hover:bg-red-500/10',
      description: 'Supprimer définitivement'
    }
  ];

  const handleAction = (actionId) => {
    onAction(comment, actionId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
        title="Actions"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 lg:right-0 top-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl min-w-[180px] sm:min-w-[200px] z-[60] overflow-hidden">
          <div className="p-2">
            {actions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 ${action.color} ${action.bgColor}`}
                  title={action.description}
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant principal pour les commentaires signalés
const ReportedComments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComment, setSelectedComment] = useState(null);
  const [moderationAction, setModerationAction] = useState(null);
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // États pour les modales utilisateur
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  
  // États pour la modale d'édition utilisateur
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  
  // États pour les dropdowns améliorés
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const commentsPerPage = 10;

  // Options de statut pour le dropdown amélioré
  const statusOptions = [
    { 
      value: 'all', 
      label: 'Tous les statuts', 
      icon: Filter, 
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20'
    },
    { 
      value: 'visible', 
      label: 'Visible', 
      icon: Eye, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    { 
      value: 'hidden', 
      label: 'Masqué', 
      icon: EyeOff, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    { 
      value: 'pending', 
      label: 'En attente', 
      icon: Clock, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  // Récupérer tous les commentaires signalés depuis les données
  const reportedComments = useMemo(() => {
    // Créer une liste étendue avec plus de commentaires signalés pour la démonstration
    const additionalReportedComments = [
      {
        id: 101,
        content: "Ce roman est vraiment nul, l'auteur ne sait pas écrire. Gaspillage de temps total.",
        type: "novel",
        targetTitle: "Les Chroniques d'Eldoria",
        targetId: 1,
        romanTitle: "Les Chroniques d'Eldoria",
        date: "2024-01-19T15:30:00Z",
        status: "hidden",
        likes: 2,
        replies: 0,
        reported: true,
        author: "CriticUser47",
        authorId: 501,
        reportReason: "Commentaire négatif inapproprié",
        reportedBy: "Sophie Dubois",
        reportedById: 2,
        reportedAt: "2024-01-19T16:45:00Z"
      },
      {
        id: 102,
        content: "Quelqu'un peut me donner l'adresse email de l'auteur ? J'ai des trucs à lui dire en privé...",
        type: "chapter", 
        targetTitle: "Chapter 1350: The Beginning",
        targetId: 1350,
        romanTitle: "Cyberpunk 2177",
        date: "2024-01-18T22:15:00Z",
        status: "visible",
        likes: 0,
        replies: 1,
        reported: true,
        author: "StrangeReader",
        authorId: 502,
        reportReason: "Demande d'informations personnelles",
        reportedBy: "Admin Principal",
        reportedById: 18,
        reportedAt: "2024-01-19T08:30:00Z"
      },
      {
        id: 103,
        content: "J'ai adoré ce chapitre ! Vivement la suite, c'est addictif !",
        type: "chapter",
        targetTitle: "Chapter 1355: The Jade Dew Mystery", 
        targetId: 1355,
        romanTitle: "Les Chroniques d'Eldoria",
        date: "2024-01-17T14:20:00Z",
        status: "visible",
        likes: 15,
        replies: 3,
        reported: true,
        author: "Marie Legrand",
        authorId: 8,
        reportReason: "Signalement erroné (commentaire positif)",
        reportedBy: "Troll User",
        reportedById: 503,
        reportedAt: "2024-01-18T09:15:00Z"
      }
    ];

    const existingReported = commentsData.comments.filter(comment => 
      comment.reported === true || comment.status === 'hidden'
    ).map(comment => ({
      ...comment,
      author: comment.author || 'Utilisateur anonyme',
      authorId: comment.authorId || Math.floor(Math.random() * 1000) + 100,
      reportReason: comment.reportReason || 'Contenu inapproprié',
      reportedBy: comment.reportedBy || 'Modérateur',
      reportedById: comment.reportedById || 1,
      reportedAt: comment.reportedAt || comment.date
    }));

    return [...existingReported, ...additionalReportedComments];
  }, []);

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Effect pour tracer les changements d'état de l'édition utilisateur
  useEffect(() => {
    console.log('États édition utilisateur:', { 
      isUserEditOpen, 
      selectedUserForEdit: !!selectedUserForEdit,
      selectedUserName: selectedUserForEdit?.name 
    });
  }, [isUserEditOpen, selectedUserForEdit]);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isStatusDropdownOpen && !event.target.closest('.status-dropdown')) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  // Filtrage et tri des commentaires
  const filteredAndSortedComments = useMemo(() => {
    let filtered = reportedComments.filter(comment => {
      const matchesSearch = 
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.romanTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || comment.status === filterStatus;
      
      const commentDate = new Date(comment.date);
      const matchesDateFrom = !filterDateFrom || commentDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || commentDate <= new Date(filterDateTo + 'T23:59:59');
      
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [reportedComments, searchTerm, sortBy, sortOrder, filterStatus, filterDateFrom, filterDateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedComments.length / commentsPerPage);
  const currentComments = filteredAndSortedComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const handleModeration = (comment, action) => {
    setSelectedComment(comment);
    setModerationAction(action);
    setShowModerationDialog(true);
  };

  const confirmModeration = async (comment, action, reason) => {
    console.log('Action de modération:', { comment, action, reason });
    // Ici, vous implémenteriez l'API call pour effectuer l'action
    // Par exemple: await moderateComment(comment.id, action, reason);
    
    // Simulation d'une action réussie
    setTimeout(() => {
      setShowModerationDialog(false);
      setSelectedComment(null);
      setModerationAction(null);
    }, 1000);
  };

  // Fonctions pour gérer les détails utilisateur
  const handleUserClick = (userName, userId, userType = 'user') => {
    // Créer un objet utilisateur factice basé sur les données disponibles
    const userDetails = {
      id: userId,
      name: userName,
      email: `${userName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      roles: userType === 'author' ? ['user', 'author'] : ['user'],
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-02-08',
      totalComments: Math.floor(Math.random() * 50) + 1,
      worksCount: userType === 'author' ? Math.floor(Math.random() * 10) + 1 : 0,
      followersCount: Math.floor(Math.random() * 100),
      likesReceived: Math.floor(Math.random() * 200)
    };
    
    setSelectedUserForDetails(userDetails);
    setIsUserDetailsOpen(true);
  };

  const closeUserDetails = () => {
    setIsUserDetailsOpen(false);
    setTimeout(() => {
      setSelectedUserForDetails(null);
    }, 150);
  };

  // Fonction pour rouvrir les détails utilisateur après modification
  const reopenUserDetails = (updatedUser) => {
    setSelectedUserForDetails(updatedUser);
    setIsUserDetailsOpen(true);
  };

  // Fonctions pour gérer l'édition d'utilisateur
  const openUserEdit = (userToEdit) => {
    console.log('Ouverture de la modale d\'édition pour:', userToEdit.name);
    setSelectedUserForEdit(userToEdit);
    setIsUserEditOpen(true);
  };

  const closeUserEdit = () => {
    setIsUserEditOpen(false);
    setTimeout(() => {
      setSelectedUserForEdit(null);
    }, 150);
  };

  const handleUserSave = async (updatedUser) => {
    console.log('Utilisateur mis à jour:', updatedUser);
    // Ici vous implémenteriez l'API call pour sauvegarder
    // Par exemple: await updateUser(updatedUser.id, updatedUser);
    
    // Simulation d'une sauvegarde réussie
    setTimeout(() => {
      closeUserEdit();
      // Notifier le parent de la mise à jour et rouvrir les détails
      setTimeout(() => {
        reopenUserDetails(updatedUser);
      }, 150);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'visible': { color: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'Visible', icon: Eye },
      'hidden': { color: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'Masqué', icon: EyeOff },
      'pending': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'En attente', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} border`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-hidden">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
        <div className="w-full lg:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
            </div>
            <span className="truncate">Commentaires Signalés</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Gérez les commentaires signalés par la communauté
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 lg:mt-0 w-full lg:w-auto justify-end">
          <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-400">{reportedComments.length}</div>
              <div className="text-xs text-gray-400">Signalements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700/50 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Rechercher dans les commentaires, auteurs, romans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 sm:py-3 rounded-lg border transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
              showFilters 
                ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' 
                : 'bg-slate-700/50 border-slate-600/50 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Filtres</span>
          </button>
        </div>

        {/* Filtres étendus */}
        {showFilters && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-600/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <label className="block text-white font-medium mb-2 text-sm">Filtrer par statut</label>
                <div className="relative status-dropdown">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-between hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const selectedOption = statusOptions.find(option => option.value === filterStatus);
                        const IconComponent = selectedOption?.icon || Filter;
                        return (
                          <>
                            <div className={`w-6 h-6 rounded-full ${selectedOption?.bgColor || 'bg-gray-500/20'} flex items-center justify-center`}>
                              <IconComponent className={`w-3 h-3 ${selectedOption?.color || 'text-gray-400'}`} />
                            </div>
                            <span className="text-sm font-medium">{selectedOption?.label || 'Tous les statuts'}</span>
                          </>
                        );
                      })()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-xl z-10 overflow-hidden">
                      {statusOptions.map((option) => {
                        const IconComponent = option.icon;
                        const isSelected = filterStatus === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilterStatus(option.value);
                              setIsStatusDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors flex items-center gap-3 ${
                              isSelected ? 'bg-purple-500/20 border-r-2 border-purple-500' : ''
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full ${option.bgColor} flex items-center justify-center`}>
                              <IconComponent className={`w-3 h-3 ${option.color}`} />
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                              {option.label}
                            </span>
                            {isSelected && <CheckCircle className="w-4 h-4 text-purple-400 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="block text-white font-medium mb-2 text-sm">Date de début</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="block text-white font-medium mb-2 text-sm">Date de fin</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {currentComments.length > 0 ? (
          currentComments.map((comment) => (
            <div key={comment.id} className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700/50 hover:bg-slate-700/30 transition-colors">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0 w-full lg:w-auto">
                  {/* En-tête du commentaire */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm sm:text-base">
                          {comment.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => handleUserClick(comment.author, comment.authorId, 'user')}
                          className="text-white font-medium hover:text-blue-400 transition-colors cursor-pointer hover:underline flex items-center gap-1 text-sm sm:text-base truncate"
                          title={`Voir les détails de ${comment.author}`}
                        >
                          <span className="truncate">{comment.author}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </button>
                        <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>{new Date(comment.date).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <Flag className="w-3 h-3 flex-shrink-0" />
                          <span>Signalé</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(comment.status)}
                    </div>
                  </div>

                  {/* Informations sur la cible */}
                  <div className="mb-3 sm:mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{comment.type === 'chapter' ? 'Commentaire sur le chapitre' : 'Commentaire sur le roman'}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        comment.type === 'chapter' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {comment.type === 'chapter' ? 'Chapitre' : 'Roman'}
                      </span>
                    </div>
                    <p className="text-white font-medium text-sm break-words">{comment.targetTitle}</p>
                    {comment.type === 'chapter' && (
                      <p className="text-gray-400 text-xs mt-1 break-words">Roman : {comment.romanTitle}</p>
                    )}
                  </div>

                  {/* Contenu du commentaire */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <p className="text-gray-300 text-sm italic break-words">"{comment.content}"</p>
                  </div>

                  {/* Raison du signalement */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="text-red-400 font-medium text-xs sm:text-sm">Raison du signalement :</span>
                          <span className="text-gray-300 text-xs sm:text-sm break-words">{comment.reportReason}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                          <span className="text-gray-500">Signalé par :</span>
                          <button
                            onClick={() => handleUserClick(comment.reportedBy, comment.reportedById, 'user')}
                            className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer hover:underline flex items-center gap-1 font-medium"
                            title={`Voir les détails de ${comment.reportedBy}`}
                          >
                            <span className="truncate max-w-[120px] sm:max-w-none">{comment.reportedBy}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </button>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">
                            {new Date(comment.reportedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 flex-shrink-0" />
                      {comment.likes || 0} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 flex-shrink-0" />
                      {comment.replies || 0} réponses
                    </span>
                  </div>
                </div>

                {/* Actions de modération */}
                <div className="flex flex-row lg:flex-col justify-end lg:justify-start gap-2 flex-shrink-0 w-full lg:w-auto mt-4 lg:mt-0">
                  <CommentActionMenu comment={comment} onAction={handleModeration} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-800/50 rounded-xl p-12 border border-slate-700/50 text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Aucun commentaire signalé</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Aucun commentaire ne correspond à vos critères de recherche.' 
                : 'Aucun commentaire n\'a été signalé récemment.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 gap-4 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            Affichage de {(currentPage - 1) * commentsPerPage + 1} à {Math.min(currentPage * commentsPerPage, filteredAndSortedComments.length)} sur {filteredAndSortedComments.length} commentaires
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-medium text-xs sm:text-sm whitespace-nowrap">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation de modération */}
      <ModerationConfirmDialog
        isOpen={showModerationDialog}
        onClose={() => setShowModerationDialog(false)}
        comment={selectedComment}
        action={moderationAction}
        onConfirm={confirmModeration}
      />

      {/* Modale des détails utilisateur */}
      {isUserDetailsOpen && selectedUserForDetails && (
        <UserDetailsModalWithEdit
          user={selectedUserForDetails}
          isOpen={isUserDetailsOpen}
          onClose={closeUserDetails}
          onUserUpdate={reopenUserDetails}
          onOpenUserEdit={openUserEdit}
        />
      )}

      {/* Modale de modification utilisateur */}
      {isUserEditOpen && selectedUserForEdit && (
        <UserEditModal
          user={selectedUserForEdit}
          isOpen={isUserEditOpen}
          onClose={closeUserEdit}
          onSave={handleUserSave}
          previousModal={{
            reopenCallback: () => reopenUserDetails(selectedUserForEdit)
          }}
        />
      )}
    </div>
  );
};

export default ReportedComments; 