import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  Save, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  EyeOff,
  User,
  Calendar,
  Type,
  Hash,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import { FormValidation } from '../../../utils/validation';

const ChapterEditModal = ({ isOpen, onClose, chapter, onSave }) => {
  const [formData, setFormData] = useState({
    chapterNumber: '',
    title: '',
    content: '',
    comment: '',
    isVerified: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (chapter) {
      setFormData({
        chapterNumber: chapter.chapterNumber || '',
        title: chapter.title || '',
        content: chapter.content || '',
        comment: chapter.comment || '',
        isVerified: chapter.isVerified || false
      });
    }
  }, [chapter]);

  useEffect(() => {
    if (formData.content) {
      const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  }, [formData.content]);

  const validateForm = () => {
    try {
      // Convertir chapterNumber en nombre pour la validation Zod
      const dataToValidate = {
        ...formData,
        chapterNumber: parseInt(formData.chapterNumber) || 0
      };
      
      FormValidation.chapterEditSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      
      error.errors.forEach(err => {
        const fieldName = err.path[0];
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = err.message;
        }
      });
      
      setErrors(newErrors);
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Déterminer le nouveau statut en fonction de la vérification
      let newStatus = chapter.status;
      let newModerationStatus = chapter.moderationStatus;
      
      if (chapter.status === 'pending' && formData.isVerified) {
        // Si le chapitre était en attente et qu'il est maintenant vérifié
        newStatus = 'ready_for_acceptance';
        newModerationStatus = 'verified';
      } else if (chapter.status !== 'pending') {
        // Si ce n'était pas un chapitre en attente, il redevient pending après modification
        newStatus = 'pending';
        newModerationStatus = 'pending';
      }
      // Si c'est pending et pas vérifié, on garde pending

      const updatedChapter = {
        ...chapter,
        chapterNumber: parseInt(formData.chapterNumber),
        title: formData.title.trim(),
        content: formData.content.trim(),
        comment: formData.comment.trim(),
        wordCount: wordCount,
        status: newStatus,
        moderationStatus: newModerationStatus,
        modifiedAt: new Date().toISOString(),
        isVerified: formData.isVerified,
        // Ajouter les infos de modération si vérifié
        ...(formData.isVerified && chapter.status === 'pending' && {
          moderatedAt: new Date().toISOString(),
          moderatedBy: 'Admin' // À remplacer par l'utilisateur connecté
        })
      };

      await onSave(updatedChapter);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Fonction pour formater le nombre de mots
  const formatWordCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k mots`;
    }
    return `${count} mots`;
  };

  // Fonction pour obtenir le statut après modification
  const getPostEditStatus = () => {
    // Si le chapitre est en pending et que la checkbox est cochée
    if (chapter.status === 'pending' && formData.isVerified) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-400" />,
        text: 'Vérifié - Prêt pour acceptation',
        badge: 'bg-green-500/20 text-green-400 border border-green-500/30'
      };
    }
    
    // Si le chapitre n'était pas en pending, il redevient pending
    if (chapter.status !== 'pending') {
      return {
        icon: <Clock className="w-4 h-4 text-yellow-400" />,
        text: 'En attente de vérification',
        badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      };
    }
    
    // Si c'est pending et pas vérifié, reste pending
    return {
      icon: <Clock className="w-4 h-4 text-yellow-400" />,
      text: 'En attente de vérification',
      badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    };
  };

  if (!chapter) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-xl transition-all h-full sm:h-auto sm:max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-4 sm:p-6 shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Dialog.Title className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">
                          Modifier le chapitre
                        </Dialog.Title>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            {chapter.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(chapter.submittedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white transition-colors shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto chapter-edit-scrollbar p-4 sm:p-6">
                  {errors.submit && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {errors.submit}
                    </div>
                  )}

                  <form className="space-y-4 sm:space-y-6">
                    {/* Numéro et Titre - Séparés en deux champs */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
                      {/* Numéro de chapitre */}
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Hash className="w-4 h-4 inline mr-2" />
                          Numéro
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.chapterNumber}
                          onChange={(e) => handleInputChange('chapterNumber', e.target.value)}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm sm:text-base ${
                            errors.chapterNumber ? 'border-red-500/50' : 'border-slate-600/50'
                          }`}
                          placeholder="1"
                        />
                        {errors.chapterNumber && (
                          <p className="mt-1 text-sm text-red-400">{errors.chapterNumber}</p>
                        )}
                      </div>

                      {/* Titre du chapitre */}
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Type className="w-4 h-4 inline mr-2" />
                          Titre du chapitre
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm sm:text-base ${
                            errors.title ? 'border-red-500/50' : 'border-slate-600/50'
                          }`}
                          placeholder="Entrez le titre du chapitre"
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                        )}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-300">
                          <FileText className="w-4 h-4 inline mr-2" />
                          Contenu du chapitre
                        </label>
                        <span className="text-xs text-gray-400">
                          {formatWordCount(wordCount)}
                        </span>
                      </div>
                      <textarea
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        rows={15}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none text-sm sm:text-base ${
                          errors.content ? 'border-red-500/50' : 'border-slate-600/50'
                        }`}
                        placeholder="Écrivez le contenu du chapitre ici..."
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-400">{errors.content}</p>
                      )}
                    </div>

                    {/* Commentaire admin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Commentaire administrateur (optionnel)
                      </label>
                      <textarea
                        value={formData.comment}
                        onChange={(e) => handleInputChange('comment', e.target.value)}
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none text-sm sm:text-base"
                        placeholder="Ajoutez un commentaire pour l'auteur..."
                      />
                    </div>

                    {/* Section vérification pour les chapitres en attente */}
                    {chapter.status === 'pending' && (
                      <div className="bg-slate-700/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-600/30">
                        <div className="flex items-center gap-3 mb-4">
                          <Clock className="w-5 h-5 text-yellow-400" />
                          <h3 className="text-white font-medium">Modération du chapitre</h3>
                        </div>
                        
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isVerified}
                            onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                            className="mt-1 w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500/50 focus:ring-2"
                          />
                          <div>
                            <span className="text-white font-medium">Marquer comme vérifié</span>
                            <p className="text-gray-400 text-sm mt-1">
                              Ce chapitre sera vérifié et prêt pour acceptation par un administrateur.
                            </p>
                          </div>
                        </label>

                        {/* Aperçu du nouveau statut */}
                        <div className="mt-4 p-3 bg-slate-600/20 rounded-lg border border-slate-600/30">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-300">Nouveau statut :</span>
                            {getPostEditStatus().icon}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostEditStatus().badge}`}>
                              {getPostEditStatus().text}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 sm:p-6 shrink-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
                    <button
                      onClick={onClose}
                      className="order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-slate-600/50 text-gray-300 hover:text-white hover:border-slate-500/50 transition-all font-medium text-sm sm:text-base"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="order-1 sm:order-2 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Sauvegarder les modifications
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ChapterEditModal; 