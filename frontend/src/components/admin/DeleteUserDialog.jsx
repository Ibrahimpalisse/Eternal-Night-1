import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trash2, AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';

const DeleteUserDialog = ({ isOpen, setIsOpen, user, onConfirm }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!password.trim()) {
            setError('Le mot de passe est requis');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            await onConfirm(user, password);
            setIsOpen(false);
            setPassword('');
        } catch (err) {
            setError(err.message || 'Erreur lors de la suppression');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setPassword('');
        setError('');
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50" 
                onClose={handleClose}
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
                    <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md mx-3 sm:mx-0 transform overflow-hidden rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/20 p-4 sm:p-6 md:p-8 text-left align-middle shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all hover:shadow-red-500/10">
                                <div className="flex items-center mb-6 sm:mb-8">
                                    <div className="relative mr-3 sm:mr-4 flex-shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-400/20 rounded-full blur-lg"></div>
                                        <div className="relative p-2 sm:p-3 bg-red-500/10 backdrop-blur-sm rounded-full border border-red-500/20">
                                            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg sm:text-xl font-bold text-white leading-6"
                                        >
                                            Suppression d'utilisateur
                                        </Dialog.Title>
                                        <p className="text-xs sm:text-sm text-white/60 mt-1">
                                            Cette action est irréversible
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mb-4 sm:mb-6">
                                    <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10">
                                        <p className="text-white/90 leading-relaxed mb-2 sm:mb-3 text-sm sm:text-base">
                                            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                                            <span className="font-semibold text-white">{user?.name}</span> ?
                                        </p>
                                        <p className="text-red-400 text-xs sm:text-sm">
                                            ⚠️ Cette action supprimera définitivement toutes les données de l'utilisateur.
                                        </p>
                                    </div>
                                </div>

                                {/* Champ mot de passe */}
                                <div className="mb-4 sm:mb-6">
                                    <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3">
                                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                                        Confirmez avec votre mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Entrez votre mot de passe"
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 text-sm sm:text-base"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                            ) : (
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {error && (
                                        <p className="mt-2 text-xs sm:text-sm text-red-400">{error}</p>
                                    )}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                                    <button
                                        type="button"
                                        className="group inline-flex justify-center items-center rounded-xl border border-white/20 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-300 order-2 sm:order-1"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white hover:from-red-500 hover:to-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none order-1 sm:order-2"
                                        onClick={handleDelete}
                                        disabled={isLoading || !password.trim()}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        {isLoading ? (
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                                        ) : (
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 relative z-10" />
                                        )}
                                        <span className="relative z-10">
                                            {isLoading ? 'Suppression...' : 'Supprimer'}
                                        </span>
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

export default DeleteUserDialog; 