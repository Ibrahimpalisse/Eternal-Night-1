import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  User,
  Search,
  ChevronDown,
  Check,
  Users
} from 'lucide-react';

const AuthorFilter = ({ selectedAuthor, onAuthorChange, availableAuthors }) => {
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

  const filteredAuthors = availableAuthors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAuthorData = availableAuthors.find(author => author.id.toString() === selectedAuthor);

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      <div className="p-4">
        {/* Barre de recherche */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm"
          />
        </div>

        {/* Option "Tous les auteurs" */}
        <button
          onClick={() => {
            onAuthorChange('all');
            setIsOpen(false);
            setSearchTerm('');
          }}
          className={`dropdown-item w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left mb-2 ${
            selectedAuthor === 'all'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">Tous les auteurs</span>
          {selectedAuthor === 'all' && (
            <div className="ml-auto">
              <Check className="w-4 h-4" />
            </div>
          )}
        </button>

        {/* Séparateur */}
        <div className="border-t border-slate-700/50 my-2"></div>

        {/* Liste des auteurs */}
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {filteredAuthors.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              Aucun auteur trouvé
            </div>
          ) : (
            filteredAuthors.map(author => (
              <button
                key={author.id}
                onClick={() => {
                  onAuthorChange(author.id.toString());
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`dropdown-item w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                  selectedAuthor === author.id.toString()
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{author.name}</span>
                {selectedAuthor === author.id.toString() && (
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
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-button w-full flex items-center gap-3 px-4 py-3 lg:py-3.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white hover:bg-slate-600/50 transition-all justify-between"
      >
        <div className="flex items-center gap-3 min-w-0">
          <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-sm lg:text-base font-medium truncate">
            {selectedAuthor === 'all' ? 'Tous les auteurs' : selectedAuthorData?.name || 'Sélectionner un auteur'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default AuthorFilter; 