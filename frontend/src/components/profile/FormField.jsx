import React, { useState } from 'react';
import { FormValidation } from '../../utils/validation';
import { useToast } from '../../components/common/Toast';
import User from '../../services/User';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../utils/cn';
import PasswordChangeModal from '../modals/PasswordChangeModal';
import EmailChangeModal from '../modals/EmailChangeModal';
import AvatarChangeModal from '../modals/AvatarChangeModal';

// Icônes pour les différents types de champs
const FieldIcons = {
  username: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  password: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  avatar: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  preferences: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

const FormField = ({ label, type, defaultValue, onSave, description, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  // États pour les modals
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Valider la saisie selon le type de champ
  const validateField = (type, value) => {
    switch (type) {
      case 'email':
        const emailValidation = FormValidation.validateField('email', value);
        return emailValidation.success ? null : emailValidation.error;
      case 'text': // Pour le nom d'utilisateur
      case 'username': // Alias pour être plus explicite
        const usernameValidation = FormValidation.validateField('username', value);
        return usernameValidation.success ? null : usernameValidation.error;
      case 'password':
        const passwordValidation = FormValidation.validateField('password', value);
        return passwordValidation.success ? null : passwordValidation.error;
    }
    return null;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Valider la saisie immédiatement
    const validationError = validateField(type, newValue);
    setError(validationError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Valider le champ avant soumission
    const validationError = validateField(type, value);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }
    
    if (type === 'email') {
      try {
        if (value === defaultValue) {
          setError('Le nouvel email est identique à votre email actuel');
          setIsLoading(false);
          return;
        }
        
        // Vérifier la disponibilité de l'email puis envoyer le code de vérification
        const checkResult = await User.checkEmailAvailability(value);
        
        if (!checkResult.available) {
          setError('Cette adresse email est déjà utilisée par un autre compte');
          setIsLoading(false);
          return;
        }
        
        // Demander le code de vérification
        const result = await User.updateEmail(value);
        
        if (result.success) {
          toast.success('Code de vérification envoyé');
          setIsEmailModalOpen(true);
          setError('');
        } else {
          setError(result.message || 'Erreur lors de l\'envoi du code');
        }
      } catch (err) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Pour le mot de passe, on ouvre une modal dédiée
    if (type === 'password') {
      setIsPasswordModalOpen(true);
      setIsLoading(false);
      return;
    }
    
    // Pour les autres types de champs
    try {
      await onSave(value);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour gérer la mise à jour du mot de passe via la modal
  const handlePasswordUpdate = async (currentPassword, newPassword) => {
    try {
      const result = await User.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword // Ajouter la confirmation pour la validation backend
      });

      if (result.success) {
        toast.success('Mot de passe mis à jour avec succès');
        
        // Si une déconnexion est recommandée, proposer de déconnecter toutes les sessions
        if (result.logoutRequired) {
          toast.info('Pour votre sécurité, nous recommandons de vous reconnecter sur tous vos appareils.');
        }
        
        return result;
      } else {
        throw new Error(result.message || 'Une erreur est survenue');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };
  
  // Nouvelle fonction pour gérer la vérification du code de changement d'email
  const handleEmailCodeVerification = async (code) => {
    try {
      const result = await User.verifyEmailChange(code);
      
      if (result.success && result.email) {
        // Fermer la modal et le formulaire
        setIsEmailModalOpen(false);
        setIsEditing(false);
        
        // Appeler la fonction onSave pour mettre à jour le state parent
        await onSave(result.email);
        
        toast.success('Email mis à jour avec succès');
        return result;
      } else {
        throw new Error(result.message || 'Code de vérification invalide');
      }
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la vérification');
      throw err;
    }
  };
  
  // Fonction pour renvoyer le code de changement d'email
  const handleResendEmailCode = async () => {
    try {
      const result = await User.updateEmail(value);
      
      if (result.success) {
        toast.success('Nouveau code envoyé');
        return result;
      } else {
        throw new Error(result.message || 'Erreur lors du renvoi du code');
      }
    } catch (err) {
      toast.error(err.message || 'Erreur lors du renvoi du code');
      throw err;
    }
  };

  // Fonction pour gérer l'affichage des valeurs par défaut
  const renderDefaultValue = () => {
    if (type === 'password') {
      return '••••••••';
    }
    
    // Si la valeur par défaut est un élément React, on le retourne tel quel
    if (typeof defaultValue === 'object') {
      return defaultValue;
    }
    
    // Pour le type avatar, afficher l'image ou une icône par défaut
    if (type === 'avatar') {
      return (
        <div className="flex items-center space-x-3">
          {defaultValue ? (
            <>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
                <img 
                  src={defaultValue} 
                  alt="Avatar actuel" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold hidden">
                  U
                </div>
              </div>
              <span className="text-gray-300 text-base sm:text-lg">Avatar actuel configuré</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-gray-300 text-base sm:text-lg">Aucun avatar configuré</span>
            </>
          )}
        </div>
      );
    }
    
    // Sinon, on retourne la valeur sous forme de texte
    return defaultValue;
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(defaultValue);
    setError('');
  };

  return (
    <>
      <div className={cn(
        "bg-gray-900/50 rounded-lg border border-white/10 p-4 sm:p-6 transition-all duration-300 hover:border-purple-500/50",
        className
      )}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
              {FieldIcons[type] || FieldIcons.preferences}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{label}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
          
          {onSave && !isEditing && type !== 'password' && type !== 'avatar' && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
            >
              Modifier
            </Button>
          )}
          
          {type === 'password' && !isEditing && (
            <Button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
            >
              Modifier
            </Button>
          )}
          
          {type === 'avatar' && !isEditing && (
            <Button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
            >
              {defaultValue ? 'Modifier' : 'Ajouter'}
            </Button>
          )}
          
          {isEditing && (
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:max-w-[160px]"
            >
              Annuler
            </Button>
          )}
        </div>

        {/* Password field will always show a button to modify */}
        {!isEditing ? (
          <div className="text-gray-300 text-base sm:text-lg">
            {renderDefaultValue()}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'password' ? (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm sm:text-base">
                  Pour modifier votre mot de passe, cliquez sur le bouton ci-dessous.
                </p>
                {/* Le bouton est maintenant géré dans l'en-tête du FormField */}
              </div>
            ) : type === 'avatar' ? (
              <div className="text-gray-300 text-sm sm:text-base">
                L'avatar est géré via une modal dédiée.
              </div>
            ) : (
              <Input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={`Nouveau ${label.toLowerCase()}`}
                className="text-white"
                required
              />
            )}
            
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            
            <div className="flex justify-end">
              {type !== 'password' && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
                >
                  {isLoading ? 'Chargement...' : 'Mettre à jour'}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
      
      {/* Modal de vérification d'email pour changement */}
      <EmailChangeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        email={value}
        onSuccess={handleEmailCodeVerification}
        onResend={handleResendEmailCode}
      />
      
      {/* Modal de changement de mot de passe */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordUpdate}
      />
      
      {/* Modal de changement d'avatar */}
      <AvatarChangeModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={defaultValue}
        onSubmit={onSave}
      />
    </>
  );
};

export default FormField; 