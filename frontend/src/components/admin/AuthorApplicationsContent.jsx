import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../../contexts/ToastContext';
import { 
  Search, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  User,
  Mail,
  Calendar,
  Badge,
  FileText,
  MessageSquare,
  BookOpen,
  Edit3,
  UserPlus,
  ChevronDown,
  Trash2,
  Filter,
  Pause,
  EyeOff,
  Check
} from 'lucide-react';
import { Pagination } from './table';
import UserCommentsHistoryModal from './users/UserCommentsHistoryModal';
import UserDetailsModal from './users/UserDetailsModal';
import UserEditModal from './UserEditModal';
import { ApprovalConfirmationDialog, RejectionDialog, BlockDialog, UnblockDialog, DeleteDialog, GlobalApplicationHistoryModal } from './modals';

// Données simulées pour les candidatures d'auteurs
const mockApplications = [
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    age: 28,
    location: 'Paris, France',
    status: 'pending',
    appliedAt: '2024-02-05',
    joinDate: '2024-01-15',
    roles: ['user'],
    userStatus: 'active',
    authorPseudo: 'MarieDuboisAuteur',
    reasonToBeAuthor: 'J\'ai toujours rêvé d\'écrire et de partager mes histoires. J\'ai plusieurs manuscrits prêts et je pense que cette plateforme serait parfaite pour toucher un public passionné de littérature. Je veux contribuer à créer du contenu de qualité.',
    experience: 'Débutant',
    genres: ['Fantasy', 'Romance'],
    motivation: 'Passionnée d\'écriture depuis l\'enfance, je souhaite partager mes histoires avec une communauté de lecteurs...',
    writingSample: 'Extrait de mon roman en cours...',
    socialMedia: {
      website: 'https://marie-dubois-author.com',
      instagram: '@marie_writes',
      twitter: '@marie_dubois_writer'
    },
    previousPublications: 'Aucune publication antérieure',
    availability: 'Temps plein',
    portfolio: 'https://portfolio.marie-dubois.com',
    lastLogin: '2024-02-08',
    accountCreated: '2024-01-15',
    totalComments: 12,
    worksCount: 0
  },
  {
    id: 2,
    name: 'Thomas Martin',
    email: 'thomas.martin@email.com',
    phone: '+33 6 98 76 54 32',
    age: 35,
    location: 'Lyon, France',
    status: 'rejected',
    appliedAt: '2024-02-01',
    joinDate: '2024-01-05',
    roles: ['user'],
    userStatus: 'active',
    authorPseudo: 'ThomasThrillerWriter',
    reasonToBeAuthor: 'Ayant auto-publié plusieurs romans avec un succès modeste, je souhaite rejoindre une communauté d\'auteurs pour bénéficier de plus de visibilité et d\'échanges créatifs avec d\'autres écrivains.',
    experience: 'Intermédiaire',
    genres: ['Thriller', 'Mystère'],
    motivation: 'Auteur publié à compte d\'auteur, je cherche une plateforme pour toucher un public plus large...',
    writingSample: 'Chapitre 1 de "L\'Ombre du Passé"...',
    socialMedia: {
      website: 'https://thomas-martin-books.fr',
      instagram: '@thomas_thriller',
      twitter: null
    },
    previousPublications: '3 romans auto-publiés, 1 nouvelle dans un recueil collectif',
    availability: 'Temps partiel',
    portfolio: null,
    lastLogin: '2024-02-07',
    accountCreated: '2024-01-05',
    totalComments: 18,
    worksCount: 0
  },
  {
    id: 3,
    name: 'Sophie Leroy',
    email: 'sophie.leroy@email.com',
    phone: '+33 7 11 22 33 44',
    age: 42,
    location: 'Marseille, France',
    status: 'blocked',
    appliedAt: '2024-01-28',
    joinDate: '2024-01-12',
    roles: ['user'],
    userStatus: 'active',
    authorPseudo: 'SophieSciFi',
    reasonToBeAuthor: 'Ancienne journaliste reconvertie dans la fiction, j\'ai acquis une solide expérience d\'écriture que je souhaite maintenant mettre au service de la création littéraire. Cette plateforme me permettrait de toucher de nouveaux lecteurs.',
    experience: 'Expert',
    genres: ['Science-Fiction', 'Dystopie'],
    motivation: 'Ancienne journaliste reconvertie dans la fiction, j\'ai une solide expérience d\'écriture...',
    writingSample: 'Prologue de "2087 : La Dernière Terre"...',
    socialMedia: {
      website: null,
      instagram: null,
      twitter: '@sophie_scifi'
    },
    previousPublications: 'Articles de presse, 1 essai publié',
    availability: 'Temps plein',
    portfolio: 'https://sophie-leroy-writing.com',
    lastLogin: '2024-02-06',
    accountCreated: '2024-01-12',
    totalComments: 31,
    worksCount: 0
  },
  {
    id: 4,
    name: 'Alexandre Petit',
    email: 'alex.petit@email.com',
    phone: '+33 6 55 44 33 22',
    age: 24,
    location: 'Bordeaux, France',
    status: 'pending',
    appliedAt: '2024-02-07',
    joinDate: '2024-01-25',
    roles: ['user'],
    userStatus: 'active',
    authorPseudo: 'AlexFantasyAdventure',
    reasonToBeAuthor: 'Étudiant en littérature passionné par l\'écriture créative, j\'aimerais partager mes histoires avec une communauté de lecteurs et progresser grâce aux retours constructifs. Cette plateforme représente une opportunité parfaite pour débuter ma carrière d\'auteur.',
    experience: 'Débutant',
    genres: ['Fantasy', 'Aventure'],
    motivation: 'Étudiant en littérature, j\'écris des nouvelles depuis le lycée et souhaite me lancer professionnellement...',
    writingSample: 'Nouvelle complète "Le Gardien des Runes"...',
    socialMedia: {
      website: null,
      instagram: '@alex_fantasy_world',
      twitter: '@alex_petit_writer'
    },
    previousPublications: 'Nouvelles publiées dans le magazine de l\'université',
    availability: 'Temps partiel',
    portfolio: null,
    lastLogin: '2024-02-09',
    accountCreated: '2024-01-25',
    totalComments: 5,
    worksCount: 0
  },
  {
    id: 5,
    name: 'Camille Rousseau',
    email: 'camille.rousseau@email.com',
    phone: '+33 6 77 88 99 00',
    age: 31,
    location: 'Toulouse, France',
    status: 'pending',
    appliedAt: '2024-02-08',
    joinDate: '2024-01-20',
    roles: ['user'],
    userStatus: 'active',
    authorPseudo: 'CamilleEcrit',
    reasonToBeAuthor: 'En tant que blogueuse littéraire, j\'ai développé une passion pour l\'écriture créative. Mes followers me demandent souvent quand je publierai mes propres histoires. Je pense qu\'il est temps de franchir le pas et de devenir auteure sur cette plateforme.',
    experience: 'Intermédiaire',
    genres: ['Romance', 'Contemporain'],
    motivation: 'Blogueuse littéraire avec une communauté de 10k followers, je souhaite publier mes propres créations...',
    writingSample: 'Extrait de "Rencontres Parisiennes"...',
    socialMedia: {
      website: 'https://camille-lit-tout.fr',
      instagram: '@camille_lit_tout',
      twitter: '@camille_books'
    },
    previousPublications: 'Blog littéraire, chroniques dans des magazines',
    availability: 'Temps partiel',
    portfolio: 'https://mes-ecrits.camille-rousseau.fr',
    lastLogin: '2024-02-09',
    accountCreated: '2024-01-20',
    totalComments: 8,
    worksCount: 0
  }
];

// Composant StatusFilter personnalisé
const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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
      const dropdownWidth = buttonRect.width; // Prendre exactement la largeur du bouton
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;
      
      // Ajuster horizontalement si débordement
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      
      // Ajuster verticalement si débordement
      if (top + 300 > viewportHeight) {
        top = buttonRect.top - 300 - 8;
      }
      
      setDropdownPosition({
        top: Math.max(10, top),
        left: Math.max(10, left),
        width: dropdownWidth
      });
    }
  }, [isOpen]);

  // Fermer le dropdown seulement lors du resize
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => setIsOpen(false);
    
    const handleScroll = (event) => {
      // Ne fermer QUE si le scroll ne vient PAS du dropdown
      if (dropdownRef.current && (
          dropdownRef.current.contains(event.target) || 
          dropdownRef.current === event.target
        )) {
        return; // Ne pas fermer si on scroll dans le dropdown
      }
      // Fermer si le scroll vient de la page
      setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    // Écouter le scroll sur tous les éléments scrollables
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const statusOptions = [
    { 
      value: 'all', 
      label: 'Tous les statuts', 
      icon: Filter, 
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30'
    },
    { 
      value: 'pending', 
      label: 'En attente', 
      icon: Clock, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    { 
      value: 'rejected', 
      label: 'Refusé', 
      icon: XCircle, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    { 
      value: 'blocked', 
      label: 'Bloqué', 
      icon: EyeOff, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    }
  ];

  const selectedOption = statusOptions.find(option => option.value === selectedStatus) || statusOptions[0];

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      <div className="p-3">
        {statusOptions.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onStatusChange(option.value);
              setIsOpen(false);
            }}
            className={`dropdown-item w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left mb-2 ${
              selectedStatus === option.value
                ? `${option.bgColor} ${option.color}`
                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <option.icon className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium truncate">{option.label}</span>
            {selectedStatus === option.value && (
              <div className="ml-auto">
                <Check className="w-5 h-5" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-button w-full flex items-center gap-4 px-4 py-2.5 sm:py-3 md:py-4 lg:py-3.5 rounded-lg sm:rounded-xl border transition-all justify-between ${
          selectedOption.value === 'all'
            ? 'bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50'
            : `${selectedOption.bgColor} ${selectedOption.borderColor} ${selectedOption.color} hover:opacity-80`
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <selectedOption.icon className="w-6 h-6 flex-shrink-0" />
          <span className="text-sm lg:text-base font-medium truncate">
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${
          selectedOption.value === 'all' ? 'text-gray-400' : selectedOption.color
        }`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

const AuthorApplicationsContent = () => {
  // Hook pour les toasts
  const toast = useToast();
  
  // États principaux
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'rejected', 'blocked'
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(10);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // États pour le modal des commentaires
  const [userForComments, setUserForComments] = useState(null);
  const [isCommentsHistoryOpen, setIsCommentsHistoryOpen] = useState(false);
  
  // États pour le modal de détails utilisateur
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  
  // États pour le modal d'édition utilisateur
  const [userToEdit, setUserToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // États pour les dialogs d'approbation et de refus
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedApplicationForAction, setSelectedApplicationForAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // État pour le modal d'historique global
  const [showGlobalHistoryModal, setShowGlobalHistoryModal] = useState(false);

  // Fonctions de filtrage
  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
  const indexOfFirstApplication = (currentPage - 1) * applicationsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirstApplication, 
    indexOfFirstApplication + applicationsPerPage
  );

  // Reset page lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);



  // Statistiques
  const totalApplications = mockApplications.length;
  const pendingApplications = mockApplications.filter(app => app.status === 'pending').length;
  const rejectedApplications = mockApplications.filter(app => app.status === 'rejected').length;
  const blockedApplications = mockApplications.filter(app => app.status === 'blocked').length;

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleApprove = (application) => {
    setSelectedApplicationForAction(application);
    setShowApprovalDialog(true);
    setShowDetailsModal(false); // Fermer le modal de détails s'il est ouvert
  };

  const handleReject = (application) => {
    setSelectedApplicationForAction(application);
    setShowRejectionDialog(true);
    setShowDetailsModal(false); // Fermer le modal de détails s'il est ouvert
  };

  const handleBlock = (application) => {
    setSelectedApplicationForAction(application);
    setShowBlockDialog(true);
    setShowDetailsModal(false); // Fermer le modal de détails s'il est ouvert
  };

  const handleUnblock = (application) => {
    setSelectedApplicationForAction(application);
    setShowUnblockDialog(true);
    setShowDetailsModal(false); // Fermer le modal de détails s'il est ouvert
  };

  const handleDelete = (application) => {
    setSelectedApplicationForAction(application);
    setShowDeleteDialog(true);
    setShowDetailsModal(false); // Fermer le modal de détails s'il est ouvert
  };

  // Fonction pour confirmer l'approbation
  const handleConfirmApproval = async (application) => {
    setIsProcessing(true);
    try {
      console.log('Approbation confirmée pour:', application.name);
      // Ici vous ajouteriez l'appel API pour approuver la candidature
      // await AuthorService.approveApplication(application.id);
      
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fermer le dialog et réinitialiser
      setShowApprovalDialog(false);
      setSelectedApplicationForAction(null);
      
      // Afficher un toast de succès
      toast.success(`La candidature de ${application.name} a été approuvée avec succès ! L'utilisateur est maintenant auteur sur la plateforme.`);
      
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error(error.message || 'Erreur lors de l\'approbation de la candidature. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonction pour confirmer le refus
  const handleConfirmRejection = async (application, reason) => {
    setIsProcessing(true);
    try {
      console.log('Refus confirmé pour:', application.name, 'Raison:', reason);
      // Ici vous ajouteriez l'appel API pour rejeter la candidature
      // await AuthorService.rejectApplication(application.id, reason);
      
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fermer le dialog et réinitialiser
      setShowRejectionDialog(false);
      setSelectedApplicationForAction(null);
      
      // Afficher un toast de succès
      toast.success(`La candidature de ${application.name} a été rejetée. L'utilisateur a été informé de la décision et de la raison du refus.`);
      
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      toast.error(error.message || 'Erreur lors du refus de la candidature. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonction pour confirmer le blocage
  const handleConfirmBlock = async (application, reason) => {
    setIsProcessing(true);
    try {
      console.log('Blocage confirmé pour:', application.name, 'Raison:', reason);
      // Ici vous ajouteriez l'appel API pour bloquer la candidature
      // await AuthorService.blockApplication(application.id, reason);
      
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fermer le dialog et réinitialiser
      setShowBlockDialog(false);
      setSelectedApplicationForAction(null);
      
      // Afficher un toast de succès
      toast.success(`La candidature de ${application.name} a été bloquée définitivement. L'utilisateur ne pourra plus postuler à nouveau.`);
      
    } catch (error) {
      console.error('Erreur lors du blocage:', error);
      toast.error(error.message || 'Erreur lors du blocage de la candidature. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonction pour confirmer le déblocage
  const handleConfirmUnblock = async (application, reason) => {
    setIsProcessing(true);
    try {
      console.log('Déblocage confirmé pour:', application.name, 'Raison:', reason);
      // Ici vous ajouteriez l'appel API pour débloquer la candidature
      // await AuthorService.unblockApplication(application.id, reason);
      
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fermer le dialog et réinitialiser
      setShowUnblockDialog(false);
      setSelectedApplicationForAction(null);
      
      // Afficher un toast de succès
      toast.success(`Le candidat ${application.name} a été débloqué avec succès. Il peut maintenant soumettre de nouvelles candidatures.`);
      
    } catch (error) {
      console.error('Erreur lors du déblocage:', error);
      toast.error(error.message || 'Erreur lors du déblocage de la candidature. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonction pour confirmer la suppression
  const handleConfirmDelete = async (application, reason) => {
    setIsProcessing(true);
    try {
      console.log('Suppression confirmée pour:', application.name, 'Raison:', reason);
      // Ici vous ajouteriez l'appel API pour supprimer la candidature
      // await AuthorService.deleteApplication(application.id, reason);
      
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fermer le dialog et réinitialiser
      setShowDeleteDialog(false);
      setSelectedApplicationForAction(null);
      
      // Afficher un toast de succès
      toast.success(`La candidature de ${application.name} a été supprimée définitivement du système.`);
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(error.message || 'Erreur lors de la suppression de la candidature. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonctions pour fermer les dialogs
  const handleCloseApprovalDialog = () => {
    if (!isProcessing) {
      setShowApprovalDialog(false);
      setSelectedApplicationForAction(null);
    }
  };

  const handleCloseRejectionDialog = () => {
    if (!isProcessing) {
      setShowRejectionDialog(false);
      setSelectedApplicationForAction(null);
    }
  };

  const handleCloseBlockDialog = () => {
    if (!isProcessing) {
      setShowBlockDialog(false);
      setSelectedApplicationForAction(null);
    }
  };

  const handleCloseUnblockDialog = () => {
    if (!isProcessing) {
      setShowUnblockDialog(false);
      setSelectedApplicationForAction(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedApplicationForAction(null);
  };

  // Fonction pour ouvrir l'historique global des candidatures
  const handleOpenGlobalHistory = () => {
    setShowGlobalHistoryModal(true);
  };
  
  const handleCloseGlobalHistory = () => {
    setShowGlobalHistoryModal(false);
  };

  // Handlers pour les commentaires
  const openCommentsHistory = (user) => {
    if (!user || isCommentsHistoryOpen) return;
    // Fermer le modal des détails
    setShowDetailsModal(false);
    // Ouvrir le modal des commentaires
    setUserForComments(user);
    setIsCommentsHistoryOpen(true);
  };

  const closeCommentsHistory = () => {
    setIsCommentsHistoryOpen(false);
    setTimeout(() => {
      setUserForComments(null);
      // Réouvrir le modal des détails
      setShowDetailsModal(true);
    }, 150);
  };

  const handleUserClick = (userName) => {
    // Fonction pour gérer le clic sur un utilisateur dans les popups
    // Fermer le modal des commentaires
    setIsCommentsHistoryOpen(false);
    setShowDetailsModal(false);
    
    // Créer un utilisateur fictif ou le chercher dans une base de données
    const userDetails = {
      id: Date.now(),
      name: userName,
      email: `${userName.toLowerCase().replace(' ', '.')}@email.com`,
      roles: ['user'],
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-02-08',
      totalComments: Math.floor(Math.random() * 50) + 1,
      worksCount: Math.floor(Math.random() * 10),
      followersCount: Math.floor(Math.random() * 100),
      likesReceived: Math.floor(Math.random() * 200)
    };
    
    // Ouvrir le modal de détails utilisateur après un délai
    setTimeout(() => {
      setSelectedUserForDetails(userDetails);
      setIsUserDetailsOpen(true);
    }, 200);
  };

  const closeUserDetails = () => {
    const wasFromGlobalHistory = selectedUserForDetails?.fromGlobalHistory;
    
    setIsUserDetailsOpen(false);
    setTimeout(() => {
      setSelectedUserForDetails(null);
      
      // Réouvrir le modal précédent si nécessaire avec transition plus fluide
      if (userForComments) {
        setIsCommentsHistoryOpen(true);
      } else if (wasFromGlobalHistory) {
        // Si l'utilisateur venait du modal d'historique global, le rouvrir
        setShowGlobalHistoryModal(true);
      } else if (selectedApplication) {
        // Si il y a une candidature sélectionnée, ouvrir son modal de détails
        setShowDetailsModal(true);
      }
      // Sinon ne rien ouvrir (retour à la liste principale)
    }, 100);
  };

  // Fonctions pour gérer l'édition d'utilisateur avec navigation
  const openEditModal = (user, previousModalInfo) => {
    if (!user) return;
    setUserToEdit({ ...user, previousModalInfo });
    setIsEditModalOpen(true);
    // Fermer le modal de détails si ouvert
    if (isUserDetailsOpen) {
      setIsUserDetailsOpen(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setUserToEdit(null), 150);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      console.log('Sauvegarde utilisateur:', updatedUser);
      // Ici vous ajouteriez l'appel API pour sauvegarder l'utilisateur
      // await UserService.updateUser(updatedUser.id, updatedUser);
      
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Préserver les informations de navigation lors de la mise à jour
      const updatedUserWithNavigation = {
        ...updatedUser,
        fromGlobalHistory: userToEdit?.fromGlobalHistory,
        previousModalInfo: userToEdit?.previousModalInfo
      };
      
      // Mettre à jour l'utilisateur sélectionné si c'est le même
      if (selectedUserForDetails && selectedUserForDetails.id === updatedUser.id) {
        setSelectedUserForDetails(updatedUserWithNavigation);
      }
      
      // Fermer le modal d'édition
      closeEditModal();
      
      console.log('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Fonctions pour l'affichage des statuts de candidature
  const getApplicationStatusDisplay = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'rejected': return 'Refusé';
      case 'blocked': return 'Bloqué';
      default: return 'Inconnu';
    }
  };

  const getApplicationStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'blocked': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getApplicationStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'blocked': return <Badge className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="admin-page p-2 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6 w-full min-w-0 overflow-hidden">
      {/* Header de la page - Responsive */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Candidatures d'Auteurs</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">Gérez les demandes d'adhésion à la communauté d'auteurs</p>
      </div>

      {/* Cartes de statistiques - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center transition-all duration-200 hover:bg-slate-700/30 hover:border-slate-600/50">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{totalApplications}</div>
          <div className="text-xs sm:text-sm text-gray-400">Total</div>
        </div>
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center transition-all duration-200 hover:bg-slate-700/30 hover:border-slate-600/50">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400 mb-1">{pendingApplications}</div>
          <div className="text-xs sm:text-sm text-gray-400">En attente</div>
        </div>
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center transition-all duration-200 hover:bg-slate-700/30 hover:border-slate-600/50">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-red-400 mb-1">{rejectedApplications}</div>
          <div className="text-xs sm:text-sm text-gray-400">Refusés</div>
        </div>
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center transition-all duration-200 hover:bg-slate-700/30 hover:border-slate-600/50">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-400 mb-1">{blockedApplications}</div>
          <div className="text-xs sm:text-sm text-gray-400">Bloqués</div>
        </div>
      </div>

      {/* Section de recherche et filtres - Optimisée mobile */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Barre de recherche et filtres - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Barre de recherche */}
            <div className="lg:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 md:pl-6 pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 md:pl-16 pr-4 sm:pr-6 py-2.5 sm:py-3 md:py-4 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm sm:text-base transition-all duration-200"
              />
            </div>

            {/* Filtre de statut */}
            <StatusFilter 
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
            />
            
            {/* Bouton Historique Global */}
            <div className="relative">
              <button
                onClick={handleOpenGlobalHistory}
                className="w-full py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 bg-gradient-to-r from-red-600/20 to-orange-600/20 
                         hover:from-red-500/30 hover:to-orange-500/30 text-red-300 hover:text-red-200 
                         border border-red-500/30 hover:border-red-400/50 rounded-lg sm:rounded-xl transition-all duration-200 
                         transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 
                         font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                title="Voir l'historique de toutes les candidatures refusées et bloquées"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Historique Global</span>
                <span className="sm:hidden">Historique</span>
              </button>
            </div>
          </div>
          

        </div>
      </div>

      {/* Tableau des candidatures */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
        {/* Version mobile - Cards */}
        <div className="block sm:hidden">
          <div className="p-4 space-y-4">
            {currentApplications.map((application) => (
              <div key={application.id} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{application.name}</p>
                      <p className="text-gray-400 text-sm truncate">{application.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white">{application.appliedAt}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Statut:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {getApplicationStatusIcon(application.status)}
                      <span className={`px-2 py-1 border rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                        {getApplicationStatusDisplay(application.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => handleViewDetails(application)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-white text-sm transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-purple-500/20 hover:ring-purple-500/40"
                  >
                    <Eye className="w-4 h-4 flex-shrink-0" />
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version desktop - Table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Statut
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="w-16 px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {currentApplications.map((application) => (
                <tr key={application.id} className="hover:bg-slate-700/25 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{application.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-sm">{application.email}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {getApplicationStatusIcon(application.status)}
                      <span className={`px-2 py-1 border rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                        {getApplicationStatusDisplay(application.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-gray-300 text-sm">{application.appliedAt}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetails(application)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-indigo-600/20 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-110 active:scale-95 ring-1 ring-transparent hover:ring-purple-500/30"
                      title="Voir les détails de la candidature"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucune candidature trouvée */}
        {currentApplications.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Aucune candidature trouvée</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredApplications.length}
          itemsPerPage={applicationsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal de détails */}
      {showDetailsModal && selectedApplication && (
        <ApplicationDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          application={selectedApplication}
          onApprove={handleApprove}
          onReject={handleReject}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onDelete={handleDelete}
          onViewComments={openCommentsHistory}
        />
      )}

      {/* Modal d'historique des commentaires */}
      {userForComments && isCommentsHistoryOpen && (
        <UserCommentsHistoryModal
          user={userForComments}
          isOpen={isCommentsHistoryOpen}
          onClose={closeCommentsHistory}
          onUserClick={handleUserClick}
        />
      )}

      {/* Modal de détails utilisateur */}
      {selectedUserForDetails && (
        <UserDetailsModal
          user={selectedUserForDetails}
          isOpen={isUserDetailsOpen}
          onClose={closeUserDetails}
          onEdit={openEditModal}
          previousModal={selectedUserForDetails.fromGlobalHistory ? {
            type: 'globalHistory',
            reopenCallback: () => {
              setTimeout(() => {
                setShowGlobalHistoryModal(true);
              }, 150);
            }
          } : {
            type: 'userDetails',
            reopenCallback: () => {
              setTimeout(() => {
                setSelectedUserForDetails(selectedUserForDetails);
                setIsUserDetailsOpen(true);
              }, 150);
            }
          }}
        />
      )}

      {/* Modal d'édition utilisateur */}
      {userToEdit && (
        <UserEditModal
          user={userToEdit}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleSaveUser}
          previousModal={{
            type: 'userDetails',
            reopenCallback: () => {
              // Toujours revenir au modal de détails d'abord, en préservant les infos de navigation
              setTimeout(() => {
                const userWithNavigation = {
                  ...userToEdit,
                  fromGlobalHistory: userToEdit?.fromGlobalHistory,
                  previousModalInfo: userToEdit?.previousModalInfo
                };
                setSelectedUserForDetails(userWithNavigation);
                setIsUserDetailsOpen(true);
              }, 150);
            }
          }}
        />
      )}

      {/* Dialog de confirmation d'approbation */}
      <ApprovalConfirmationDialog
        isOpen={showApprovalDialog}
        onClose={handleCloseApprovalDialog}
        application={selectedApplicationForAction}
        onConfirm={handleConfirmApproval}
        isLoading={isProcessing}
      />

      {/* Dialog de refus avec raison */}
      <RejectionDialog
        isOpen={showRejectionDialog}
        onClose={handleCloseRejectionDialog}
        application={selectedApplicationForAction}
        onConfirm={handleConfirmRejection}
        isLoading={isProcessing}
      />

      {/* Dialog de blocage avec raison */}
      <BlockDialog
        isOpen={showBlockDialog}
        onClose={handleCloseBlockDialog}
        application={selectedApplicationForAction}
        onConfirm={handleConfirmBlock}
        isLoading={isProcessing}
      />

      {/* Dialog de déblocage avec raison */}
      <UnblockDialog
        isOpen={showUnblockDialog}
        onClose={handleCloseUnblockDialog}
        application={selectedApplicationForAction}
        onConfirm={handleConfirmUnblock}
        isLoading={isProcessing}
      />

      {/* Dialog de suppression avec raison */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        application={selectedApplicationForAction}
        onConfirm={handleConfirmDelete}
        isLoading={isProcessing}
      />

      {/* Modal d'historique global */}
      <GlobalApplicationHistoryModal
        isOpen={showGlobalHistoryModal}
        onClose={handleCloseGlobalHistory}
        onUserClick={(userInfo) => {
          // Créer un objet utilisateur compatible avec le modal de détails
          const userDetails = {
            id: userInfo.id || Date.now(),
            name: userInfo.name,
            email: userInfo.email,
            roles: userInfo.type === 'admin' ? ['admin'] : ['user'],
            status: 'active',
            joinDate: '2024-01-15',
            lastLogin: new Date().toISOString(),
            totalComments: Math.floor(Math.random() * 50) + 1,
            worksCount: Math.floor(Math.random() * 10),
            followersCount: Math.floor(Math.random() * 100),
            likesReceived: Math.floor(Math.random() * 200),
            authorPseudo: userInfo.pseudo,
            applicationId: userInfo.applicationId,
            fromGlobalHistory: true, // Flag pour indiquer la provenance
            previousModalInfo: {
              type: 'globalHistory',
              reopenCallback: () => {
                setShowGlobalHistoryModal(true);
              }
            }
          };
          
          // Transition fluide : fermer l'historique et ouvrir les détails en même temps
          setShowGlobalHistoryModal(false);
          setTimeout(() => {
            setSelectedUserForDetails(userDetails);
            setIsUserDetailsOpen(true);
          }, 100);
        }}
      />
    </div>
  );
};

// Modal de détails d'une candidature - Complet
const ApplicationDetailsModal = ({ isOpen, onClose, application, onApprove, onReject, onBlock, onUnblock, onDelete, onViewComments }) => {
  if (!isOpen || !application) return null;

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent modal from closing when clicking on backdrop
  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop (not on the modal content)
    if (e.target === e.currentTarget) {
      // Do nothing - prevent backdrop click from closing modal
      e.stopPropagation();
    }
  };

  // Fonctions utilitaires pour l'affichage
  const getRoleDisplayText = (roles) => {
    if (!roles || roles.length === 0) return 'Aucun rôle';
    return roles.includes('user') ? 'Utilisateur' : roles.join(', ');
  };

  const getStatusDisplayName = (status) => {
    switch(status) {
      case 'active': return 'Actif';
      case 'blocked': return 'Bloqué';
      case 'author_suspended': return 'Auteur Suspendu';
      default: return 'Inconnu';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'author_suspended': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'blocked': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'author_suspended': return <Clock className="w-4 h-4 text-orange-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in" 
      onClick={handleBackdropClick}
    >
        <div 
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto comments-history-scrollbar animate-zoom-in"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from bubbling up
        >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {application.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{application.name}</h2>
              <p className="text-gray-400">Candidature d'Auteur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Fermer le modal"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Informations Personnelles
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{application.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Inscrit le {new Date(application.joinDate || application.accountCreated).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Dernière connexion: {new Date(application.lastLogin).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Rôles et statut */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Badge className="w-5 h-5 text-purple-400" />
                Rôles et Statut
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Rôle actuel</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
                      {getRoleDisplayText(application.roles)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Statut</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(application.userStatus)}
                    <span className={`px-2 py-1 border rounded-full text-xs font-medium ${getStatusBadgeClass(application.userStatus)}`}>
                      {getStatusDisplayName(application.userStatus)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Statistiques</p>
                  <div className="text-sm text-gray-300">
                    <button
                      onClick={() => onViewComments && onViewComments(application)}
                      className="text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                    >
                      Commentaires: {application.totalComments || 0}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Candidature d'auteur */}
          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-400" />
              Candidature d'Auteur
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Pseudo d'auteur souhaité</p>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-white font-medium">{application.authorPseudo}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">Pourquoi voulez-vous devenir auteur ?</p>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-gray-200 text-sm leading-relaxed">{application.reasonToBeAuthor}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Date de candidature</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-white">{application.appliedAt}</span>
                </div>
              </div>


            </div>
          </div>



          {/* Liens de suivi */}
          {(application.socialMedia?.website || application.portfolio) && (
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Liens de Suivi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.socialMedia?.website && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Site web</p>
                    <a href={application.socialMedia.website} target="_blank" rel="noopener noreferrer" 
                       className="text-purple-400 hover:text-purple-300 text-sm underline">
                      {application.socialMedia.website}
                    </a>
                  </div>
                )}
                {application.portfolio && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Portfolio</p>
                    <a href={application.portfolio} target="_blank" rel="noopener noreferrer" 
                       className="text-purple-400 hover:text-purple-300 text-sm underline">
                      {application.portfolio}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer avec actions */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
          {application.status === 'pending' && (
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => onReject(application)}
                className="order-3 sm:order-1 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-red-500/20 hover:ring-red-500/40"
              >
                <XCircle className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Rejeter</span>
                <span className="sm:hidden">Refuser</span>
              </button>
              <button
                onClick={() => onBlock(application)}
                className="order-2 px-5 py-2.5 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-lg hover:shadow-gray-500/25 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-gray-500/20 hover:ring-gray-500/40"
              >
                <Badge className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Bloquer</span>
                <span className="sm:hidden">Bloquer</span>
              </button>
              <button
                onClick={() => onApprove(application)}
                className="order-1 sm:order-3 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-green-500/20 hover:ring-green-500/40"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Approuver</span>
                <span className="sm:hidden">Approuver</span>
              </button>
            </div>
          )}
          
          {application.status === 'rejected' && (
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => onDelete(application)}
                className="order-3 sm:order-1 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-red-500/20 hover:ring-red-500/40"
              >
                <Trash2 className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Supprimer définitivement</span>
                <span className="sm:hidden">Supprimer</span>
              </button>
              <button
                onClick={() => onBlock(application)}
                className="order-2 sm:order-2 px-5 py-2.5 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-lg hover:shadow-gray-500/25 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-gray-500/20 hover:ring-gray-500/40"
              >
                <Badge className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Bloquer définitivement</span>
                <span className="sm:hidden">Bloquer</span>
              </button>
              <button
                onClick={() => console.log('Réexaminer:', application.name)}
                className="order-1 sm:order-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-blue-500/20 hover:ring-blue-500/40"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Réexaminer</span>
                <span className="sm:hidden">Réexaminer</span>
              </button>
            </div>
          )}
          
          {application.status === 'blocked' && (
            <div className="flex justify-end">
            <button
                onClick={() => onUnblock(application)}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-green-500/20 hover:ring-green-500/40"
            >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Débloquer le candidat</span>
                <span className="sm:hidden">Débloquer</span>
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default AuthorApplicationsContent; 