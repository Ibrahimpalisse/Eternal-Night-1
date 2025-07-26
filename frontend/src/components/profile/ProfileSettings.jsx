import React, { useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import UserService from '../../services/user/index';
const userServiceInstance = new UserService();
import { securityStorage } from '../../utils/securityStorage';
import FormField from './FormField';

// Fonction pour obtenir l'avatar de l'utilisateur
const getUserAvatar = (user) => {
    if (!user) return null;
    
    // Priorité 1: avatarUrl direct (depuis l'API qui construit l'URL S3)
    if (user.profile && user.profile.avatarUrl) return user.profile.avatarUrl;
    
    // Priorité 2: avatar property
    if (user.avatar) return user.avatar;
    
    // Priorité 3: avatarUrl à la racine de l'objet user
    if (user.avatarUrl) return user.avatarUrl;
    
    // Priorité 4: construire l'URL S3 si on a avatar_path
    if (user.profile && user.profile.avatar_path) {
        // Si c'est déjà une URL complète, la retourner
        if (user.profile.avatar_path.startsWith('http')) {
            return user.profile.avatar_path;
        }
        // Sinon, essayer de construire l'URL S3
        const awsBucket = 'eternal-night'; // votre bucket
        const awsRegion = 'eu-north-1'; // votre région
        return `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${user.profile.avatar_path}`;
    }
    
    return null;
};

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
  const handleNameUpdate = async (newName) => {
    try {
      const result = await userServiceInstance.updateName(newName);

      if (result.success) {
        // Mise à jour directe de l'utilisateur
        setUser(prev => ({ ...prev, name: newName }));
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

  const handleAvatarUpdate = async (file) => {
    try {
      console.log('Updating avatar with file:', file);
      
      // Appel API réel pour mettre à jour l'avatar
      const result = await userServiceInstance.updateAvatar(file);
      
      if (result.success) {
        // Mettre à jour l'utilisateur avec la nouvelle URL d'avatar
        setUser(prev => ({ 
          ...prev, 
          avatar: result.avatarUrl,
          avatarUrl: result.avatarUrl,
          profile: { 
            ...prev.profile, 
            avatar_path: result.avatarPath,
            avatarUrl: result.avatarUrl
          } 
        }));
        
        toast.success('Avatar mis à jour avec succès');
        return result;
      } else {
        throw new Error(result.message || 'Une erreur est survenue');
      }
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
          defaultValue={user?.name || ''}
          onSave={handleNameUpdate}
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
          defaultValue={getUserAvatar(user) || ''}
          onSave={handleAvatarUpdate}
          description="Changez votre photo de profil"
        />
      </div>
    </div>
  );
};

export default ProfileSettings; 