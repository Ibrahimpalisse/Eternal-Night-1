import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search,
  Eye,
  Check,
  X,
  Flag,
  User,
  Calendar,
  BookOpen,
  Shield,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Slash,
  FileText,
  MessageSquare
} from 'lucide-react';
import DropdownFilter from '../../common/DropdownFilter';
import ReportDetailsModal from './ReportDetailsModal';

// Données mockées pour les ROMANS signalés
// Cette section gère les romans signalés directement
export const mockReportedNovels = [
  {
    id: 1,
    novelId: 'novel_1',
    novelTitle: 'Les Gardiens de l\'Ombre',
    authorName: 'Marc Dupont',
    authorId: 'user_123',
    content: 'Contenu du roman avec des thèmes controversés...',
    reportedBy: 'Sophie Martin',
    reportedAt: '2024-01-20T14:30:00Z',
    reason: 'inappropriate',
    reasonText: 'Contenu inapproprié',
    status: 'pending',
    severity: 'high',
    additionalInfo: 'Roman contenant des thèmes controversés et des scènes explicites',
    contentType: 'novel',
    genre: 'Fantasy',
    chaptersCount: 15,
    totalViews: 2500
  },
  {
    id: 2,
    novelId: 'novel_2',
    novelTitle: 'Le Dernier Voyage',
    authorName: 'Julie Lemoine',
    authorId: 'user_456',
    content: 'Contenu du roman avec des éléments plagiés...',
    reportedBy: 'Pierre Lambert',
    reportedAt: '2024-01-20T12:15:00Z',
    reason: 'plagiarism',
    reasonText: 'Plagiat',
    status: 'pending',
    severity: 'medium',
    additionalInfo: 'Roman contenant des passages similaires à d\'autres œuvres',
    contentType: 'novel',
    genre: 'Science-Fiction',
    chaptersCount: 8,
    totalViews: 1200
  },
  {
    id: 3,
    novelId: 'novel_3',
    novelTitle: 'L\'Écho du Passé',
    authorName: 'Thomas Bernard',
    authorId: 'user_789',
    content: 'Contenu du roman avec du spam...',
    reportedBy: 'Marie Dubois',
    reportedAt: '2024-01-19T16:45:00Z',
    reason: 'spam',
    reasonText: 'Spam',
    status: 'resolved',
    severity: 'low',
    additionalInfo: 'Roman contenant des liens commerciaux non autorisés',
    contentType: 'novel',
    genre: 'Mystère',
    chaptersCount: 12,
    totalViews: 800
  }
];

const ReportedNovelsSection = () => {
  // Cette section gère les ROMANS signalés directement
  
  const [reports, setReports] = useState(mockReportedNovels);
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
      report.novelTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    plagiarism: {
      label: 'Plagiat',
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
      value: 'plagiarism',
      label: 'Plagiat',
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
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-white/10 flex items-center justify-center">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Romans Signalés</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Modération des romans inappropriés</p>
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
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-400" />
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
              placeholder="Rechercher par roman, auteur ou genre..."
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

                  {/* Novel info */}
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

                    {/* Novel */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded border border-white/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{report.novelTitle}</p>
                        <p className="text-gray-400 text-xs truncate">Genre: {report.genre} • {report.chaptersCount} chapitres</p>
                      </div>
                    </div>

                    {/* Stats */}
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
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Roman</th>
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
                        <div className="w-6 h-8 sm:w-8 sm:h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded border border-white/10 flex items-center justify-center">
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white text-xs sm:text-sm font-medium truncate max-w-32">
                            {report.novelTitle}
                          </p>
                          <p className="text-gray-400 text-xs truncate max-w-32">
                            {report.genre} • {report.chaptersCount} chapitres
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
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Aucun roman signalé</h3>
          <p className="text-gray-400 text-sm sm:text-base">
            {searchTerm || filterReason !== 'all' || filterStatus !== 'all'
              ? 'Essayez de modifier vos filtres de recherche.'
              : 'Aucun roman signalé pour le moment.'}
          </p>
        </div>
      )}

      {/* Modal de détails */}
      <ReportDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        report={selectedReport}
        contentType="novel"
        reasonConfig={reasonConfig}
        statusConfig={statusConfig}
        onProcessReport={handleProcessReport}
        formatDate={formatDate}
      />
    </div>
  );
};

export default ReportedNovelsSection; 