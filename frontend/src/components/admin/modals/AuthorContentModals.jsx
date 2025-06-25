import React, { useState, useRef, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  Edit3, 
  Image, 
  User, 
  Calendar, 
  Tag, 
  BookOpen, 
  FileText, 
  Eye, 
  MessageSquare,
  Save,
  Upload,
  Plus,
  ChevronDown,
  Clock,
  Pause,
  CheckCircle,
  EyeOff,
  Filter,
  Check,
  PenTool,
  AlertTriangle
} from 'lucide-react';
import { FormValidation } from '../../../utils/validation';

// Composant StatusSelector moderne pour la modal
const StatusSelector = ({ selectedStatus, onStatusChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const statusOptions = [
    { 
      value: 'pending', 
      label: 'En attente', 
      icon: Clock, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    { 
      value: 'accepted_unpublished', 
      label: 'Accepté - Non publié', 
      icon: Pause, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      value: 'published', 
      label: 'Publié', 
      icon: CheckCircle, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    { 
      value: 'unpublished', 
      label: 'Dépublié', 
      icon: EyeOff, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
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

  // Fermer le dropdown avec gestion intelligente du scroll
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
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const selectedOption = statusOptions.find(option => option.value === selectedStatus);

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
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
        {statusOptions.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onStatusChange(option.value);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left mb-2 ${
              selectedStatus === option.value
                ? `${option.bgColor} ${option.color}`
                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <option.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium truncate">{option.label}</span>
            {selectedStatus === option.value && (
              <div className="ml-auto">
                <Check className="w-4 h-4" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all justify-between ${
          selectedOption 
            ? `${selectedOption.bgColor} ${selectedOption.borderColor} ${selectedOption.color} hover:opacity-80`
            : 'bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50'
        }`}
      >
        <div className="flex items-center gap-3">
          {selectedOption && <selectedOption.icon className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium truncate">
            {selectedOption?.label || 'Sélectionner un statut'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

// Composant pour la sélection d'auteur avec interface moderne
const AuthorSelector = ({ selectedAuthorId, onAuthorChange, authors = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      if (top + 350 > viewportHeight) {
        top = buttonRect.top - 350 - 8;
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
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const selectedAuthor = authors.find(author => author.id.toString() === selectedAuthorId?.toString());
  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    return colors[id % colors.length];
  };

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[99999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '350px',
        overflowY: 'auto'
      }}
    >
      <div className="p-4">
        {/* Barre de recherche */}
        <div className="relative mb-3">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm"
          />
        </div>

        {/* Liste des auteurs */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredAuthors.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              Aucun auteur trouvé
            </div>
          ) : (
            filteredAuthors.map(author => (
              <button
                key={author.id}
                onClick={() => {
                  onAuthorChange(author.id);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left ${
                  selectedAuthorId?.toString() === author.id.toString()
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 ${getAvatarColor(author.id)} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {getInitials(author.name)}
                </div>
                <span className="font-medium truncate">{author.name}</span>
                {selectedAuthorId?.toString() === author.id.toString() && (
                  <div className="ml-auto">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">Auteur</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white hover:bg-slate-600/50 transition-all justify-between"
      >
        <div className="flex items-center gap-3 min-w-0">
          {selectedAuthor ? (
            <>
              <div className={`w-6 h-6 ${getAvatarColor(selectedAuthor.id)} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {getInitials(selectedAuthor.name)}
              </div>
              <span className="font-medium truncate">{selectedAuthor.name}</span>
            </>
          ) : (
            <>
              <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-400 truncate">Sélectionner un auteur</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

// Composant pour la sélection de catégories multiples
const CategorySelector = ({ selectedCategories = [], onCategoriesChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const availableCategories = [
    { id: 'fantasy', name: 'Fantasy', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'sci-fi', name: 'Science-Fiction', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'romance', name: 'Romance', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
    { id: 'thriller', name: 'Thriller', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { id: 'horror', name: 'Horreur', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    { id: 'mystery', name: 'Mystère', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { id: 'historical', name: 'Historique', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'adventure', name: 'Aventure', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { id: 'drama', name: 'Drame', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { id: 'comedy', name: 'Comédie', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
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
      if (top + 400 > viewportHeight) {
        top = buttonRect.top - 400 - 8;
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
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleCategoryAdd = (categoryId) => {
    if (!selectedCategories.includes(categoryId)) {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
    setIsOpen(false);
  };

  const handleCategoryRemove = (categoryId) => {
    onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
  };

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[99999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      <div className="p-4">
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {availableCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryAdd(category.id)}
              disabled={selectedCategories.includes(category.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                selectedCategories.includes(category.id)
                  ? 'opacity-50 cursor-not-allowed bg-slate-700/30'
                  : `${category.color} hover:opacity-80 border`
              }`}
            >
              <Tag className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate">{category.name}</span>
              {selectedCategories.includes(category.id) && (
                <div className="ml-auto">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">Catégories</label>
      
      {/* Tags sélectionnées */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedCategories.map(categoryId => {
            const category = availableCategories.find(cat => cat.id === categoryId);
            if (!category) return null;
            
            return (
              <span
                key={categoryId}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${category.color}`}
              >
                <Tag className="w-3 h-3" />
                {category.name}
                <button
                  onClick={() => handleCategoryRemove(categoryId)}
                  className="hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Bouton d'ajout */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white hover:bg-slate-600/50 transition-all justify-between"
      >
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="font-medium">Ajouter une catégorie</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

// Modal de détails
export const DetailsModal = ({ isOpen, onClose, item, type, onEdit }) => {
  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed w-screen h-screen bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 99999,
        margin: 0,
        padding: '16px'
      }}
    >
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">
            Détails du Roman
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Note explicative du workflow */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2">Note sur le workflow</h3>
            <p className="text-blue-300 text-sm">
              Workflow: Soumission → Admin évalue (Accepter/Refuser) → Si accepté, l'auteur décide de publier
            </p>
          </div>

          {/* Image de couverture */}
          {(item.coverImage || item.coverImagePreview) && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Image de couverture</label>
              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={item.coverImagePreview || item.coverImage} 
                    alt={`Couverture de ${item.title}`}
                    className="w-40 h-60 object-cover rounded-lg border border-slate-600/50 shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder si pas d'image */}
          {!item.coverImage && !item.coverImagePreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Image de couverture</label>
              <div className="flex justify-center">
                <div className="w-40 h-60 bg-slate-700/50 rounded-lg border border-slate-600/50 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Image className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Aucune image</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Titre</label>
              <p className="text-white bg-slate-700/50 p-3 rounded-lg">{item.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Auteur attribué</label>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-white font-medium">{item.author}</span>
                </div>
                {item.originalAuthor && item.originalAuthor !== item.author && (
                  <div className="pl-6 border-l-2 border-orange-500/30">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-300">Roman réattribué</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      Auteur original: <span className="text-gray-300">{item.originalAuthor}</span>
                    </p>
                    {item.reassignmentReason && (
                      <p className="text-gray-400 text-xs mt-1">
                        Raison: <span className="text-gray-300">{item.reassignmentReason}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                {(() => {
                  const getStatusDisplay = (status) => {
                    switch (status) {
                      case 'pending':
                        return {
                          text: 'En attente',
                          icon: '⏳',
                          color: 'text-yellow-400',
                          bgColor: 'bg-yellow-500/20',
                          borderColor: 'border-yellow-500/30'
                        };
                      case 'accepted':
                        return {
                          text: 'Accepté',
                          icon: '✅',
                          color: 'text-green-400',
                          bgColor: 'bg-green-500/20',
                          borderColor: 'border-green-500/30'
                        };
                      case 'published':
                        return {
                          text: 'Publié',
                          icon: '📚',
                          color: 'text-blue-400',
                          bgColor: 'bg-blue-500/20',
                          borderColor: 'border-blue-500/30'
                        };
                      case 'rejected':
                        return {
                          text: 'Rejeté',
                          icon: '❌',
                          color: 'text-red-400',
                          bgColor: 'bg-red-500/20',
                          borderColor: 'border-red-500/30'
                        };
                      case 'unpublished':
                        return {
                          text: 'Dépublié',
                          icon: '📴',
                          color: 'text-orange-400',
                          bgColor: 'bg-orange-500/20',
                          borderColor: 'border-orange-500/30'
                        };
                      case 'draft':
                        return {
                          text: 'Brouillon',
                          icon: '📝',
                          color: 'text-gray-400',
                          bgColor: 'bg-gray-500/20',
                          borderColor: 'border-gray-500/30'
                        };
                      default:
                        return {
                          text: status || 'Inconnu',
                          icon: '❓',
                          color: 'text-gray-400',
                          bgColor: 'bg-gray-500/20',
                          borderColor: 'border-gray-500/30'
                        };
                    }
                  };
                  
                  const statusInfo = getStatusDisplay(item.status);
                  
                  return (
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                        {statusInfo.text}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date de soumission</label>
              <p className="text-white bg-slate-700/50 p-3 rounded-lg">{item.submittedAt}</p>
            </div>
          </div>

          {/* Statut de vérification pour les romans */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Vérification éditoriale</label>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              {item.isVerified ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-amber-500/20 rounded flex items-center justify-center">
                    <span className="text-amber-400 text-xs">✓</span>
                  </div>
                  <span className="text-amber-400 font-medium">Roman vérifié</span>
                  <div className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-medium">
                    Vérifié ✓
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-500/20 rounded flex items-center justify-center">
                    <span className="text-red-400 text-xs">✗</span>
                  </div>
                  <span className="text-red-400 font-medium">Non vérifié</span>
                  <div className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium">
                    ⚠️ Requiert vérification
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations spécifiques aux romans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Catégories</label>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                {item.categories && item.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.categories.map(categoryId => {
                      const category = [
                        { id: 'fantasy', name: 'Fantasy', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                        { id: 'sci-fi', name: 'Science-Fiction', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                        { id: 'romance', name: 'Romance', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
                        { id: 'thriller', name: 'Thriller', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                        { id: 'horror', name: 'Horreur', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
                        { id: 'mystery', name: 'Mystère', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
                        { id: 'historical', name: 'Historique', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                        { id: 'adventure', name: 'Aventure', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                        { id: 'drama', name: 'Drame', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
                      ].find(cat => cat.id === categoryId);
                      
                      if (!category) return null;
                      
                      return (
                        <span
                          key={categoryId}
                          className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${category.color}`}
                        >
                          <Tag className="w-3 h-3" />
                          {category.name}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm italic">Aucune catégorie</span>
                )}
              </div>
            </div>

          </div>

          {/* État du roman - Affiché seulement pour les romans Acceptés et Publiés */}
          {(item.status === 'accepted' || item.status === 'published') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                État du roman
              </label>
              <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Statut de rédaction</label>
                    <div className="flex items-center gap-2">
                      {item.isCompleted ? (
                        <>
                          <div className="w-5 h-5 bg-green-500/20 rounded flex items-center justify-center">
                            <span className="text-green-400 text-xs">✓</span>
                          </div>
                          <span className="text-green-400 font-medium">Terminé</span>
                          <div className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                            Fini
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center">
                            <PenTool className="w-3 h-3 text-blue-400" />
                          </div>
                          <span className="text-blue-400 font-medium">En cours</span>
                          <div className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
                            En rédaction
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Nombre de chapitres</label>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-lg">{item.chapterCount || 0}</span>
                      <span className="text-gray-400 text-sm">
                        {item.chapterCount > 1 ? 'chapitres' : 'chapitre'}
                        {item.chapterCount > 0 && ' publié' + (item.chapterCount > 1 ? 's' : '')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <p className="text-white bg-slate-700/50 p-3 rounded-lg min-h-[100px]">{item.description}</p>
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Commentaire
            </label>
            <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
              {item.comment ? (
                <p className="text-gray-200 text-sm leading-relaxed">{item.comment}</p>
              ) : (
                <p className="text-gray-400 text-sm italic">Aucun commentaire</p>
              )}
            </div>
          </div>

          {/* Raison de dépublication si applicable */}
          {item.status === 'unpublished' && item.unpublishReason && (
            <div>
              <label className="block text-sm font-medium text-orange-400 mb-2">Raison de la dépublication</label>
              <p className="text-orange-300 bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg">
                {item.unpublishReason}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-700/50 space-x-3">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Modifier
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-600/50 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal d'édition
export const EditModal = ({ isOpen, onClose, item, type, onSave }) => {
  const [formData, setFormData] = useState(item || {});
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Réinitialiser le formulaire quand l'item change
  React.useEffect(() => {
    if (item) {
      setFormData(item);
      setImageFile(null);
      setErrors({});
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const validateForm = () => {
    try {
      // Préparer les données pour la validation
      const dataToValidate = {
        title: formData.title || '',
        description: formData.description || '',
        categories: formData.categories || [],
        status: formData.status || 'pending',
        authorId: Number(formData.authorId) || 0,
        isVerified: Boolean(formData.isVerified),
        isCompleted: formData.isCompleted,
        chapterCount: Number(formData.chapterCount) || 0,
        comment: formData.comment || ''
      };

      FormValidation.contentManagementSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.errors.forEach(err => {
        const fieldName = err.path[0];
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };

  const validateImageUpload = (file) => {
    if (!file) return true;
    
    const validation = FormValidation.validateImageUpload(file);
    if (!validation.success) {
      setErrors(prev => ({ ...prev, image: validation.error }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, image: undefined }));
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!validateImageUpload(imageFile)) return;

    setIsLoading(true);
    try {
      await onSave(formData, imageFile);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateImageUpload(file)) {
        setImageFile(file);
        // Créer une preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({ ...prev, coverImagePreview: e.target.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div 
      className="fixed w-screen h-screen bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-2 sm:p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 99999,
        margin: 0,
        padding: '8px'
      }}
    >
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-slate-700/50">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white pr-4">
            Modifier le Roman
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-700/50 text-gray-400 hover:text-white transition-all duration-200 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Erreur de soumission */}
          {errors.submit && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errors.submit}
            </div>
          )}

          {/* Note explicative du workflow */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 lg:p-6">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-xs">ℹ</span>
              </div>
              Note importante
            </h3>
            <p className="text-blue-300 text-sm lg:text-base mb-3 leading-relaxed">
              Les contenus acceptés sont sous contrôle de l'auteur pour la publication. 
              L'admin ne peut que les accepter/refuser lors de la soumission initiale.
            </p>
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-400 text-xs">⚠</span>
              </div>
              <p className="text-amber-300 text-sm font-medium">
                Une vérification éditoriale est obligatoire avant acceptation.
              </p>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Titre</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full p-3 sm:p-4 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 text-sm sm:text-base ${
                  errors.title ? 'border-red-500/50' : 'border-slate-600/50'
                }`}
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>
            <div>
              <StatusSelector
                selectedStatus={formData.status}
                onStatusChange={(status) => handleInputChange('status', status)}
                error={errors.status}
              />
            </div>
          </div>

          {/* Champs spécifiques aux romans */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Catégories</label>
              <CategorySelector
                selectedCategories={formData.categories || []}
                onCategoriesChange={(categories) => handleInputChange('categories', categories)}
              />
            </div>

            <AuthorSelector
              selectedAuthorId={formData.authorId}
              onAuthorChange={(authorId) => handleInputChange('authorId', authorId)}
              authors={[
                { id: 1, name: 'Alice Martin' },
                { id: 2, name: 'Bob Dupont' },
                { id: 3, name: 'Claire Rousseau' },
                { id: 4, name: 'David Leroy' },
                { id: 5, name: 'Emma Dubois' },
                { id: 6, name: 'Marc Laurent' },
                { id: 7, name: 'Sophie Martin' }
              ]}
            />

            {/* Vérification éditoriale */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-amber-400 font-medium mb-2 flex items-center gap-2">
                    <div className="w-5 h-5 bg-amber-500/20 rounded flex items-center justify-center">
                      <span className="text-amber-400 text-xs">✓</span>
                    </div>
                    Vérification éditoriale
                  </h3>
                  <p className="text-amber-300 text-sm mb-3">
                    Un roman doit être vérifié par un éditeur de contenu avant d'être accepté.
                  </p>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVerified || false}
                      onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                      className="w-4 h-4 rounded border-amber-500/50 bg-amber-500/10 text-amber-500 focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-0"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-amber-200 font-medium">Roman vérifié</span>
                      {formData.isVerified && (
                        <div className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-medium">
                          Vérifié ✓
                        </div>
                      )}
                    </div>
                  </label>
                  
                  {!formData.isVerified && (
                    <p className="text-amber-400/80 text-xs mt-2">
                      ⚠️ Ce roman n'est pas vérifié !
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* État du roman - Seulement pour les romans acceptés ou publiés */}
            {(formData.status === 'accepted' || formData.status === 'published') && (
              <div className="bg-slate-600/30 border border-slate-500/30 rounded-lg p-4">
                <h3 className="text-slate-200 font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  État du roman
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Gérez l'état de rédaction et le nombre de chapitres pour les romans acceptés.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Statut de rédaction</label>
                    <div className="relative">
                      <select
                        value={formData.isCompleted ? 'completed' : 'ongoing'}
                        onChange={(e) => handleInputChange('isCompleted', e.target.value === 'completed')}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                      >
                        <option value="ongoing">En cours de rédaction</option>
                        <option value="completed">Roman terminé</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de chapitres</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.chapterCount || 0}
                      onChange={(e) => handleInputChange('chapterCount', parseInt(e.target.value) || 0)}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center mt-0.5">
                      <span className="text-blue-400 text-xs">ℹ</span>
                    </div>
                    <div>
                      <p className="text-blue-300 text-sm">
                        <strong>En cours :</strong> Le roman est encore en rédaction par l'auteur.
                      </p>
                      <p className="text-blue-300 text-sm mt-1">
                        <strong>Terminé :</strong> L'auteur a fini d'écrire son roman.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image de couverture</label>
              <div className="space-y-3">
                {/* Aperçu de l'image actuelle */}
                {(formData.coverImagePreview || formData.coverImage) ? (
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={formData.coverImagePreview || formData.coverImage}
                        alt="Aperçu de la couverture"
                        className="w-20 h-30 object-cover rounded-lg border border-slate-600/50 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            coverImagePreview: null, 
                            coverImage: null 
                          }));
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-2">Image actuelle</p>
                      <label
                        htmlFor={`cover-${type}`}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-600/50 transition-colors cursor-pointer text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        Changer l'image
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-6 text-center">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm mb-1">Aucune image de couverture</p>
                        <p className="text-gray-400 text-xs">JPG, PNG jusqu'à 10MB</p>
                      </div>
                      <label
                        htmlFor={`cover-${type}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors cursor-pointer text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        Ajouter une image
                      </label>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  id={`cover-${type}`}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full p-3 sm:p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all duration-200 text-sm sm:text-base"
              placeholder="Description détaillée du roman..."
            />
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Commentaire éditorial
            </label>
            <textarea
              value={formData.comment || ''}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={3}
              className="w-full p-3 sm:p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all duration-200 text-sm sm:text-base"
              placeholder="Ajoutez un commentaire éditorial sur ce roman (optionnel)..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white hover:bg-slate-600/50 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden sm:inline">Sauvegarder les modifications</span>
              <span className="sm:hidden">Sauvegarder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de gestion rapide des statuts
export const QuickActionModal = ({ isOpen, onClose, item, actionType, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen || !item) return null;

  const validateAction = () => {
    const validation = FormValidation.validateQuickAction(actionType, reason);
    
    if (!validation.success) {
      setErrors(validation.errors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleConfirm = async () => {
    // Vérification obligatoire pour l'acceptation d'un roman
    if (actionType === 'accept' && !item.isVerified) {
      setErrors({ verification: 'Vous devez vérifier le roman avant de pouvoir l\'accepter' });
      return;
    }
    
    if (!validateAction()) {
      return;
    }
    
    setLoading(true);
    try {
      await onConfirm(reason);
      setReason('');
      setErrors({});
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReasonChange = (value) => {
    setReason(value);
    // Effacer l'erreur quand l'utilisateur tape
    if (errors.reason) {
      setErrors(prev => ({ ...prev, reason: undefined }));
    }
  };

  const getActionInfo = () => {
    switch(actionType) {
      case 'accept':
        return {
          title: 'Accepter',
          text: 'accepter',
          color: 'bg-green-600 hover:bg-green-700',
          description: 'Le contenu sera accepté et pourra être modifié ou supprimé.'
        };
      case 'reject':
        return {
          title: 'Refuser',
          text: 'refuser',
          color: 'bg-red-600 hover:bg-red-700',
          description: 'Le contenu sera refusé et supprimé du système. L\'auteur sera notifié.',
          needsReason: true
        };
      case 'unpublish':
        return {
          title: 'Dépublier',
          text: 'dépublier',
          color: 'bg-orange-600 hover:bg-orange-700',
          description: 'Le contenu sera retiré de la publication mais restera modifiable.',
          needsReason: true
        };
      case 'republish':
        return {
          title: 'Republier',
          text: 'republier',
          color: 'bg-blue-600 hover:bg-blue-700',
          description: 'Le contenu sera republié et redeviendra visible aux lecteurs.'
        };
      default:
        return {
          title: 'Confirmer',
          text: 'confirmer',
          color: 'bg-purple-600 hover:bg-purple-700',
          description: 'Confirmer cette action.'
        };
    }
  };

  const actionInfo = getActionInfo();

  return (
    <div 
      className="fixed w-screen h-screen bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-2 sm:p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 99999,
        margin: 0,
        padding: '8px'
      }}
    >
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
          {actionInfo.title}
        </h3>
        
        <div className="p-4 sm:p-6">
          {/* Erreurs de validation */}
          {(errors.verification || errors.submit) && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errors.verification || errors.submit}
            </div>
          )}

          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${actionInfo.bgColor}`}>
              {actionInfo.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                {actionInfo.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {actionInfo.description}
              </p>
            </div>
          </div>

          {actionInfo.needsReason && (
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${actionType === 'reject' ? 'text-red-400' : 'text-orange-400'}`}>
                {actionType === 'reject' ? 'Raison du refus' : 'Raison de la dépublication'} (obligatoire)
              </label>
              <textarea
                value={reason}
                onChange={(e) => handleReasonChange(e.target.value)}
                placeholder={actionType === 'reject' 
                  ? "Expliquez pourquoi ce contenu est refusé..." 
                  : "Expliquez pourquoi ce contenu est dépublié..."}
                rows={3}
                className={`w-full p-3 rounded-lg text-white resize-none focus:outline-none focus:ring-2 text-sm sm:text-base ${
                  errors.reason
                    ? actionType === 'reject' 
                      ? 'bg-red-500/10 border border-red-500/50 placeholder-red-400 focus:ring-red-500/50'
                      : 'bg-orange-500/10 border border-orange-500/50 placeholder-orange-400 focus:ring-orange-500/50'
                    : actionType === 'reject' 
                      ? 'bg-red-500/10 border border-red-500/30 placeholder-red-400 focus:ring-red-500/50'
                      : 'bg-orange-500/10 border border-orange-500/30 placeholder-orange-400 focus:ring-orange-500/50'
                }`}
              />
              {errors.reason && (
                <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 ${
                  actionType === 'reject' 
                    ? 'bg-red-500/10 border border-red-500/30' 
                    : 'bg-orange-500/10 border border-orange-500/30'
                }`}>
                  <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 text-xs">!</span>
                  </div>
                  <p className={`text-xs font-medium ${actionType === 'reject' ? 'text-red-400' : 'text-orange-400'}`}>
                    {errors.reason}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-600/50 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || (actionInfo.needsReason && !reason.trim()) || (actionType === 'accept' && !item.isVerified)}
              className={`flex-1 px-4 py-2 sm:py-3 ${actionInfo.color} rounded-lg text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                actionInfo.title
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 