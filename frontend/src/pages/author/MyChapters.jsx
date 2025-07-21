import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { NovelPagination } from '../../components/authors/table';
import {
  NovelFilter,
  ChapterStatusFilter,
  CreateChapterModal,
  ChapterViewModal,
  ChapterCard,
  NoResults,
  mockChapters,
  mockNovels
} from '../../components/authors/chapters';

// Composant principal
const MyChapters = () => {
  const [chapters, setChapters] = useState(mockChapters);
  const [filteredChapters, setFilteredChapters] = useState(mockChapters);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNovel, setSelectedNovel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [chaptersPerPage] = useState(5);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // Filtrer les chapitres
  useEffect(() => {
    let filtered = chapters;

    // Filtre par roman sélectionné
    if (selectedNovel !== 'all') {
      filtered = filtered.filter(chapter => chapter.novelId.toString() === selectedNovel);
    }

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(chapter => chapter.status === selectedStatus);
    }

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(chapter => {
        const searchLower = searchQuery.toLowerCase();
        return chapter.title.toLowerCase().includes(searchLower) ||
               chapter.novelTitle.toLowerCase().includes(searchLower) ||
               chapter.content.toLowerCase().includes(searchLower) ||
               chapter.chapterNumber.toString().includes(searchLower);
      });
    }

    setFilteredChapters(filtered);
    setCurrentPage(1);
  }, [chapters, searchQuery, selectedNovel, selectedStatus]);

  // Pagination
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = filteredChapters.slice(indexOfFirstChapter, indexOfLastChapter);

  // Fonction pour formater le nombre de mots
  const formatWordCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k mots`;
    }
    return `${count} mots`;
  };

  // Handler pour ouvrir la modal de création
  const handleCreateChapter = () => {
    setShowCreateModal(true);
  };

  // Handler pour créer un nouveau chapitre
  const handleNewChapterCreated = (newChapter) => {
    setChapters(prev => [newChapter, ...prev]);
    // Ouvrir immédiatement le chapitre créé pour l'éditer
    setSelectedChapter(newChapter);
    setShowChapterModal(true);
  };

  // Handler pour ouvrir un chapitre
  const handleOpenChapter = (chapter) => {
    setSelectedChapter(chapter);
    setShowChapterModal(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="p-3 sm:p-6 max-w-full">
        <div className="max-w-7xl mx-auto w-full">
        {/* En-tête */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold text-white truncate">Mes Chapitres</h1>
          <button
            onClick={handleCreateChapter}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center sm:justify-start gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="truncate">Nouveau Chapitre</span>
          </button>
        </div>

        {/* Filtres et recherche */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
          {/* Barre de recherche */}
            <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un chapitre..."
                className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-slate-800/60 border border-slate-600/50 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-slate-800/80 focus:border-purple-500/50 h-[42px] sm:h-[48px] text-sm sm:text-base transition-all duration-200"
            />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          {/* Filtre par roman */}
          <NovelFilter
            selectedNovel={selectedNovel}
            onNovelChange={setSelectedNovel}
            novels={mockNovels}
          />

          {/* Filtre par statut */}
          <ChapterStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
            </div>
        </div>

        {/* Liste des chapitres */}
          <div className="w-full">
        {filteredChapters.length === 0 ? (
          <NoResults searchQuery={searchQuery} selectedNovel={selectedNovel} />
        ) : (
              <div className="space-y-3 sm:space-y-4 w-full">
            {currentChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                onChapterClick={handleOpenChapter}
                formatWordCount={formatWordCount}
              />
            ))}

            {/* Pagination */}
                <div className="mt-6 sm:mt-8 w-full">
            <NovelPagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredChapters.length / chaptersPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredChapters.length}
              itemsPerPage={chaptersPerPage}
            />
                </div>
          </div>
        )}
          </div>

        {/* Modal de création de chapitre */}
        <CreateChapterModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          novels={mockNovels}
          onCreateChapter={handleNewChapterCreated}
        />

        {/* Modal d'affichage/édition de chapitre */}
        <ChapterViewModal
          isOpen={showChapterModal}
          onClose={() => setShowChapterModal(false)}
          chapter={selectedChapter}
        />
        </div>
      </div>
    </div>
  );
};

export default MyChapters; 