// Export des composants de profil
export { default as FormField } from './FormField';
export { default as ProfileHeader } from './ProfileHeader';
export { default as ProfileTabs } from './ProfileTabs';

// Export des modals
export { default as SecurityAlertModal } from '../modals/SecurityAlertModal';
export { default as PasswordChangeModal } from '../modals/PasswordChangeModal';
export { default as EmailChangeModal } from '../modals/EmailChangeModal';
export { default as AvatarChangeModal } from '../modals/AvatarChangeModal';

// Export des utilitaires
export { securityStorage } from '../../utils/securityStorage';

// Suppression de ProfileHeader et ProfileTabs du module profile car ils seront utilisés directement dans Profil.jsx
// export { default as ProfileHeader } from './ProfileHeader';
// export { default as ProfileTabs } from './ProfileTabs'; 