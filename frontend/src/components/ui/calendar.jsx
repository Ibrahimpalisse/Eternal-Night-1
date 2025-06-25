import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

// Utilitaires pour les dates
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const isToday = (date, today) => {
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const Calendar = ({ 
  value, 
  onChange, 
  className,
  minDate,
  maxDate,
  disabled = false,
  showOutsideDays = true 
}) => {
  const [currentDate, setCurrentDate] = useState(() => value || new Date());
  const today = useMemo(() => new Date(), []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Générer les jours du calendrier
  const calendarDays = useMemo(() => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Jours du mois précédent
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    // Commencer par dimanche (0) en ajustant pour que lundi soit 0
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevYear, prevMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false
      });
    }

    // Jours du mois suivant pour compléter la grille
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextYear, nextMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const selectDate = (date) => {
    if (disabled) return;
    
    // Vérifier les limites de date
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;
    
    onChange?.(date);
  };

  const isDateDisabled = (date) => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className={cn(
      // Base responsive - Design fluide pour tous les écrans
      "bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl overflow-hidden",
      // Largeur responsive intelligente
      "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl",
      // Marges et espacements adaptatifs
      "mx-auto",
      className
    )}>
      {/* Header avec navigation - Responsive optimal */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Bouton précédent - Taille adaptative */}
          <button
            onClick={goToPreviousMonth}
            disabled={disabled}
            className="group p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-slate-700/30 hover:bg-slate-600/50 active:bg-slate-600/70 border border-slate-600/30 hover:border-slate-500/50 text-gray-400 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:drop-shadow-lg" />
          </button>
          
          {/* Zone centrale - Layout responsive */}
          <div className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
            {/* Inputs mois/année responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg lg:rounded-xl flex items-center justify-center border border-blue-500/30">
                <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-400" />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={currentMonth + 1}
                  onChange={(e) => {
                    const month = parseInt(e.target.value) - 1;
                    if (month >= 0 && month <= 11) {
                      setCurrentDate(new Date(currentYear, month, 1));
                    }
                  }}
                  disabled={disabled}
                  className="w-10 sm:w-12 lg:w-14 px-1 sm:px-2 py-1 text-xs sm:text-sm lg:text-base bg-slate-700/50 border border-slate-600/50 rounded-md lg:rounded-lg text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 disabled:opacity-50"
                  placeholder="MM"
                />
                <span className="text-slate-400 text-sm sm:text-base">/</span>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={currentYear}
                  onChange={(e) => {
                    const year = parseInt(e.target.value);
                    if (year >= 1900 && year <= 2100) {
                      setCurrentDate(new Date(year, currentMonth, 1));
                    }
                  }}
                  disabled={disabled}
                  className="w-14 sm:w-16 lg:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm lg:text-base bg-slate-700/50 border border-slate-600/50 rounded-md lg:rounded-lg text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 disabled:opacity-50"
                  placeholder="AAAA"
                />
              </div>
            </div>
            
            {/* Bouton Aujourd'hui - Responsive */}
            <button
              onClick={goToToday}
              disabled={disabled}
              className="group px-2.5 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 active:from-blue-500/40 active:to-purple-500/40 text-blue-400 hover:text-blue-300 rounded-lg lg:rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 touch-manipulation"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-pulse" />
              <span className="hidden xs:inline sm:hidden lg:inline">Aujourd'hui</span>
              <span className="xs:hidden sm:inline lg:hidden">Auj.</span>
            </button>
          </div>
          
          {/* Bouton suivant - Taille adaptative */}
          <button
            onClick={goToNextMonth}
            disabled={disabled}
            className="group p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-slate-700/30 hover:bg-slate-600/50 active:bg-slate-600/70 border border-slate-600/30 hover:border-slate-500/50 text-gray-400 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 touch-manipulation"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:drop-shadow-lg" />
          </button>
        </div>
      </div>

      {/* Corps du calendrier - Responsive intelligent */}
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Jours de la semaine - Responsive */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 lg:gap-2 mb-2 sm:mb-3 lg:mb-4">
          {dayNames.map(day => (
            <div key={day} className="h-7 sm:h-9 lg:h-12 flex items-center justify-center bg-slate-800/40 rounded-md lg:rounded-lg border border-slate-700/30">
              <span className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                {/* Affichage responsive des noms de jours */}
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Grille des jours - Design responsive optimal */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 lg:gap-2">
          {calendarDays.map((dayInfo, index) => {
            const isSelectedDay = isSameDate(dayInfo.date, value);
            const isTodayDay = isToday(dayInfo.date, today);
            const isOutsideMonth = !dayInfo.isCurrentMonth;
            const isDisabled = isDateDisabled(dayInfo.date);

            return (
              <button
                key={index}
                onClick={() => selectDate(dayInfo.date)}
                disabled={isDisabled}
                className={cn(
                  // Tailles responsives et interactions tactiles
                  "h-8 sm:h-10 lg:h-12 flex items-center justify-center rounded-lg lg:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all duration-200 relative group overflow-hidden touch-manipulation",
                  // Focus et accessibilité améliorée
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-slate-900",
                  // Tap targets optimisés pour mobile
                  "min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px]",
                  {
                    // États de base - Responsive
                    "text-gray-300 bg-slate-800/20 hover:bg-slate-700/40 active:bg-slate-700/60 border border-slate-700/30 hover:border-slate-600/50": 
                      dayInfo.isCurrentMonth && !isSelectedDay && !isTodayDay,
                    
                    // Jours hors mois - Responsif
                    "text-gray-600 bg-slate-800/10 hover:bg-slate-700/20 active:bg-slate-700/30 border border-slate-700/20": 
                      isOutsideMonth && showOutsideDays,
                    
                    "invisible": isOutsideMonth && !showOutsideDays,
                    
                    // Jour sélectionné - Design premium responsive
                    "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg lg:shadow-xl shadow-blue-500/25 border border-blue-400/50 scale-105 lg:scale-110": 
                      isSelectedDay,
                    
                    // Aujourd'hui - Style distinctif responsive
                    "bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-blue-400 border-2 border-blue-500/50 shadow-md lg:shadow-lg shadow-blue-500/10": 
                      isTodayDay && !isSelectedDay,
                    
                    // États désactivés - Responsive
                    "opacity-40 cursor-not-allowed hover:bg-slate-800/20 hover:border-slate-700/30 active:bg-slate-800/20": 
                      isDisabled,
                    
                    // Animations tactiles responsives
                    "hover:scale-105 active:scale-95 hover:shadow-md lg:hover:shadow-lg hover:shadow-slate-900/20": 
                      !isDisabled && dayInfo.isCurrentMonth && !isSelectedDay,
                  }
                )}
              >
                {/* Fond animé responsive */}
                {!isDisabled && dayInfo.isCurrentMonth && !isSelectedDay && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 group-active:from-blue-500/20 group-active:to-purple-500/20 rounded-lg lg:rounded-xl transition-all duration-300" />
                )}
                
                <span className="relative z-10 select-none">{dayInfo.day}</span>
                
                {/* Indicateur aujourd'hui - Responsive */}
                {isTodayDay && !isSelectedDay && (
                  <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full animate-pulse shadow-sm lg:shadow-lg shadow-blue-400/50" />
                )}
                
                {/* Effet brillance jour sélectionné - Responsive */}
                {isSelectedDay && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg lg:rounded-xl opacity-60 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer responsive moderne */}
      <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-sm border-t border-slate-700/50 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Informations date - Layout responsive */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-md lg:rounded-lg flex items-center justify-center border border-green-500/30 flex-shrink-0">
              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-300 truncate">
                {value ? (
                  <span className="text-white">
                    {/* Format responsive de la date */}
                    <span className="hidden md:inline">
                      {value.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="md:hidden">
                      {value.toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="hidden sm:inline">Aucune date sélectionnée</span>
                    <span className="sm:hidden">Pas de date</span>
                  </span>
                )}
              </p>
              {value && (
                <p className="text-xs text-gray-500 hidden sm:block">
                  Cliquez sur une autre date pour la modifier
                </p>
              )}
            </div>
          </div>
          
          {/* Bouton effacer - Responsive */}
          {value && (
            <button
              onClick={() => onChange?.(null)}
              disabled={disabled}
              className="group px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-400 hover:text-red-300 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2 touch-manipulation self-start sm:self-auto flex-shrink-0"
            >
              <span>Effacer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { Calendar }; 