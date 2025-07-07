import React, { useState, useEffect } from 'react';
import { Copy, Download, User, BookOpen, Calendar, Eye, Edit, FileText, X, MoreVertical, Send, Trash2, CheckCircle, Clock, AlertTriangle, Info } from 'lucide-react';

const ChapterViewModal = ({ isOpen, onClose, chapter }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  
  // États pour les popups de confirmation
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [requestType, setRequestType] = useState('');

  useEffect(() => {
    if (chapter) {
      setContent(chapter.content || '');
      setIsEditing(false);
    }
  }, [chapter]);

  // Move the click outside handler here and make it work for all cases
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only handle click outside if the menu is shown
      if (showActionMenu) {
        setShowActionMenu(false);
      }
    };
    
    // Always add the listener, but it will only do something when showActionMenu is true
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showActionMenu]);

  if (!isOpen || !chapter) return null;

  // Configuration des statuts pour les badges
  const statusConfig = {
    draft: { label: 'Brouillon', className: 'bg-gray-500/20 text-gray-300 border-gray-500/30', color: 'text-gray-400' },
    pending: { label: 'En attente', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', color: 'text-yellow-400' },
    accepted: { label: 'Accepté', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30', color: 'text-blue-400' },
    published: { label: 'Publié', className: 'bg-green-500/20 text-green-300 border-green-500/30', color: 'text-green-400' }
  };

  // Déterminer les actions disponibles selon le statut
  const getAvailableActions = (status) => {
    switch (status) {
      case 'published':
        return {
          canRequest: true,
          canEdit: false,
          canDelete: false,
          canPublish: false
        };
      case 'accepted':
        return {
          canRequest: true,
          canEdit: false,
          canDelete: true,
          canPublish: true
        };
      case 'pending':
        return {
          canRequest: false,
          canEdit: false,
          canDelete: false,
          canPublish: false
        };
      case 'draft':
      default:
        return {
          canRequest: true,
          canEdit: true,
          canDelete: true,
          canPublish: false
        };
    }
  };

  const actions = getAvailableActions(chapter.status);
  const currentStatus = statusConfig[chapter.status] || statusConfig.draft;

  const handleSave = () => {
    // Ici vous pouvez implémenter la sauvegarde du contenu
    console.log('Sauvegarder le chapitre:', { ...chapter, content });
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    // Vous pouvez ajouter une notification ici
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${chapter.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRequest = () => {
    setShowRequestDialog(true);
    setShowActionMenu(false);
  };

  const handlePublish = () => {
    setShowPublishDialog(true);
    setShowActionMenu(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setShowActionMenu(false);
  };

  const confirmRequest = () => {
    console.log('Demande confirmée pour le chapitre:', chapter, 'Type:', requestType);
    setShowRequestDialog(false);
    setRequestType('');
    // Appeler l'API pour soumettre la demande
  };

  const confirmPublish = () => {
    console.log('Publication confirmée pour le chapitre:', chapter);
    setShowPublishDialog(false);
    // Appeler l'API pour publier
  };

  const confirmDelete = () => {
    console.log('Suppression confirmée pour le chapitre:', chapter);
    setShowDeleteDialog(false);
    // Appeler l'API pour supprimer
  };

  // Composant de dialogue réutilisable
  const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmIcon, confirmClass }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-sm">{message}</p>
          </div>
          <div className="border-t border-slate-700 p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-slate-700/50 rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${confirmClass}`}
            >
              {confirmIcon}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Nouveau composant de dialogue pour les demandes
  const RequestDialog = ({ isOpen, onClose, onConfirm, novelTitle }) => {
    if (!isOpen) return null;

    const isPublishedOrAccepted = chapter.status === 'published' || chapter.status === 'accepted';
    const isDraft = chapter.status === 'draft';

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">
              {isDraft ? "Demande de validation" : "Faire une demande"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <p className="text-gray-400 mb-4">Pour le chapitre : <span className="text-white">"{chapter.title}"</span></p>
            
            <div className="space-y-3">
              {isDraft && (
                <div 
                  className="p-4 rounded-lg border bg-slate-700/50 border-purple-500/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ease-in-out"
                      style={{
                        borderColor: '#A855F7',
                        backgroundColor: '#A855F7'
                      }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Demande de validation</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Soumettre votre chapitre pour validation par les administrateurs
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isPublishedOrAccepted && (
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    requestType === 'modification' 
                      ? 'bg-slate-700/50 border-purple-500/50' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setRequestType('modification')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ease-in-out"
                      style={{
                        borderColor: requestType === 'modification' ? '#A855F7' : '#475569',
                        backgroundColor: requestType === 'modification' ? '#A855F7' : 'transparent'
                      }}
                    >
                      {requestType === 'modification' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Demande de modification</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Demander une modification de votre chapitre
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="text-sm text-blue-300">
                  {isDraft 
                    ? "Une fois soumis, votre chapitre sera examiné par les administrateurs. Vous ne pourrez plus le modifier pendant l'examen."
                    : "Votre demande sera envoyée aux administrateurs qui examineront votre chapitre et vous répondront dans les plus brefs délais."
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-slate-700/50 rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (isDraft) {
                  setRequestType('verification');
                }
                onConfirm();
              }}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
              {isDraft ? "Soumettre pour validation" : "Envoyer la demande"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col">
        <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 w-full h-full flex flex-col overflow-hidden">
          {/* En-tête */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 md:p-4 lg:p-6 border-b border-slate-700/50 gap-3 lg:gap-0">
            <div className="flex items-start lg:items-center gap-3 md:gap-4 w-full lg:w-auto pr-8 lg:pr-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-purple-400 font-bold text-sm md:text-lg">{chapter.chapterNumber}</span>
              </div>
              <div className="min-w-0 flex-1 lg:flex-none">
                <h2 className="text-lg md:text-xl font-semibold text-white truncate pr-2">{chapter.title}</h2>
                <div className="flex flex-wrap items-center gap-1 md:gap-2 lg:gap-4 text-xs md:text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                    <span className="truncate max-w-[80px] md:max-w-none">Auteur</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                    <span className="truncate max-w-[120px] md:max-w-none">{chapter.novelTitle}</span>
                  </div>
                  <div className="flex items-center gap-1 hidden md:flex">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                    <span className="whitespace-nowrap">{new Date(chapter.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                    <span className="whitespace-nowrap">{chapter.views || 0} vues</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 hover:bg-slate-700/50 rounded-lg transition-colors absolute top-3 right-3 md:top-4 md:right-4"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>
          </div>

          {/* Statut et informations */}
          <div className="px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 border-b border-slate-700/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${currentStatus.color === 'text-green-400' ? 'bg-green-400' : currentStatus.color === 'text-blue-400' ? 'bg-blue-400' : currentStatus.color === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                  <span className={`${currentStatus.color} text-xs md:text-sm font-medium`}>{currentStatus.label}</span>
                </div>
                <span className="text-gray-400 text-xs md:text-sm whitespace-nowrap">{content.split(' ').length} mots</span>
                <span className="text-gray-400 text-xs md:text-sm hidden lg:inline whitespace-nowrap">
                  {chapter.status === 'published' ? 'Publié' : 'Créé'} le {new Date(chapter.publishedAt || chapter.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-slate-700/50 text-gray-300 rounded-md md:rounded-lg hover:bg-slate-600/50 transition-colors text-xs md:text-sm"
                >
                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Copier</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-slate-700/50 text-gray-300 rounded-md md:rounded-lg hover:bg-slate-600/50 transition-colors text-xs md:text-sm"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden lg:inline">Télécharger</span>
                </button>
                
                {/* Menu d'actions */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionMenu(!showActionMenu);
                    }}
                    className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-slate-700/50 text-gray-300 rounded-md md:rounded-lg hover:bg-slate-600/50 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  {showActionMenu && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-lg shadow-2xl z-50 py-1">
                      {actions.canEdit && (
                        <button
                          onClick={() => {
                            setIsEditing(!isEditing);
                            setShowActionMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-purple-300 hover:bg-purple-500/10 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                      )}
                      
                      {actions.canRequest && chapter.status === 'draft' && (
                        <button
                          onClick={handleRequest}
                          className="w-full text-left px-3 py-2 text-purple-300 hover:bg-purple-500/10 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Send className="w-4 h-4" />
                          Faire une demande
                        </button>
                      )}
                      
                      {actions.canRequest && (chapter.status === 'published' || chapter.status === 'accepted') && (
                        <button
                          onClick={handleRequest}
                          className="w-full text-left px-3 py-2 text-purple-300 hover:bg-purple-500/10 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Send className="w-4 h-4" />
                          Faire une demande
                        </button>
                      )}
                      
                      {actions.canPublish && (
                        <button
                          onClick={handlePublish}
                          className="w-full text-left px-3 py-2 text-green-300 hover:bg-green-500/10 transition-colors flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Publier
                        </button>
                      )}
                      
                      {actions.canDelete && (
                        <button
                          onClick={handleDelete}
                          className="w-full text-left px-3 py-2 text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      )}
                      
                      {chapter.status === 'pending' && (
                        <div className="px-3 py-2 text-yellow-300 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          En cours d'examen
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-y-auto">
            {isEditing ? (
              <div className="h-full flex flex-col p-3 md:p-4 lg:p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrivez votre chapitre ici..."
                  className="flex-1 w-full p-3 md:p-4 lg:p-6 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none text-sm md:text-base leading-relaxed"
                  style={{ minHeight: 'calc(100vh - 280px)' }}
                />
                <div className="flex items-center justify-between mt-3 md:mt-4">
                  <div className="text-xs md:text-sm text-gray-400">
                    {content.split(' ').filter(word => word.length > 0).length} mots
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 bg-slate-700/50 text-gray-300 rounded-md md:rounded-lg hover:bg-slate-700/70 transition-colors text-xs md:text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md md:rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 text-xs md:text-sm"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-full px-3 md:px-4 lg:px-6 py-3 md:py-4">
                <div className="w-full max-w-[90ch] md:max-w-[75ch] lg:max-w-[65ch] mx-auto">
                  {content ? (
                    <div 
                      className="text-gray-300 whitespace-pre-wrap text-sm md:text-base lg:text-[1.1rem] leading-[1.6] md:leading-[1.7] lg:leading-[1.8]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {content}
                    </div>
                  ) : (
                    <div className="text-center py-12 md:py-16 lg:py-20">
                      <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                      <p className="text-gray-400 text-base md:text-lg">Ce chapitre est vide</p>
                      <p className="text-gray-500 text-xs md:text-sm mt-2">Cliquez sur "Modifier" pour commencer à écrire</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pied de page avec boutons d'action */}
          {!isEditing && (
            <div className="px-3 md:px-4 lg:px-6 py-3 md:py-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={onClose}
                  className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 bg-slate-700/50 text-gray-300 rounded-md md:rounded-lg hover:bg-slate-700/70 transition-colors text-xs md:text-sm"
                >
                  Fermer
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 md:px-4 lg:px-6 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md md:rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 text-xs md:text-sm"
                >
                  <span className="hidden md:inline">Modifier le chapitre</span>
                  <span className="md:hidden">Modifier</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs de confirmation */}
        <RequestDialog
          isOpen={showRequestDialog}
          onClose={() => {
            setShowRequestDialog(false);
            setRequestType('');
          }}
          onConfirm={confirmRequest}
          novelTitle={chapter.novelTitle}
        />

        <ConfirmDialog
          isOpen={showPublishDialog}
          onClose={() => setShowPublishDialog(false)}
          onConfirm={confirmPublish}
          title="Publier le chapitre"
          message="Êtes-vous sûr de vouloir publier ce chapitre ? Une fois publié, il sera visible par tous les lecteurs."
          confirmText="Publier"
          confirmIcon={<CheckCircle className="w-4 h-4" />}
          confirmClass="bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30"
        />

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Supprimer le chapitre"
          message="Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est irréversible."
          confirmText="Supprimer"
          confirmIcon={<Trash2 className="w-4 h-4" />}
          confirmClass="bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30"
        />
      </div>
    </>
  );
};

export default ChapterViewModal; 