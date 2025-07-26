import React from 'react';
import { Grid, List } from 'lucide-react';

const ViewToggle = ({ viewMode, onViewModeChange, className = "" }) => {
  return (
    <div className={`flex items-center gap-1 sm:gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-1 ${className}`}>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${
          viewMode === 'grid' 
            ? 'bg-purple-500/20 text-purple-300' 
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        }`}
        title="Vue grille"
      >
        <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${
          viewMode === 'list' 
            ? 'bg-purple-500/20 text-purple-300' 
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        }`}
        title="Vue liste"
      >
        <List className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default ViewToggle; 
 
 
 