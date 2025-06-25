import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  FileText, 
  User, 
  Calendar, 
  Eye, 
  BookOpen,
  Clock,
  CheckCircle,
  Pause,
  EyeOff,
  Copy,
  Download,
  ZoomIn,
  ZoomOut,
  Type,
  Edit
} from 'lucide-react';
import ChapterEditModal from './ChapterEditModal';

const ChapterDetailsModal = ({ isOpen, onClose, chapter, onEdit }) => {
  const [fontSize, setFontSize] = useState(16);
  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!chapter) return null;

  // Fonction pour gérer l'édition
  const handleEdit = (updatedChapter) => {
    if (onEdit) {
      onEdit(updatedChapter);
    }
    setShowEditModal(false);
  };

  // Fonction pour obtenir l'icône de statut
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'accepted_unpublished': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'unpublished': return <EyeOff className="w-4 h-4 text-orange-400" />;
      default: return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  // Fonction pour obtenir le texte de statut
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'accepted_unpublished': return 'Accepté';
      case 'published': return 'Publié';
      case 'unpublished': return 'Dépublié';
      default: return 'Inconnu';
    }
  };

  // Fonction pour obtenir la classe CSS du statut
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2";
    switch(status) {
      case 'pending': 
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case 'accepted_unpublished': 
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      case 'published': 
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case 'unpublished': 
        return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
      default: 
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  // Fonction pour formater le nombre de mots
  const formatWordCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k mots`;
    }
    return `${count} mots`;
  };

  // Fonction pour copier le contenu
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chapter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  // Fonction pour télécharger le chapitre
  const handleDownload = () => {
    const blob = new Blob([chapter.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chapter.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fonction pour ajuster la taille de police
  const adjustFontSize = (delta) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
  };

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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-xl transition-all">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold text-lg">{chapter.chapterNumber}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <Dialog.Title className="text-xl sm:text-2xl font-bold text-white mb-2">
                          {chapter.title}
                        </Dialog.Title>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{chapter.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{chapter.romanTitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(chapter.submittedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                          {chapter.views > 0 && (
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span>{chapter.views.toLocaleString()} lectures</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Informations du chapitre */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                    <div className={getStatusBadge(chapter.status)}>
                      {getStatusIcon(chapter.status)}
                      <span>{getStatusText(chapter.status)}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-gray-300 border border-slate-600/50">
                      {formatWordCount(chapter.wordCount)}
                    </div>
                    {chapter.publishedAt && (
                      <div className="text-sm text-gray-400">
                        Publié le {new Date(chapter.publishedAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>

                  {/* Outils de lecture */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
                      <button
                        onClick={() => adjustFontSize(-2)}
                        className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Diminuer la taille"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <div className="px-3 py-1 text-sm text-gray-300 min-w-[60px] text-center">
                        <Type className="w-4 h-4 inline mr-1" />
                        {fontSize}px
                      </div>
                      <button
                        onClick={() => adjustFontSize(2)}
                        className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Augmenter la taille"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">{copied ? 'Copié!' : 'Copier'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Télécharger</span>
                    </button>
                  </div>
                </div>

                {/* Contenu du chapitre */}
                <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                  <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 sm:p-8">
                    {chapter.comment && (
                      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Commentaire de modération
                        </h4>
                        <p className="text-gray-300 text-sm">{chapter.comment}</p>
                      </div>
                    )}

                    <div 
                      className="prose prose-invert max-w-none"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                        {chapter.content}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer avec actions */}
                <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white transition-colors"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors flex items-center gap-2 justify-center"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      {showEditModal && (
        <ChapterEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          chapter={chapter}
          onSave={handleEdit}
        />
      )}
    </Transition>
  );
};

export default ChapterDetailsModal; 