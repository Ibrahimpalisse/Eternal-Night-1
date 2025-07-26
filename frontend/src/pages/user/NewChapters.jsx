import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../components';
import { useScrollToTop } from '../../hooks';
import { Pagination, ViewToggle } from '../../components/library';
import { useViewMode } from '../../hooks/useLocalStorage';
import { 
  NewChaptersHeader, 
  NewChaptersSearch, 
  NewChaptersGrid, 
  NewChaptersEmptyState, 
  NewChaptersResultsCount 
} from '../../components';

// Données mockées pour les nouveaux chapitres
const newChapters = [
  {
    id: 1,
    novelTitle: "Les Secrets de l'Académie",
    chapterTitle: "Chapitre 13: La Révélation",
    author: "Camille Rousseau",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    category: "Fantasy",
    chapterNumber: 13,
    views: 8900,
    favorites: 1834,
    comments: 456,
    status: "en_cours",
    addedDate: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    novelTitle: "Cœurs en Péril",
    chapterTitle: "Chapitre 9: Le Choix",
    author: "Antoine Moreau",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    category: "Romance",
    chapterNumber: 9,
    views: 12300,
    favorites: 2456,
    comments: 789,
    status: "en_cours",
    addedDate: "2024-01-15T09:15:00Z"
  },
  {
    id: 3,
    novelTitle: "La Quête du Dragon",
    chapterTitle: "Chapitre 16: L'Affrontement",
    author: "Marie Lefevre",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    category: "Aventure",
    chapterNumber: 16,
    views: 10500,
    favorites: 1567,
    comments: 334,
    status: "en_cours",
    addedDate: "2024-01-15T08:45:00Z"
  },
  {
    id: 4,
    novelTitle: "Mystères de la Ville",
    chapterTitle: "Chapitre 21: L'Enquête",
    author: "Paul Bernard",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    category: "Thriller",
    chapterNumber: 21,
    views: 7800,
    favorites: 1123,
    comments: 267,
    status: "en_cours",
    addedDate: "2024-01-15T07:30:00Z"
  },
  {
    id: 5,
    novelTitle: "Étoiles Naissantes",
    chapterTitle: "Chapitre 11: L'Exploration",
    author: "Sophie Dubois",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop",
    category: "Science-Fiction",
    chapterNumber: 11,
    views: 15600,
    favorites: 2789,
    comments: 612,
    status: "en_cours",
    addedDate: "2024-01-15T06:20:00Z"
  },
  {
    id: 6,
    novelTitle: "L'Héritage Maudit",
    chapterTitle: "Chapitre 7: Le Secret",
    author: "Lucas Petit",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    category: "Horreur",
    chapterNumber: 7,
    views: 6200,
    favorites: 945,
    comments: 178,
    status: "en_cours",
    addedDate: "2024-01-15T05:10:00Z"
  },
  {
    id: 7,
    novelTitle: "Le Dernier Royaume",
    chapterTitle: "Chapitre 25: La Bataille",
    author: "Alexandre Noir",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop",
    category: "Fantasy",
    chapterNumber: 25,
    views: 18900,
    favorites: 4234,
    comments: 1567,
    status: "en_cours",
    addedDate: "2024-01-15T04:30:00Z"
  },
  {
    id: 8,
    novelTitle: "Amour Éternel",
    chapterTitle: "Chapitre 18: La Réconciliation",
    author: "Clara Blanc",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    category: "Romance",
    chapterNumber: 18,
    views: 13400,
    favorites: 1789,
    comments: 634,
    status: "en_cours",
    addedDate: "2024-01-15T03:45:00Z"
  }
];

const NewChapters = () => {
  const { navigateToNovel } = useNavigation();
  useScrollToTop();
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useViewMode();

  // Pagination
  const chaptersPerPage = 12;

  // Filtrage des chapitres
  const filteredChapters = useMemo(() => {
    return newChapters.filter(chapter => {
      const matchesSearch = chapter.novelTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chapter.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chapter.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [newChapters, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredChapters.length / chaptersPerPage);
  const startIndex = (currentPage - 1) * chaptersPerPage;
  const endIndex = startIndex + chaptersPerPage;
  const currentChapters = filteredChapters.slice(startIndex, endIndex);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChapterClick = (chapter) => {
    console.log('Chapitre cliqué:', chapter);
    navigateToNovel(chapter.id, 'new-chapters');
  };

  // Fonction pour formater la date relative
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8">
        {/* En-tête de la page */}
        <NewChaptersHeader />

        {/* Barre de recherche */}
        <NewChaptersSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {/* Nombre de résultats */}
        <NewChaptersResultsCount count={filteredChapters.length} />

        {/* Contrôles d'affichage */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="text-xs sm:text-sm text-gray-400">
            Affichage en {viewMode === 'grid' ? 'grille' : 'liste'}
          </div>
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Contenu principal */}
        {filteredChapters.length > 0 ? (
          <>
            {/* Affichage en grille */}
            <NewChaptersGrid 
              chapters={currentChapters}
              onChapterClick={handleChapterClick}
              formatTimeAgo={formatTimeAgo}
              viewMode={viewMode}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <NewChaptersEmptyState 
            onClearSearch={() => setSearchTerm('')} 
          />
        )}
      </div>

      {/* CSS pour le line-clamp */}
      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NewChapters; 