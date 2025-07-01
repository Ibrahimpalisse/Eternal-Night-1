import React, { useState } from 'react';
import { 
  NovelDetailsModal, 
  NovelEditModal, 
  RequestModal, 
  CreateNovelModal 
} from './NovelModals';
import { 
  PublishConfirmationModal, 
  DeleteConfirmationModal 
} from './ConfirmationModals';

// Gestionnaire de modales avec système de pile
export const NovelModalManager = React.forwardRef(({ 
  onSaveNovel, 
  onPublishNovel, 
  onDeleteNovel, 
  onCreateNovel,
  onSubmitRequest 
}, ref) => {
  const [modalStack, setModalStack] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);

  // Exposer les méthodes via ref
  React.useImperativeHandle(ref, () => ({
    openModal: (modalType, novel = null) => {
      openModal(modalType, novel);
    },
    closeModal: () => {
      closeModal();
    },
    closeAllModals: () => {
      closeAllModals();
    }
  }));

  const closeModal = () => {
    setModalStack(prev => {
      const newStack = prev.slice(0, -1);
      if (newStack.length === 0) {
        setSelectedNovel(null);
      }
      return newStack;
    });
  };

  const closeAllModals = () => {
    setModalStack([]);
    setSelectedNovel(null);
  };

  const openModal = (modalType, novel = null) => {
    console.log('📝 OpenModal called:', modalType, novel ? novel.title : 'no novel');
    // Si on passe un novel, on l'utilise, sinon on garde le selectedNovel actuel
    if (novel !== null) {
      setSelectedNovel(novel);
    }
    setModalStack(prev => {
      const newStack = [...prev, modalType];
      console.log('📚 Modal stack:', newStack);
      return newStack;
    });
  };

  // Handlers pour les actions
  const handlePublishConfirm = async () => {
    await onPublishNovel(selectedNovel);
    closeAllModals();
  };

  const handleDeleteConfirm = async () => {
    await onDeleteNovel(selectedNovel);
    closeAllModals();
  };



  const handleSaveEdit = async (formData, novelId, selectedImage) => {
    await onSaveNovel(formData, novelId, selectedImage);
    closeAllModals();
  };

  const handleSubmitRequestModal = async (requestType) => {
    await onSubmitRequest(selectedNovel, requestType);
    closeAllModals();
  };

  const handleCreateNovel = async (formData) => {
    await onCreateNovel(formData);
    closeAllModals();
  };

  // Actions depuis les détails
  const handlePublishAction = () => {
    console.log('🟢 Publish action clicked');
    openModal('PUBLISH_CONFIRMATION');
  };
  const handleDeleteAction = () => {
    console.log('🔴 Delete action clicked');
    openModal('DELETE_CONFIRMATION');
  };
  const handleEditAction = () => {
    console.log('🔵 Edit action clicked');
    openModal('EDIT');
  };
  const handleRequestAction = () => {
    console.log('🟣 Request action clicked');
    openModal('REQUEST');
  };

  const currentModal = modalStack[modalStack.length - 1] || null;
  console.log('🔍 Current modal:', currentModal, 'Selected novel:', selectedNovel ? selectedNovel.title : 'none');

  return (
    <>
      <NovelDetailsModal
        novel={selectedNovel}
        isOpen={currentModal === 'DETAILS'}
        onClose={closeModal}
        setShowEditModal={handleEditAction}
        setShowDeleteModal={handleDeleteAction}
        setShowRequestModal={handleRequestAction}
        onPublish={handlePublishAction}
      />

      <CreateNovelModal
        isOpen={currentModal === 'CREATE'}
        onClose={closeModal}
        onSave={handleCreateNovel}
      />

      <NovelEditModal
        novel={selectedNovel}
        isOpen={currentModal === 'EDIT'}
        onClose={closeModal}
        onSave={handleSaveEdit}
      />

      <RequestModal
        novel={selectedNovel}
        isOpen={currentModal === 'REQUEST'}
        onClose={closeModal}
        onSubmit={handleSubmitRequestModal}
      />

      <PublishConfirmationModal
        novel={selectedNovel}
        isOpen={currentModal === 'PUBLISH_CONFIRMATION'}
        onClose={closeModal}
        onConfirm={handlePublishConfirm}
      />

      <DeleteConfirmationModal
        novel={selectedNovel}
        isOpen={currentModal === 'DELETE_CONFIRMATION'}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
      />


    </>
  );
}); 