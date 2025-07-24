import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Calendar, 
  Shield, 
  Check, 
  Eye, 
  Heart, 
  MessageCircle,
  PenTool,
  AlertTriangle
} from 'lucide-react';

const PostDetailsModal = ({ 
  isOpen, 
  onClose, 
  report, 
  reasonConfig,
  statusConfig,
  onProcessReport,
  formatDate 
}) => {
  if (!isOpen || !report) return null;

  const handleProcessReport = (action) => {
    if (onProcessReport) {
      onProcessReport(report.id, action);
    }
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Détails du signalement</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

                     <div className="space-y-4 sm:space-y-6">
             {/* Post signalé - Affichage complet comme dans l'image */}
             <div>
               <label className="block text-sm font-medium text-gray-400 mb-2">Post signalé</label>
               <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                   {/* Structure du post comme dans l'image */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image du post (à gauche) */}
                    <div className="w-full sm:w-32 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0">
                      <PenTool className="w-8 h-8 text-orange-400" />
                    </div>
                    
                    {/* Contenu du post (à droite) */}
                    <div className="flex-1 min-w-0">
                     {/* Titre et badges */}
                     <div className="mb-2">
                       <h3 className="text-white font-bold text-lg mb-2">{report.postTitle}</h3>
                       <div className="flex gap-2 mb-2">
                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 border border-green-500/30 text-green-400">
                           Publié
                         </span>
                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-500/30 text-purple-400">
                           Annonce
                         </span>
                       </div>
                     </div>
                     
                     {/* Description du post */}
                     <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 mb-3">
                       <p className="text-white text-sm leading-relaxed">{report.content}</p>
                     </div>
                     
                                           {/* Métadonnées en bas */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-2 border-t border-slate-600/30">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-white text-sm">{report.views?.toLocaleString() || 245}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-gray-400" />
                            <span className="text-white text-sm">{report.likes?.toLocaleString() || 32}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm">{formatDate(report.reportedAt)}</span>
                        </div>
                      </div>
                   </div>
                 </div>
                 
                 <p className="text-gray-400 text-sm mt-3">ID: {report.postId}</p>
               </div>
             </div>

             {/* Informations de l'auteur */}
             <div>
               <label className="block text-sm font-medium text-gray-400 mb-2">Auteur</label>
               <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                       <User className="w-5 h-5 text-white" />
                     </div>
                     <div>
                       <p className="text-white font-medium">{report.authorName}</p>
                       <p className="text-gray-400 text-sm">ID: {report.authorId}</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

                         

            {/* Raison du signalement */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Raison du signalement</label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${reasonConfig[report.reason].bg} ${reasonConfig[report.reason].border}`}>
                    <span className={reasonConfig[report.reason].color}>{reasonConfig[report.reason].label}</span>
                  </div>
                  <span className="text-gray-400 text-sm">Sévérité: {report.severity}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-white text-sm leading-relaxed">{report.additionalInfo}</p>
                </div>
              </div>
            </div>

            

            {/* Informations du signalement */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Informations du signalement</label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Signalé par</p>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{report.reportedBy}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Date du signalement</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{formatDate(report.reportedAt)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Statut actuel</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[report.status].bg} ${statusConfig[report.status].border}`}>
                        <span className={statusConfig[report.status].color}>{statusConfig[report.status].label}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                         {/* Actions */}
             {report.status === 'pending' && (
               <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                 <button
                   onClick={() => handleProcessReport('resolve')}
                   className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-colors w-full sm:w-auto"
                 >
                   <Check className="w-4 h-4" />
                   Approuver le post
                 </button>
                 <button
                   onClick={() => handleProcessReport('dismiss')}
                   className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-400 rounded-lg transition-colors w-full sm:w-auto"
                 >
                   <X className="w-4 h-4" />
                   Rejeter le signalement
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostDetailsModal; 