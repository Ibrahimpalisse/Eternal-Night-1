import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { X, Clock, CheckCircle, XCircle, Badge, User, Calendar, FileText, AlertTriangle, Search, Filter, ChevronDown, Check, ChevronUp } from 'lucide-react';

// Composant StatusFilter personnalisé
const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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
      value: 'rejected', 
      label: 'Refusées', 
      icon: XCircle, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    { 
      value: 'blocked', 
      label: 'Bloquées', 
      icon: Badge, 
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30'
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

  const selectedOption = statusOptions.find(status => status.value === selectedStatus);

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[99999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '200px',
        overflowY: 'auto'
      }}
    >
      <div className="p-3">
        {statusOptions.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStatusChange(option.value);
              setIsOpen(false);
            }}
            className={`dropdown-item w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left mb-2 cursor-pointer ${
              selectedStatus === option.value
                ? `${option.bgColor} ${option.color}`
                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
            }`}
            style={{ pointerEvents: 'auto' }}
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`dropdown-button w-full flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl border transition-all justify-between cursor-pointer ${
          selectedOption.value === 'all'
            ? 'bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50'
            : `${selectedOption.bgColor} ${selectedOption.borderColor} ${selectedOption.color} hover:opacity-80`
        }`}
        style={{ pointerEvents: 'auto', zIndex: 10 }}
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

// Composant SortFilter personnalisé
const SortFilter = ({ selectedSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const sortOptions = [
    { 
      value: 'date_desc', 
      label: 'Plus récentes', 
      icon: Clock, 
      color: 'text-purple-400'
    },
    { 
      value: 'date_asc', 
      label: 'Plus anciennes', 
      icon: Clock, 
      color: 'text-purple-400'
    },
    { 
      value: 'name_asc', 
      label: 'Nom A-Z', 
      icon: User, 
      color: 'text-blue-400'
    },
    { 
      value: 'name_desc', 
      label: 'Nom Z-A', 
      icon: User, 
      color: 'text-blue-400'
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
      const dropdownWidth = buttonRect.width; // Prendre exactement la largeur du bouton
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;
      
      // Ajuster horizontalement si débordement
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      
      // Ajuster verticalement si débordement
      if (top + 250 > viewportHeight) {
        top = buttonRect.top - 250 - 8;
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

  const selectedOption = sortOptions.find(sort => sort.value === selectedSort);

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[99999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '250px',
        overflowY: 'auto'
      }}
    >
      <div className="p-3">
        {sortOptions.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSortChange(option.value);
              setIsOpen(false);
            }}
            className={`dropdown-item w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left mb-2 cursor-pointer ${
              selectedSort === option.value
                ? 'bg-slate-600/50 text-white'
                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            <option.icon className={`w-6 h-6 flex-shrink-0 ${option.color}`} />
            <span className="font-medium truncate">{option.label}</span>
            {selectedSort === option.value && (
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="dropdown-button w-full flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl border bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 transition-all justify-between cursor-pointer"
        style={{ pointerEvents: 'auto', zIndex: 10 }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <selectedOption.icon className={`w-6 h-6 flex-shrink-0 ${selectedOption.color}`} />
          <span className="text-sm lg:text-base font-medium truncate">
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

const GlobalApplicationHistoryModal = ({ isOpen, onClose, onUserClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [showFilters, setShowFilters] = useState(false);

  // Données simulées de l'historique global des candidatures
  const globalApplicationHistory = [
    {
      id: 1,
      userName: 'Marie Dubois',
      userEmail: 'marie.dubois@email.com',
      authorPseudo: 'MarieDuboisAuteur',
      status: 'rejected',
      submittedAt: '2024-02-05T14:30:00',
      processedAt: '2024-02-08T10:15:00',
      reasonToBeAuthor: 'J\'ai toujours rêvé d\'écrire et de partager mes histoires avec le monde. Depuis mon enfance, je crée des univers fantastiques...',
      rejectionReason: 'Candidature incomplète, manque d\'expérience démontrée dans le domaine de l\'écriture',
      processedBy: 'Admin Martin',
      genres: ['Fantasy', 'Romance']
    },
    {
      id: 2,
      userName: 'Jean Pierre',
      userEmail: 'jean.pierre@email.com',
      authorPseudo: 'JeanPierreWriter',
      status: 'blocked',
      submittedAt: '2024-02-03T09:20:00',
      processedAt: '2024-02-04T16:45:00',
      reasonToBeAuthor: 'Je veux écrire des histoires pour devenir célèbre et gagner de l\'argent rapidement...',
      blockReason: 'Motivation inappropriée, attitude non professionnelle détectée dans les échanges précédents',
      processedBy: 'Admin Sophie',
      genres: ['Thriller']
    },
    {
      id: 3,
      userName: 'Alice Martin',
      userEmail: 'alice.martin@email.com',
      authorPseudo: 'AliceStories',
      status: 'rejected',
      submittedAt: '2024-02-01T11:00:00',
      processedAt: '2024-02-02T14:30:00',
      reasonToBeAuthor: 'J\'ai une passion pour l\'écriture depuis plusieurs années et j\'aimerais partager mes créations...',
      rejectionReason: 'Échantillons de texte de qualité insuffisante, besoin d\'amélioration technique',
      processedBy: 'Admin Lucas',
      genres: ['Romance', 'Drama']
    },
    {
      id: 4,
      userName: 'Thomas Leroy',
      userEmail: 'thomas.leroy@email.com',
      authorPseudo: 'ThomasLeroyAuteur',
      status: 'blocked',
      submittedAt: '2024-01-28T16:15:00',
      processedAt: '2024-01-30T09:20:00',
      reasonToBeAuthor: 'Je veux publier mes œuvres sur cette plateforme...',
      blockReason: 'Plagiat détecté dans les échantillons fournis, violation des droits d\'auteur',
      processedBy: 'Admin Martin',
      genres: ['Mystery', 'Thriller']
    },
    {
      id: 5,
      userName: 'Sophie Bernard',
      userEmail: 'sophie.bernard@email.com',
      authorPseudo: 'SophieBWrites',
      status: 'rejected',
      submittedAt: '2024-01-25T13:45:00',
      processedAt: '2024-01-27T11:30:00',
      reasonToBeAuthor: 'Passionnée de littérature, je souhaite partager mes nouvelles avec une communauté de lecteurs...',
      rejectionReason: 'Genre non adapté à notre plateforme, contenu trop spécialisé',
      processedBy: 'Admin Sophie',
      genres: ['Academic', 'Non-fiction']
    },
    {
      id: 6,
      userName: 'Paul Durand',
      userEmail: 'paul.durand@email.com',
      authorPseudo: 'PaulDurandStories',
      status: 'blocked',
      submittedAt: '2024-01-20T08:30:00',
      processedAt: '2024-01-22T15:45:00',
      reasonToBeAuthor: 'Je veux écrire des histoires...',
      blockReason: 'Multiples candidatures avec des identités différentes, tentative de contournement',
      processedBy: 'Admin Lucas',
      genres: ['Fantasy']
    }
  ];

  // Fonctions utilitaires
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'rejected': return 'Refusée';
      case 'blocked': return 'Bloquée';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'blocked': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'blocked': return <Badge className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Filtrage et tri
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = globalApplicationHistory.filter(app => {
      const matchesSearch = searchTerm === '' || 
        app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.authorPseudo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Tri
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date_desc':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case 'date_asc':
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        case 'name_asc':
          return a.userName.localeCompare(b.userName);
        case 'name_desc':
          return b.userName.localeCompare(a.userName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  // Pagination
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredAndSortedApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredAndSortedApplications.length / applicationsPerPage);

  const handleClose = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('date_desc');
    setShowFilters(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-6xl bg-slate-900/95 border-slate-700/50 backdrop-blur-sm max-h-[95vh] flex flex-col mx-2 sm:mx-4 [&>button]:hidden">
        <DialogHeader className="px-4 sm:px-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-red-400 text-lg sm:text-xl font-bold">
                  <span className="block sm:hidden">Historique Global</span>
                  <span className="hidden sm:block">Historique Global - Candidatures Refusées & Bloquées</span>
                </DialogTitle>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Bouton Filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title={showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              >
                <Filter className="w-5 h-5" />
              </button>
              
              {/* Bouton Fermer */}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Barre de recherche principale - Toujours visible */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-700/30">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou pseudo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg 
                       text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                       transition-all duration-200 text-sm sm:text-base"
              />
          </div>
            </div>

        {/* Filtres collapsibles */}
        {showFilters && (
          <div className="px-4 sm:px-6 py-4 bg-slate-800/30 border-b border-slate-700/30 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            {/* Filtre par statut */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Filtrer par statut</label>
            <StatusFilter 
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
            />
              </div>

            {/* Tri */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trier par</label>
            <SortFilter 
              selectedSort={sortBy}
              onSortChange={setSortBy}
            />
          </div>
            </div>
          </div>
        )}

        {/* Compteurs - Toujours visibles */}
        <div className="px-4 sm:px-6 py-3 bg-slate-700/20">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <span className="bg-slate-700/50 px-2 py-1 rounded">Total: {filteredAndSortedApplications.length}</span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                Refusées: {filteredAndSortedApplications.filter(app => app.status === 'rejected').length}
              </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                Bloquées: {filteredAndSortedApplications.filter(app => app.status === 'blocked').length}
              </span>
          </div>
        </div>

        {/* Liste des candidatures */}
        <div 
          className="px-4 sm:px-6 pb-8 overflow-y-scroll flex-1 space-y-3 sm:space-y-4 custom-scrollbar" 
          style={{ 
            maxHeight: showFilters ? 'calc(85vh - 300px)' : 'calc(85vh - 200px)', 
            minHeight: '300px',
            scrollBehavior: 'smooth'
          }}
        >
          {currentApplications.map((application) => (
            <div key={application.id} 
                 className="bg-slate-700/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-600/30 hover:bg-slate-700/40 transition-colors">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {application.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <button
                        onClick={() => onUserClick && onUserClick({
                          id: application.userId || application.id,
                          name: application.userName,
                          email: application.userEmail,
                          pseudo: application.authorPseudo,
                          applicationId: application.id
                        })}
                        className="text-white font-semibold hover:text-purple-300 transition-all duration-200 cursor-pointer hover:underline text-left group"
                        title="Voir le profil de cet utilisateur"
                      >
                        {application.userName}
                      </button>
                    </div>
                    <button
                      onClick={() => onUserClick && onUserClick({
                        id: application.userId || application.id,
                        name: application.userName,
                        email: application.userEmail,
                        pseudo: application.authorPseudo,
                        applicationId: application.id
                      })}
                      className="text-gray-400 hover:text-gray-300 text-sm transition-all duration-200 cursor-pointer hover:underline text-left"
                      title="Voir le profil de cet utilisateur"
                    >
                      {application.userEmail}
                    </button>
                    <p className="text-gray-500 text-xs">
                      Pseudo: <span className="text-purple-400">{application.authorPseudo}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(application.status)}
                  <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {getStatusDisplay(application.status)}
                  </span>
                </div>
              </div>

              {/* Détails */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gauche */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Dates</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-300 text-sm">
                          Soumise: {formatDate(application.submittedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-300 text-sm">
                          Traitée: {formatDate(application.processedAt)}
                        </span>
                      </div>
                    </div>
                  </div>



                  <div>
                    <p className="text-gray-400 text-xs mb-2">Traité par</p>
                    <button 
                      onClick={() => onUserClick && onUserClick({
                        name: application.processedBy,
                        role: 'admin',
                        type: 'admin'
                      })}
                      className="text-blue-400 hover:text-blue-300 hover:underline text-sm transition-colors"
                    >
                      {application.processedBy}
                    </button>
                  </div>
                </div>

                {/* Droite */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Motivation du candidat</p>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-gray-200 text-sm line-clamp-3">{application.reasonToBeAuthor}</p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-xs mb-2 ${application.status === 'rejected' ? 'text-red-400' : 'text-gray-400'}`}>
                      {application.status === 'rejected' ? 'Raison du refus' : 'Raison du blocage'}
                    </p>
                    <div className={`p-3 rounded-lg border ${
                      application.status === 'rejected' 
                        ? 'bg-red-500/10 border-red-500/20' 
                        : 'bg-gray-500/10 border-gray-500/20'
                    }`}>
                      <p className={`text-sm ${
                        application.status === 'rejected' ? 'text-red-300' : 'text-gray-300'
                      }`}>
                        {application.rejectionReason || application.blockReason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Message si aucune candidature */}
          {filteredAndSortedApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Aucune candidature trouvée</p>
              <p className="text-gray-500 text-sm">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Il n\'y a pas encore de candidatures refusées ou bloquées'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Page {currentPage} sur {totalPages} - {filteredAndSortedApplications.length} résultat(s)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Précédent
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === page 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-slate-600 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}


      </DialogContent>
    </Dialog>
  );
};

export default GlobalApplicationHistoryModal;
 