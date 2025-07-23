import React, { useRef } from 'react';
import { BookOpen, Heart, MessageCircle, Star, ArrowRight, Clock, CheckCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigation } from './NavigationManager';

import ResponsiveStatusBadge from './ui/ResponsiveStatusBadge';

// Données mockées pour les livres populaires
const popularBooks = [
  {
    id: 1,
    title: "Les Chroniques d'Aether",
    author: "Emma Laurent",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&crop=center",
    chapters: 25,
    views: 12500,
    favorites: 1247,
    comments: 423,
    category: "Fantasy",
    status: "en_cours"
  },
  {
    id: 2,
    title: "L'Empire des Ombres",
    author: "Marc Dubois",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
    chapters: 18,
    views: 9800,
    favorites: 892,
    comments: 256,
    category: "Science-Fiction",
    status: "terminé"
  },
  {
    id: 3,
    title: "La Prophétie Oubliée",
    author: "Sarah Moreau",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
    chapters: 15,
    views: 7650,
    favorites: 756,
    comments: 189,
    category: "Aventure",
    status: "en_cours"
  },
  {
    id: 4,
    title: "Secrets de Minuit",
    author: "Lucas Martin",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
    chapters: 22,
    views: 5400,
    favorites: 645,
    comments: 167,
    category: "Mystère",
    status: "terminé"
  },
  {
    id: 5,
    title: "Les Gardiens du Temps",
    author: "Julie Rousseau",
    image: "https://images.unsplash.com/photo-1576872381149-7847515ce5d5?w=300&h=400&fit=crop&crop=center",
    chapters: 30,
    views: 8200,
    favorites: 534,
    comments: 143,
    category: "Fantasy",
    status: "en_cours"
  },
  {
    id: 6,
    title: "Étoiles Perdues",
    author: "Antoine Bernard",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=400&fit=crop&crop=center",
    chapters: 12,
    views: 4300,
    favorites: 423,
    comments: 98,
    category: "Science-Fiction",
    status: "terminé"
  }
];

const PopularBooks = () => {
  console.log('PopularBooks component is rendering'); // Debug log
  const { navigateToNovel } = useNavigation();
  const scrollRef = useRef(null);

  const handleViewMore = () => {
    console.log('Voir plus de romans populaires...');
    // Redirection vers la page des romans populaires
    navigate('/popular-novels'); // Redirection vers la page des romans populaires
  };

  const handleBookClick = (book) => {
    navigateToNovel(book.id, 'home');
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
              Les 10 romans les plus populaires
            </h2>
            <button 
              onClick={handleViewMore}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group cursor-pointer"
            >
              <span className="text-sm font-medium">Plus</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-purple-400">
              <Star className="w-5 h-5" />
            </div>
            <div className="h-px bg-purple-400/30 flex-1"></div>
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

          <div ref={scrollRef} className="flex gap-0 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {popularBooks.map((book) => (
              <div 
                key={book.id}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group cursor-pointer w-full min-w-full flex-shrink-0 sm:w-[12rem] sm:min-w-[12rem] sm:gap-6"
                onClick={() => handleBookClick(book)}
              >
                {/* Image du livre */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Placeholder CSS quand l'image ne charge pas */}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-2xl sm:text-4xl hidden"
                    style={{ display: 'none' }}
                  >
                    {book.title.slice(0, 2).toUpperCase()}
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  
                  {/* Badge statut */}
                  <div className="absolute top-3 right-3">
                    <ResponsiveStatusBadge 
                      status={book.status} 
                      size="small"
                      className="backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  {/* Titre et auteur */}
                  <div className="mb-4">
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm">par {book.author}</p>
                  </div>

                  {/* Statistiques */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mt-3">
                    <div className="flex items-center justify-start gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 min-w-0">
                      <BookOpen className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium truncate">{book.chapters}</span>
                    </div>
                    <div className="flex items-center justify-start gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 min-w-0">
                      <Eye className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium truncate">{book.views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-start gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 min-w-0">
                      <Heart className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium truncate">{book.favorites?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-start gap-2 text-green-400 hover:text-green-300 transition-colors duration-200 min-w-0">
                      <MessageCircle className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium truncate">{book.comments}</span>
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
      <style>{`
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

export default PopularBooks; 