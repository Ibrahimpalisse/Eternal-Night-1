import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';

const UnblockDialog = ({ isOpen, onClose, application, onConfirm, isLoading }) => {
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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-slate-900/95 border-slate-700/50 backdrop-blur-sm animate-zoom-in">
        <DialogHeader className="border-b border-slate-700/50 pb-4">
          <DialogTitle className="text-green-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Débloquer le candidat
          </DialogTitle>
          <DialogDescription>Confirmez le déblocage de cet utilisateur ou contenu.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400 font-medium mb-2">
              ✓ Action de déblocage
            </p>
            <p className="text-slate-300 text-sm">
              Le candidat <span className="font-medium text-white">{application.fullName}</span> 
              (<span className="text-blue-400">{application.email}</span>) pourra à nouveau 
              soumettre des candidatures après déblocage.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Raison du déblocage <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Expliquez pourquoi vous débloquez ce candidat..."
              rows={4}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg 
                       text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 
                       focus:ring-green-500 resize-none disabled:opacity-50"
            />
            <div className="flex justify-between items-center text-xs">
              {error && <span className="text-red-400">{error}</span>}
              <span className={`ml-auto ${reason.length > 500 ? 'text-red-400' : 'text-slate-400'}`}>
                {reason.length}/500
              </span>
            </div>
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
              className="order-1 sm:order-2 bg-gradient-to-r from-green-600 to-emerald-600 
                       hover:from-green-500 hover:to-emerald-500 text-white border-0 
                       transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 
                       transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 
                       disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  <span className="sm:hidden">Déblocage...</span>
                  <span className="hidden sm:inline">Déblocage en cours...</span>
                </>
              ) : (
                <>
                  <span className="sm:hidden">Débloquer</span>
                  <span className="hidden sm:inline">Confirmer le déblocage</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnblockDialog; 