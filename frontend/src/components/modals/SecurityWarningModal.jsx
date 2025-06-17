import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const SecurityWarningModal = ({ isOpen, onCountdownComplete, remainingTime = 10 }) => {
  const [countdown, setCountdown] = useState(remainingTime);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCountdownComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onCountdownComplete]);

  useEffect(() => {
    setCountdown(remainingTime);
  }, [remainingTime]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-red-900/95 backdrop-blur-xl border-red-500/30 text-white w-full max-w-md security-warning-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-100 text-center">
            ⚠️ Avertissement de Sécurité
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 text-center space-y-4">
          <div className="bg-red-800/50 rounded-lg p-4 border border-red-600/30">
            <h3 className="text-lg font-semibold text-red-100 mb-2">
              Trop de tentatives incorrectes
            </h3>
            <p className="text-red-200 text-sm leading-relaxed">
              Pour votre sécurité, vous allez être déconnecté automatiquement dans :
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold">{countdown}</span>
            </div>
            <span className="text-red-200">seconde{countdown > 1 ? 's' : ''}</span>
          </div>
          
          <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-600/30">
            <p className="text-orange-200 text-xs leading-relaxed">
              Cette mesure protège votre compte contre les tentatives d'accès non autorisées.
              Vous pourrez vous reconnecter normalement après cette déconnexion.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityWarningModal; 