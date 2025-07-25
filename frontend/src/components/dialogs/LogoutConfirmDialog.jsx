import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LogOut, AlertTriangle } from 'lucide-react';

const LogoutConfirmDialog = ({ isOpen, setIsOpen, onClose, onConfirm }) => {
    // Compatibilité : utiliser onClose si fourni, sinon setIsOpen
    const close = onClose || (setIsOpen ? () => setIsOpen(false) : () => {});
    const handleLogout = async () => {
        await onConfirm();
        close();
    };

  return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50" 
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/20 p-8 text-left align-middle shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all hover:shadow-purple-500/10">
                                <div className="flex items-center mb-8">
                                    <div className="relative mr-4 flex-shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-400/20 rounded-full blur-lg"></div>
                                        <div className="relative p-3 bg-red-500/10 backdrop-blur-sm rounded-full border border-red-500/20">
                                            <AlertTriangle className="h-6 w-6 text-red-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl font-bold text-white leading-6"
                                        >
                                            Confirmation de déconnexion
                                        </Dialog.Title>
                                        <p className="text-sm text-white/60 mt-1">
                                            Cette action nécessite une confirmation
                                        </p>
            </div>
          </div>
          
                                <div className="mb-8">
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                                        <p className="text-white/90 leading-relaxed">
                                            Êtes-vous sûr de vouloir vous déconnecter ? Toutes les données 
                                            non enregistrées seront perdues.
          </p>
                                    </div>
                                </div>
          
                                <div className="flex gap-4 justify-end">
            <button
                                        type="button"
                                        className="group inline-flex justify-center items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-300"
              onClick={close}
            >
              Annuler
            </button>
            <button
                                        type="button"
                                        className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-medium text-white hover:from-red-500 hover:to-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        onClick={handleLogout}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        <LogOut className="w-4 h-4 mr-2 relative z-10" />
                                        <span className="relative z-10">Déconnexion</span>
            </button>
          </div>
                            </Dialog.Panel>
                        </Transition.Child>
        </div>
      </div>
            </Dialog>
        </Transition>
  );
};

export default LogoutConfirmDialog; 