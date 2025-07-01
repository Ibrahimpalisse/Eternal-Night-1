import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, Trash2, Edit, AlertTriangle, CheckCircle } from 'lucide-react';

// Modal de confirmation pour publier un roman
export const PublishConfirmationModal = ({ novel, isOpen, onClose, onConfirm }) => {
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen || !novel) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-green-500/20 rounded-xl w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Publier le roman</h2>
          </div>

          <p className="text-gray-300 mb-2 text-sm sm:text-base">
            Êtes-vous sûr de vouloir publier le roman :
          </p>
          <p className="text-white font-medium mb-4 text-sm sm:text-base break-words">"{novel.title}"</p>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6">
            <p className="text-green-300 text-xs sm:text-sm">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              <strong>Publication :</strong> Une fois publié, votre roman sera visible par tous les lecteurs. Vous pourrez toujours faire des demandes de modification via les administrateurs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={isPublishing}
              className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publication...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Publier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Modal de confirmation pour supprimer un roman
export const DeleteConfirmationModal = ({ novel, isOpen, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !novel) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-red-500/20 rounded-xl w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Supprimer le roman</h2>
          </div>

          <p className="text-gray-300 mb-2 text-sm sm:text-base">
            Êtes-vous sûr de vouloir supprimer le roman :
          </p>
          <p className="text-white font-medium mb-4 text-sm sm:text-base break-words">"{novel.title}"</p>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-300 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              <strong>Attention :</strong> Cette action est irréversible. Tous les chapitres et commentaires associés seront également supprimés.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Modal de confirmation pour modifier un roman
export const EditConfirmationModal = ({ novel, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !novel) return null;

  const handleEdit = () => {
    onConfirm();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-blue-500/20 rounded-xl w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Modifier le roman</h2>
          </div>

          <p className="text-gray-300 mb-2 text-sm sm:text-base">
            Vous allez modifier le roman :
          </p>
          <p className="text-white font-medium mb-4 text-sm sm:text-base break-words">"{novel.title}"</p>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
            <p className="text-blue-300 text-xs sm:text-sm">
              <Edit className="w-4 h-4 inline mr-2" />
              <strong>Modification :</strong> Vous allez pouvoir modifier le titre, la description, les genres et l'image de couverture de votre roman.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}; 