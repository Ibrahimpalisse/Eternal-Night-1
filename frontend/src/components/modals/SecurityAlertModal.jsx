import React from 'react';
import Lottie from 'lottie-react';
import successAnimation from '../../assets/success-animation.json';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';

const SecurityAlertModal = ({ isOpen, message }) => {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-full max-w-md border border-red-500/20 bg-gray-900/90 backdrop-blur-xl text-white">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 mb-4">
            <Lottie 
              animationData={successAnimation} 
              loop={false}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-white mb-2">
              Déconnexion de sécurité
            </DialogTitle>
            
            <DialogDescription className="text-gray-300 mb-6">
              {message || "Trop de tentatives échouées. Pour votre sécurité, vous avez été déconnecté."}
            </DialogDescription>
          </DialogHeader>
          
          <p className="text-gray-400 text-sm mb-4">
            Vous serez redirigé vers la page de connexion dans quelques secondes...
          </p>
          
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-red-500 to-purple-600 w-full animate-[progress_3s_linear]" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityAlertModal; 