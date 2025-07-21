import React, { useRef } from 'react';
import { BookOpen, Heart, MessageCircle, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Données mockées pour les romans terminés
const completedBooks = [
  {
    id: 1,
    title: "L'Ombre du Dragon",
    author: "Marie Dubois",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    category: "Fantasy",
    chapters: 45,
    favorites: 2847,
    comments: 892,
    status: "Terminé"
  },
  {
    id: 2,
    title: "Secrets de Minuit",
    author: "Lucas Martin",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    category: "Romance",
    chapters: 32,
    favorites: 1923,
    comments: 567,
    status: "Terminé"
  },
  {
    id: 3,
    title: "La Prophétie Oubliée",
    author: "Sophie Laurent",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    category: "Aventure",
    chapters: 38,
    favorites: 3156,
    comments: 1024,
    status: "Terminé"
  },
  {
    id: 4,
    title: "Cœurs Brisés",
    author: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    category: "Drame",
    chapters: 28,
    favorites: 1456,
    comments: 432,
    status: "Terminé"
  },
  {
    id: 5,
    title: "Le Dernier Royaume",
    author: "Alexandre Noir",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop",
    category: "Fantasy",
    chapters: 52,
    favorites: 4234,
    comments: 1567,
    status: "Terminé"
  },
  {
    id: 6,
    title: "Amour Éternel",
    author: "Clara Blanc",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    category: "Romance",
    chapters: 25,
    favorites: 1789,
    comments: 634,
    status: "Terminé"
  }
];

const CompletedBooks = () => {
  console.log('CompletedBooks component is rendering'); // Debug log
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleViewMore = () => {
    navigate('/completed-novels'); // Redirection vers la page des romans terminés
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? scrollRef.current.clientWidth : 320;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? scrollRef.current.clientWidth : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Titre de la section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-white text-left">
              Romans terminés
            </h2>
            <button 
              onClick={handleViewMore}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-300 group cursor-pointer"
            >
              <span className="text-sm font-medium">Plus</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-green-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="h-px bg-green-400/30 flex-1"></div>
          </div>
        </div>

        {/* Container avec scroll horizontal */}
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {/* Bouton scroll gauche */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-sm border border-slate-600/50 rounded-full p-2 text-white transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Bouton scroll droite */}
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-sm border border-slate-600/50 rounded-full p-2 text-white transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {completedBooks.map((book) => (
                              <div
                  key={book.id}
                  className="flex-none w-full sm:w-64 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group cursor-pointer snap-center"
                >
                {/* Image du livre */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400/1f2937/ffffff?text=' + encodeURIComponent(book.title);
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                  {/* Badge catégorie */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-green-600/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {book.category}
                    </span>
                  </div>

                  {/* Badge statut terminé */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Terminé
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  {/* Titre et auteur */}
                  <div className="mb-4">
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 group-hover:text-green-300 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm">par {book.author}</p>
                  </div>

                  {/* Statistiques */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-blue-400">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">{book.chapters}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-400">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">{book.favorites}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">{book.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs de scroll (optionnel) */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">← Faites défiler →</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour cacher la scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default CompletedBooks; 