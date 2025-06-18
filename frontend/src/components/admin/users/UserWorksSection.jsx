import React, { useState } from 'react';
import { BookOpen, Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStatusBadgeForWork, getPageNumbers } from './userUtils.jsx';

const UserWorksSection = ({ userWorks = [] }) => {
  const [worksPage, setWorksPage] = useState(1);
  const [worksPerPage, setWorksPerPage] = useState(6);
  const [worksSearchTerm, setWorksSearchTerm] = useState('');
  const [worksFilterStatus, setWorksFilterStatus] = useState('all');

  // Fonctions pour la gestion des œuvres
  const getFilteredWorks = (works) => {
    return works.filter(work => {
      const matchesSearch = work.title.toLowerCase().includes(worksSearchTerm.toLowerCase()) ||
                           work.genre.toLowerCase().includes(worksSearchTerm.toLowerCase());
      const matchesStatus = worksFilterStatus === 'all' || work.status === worksFilterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getPaginatedWorks = (filteredWorks) => {
    const startIndex = (worksPage - 1) * worksPerPage;
    const endIndex = startIndex + worksPerPage;
    return filteredWorks.slice(startIndex, endIndex);
  };

  const getWorksPageNumbers = (totalWorks) => {
    const totalPages = Math.ceil(totalWorks / worksPerPage);
    return { pages: getPageNumbers(worksPage, totalPages), totalPages };
  };

  const filteredWorks = getFilteredWorks(userWorks);
  const paginatedWorks = getPaginatedWorks(filteredWorks);
  const { pages, totalPages } = getWorksPageNumbers(filteredWorks.length);

  return (
    <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Œuvres de l'auteur ({userWorks.length})
        </h3>
        
        {userWorks.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Publié: {userWorks.filter(w => w.status === 'Publié').length}</span>
            <span>En cours: {userWorks.filter(w => w.status === 'En cours').length}</span>
          </div>
        )}
      </div>
      
      {userWorks.length > 0 ? (
        <>
          {/* Filtres et recherche pour les œuvres */}
          <div className="bg-slate-600/30 rounded-lg p-4 mb-6 border border-slate-500/30">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher une œuvre..."
                    value={worksSearchTerm}
                    onChange={(e) => {
                      setWorksSearchTerm(e.target.value);
                      setWorksPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={worksFilterStatus}
                  onChange={(e) => {
                    setWorksFilterStatus(e.target.value);
                    setWorksPage(1);
                  }}
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Publié">Publié</option>
                  <option value="En cours">En cours</option>
                </select>
                
                <select
                  value={worksPerPage}
                  onChange={(e) => {
                    setWorksPerPage(Number(e.target.value));
                    setWorksPage(1);
                  }}
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="6">6 par page</option>
                  <option value="12">12 par page</option>
                  <option value="24">24 par page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grille des œuvres */}
          {filteredWorks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {paginatedWorks.map((work) => (
                  <div key={work.id} className="bg-slate-600/30 rounded-lg overflow-hidden border border-slate-500/30 hover:border-slate-400/50 transition-colors">
                    {/* Image de l'œuvre */}
                    <div className="aspect-[4/3] bg-slate-500/20 relative overflow-hidden">
                      <img 
                        src={work.image} 
                        alt={work.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 hidden items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={getStatusBadgeForWork(work.status)}>
                          {work.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Contenu de la carte */}
                    <div className="p-4">
                      <h4 className="font-semibold text-white text-lg mb-2 line-clamp-2">{work.title}</h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Genre :</span>
                          <span className="text-gray-300 font-medium">{work.genre}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Chapitres :</span>
                          <span className="text-gray-300 font-medium">{work.chapters}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Vues :</span>
                          <span className="text-gray-300 font-medium">{work.views.toLocaleString()}</span>
                        </div>
                        {work.rating && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Note :</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-gray-300 font-medium">{work.rating}/5</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination des œuvres */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
                  <div className="text-sm text-gray-400">
                    Affichage de {((worksPage - 1) * worksPerPage) + 1} à {Math.min(worksPage * worksPerPage, filteredWorks.length)} sur {filteredWorks.length} œuvre{filteredWorks.length > 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWorksPage(Math.max(1, worksPage - 1))}
                      disabled={worksPage === 1}
                      className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {pages.map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="px-3 py-2 text-gray-400">...</span>
                          ) : (
                            <button
                              onClick={() => setWorksPage(page)}
                              className={`px-3 py-2 rounded-lg border transition-colors ${
                                worksPage === page
                                  ? 'bg-purple-600 border-purple-500 text-white'
                                  : 'border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setWorksPage(Math.min(totalPages, worksPage + 1))}
                      disabled={worksPage === totalPages}
                      className="p-2 rounded-lg border border-slate-600/50 bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">Aucune œuvre trouvée avec ces critères</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">Aucune œuvre publiée pour le moment</p>
        </div>
      )}
    </div>
  );
};

export default UserWorksSection; 