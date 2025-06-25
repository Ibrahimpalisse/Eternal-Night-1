import React, { useState, useEffect } from 'react';
import { Mail, AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import User from '../services/User';
import { useToast } from '../contexts/ToastContext';
import EmailVerification from './EmailVerification';

const EmailVerificationDialog = ({ 
  isOpen, 
  onClose, 
  email, 
  onVerificationSent,
  onVerificationSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const toast = useToast();

  // Réinitialiser l'état quand le dialog se ferme/s'ouvre
  useEffect(() => {
    if (!isOpen) {
      setShowVerificationForm(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleVerifyEmail = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await User.resendVerification(email);
      
      if (result && result.success) {
        toast.success("Code de vérification envoyé avec succès !");
        
        // Appeler le callback si fourni
        if (onVerificationSent) {
          onVerificationSent(email);
        }
        
        // Ne pas fermer le dialog ici - laisser le parent gérer l'état
        // onClose() sera appelé par le parent quand approprié
      } else {
        const errorMessage = result?.message || "Erreur lors de l'envoi du code";
        toast.error(errorMessage);
      }
    } catch (error) {
      // Ne pas logger en production pour éviter le spam dans la console
      const errorMessage = error.message || "Une erreur est survenue";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowVerificationForm(false);
    setIsLoading(false);
    onClose();
  };

  const handleVerificationSuccess = (verifiedEmail) => {
    setShowVerificationForm(false);
    setIsLoading(false);
    
    if (onVerificationSuccess) {
      onVerificationSuccess(verifiedEmail);
    }
    
    // Fermer le dialog après un petit délai pour éviter les conflits DOM
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleVerificationCancel = () => {
    setShowVerificationForm(false);
    // Rester dans le dialog principal au lieu de fermer complètement
  };

  // Ne pas rendre le composant si pas ouvert
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel} modal={true}>
      <DialogContent 
        className={`${showVerificationForm ? 'max-w-sm sm:max-w-lg' : 'max-w-sm sm:max-w-md'} bg-black/95 backdrop-blur-xl border-white/10 text-white`}
      >
        {!showVerificationForm ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-yellow-500/20">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                Vérification d'email requise
              </DialogTitle>
              <DialogDescription className="text-gray-300 mt-2 text-sm sm:text-base">
                Votre adresse email{' '}
                <span className="font-medium text-yellow-300 break-all">{email}</span>{' '}
                n'a pas encore été vérifiée. Vous devez vérifier votre email avant de pouvoir vous connecter.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-center py-3 sm:py-4">
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="text-xs sm:text-sm text-gray-300">
                  <p className="font-medium">Que va-t-il se passer ?</p>
                  <p className="text-xs sm:text-sm">Un code de vérification sera envoyé à votre email</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white text-sm sm:text-base"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleVerifyEmail}
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="hidden sm:inline">Envoi en cours...</span>
                    <span className="sm:hidden">Envoi...</span>
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Vérifier maintenant</span>
                    <span className="sm:hidden">Vérifier</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-2">
            <EmailVerification
              email={email}
              onVerificationSuccess={handleVerificationSuccess}
              onCancel={handleVerificationCancel}
              showSendEmailForm={false}
              showCloseButton={false}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationDialog; 