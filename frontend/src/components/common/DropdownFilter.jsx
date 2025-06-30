import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

/**
 * DropdownFilter générique
 * @param {string} label - Label affiché au-dessus du bouton
 * @param {Array} options - [{ value, label, icon, color, bgColor, borderColor }]
 * @param {string} value - Valeur sélectionnée
 * @param {function} onChange - Callback (nouvelle valeur)
 * @param {string} className - Classes additionnelles pour le bouton
 */
const DropdownFilter = ({ label, options, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  // Gestion ouverture/fermeture
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

  // Rendu du menu
  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[9999] max-h-72 overflow-y-auto"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
      }}
    >
      <div className="py-2">
        {options.map(opt => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-left border ${
                value === opt.value
                  ? `${opt.bgColor || ''} ${opt.borderColor || ''} text-white`
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/50'
              }`}
            >
              {Icon && (
                <div className={`w-5 h-5 flex-shrink-0 ${opt.color || ''}`}>
                  {React.isValidElement(Icon) ? Icon : <Icon className="w-5 h-5" />}
                </div>
              )}
              <span className="text-sm font-medium truncate">{opt.label}</span>
              {value === opt.value && (
                <Check className="w-5 h-5 ml-auto text-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">{label}</label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-button w-full flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 justify-between hover:bg-white/10 transition-colors ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedOption.icon && (
            <div className={`w-4 h-4 flex-shrink-0 ${selectedOption.color || ''}`}>
              {React.isValidElement(selectedOption.icon) 
                ? selectedOption.icon 
                : <selectedOption.icon className="w-4 h-4" />
              }
            </div>
          )}
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default DropdownFilter; 