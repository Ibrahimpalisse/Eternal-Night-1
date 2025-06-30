import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Search, Calendar, Filter, SortAsc, SortDesc, Trash2 } from 'lucide-react';

export const LikesModal = ({ isOpen, onClose, contentType, contentId, contentTitle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Favoris</h2>
              <p className="text-sm text-gray-400">{contentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les favoris..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white flex items-center gap-2 hover:bg-slate-700/50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white flex items-center gap-2 hover:bg-slate-700/50 transition-colors"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              {sortOrder === 'asc' ? 'Plus ancien' : 'Plus récent'}
            </button>
          </div>
        </div>

        {/* Liste des favoris */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Placeholder pour les favoris */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    U
                  </div>
                  <div>
                    <p className="font-medium text-white">Utilisateur</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Il y a 2 jours</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}; 