import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Heart } from 'lucide-react';

const LikesFilter = ({ 
  selectedLikes, 
  onLikesChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const likesOptions = [
    { value: '', label: 'Tous les likes' },
    { value: '1000', label: '1000+ likes' },
    { value: '500', label: '500+ likes' },
    { value: '100', label: '100+ likes' },
    { value: '50', label: '50+ likes' },
    { value: '10', label: '10+ likes' }
  ];

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
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
      
      const estimatedDropdownHeight = Math.min(likesOptions.length * 44 + 16, 240);
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;
      
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      
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

  const handleLikesSelect = (value) => {
    onLikesChange(value);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (!selectedLikes) return 'Tous les likes';
    const option = likesOptions.find(opt => opt.value === selectedLikes);
    return option ? option.label : 'Tous les likes';
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Rendu du menu dropdown
  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 999999,
        maxHeight: '240px'
      }}
    >
      {/* Liste des options */}
      <div className="max-h-60 overflow-y-auto">
        {likesOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleLikesSelect(option.value)}
            className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
          >
            <span className="text-white text-sm">
              {option.label}
            </span>
            {option.value && (
              <div className="flex items-center gap-1 text-red-400">
                <Heart className="w-3 h-3" />
                <span className="text-xs">
                  {formatNumber(parseInt(option.value))}+
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-button w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white text-left flex items-center justify-between hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
      >
        <span className={!selectedLikes ? 'text-gray-400' : 'text-white'}>
          {getDisplayText()}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default LikesFilter; 
 
 
 