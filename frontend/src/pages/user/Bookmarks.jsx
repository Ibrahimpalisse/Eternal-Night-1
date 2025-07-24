import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useScrollToTop } from '../../hooks';
import { useNavigation } from '../../components/NavigationManager';
import Pagination from '../../components/library/Pagination';
import {
  NovelCard,
  ChapterCard,
  BookmarksHeader,
  BookmarksTabs,
  BookmarksToolbar,
  BookmarksDropdown,
  EmptyState
} from '../../components/bookmarks';

// Données mockées pour les romans épinglés
const mockBookmarkedNovels = [
  {
    id: 1,
    title: "Les Chroniques d'Aether",
    author: "Emma Laurent",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    chapters: 25,
    views: 12500,
    favorites: 1247,
    comments: 423,
    category: "Fantasy",
    status: "en_cours",
    bookmarkedAt: "2024-01-20T10:30:00Z",
    lastRead: 15,
    progress: 60
  },
  {
    id: 2,
    title: "L'Empire des Ombres",
    author: "Marc Dubois",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    chapters: 18,
    views: 9800,
    favorites: 892,
    comments: 256,
    category: "Science-Fiction",
    status: "terminé",
    bookmarkedAt: "2024-01-18T14:20:00Z",
    lastRead: 18,
    progress: 100
  },
  {
    id: 3,
    title: "La Prophétie Oubliée",
    author: "Sarah Moreau",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    chapters: 15,
    views: 7650,
    favorites: 756,
    comments: 189,
    category: "Aventure",
    status: "en_cours",
    bookmarkedAt: "2024-01-15T09:45:00Z",
    lastRead: 8,
    progress: 53
  },
  {
    id: 4,
    title: "Le Secret du Temps",
    author: "Pierre Martin",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    chapters: 22,
    views: 8900,
    favorites: 678,
    comments: 145,
    category: "Mystère",
    status: "en_cours",
    bookmarkedAt: "2024-01-12T16:45:00Z",
    lastRead: 12,
    progress: 45
  },
  {
    id: 5,
    title: "Les Gardiens de la Nuit",
    author: "Marie Dubois",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    chapters: 30,
    views: 15600,
    favorites: 1345,
    comments: 567,
    category: "Horreur",
    status: "terminé",
    bookmarkedAt: "2024-01-10T11:20:00Z",
    lastRead: 30,
    progress: 100
  },
  {
    id: 6,
    title: "L'Éveil des Dragons",
    author: "Thomas Leroy",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    chapters: 19,
    views: 7200,
    favorites: 589,
    comments: 234,
    category: "Fantasy",
    status: "en_cours",
    bookmarkedAt: "2024-01-08T09:15:00Z",
    lastRead: 7,
    progress: 37
  }
];

// Données mockées pour les chapitres épinglés
const mockBookmarkedChapters = [
  {
    id: 1,
    novelId: 1,
    novelTitle: "Les Chroniques d'Aether",
    author: "Emma Laurent",
    chapterNumber: 12,
    chapterTitle: "L'éveil des pouvoirs",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    publishedAt: "2024-01-22T16:30:00Z",
    bookmarkedAt: "2024-01-22T18:45:00Z",
    wordCount: 3200,
    views: 850,
    isRead: false,
    category: "Fantasy"
  },
  {
    id: 2,
    novelId: 2,
    novelTitle: "L'Empire des Ombres",
    author: "Marc Dubois",
    chapterNumber: 7,
    chapterTitle: "La bataille finale",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    publishedAt: "2024-01-20T12:15:00Z",
    bookmarkedAt: "2024-01-20T14:30:00Z",
    wordCount: 4100,
    views: 1200,
    isRead: true,
    category: "Science-Fiction"
  },
  {
    id: 3,
    novelId: 3,
    novelTitle: "La Prophétie Oubliée",
    author: "Sarah Moreau",
    chapterNumber: 5,
    chapterTitle: "Le secret révélé",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    publishedAt: "2024-01-18T20:00:00Z",
    bookmarkedAt: "2024-01-19T08:15:00Z",
    wordCount: 2800,
    views: 690,
    isRead: false,
    category: "Aventure"
  }
];

const Bookmarks = () => {
  useScrollToTop();
  const { navigateToNovel, navigateToChapter } = useNavigation();

  // États pour les filtres et l'affichage
  const [activeTab, setActiveTab] = useState('novels'); // 'novels' ou 'chapters'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('bookmarked'); // 'bookmarked', 'title', 'progress'
  const [showFilters, setShowFilters] = useState(false);
  const filterDropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Nombre d'éléments par page

  // Formatage des dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  // Filtrage et tri des romans
  const filteredNovels = useMemo(() => {
    let filtered = mockBookmarkedNovels.filter(novel =>
      novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      novel.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'progress':
          return b.progress - a.progress;
        case 'bookmarked':
        default:
          return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  // Pagination des romans
  const paginatedNovels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNovels.slice(startIndex, endIndex);
  }, [filteredNovels, currentPage, itemsPerPage]);

  const totalNovelPages = Math.ceil(filteredNovels.length / itemsPerPage);

  // Filtrage et tri des chapitres
  const filteredChapters = useMemo(() => {
    let filtered = mockBookmarkedChapters.filter(chapter =>
      chapter.novelTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.novelTitle.localeCompare(b.novelTitle);
        case 'bookmarked':
        default:
          return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  // Pagination des chapitres
  const paginatedChapters = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChapters.slice(startIndex, endIndex);
  }, [filteredChapters, currentPage, itemsPerPage]);

  const totalChapterPages = Math.ceil(filteredChapters.length / itemsPerPage);

  // Handlers
  const handleNovelClick = (novel) => {
    navigateToNovel(novel.id, 'bookmarks');
  };

  const handleChapterClick = (chapter) => {
    navigateToChapter(chapter.novelId, chapter.chapterNumber);
  };

  const handleRemoveBookmark = (type, id) => {
    console.log(`Supprimer ${type} bookmark:`, id);
    // Ici vous ajouteriez la logique pour supprimer le favori
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Réinitialiser la page quand on change d'onglet ou de recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, sortBy]);

  // Calculer la position du dropdown
  const updateDropdownPosition = () => {
    if (filterDropdownRef.current) {
      const rect = filterDropdownRef.current.getBoundingClientRect();
      
      // Vérifier que le bouton est visible
      if (rect.width > 0 && rect.height > 0) {
        // Utiliser directement les coordonnées de la fenêtre
        setDropdownPosition({
          top: rect.bottom + 4, // 4px d'espace
          left: rect.left,
          width: rect.width
        });
      }
    }
  };

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Vérifier si le clic est sur le bouton du dropdown
      if (filterDropdownRef.current && filterDropdownRef.current.contains(event.target)) {
        return; // Ne pas fermer si on clique sur le bouton
      }
      
      // Vérifier si le clic est sur le dropdown lui-même
      const dropdownElement = document.querySelector('[data-dropdown-container]');
      if (dropdownElement && dropdownElement.contains(event.target)) {
        return; // Ne pas fermer si on clique sur le dropdown
      }
      
      // Fermer le dropdown si on clique ailleurs
      setShowFilters(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mettre à jour la position du dropdown quand il s'ouvre
  useEffect(() => {
    if (showFilters) {
      // Petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        updateDropdownPosition();
      }, 0);
    }
  }, [showFilters]);

  // Recalculer la position quand la fenêtre change de taille
  useEffect(() => {
    const handleResize = () => {
      if (showFilters) {
        updateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showFilters]);





  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8">
        
        <BookmarksHeader />

        <BookmarksTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          novelsCount={filteredNovels.length}
          chaptersCount={filteredChapters.length}
        />

                <BookmarksToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeTab={activeTab}
          filterDropdownRef={filterDropdownRef}
        />

                {/* Contenu */}
        {activeTab === 'novels' ? (
          <div>
            {filteredNovels.length > 0 ? (
              <>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedNovels.map((novel) => (
                    <NovelCard 
                      key={novel.id} 
                      novel={novel} 
                      viewMode={viewMode}
                      onNovelClick={handleNovelClick}
                      onRemoveBookmark={handleRemoveBookmark}
                      formatRelativeTime={formatRelativeTime}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalNovelPages > 1 && (
                  <div className="mt-8">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalNovelPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState type="novels" searchTerm={searchTerm} />
            )}
          </div>
                ) : (
          <div>
            {filteredChapters.length > 0 ? (
              <>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedChapters.map((chapter) => (
                    <ChapterCard 
                      key={chapter.id} 
                      chapter={chapter} 
                      viewMode={viewMode}
                      onChapterClick={handleChapterClick}
                      onRemoveBookmark={handleRemoveBookmark}
                      formatRelativeTime={formatRelativeTime}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalChapterPages > 1 && (
                  <div className="mt-8">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalChapterPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState type="chapters" searchTerm={searchTerm} />
            )}
          </div>
        )}
      </div>

                     {/* CSS pour line-clamp */}
        <style>{`
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
       
               <BookmarksDropdown 
          showFilters={showFilters}
          dropdownPosition={dropdownPosition}
          setSortBy={setSortBy}
          setShowFilters={setShowFilters}
          activeTab={activeTab}
        />
     </div>
   );
 };

export default Bookmarks; 