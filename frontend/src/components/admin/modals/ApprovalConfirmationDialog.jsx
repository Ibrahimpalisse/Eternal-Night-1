import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, X, User } from 'lucide-react';

const ApprovalConfirmationDialog = ({ isOpen, onClose, application, onConfirm, isLoading }) => {
  const handleConfirm = () => {
    onConfirm(application);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !application) return null;

  const modalContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black/70 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          handleClose();
        }
      }}
    >
      <div 
        className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl w-full max-w-lg animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-green-400">Confirmer l'approbation</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          {/* Informations du candidat */}
          <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {application.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold">{application.name}</p>
              <p className="text-gray-400 text-sm">{application.email}</p>
              <p className="text-gray-400 text-xs">Pseudo: {application.authorPseudo}</p>
            </div>
          </div>

          {/* Message de confirmation */}
          <div className="text-center py-4">
            <p className="text-gray-300 mb-2">
              Êtes-vous sûr de vouloir <span className="text-green-400 font-semibold">approuver</span> cette candidature ?
            </p>
            <p className="text-gray-400 text-sm">
              Le candidat deviendra officiellement auteur sur la plateforme et pourra commencer à publier du contenu.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 order-2 sm:order-1 px-6 py-3.5 bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 hover:border-slate-500/60 text-white rounded-xl transition-all duration-200 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 order-1 sm:order-2 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-green-500/20 hover:ring-green-500/40"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Approbation en cours...</span>
                  <span className="sm:hidden">Approbation...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Approuver</span>
                  <span className="sm:hidden">Approuver</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default ApprovalConfirmationDialog; 