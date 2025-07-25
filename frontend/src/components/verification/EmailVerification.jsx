import React, { useState, useEffect, useRef } from 'react';
import SendVerificationEmail from './SendVerificationEmail';
import VerificationCode from './VerificationCode';
import UserService from '../../services/user/index';
import { useToast } from '../../contexts/ToastContext';
import CloseButton from '../ui/CloseButton';

const EmailVerification = ({ 
  email = '', 
  onVerificationSuccess, 
  onCancel, 
  onResendCode,
  showSendEmailForm = true,
  showCloseButton = true
}) => {
  const [currentEmail, setCurrentEmail] = useState(email);
  const [step, setStep] = useState(showSendEmailForm ? 'send-email' : 'enter-code');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const toast = useToast();
  
  // Instancier UserService
  const userService = new UserService();
  
  // Ref pour vérifier si le composant est monté
  const isMountedRef = useRef(true);
  
  // Cleanup au démontage
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;
    
    // Si un email est fourni, passer directement à l'étape du code
    if (email && showSendEmailForm === false) {
      setStep('enter-code');
    }
  }, [email, showSendEmailForm]);

  // Fonction appelée lorsque l'email est envoyé avec succès
  const handleEmailSent = (sentEmail) => {
    if (!isMountedRef.current) return;
    
    setCurrentEmail(sentEmail);
    setStep('enter-code');
    
    if (toast && isMountedRef.current) {
    toast.info(`Un code de vérification a été envoyé à ${sentEmail}`);
    }
  };

  // Fonction pour gérer le changement de code
  const handleCodeChange = (newCode) => {
    console.log('EmailVerification - Code change received:', newCode);
    setVerificationCode(newCode);
    setCodeError('');
  };

  // Fonction pour gérer la soumission du code
  const handleSubmitCode = async () => {
    console.log('handleSubmitCode - Function called!');
    console.log('handleSubmitCode - verificationCode:', verificationCode);
    
    // Convertir le tableau de code en chaîne
    const codeString = verificationCode.join('');
    console.log('handleSubmitCode - codeString:', codeString);
    
    // Vérifier que le code est complet
    if (codeString.length !== 6) {
      console.log('handleSubmitCode - Code incomplete, length:', codeString.length);
      setCodeError("Veuillez entrer le code complet à 6 chiffres");
      return;
    }
    
    console.log('handleSubmitCode - Starting verification...');
    setIsSubmittingCode(true);
    setCodeError('');
    
    try {
      console.log('handleSubmitCode - Calling User.verifyEmail with:', currentEmail, codeString);
      const result = await userService.verifyEmail(currentEmail, codeString);
      
      console.log('handleSubmitCode - API result:', result);
      
      // Ne pas traiter les erreurs silencieuses (généralement rate limit)
      if (result && result.silent) {
        console.log('handleSubmitCode - Silent error, stopping');
        setIsSubmittingCode(false);
        return;
      }
      
      if (result.success) {
        console.log('handleSubmitCode - Success!');
        // Pas de toast ici - le parent se charge d'afficher le toast détaillé
        
        if (onVerificationSuccess) {
          // Petit délai pour éviter les conflicts DOM
          setTimeout(() => {
            onVerificationSuccess(currentEmail);
          }, 50);
        }
      } else {
        console.log('handleSubmitCode - Verification failed:', result.message);
        setCodeError(result.message || "Code de vérification invalide");
        if (toast) {
          toast.error("Échec de la vérification");
        }
      }
    } catch (error) {
      console.log('handleSubmitCode - Error caught:', error);
      setCodeError(error.message || "Une erreur est survenue lors de la vérification");
      if (toast) {
        toast.error(error.message || "Échec de la vérification");
      }
    } finally {
      console.log('handleSubmitCode - Finally block, setting isSubmittingCode to false');
      setIsSubmittingCode(false);
    }
  };

  // Fonction pour renvoyer le code
  const handleResendCode = async () => {
    console.log('handleResendCode - Function called!');
    console.log('handleResendCode - currentEmail:', currentEmail);
    console.log('handleResendCode - isMountedRef.current:', isMountedRef.current);
    
    try {
      console.log('handleResendCode - Starting resend process...');
      
      // Si une fonction de rappel personnalisée est fournie, l'utiliser
      if (onResendCode) {
        console.log('handleResendCode - Using custom onResendCode callback');
        const result = await onResendCode();
        console.log('handleResendCode - Custom callback result:', result);
        // Ne pas traiter les erreurs silencieuses
        if (result && result.silent) {
          console.log('handleResendCode - Silent error from custom callback');
          return;
        }
      } else {
        console.log('handleResendCode - Using default User.resendVerification');
        // Sinon, utiliser le comportement par défaut
        const result = await userService.resendVerification(currentEmail);
        console.log('handleResendCode - Default resend result:', result);
        // Ne pas traiter les erreurs silencieuses
        if (result && result.silent) {
          console.log('handleResendCode - Silent error from default method');
          return;
        }
        
        if (toast) {
          console.log('handleResendCode - Showing success toast');
          toast.info(`Un nouveau code de vérification a été envoyé à ${currentEmail}`);
        }
      }
    } catch (error) {
      console.log('handleResendCode - Error caught:', error);
      if (toast) {
        console.log('handleResendCode - Showing error toast');
        toast.error(error.message || "Échec de l'envoi du nouveau code");
      }
    }
  };

  // Fonction pour revenir à l'étape d'envoi d'email
  const handleBackToEmail = () => {
    if (!isMountedRef.current) return;
    
    setStep('send-email');
  };

  // Fonction pour annuler le processus
  const handleCancel = () => {
    if (!isMountedRef.current) return;
    
    if (onCancel) {
      // Petit délai pour éviter les conflicts DOM
      setTimeout(() => {
        if (isMountedRef.current) {
      onCancel();
        }
      }, 50);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        {showCloseButton && onCancel && (
          <CloseButton
            variant="ghost"
            size="md"
            onClick={handleCancel}
            className="absolute top-1 right-4 z-10"
            ariaLabel="Fermer la vérification"
          />
        )}
        
        {step === 'send-email' ? (
          <SendVerificationEmail 
            initialEmail={currentEmail} 
            onEmailSent={handleEmailSent} 
          />
        ) : (
          <div className="w-full max-w-md px-2 sm:px-4 animate-fade-in-up">
            <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Vérifiez votre email</h3>
                <p className="text-gray-300 mb-2">
                  Un code de vérification a été envoyé à 
                </p>
                <p className="font-medium text-purple-300 mb-3 break-all">
                  {currentEmail}
                </p>
                <p className="text-sm text-gray-400">
                  Veuillez entrer le code pour confirmer votre compte
                </p>
              </div>
              
              {codeError && (
                <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30 max-w-xs mx-auto">
                  <p className="text-sm text-red-500 font-semibold text-center">{codeError}</p>
                </div>
              )}
              
              <div className="my-4 max-w-xs mx-auto">
                <VerificationCode
                  code={verificationCode}
                  onChange={handleCodeChange}
                  onComplete={handleSubmitCode}
                />
              </div>
              
              <div className="space-y-4 mt-6 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={handleSubmitCode}
                  disabled={isSubmittingCode || verificationCode.some(digit => digit === '')}
                  className="group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  onMouseEnter={() => {
                    console.log('Button state - isSubmittingCode:', isSubmittingCode);
                    console.log('Button state - verificationCode:', verificationCode);
                    console.log('Button state - hasEmptyDigits:', verificationCode.some(digit => digit === ''));
                    console.log('Button state - disabled:', isSubmittingCode || verificationCode.some(digit => digit === ''));
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10 flex items-center">
                    {isSubmittingCode ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Vérification...
                      </>
                    ) : (
                      'Vérifier le code'
                    )}
                  </span>
                </button>
                
                <div className="flex flex-wrap justify-between gap-2">
                  {showSendEmailForm && (
                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors duration-200 hover:underline"
                    >
                      Changer d'email
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline ml-auto"
                  >
                    Renvoyer le code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 