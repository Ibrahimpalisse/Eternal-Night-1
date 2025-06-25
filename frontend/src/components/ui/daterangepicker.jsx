import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, X, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Calendar } from './calendar';

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  placeholder = "Sélectionner une période",
  className,
  disabled = false,
  minDate,
  maxDate,
  error,
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectionState, setSelectionState] = useState('start'); // 'start' ou 'end'
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Gérer les clics en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectionState('start');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Calculer la position du dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const calendarWidth = 320;
      const calendarHeight = 450;
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;
      
      // Ajuster horizontalement si débordement
      if (left + calendarWidth > viewportWidth - 20) {
        left = viewportWidth - calendarWidth - 20;
      }
      if (left < 20) {
        left = 20;
      }
      
      // Ajuster verticalement si débordement
      if (top + calendarHeight > viewportHeight - 20) {
        top = buttonRect.top - calendarHeight - 8;
      }
      if (top < 20) {
        top = 20;
      }
      
      setDropdownPosition({
        top: Math.max(20, top),
        left: Math.max(20, left),
        width: calendarWidth
      });
    }
  }, [isOpen]);

  const handleDateSelect = (date) => {
    if (!date) {
      onChange?.(null, null);
      setSelectionState('start');
      return;
    }

    if (selectionState === 'start') {
      // Si on sélectionne une date de début
      if (endDate && date > endDate) {
        // Si la nouvelle date de début est après la date de fin, réinitialiser
        onChange?.(date, null);
        setSelectionState('end');
      } else {
        onChange?.(date, endDate);
        setSelectionState('end');
      }
    } else {
      // Si on sélectionne une date de fin
      if (startDate && date < startDate) {
        // Si la nouvelle date de fin est avant la date de début, inverser
        onChange?.(date, startDate);
        setSelectionState('start');
      } else {
        onChange?.(startDate, date);
        setSelectionState('start');
        setIsOpen(false);
      }
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null, null);
    setSelectionState('start');
  };

  const formatDisplayValue = () => {
    if (!startDate && !endDate) return '';
    
    if (startDate && !endDate) {
      return `${startDate.toLocaleDateString('fr-FR')} - ...`;
    }
    
    if (!startDate && endDate) {
      return `... - ${endDate.toLocaleDateString('fr-FR')}`;
    }
    
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}`;
    }
    
    return '';
  };

  // Générer les raccourcis de date couramment utilisés
  const shortcuts = [
    {
      label: "Aujourd'hui",
      getValue: () => {
        const today = new Date();
        return [today, today];
      }
    },
    {
      label: "7 derniers jours",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return [start, end];
      }
    },
    {
      label: "30 derniers jours",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return [start, end];
      }
    },
    {
      label: "Ce mois",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return [start, end];
      }
    },
    {
      label: "Mois dernier",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return [start, end];
      }
    }
  ];

  const handleShortcut = (shortcut) => {
    const [start, end] = shortcut.getValue();
    onChange?.(start, end);
    setSelectionState('start');
    setIsOpen(false);
  };

  // Personnaliser le calendrier pour afficher la plage
  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (date) => {
    return startDate && date.toDateString() === startDate.toDateString();
  };

  const isEndDate = (date) => {
    return endDate && date.toDateString() === endDate.toDateString();
  };

  const calendarContent = isOpen ? (
    <div 
      ref={dropdownRef}
      className="fixed z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
        {/* Info de sélection */}
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
          <div className="text-sm text-gray-300 mb-2">
            {selectionState === 'start' ? 'Sélectionner la date de début' : 'Sélectionner la date de fin'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className={startDate ? 'text-blue-400' : 'text-gray-500'}>
              {startDate ? startDate.toLocaleDateString('fr-FR') : 'Début'}
            </span>
            <ArrowRight className="w-3 h-3" />
            <span className={endDate ? 'text-blue-400' : 'text-gray-500'}>
              {endDate ? endDate.toLocaleDateString('fr-FR') : 'Fin'}
            </span>
          </div>
        </div>

        {/* Raccourcis */}
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/20">
          <div className="text-xs font-medium text-gray-400 mb-3">Raccourcis</div>
          <div className="grid grid-cols-2 gap-2">
            {shortcuts.map((shortcut, index) => (
              <button
                key={index}
                onClick={() => handleShortcut(shortcut)}
                className="px-3 py-2 text-xs bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-gray-300 hover:text-white transition-colors text-left"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calendrier */}
        <Calendar
          value={selectionState === 'start' ? startDate : endDate}
          onChange={handleDateSelect}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className="border-0 bg-transparent shadow-none"
        />
        
        {/* Boutons d'action */}
        <div className="border-t border-slate-700/50 p-4 bg-slate-800/30">
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors text-sm"
            >
              Fermer
            </button>
            {(startDate || endDate) && (
              <button
                onClick={() => handleDateSelect(null)}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Input button */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all justify-between text-left",
            "bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50",
            error && "border-red-500/50 ring-1 ring-red-500/20",
            className
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <CalendarIcon className="w-5 h-5 flex-shrink-0 text-gray-400" />
            <span className={cn(
              "text-sm truncate",
              (startDate || endDate) ? "text-white" : "text-gray-400"
            )}>
              {formatDisplayValue() || placeholder}
            </span>
          </div>
          
          {(startDate || endDate) && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 rounded-md hover:bg-slate-600/50 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </button>
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
      
      {/* Calendrier portal */}
      {typeof document !== 'undefined' && createPortal(calendarContent, document.body)}
    </div>
  );
};

export { DateRangePicker }; 