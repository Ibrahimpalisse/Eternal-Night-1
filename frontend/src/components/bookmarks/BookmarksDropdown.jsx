import React from 'react';
import { createPortal } from 'react-dom';

const BookmarksDropdown = ({ 
  showFilters, 
  dropdownPosition, 
  setSortBy, 
  setShowFilters, 
  activeTab 
}) => {
  if (!showFilters || !dropdownPosition.top || !dropdownPosition.width) return null;

  return createPortal(
    <div 
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
      data-dropdown-container
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 99999
      }}
    >
      <div className="max-h-60 overflow-y-auto">
        <button
          onClick={() => {
            setSortBy('bookmarked');
            setShowFilters(false);
          }}
          className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
        >
          <span className="text-white text-sm">Plus récents</span>
        </button>
        <button
          onClick={() => {
            setSortBy('title');
            setShowFilters(false);
          }}
          className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
        >
          <span className="text-white text-sm">Titre</span>
        </button>
        {activeTab === 'novels' && (
          <button
            onClick={() => {
              setSortBy('progress');
              setShowFilters(false);
            }}
            className="dropdown-item w-full flex items-center justify-between px-3 py-3 hover:bg-slate-700/50 transition-colors text-left"
          >
            <span className="text-white text-sm">Progression</span>
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BookmarksDropdown; 