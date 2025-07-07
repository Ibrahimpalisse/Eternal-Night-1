import React, { useState, useEffect } from 'react';
import { Search, BookOpen, X, ChevronDown } from 'lucide-react';

const CreateChapterModal = ({ isOpen, onClose, novels = [], onCreateChapter }) => {
  const [selectedNovel, setSelectedNovel] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [isNovelDropdownOpen, setIsNovelDropdownOpen] = useState(false);
  const [novelSearchQuery, setNovelSearchQuery] = useState('');

  // Réinitialiser les champs à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSelectedNovel('');
      setChapterNumber('');
      setChapterTitle('');
      setNovelSearchQuery('');
    }
  }, [isOpen]);

  // Filtrer les romans selon la recherche
  const filteredNovels = novels.filter(novel =>
    novel.title.toLowerCase().includes(novelSearchQuery.toLowerCase())
  );

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNovelDropdownOpen && !event.target.closest('.novel-dropdown')) {
        setIsNovelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNovelDropdownOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedNovel || !chapterNumber || !chapterTitle) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    const selectedNovelData = novels.find(novel => novel.id.toString() === selectedNovel);
    
    // Créer le nouveau chapitre
    const newChapter = {
      id: Date.now(), // Génération d'un ID temporaire
      title: chapterTitle,
      chapterNumber: parseInt(chapterNumber),
      novelId: parseInt(selectedNovel),
      novelTitle: selectedNovelData?.title || '',
      content: '',
      status: 'draft',
      wordCount: 0,
      views: 0,
      likes: 0,
      comments: 0,
      submittedAt: new Date().toISOString(),
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Appeler la fonction de création passée en props
    if (onCreateChapter) {
      onCreateChapter(newChapter);
    }
    
    onClose();
  };

  const selectedNovelData = novels.find(novel => novel.id.toString() === selectedNovel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl w-full max-w-lg">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Nouveau Chapitre</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenu */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Sélection du roman */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Roman <span className="text-red-400">*</span>
            </label>
            <div className="relative novel-dropdown">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsNovelDropdownOpen(!isNovelDropdownOpen);
                }}
                className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-700/70 transition-colors"
              >
                <span className={selectedNovelData ? 'text-white' : 'text-gray-400'}>
                  {selectedNovelData ? selectedNovelData.title : 'Sélectionner un roman'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isNovelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isNovelDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-lg shadow-2xl z-50">
                  {/* Barre de recherche dans le dropdown */}
                  <div className="p-2 sm:p-3 border-b border-slate-700/50">
                    <div className="relative">
                      <input
                        type="text"
                        value={novelSearchQuery}
                        onChange={(e) => setNovelSearchQuery(e.target.value)}
                        placeholder="Rechercher un roman..."
                        className="w-full pl-8 sm:pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                      />
                      <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Liste des romans filtrés */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredNovels.length > 0 ? (
                      filteredNovels.map((novel) => (
                        <button
                          key={novel.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedNovel(novel.id.toString());
                            setIsNovelDropdownOpen(false);
                            setNovelSearchQuery('');
                          }}
                          className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-white hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-b-0 flex items-center gap-3"
                        >
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          <span className="flex-1 truncate">{novel.title}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-400 text-sm text-center">
                        Aucun roman trouvé
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Numéro de chapitre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Numéro de chapitre <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value)}
              placeholder="Ex: 1, 2, 3..."
              min="1"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
          </div>

          {/* Titre du chapitre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Titre du chapitre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="Ex: Chapitre 1: Le commencement"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700/70 transition-colors text-sm sm:text-base font-medium flex-1 order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium flex-1 order-1 sm:order-2"
            >
              Créer le chapitre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChapterModal; 