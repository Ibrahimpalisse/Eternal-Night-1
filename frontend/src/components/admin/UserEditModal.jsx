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
  RefreshCw
} from 'lucide-react';

const UserEditModal = ({ user, isOpen, onClose, onSave }) => {
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-slate-800/95 rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Modifier l'utilisateur</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Informations de base */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-600/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      errors.name ? 'border-red-500/50' : 'border-slate-500/50'
                    }`}
                    placeholder="Nom complet de l'utilisateur"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-300 cursor-not-allowed"
                    placeholder="email@example.com"
                  />
                  <p className="text-gray-500 text-xs mt-1">L'email ne peut pas être modifié</p>
                </div>
              </div>
            </div>

            {/* Rôles */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Rôles et permissions
              </h3>
              
              {errors.roles && <p className="text-red-400 text-sm mb-4">{errors.roles}</p>}
              
              <div className="space-y-3">
                {availableRoles.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = formData.roles.includes(role.value);
                  
                  return (
                    <div
                      key={role.value}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-600/20 border border-slate-600/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(role.color)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{role.label}</div>
                          <p className="text-gray-400 text-sm">{role.description}</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleRoleToggle(role.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                          isSelected
                            ? 'bg-purple-600'
                            : 'bg-slate-600'
                        }`}
                      >
                        <span className="sr-only">
                          {isSelected ? 'Désactiver' : 'Activer'} {role.label}
                        </span>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            isSelected
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-slate-600/20 rounded-lg border border-slate-600/30">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Conseil :</strong> Utilisez les boutons pour activer ou désactiver chaque rôle. 
                  Au moins un rôle doit être sélectionné.
                </p>
              </div>
            </div>


          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700/50">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white hover:border-slate-500/50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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