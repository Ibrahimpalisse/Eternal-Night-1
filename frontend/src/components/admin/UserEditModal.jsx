import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Shield, 
  Edit3, 
  Users as UsersIcon,
  UserX,
  AlertTriangle,
  Save,
  RefreshCw,
  Mail
} from 'lucide-react';

const UserEditModal = ({ user, isOpen, onClose, onSave, previousModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Tous les rôles disponibles dans le système
  const availableRoles = [
    { value: 'super_admin', label: 'Super Administrateur', description: 'Tous les droits', color: 'red', icon: Shield },
    { value: 'admin', label: 'Administrateur', description: 'Administrateur du site', color: 'red', icon: Shield },
    { value: 'content_editor', label: 'Éditeur de contenu', description: 'Éditeur de contenu', color: 'blue', icon: Edit3 },
    { value: 'author', label: 'Auteur', description: 'Auteur de contenu', color: 'blue', icon: Edit3 },
    { value: 'user', label: 'Utilisateur', description: 'Utilisateur standard', color: 'purple', icon: UsersIcon },
    { value: 'blocked', label: 'Bloqué', description: 'Utilisateur bloqué', color: 'red', icon: UserX },
    { value: 'author_suspended', label: 'Auteur suspendu', description: 'Auteur suspendu', color: 'orange', icon: AlertTriangle }
  ];

  // Initialiser le formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        roles: user.roles || []
      });
      setErrors({});
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Nettoyer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRoleToggle = (roleValue) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleValue) 
        ? prev.roles.filter(r => r !== roleValue)
        : [...prev.roles, roleValue]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (formData.roles.length === 0) {
      newErrors.roles = 'Au moins un rôle doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSave({ ...user, ...formData });
      onClose();
      // Si on a un modal précédent à rouvrir
      if (previousModal && previousModal.reopenCallback) {
        setTimeout(() => {
          previousModal.reopenCallback();
        }, 150);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ general: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
    // Si on a un modal précédent à rouvrir
    if (previousModal && previousModal.reopenCallback) {
      setTimeout(() => {
        previousModal.reopenCallback();
      }, 150);
    }
  };

  const getRoleColor = (color) => {
    const colors = {
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[color] || colors.gray;
  };

  if (!isOpen || !user) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-slate-800/95 rounded-xl sm:rounded-2xl border border-slate-700/50 w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl h-full sm:h-auto sm:max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Modifier l'utilisateur</h2>
              <p className="text-gray-400 text-sm truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          <form className="space-y-4 sm:space-y-6">
            {/* Informations de base */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm sm:text-base ${
                    errors.name ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                  placeholder="Entrez le nom complet"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Adresse email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-600/30 border border-slate-600/30 rounded-lg sm:rounded-xl text-gray-400 cursor-not-allowed text-sm sm:text-base"
                  placeholder="Email non modifiable"
                />
                <p className="mt-1 text-xs text-gray-500">
                  L'adresse email ne peut pas être modifiée
                </p>
              </div>
            </div>

            {/* Gestion des rôles */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">
                <Shield className="w-4 h-4 inline mr-2" />
                Rôles et permissions
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {availableRoles.map(role => {
                  const isSelected = formData.roles.includes(role.value);
                  const RoleIcon = role.icon;
                  
                  return (
                    <div
                      key={role.value}
                      className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10' 
                          : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/50'
                      }`}
                      onClick={() => handleRoleToggle(role.value)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className={`p-1.5 sm:p-2 rounded-lg ${
                            isSelected ? 'bg-purple-500/30' : 'bg-slate-600/30'
                          }`}>
                            <RoleIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              isSelected ? 'text-purple-400' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium text-xs sm:text-sm truncate ${
                              isSelected ? 'text-purple-300' : 'text-gray-300'
                            }`}>
                              {role.label}
                            </h3>
                            <p className={`text-xs mt-1 ${
                              isSelected ? 'text-purple-400/80' : 'text-gray-500'
                            }`}>
                              {role.description}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleToggle(role.value);
                          }}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shrink-0 ${
                            isSelected
                              ? 'bg-purple-600'
                              : 'bg-slate-600'
                          }`}
                        >
                          <span className="sr-only">
                            {isSelected ? 'Désactiver' : 'Activer'} {role.label}
                          </span>
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              isSelected
                                ? 'translate-x-5 sm:translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {errors.roles && (
                <p className="mt-2 text-sm text-red-400">{errors.roles}</p>
              )}
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-600/20 rounded-lg border border-slate-600/30">
                <p className="text-xs sm:text-sm text-gray-400">
                  <strong className="text-gray-300">Conseil :</strong> Utilisez les boutons pour activer ou désactiver chaque rôle. 
                  Au moins un rôle doit être sélectionné.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer avec boutons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 p-4 sm:p-6 border-t border-slate-700/50 shrink-0">
          <button
            onClick={handleClose}
            className="order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white hover:border-slate-500/50 transition-all font-medium text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="order-1 sm:order-2 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UserEditModal; 