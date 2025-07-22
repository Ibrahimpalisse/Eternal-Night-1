import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, CheckCircle } from 'lucide-react';

const MultiSelectFilter = ({ 
  title = "Sélectionnez des genres", 
  placeholder = "Rechercher un genre...",
  options = [], 
  selectedOptions = [], 
  onSelectionChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Position dynamique
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dropdownWidth = buttonRect.width;
      
      // Hauteur estimée du dropdown
      const estimatedDropdownHeight = Math.min(320, 320); // max-h-80 = 320px
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;
      
      // Ajuster la position horizontale si débordement
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      
      // Ajuster la position verticale si débordement
      const spaceBelow = viewportHeight - buttonRect.bottom - 8;
      const spaceAbove = buttonRect.top - 8;
      
      if (estimatedDropdownHeight > spaceBelow && spaceAbove > spaceBelow) {
        top = buttonRect.top - estimatedDropdownHeight - 8;
      }
      
      setDropdownPosition({
        top: Math.max(10, top),
        left: Math.max(10, left),
        width: dropdownWidth
      });
    }
  }, [isOpen]);

  // Fermer sur scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => setIsOpen(false);
    const handleScroll = (event) => {
      if (dropdownRef.current && (
        dropdownRef.current.contains(event.target) || dropdownRef.current === event.target
      )) return;
      setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionToggle = (optionValue) => {
    const newSelection = selectedOptions.includes(optionValue)
      ? selectedOptions.filter(item => item !== optionValue)
      : [...selectedOptions, optionValue];
    
    onSelectionChange(newSelection);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return title;
    if (selectedOptions.length === 1) {
      const selectedOption = options.find(opt => opt.value === selectedOptions[0]);
      return selectedOption ? selectedOption.label : title;
    }
    return `${selectedOptions.length} genres sélectionnés`;
  };

  // Rendu du menu dropdown
  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl max-h-80 overflow-hidden"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 999999
      }}
    >
      {/* Barre de recherche */}
      <div className="p-3 border-b border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>

      {/* Liste des options */}
      <div className="max-h-60 overflow-y-auto">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center px-3 py-2 hover:bg-slate-700/50 cursor-pointer transition-colors ${
                selectedOptions.includes(option.value) ? 'bg-slate-700/30' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleOptionToggle(option.value)}
                className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500/50 focus:ring-2"
              />
              <span className={`ml-3 text-sm flex-1 ${
                selectedOptions.includes(option.value) ? 'text-white font-medium' : 'text-gray-300'
              }`}>
                {option.label}
              </span>
              {selectedOptions.includes(option.value) && (
                <CheckCircle className="w-4 h-4 text-green-400 ml-2" />
              )}
            </label>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-gray-400 text-sm">
            Aucun genre trouvé
          </div>
        )}
      </div>

      {/* Actions */}
      {selectedOptions.length > 0 && (
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={() => onSelectionChange([])}
            className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Effacer la sélection
          </button>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-button w-full px-4 py-3 backdrop-blur-sm border rounded-xl text-left flex items-center justify-between hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${
          selectedOptions.length > 0 
            ? 'bg-slate-700/50 border-purple-500/30 text-white' 
            : 'bg-slate-800/50 border-slate-700/50 text-gray-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {selectedOptions.length > 0 && (
            <CheckCircle className="w-4 h-4 text-green-400" />
          )}
          <span className={selectedOptions.length === 0 ? 'text-gray-400' : 'text-white'}>
            {getDisplayText()}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default MultiSelectFilter; 
 