import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, AlertTriangle, Eye, MessageSquare, Flag, Slash, Filter, Check } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, onReport, contentType = 'comment', contentId }) => {
  const [selectedReason, setSelectedReason] = useState('all');
  const [explanation, setExplanation] = useState('');

  const reportReasons = [
    { id: 'all', label: 'Toutes les raisons', icon: Filter, color: 'text-gray-400' },
    { id: 'harassment', label: 'Harcèlement', icon: AlertTriangle, color: 'text-red-400' },
    { id: 'spoiler', label: 'Spoiler', icon: Eye, color: 'text-orange-400' },
    { id: 'spam', label: 'Spam', icon: MessageSquare, color: 'text-yellow-400' },
    { id: 'inappropriate', label: 'Inapproprié', icon: Flag, color: 'text-purple-400' },
    { id: 'error', label: 'Erreur', icon: Slash, color: 'text-gray-400' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedReason === 'all') {
      alert('Veuillez sélectionner une raison spécifique');
      return;
    }
    
    onReport({
      contentType,
      contentId,
      reason: selectedReason,
      explanation: explanation.trim()
    });
    
    // Reset form
    setSelectedReason('all');
    setExplanation('');
    onClose();
  };

  const handleClose = () => {
    setSelectedReason('all');
    setExplanation('');
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="relative bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Signaler ce {contentType === 'comment' ? 'commentaire' : 'roman'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Raison du signalement
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => {
                const IconComponent = reason.icon;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedReason === reason.id
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 ${reason.color}`} />
                      <span className="text-gray-300">{reason.label}</span>
                    </div>
                    {selectedReason === reason.id && (
                      <Check className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Field */}
          <div className="mb-6">
            <label htmlFor="explanation" className="block text-sm font-medium text-gray-300 mb-3">
              Explication (optionnel)
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Décrivez brièvement le problème..."
              className="w-full h-24 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {explanation.length}/500
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600/90 hover:bg-red-500/90 text-white rounded-lg transition-colors font-medium"
            >
              Signaler
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ReportModal; 