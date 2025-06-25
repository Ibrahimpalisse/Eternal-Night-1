import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DetailsModal, EditModal, QuickActionModal } from './modals/AuthorContentModals';
import ChapterDetailsModal from './modals/ChapterDetailsModal';
import ChapterEditModal from './modals/ChapterEditModal';
import DeleteContentDialog from './DeleteContentDialog';
import { StatusFilter } from './filters';
import { ActionMenu, Pagination } from './table';
import { 
  FileText,
  Search,
  User,
  Clock,
  CheckCircle,
  Pause,
  EyeOff,
  ArrowLeft,
  BookOpen,
  Plus,
  Filter
} from 'lucide-react';
import chaptersData from '../../data/chaptersData.json';

const ChaptersContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer les données du roman depuis les paramètres de navigation
  const romanData = location.state?.romanData || null;
  
  // États pour la gestion de l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // États pour les modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChapterEditModal, setShowChapterEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quickActionType, setQuickActionType] = useState('');
  const [chapters, setChapters] = useState([]);

  // Redirection si pas de données du roman
  useEffect(() => {
    if (!romanData) {
      navigate('/admin/authorsContent');
    }
  }, [romanData, navigate]);

  // Charger les données des chapitres au montage
  useEffect(() => {
    // Simuler le filtrage par roman si romanData existe
    const filteredChapters = romanData 
      ? chaptersData.chapters.filter(chapter => chapter.romanId === romanData.id)
      : chaptersData.chapters;
    
    setChapters(filteredChapters);
  }, [romanData]);

  // Liste des statuts disponibles pour les chapitres
  const availableStatuses = [
    { value: 'pending', label: 'En attente' },
    { value: 'ready_for_acceptance', label: 'Vérifié' },
    { value: 'accepted_unpublished', label: 'Accepté' },
    { value: 'published', label: 'Publié' },
    { value: 'unpublished', label: 'Dépublié' }
  ];
  
  // Fonction pour obtenir le statut badge
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'pending': 
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case 'ready_for_acceptance': 
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case 'accepted_unpublished': 
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      case 'published': 
        return `${baseClasses} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`;
      case 'unpublished': 
        return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
      default: 
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  // Fonction pour obtenir l'icône de statut
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'ready_for_acceptance': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'accepted_unpublished': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'unpublished': return <EyeOff className="w-4 h-4 text-orange-400" />;
      default: return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  // Fonction pour obtenir le texte de statut
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'ready_for_acceptance': return 'Vérifié';
      case 'accepted_unpublished': return 'Accepté';
      case 'published': return 'Publié';
      case 'unpublished': return 'Dépublié';
      default: return 'Inconnu';
    }
  };

  // Gestionnaires d'événements
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowChapterEditModal(true);
  };

  const handleChapterEdit = (updatedChapter) => {
    // Mettre à jour le chapitre dans la liste
    setChapters(prevChapters => 
      prevChapters.map(chapter => 
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      )
    );
    
    // Fermer la modale de détails
    setShowDetailsModal(false);
    
    // Afficher un message de confirmation (optionnel)
    console.log('Chapitre modifié avec succès:', updatedChapter.title);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteDialog(true);
  };

  const handleQuickAction = (item, actionType) => {
    // Gérer certaines actions directement sans modal
    if (actionType === 'accept') {
      handleAcceptChapter(item);
      return;
    }
    if (actionType === 'reject') {
      handleRejectChapter(item);
      return;
    }
    if (actionType === 'publish') {
      handlePublishChapter(item);
      return;
    }
    if (actionType === 'unpublish') {
      handleUnpublishChapter(item);
      return;
    }
    if (actionType === 'republish') {
      handleRepublishChapter(item);
      return;
    }
    
    // Pour les autres actions, utiliser le modal
    setSelectedItem(item);
    setQuickActionType(actionType);
    setShowQuickActionModal(true);
  };

  // Fonction pour accepter un chapitre vérifié
  const handleAcceptChapter = (chapter) => {
    const updatedChapter = {
      ...chapter,
      status: 'accepted_unpublished',
      moderationStatus: 'approved',
      acceptedAt: new Date().toISOString(),
      acceptedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    setChapters(prevChapters => 
      prevChapters.map(ch => 
        ch.id === chapter.id ? updatedChapter : ch
      )
    );
    
    console.log('Chapitre accepté:', updatedChapter.title);
  };

  // Fonction pour refuser un chapitre vérifié
  const handleRejectChapter = (chapter) => {
    const updatedChapter = {
      ...chapter,
      status: 'pending',
      moderationStatus: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    setChapters(prevChapters => 
      prevChapters.map(ch => 
        ch.id === chapter.id ? updatedChapter : ch
      )
    );
    
    console.log('Chapitre refusé:', updatedChapter.title);
  };

  // Fonction pour publier un chapitre accepté
  const handlePublishChapter = (chapter) => {
    const updatedChapter = {
      ...chapter,
      status: 'published',
      publishedAt: new Date().toISOString(),
      publishedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    setChapters(prevChapters => 
      prevChapters.map(ch => 
        ch.id === chapter.id ? updatedChapter : ch
      )
    );
    
    console.log('Chapitre publié:', updatedChapter.title);
  };

  // Fonction pour dépublier un chapitre publié
  const handleUnpublishChapter = (chapter) => {
    const updatedChapter = {
      ...chapter,
      status: 'unpublished',
      unpublishedAt: new Date().toISOString(),
      unpublishedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    setChapters(prevChapters => 
      prevChapters.map(ch => 
        ch.id === chapter.id ? updatedChapter : ch
      )
    );
    
    console.log('Chapitre dépublié:', updatedChapter.title);
  };

  // Fonction pour republier un chapitre dépublié
  const handleRepublishChapter = (chapter) => {
    const updatedChapter = {
      ...chapter,
      status: 'published',
      republishedAt: new Date().toISOString(),
      republishedBy: 'Admin' // À remplacer par l'utilisateur connecté
    };
    
    setChapters(prevChapters => 
      prevChapters.map(ch => 
        ch.id === chapter.id ? updatedChapter : ch
      )
    );
    
    console.log('Chapitre republié:', updatedChapter.title);
  };

  const confirmDelete = async (item, password) => {
    try {
      // Logique de suppression ici
      console.log('Suppression du chapitre:', item.id, 'avec mot de passe:', password);
      setShowDeleteDialog(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Filtrage des chapitres
  const filteredChapters = chapters.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.chapterNumber.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || chapter.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredChapters.slice(startIndex, startIndex + itemsPerPage);

  // Fonction pour formater le nombre de mots
  const formatWordCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k mots`;
    }
    return `${count} mots`;
  };

  if (!romanData) {
    return null; // Le useEffect redirigera
  }

  return (
    <div className="admin-page space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6 w-full min-w-0 overflow-hidden">
      {/* En-tête avec retour */}
      <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
        <button
          onClick={() => navigate('/admin/authorsContent')}
          className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour aux romans</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
              {romanData.title}"
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              Par {romanData.author} • {filteredChapters.length} chapitre(s)
            </p>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-3 sm:p-4 md:p-6 w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center">
          {/* Barre de recherche */}
          <div className="relative flex-1 w-full lg:w-auto min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            <StatusFilter
              value={filterStatus}
              onChange={setFilterStatus}
              statuses={availableStatuses}
            />
          </div>
        </div>

        {/* Filtres actifs */}
        {(searchTerm || filterStatus !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700/50 w-full overflow-hidden">
            <span className="text-gray-400 text-xs sm:text-sm flex-shrink-0">Filtres actifs:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2 flex-1 min-w-0">
              {searchTerm && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium truncate">
                  "{searchTerm}"
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
                  {filterStatus === 'pending' && 'En attente'}
                  {filterStatus === 'ready_for_acceptance' && 'Vérifié'}
                  {filterStatus === 'accepted_unpublished' && 'Accepté'}
                  {filterStatus === 'published' && 'Publié'}
                  {filterStatus === 'unpublished' && 'Dépublié'}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="flex-shrink-0 px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium hover:bg-red-500/30 transition-colors"
            >
              Effacer
            </button>
          </div>
        )}
      </div>

      {/* Table/Liste - Optimisée pour mobile */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden w-full">
        {/* Version mobile - Cards optimisées */}
        <div className="block sm:hidden">
          <div className="divide-y divide-slate-700/50">
            {currentItems.map((item) => (
              <div key={item.id} className="p-3 hover:bg-slate-700/25 transition-colors w-full overflow-hidden">
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex items-start gap-2 flex-1 min-w-0 overflow-hidden">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold text-xs">{item.chapterNumber}</span>
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-white font-medium truncate text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-1 truncate">
                        Ch. {item.chapterNumber} • {formatWordCount(item.wordCount)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {getStatusIcon(item.status)}
                        <span className={`${getStatusBadge(item.status)} text-xs px-1.5 py-0.5`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      {item.views > 0 && (
                        <p className="text-gray-500 text-xs mt-1">
                          {item.views} lectures
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ActionMenu
                      item={item}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onQuickAction={handleQuickAction}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version desktop - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="w-1/3 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Chapitre
                  </th>
                  <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Contenu
                  </th>
                  <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Lectures
                  </th>
                  <th className="w-1/6 px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="w-16 px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/25 transition-colors">
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 font-bold text-sm">{item.chapterNumber}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium truncate text-sm sm:text-base">{item.title}</p>
                          <p className="text-gray-400 text-xs sm:text-sm truncate">
                            Chapitre {item.chapterNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={getStatusBadge(item.status)}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                      <div className="text-gray-300 text-sm">
                        {formatWordCount(item.wordCount)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden lg:table-cell">
                      <div className="text-gray-300 text-sm">
                        {item.views > 0 ? item.views.toLocaleString() : '0'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden lg:table-cell">
                      <div className="text-gray-400 text-sm">
                        {new Date(item.submittedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex justify-center">
                        <ActionMenu
                          item={item}
                          onView={handleViewDetails}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onQuickAction={handleQuickAction}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Affichage si aucun résultat */}
      {currentItems.length === 0 && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Aucun chapitre trouvé</h3>
          <p className="text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'Aucun chapitre ne correspond à vos critères de recherche.'
              : 'Ce roman n\'a pas encore de chapitres.'
            }
          </p>
        </div>
      )}

      {/* Modales */}
      {showDetailsModal && selectedItem && (
        <ChapterDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          chapter={selectedItem}
          onEdit={handleChapterEdit}
        />
      )}

      {showChapterEditModal && selectedItem && (
        <ChapterEditModal
          isOpen={showChapterEditModal}
          onClose={() => setShowChapterEditModal(false)}
          chapter={selectedItem}
          onSave={handleChapterEdit}
        />
      )}

      {showDeleteDialog && selectedItem && (
        <DeleteContentDialog
          isOpen={showDeleteDialog}
          setIsOpen={setShowDeleteDialog}
          item={selectedItem}
          onConfirm={confirmDelete}
          type="chapter"
        />
      )}

      {showQuickActionModal && selectedItem && (
        <QuickActionModal
          item={selectedItem}
          actionType={quickActionType}
          onClose={() => setShowQuickActionModal(false)}
          onConfirm={(action, reason) => {
            console.log('Action rapide:', action, 'Raison:', reason);
            setShowQuickActionModal(false);
          }}
          type="chapter"
        />
      )}
    </div>
  );
};

export default ChaptersContent; 