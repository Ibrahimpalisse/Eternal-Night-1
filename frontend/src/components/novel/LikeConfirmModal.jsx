import React from 'react';

export default function LikeConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
        <button
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center text-2xl text-white font-bold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:ring-offset-2 focus:ring-offset-slate-900 hover:bg-white/10 hover:text-purple-300"
          onClick={onCancel}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-white mb-4 text-center">Confirmer le like</h2>
        <p className="text-gray-300 text-center mb-6">Êtes-vous sûr de vouloir liker ce roman ?<br/>Vous recevrez des annonces de l’auteur concernant ce roman.</p>
        <div className="flex gap-4 justify-center">
          <button
            className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
            onClick={onConfirm}
          >
            Oui, liker
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-slate-700 text-gray-300 font-semibold hover:bg-slate-600 transition-all"
            onClick={onCancel}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
} 