export { NovelDetailsModal } from './NovelModals';
export { NovelEditModal } from './NovelModals';
export { DeleteNovelModal } from './NovelModals';
export { RequestModal } from './NovelModals';
export { CreateNovelModal } from './NovelModals';

export const NovelModalManager = {
  NovelDetailsModal,
  NovelEditModal,
  DeleteNovelModal,
  RequestModal,
  CreateNovelModal
};

export { PublishConfirmationModal, DeleteConfirmationModal, EditConfirmationModal } from './ConfirmationModals';
export { ModalProvider, useModalManager, MODAL_TYPES } from './ModalManager'; 