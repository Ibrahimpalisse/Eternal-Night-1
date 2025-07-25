import React, { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigation } from '../../components';
import { useScrollToTop } from '../../hooks';
import { FilterBar, BookGrid, BookList, ViewToggle, Pagination } from '../../components/library';
import { useViewMode } from '../../hooks/useLocalStorage';

// Données mockées pour la bibliothèque
const libraryBooks = [
  {
    id: 1,
    title: "Les Chroniques d'Aether",
    author: "Emma Laurent",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&crop=center",
    category: "Fantasy",
    status: "en_cours",
    chapters: 25,
    views: 12500,
    favorites: 1247,
    comments: 423,
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
    views: 9800,
    favorites: 892,
    comments: 256,
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
    views: 7650,
    favorites: 756,
    comments: 189,
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
    views: 5400,
    favorites: 645,
    comments: 167,
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
    views: 8200,
    favorites: 534,
    comments: 143,
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
    views: 4300,
    favorites: 423,
    comments: 98,
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
    views: 15600,
    favorites: 1456,
    comments: 432,
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
    views: 11200,
    favorites: 1456,
    comments: 367,
    description: "Un royaume plongé dans les ténèbres où la lumière est rare..."
  },
  {
    id: 9,
    title: "Le Dernier Voyage",
    author: "Claire Dubois",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop",
    category: "Aventure",
    status: "arrete",
    chapters: 8,
    views: 3200,
    favorites: 234,
    comments: 67,
    description: "Un voyage en mer qui tourne mal, laissant les survivants sur une île mystérieuse..."
  },
  {
    id: 10,
    title: "Mémoires d'Outre-Tombe",
    author: "Victor Noir",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    category: "Horreur",
    status: "arrete",
    chapters: 12,
    views: 5400,
    favorites: 456,
    comments: 123,
    description: "Des mémoires troublantes d'un homme qui prétend avoir vécu plusieurs vies..."
  },
  {
    id: 11,
    title: "Les Échos du Passé",
    author: "Sophie Laurent",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    category: "Mystère",
    status: "arrete",
    chapters: 15,
    views: 4100,
    favorites: 345,
    comments: 89,
    description: "Une jeune femme découvre qu'elle peut entendre les échos du passé..."
  },
  {
    id: 12,
    title: "Ciel Brisé",
    author: "Alexandre Ciel",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=400&fit=crop",
    category: "Science-Fiction",
    status: "arrete",
    chapters: 6,
    views: 2800,
    favorites: 178,
    comments: 45,
    description: "Un monde où le ciel s'est littéralement brisé, révélant l'espace infini..."
  },
  {
    id: 13,
    title: "L'Amour Interdit",
    author: "Camille Rose",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    category: "Romance",
    status: "arrete",
    chapters: 10,
    views: 6700,
    favorites: 567,
    comments: 156,
    description: "Une histoire d'amour impossible entre deux familles rivales..."
  },
  {
    id: 14,
    title: "Les Gardiens de la Nuit",
    author: "Luna Nocturne",
    image: "https://images.unsplash.com/photo-1576872381149-7847515ce5d5?w=300&h=400&fit=crop",
    category: "Fantasy",
    status: "arrete",
    chapters: 9,
    views: 3800,
    favorites: 289,
    comments: 78,
    description: "Des gardiens mystérieux protègent les secrets de la nuit..."
  },
  {
    id: 15,
    title: "Le Code Secret",
    author: "Hackerman",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    category: "Thriller",
    status: "arrete",
    chapters: 7,
    views: 2900,
    favorites: 198,
    comments: 52,
    description: "Un hacker découvre un code secret qui pourrait changer le monde..."
  }
];

const Library = () => {
  const { navigateToNovel } = useNavigation();
  useScrollToTop();
  
  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLikes, setSelectedLikes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useViewMode(); // Utiliser le hook personnalisé
  
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

  // Filtrage des livres
  const filteredBooks = useMemo(() => {
    return libraryBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.category);
      
      const matchesLikes = !selectedLikes || book.favorites >= parseInt(selectedLikes);

      const matchesStatus = !selectedStatus || book.status === selectedStatus;
      
      return matchesSearch && matchesGenre && matchesLikes && matchesStatus;
    });
  }, [libraryBooks, searchTerm, selectedGenres, selectedLikes, selectedStatus]);

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
    navigateToNovel(book.id, 'library');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8">
        {/* En-tête de la page */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                Bibliothèque
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Explorez notre collection de romans et découvrez de nouvelles histoires
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Collection mise à jour régulièrement</span>
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

        {/* Affichage des livres selon le mode */}
        {viewMode === 'grid' ? (
          <BookGrid
            books={currentBooks}
            onBookClick={handleBookClick}
          />
        ) : (
          <BookList
            books={currentBooks}
            onBookClick={handleBookClick}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;