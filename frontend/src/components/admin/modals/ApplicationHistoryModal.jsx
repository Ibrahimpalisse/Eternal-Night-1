import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { X, Clock, CheckCircle, XCircle, Badge, User, Calendar, Eye, FileText, AlertTriangle } from 'lucide-react';

const ApplicationHistoryModal = ({ isOpen, onClose, user, onUserClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(5);

  // Données simulées de l'historique des candidatures
  const applicationHistory = [
    {
      id: 1,
      type: 'author_application',
      status: 'rejected',
      submittedAt: '2024-02-05',
      processedAt: '2024-02-08',
      authorPseudo: 'MarieDuboisAuteur',
      reasonToBeAuthor: 'J\'ai toujours rêvé d\'écrire et de partager mes histoires...',
      rejectionReason: 'Candidature incomplète, manque d\'expérience démontrée',
      processedBy: 'Admin Martin',
      genres: ['Fantasy', 'Romance']
    },
    {
      id: 2,
      type: 'author_application',
      status: 'deleted',
      submittedAt: '2024-01-20',
      processedAt: '2024-01-25',
      authorPseudo: 'MarieWriter2024',
      reasonToBeAuthor: 'Je souhaite devenir auteur pour publier mes œuvres...',
      deletionReason: 'Candidature dupliquée, contenu inapproprié',
      processedBy: 'Admin Sophie',
      genres: ['Romance']
    },
    {
      id: 3,
      type: 'author_application',
      status: 'blocked',
      submittedAt: '2024-01-10',
      processedAt: '2024-01-12',
      authorPseudo: 'MarieCopycat',
      reasonToBeAuthor: 'Je veux écrire des histoires...',
      blockReason: 'Plagiat détecté dans les échantillons fournis',
      processedBy: 'Admin Lucas',
      genres: ['Mystery']
    },
    {
      id: 4,
      type: 'author_application',
      status: 'pending',
      submittedAt: '2024-02-10',
      processedAt: null,
      authorPseudo: 'MarieDuboisAuteur',
      reasonToBeAuthor: 'J\'ai corrigé les problèmes précédents et souhaite repostuler...',
      rejectionReason: null,
      processedBy: null,
      genres: ['Fantasy', 'Romance', 'Drama']
    }
  ];

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Refusée';
      case 'blocked': return 'Bloquée';
      case 'deleted': return 'Supprimée';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'blocked': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'deleted': return 'bg-red-600/20 text-red-300 border-red-600/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'blocked': return <Badge className="w-4 h-4" />;
      case 'deleted': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Pagination
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applicationHistory.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(applicationHistory.length / applicationsPerPage);

  const handleClose = () => {
    setCurrentPage(1);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl bg-slate-900/95 border-slate-700/50 backdrop-blur-sm animate-zoom-in max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-blue-400 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            Historique des candidatures - {user.name}
          </DialogTitle>
          <DialogDescription>Consultez l’historique des candidatures pour cet utilisateur.</DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 comments-history-scrollbar">
          {/* Informations utilisateur */}
          <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <p className="text-gray-500 text-xs">
                Total des candidatures: {applicationHistory.length}
              </p>
            </div>
          </div>

          {/* Liste des candidatures */}
          <div className="space-y-3">
            {currentApplications.map((application) => (
              <div key={application.id} 
                   className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:bg-slate-700/40 transition-colors">
                {/* Header de la candidature */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-600/50 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Candidature #{application.id}</h4>
                      <p className="text-gray-400 text-sm">Pseudo: {application.authorPseudo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(application.status)}
                    <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusDisplay(application.status)}
                    </span>
                  </div>
                </div>

                {/* Détails de la candidature */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Date de soumission</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-300 text-sm">{application.submittedAt}</span>
                      </div>
                    </div>
                    {application.processedAt && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Date de traitement</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-300 text-sm">{application.processedAt}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-1">Motivation</p>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-gray-200 text-sm line-clamp-2">{application.reasonToBeAuthor}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-1">Genres</p>
                    <div className="flex flex-wrap gap-1">
                      {application.genres.map((genre, index) => (
                        <span key={index} 
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Raison du refus/blocage/suppression */}
                  {application.rejectionReason && (
                    <div>
                      <p className="text-red-400 text-xs mb-1">Raison du refus</p>
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <p className="text-red-300 text-sm">{application.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  {application.blockReason && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Raison du blocage</p>
                      <div className="bg-gray-500/10 border border-gray-500/20 p-3 rounded-lg">
                        <p className="text-gray-300 text-sm">{application.blockReason}</p>
                      </div>
                    </div>
                  )}

                  {application.deletionReason && (
                    <div>
                      <p className="text-red-400 text-xs mb-1">Raison de la suppression</p>
                      <div className="bg-red-600/10 border border-red-600/20 p-3 rounded-lg">
                        <p className="text-red-300 text-sm">{application.deletionReason}</p>
                      </div>
                    </div>
                  )}

                  {application.processedBy && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Traité par: 
                        <button 
                          onClick={() => onUserClick && onUserClick(application.processedBy)}
                          className="text-blue-400 hover:text-blue-300 hover:underline ml-1"
                        >
                          {application.processedBy}
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message si aucune candidature */}
          {applicationHistory.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">Aucune candidature trouvée</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Page {currentPage} sur {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationHistoryModal; 