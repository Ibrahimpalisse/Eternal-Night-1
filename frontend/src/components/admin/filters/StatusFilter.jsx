import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Circle,
  Search,
  ChevronDown,
  Check,
  Filter,
  Clock,
  Pause,
  CheckCircle,
  EyeOff
} from 'lucide-react';

const StatusFilter = ({ selectedStatus, onStatusChange, availableStatuses = [] }) => {
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

export default StatusFilter; 