import React, { useState, useEffect } from 'react';
import UserEditModal from './UserEditModal';
import {
  UserStatsCards,
  UserFilters,
  UserTable,
  UserDetailsModal,
  UserCommentsHistoryModal,
  UserLoginHistoryModal,
  UserSearchHistoryModal,
  filterUsers,
  getPaginatedData,
  getPrimaryRole,
  getRoleLabel,
  getRoleColors,
  getStatusColors,
  getStatusLabel
} from './users/index';
import { Pagination } from './table';
import { mockUsers, mockWorks } from './users/mockData';
import DeleteUserDialog from './users/DeleteUserDialog';

const UsersContent = () => {
  // États principaux
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // États des modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // État pour le dialog de suppression
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // État pour l'historique des commentaires
  const [userForComments, setUserForComments] = useState(null);
  const [isCommentsHistoryOpen, setIsCommentsHistoryOpen] = useState(false);

  // État pour l'historique des connexions
  const [userForLoginHistory, setUserForLoginHistory] = useState(null);
  const [isLoginHistoryOpen, setIsLoginHistoryOpen] = useState(false);

  // État pour l'historique de recherche
  const [userForSearchHistory, setUserForSearchHistory] = useState(null);
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);

  // Calcul des statistiques basées sur les nouveaux rôles et statuts
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const blockedUsers = mockUsers.filter(u => u.status === 'blocked').length;
  const authorSuspendedUsers = mockUsers.filter(u => u.status === 'author_suspended').length;
  // Note: on retire suspendedUsers car ce statut n'existe plus

  // Filtrage et pagination
  const filteredUsers = filterUsers(mockUsers, searchTerm, filterRole, filterStatus);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfFirstUser = (currentPage - 1) * usersPerPage;
  const indexOfLastUser = Math.min(currentPage * usersPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset de la page lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  // Fonctions des modals
  const openUserModal = (user) => {
    if (!user || isModalOpen || isEditModalOpen) {
      return;
    }
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUser(null), 150);
    // Ne pas fermer les autres modals - ils restent ouverts
  };

  const openEditModal = (user) => {
    if (!user || isEditModalOpen) return;
    setUserToEdit(user);
    setIsEditModalOpen(true);
    // Fermer le modal de détails s'il est ouvert
    if (isModalOpen) {
      setIsModalOpen(false);
      setTimeout(() => setSelectedUser(null), 150);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setUserToEdit(null), 150);
  };

  const handleSaveUser = async (updatedUser) => {
    console.log('Sauvegarde de l\'utilisateur:', updatedUser);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Utilisateur sauvegardé avec succès');
        resolve();
      }, 1000);
    });
  };

  const handleDeleteUser = async (user, password) => {
    console.log('Suppression de l\'utilisateur:', user.name, 'avec mot de passe:', password);
    
    // Simulation d'une vérification du mot de passe
    if (password !== 'admin123') { // Ici vous devriez vérifier avec votre API
      throw new Error('Mot de passe incorrect');
    }
    
    // Simulation de la suppression
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Ici vous feriez l'appel à votre API pour supprimer l'utilisateur
        console.log('Utilisateur supprimé avec succès:', user.name);
        resolve();
      }, 1500);
    });
  };

  const openDeleteDialog = (user) => {
    if (!user || isDeleteDialogOpen) return;
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
    // Fermer le modal de détails s'il est ouvert
    if (isModalOpen) {
      setIsModalOpen(false);
      setTimeout(() => setSelectedUser(null), 150);
    }
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTimeout(() => setUserToDelete(null), 150);
  };

  const openCommentsHistory = (user) => {
    if (!user || isCommentsHistoryOpen) return;
    setUserForComments(user);
    setIsCommentsHistoryOpen(true);
    // Fermer le modal de détails s'il est ouvert
    if (isModalOpen) {
      setIsModalOpen(false);
      setTimeout(() => setSelectedUser(null), 150);
    }
  };

  const closeCommentsHistory = () => {
    setIsCommentsHistoryOpen(false);
    setTimeout(() => setUserForComments(null), 150);
  };

  const openLoginHistory = (user) => {
    if (!user || isLoginHistoryOpen) return;
    setUserForLoginHistory(user);
    setIsLoginHistoryOpen(true);
    // Fermer le modal de détails s'il est ouvert
    if (isModalOpen) {
      setIsModalOpen(false);
      setTimeout(() => setSelectedUser(null), 150);
    }
  };

  const closeLoginHistory = () => {
    setIsLoginHistoryOpen(false);
    setTimeout(() => setUserForLoginHistory(null), 150);
  };

  const openSearchHistory = (user) => {
    if (!user || isSearchHistoryOpen) return;
    setUserForSearchHistory(user);
    setIsSearchHistoryOpen(true);
    // Fermer le modal de détails s'il est ouvert
    if (isModalOpen) {
      setIsModalOpen(false);
      setTimeout(() => setSelectedUser(null), 150);
    }
  };

  const closeSearchHistory = () => {
    setIsSearchHistoryOpen(false);
    setTimeout(() => setUserForSearchHistory(null), 150);
  };

  // Fonction pour gérer le clic sur un utilisateur dans les popups
  const handleUserClick = (userName) => {
    // Rechercher l'utilisateur par nom dans la liste des utilisateurs
    const foundUser = mockUsers.find(user => user.name === userName);
    
    if (foundUser) {
      // Ne pas fermer les modals existants, juste ouvrir le modal de détails par-dessus
      setSelectedUser(foundUser);
      setIsModalOpen(true);
    } else {
      // Créer un utilisateur fictif pour les utilisateurs qui n'existent pas dans mockUsers
      const fictiveUser = {
        id: `fictive-${Date.now()}`,
        name: userName,
        email: `${userName.toLowerCase().replace(' ', '.')}@example.com`,
        roles: ['user'],
        status: 'active',
        joinDate: '2024-01-01',
        lastLogin: '2024-01-20',
        totalComments: Math.floor(Math.random() * 50) + 1,
        worksCount: Math.floor(Math.random() * 5),
        followersCount: Math.floor(Math.random() * 100),
        likesReceived: Math.floor(Math.random() * 200)
      };
      
      // Ne pas fermer les modals existants, juste ouvrir le modal de détails par-dessus
      setSelectedUser(fictiveUser);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="admin-page p-2 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6 w-full min-w-0 overflow-hidden">
      {/* Header de la page - Responsive */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Gestion des Utilisateurs</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">Gérez tous les utilisateurs de la plateforme</p>
      </div>

      {/* Cartes de statistiques - Responsive */}
      <UserStatsCards
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        blockedUsers={blockedUsers}
        authorSuspendedUsers={authorSuspendedUsers}
      />

      {/* Section de recherche et filtres - Optimisée mobile */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Barre de recherche principale - Responsive */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 md:pl-6 pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 md:pl-16 pr-4 sm:pr-6 py-2.5 sm:py-3 md:py-4 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm sm:text-base transition-all duration-200"
            />
          </div>
          
          {/* Filtres - Layout moderne responsive */}
          <div className="w-full overflow-hidden">
            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>
        </div>
      </div>

      {/* Tableau/Liste des utilisateurs - Composant UserTable */}
      <UserTable
        users={currentUsers.map(user => ({
          ...user,
          joinDate: user.joinDate
        }))}
        onViewUser={openUserModal}
        onEditUser={openEditModal}
        onDeleteUser={openDeleteDialog}
        onViewComments={openCommentsHistory}
        onViewLoginHistory={openLoginHistory}
        onViewSearchHistory={openSearchHistory}
        isModalOpen={isModalOpen}
        isEditModalOpen={isEditModalOpen}
      />

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={usersPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal de détails */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={closeUserModal}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
        />
      )}

      {/* Modal d'édition */}
      {userToEdit && (
        <UserEditModal
          user={userToEdit}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}

      {/* Dialog de suppression */}
      {userToDelete && (
        <DeleteUserDialog
          user={userToDelete}
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteUser}
        />
      )}

      {/* Modal d'historique des commentaires */}
      {userForComments && (
        <UserCommentsHistoryModal
          user={userForComments}
          isOpen={isCommentsHistoryOpen}
          onClose={closeCommentsHistory}
          onUserClick={handleUserClick}
        />
      )}

      {/* Modal d'historique des connexions */}
      {userForLoginHistory && (
        <UserLoginHistoryModal
          user={userForLoginHistory}
          isOpen={isLoginHistoryOpen}
          onClose={closeLoginHistory}
          onUserClick={handleUserClick}
        />
      )}

      {/* Modal d'historique de recherche */}
      {userForSearchHistory && (
        <UserSearchHistoryModal
          user={userForSearchHistory}
          isOpen={isSearchHistoryOpen}
          onClose={closeSearchHistory}
          onUserClick={handleUserClick}
        />
      )}
    </div>
  );
};

export default UsersContent; 