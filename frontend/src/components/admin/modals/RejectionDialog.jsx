import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { XCircle, X, AlertTriangle } from 'lucide-react';

const RejectionDialog = ({ isOpen, onClose, application, onConfirm, isLoading }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !application) return null;

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      setError('Veuillez indiquer la raison du refus');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setError('La raison doit contenir au moins 10 caractères');
      return;
    }

    onConfirm(application, rejectionReason.trim());
  };

  const handleClose = () => {
    setRejectionReason('');
    setError('');
    onClose();
  };

  const handleReasonChange = (e) => {
    setRejectionReason(e.target.value);
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
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Rejeter la candidature</h2>
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
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-medium mb-1">Attention</p>
              <p className="text-red-200 text-sm">
                Le candidat sera informé du refus et de la raison. Soyez constructif dans votre explication.
              </p>
            </div>
          </div>

          {/* Champ pour la raison du refus */}
          <div className="space-y-2">
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-300">
              Raison du refus <span className="text-red-400">*</span>
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={handleReasonChange}
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 resize-none disabled:opacity-50"
              placeholder="Expliquez la raison du refus (par exemple: candidature incomplète, manque d'expérience, contenu inapproprié, etc.)"
            />
            <div className="flex justify-between items-center text-xs">
              {error && <p className="text-red-400">{error}</p>}
              <p className="text-gray-400 ml-auto">
                {rejectionReason.length}/500
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
              disabled={isLoading || !rejectionReason.trim()}
              className="flex-1 order-1 sm:order-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-red-500/20 hover:ring-red-500/40"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Refus en cours...</span>
                  <span className="sm:hidden">Refus...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Confirmer le refus</span>
                  <span className="sm:hidden">Refuser</span>
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

export default RejectionDialog; 