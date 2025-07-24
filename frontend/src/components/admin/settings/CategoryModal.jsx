import React from 'react';
import { Plus, Edit, Tag } from 'lucide-react';

const CategoryModal = ({ 
  isOpen, 
  isEditMode, 
  categoryName, 
  setCategoryName, 
  isLoading, 
  onClose, 
  onSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
          <h3 className="text-white text-base sm:text-lg font-semibold">
            {isEditMode ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
          </h3>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Nom de la catégorie
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 sm:py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm sm:text-base transition-all duration-200"
              placeholder="Ex: Science-Fiction"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-600/50 hover:bg-slate-500/50 text-white rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600/50 hover:bg-purple-500/50 text-white rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden xs:inline">{isEditMode ? 'Modification...' : 'Création...'}</span>
                  <span className="xs:hidden">{isEditMode ? 'Modification' : 'Création'}</span>
                </>
              ) : (
                <>
                  {isEditMode ? <Edit className="w-3 h-3 sm:w-4 sm:h-4" /> : <Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {isEditMode ? 'Modifier' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal; 