import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Calendar } from './calendar';
import { FormValidation } from '../../utils/validation';

const DatePicker = ({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  className,
  disabled = false,
  minDate,
  maxDate,
  error,
  label,
  required = false,
  showTime = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeValue, setTimeValue] = useState('');
  const [timeError, setTimeError] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 400 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Gerer la selection de date avec heure optionnelle
  useEffect(() => {
    if (value && showTime && !timeValue) {
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hours}:${minutes}`);
    }
  }, [value, showTime, timeValue]);

  // Gérer les clics en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
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
      const calendarWidth = 320; // Largeur approximative du calendrier
      const calendarHeight = 400; // Hauteur approximative du calendrier
      
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
      onChange?.(null);
      setTimeValue('');
      setIsOpen(false);
      return;
    }

    let finalDate = new Date(date);
    
    if (showTime && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      finalDate.setHours(hours, minutes, 0, 0);
    }
    
    onChange?.(finalDate);
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (time) => {
    // Valider l'heure avec Zod
    const timeValidation = FormValidation.timeSchema.safeParse(time);
    
    if (timeValidation.success) {
      setTimeValue(time);
      setTimeError('');
      
      if (value && time) {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(value);
        newDate.setHours(hours, minutes, 0, 0);
        onChange?.(newDate);
      }
    } else {
      setTimeError(timeValidation.error.errors[0]?.message || 'Format d heure invalide');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null);
    setTimeValue('');
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    
    const dateStr = value.toLocaleDateString('fr-FR');
    if (showTime && timeValue) {
      return `${dateStr} ${timeValue}`;
    }
    return dateStr;
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
        <Calendar
          value={value}
          onChange={handleDateSelect}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className="border-0 bg-transparent shadow-none"
        />
        
        {/* Selecteur d'heure */}
        {showTime && (
          <div className="border-t border-slate-700/50 p-4 bg-slate-800/30">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Heure (HH:MM)
              </label>
              <input
                type="text"
                value={timeValue}
                onChange={(e) => {
                  const value = e.target.value;
                  // Permettre seulement les chiffres et les deux-points
                  if (/^[\d:]*$/.test(value) && value.length <= 5) {
                    // Auto-format : ajouter les deux-points automatiquement
                    let formatted = value.replace(/[^\d]/g, '');
                    if (formatted.length >= 3) {
                      formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4);
                    }
                    
                    // Valider le format avec Zod quand le format est complet
                    if (formatted.length === 5) {
                      handleTimeChange(formatted);
                    } else {
                      setTimeValue(formatted);
                      setTimeError('');
                    }
                  }
                }}
                disabled={disabled || !value}
                placeholder="23:59"
                className={cn(
                  "w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm disabled:opacity-50",
                  timeError ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-600/50"
                )}
              />
              
              {/* Message d erreur pour l heure */}
              {timeError && (
                <p className="text-sm text-red-400 mt-1">{timeError}</p>
              )}
            </div>
            
            {/* Boutons d action */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-white transition-colors text-sm"
              >
                Fermer
              </button>
              {value && (
                <button
                  onClick={() => handleDateSelect(null)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        )}
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
              value ? "text-white" : "text-gray-400"
            )}>
              {formatDisplayValue() || placeholder}
            </span>
          </div>
          
          {value && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 rounded-md hover:bg-slate-600/50 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </button>
      </div>
      
      {/* Message d erreur */}
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

export { DatePicker }; 