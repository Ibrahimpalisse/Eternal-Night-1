import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Circle,
  Search,
  ChevronDown,
  Check,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const UserStatusFilter = ({ selectedStatus, onStatusChange }) => {
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
      value: 'active', 
      label: 'Actif', 
      icon: CheckCircle, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    { 
      value: 'blocked', 
      label: 'Bloqué', 
      icon: XCircle, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    { 
      value: 'author_suspended', 
      label: 'Auteur suspendu', 
      icon: AlertTriangle, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
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

  const selectedStatusData = statusOptions.find(status => status.value === selectedStatus);
  const SelectedIcon = selectedStatusData?.icon || Filter;

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      data-dropdown-portal
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '250px',
        overflowY: 'auto'
      }}
    >
      <div className="p-4">
        {/* Liste des statuts */}
        <div className="space-y-2">
          {statusOptions.map(status => {
            const StatusIcon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => {
                  onStatusChange(status.value);
                  setIsOpen(false);
                }}
                className={`dropdown-item w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left border ${
                  selectedStatus === status.value
                    ? `${status.bgColor} ${status.borderColor} text-white`
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/50'
                }`}
              >
                <div className={`p-2 ${status.bgColor} rounded-lg border ${status.borderColor}`}>
                  <StatusIcon className={`w-5 h-5 ${status.color}`} />
                </div>
                <span className="text-sm font-medium truncate">{status.label}</span>
                {selectedStatus === status.value && (
                  <div className="ml-auto">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-button w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 lg:py-3.5 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white hover:bg-slate-600/50 transition-all justify-between ${
          selectedStatusData && selectedStatus !== 'all' ? selectedStatusData.bgColor : ''
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <SelectedIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${selectedStatusData?.color || 'text-gray-400'}`} />
          <span className="text-xs sm:text-sm lg:text-base font-medium truncate">
            {selectedStatusData?.label || 'Sélectionner un statut'}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default UserStatusFilter; 