import React, { useState, useEffect } from 'react';
import { FormValidation } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import User from '../../services/User';
import { securityStorage } from '../../utils/securityStorage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import SecurityAlertModal from './SecurityAlertModal';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1); // 1: Vérification du mot de passe actuel, 2: Saisie du nouveau mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0); // Compteur de tentatives
  const maxAttempts = 4; // Nombre maximum de tentatives
  const { logout } = useAuth(); // Hook d'authentification
  const navigate = useNavigate(); // Hook de navigation
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const toast = useToast();

  // Vérifier si l'utilisateur est en processus de déconnexion forcée au chargement du composant
  useEffect(() => {
    const forcedLogout = securityStorage.getItem('security_forced_logout');
    if (forcedLogout === 'true') {
      setShowSecurityAlert(true);
      // S'assurer que la déconnexion se termine après 3 secondes
      setTimeout(() => {
        securityStorage.clear();
        window.location.replace('/auth/login');
      }, 3000);
    }
  }, []);

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
      const result = await User.checkPassword(currentPassword);
      
      if (!result.valid) {
        // Incrémenter le compteur de tentatives
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        
        // Vérifier si le nombre maximum de tentatives est atteint
        if (newAttemptCount >= maxAttempts) {
          // Marquer l'état de déconnexion forcée dans localStorage avec expiration de 2 minutes
          securityStorage.setItem('security_forced_logout', 'true', 2);
          
          // Afficher l'alerte de sécurité
          setShowSecurityAlert(true);
          setIsLoading(false);
          
          // Désactiver les interactions avec le reste de l'interface
          document.body.style.pointerEvents = 'none';
          
          // Restaurer les interactions uniquement pour notre modal d'alerte
          setTimeout(() => {
            const alertModal = document.querySelector('.security-alert-modal');
            if (alertModal) {
              alertModal.style.pointerEvents = 'auto';
            }
          }, 100);
          
          // Attendre que l'animation soit terminée avant de déconnecter
          setTimeout(() => {
            // Nettoyer le localStorage et rediriger
            securityStorage.clear();
            window.location.replace('/auth/login');
          }, 3000);
          return;
        }
        
        setErrors({ 
          currentPassword: `Mot de passe actuel incorrect (tentative ${newAttemptCount}/${maxAttempts})` 
        });
        setIsLoading(false);
        return;
      }
      
      // Réinitialiser le compteur en cas de succès
      setAttemptCount(0);
      
      // Mot de passe correct, passer à l'étape suivante
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      setErrors({ general: err.message || 'Une erreur est survenue' });
      setIsLoading(false);
    }
  };

  // Soumettre le nouveau mot de passe
  const submitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Valider les données avec le schéma de validation
      const validationResult = FormValidation.validateForm('resetPassword', {
        password: newPassword,
        confirmPassword: confirmPassword
      });

      if (!validationResult.success) {
        setErrors(validationResult.errors);
        setIsLoading(false);
        return;
      }

      // Vérifier que le nouveau mot de passe est différent de l'ancien
      if (newPassword === currentPassword) {
        setErrors({ newPassword: "Le nouveau mot de passe doit être différent de l'ancien" });
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

  // Fermer la modal et réinitialiser les états
  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setStep(1);
    setAttemptCount(0); // Réinitialiser le compteur de tentatives
    onClose();
  };

  // Si l'alerte de sécurité est affichée, ne montrer que cette alerte
  if (showSecurityAlert) {
    return (
      <SecurityAlertModal 
        isOpen={true}
        message="Trop de tentatives échouées. Pour votre sécurité, vous allez être déconnecté."
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900/90 backdrop-blur-xl border-white/10 text-white w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
            {step === 1 ? 'Vérification du mot de passe' : 'Modification du mot de passe'}
          </DialogTitle>
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
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    className={`${errors.password ? 'border-red-500' : 'border-gray-700'} text-white`}
                    required
                    autoFocus
                  />
                  
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
                  </p>
                </div>
                
                <div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le nouveau mot de passe"
                    className={`${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} text-white`}
                    required
                  />
                  
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