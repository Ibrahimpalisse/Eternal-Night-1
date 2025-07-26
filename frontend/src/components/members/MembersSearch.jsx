import React from 'react';

export default function MembersSearch({ searchTerm, setSearchTerm, resultsCount }) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 max-w-10xl">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div className="flex items-center justify-center">
          <span className="text-white text-sm">
            {resultsCount} résultat{resultsCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
} 