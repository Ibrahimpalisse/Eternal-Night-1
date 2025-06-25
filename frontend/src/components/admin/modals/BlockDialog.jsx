import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X, AlertTriangle } from 'lucide-react';

const BlockDialog = ({ isOpen, onClose, application, onConfirm, isLoading }) => {
  const [blockReason, setBlockReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !application) return null;

  const handleConfirm = () => {
    if (!blockReason.trim()) {
      setError('Veuillez indiquer la raison du blocage');
      return;
    }

    if (blockReason.trim().length < 10) {
      setError('La raison doit contenir au moins 10 caractères');
      return;
    }

    onConfirm(application, blockReason.trim());
  };

  const handleClose = () => {
    setBlockReason('');
    setError('');
    onClose();
  };

  const handleReasonChange = (e) => {
    setBlockReason(e.target.value);
    if (error) {
      setError('');
    }
  };

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
            <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Bloquer la candidature</h2>
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

          {/* Avertissement */}
          <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-300 font-medium mb-1">Action sérieuse</p>
              <p className="text-orange-200 text-sm">
                Le blocage empêche définitivement ce candidat de postuler à nouveau. Cette action est recommandée pour les candidatures frauduleuses, inappropriées ou qui violent les conditions d'utilisation.
              </p>
            </div>
          </div>

          {/* Champ pour la raison du blocage */}
          <div className="space-y-2">
            <label htmlFor="blockReason" className="block text-sm font-medium text-gray-300">
              Raison du blocage <span className="text-red-400">*</span>
            </label>
            <textarea
              id="blockReason"
              value={blockReason}
              onChange={handleReasonChange}
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 resize-none disabled:opacity-50"
              placeholder="Expliquez la raison du blocage (par exemple: contenu inapproprié, fraude, violation des conditions d'utilisation, spam, etc.)"
            />
            <div className="flex justify-between items-center text-xs">
              {error && <p className="text-red-400">{error}</p>}
              <p className="text-gray-400 ml-auto">
                {blockReason.length}/500
              </p>
            </div>
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
              disabled={isLoading || !blockReason.trim()}
              className="flex-1 order-1 sm:order-2 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-orange-500/20 hover:ring-orange-500/40"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Blocage en cours...</span>
                  <span className="sm:hidden">Blocage...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Bloquer</span>
                  <span className="sm:hidden">Bloquer</span>
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

export default BlockDialog; 