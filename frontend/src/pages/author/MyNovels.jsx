import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Eye, BookOpen, Clock, Calendar, MoreVertical } from 'lucide-react';
import { NovelStatusFilter, NovelCategoryFilter } from '../../components/authors/filters';
import { NovelModalManager } from '../../components/authors/modals';
import { NovelPagination } from '../../components/authors/table';

// Données mockées pour les romans - à remplacer par des vraies données API
const mockNovels = [
  {
    id: 1,
    title: "Les Gardiens de l'Ombre",
    description: "Une épopée fantastique dans un monde où la magie et la technologie se mélangent dans une danse éternelle. Suivez l'aventure de Kael, un jeune gardien qui découvre ses pouvoirs ancestraux.",
    status: "published",
    categories: ["Fantasy", "Aventure", "Young Adult"],
    chapters: 15,
    views: 12500,
    likes: 342,
    comments: 89,
    bookmarked: 103,
    publishedAt: "2024-01-20",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    coverImage: null
  },
  {
    id: 2,
    title: "Chroniques Urbaines",
    description: "Des histoires de la ville moderne où chaque coin de rue cache un secret. Entre drames personnels et mystères urbains, découvrez la face cachée de la métropole.",
    status: "accepted",
    categories: ["Contemporain", "Mystère"],
    chapters: 8,
    views: 3200,
    likes: 156,
    comments: 23,
    bookmarked: 47,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    coverImage: null
  },
  {
    id: 3,
    title: "Le Dernier Voyage",
    description: "Une aventure spatiale épique qui nous emmène aux confins de l'univers. Quand l'humanité fait face à son extinction, un dernier vaisseau part à la recherche d'un nouveau monde.",
    status: "pending",
    categories: ["Science-Fiction", "Aventure"],
    chapters: 3,
    views: 150,
    likes: 12,
    comments: 2,
    bookmarked: 4,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
    coverImage: null
  },
  {
    id: 4,
    title: "Mémoires Perdues",
    description: "Un thriller psychologique troublant où la réalité et les souvenirs s'entremêlent dans un cauchemar éveillé. Sarah doit retrouver ses souvenirs avant qu'il ne soit trop tard.",
    status: "draft",
    category: "Thriller",
    chapters: 1,
    views: 0,
    likes: 0,
    comments: 0,
    bookmarked: 0,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
    coverImage: null
  },
  {
    id: 5,
    title: "L'Écho des Anciens",
    description: "Une saga épique à travers les âges...",
    status: "published",
    category: "Historique",
    chapters: 22,
    views: 8500,
    likes: 267,
    comments: 45,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-19",
    coverImage: null
  },
  {
    id: 6,
    title: "Neon Dreams",
    description: "Un cyberpunk dans une mégalopole futuriste...",
    status: "accepted",
    category: "Science-Fiction",
    chapters: 12,
    views: 4200,
    likes: 189,
    comments: 34,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-17",
    coverImage: null
  },
  {
    id: 7,
    title: "Le Jardin Secret",
    description: "Une romance contemporaine touchante...",
    status: "pending",
    category: "Romance",
    chapters: 6,
    views: 890,
    likes: 67,
    comments: 12,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-16",
    coverImage: null
  },
  {
    id: 8,
    title: "Fragments",
    description: "Recueil de nouvelles...",
    status: "draft",
    category: "Contemporain",
    chapters: 2,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2023-12-28",
    updatedAt: "2023-12-28",
    coverImage: null
  }
];

// Composant pour le badge de statut
const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      label: 'Brouillon',
      className: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    },
    pending: {
      label: 'En attente',
      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    },
    accepted: {
      label: 'Accepté',
      className: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    published: {
      label: 'Publié',
      className: 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${config.className} transition-colors duration-200`}>
      {config.label}
    </span>
  );
};

const NoResults = ({ searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Aucun roman trouvé
      </h3>
      <p className="text-slate-400 text-center max-w-md">
        {searchQuery ? (
          <>
            Aucun roman ne correspond à votre recherche <span className="text-white">"{searchQuery}"</span>
          </>
        ) : (
          "Aucun roman ne correspond aux filtres sélectionnés"
        )}
      </p>
    </div>
  );
};

// Composant principal
const MyNovels = () => {
  const [novels, setNovels] = useState(mockNovels);
  const [filteredNovels, setFilteredNovels] = useState(mockNovels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [novelsPerPage] = useState(5);
  
  // Extraire les catégories uniques
  const uniqueCategories = [...new Set(
    novels.flatMap(novel => 
      Array.isArray(novel.categories) 
        ? novel.categories 
        : [novel.category]
    ).filter(Boolean)
  )];
  
  // Référence pour le gestionnaire de modales
  const modalManagerRef = React.useRef(null);

  // Filtrer les romans
  useEffect(() => {
    let filtered = novels;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(novel => {
        const searchLower = searchQuery.toLowerCase();
        const categoriesText = Array.isArray(novel.categories) 
          ? novel.categories.join(' ').toLowerCase()
          : (novel.category || '').toLowerCase();
        
        return novel.title.toLowerCase().includes(searchLower) ||
               novel.description.toLowerCase().includes(searchLower) ||
               categoriesText.includes(searchLower);
      });
    }

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(novel => novel.status === selectedStatus);
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(novel => {
        if (Array.isArray(novel.categories)) {
          return novel.categories.includes(selectedCategory);
        }
        return novel.category === selectedCategory;
      });
    }

    setFilteredNovels(filtered);
    setCurrentPage(1);
  }, [novels, searchQuery, selectedStatus, selectedCategory]);

  // Pagination
  const indexOfLastNovel = currentPage * novelsPerPage;
  const indexOfFirstNovel = indexOfLastNovel - novelsPerPage;
  const currentNovels = filteredNovels.slice(indexOfFirstNovel, indexOfLastNovel);
  const totalPages = Math.ceil(filteredNovels.length / novelsPerPage);

  const handleCreateNovel = async (formData) => {
    try {
      // Appeler votre API pour créer le roman
      console.log('Création du roman:', formData);
      
      // Simuler un nouveau roman créé
      const newNovel = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        categories: formData.categories,
        status: 'draft',
        chapters: 0,
        views: 0,
        likes: 0,
        comments: 0,
        bookmarked: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImage: null
      };
      
      setNovels(prevNovels => [newNovel, ...prevNovels]);
    } catch (error) {
      console.error('Erreur lors de la création du roman:', error);
    }
  };

  const handleSaveNovel = async (formData, novelId, selectedImage) => {
    try {
      // Appeler votre API pour sauvegarder les modifications
      console.log('Sauvegarde du roman:', formData, novelId, selectedImage);
      
      // Mettre à jour le roman localement
      setNovels(prevNovels => 
        prevNovels.map(n => 
          n.id === novelId 
            ? { 
                ...n, 
                title: formData.title,
                description: formData.description,
                categories: formData.categories,
                updatedAt: new Date().toISOString()
              }
            : n
        )
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du roman:', error);
    }
  };

  const handleSubmitRequest = async (novel, requestType) => {
    try {
      // Appeler votre API pour soumettre la demande
      console.log('Soumission de la demande:', novel, requestType);
      
      // Mettre à jour le statut localement si nécessaire
      if (requestType === 'publication') {
        setNovels(prevNovels => 
          prevNovels.map(n => 
            n.id === novel.id 
              ? { ...n, status: 'pending' }
              : n
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
    }
  };

  const handlePublishNovel = async (novel) => {
    try {
      // Appeler votre API pour publier le roman
      console.log('Publication du roman:', novel);
      // Mettre à jour le statut du roman localement
      setNovels(prevNovels => 
        prevNovels.map(n => 
          n.id === novel.id 
            ? { ...n, status: 'published', publishedAt: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('Erreur lors de la publication du roman:', error);
    }
  };

  const handleDeleteNovel = async (novel) => {
    try {
      // Appeler votre API pour supprimer le roman
      console.log('Suppression du roman:', novel);
      // Retirer le roman de la liste localement
      setNovels(prevNovels => prevNovels.filter(n => n.id !== novel.id));
    } catch (error) {
      console.error('Erreur lors de la suppression du roman:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Mes Romans</h1>
          <button
            onClick={() => {
              console.log('🔘 Create button clicked, modalManagerRef:', modalManagerRef.current);
              modalManagerRef.current?.openModal('CREATE');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            + Nouveau Roman
          </button>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un roman..."
              className="w-full pl-14 pr-4 py-4 bg-slate-800/60 border border-slate-600/50 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-slate-800/80 focus:border-purple-500/50 h-[53px] text-lg transition-all duration-200"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-300" />
          </div>

              <NovelStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
              />
              <NovelCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={uniqueCategories}
              />
      </div>

        {filteredNovels.length === 0 ? (
          <NoResults searchQuery={searchQuery} />
        ) : (
          <div className="space-y-4">
              {currentNovels.map((novel) => (
              <div
                key={novel.id}
                className="group bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer"
                onClick={() => {
                  console.log('📖 Novel clicked:', novel.title, 'modalManagerRef:', modalManagerRef.current);
                  modalManagerRef.current?.openModal('DETAILS', novel);
                }}
                    >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Image de couverture ou placeholder */}
                  <div className="relative w-[85px] aspect-[3/4] bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg overflow-hidden shadow-lg group-hover:shadow-purple-500/10 transition-all duration-200">
                    {novel.coverImage ? (
                      <img
                        src={novel.coverImage}
                        alt={novel.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                        <BookOpen className="w-8 h-8 text-slate-400/80" />
                      </div>
                    )}
                    {/* Effet de brillance sur le bord */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>

                  {/* Informations du roman */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-300 transition-colors duration-200">
                          {novel.title}
                        </h3>
                        <StatusBadge status={novel.status} />
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm line-clamp-2 break-all overflow-hidden text-ellipsis max-w-full">
                      {novel.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(novel.categories) ? (
                        novel.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-medium whitespace-nowrap"
                          >
                            {category}
                          </span>
                        ))
                      ) : (
                        novel.category && (
                          <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-medium whitespace-nowrap">
                            {novel.category}
                          </span>
                        )
                      )}
                    </div>

                    {/* Métriques et date */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{novel.chapters} chapitres</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">Mis à jour le {new Date(novel.updatedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">Créé le {new Date(novel.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ))}

        {/* Pagination */}
        <NovelPagination
          currentPage={currentPage}
              totalPages={Math.ceil(filteredNovels.length / novelsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
          )}
        </div>

      {/* Gestionnaire de modales */}
      <NovelModalManager
        ref={modalManagerRef}
        onSaveNovel={handleSaveNovel}
        onPublishNovel={handlePublishNovel}
        onDeleteNovel={handleDeleteNovel}
        onCreateNovel={handleCreateNovel}
        onSubmitRequest={handleSubmitRequest}
      />
    </div>
  );
};

export default MyNovels; 