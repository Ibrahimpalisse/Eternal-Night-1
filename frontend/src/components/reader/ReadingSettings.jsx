import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minus, Plus, ChevronDown, CheckCircle, BookOpen } from 'lucide-react';

const ReadingSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  lineHeight,
  setLineHeight
}) => {
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const fontDropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsFontDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculer la position du dropdown
  const handleDropdownToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
    setIsFontDropdownOpen(!isFontDropdownOpen);
  };

  const fontOptions = [
    { value: 'serif', label: 'Serif (lisible)', icon: CheckCircle },
    { value: 'sans-serif', label: 'Sans-serif (moderne)', icon: BookOpen },
    { value: 'monospace', label: 'Monospace (code)', icon: BookOpen }
  ];

  const getCurrentFontLabel = () => {
    const option = fontOptions.find(opt => opt.value === fontFamily);
    return option ? option.label : 'Serif (lisible)';
  };

  const handleFontChange = (value) => {
    setFontFamily(value);
    setIsFontDropdownOpen(false);
  };

  if (!isSettingsOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsSettingsOpen(false)}>
        <div className="w-full max-w-md rounded-xl bg-slate-800 border border-slate-700 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="font-semibold text-base sm:text-lg text-white">
                Paramètres de lecture
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Taille de police */}
              <div>
                <label className="block text-sm font-medium mb-2 sm:mb-3 text-gray-200">
                  Taille de police
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    className="p-2 sm:p-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="px-3 sm:px-4 py-2 rounded-lg text-center min-w-[50px] sm:min-w-[60px] bg-slate-700 text-white text-sm sm:text-base">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    className="p-2 sm:p-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Police */}
              <div>
                <label className="block text-sm font-medium mb-2 sm:mb-3 text-gray-200">
                  Police
                </label>
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={handleDropdownToggle}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm hover:bg-slate-600/50 transition-colors"
                  >
                    <span>{getCurrentFontLabel()}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Hauteur de ligne */}
              <div>
                <label className="block text-sm font-medium mb-2 sm:mb-3 text-gray-200">
                  Hauteur de ligne
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}
                    className="p-2 sm:p-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="px-3 sm:px-4 py-2 rounded-lg text-center min-w-[50px] sm:min-w-[60px] bg-slate-700 text-white text-sm sm:text-base">
                    {lineHeight.toFixed(1)}
                  </span>
                  <button
                    onClick={() => setLineHeight(Math.min(3.0, lineHeight + 0.1))}
                    className="p-2 sm:p-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown de police avec Portal */}
      {isFontDropdownOpen && createPortal(
        <div 
          ref={fontDropdownRef}
          className="fixed z-[60]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width
          }}
        >
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {fontOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handleFontChange(option.value)}
                  className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <span className="text-white text-sm">{option.label}</span>
                  {fontFamily === option.value && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <IconComponent className="w-3 h-3" />
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ReadingSettings; 
 
 
 
 
 