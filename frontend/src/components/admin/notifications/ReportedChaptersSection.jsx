import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  AlertTriangle, 
  Search,
  Eye,
  Check,
  X,
  Flag,
  User,
  Calendar,
  Edit,
  Shield,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Slash,
  FileText,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import DropdownFilter from '../../common/DropdownFilter';

// Données mockées pour les CHAPITRES signalés
// Cette section gère les chapitres signalés directement (pas les commentaires sur les chapitres)
export const mockReportedChapters = [
  {
    id: 1,
    chapterId: 'chapter_1',
    chapterTitle: 'Chapitre 5 - La révélation',
    novelTitle: 'Les Gardiens de l\'Ombre',
    novelId: 1,
    authorName: 'Marc Dupont',
    authorId: 'user_123',
    content: 'Contenu du chapitre avec des scènes de violence excessive...',
    reportedBy: 'Sophie Martin',
    reportedAt: '2024-01-20T14:30:00Z',
    reason: 'inappropriate',
    reasonText: 'Contenu inapproprié',
    status: 'pending',
    severity: 'high',
    additionalInfo: 'Chapitre contenant des scènes de violence excessive',
    contentType: 'chapter'
  },
  {
    id: 2,
    chapterId: 'chapter_2',
    chapterTitle: 'Chapitre 12 - L\'adieu',
    novelTitle: 'Le Dernier Voyage',
    novelId: 2,
    authorName: 'Julie Lemoine',
    authorId: 'user_456',
    content: 'Contenu du chapitre avec des spoilers majeurs...',
    reportedBy: 'Pierre Lambert',
    reportedAt: '2024-01-20T12:15:00Z',
    reason: 'spoiler',
    reasonText: 'Spoilers',
    status: 'pending',
    severity: 'medium',
    additionalInfo: 'Chapitre révélant des éléments majeurs de l\'intrigue',
    contentType: 'chapter'
  }
];

const ReportedChaptersSection = () => {
  // Cette section gère les CHAPITRES signalés directement
  // Ce ne sont PAS les commentaires sur les chapitres, mais les chapitres eux-mêmes
  
  const [reports, setReports] = useState(mockReportedChapters);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filtrage des signalements
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.novelTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReason = filterReason === 'all' || report.reason === filterReason;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesReason && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Configuration des raisons de signalement
  const reasonConfig = {
    harassment: {
      label: 'Harcèlement',
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30'
    },
    spoiler: {
      label: 'Spoiler',
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30'
    },
    spam: {
      label: 'Spam',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30'
    },
    inappropriate: {
      label: 'Inapproprié',
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/30'
    },
    mistake: {
      label: 'Erreur',
      color: 'text-gray-400',
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/30'
    }
  };

  // Configuration des statuts
  const statusConfig = {
    pending: {
      label: 'En attente',
      color: 'text-yellow-300',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30'
    },
    resolved: {
      label: 'Résolu',
      color: 'text-green-300',
      bg: 'bg-green-500/20',
      border: 'border-green-500/30'
    },
    dismissed: {
      label: 'Rejeté',
      color: 'text-gray-300',
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/30'
    }
  };

  // Options pour le dropdown de raison
  const reasonOptions = [
    {
      value: 'all',
      label: 'Toutes les raisons',
      icon: Filter,
      color: 'text-gray-400'
    },
    {
      value: 'harassment',
      label: 'Harcèlement',
      icon: AlertTriangle,
      color: 'text-red-400'
    },
    {
      value: 'spoiler',
      label: 'Spoiler',
      icon: Eye,
      color: 'text-orange-400'
    },
    {
      value: 'spam',
      label: 'Spam',
      icon: Flag,
      color: 'text-yellow-400'
    },
    {
      value: 'inappropriate',
      label: 'Inapproprié',
      icon: Flag,
      color: 'text-purple-400'
    },
    {
      value: 'mistake',
      label: 'Erreur',
      icon: XCircle,
      color: 'text-gray-400'
    }
  ];

  // Options pour le dropdown de statut
  const statusOptions = [
    {
      value: 'all',
      label: 'Tous les statuts',
      icon: Filter,
      color: 'text-gray-400'
    },
    {
      value: 'pending',
      label: 'En attente',
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      value: 'resolved',
      label: 'Résolu',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      value: 'dismissed',
      label: 'Rejeté',
      icon: XCircle,
      color: 'text-gray-400'
    }
  ];

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleProcessReport = (reportId, action) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId 
          ? { ...report, status: action === 'resolve' ? 'resolved' : 'dismissed' }
          : report
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `Il y a ${diffDays} jours`;
  };

  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full min-w-0 overflow-hidden">
      {/* En-tête */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-white/10 flex items-center justify-center">
          <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Chapitres Signalés</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Modération des chapitres inappropriés</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-300 text-xs sm:text-sm font-medium">En attente</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-white">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-xs sm:text-sm font-medium">Approuvés</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-white">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-xs sm:text-sm font-medium">Total</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-white">
                {reports.length}
              </p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-3 sm:p-4 md:p-6 w-full overflow-hidden">
        <div className="space-y-3 sm:space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par chapitre, roman ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
            />
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <DropdownFilter
              label="Raison"
              options={reasonOptions}
              value={filterReason}
              onChange={setFilterReason}
            />
            <DropdownFilter
              label="Statut"
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
            />
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterReason('all');
                  setFilterStatus('all');
                }}
                className="w-full px-3 sm:px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 overflow-hidden">
        
        {/* Mobile View - Cards */}
        <div className="block lg:hidden">
          <div className="divide-y divide-slate-600/30">
            {currentReports.map((report) => {
              const reasonConf = reasonConfig[report.reason];
              const statusConf = statusConfig[report.status];

              return (
                <div key={report.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                  {/* Header with reason and status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${reasonConf.bg} ${reasonConf.border}`}>
                      <span className={reasonConf.color}>{reasonConf.label}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConf.bg} ${statusConf.border}`}>
                      <span className={statusConf.color}>{statusConf.label}</span>
                    </span>
                  </div>

                  {/* Chapter info */}
                  <div className="space-y-3">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded border border-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium">{report.authorName}</p>
                        <p className="text-gray-400 text-xs">ID: {report.authorId}</p>
                      </div>
                    </div>

                    {/* Chapter */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Edit className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{report.chapterTitle}</p>
                        <p className="text-gray-400 text-xs truncate">Roman: {report.novelTitle}</p>
                      </div>
                    </div>

                    {/* Date and reported by */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-white text-xs">{getTimeAgo(report.reportedAt)}</p>
                          <p className="text-gray-400 text-xs">{formatDate(report.reportedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-xs">Par {report.reportedBy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-600/30 space-y-2 mt-3">
                    <button
                      onClick={() => handleViewDetails(report)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded text-sm transition-colors w-full justify-center"
                    >
                      <Eye className="w-4 h-4" />
                      Voir les détails
                    </button>
                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProcessReport(report.id, 'resolve')}
                          className="flex items-center gap-2 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded text-sm transition-colors flex-1 justify-center"
                        >
                          <Check className="w-4 h-4" />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleProcessReport(report.id, 'dismiss')}
                          className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/20 rounded text-sm transition-colors flex-1 justify-center"
                        >
                          <X className="w-4 h-4" />
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-600/50">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Auteur</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Chapitre</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Raison</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Statut</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Date</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600/30">
              {currentReports.map((report) => {
                const reasonConf = reasonConfig[report.reason];
                const statusConf = statusConfig[report.status];

                return (
                  <tr key={report.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div>
                          <span className="text-white text-xs sm:text-sm">{report.authorName}</span>
                          <p className="text-gray-400 text-xs">ID: {report.authorId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-8 sm:w-8 sm:h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded border border-white/10 flex items-center justify-center">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white text-xs sm:text-sm font-medium truncate max-w-32">
                            {report.chapterTitle}
                          </p>
                          <p className="text-gray-400 text-xs truncate max-w-32">
                            Roman: {report.novelTitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${reasonConf.bg} ${reasonConf.border}`}>
                        <span className={reasonConf.color}>{reasonConf.label}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusConf.bg} ${statusConf.border}`}>
                        <span className={statusConf.color}>{statusConf.label}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div>
                        <p className="text-white text-xs sm:text-sm">{getTimeAgo(report.reportedAt)}</p>
                        <p className="text-gray-400 text-xs">{formatDate(report.reportedAt)}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="p-1 sm:p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleProcessReport(report.id, 'resolve')}
                              className="p-1 sm:p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded transition-colors"
                              title="Approuver"
                            >
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleProcessReport(report.id, 'dismiss')}
                              className="p-1 sm:p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/20 rounded transition-colors"
                              title="Rejeter"
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-600/30 px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-400">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredReports.length)} sur {filteredReports.length} signalements
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600/50 rounded hover:bg-slate-700/50 transition-colors"
                >
                  Précédent
                </button>
                <span className="px-3 py-2 text-sm text-white bg-red-600 rounded">
                  {currentPage}
                </span>
                <span className="text-gray-400 text-sm">sur {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600/50 rounded hover:bg-slate-700/50 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message si aucun signalement */}
      {filteredReports.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Edit className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Aucun chapitre signalé</h3>
          <p className="text-gray-400 text-sm sm:text-base">
            {searchTerm || filterReason !== 'all' || filterStatus !== 'all'
              ? 'Essayez de modifier vos filtres de recherche.'
              : 'Aucun chapitre signalé pour le moment.'}
          </p>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailsModal && selectedReport && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" 
          onClick={() => setShowDetailsModal(false)}
        >
          <div 
            className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Détails du signalement</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Informations du chapitre signalé */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Chapitre signalé</label>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded border border-white/10 flex items-center justify-center">
                        <Edit className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg">{selectedReport.chapterTitle}</h3>
                        <p className="text-gray-400 text-sm">Roman: {selectedReport.novelTitle}</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <p className="text-white leading-relaxed">"{selectedReport.content}"</p>
                      <p className="text-gray-400 text-sm mt-2">ID: {selectedReport.chapterId}</p>
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
                        <p className="text-white font-medium">{selectedReport.authorName}</p>
                        <p className="text-gray-400 text-sm">ID: {selectedReport.authorId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raison du signalement */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Raison du signalement</label>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${reasonConfig[selectedReport.reason].bg} ${reasonConfig[selectedReport.reason].border}`}>
                        <span className={reasonConfig[selectedReport.reason].color}>{reasonConfig[selectedReport.reason].label}</span>
                      </div>
                      <span className="text-gray-400 text-sm">Sévérité: {selectedReport.severity}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <p className="text-white text-sm leading-relaxed">{selectedReport.additionalInfo}</p>
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
                          <span className="text-white">{selectedReport.reportedBy}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Date du signalement</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{formatDate(selectedReport.reportedAt)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Statut actuel</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[selectedReport.status].bg} ${statusConfig[selectedReport.status].border}`}>
                            <span className={statusConfig[selectedReport.status].color}>{statusConfig[selectedReport.status].label}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedReport.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        handleProcessReport(selectedReport.id, 'resolve');
                        setShowDetailsModal(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approuver le chapitre
                    </button>
                    <button
                      onClick={() => {
                        handleProcessReport(selectedReport.id, 'dismiss');
                        setShowDetailsModal(false);
                      }}
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
      )}
    </div>
  );
};

export default ReportedChaptersSection; 