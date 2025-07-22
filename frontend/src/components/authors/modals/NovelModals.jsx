import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, Edit, Trash2, Eye, Calendar, User, Heart, MessageCircle, Send, FileEdit, ChevronDown, Check, AlertCircle, Search, Upload, Clock } from 'lucide-react';

// Composant de sélection multiple pour les genres avec recherche
const MultiSelectGenres = ({ selectedGenres, onGenresChange, availableGenres }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleGenreToggle = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    onGenresChange(updatedGenres);
  };

  // Filtrer les genres selon le terme de recherche
  const filteredGenres = availableGenres.filter(genre =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la fermeture du dropdown
  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between"
      >
        <span className="text-left">
          {selectedGenres.length > 0 
            ? `${selectedGenres.length} genre(s) sélectionné(s)`
            : "Sélectionnez des genres"
          }
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden">
          {/* Barre de recherche */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Liste des genres */}
          <div className="max-h-44 overflow-y-auto">
            {filteredGenres.length > 0 ? (
              filteredGenres.map((genre) => (
            <div
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className="flex items-center px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className={`w-4 h-4 border border-white/30 rounded flex items-center justify-center mr-3 ${
                selectedGenres.includes(genre) ? 'bg-blue-600 border-blue-600' : ''
              }`}>
                {selectedGenres.includes(genre) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-white">{genre}</span>
            </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                Aucun genre trouvé pour "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Afficher les genres sélectionnés */}
      {selectedGenres.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <span
              key={genre}
              className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-medium"
            >
              {genre}
              <button
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className="ml-1 hover:text-red-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Overlay pour fermer le dropdown en cliquant à l'extérieur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
      )}
    </div>
  );
};

// Modal pour voir les détails d'un roman - Version améliorée
export const NovelDetailsModal = ({ 
  novel, 
  isOpen, 
  onClose, 
  setShowEditModal, 
  setShowDeleteModal, 
  setShowRequestModal,
  onPublish 
}) => {
  if (!isOpen || !novel) return null;

  const statusConfig = {
    draft: { label: 'Brouillon', className: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
    pending: { label: 'En attente', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    accepted: { label: 'Accepté', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    published: { label: 'Publié', className: 'bg-green-500/20 text-green-300 border-green-500/30' }
  };

  const status = statusConfig[novel.status] || statusConfig.draft;

  // Calculer les données supplémentaires
  const bookmarkedUsers = novel.bookmarked || Math.floor(novel.likes * 0.3); // Estimation basée sur les likes
  const releaseDate = novel.status === 'published' ? novel.publishedAt || novel.updatedAt : null;

  // Déterminer les actions autorisées selon le statut
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

  const actions = getAvailableActions(novel.status);
  console.log('🎯 Novel status:', novel.status, 'Available actions:', actions);

  const handleEdit = () => {
    setShowEditModal && setShowEditModal();
  };

  const handleDelete = () => {
    setShowDeleteModal && setShowDeleteModal();
  };

  const handleRequest = () => {
    setShowRequestModal && setShowRequestModal();
  };

  const handlePublishAction = () => {
    onPublish && onPublish();
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[9999]">
        <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-md max-h-[95vh] overflow-y-auto relative">
          {/* Bouton de fermeture fixe en haut à droite */}
            <button
              onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-lg hover:bg-white/10 transition-colors z-10 bg-gray-900/50 backdrop-blur-sm"
            >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-white transition-colors" />
            </button>

          <div className="p-6 flex flex-col items-center text-center">
              {/* Image du roman */}
            <div className="w-32 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden mb-6">
                {novel.coverImage ? (
                  <img 
                    src={novel.coverImage} 
                    alt={novel.title}
                  className="w-full h-full object-cover"
                  />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-purple-400">
                  {novel.title.charAt(0)}
                </div>
                )}
              </div>
              
            {/* Titre et statut */}
            <h2 className="text-2xl font-bold text-white mb-2">{novel.title}</h2>
            
            {/* Vues */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-400" />
                <span className="text-lg font-semibold text-white">{novel.views || 0}</span>
              </div>
            </div>

            <div className="text-gray-300 mb-6 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">{novel.description}</div>
                
                {/* Statut et catégories */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[novel.status].className}`}>
                {statusConfig[novel.status].label}
                  </span>
              {Array.isArray(novel.categories) && novel.categories.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-sm"
                >
                        {category}
                      </span>
              ))}
                </div>

            {/* Statistiques cliquables */}
            <div className="grid grid-cols-3 gap-4 w-full mb-6">
              <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-lg font-semibold text-white">{novel.chapters}</span>
                <span className="text-sm text-gray-400">Chapitres</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-lg">
                <Heart className="w-5 h-5 text-red-400 mb-1" />
                <span className="text-lg font-semibold text-white">{novel.likes}</span>
                <span className="text-sm text-gray-400">Favoris</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-400 mb-1" />
                <span className="text-lg font-semibold text-white">{novel.comments}</span>
                <span className="text-sm text-gray-400">Commentaires</span>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="w-full space-y-4 mb-6 border-t border-white/10 pt-4">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-300 bg-slate-800/30 p-3 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Dernière mise à jour</span>
                    <span className="text-sm">{new Date(novel.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-300 bg-slate-800/30 p-3 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Date de création</span>
                    <span className="text-sm">{new Date(novel.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>


            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 justify-center mt-6 flex-wrap">
              {actions.canRequest && (
            <button
                  onClick={handleRequest}
                  className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-lg flex items-center gap-2 transition-colors"
            >
                  <Send className="w-4 h-4" />
                  Faire une demande
            </button>
              )}
              
              {actions.canPublish && (
                <button
                  onClick={handlePublishAction}
                  className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Publier
                </button>
              )}
              
              {actions.canEdit && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
              )}
              
              {actions.canDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              )}
              
              {/* Message pour les romans en attente */}
              {novel.status === 'pending' && (
                <div className="w-full text-center">
                  <p className="text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Roman en cours d'examen. Aucune action disponible pour le moment.
                  </p>
                </div>
              )}
              </div>
              
                        {/* Date de création */}
            <div className="flex items-center justify-center gap-2 text-gray-400 mt-6">
              <Calendar className="w-4 h-4" />
              <span>Créé le {new Date(novel.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// Modal de confirmation de suppression
export const DeleteNovelModal = ({ novel, isOpen, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !novel) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(novel);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-red-500/20 rounded-xl w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Supprimer le roman</h2>
          </div>

          <p className="text-gray-300 mb-2 text-sm sm:text-base">
            Êtes-vous sûr de vouloir supprimer le roman :
          </p>
          <p className="text-white font-medium mb-4 text-sm sm:text-base break-words">"{novel.title}"</p>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-300 text-xs sm:text-sm">
              <strong>Attention :</strong> Cette action est irréversible. Tous les chapitres et commentaires associés seront également supprimés.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Modal pour créer/modifier un roman
export const NovelEditModal = ({ novel = null, isOpen, onClose, onSave, onRequest }) => {
  const [formData, setFormData] = useState({
    title: novel?.title || '',
    description: novel?.description || '',
    categories: novel?.categories || (novel?.category ? [novel.category] : []),
    status: novel?.status || 'draft'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(novel?.coverImage || null);
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = !!novel;

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Réinitialiser le formulaire quand la modal s'ouvre
  React.useEffect(() => {
    if (isOpen && novel) {
      setFormData({
        title: novel.title || '',
        description: novel.description || '',
        categories: novel.categories || (novel.category ? [novel.category] : []),
        status: novel.status || 'draft'
      });
      setImagePreview(novel.coverImage || null);
      setSelectedImage(null);
    }
  }, [isOpen, novel]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation : au moins un genre doit être sélectionné
    if (formData.categories.length === 0) {
      alert('Veuillez sélectionner au moins un genre');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(formData, novel?.id, selectedImage);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    'Fantasy', 'Science-Fiction', 'Romance', 'Thriller', 'Mystère',
    'Aventure', 'Historique', 'Contemporain', 'Young Adult', 'Horreur'
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white pr-4">
              {isEdit ? 'Modifier le roman' : 'Nouveau roman'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Couverture */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Couverture
              </label>
              <div className="flex items-center gap-4">
                <div className={`
                  w-24 h-32 sm:w-32 sm:h-40 rounded-lg border-2 border-dashed
                  ${imagePreview ? 'border-white/10' : 'border-white/20'}
                  flex items-center justify-center overflow-hidden
                  ${!imagePreview && 'hover:bg-white/5'} transition-colors
                  relative group
                `}>
                  {imagePreview ? (
                    <>
                    <img 
                      src={imagePreview} 
                        alt="Couverture"
                      className="w-full h-full object-cover"
                    />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs">Changer</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Ajouter une couverture
                      </p>
                </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">
                    Format recommandé : JPG, PNG
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Taille maximale : 2 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Nom du roman *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                placeholder="Entrez le nom de votre roman..."
                required
              />
            </div>

            {/* Genres/Catégories */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Genres *
              </label>
              <MultiSelectGenres
                selectedGenres={formData.categories}
                onGenresChange={(genres) => setFormData({ ...formData, categories: genres })}
                availableGenres={categories}
              />
              {formData.categories.length === 0 && (
                <p className="text-red-400 text-xs mt-1">Au moins un genre doit être sélectionné</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm sm:text-base"
                placeholder="Décrivez votre roman..."
                required
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 sm:px-6 py-2 sm:py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-sm sm:text-base order-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base order-1 sm:order-3"
            >
              {isSaving ? 'Application...' : 'Appliquer'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// Modal pour faire une demande (vérification ou modification)
export const RequestModal = ({ novel, isOpen, onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !novel) return null;

  const requestTypes = [
    {
      id: 'verification',
      label: 'Demande de vérification',
      description: 'Demander à un administrateur de vérifier et valider votre roman',
      icon: <AlertCircle className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20'
    },
    {
      id: 'modification',
      label: 'Demande de modification',
      description: 'Demander une modification de votre roman',
      icon: <FileEdit className="w-5 h-5 text-orange-400" />,
      color: 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedType) {
      alert('Veuillez sélectionner un type de demande');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(novel, selectedType);
      onClose();
      setSelectedType('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedType('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1 pr-4">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Faire une demande</h2>
              <p className="text-gray-400 text-xs sm:text-sm break-words">Pour le roman : <span className="text-white font-medium">"{novel.title}"</span></p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>

          {/* Types de demandes */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
              Type de demande *
            </label>
            {requestTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`cursor-pointer p-3 sm:p-4 border rounded-lg transition-all duration-200 ${
                  selectedType === type.id 
                    ? `${type.color} border-opacity-100`
                    : 'border-white/10 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {React.cloneElement(type.icon, { 
                      className: "w-4 h-4 sm:w-5 sm:h-5 text-blue-400" 
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-1 text-sm sm:text-base">{type.label}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-tight">{type.description}</p>
                  </div>
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 border border-white/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedType === type.id ? 'bg-blue-600 border-blue-600' : ''
                  }`}>
                    {selectedType === type.id && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 sm:mb-6">
            <p className="text-blue-300 text-xs sm:text-sm leading-relaxed">
              <strong>Note :</strong> Votre demande sera envoyée aux administrateurs qui examineront votre roman et vous répondront dans les plus brefs délais.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedType}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Envoi...</span>
                  <span className="sm:hidden">Envoi</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Envoyer la demande</span>
                  <span className="sm:hidden">Envoyer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Nouveau composant pour la création de roman
export const CreateNovelModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],
    status: 'draft'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Réinitialiser le formulaire quand la modal s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        categories: [],
        status: 'draft'
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation : au moins un genre doit être sélectionné
    if (formData.categories.length === 0) {
      alert('Veuillez sélectionner au moins un genre');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(formData, null, selectedImage);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    'Fantasy', 'Science-Fiction', 'Romance', 'Thriller', 'Mystère',
    'Aventure', 'Historique', 'Contemporain', 'Young Adult', 'Horreur'
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white pr-4">
              Nouveau roman
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
    </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Couverture */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Couverture
              </label>
              <div className="flex items-center gap-4">
                <div className={`
                  w-24 h-32 sm:w-32 sm:h-40 rounded-lg border-2 border-dashed
                  ${imagePreview ? 'border-white/10' : 'border-white/20'}
                  flex items-center justify-center overflow-hidden
                  ${!imagePreview && 'hover:bg-white/5'} transition-colors
                  relative group
                `}>
                  {imagePreview ? (
                    <>
                    <img 
                      src={imagePreview} 
                        alt="Couverture"
                      className="w-full h-full object-cover"
                    />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs">Changer</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Ajouter une couverture
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">
                    Format recommandé : JPG, PNG
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Taille maximale : 2 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Nom du roman *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                placeholder="Entrez le nom de votre roman..."
                required
              />
            </div>

            {/* Genres/Catégories */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Genres *
              </label>
              <MultiSelectGenres
                selectedGenres={formData.categories}
                onGenresChange={(genres) => setFormData({ ...formData, categories: genres })}
                availableGenres={categories}
              />
              {formData.categories.length === 0 && (
                <p className="text-red-400 text-xs mt-1">Au moins un genre doit être sélectionné</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm sm:text-base"
                placeholder="Décrivez votre roman..."
                required
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 sm:px-6 py-2 sm:py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-sm sm:text-base order-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Création...</span>
                  <span className="sm:hidden">Création</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Créer le roman</span>
                  <span className="sm:hidden">Créer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}; 