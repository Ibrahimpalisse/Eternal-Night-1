import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users,
  ChevronDown,
  Check,
  Shield,
  Crown,
  User,
  Eye,
  AlertTriangle
} from 'lucide-react';

const RoleFilter = ({ selectedRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const roleOptions = [
    { value: 'all', label: 'Tous les rôles', icon: Users, color: 'text-gray-400' },
    { value: 'super_admin', label: 'Super Admin', icon: Crown, color: 'text-red-400' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'text-orange-400' },
    { value: 'content_editor', label: 'Éditeur', icon: User, color: 'text-blue-400' },
    { value: 'author', label: 'Auteur', icon: User, color: 'text-green-400' },
    { value: 'user', label: 'Utilisateur', icon: User, color: 'text-gray-400' },
    { value: 'blocked', label: 'Bloqué', icon: Eye, color: 'text-red-400' },
    { value: 'author_suspended', label: 'Auteur suspendu', icon: AlertTriangle, color: 'text-yellow-400' }
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

  const selectedRoleData = roleOptions.find(role => role.value === selectedRole);
  const SelectedIcon = selectedRoleData?.icon || Users;

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
      <div className="p-4">
        {/* Liste des rôles */}
        <div className="space-y-2">
          {roleOptions.map(role => {
            const RoleIcon = role.icon;
            return (
              <button
                key={role.value}
                onClick={() => {
                  onRoleChange(role.value);
                  setIsOpen(false);
                }}
                className={`dropdown-item w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                  selectedRole === role.value
                    ? 'bg-slate-600/50 text-white'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <RoleIcon className={`w-5 h-5 flex-shrink-0 ${role.color}`} />
                <span className="text-sm font-medium truncate">{role.label}</span>
                {selectedRole === role.value && (
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
        className="dropdown-button w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 lg:py-3.5 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white hover:bg-slate-600/50 transition-all justify-between"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <SelectedIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${selectedRoleData?.color || 'text-gray-400'}`} />
          <span className="text-xs sm:text-sm lg:text-base font-medium truncate">
            {selectedRoleData?.label || 'Sélectionner un rôle'}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default RoleFilter; 