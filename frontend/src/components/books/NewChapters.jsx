import React from 'react';
import { BookOpen, Clock, Eye, User, Calendar, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Données mockées pour les chapitres récemment ajoutés
const newChapters = [
  {
    id: 1,
    chapterNumber: 25,
    title: "La Révélation du Dragon",
    novelTitle: "Les Chroniques d'Aether",
    author: "Emma Laurent",
    timeAdded: "Il y a 2 heures",
    views: 1247,
    category: "Fantasy",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&h=80&fit=crop",
    isNew: true
  },
  {
    id: 2,
    chapterNumber: 18,
    title: "Confessions sous les Étoiles",
    novelTitle: "Amour sous les Étoiles",
    author: "Sophie Martin",
    timeAdded: "Il y a 5 heures",
    views: 892,
    category: "Romance",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=80&h=80&fit=crop",
    isNew: true
  },
  {
    id: 3,
    chapterNumber: 12,
    title: "L'Énigme de la Bibliothèque",
    novelTitle: "Mystères de la Ville",
    author: "Paul Bernard",
    timeAdded: "Il y a 8 heures",
    views: 654,
    category: "Thriller",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    isNew: true
  },
  {
    id: 4,
    chapterNumber: 7,
    title: "Les Secrets de l'Académie",
    novelTitle: "Les Secrets de l'Académie",
    author: "Camille Rousseau",
    timeAdded: "Il y a 12 heures",
    views: 1156,
    category: "Fantasy",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=80&fit=crop",
    isNew: false
  },
  {
    id: 5,
    chapterNumber: 15,
    title: "La Bataille Finale",
    novelTitle: "La Quête du Dragon",
    author: "Marie Lefevre",
    timeAdded: "Il y a 1 jour",
    views: 2134,
    category: "Aventure",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=80&h=80&fit=crop",
    isNew: false
  },
  {
    id: 6,
    chapterNumber: 9,
    title: "Premiers Sentiments",
    novelTitle: "Cœurs en Péril",
    author: "Antoine Moreau",
    timeAdded: "Il y a 1 jour",
    views: 789,
    category: "Romance",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=80&h=80&fit=crop",
    isNew: false
  }
];

const NewChapters = () => {
  const navigate = useNavigate();

  const handleChapterClick = (chapter) => {
    navigate(`/chapter/${chapter.id}`); // Redirection vers le chapitre spécifique
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Titre de la section */}
        <div className="mb-12">
          <h2 className="text-lg md:text-2xl font-bold text-white text-left mb-4">
            Chapitres nouvellement ajoutés
          </h2>
          <div className="flex items-center">
            <div className="mr-4 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="h-px bg-blue-400/30 flex-1"></div>
          </div>
        </div>

        {/* Container des chapitres */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {newChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer"
                >
                {/* En-tête du chapitre */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Image du roman */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={chapter.image}
                      alt={chapter.novelTitle}
                      className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80/1f2937/ffffff?text=' + encodeURIComponent(chapter.novelTitle.slice(0, 2));
                      }}
                    />
                    {/* Badge "Nouveau" */}
                    {chapter.isNew && (
                      <div className="absolute -top-2 -right-2">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          Nouveau
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Informations principales */}
                  <div className="flex-1 min-w-0">
                    {/* Numéro et titre du chapitre */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-400 font-bold text-lg">
                          Chapitre {chapter.chapterNumber}
                        </span>
                        {chapter.isNew && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors truncate">
                        {chapter.title}
                      </h3>
                    </div>

                    {/* Titre du roman */}
                    <p className="text-gray-300 text-sm font-medium mb-1 truncate">
                      {chapter.novelTitle}
                    </p>

                    {/* Auteur */}
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                      <User className="w-3 h-3" />
                      <span>par {chapter.author}</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques et informations */}
                <div className="space-y-3">
                  {/* Badge catégorie */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                      {chapter.category}
                    </span>
                    
                    {/* Vues */}
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{chapter.views} vues</span>
                    </div>
                  </div>

                  {/* Heure d'ajout */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs pt-2 border-t border-slate-700/50">
                    <Clock className="w-3 h-3" />
                    <span>{chapter.timeAdded}</span>
                    <Calendar className="w-3 h-3 ml-auto" />
                  </div>
                </div>

                {/* Effet de bordure au hover */}
                <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/30 rounded-xl transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Message informatif */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Nouveaux chapitres ajoutés quotidiennement par nos auteurs talentueux</span>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour cacher la scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default NewChapters; 