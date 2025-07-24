import React from 'react';
import { Trash2, AlertTriangle, Tag } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  categoryToDelete, 
  isLoading, 
  onCancel, 
  onConfirm 
}) => {
  if (!isOpen || !categoryToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white text-base sm:text-lg font-semibold">
              Confirmer la suppression
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Cette action est irréversible
            </p>
          </div>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-300 mb-2 text-sm sm:text-base">
            Êtes-vous sûr de vouloir supprimer la catégorie :
          </p>
          <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-purple-500/20 flex-shrink-0">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base truncate">{categoryToDelete.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-600/50 hover:bg-slate-500/50 text-white rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600/50 hover:bg-red-500/50 text-white rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden xs:inline">Suppression...</span>
                <span className="xs:hidden">Suppression</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 