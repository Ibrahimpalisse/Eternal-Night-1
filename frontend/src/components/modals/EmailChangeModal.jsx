import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import User from '../../services/User';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { FormValidation } from '../../utils/validation';

const EmailChangeModal = ({ isOpen, onClose, email, onSuccess, onResend }) => {
  const [verificationDigits, setVerificationDigits] = useState(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes
  const timerRef = useRef(null);
  const toast = useToast();
  
  // Démarrer le compte à rebours
  useEffect(() => {
    if (isOpen) {
      setRemainingTime(300);
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, onClose]);
  
  // Gérer la soumission du formulaire de vérification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const code = verificationDigits.join('');
      
      // Valider avec Zod
      const codeValidation = FormValidation.verificationCodeSchema.safeParse(code);
      
      if (!codeValidation.success) {
        setVerificationError(codeValidation.error.errors[0]?.message || 'Code de vérification invalide');
        setIsLoading(false);
        return;
      }
      
      await onSuccess(code);
    } catch (err) {
      setVerificationError(err.message || 'Code de vérification invalide');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer le changement de chiffre dans le code
  const handleDigitChange = (index, value) => {
    // Valider chaque digit avec Zod
    const digitValidation = FormValidation.digitSchema.safeParse(value);
    
    if (value === '' || digitValidation.success) {
      const newDigits = [...verificationDigits];
      newDigits[index] = value;
      setVerificationDigits(newDigits);
      
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`email-digit-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
      
      // Valider le code complet quand tous les champs sont remplis
      if (newDigits.every(digit => digit !== '')) {
        const fullCode = newDigits.join('');
        const fullCodeValidation = FormValidation.verificationCodeSchema.safeParse(fullCode);
        
        if (fullCodeValidation.success) {
          setTimeout(() => {
            const form = document.getElementById('email-verification-form');
            if (form) form.requestSubmit();
          }, 300);
        }
      }
      
      if (verificationError) setVerificationError('');
    }
  };
  
  // Gérer le collage du code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Valider le code collé avec Zod
    const pasteValidation = FormValidation.verificationCodeSchema.safeParse(pastedData);
    
    if (pasteValidation.success) {
      const newDigits = pastedData.split('');
      setVerificationDigits(newDigits);
      
      const lastInput = document.getElementById('email-digit-5');
      if (lastInput) lastInput.focus();
      
      setVerificationError('');
      
      setTimeout(() => {
        const form = document.getElementById('email-verification-form');
        if (form) form.requestSubmit();
      }, 500);
    } else {
      setVerificationError('Format de code invalide');
    }
  };
  
  // Gérer la navigation avec les touches
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && verificationDigits[index] === '' && index > 0) {
      const prevInput = document.getElementById(`email-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`email-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`email-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  
  // Formater le temps restant
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Fermer et réinitialiser
  const handleClose = () => {
    setVerificationDigits(['', '', '', '', '', '']);
    setVerificationError('');
    setIsLoading(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900/90 backdrop-blur-xl border-white/10 text-white w-full max-w-md">
        <DialogHeader className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/20 mb-4 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <DialogTitle className="text-xl font-bold text-white mb-2">
            Changement d'email
          </DialogTitle>
          
          <DialogDescription className="text-gray-300 text-sm mb-2">
            Un code de vérification a été envoyé à 
          </DialogDescription>
          
          <p className="font-medium text-purple-300 mb-3 break-all text-sm sm:text-base">
            {email}
          </p>
          
          <p className="text-sm text-gray-400">
            Veuillez entrer le code pour confirmer votre nouvelle adresse email
          </p>
        </DialogHeader>
        
        <div className="p-4 sm:p-5 bg-gray-900/50 rounded-lg mb-4">
          <form id="email-verification-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center gap-2 sm:gap-3">
              {verificationDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`email-digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-12 sm:w-11 sm:h-14 text-center text-lg font-semibold border border-white/10 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white shadow-lg"
                  required
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            {verificationError && (
              <p className="text-red-500 text-sm text-center">{verificationError}</p>
            )}
            
            <p className="text-gray-400 text-sm text-center">
              Le code expire dans <span className="text-purple-400 font-medium">{formatTime(remainingTime)}</span>
            </p>
            
            {/* Les boutons sont déplacés dans le DialogFooter */}
          </form>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-center pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onResend}
            disabled={isLoading}
            className="text-purple-400 hover:text-purple-300 text-sm w-full sm:max-w-[160px] mb-2 sm:mb-0"
          >
            {isLoading ? 'Envoi...' : 'Renvoyer le code'}
          </Button>
          
          <Button
            type="submit"
            form="email-verification-form"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
          >
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailChangeModal; 