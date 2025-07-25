import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { AlertTriangle, Lock, Eye, EyeOff, X } from 'lucide-react';
import { FormValidation } from '../../../utils/validation';

const DeleteUserDialog = ({ isOpen, onClose, user, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = () => {
    try {
      FormValidation.adminPasswordConfirmSchema.parse({ password });
      setError('');
      return true;
    } catch (error) {
      setError(error.errors[0]?.message || 'Mot de passe invalide');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await onConfirm(password);
      // Reset form
      setPassword('');
      setError('');
    } catch (error) {
      setError('Mot de passe incorrect ou erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    // Effacer l'erreur quand l'utilisateur tape
    if (error) {
      setError('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              Supprimer l'utilisateur
            </DialogTitle>
            <DialogDescription>Confirmez la suppression de cet utilisateur. Cette action est irréversible.</DialogDescription>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avertissement */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-medium mb-1">Action irréversible</h3>
                <p className="text-red-300 text-sm">
                  Vous êtes sur le point de supprimer définitivement l'utilisateur{' '}
                  <span className="font-medium">{user.firstName} {user.lastName}</span>{' '}
                  ({user.email}). Cette action ne peut pas être annulée.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4" />
                Confirmer avec votre mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Saisissez votre mot de passe..."
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 pr-12 ${
                    error ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-600/50 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {error}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading || !password}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Supprimer définitivement'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog; 