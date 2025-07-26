import React, { useRef } from 'react';
import { BookOpen, Heart, MessageCircle, Plus, ArrowRight, ChevronLeft, ChevronRight, Eye, Clock } from 'lucide-react';
import { useNavigation } from "../../components";
import { useNavigate } from 'react-router-dom';
import ResponsiveStatusBadge from "../ui/ResponsiveStatusBadge";

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
  }
];

const NewChapters = () => {
  console.log('NewChapters component is rendering'); // Debug log
  const { navigateToNovel } = useNavigation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleViewMore = () => {
    console.log('Voir plus de nouveaux chapitres...');
    // Redirection vers la page des nouveaux chapitres
    navigate('/new-chapters');
  };

  const handleChapterClick = (chapter) => {
    navigateToNovel(chapter.id, 'home');
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
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Titre de la section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-white text-left">
              Chapitres nouvellement ajoutés
            </h2>
            <button 
              onClick={handleViewMore}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 group cursor-pointer"
            >
              <span className="text-sm font-medium">Plus</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-blue-400">
              <Plus className="w-5 h-5" />
            </div>
            <div className="h-px bg-blue-400/30 flex-1"></div>
          </div>
        </div>

        {/* Container avec scroll horizontal */}
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {/* Bouton scroll gauche - caché en mobile */}
          <button
            onClick={scrollLeft}
            className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-sm border border-slate-600/50 rounded-full p-2 text-white transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Bouton scroll droite - caché en mobile */}
          <button
            onClick={scrollRight}
            className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-sm border border-slate-600/50 rounded-full p-2 text-white transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {newChapters.map((chapter) => (
              <div 
                key={chapter.id}
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer relative p-4 w-80 min-w-80 flex-shrink-0"
                onClick={() => handleChapterClick(chapter)}
              >
                {/* Badge nouveau chapitre sur le cadre */}
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                    NOUVEAU
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-4 pt-8">
                  {/* Image du roman */}
                  <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={chapter.image}
                      alt={chapter.novelTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badge statut */}
                    <div className="absolute top-1 right-1">
                      <ResponsiveStatusBadge 
                        status={chapter.status} 
                        size="small"
                        showText={false}
                        className="backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">
                          {chapter.novelTitle}
                        </h4>
                        <p className="text-gray-400 text-xs">par {chapter.author}</p>
                      </div>
                    </div>

                    {/* Numéro et titre du chapitre */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-400 font-bold text-sm">
                          Ch. {chapter.chapterNumber}
                        </span>
                      </div>
                      <h5 className="text-gray-300 text-sm line-clamp-1">
                        {chapter.chapterTitle}
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Statistiques et date */}
                <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {chapter.views?.toLocaleString() || 0}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(chapter.addedDate)}
                  </span>
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default NewChapters; 