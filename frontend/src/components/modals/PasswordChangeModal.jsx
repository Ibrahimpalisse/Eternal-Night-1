import React, { useState, useEffect } from 'react';
import { FormValidation } from '../../utils/validation';
import Profile from '../../services/Profile';
import SecurityWarningModal from './SecurityWarningModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1); // 1: Vérification du mot de passe actuel, 2: Saisie du nouveau mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(10);
  
  // États pour afficher/cacher les mots de passe
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vérifier l'état de blocage au chargement du modal
  useEffect(() => {
    if (!isOpen) return;
    
    const securityStatus = Profile.checkSecurityBlock();
    
    if (securityStatus.blocked) {
      console.warn('Utilisateur bloqué détecté au chargement - Déconnexion immédiate');
      
      // Déclencher immédiatement la déconnexion forcée sans avertissement
      // car l'utilisateur a déjà été averti avant
      if (window.UserService && typeof window.UserService.handleForceLogout === 'function') {
        window.UserService.handleForceLogout('Session bloquée pour sécurité - Rafraîchissement détecté');
      }
    }
  }, [isOpen]);

  // Vérifier le mot de passe actuel
  const verifyCurrentPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      
      // Vérifier que le mot de passe actuel n'est pas vide
      if (!currentPassword.trim()) {
        setErrors({ currentPassword: "Le mot de passe actuel est requis" });
        setIsLoading(false);
        return;
      }
      
      // Appeler l'API pour vérifier le mot de passe
      const result = await Profile.verifyCurrentPassword(currentPassword);
      
      if (!result.success) {
        setErrors({ 
          currentPassword: "Mot de passe actuel incorrect" 
        });
        setIsLoading(false);
        return;
      }
      
      // Mot de passe correct, passer à l'étape suivante
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      // Gérer les erreurs de rate limiting avec UX progressive
      if (err.isRateLimit) {
        setIsLoading(false);
        
        // Si c'est la déconnexion forcée (suspendSession = true)
        if (err.suspendSession) {
          console.warn('Limite de sécurité atteinte - Affichage de l\'avertissement');
          setShowSecurityWarning(true);
          setWarningCountdown(10);
          return;
        }
        
        // Sinon, afficher des messages progressifs selon le nombre de tentatives
        const remaining = err.attemptsRemaining || 0;
        const current = err.currentAttempts || 0;
        
        let message = 'Mot de passe actuel incorrect';
        
        if (remaining === 2) {
          message = `Mot de passe incorrect. Plus que ${remaining} tentatives avant la déconnexion sécurisée.`;
        } else if (remaining === 1) {
          message = `⚠️ Mot de passe incorrect. DERNIÈRE tentative avant déconnexion automatique !`;
        } else if (remaining === 0) {
          message = `🚨 Limite atteinte ! Déconnexion de sécurité imminente.`;
        } else if (remaining <= 3) {
          message = `Mot de passe incorrect. ${remaining} tentatives restantes.`;
        }
        
        setErrors({ 
          currentPassword: message
        });
        return;
      }
      
      setErrors({ general: err.message || 'Une erreur est survenue' });
      setIsLoading(false);
    }
  };

  // Validation en temps réel du nouveau mot de passe
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Validation dynamique en temps réel
    if (value) {
      const validation = FormValidation.analyzePassword(value);
      if (!validation.success) {
        setErrors(prev => ({ ...prev, newPassword: validation.error }));
      } else {
        setErrors(prev => ({ ...prev, newPassword: undefined }));
      }
    } else {
      setErrors(prev => ({ ...prev, newPassword: undefined }));
    }
  };

  // Validation en temps réel de la confirmation
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Vérifier la correspondance des mots de passe
    if (value && newPassword && value !== newPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Les mots de passe ne correspondent pas" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  // Soumettre le nouveau mot de passe
  const submitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Valider les données avec le schéma de validation
      const validationResult = FormValidation.validateForm('changePassword', {
        currentPassword: currentPassword,
        password: newPassword,
        confirmPassword: confirmPassword
      });

      if (!validationResult.success) {
        setErrors(validationResult.errors);
        setIsLoading(false);
        return;
      }

      // Si la validation réussit, soumettre le formulaire
      await onSubmit(currentPassword, newPassword);
      setIsLoading(false);
      handleClose();
    } catch (err) {
      setErrors({ general: err.message || 'Une erreur est survenue' });
      setIsLoading(false);
    }
  };

  // Gérer la fin du compte à rebours de sécurité
  const handleSecurityCountdownComplete = async () => {
    console.warn('Compte à rebours terminé - Déconnexion forcée');
    
    // Déclencher la déconnexion forcée
    if (window.UserService && typeof window.UserService.handleForceLogout === 'function') {
      await window.UserService.handleForceLogout('Trop de tentatives incorrectes - Déconnexion sécurisée');
    }
  };

  // Fermer la modal et réinitialiser les états
  const handleClose = () => {
    if (showSecurityWarning) return; // Empêcher la fermeture pendant l'avertissement
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setStep(1);
    setShowSecurityWarning(false);
    
    // Réinitialiser les états des icônes d'œil
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    
    onClose();
  };

  // Si l'avertissement de sécurité est affiché, montrer seulement celui-ci
  if (showSecurityWarning) {
    return (
      <SecurityWarningModal 
        isOpen={showSecurityWarning}
        onCountdownComplete={handleSecurityCountdownComplete}
        remainingTime={warningCountdown}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900/90 backdrop-blur-xl border-white/10 text-white w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogDescription>Veuillez saisir votre ancien et nouveau mot de passe.</DialogDescription>
        </DialogHeader>
        
        <div className="p-4 sm:p-5 bg-gray-900/50 rounded-lg mb-4">
          {errors.general && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-sm text-red-500 font-semibold">{errors.general}</p>
            </div>
          )}
          
          {step === 1 ? (
            // Étape 1: Vérification du mot de passe actuel
            <form onSubmit={verifyCurrentPassword} className="space-y-4">
              <h4 className="font-medium text-white text-base sm:text-lg text-center mb-3">
                Veuillez saisir votre mot de passe actuel
              </h4>
              <p className="text-gray-300 text-sm text-center mb-4">
                Pour des raisons de sécurité, veuillez confirmer votre mot de passe actuel avant de le modifier.
              </p>
              
              <div>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mot de passe actuel"
                  className={`${errors.currentPassword ? 'border-red-500' : 'border-gray-700'} text-white`}
                  required
                  autoFocus
                />
                
                {errors.currentPassword && (
                  <p className="mt-2 text-xs text-red-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.currentPassword}
                  </p>
                )}
              </div>
              
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
                >
                  {isLoading ? 'Vérification...' : 'Vérifier'}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            // Étape 2: Saisie du nouveau mot de passe
            <form onSubmit={submitNewPassword} className="space-y-4">
              <h4 className="font-medium text-white text-base sm:text-lg text-center mb-3">
                Définir un nouveau mot de passe
              </h4>
              <p className="text-gray-300 text-sm text-center mb-4">
                Votre nouveau mot de passe doit être sécurisé.
              </p>
              
              <div className="space-y-3">
                <div>
                  <div className="relative">
                  <Input
                      type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                      onChange={handleNewPasswordChange}
                    placeholder="Nouveau mot de passe"
                      className={`${errors.newPassword ? 'border-red-500' : 'border-gray-700'} text-white pr-10`}
                    required
                    autoFocus
                  />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      )}
                    </button>
                  </div>
                  
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <div className="relative">
                  <Input
                      type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    placeholder="Confirmer le nouveau mot de passe"
                      className={`${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} text-white pr-10`}
                    required
                  />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
                >
                  {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal; 