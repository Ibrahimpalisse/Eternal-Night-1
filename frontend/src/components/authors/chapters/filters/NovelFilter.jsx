import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, BookOpen, ChevronDown } from 'lucide-react';

const NovelFilter = ({ selectedNovel, onNovelChange, novels = [], className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const novelOptions = [
    { 
      value: 'all', 
      label: 'Tous les romans',
      icon: BookOpen,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30'
    },
    ...novels.map(novel => ({
      value: novel.id.toString(),
      label: novel.title,
      icon: BookOpen,
      color: 'text-purple-300',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    }))
  ];

  // Filtrer les romans selon le terme de recherche
  const filteredOptions = novelOptions.filter(option => 
    option.value === 'all' || 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = novelOptions.find(option => option.value === selectedNovel) || novelOptions[0];

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

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dropdownWidth = buttonRect.width;
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;
      
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      
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

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      setIsOpen(false);
      setSearchTerm('');
    };
    
    const handleScroll = (event) => {
      if (dropdownRef.current && (
          dropdownRef.current.contains(event.target) || 
          dropdownRef.current === event.target
        )) {
        return;
      }
      setIsOpen(false);
      setSearchTerm('');
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleSelect = (value) => {
    onNovelChange(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '300px',
        overflowY: 'auto',
        zIndex: 50
      }}
    >
      <div className="p-3">
        {/* Barre de recherche */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un roman..."
            className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        
        {/* Liste des romans */}
        <div className="space-y-2">
          {filteredOptions.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              Aucun roman trouvé
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`dropdown-item w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  selectedNovel === option.value
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <option.icon className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium truncate">{option.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative w-full ${className}`} style={{ zIndex: isOpen ? 40 : 'auto' }}>
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

      {isOpen && (
        <div 
          className="fixed inset-0" 
          style={{ zIndex: 30 }}
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};

export default NovelFilter; 