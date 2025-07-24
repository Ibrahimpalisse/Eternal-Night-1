import React, { useState, useMemo } from 'react';
import { Plus, Tag, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import CategoryCard from './CategoryCard';
import CategoryModal from './CategoryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const CategoryManagementSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Données mock pour les catégories
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fantasy', novelsCount: 45, readersCount: 1200, color: 'purple' },
    { id: 2, name: 'Romance', novelsCount: 32, readersCount: 890, color: 'pink' },
    { id: 3, name: 'Action', novelsCount: 28, readersCount: 750, color: 'red' },
    { id: 4, name: 'Thriller', novelsCount: 19, readersCount: 520, color: 'orange' },
    { id: 5, name: 'Science-Fiction', novelsCount: 15, readersCount: 380, color: 'blue' },
    { id: 6, name: 'Mystère', novelsCount: 12, readersCount: 290, color: 'gray' }
  ]);

  // Filtrer les catégories basé sur le terme de recherche
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const getColorClasses = (color) => {
    const colorMap = {
      purple: 'bg-purple-600/20 border-purple-500/30 text-purple-400',
      pink: 'bg-pink-600/20 border-pink-500/30 text-pink-400',
      red: 'bg-red-600/20 border-red-500/30 text-red-400',
      orange: 'bg-orange-600/20 border-orange-500/30 text-orange-400',
      blue: 'bg-blue-600/20 border-blue-500/30 text-blue-400',
      gray: 'bg-gray-600/20 border-gray-500/30 text-gray-400'
    };
    return colorMap[color] || colorMap.purple;
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingCategory(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditMode(true);
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      alert('Le nom de la catégorie est requis');
      return;
    }

    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditMode) {
        // Mode édition
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name: categoryName }
            : cat
        ));
        alert('Catégorie modifiée avec succès');
      } else {
        // Mode création
        const newCategory = {
          id: Date.now(),
          name: categoryName,
          novelsCount: 0,
          readersCount: 0,
          color: ['purple', 'pink', 'red', 'orange', 'blue', 'gray'][Math.floor(Math.random() * 6)]
        };
        setCategories(prev => [...prev, newCategory]);
        alert('Catégorie créée avec succès');
      }
      
      setCategoryName('');
      setIsModalOpen(false);
    } catch (error) {
      alert(isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (category.novelsCount > 0) {
      alert('Impossible de supprimer une catégorie contenant des romans');
      return;
    }

    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      alert('Catégorie supprimée avec succès');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      alert('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden mb-4 sm:mb-6">
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
            <div className="bg-purple-600/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1">
                Gestion des Catégories
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                Créez et gérez les catégories de romans disponibles
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isCategoriesExpanded ? "Réduire la liste" : "Agrandir la liste"}
            >
              {isCategoriesExpanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={openCreateModal}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Nouvelle Catégorie</span>
              <span className="xs:hidden">Nouvelle</span>
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        {isCategoriesExpanded && (
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 md:pl-6 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 md:pl-16 pr-4 sm:pr-6 py-2.5 sm:py-3 md:py-4 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm sm:text-base transition-all duration-200"
                placeholder="Rechercher une catégorie..."
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 md:pr-6 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-xs sm:text-sm text-gray-400">
                {filteredCategories.length === 0 ? (
                  <span>Aucune catégorie trouvée pour "{searchTerm}"</span>
                ) : (
                  <span>{filteredCategories.length} catégorie{filteredCategories.length > 1 ? 's' : ''} trouvée{filteredCategories.length > 1 ? 's' : ''}</span>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Liste des catégories */}
        {isCategoriesExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={openEditModal}
                onDelete={handleDeleteCategory}
                getColorClasses={getColorClasses}
              />
            ))}
          </div>
        )}

        {isCategoriesExpanded && filteredCategories.length === 0 && !searchTerm && (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <Tag className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
            <p className="text-sm sm:text-base">Aucune catégorie créée</p>
            <p className="text-xs sm:text-sm">Cliquez sur "Nouvelle Catégorie" pour commencer</p>
          </div>
        )}

        {!isCategoriesExpanded && (
          <div className="text-center py-3 sm:py-4 text-gray-400">
            <p className="text-xs sm:text-sm">Liste réduite • {categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        categoryToDelete={categoryToDelete}
        isLoading={isLoading}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CategoryManagementSection; 