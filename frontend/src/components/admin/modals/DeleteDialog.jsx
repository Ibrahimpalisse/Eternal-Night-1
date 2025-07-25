import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { X, Trash2, AlertTriangle } from 'lucide-react';

const DeleteDialog = ({ isOpen, onClose, application, onConfirm, isLoading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('La raison est obligatoire');
      return;
    }
    if (reason.trim().length < 10) {
      setError('La raison doit contenir au moins 10 caractères');
      return;
    }
    if (reason.trim().length > 500) {
      setError('La raison ne peut pas dépasser 500 caractères');
      return;
    }
    
    setError('');
    onConfirm(application, reason.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setError('');
      onClose();
    }
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900/95 border-red-700/50 backdrop-blur-sm animate-zoom-in">
        <DialogHeader>
          <DialogTitle className="text-red-400 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Supprimer définitivement
          </DialogTitle>
          <DialogDescription>Confirmez la suppression de cet élément.</DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-400 font-medium mb-2">
                  ⚠️ Suppression définitive
                </p>
                <p className="text-slate-300 text-sm">
                  La candidature de <span className="font-medium text-white">{application.fullName}</span> 
                  (<span className="text-blue-400">{application.email}</span>) sera définitivement 
                  supprimée du système. Cette action est <span className="text-red-400 font-medium">irréversible</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Raison de la suppression <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Expliquez pourquoi vous supprimez définitivement cette candidature..."
              rows={4}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg 
                       text-white placeholder-slate-400 focus:border-red-500 focus:ring-1 
                       focus:ring-red-500 resize-none disabled:opacity-50"
            />
            <div className="flex justify-between items-center text-xs">
              {error && <span className="text-red-400">{error}</span>}
              <span className={`ml-auto ${reason.length > 500 ? 'text-red-400' : 'text-slate-400'}`}>
                {reason.length}/500
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-400">
              <strong>Note :</strong> Cette action supprimera tous les données associées 
              à cette candidature de manière permanente.
            </p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="order-2 sm:order-1 border-slate-600 text-slate-300 hover:bg-slate-800 
                       hover:border-slate-500 transition-all duration-200"
            >
              <span className="sm:hidden">Annuler</span>
              <span className="hidden sm:inline">Annuler</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !reason.trim() || reason.trim().length < 10}
              className="order-1 sm:order-2 bg-gradient-to-r from-red-600 to-red-700 
                       hover:from-red-500 hover:to-red-600 text-white border-0 
                       transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 
                       transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 
                       disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  <span className="sm:hidden">Suppression...</span>
                  <span className="hidden sm:inline">Suppression en cours...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="sm:hidden">Supprimer</span>
                  <span className="hidden sm:inline">Supprimer définitivement</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog; 