import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';

const DeletePostModal = ({ isOpen, onClose, post, onConfirm }) => {
  if (!isOpen || !post) return null;

  return createPortal(
    <div className="modal-overlay bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-md">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Supprimer le post</h3>
          <p className="text-gray-400 mb-6">
            Êtes-vous sûr de vouloir supprimer le post "{post.title}" ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeletePostModal; 