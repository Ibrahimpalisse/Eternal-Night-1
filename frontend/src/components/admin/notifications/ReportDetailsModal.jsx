import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Calendar, 
  Shield, 
  Check, 
  Eye, 
  FileText, 
  BookOpen, 
  Edit,
  AlertTriangle
} from 'lucide-react';

const ReportDetailsModal = ({ 
  isOpen, 
  onClose, 
  report, 
  contentType = 'content', // 'chapter', 'novel', 'comment'
  reasonConfig,
  statusConfig,
  onProcessReport,
  formatDate 
}) => {
  if (!isOpen || !report) return null;

  const getContentIcon = () => {
    switch (contentType) {
      case 'chapter':
        return <Edit className="w-5 h-5 text-green-400" />;
      case 'novel':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'comment':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getContentIconBg = () => {
    switch (contentType) {
      case 'chapter':
        return 'bg-gradient-to-br from-green-500/20 to-blue-500/20';
      case 'novel':
        return 'bg-gradient-to-br from-purple-500/20 to-blue-500/20';
      case 'comment':
        return 'bg-gradient-to-br from-blue-500/20 to-purple-500/20';
      default:
        return 'bg-gradient-to-br from-gray-500/20 to-gray-600/20';
    }
  };

  const getContentTitle = () => {
    switch (contentType) {
      case 'chapter':
        return report.chapterTitle;
      case 'novel':
        return report.novelTitle;
      case 'comment':
        return 'Commentaire';
      default:
        return report.title || 'Contenu';
    }
  };

  const getContentSubtitle = () => {
    switch (contentType) {
      case 'chapter':
        return `Roman: ${report.novelTitle}`;
      case 'novel':
        return '';
      case 'comment':
        return `Sur: ${report.targetTitle || 'Contenu'}`;
      default:
        return '';
    }
  };

  const getContentId = () => {
    switch (contentType) {
      case 'chapter':
        return report.chapterId;
      case 'novel':
        return report.novelId;
      case 'comment':
        return report.commentId;
      default:
        return report.id;
    }
  };

  const getActionText = () => {
    switch (contentType) {
      case 'chapter':
        return 'Approuver le chapitre';
      case 'novel':
        return 'Approuver le roman';
      case 'comment':
        return 'Approuver le commentaire';
      default:
        return 'Approuver le contenu';
    }
  };

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
            {/* Informations du contenu signalé */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {contentType === 'chapter' ? 'Chapitre signalé' : 
                 contentType === 'novel' ? 'Roman signalé' : 
                 contentType === 'comment' ? 'Commentaire signalé' : 'Contenu signalé'}
              </label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-12 ${getContentIconBg()} rounded border border-white/10 flex items-center justify-center`}>
                    {getContentIcon()}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">{getContentTitle()}</h3>
                    <p className="text-gray-400 text-sm">{getContentSubtitle()}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-white leading-relaxed">"{report.content}"</p>
                  <p className="text-gray-400 text-sm mt-2">ID: {getContentId()}</p>
                </div>
              </div>
            </div>

            {/* Informations de l'auteur */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Auteur</label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
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

            {/* Statistiques supplémentaires pour les romans */}
            {contentType === 'novel' && report.chaptersCount && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Statistiques du roman</label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Nombre de chapitres</p>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{report.chaptersCount}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Vues totales</p>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{report.totalViews?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleProcessReport('resolve')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {getActionText()}
                </button>
                <button
                  onClick={() => handleProcessReport('dismiss')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-400 rounded-lg transition-colors"
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

export default ReportDetailsModal; 