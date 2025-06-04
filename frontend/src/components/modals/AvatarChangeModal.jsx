import React, { useState, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormValidation } from '../../utils/validation';

const AvatarChangeModal = ({ isOpen, onClose, currentAvatar, onSubmit }) => {
  const [value, setValue] = useState(currentAvatar || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const fileInputRef = useRef(null);

  // Fonction pour sécuriser les Data URLs
  const isSecureDataUrl = (dataUrl) => {
    if (!dataUrl.startsWith('data:image/')) return false;
    
    // Vérifier que c'est bien un format d'image supporté
    const supportedFormats = ['data:image/jpeg', 'data:image/jpg', 'data:image/png', 'data:image/gif', 'data:image/webp'];
    return supportedFormats.some(format => dataUrl.toLowerCase().startsWith(format));
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setError('');
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Utiliser la validation sécurisée des fichiers
      const fileValidation = FormValidation.validateAvatarFile(file);
      if (!fileValidation.success) {
        setError(fileValidation.error);
        setValue('');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (value === currentAvatar) {
        if (value.startsWith('data:image') && !currentAvatar) {
          // Do nothing, proceed to onSubmit
        } else {
          setError('Le nouvel avatar est identique à votre avatar actuel');
          setIsLoading(false);
          return;
        }
      }
      
      // Validate URL using validation.js schema
      if (!isSecureDataUrl(value)) { // Don't validate data URLs with imageUrl schema
        const validationResult = FormValidation.validateField('imageUrl', value);
        if (!validationResult.success) {
          setError(validationResult.error);
          setIsLoading(false);
          return;
        }
      }

      await onSubmit(value);
      handleClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setValue(currentAvatar || '');
    setError('');
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900/90 backdrop-blur-xl border-white/10 text-white w-full max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {currentAvatar ? 'Modifier votre avatar' : 'Ajouter un avatar'}
              </DialogTitle>
              <p className="text-sm text-gray-400">
                {currentAvatar ? 'Changez votre photo de profil' : 'Ajoutez une photo de profil'}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 sm:p-5 bg-gray-900/50 rounded-lg mb-4">
          <form onSubmit={handleSubmit} id="avatar-form" className="space-y-6">
            {/* Aperçu de l'avatar actuel et nouveau */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Avatar actuel */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 mb-3">Avatar actuel</p>
                <div className="mx-auto w-24 h-24 rounded-full border-2 border-gray-600 overflow-hidden bg-gray-800 flex items-center justify-center">
                  {currentAvatar ? (
                    <img 
                      src={currentAvatar} 
                      alt="Avatar actuel" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold ${currentAvatar ? 'hidden' : 'flex'}`}>
                    U
                  </div>
                </div>
              </div>
              
              {/* Aperçu du nouvel avatar */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 mb-3">Aperçu</p>
                <div className="mx-auto w-24 h-24 rounded-full border-2 border-purple-500/50 overflow-hidden bg-gray-800 flex items-center justify-center">
                  {value && (isSecureDataUrl(value) || FormValidation.validateField('imageUrl', value).success) ? (
                    <img 
                      src={value} 
                      alt="Nouvel avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gray-700 flex items-center justify-center text-gray-500 ${value && (isSecureDataUrl(value) || FormValidation.validateField('imageUrl', value).success) ? 'hidden' : 'flex'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* URL Input avec validation */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                URL de l'image
              </label>
              <Input
                type="url"
                value={value}
                onChange={handleChange}
                placeholder="https://exemple.com/votre-avatar.jpg"
                className={`text-white transition-colors ${
                  (value && !isSecureDataUrl(value) && !FormValidation.validateField('imageUrl', value).success && value.length > 0) 
                    ? 'border-orange-500 focus:ring-orange-500' 
                    : (value && (isSecureDataUrl(value) || FormValidation.validateField('imageUrl', value).success)) 
                    ? 'border-green-500 focus:ring-green-500' 
                    : ''
                }`}
                autoFocus
              />
              {value && value.length > 0 && (
                <div className="flex items-center text-xs">
                  {(isSecureDataUrl(value) || FormValidation.validateField('imageUrl', value).success) ? (
                    <div className="flex items-center text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Image valide
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Assurez-vous que l'URL pointe vers une image ou téléchargez-en une.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Zone de téléchargement */}
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-800/30 hover:border-gray-500 transition-colors cursor-pointer"
                 onClick={handleFileSelect}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:bg-gray-700 w-full sm:max-w-[200px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Télécharger une image
                </Button>
                <p className="mt-2 text-xs text-gray-500">
                  Cliquez ou glissez-déposez une image ici
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Formats supportés : JPEG, PNG, GIF, WebP</p>
              <p>• Taille recommandée : 200x200 pixels minimum</p>
              <p>• Taille maximale : 5 MB</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <p className="text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:max-w-[120px]"
          >
            Annuler
          </Button>
          
          <Button
            type="submit"
            form="avatar-form"
            onClick={handleSubmit}
            disabled={isLoading || !value || value === currentAvatar || !!error}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:max-w-[160px]"
          >
            {isLoading ? 'Chargement...' : 'Mettre à jour'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarChangeModal; 