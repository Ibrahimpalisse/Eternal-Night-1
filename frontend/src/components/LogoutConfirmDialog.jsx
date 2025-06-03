import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LogOut, AlertTriangle } from 'lucide-react';

const LogoutConfirmDialog = ({ isOpen, setIsOpen, onConfirm }) => {
    const handleLogout = async () => {
        await onConfirm();
        setIsOpen(false);
    };

  return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50" 
                onClose={() => setIsOpen(false)}
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
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center mb-6">
                                    <div className="mr-4 flex-shrink-0 p-2 bg-red-500/20 rounded-full">
                                        <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white"
                                    >
                                        Confirmation de déconnexion
                                    </Dialog.Title>
          </div>
          
                                <div className="mt-2">
                                    <p className="text-sm text-white/80">
                                        Êtes-vous sûr de vouloir vous déconnecter ? Toutes les données non enregistrées seront perdues.
          </p>
                                </div>
          
                                <div className="mt-6 flex gap-3 justify-end">
            <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </button>
            <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
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