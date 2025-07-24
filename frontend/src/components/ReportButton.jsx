import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';

const ReportButton = ({ contentType = 'comment', contentId, className = '', size = 'sm' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReport = (reportData) => {
    console.log('Signalement soumis:', reportData);
    // Ici vous pouvez ajouter la logique pour envoyer le signalement à votre API
    // Par exemple : reportService.submitReport(reportData);
    
    // Pour l'instant, on affiche juste un message de confirmation
    alert('Signalement envoyé avec succès. Merci de nous aider à maintenir la qualité de la communauté.');
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className={`${sizeClasses[size]} flex items-center justify-center bg-slate-800/80 hover:bg-slate-700/90 border border-slate-600/50 hover:border-red-500/50 text-gray-400 hover:text-red-400 rounded-lg backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 ${className}`}
        title="Signaler ce contenu"
      >
        <Flag className={iconSizes[size]} />
      </button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReport={handleReport}
        contentType={contentType}
        contentId={contentId}
      />
    </>
  );
};

export default ReportButton; 