import { 
  NovelDetailsModal,
  NovelEditModal,
  DeleteNovelModal,
  RequestModal,
  CreateNovelModal 
} from './NovelModals';

import React from 'react';

export { 
  NovelDetailsModal,
  NovelEditModal,
  DeleteNovelModal,
  RequestModal,
  CreateNovelModal 
};

export const NovelModalManager = React.forwardRef(({ 
  selectedNovel,
  showDetailsModal,
  showEditModal,
  showDeleteModal,
  showRequestModal,
  showCreateModal,
  onCloseModal,
  onSaveNovel,
  onDeleteNovel,
  onSubmitRequest,
  onPublishNovel
}, ref) => {
  return (
    <>
      <NovelDetailsModal 
        novel={selectedNovel}
        isOpen={showDetailsModal}
        onClose={() => onCloseModal('details')}
        setShowEditModal={() => onCloseModal('details', 'edit')}
        setShowDeleteModal={() => onCloseModal('details', 'delete')}
        setShowRequestModal={() => onCloseModal('details', 'request')}
        onPublish={() => onPublishNovel(selectedNovel)}
      />
      
      <NovelEditModal 
        novel={selectedNovel}
        isOpen={showEditModal}
        onClose={() => onCloseModal('edit')}
        onSave={onSaveNovel}
        onRequest={onSubmitRequest}
      />
      
      <DeleteNovelModal 
        novel={selectedNovel}
        isOpen={showDeleteModal}
        onClose={() => onCloseModal('delete')}
        onConfirm={() => onDeleteNovel(selectedNovel)}
      />
      
      <RequestModal 
        novel={selectedNovel}
        isOpen={showRequestModal}
        onClose={() => onCloseModal('request')}
        onSubmit={onSubmitRequest}
      />
      
      <CreateNovelModal 
        isOpen={showCreateModal}
        onClose={() => onCloseModal('create')}
        onSave={onSaveNovel}
      />
    </>
  );
});

NovelModalManager.displayName = 'NovelModalManager';

export { PublishConfirmationModal, DeleteConfirmationModal, EditConfirmationModal } from './ConfirmationModals';
export { ModalProvider, useModalManager, MODAL_TYPES } from './ModalManager'; 