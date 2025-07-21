import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  AlertCircle, 
  FileEdit, 
  Search,
  Eye,
  Check,
  X,
  Clock,
  User,
  Calendar,
  BookOpen,
  ChevronDown,
  Filter,
  CheckCircle,
  XCircle,
  Slash
} from 'lucide-react';
import DropdownFilter from '../../common/DropdownFilter';

// Données mockées pour les demandes d'auteurs
const mockAuthorRequests = [
  {
    id: 1,
    type: 'verification',
    novelId: 1,
    novelTitle: 'Les Gardiens de l\'Ombre',
    authorName: 'Marie Dubois',
    authorId: 'author_1',
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    message: null
  },
  {
    id: 2,
    type: 'modification',
    novelId: 2,
    novelTitle: 'Chroniques Urbaines',
    authorName: 'Jean Martin',
    authorId: 'author_2',
    status: 'pending',
    createdAt: '2024-01-20T09:15:00Z',
    message: null
  },
  {
    id: 3,
    type: 'verification',
    novelId: 3,
    novelTitle: 'Le Dernier Voyage',
    authorName: 'Sophie Chen',
    authorId: 'author_3',
    status: 'processed',
    createdAt: '2024-01-19T16:45:00Z',
    processedAt: '2024-01-20T08:30:00Z',
    processedBy: 'Admin',
    message: null
  },
  {
    id: 4,
    type: 'modification',
    novelId: 4,
    novelTitle: 'Mémoires Perdues',
    authorName: 'Lucas Moreau',
    authorId: 'author_4',
    status: 'pending',
    createdAt: '2024-01-19T14:20:00Z',
    message: null
  },
  {
    id: 5,
    type: 'verification',
    novelId: 5,
    novelTitle: 'L\'Écho des Anciens',
    authorName: 'Emma Rodriguez',
    authorId: 'author_5',
    status: 'rejected',
    createdAt: '2024-01-19T11:10:00Z',
    processedAt: '2024-01-19T15:20:00Z',
    processedBy: 'Admin',
    rejectionReason: 'Contenu non conforme aux guidelines',
    message: null
  }
];

const AuthorRequestsSection = () => {
  const [requests, setRequests] = useState(mockAuthorRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filtrage des demandes
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.novelTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || request.type === filterType;
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Configuration des types de demandes
  const requestTypes = {
    verification: {
      label: 'Vérification',
      icon: AlertCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30'
    },
    modification: {
      label: 'Modification',
      icon: FileEdit,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30'
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
    processed: {
      label: 'Traitée',
      color: 'text-green-300',
      bg: 'bg-green-500/20',
      border: 'border-green-500/30'
    },
    rejected: {
      label: 'Rejetée',
      color: 'text-red-300',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30'
    }
  };

  // Options pour le dropdown de type
  const typeOptions = [
    {
      value: 'all',
      label: 'Tous les types',
      icon: Filter,
      color: 'text-gray-400'
    },
    {
      value: 'verification',
      label: 'Vérification',
      icon: AlertCircle,
      color: 'text-blue-400'
    },
    {
      value: 'modification',
      label: 'Modification',
      icon: FileEdit,
      color: 'text-orange-400'
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
      value: 'processed',
      label: 'Traitées',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      value: 'rejected',
      label: 'Rejetées',
      icon: XCircle,
      color: 'text-red-400'
    }
  ];

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleProcessRequest = (requestId, action) => {
    setRequests(requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: action === 'approve' ? 'processed' : 'rejected',
          processedAt: new Date().toISOString(),
          processedBy: 'Admin'
        };
      }
      return request;
    }));
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
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête de section */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <FileEdit className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Demandes d'Auteurs</h2>
          <p className="text-sm text-gray-400">Demandes de vérification et modification</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-300 text-xs sm:text-sm font-medium">En attente</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-xs sm:text-sm font-medium">Vérifications</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {requests.filter(r => r.type === 'verification').length}
              </p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-xs sm:text-sm font-medium">Modifications</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {requests.filter(r => r.type === 'modification').length}
              </p>
            </div>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-xs sm:text-sm font-medium">Traitées</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {requests.filter(r => r.status === 'processed').length}
              </p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
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
              placeholder="Rechercher par titre de roman ou nom d'auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
            />
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <DropdownFilter
              label="Type"
              options={typeOptions}
                value={filterType}
              onChange={setFilterType}
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
                  setFilterType('all');
                  setFilterStatus('all');
                }}
                className="w-full px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 overflow-hidden">
        {/* Vue Mobile - Cartes */}
        <div className="block lg:hidden">
          <div className="divide-y divide-slate-600/30">
            {currentRequests.map((request) => {
              const typeConfig = requestTypes[request.type];
              const statusConf = statusConfig[request.status];

              return (
                <div key={request.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                  {/* Header avec type et statut */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${typeConfig.bg} ${typeConfig.border}`}>
                      <div className={typeConfig.color}>
                        {React.createElement(typeConfig.icon, { className: "w-3 h-3" })}
                      </div>
                      <span className={typeConfig.color}>{typeConfig.label}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConf.bg} ${statusConf.border}`}>
                      <span className={statusConf.color}>{statusConf.label}</span>
                    </span>
                  </div>

                  {/* Contenu principal */}
                  <div className="space-y-3">
                    {/* Roman */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded border border-white/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm truncate">
                          {request.novelTitle}
                        </p>
                        <p className="text-gray-400 text-xs">
                          ID: {request.novelId}
                        </p>
                      </div>
                    </div>

                    {/* Auteur et Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white text-sm">{request.authorName}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs">{getTimeAgo(request.createdAt)}</p>
                        <p className="text-gray-400 text-xs">{formatDate(request.createdAt)}</p>
                      </div>
                    </div>

                                         {/* Actions */}
                     <div className="pt-2 border-t border-slate-600/30 space-y-2">
                       <button
                         onClick={() => handleViewDetails(request)}
                         className="flex items-center gap-2 px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded text-sm transition-colors w-full justify-center"
                       >
                         <Eye className="w-4 h-4" />
                         Voir les détails
                       </button>
                       {request.status === 'pending' && (
                         <div className="flex gap-2">
                           <button
                             onClick={() => handleProcessRequest(request.id, 'approve')}
                             className="flex items-center gap-2 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded text-sm transition-colors flex-1 justify-center"
                           >
                             <Check className="w-4 h-4" />
                             Approuver
                           </button>
                           <button
                             onClick={() => handleProcessRequest(request.id, 'reject')}
                             className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded text-sm transition-colors flex-1 justify-center"
                           >
                             <X className="w-4 h-4" />
                             Rejeter
                           </button>
                         </div>
                       )}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vue Desktop - Tableau */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600/50">
                <tr>
                  <th className="px-4 xl:px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                  <th className="px-4 xl:px-6 py-4 text-left text-sm font-medium text-gray-300">Roman</th>
                  <th className="px-4 xl:px-6 py-4 text-left text-sm font-medium text-gray-300">Auteur</th>
                  <th className="px-4 xl:px-6 py-4 text-left text-sm font-medium text-gray-300">Statut</th>
                  <th className="px-4 xl:px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 xl:px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/30">
                {currentRequests.map((request) => {
                  const typeConfig = requestTypes[request.type];
                  const statusConf = statusConfig[request.status];

                  return (
                    <tr key={request.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 xl:px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${typeConfig.bg} ${typeConfig.border}`}>
                          <div className={typeConfig.color}>
                            {React.createElement(typeConfig.icon, { className: "w-4 h-4" })}
                          </div>
                          <span className={typeConfig.color}>{typeConfig.label}</span>
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded border border-white/10 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm truncate max-w-48">
                              {request.novelTitle}
                            </p>
                            <p className="text-gray-400 text-xs">
                              ID: {request.novelId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white text-sm">{request.authorName}</span>
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConf.bg} ${statusConf.border}`}>
                          <span className={statusConf.color}>{statusConf.label}</span>
                        </span>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <div>
                          <p className="text-white text-sm">{getTimeAgo(request.createdAt)}</p>
                          <p className="text-gray-400 text-xs">{formatDate(request.createdAt)}</p>
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleProcessRequest(request.id, 'approve')}
                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded transition-colors"
                                title="Approuver"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleProcessRequest(request.id, 'reject')}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                                title="Rejeter"
                              >
                                <X className="w-4 h-4" />
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
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredRequests.length)} sur {filteredRequests.length} demandes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600/50 rounded hover:bg-slate-700/50 transition-colors"
                >
                  Précédent
                </button>
                <span className="px-3 py-2 text-sm text-white bg-blue-600 rounded">
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

      {/* Message si aucune demande */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <FileEdit className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Aucune demande trouvée</h3>
          <p className="text-gray-400 text-sm sm:text-base">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Essayez de modifier vos filtres de recherche.'
              : 'Aucune demande d\'auteur pour le moment.'}
          </p>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailsModal && selectedRequest && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Détails de la demande</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Type de demande</label>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${requestTypes[selectedRequest.type].bg} ${requestTypes[selectedRequest.type].border}`}>
                      <div className={requestTypes[selectedRequest.type].color}>
                        {React.createElement(requestTypes[selectedRequest.type].icon, { className: "w-4 h-4" })}
                      </div>
                      <span className={requestTypes[selectedRequest.type].color}>
                        {requestTypes[selectedRequest.type].label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Statut</label>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border ${statusConfig[selectedRequest.status].bg} ${statusConfig[selectedRequest.status].border}`}>
                      <span className={statusConfig[selectedRequest.status].color}>
                        {statusConfig[selectedRequest.status].label}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Roman concerné</label>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h3 className="text-white font-medium">{selectedRequest.novelTitle}</h3>
                    <p className="text-gray-400 text-sm">ID: {selectedRequest.novelId}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Auteur</label>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedRequest.authorName}</p>
                        <p className="text-gray-400 text-sm">ID: {selectedRequest.authorId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date de création</label>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">{formatDate(selectedRequest.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedRequest.processedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Informations de traitement</label>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">Traité le {formatDate(selectedRequest.processedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">Par {selectedRequest.processedBy}</span>
                      </div>
                      {selectedRequest.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-300 text-sm">
                            <strong>Raison du rejet :</strong> {selectedRequest.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      handleProcessRequest(selectedRequest.id, 'reject');
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => {
                      handleProcessRequest(selectedRequest.id, 'approve');
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-lg transition-colors"
                  >
                    Approuver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AuthorRequestsSection;
