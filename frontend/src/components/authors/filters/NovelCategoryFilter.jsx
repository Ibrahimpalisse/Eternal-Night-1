import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Tag, Check, Search } from 'lucide-react';

const NovelCategoryFilter = ({ selectedCategory, onCategoryChange, categories = [], className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);

  const categoryOptions = [
    { 
      value: 'all', 
      label: 'Toutes les catégories', 
      icon: Tag,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30'
    },
    ...categories.map(category => ({
      value: category,
      label: category,
      icon: Tag,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    }))
  ];

  // Filtrer les options selon le terme de recherche
  const filteredOptions = categoryOptions.filter(option => 
    option.value === 'all' || 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = categoryOptions.find(option => option.value === selectedCategory) || categoryOptions[0];

  // Focus sur la barre de recherche à l'ouverture
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
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

  const handleSelect = (value) => {
    onCategoryChange(value);
    setIsOpen(false);
    setSearchTerm('');
  };

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
      <div className="p-3 space-y-3">
        {/* Barre de recherche */}
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une catégorie..."
            className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Liste des catégories */}
        <div className="space-y-1">
          {filteredOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                selectedCategory === option.value
                  ? `${option.bgColor} ${option.color}`
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <option.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate flex-1">{option.label}</span>
              {selectedCategory === option.value && (
                <Check className="w-4 h-4 flex-shrink-0" />
              )}
            </button>
          ))}

          {filteredOptions.length === 0 && (
            <div className="text-center py-3 text-gray-400 text-sm">
              Aucune catégorie trouvée
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative w-full ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-button w-full flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl border transition-all justify-between ${
          selectedOption.value === 'all'
            ? 'bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50'
            : `${selectedOption.bgColor} ${selectedOption.borderColor} ${selectedOption.color} hover:opacity-80`
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <selectedOption.icon className="w-5 h-5 flex-shrink-0" />
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

export default NovelCategoryFilter; 