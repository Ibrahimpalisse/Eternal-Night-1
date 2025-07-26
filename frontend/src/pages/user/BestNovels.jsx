import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useNavigation } from '../../components';
import { useScrollToTop } from '../../hooks';
import { FilterBar, BookGrid, BookList, ViewToggle, Pagination } from '../../components/library';
import { useViewMode } from '../../hooks/useLocalStorage';

// Données mockées pour les meilleurs romans
const bestNovels = [
  {
    id: 1,
    title: "Les Chroniques d'Aether",
    author: "Emma Laurent",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&crop=center",
    category: "Fantasy",
    status: "en_cours",
    chapters: 25,
    views: 125000,
    favorites: 12470,
    comments: 4230,
    rating: 4.8,
    description: "Une épopée fantastique dans un monde où la magie et la technologie coexistent..."
  },
  {
    id: 2,
    title: "L'Empire des Ombres",
    author: "Marc Dubois",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
    category: "Science-Fiction",
    status: "terminé",
    chapters: 18,
    views: 98000,
    favorites: 8920,
    comments: 2560,
    rating: 4.7,
    description: "Dans un futur dystopique, un jeune hacker découvre les secrets de l'Empire..."
  },
  {
    id: 3,
    title: "La Prophétie Oubliée",
    author: "Sarah Moreau",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
    category: "Aventure",
    status: "en_cours",
    chapters: 15,
    views: 76500,
    favorites: 7560,
    comments: 1890,
    rating: 4.6,
    description: "Une quête épique pour retrouver une prophétie perdue depuis des siècles..."
  },
  {
    id: 4,
    title: "Secrets de Minuit",
    author: "Lucas Martin",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
    category: "Mystère",
    status: "terminé",
    chapters: 22,
    views: 54000,
    favorites: 6450,
    comments: 1670,
    rating: 4.5,
    description: "Un détective privé enquête sur des disparitions mystérieuses dans une petite ville..."
  },
  {
    id: 5,
    title: "Les Gardiens du Temps",
    author: "Julie Rousseau",
    image: "https://images.unsplash.com/photo-1576872381149-7847515ce5d5?w=300&h=400&fit=crop&crop=center",
    category: "Fantasy",
    status: "en_cours",
    chapters: 30,
    views: 82000,
    favorites: 5340,
    comments: 1430,
    rating: 4.4,
    description: "Des gardiens protègent l'équilibre temporel de l'univers..."
  },
  {
    id: 6,
    title: "Étoiles Perdues",
    author: "Antoine Bernard",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=400&fit=crop&crop=center",
    category: "Science-Fiction",
    status: "terminé",
    chapters: 12,
    views: 43000,
    favorites: 4230,
    comments: 980,
    rating: 4.3,
    description: "Une odyssée spatiale pour retrouver des étoiles disparues..."
  },
  {
    id: 7,
    title: "Cœurs Brisés",
    author: "Marie Claire",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    category: "Romance",
    status: "en_cours",
    chapters: 28,
    views: 156000,
    favorites: 14560,
    comments: 4320,
    rating: 4.9,
    description: "Une histoire d'amour déchirante dans le Paris des années 20..."
  },
  {
    id: 8,
    title: "Royaume des Ombres",
    author: "Pierre Sombre",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    category: "Dark Fantasy",
    status: "terminé",
    chapters: 19,
    views: 112000,
    favorites: 14560,
    comments: 3670,
    rating: 4.8,
    description: "Un royaume plongé dans les ténèbres où la lumière est rare..."
  },
  {
    id: 9,
    title: "Le Chant des Sirènes",
    author: "Isabelle Mer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
    category: "Fantasy",
    status: "en_cours",
    chapters: 35,
    views: 89000,
    favorites: 9870,
    comments: 2340,
    rating: 4.7,
    description: "Une jeune femme découvre qu'elle est la dernière sirène de son espèce..."
  },
  {
    id: 10,
    title: "Code Rouge",
    author: "Thomas Cyber",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
    category: "Thriller",
    status: "terminé",
    chapters: 16,
    views: 67000,
    favorites: 7230,
    comments: 1890,
    rating: 4.6,
    description: "Un hacker doit arrêter une IA qui menace de prendre le contrôle du monde..."
  },
  {
    id: 11,
    title: "Les Mémoires du Futur",
    author: "Sophie Temps",
    image: "https://images.unsplash.com/photo-1576872381149-7847515ce5d5?w=300&h=400&fit=crop&crop=center",
    category: "Science-Fiction",
    status: "en_cours",
    chapters: 24,
    views: 78000,
    favorites: 8560,
    comments: 2130,
    rating: 4.5,
    description: "Un voyageur temporel doit corriger les erreurs du passé pour sauver l'avenir..."
  },
  {
    id: 12,
    title: "L'Éveil des Dragons",
    author: "Alexandre Feu",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
    category: "Fantasy",
    status: "en_cours",
    chapters: 42,
    views: 134000,
    favorites: 15670,
    comments: 3890,
    rating: 4.9,
    description: "Les dragons se réveillent après des millénaires de sommeil..."
  }
];

const BestNovels = () => {
  const { navigateToNovel } = useNavigation();
  useScrollToTop();
  
  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLikes, setSelectedLikes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useViewMode();
  
  // Pagination
  const booksPerPage = 12;

  // Genres disponibles
  const genres = [
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Science-Fiction', label: 'Science-Fiction' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Mystère', label: 'Mystère' },
    { value: 'Aventure', label: 'Aventure' },
    { value: 'Dark Fantasy', label: 'Dark Fantasy' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Horreur', label: 'Horreur' },
    { value: 'Comédie', label: 'Comédie' },
    { value: 'Drame', label: 'Drame' }
  ];

  // Filtrage et tri des livres
  const filteredBooks = useMemo(() => {
    const filtered = bestNovels.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.category);
      
      const matchesLikes = !selectedLikes || book.favorites >= parseInt(selectedLikes);

      const matchesStatus = !selectedStatus || book.status === selectedStatus;
      
      return matchesSearch && matchesGenre && matchesLikes && matchesStatus;
    });

    // Trier par nombre de likes décroissant
    return filtered.sort((a, b) => b.favorites - a.favorites);
  }, [bestNovels, searchTerm, selectedGenres, selectedLikes, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenres, selectedLikes, selectedStatus]);

  const handleBookClick = (book) => {
    console.log('Livre cliqué:', book);
    navigateToNovel(book.id, 'best-novels');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8">
        {/* En-tête de la page */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
                Meilleurs Romans
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Découvrez les romans les plus populaires et les mieux notés de notre communauté
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Mis à jour quotidiennement</span>
            </div>
          </div>
        </div>

        {/* Barre de filtres */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGenres={selectedGenres}
          onGenresChange={setSelectedGenres}
          genres={genres}
          selectedLikes={selectedLikes}
          onLikesChange={setSelectedLikes}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          resultsCount={filteredBooks.length}
        />

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
        {filteredBooks.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <BookGrid books={currentBooks} onBookClick={handleBookClick} />
            ) : (
              <BookList books={currentBooks} onBookClick={handleBookClick} />
            )}
            
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
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Aucun roman trouvé</h3>
            <p className="text-gray-400 mb-4">
              Essayez de modifier vos critères de recherche ou de filtres
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenres([]);
                setSelectedLikes('');
                setSelectedStatus('');
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestNovels; 