import React, { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import User from '../services/User';
import { securityStorage } from '../utils/securityStorage';
import FormField from './profile/FormField';

const ProfileSettings = ({ user, setUser }) => {
  const toast = useToast();

  // Vérifier si l'utilisateur est en processus de déconnexion forcée au chargement du composant
  useEffect(() => {
    const forcedLogout = securityStorage.getItem('security_forced_logout');
    if (forcedLogout === 'true') {
      // Rediriger immédiatement vers la page de login
      securityStorage.clear();
      window.location.replace('/auth/login');
    }
  }, []);

  // Fonction pour gérer la mise à jour du nom d'utilisateur
  const handleUsernameUpdate = async (newUsername) => {
    try {
      const result = await User.updateUsername(newUsername);

      if (result.success) {
        // Mise à jour directe de l'utilisateur
        setUser(prev => ({ ...prev, username: newUsername }));
        toast.success('Nom d\'utilisateur mis à jour avec succès');
        return result;
      } else {
        throw new Error(result.message || 'Une erreur est survenue');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Fonction pour gérer la mise à jour de l'email
  const handleEmailUpdate = async (newEmail) => {
    try {
      // Appliquer directement la mise à jour de l'email
      setUser(prev => ({ ...prev, email: newEmail }));
      return true;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleAvatarUpdate = async (newAvatarUrl) => {
    try {
      // This is a placeholder for actual API call to update avatar
      console.log('Updating avatar to:', newAvatarUrl);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setUser(prev => ({ ...prev, avatar: newAvatarUrl, profile: { ...prev.profile, avatar_path: newAvatarUrl } }));
      toast.success('Avatar mis à jour avec succès');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'avatar');
      throw error;
    }
  };

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <FormField
          label="Nom d'utilisateur"
          type="username"
          defaultValue={user?.username || ''}
          onSave={handleUsernameUpdate}
          description="Modifiez votre nom d'utilisateur public"
        />

        <FormField
          label="Email"
          type="email"
          defaultValue={user?.email || ''}
          onSave={handleEmailUpdate}
          description="Modifiez votre adresse email"
        />

        <FormField
          label="Mot de passe"
          type="password"
          defaultValue=""
          description="Modifier le mot de passe"
        />

        <FormField
          label="Avatar"
          type="avatar"
          defaultValue={user?.avatar || user?.profile?.avatar_path || ''}
          onSave={handleAvatarUpdate}
          description="Changez votre photo de profil"
        />
      </div>
    </div>
  );
};

export default ProfileSettings; 