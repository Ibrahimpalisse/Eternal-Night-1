import React, { useState, useEffect } from 'react';

import UserEditModal from './UserEditModal';
import {
  UserStatsCards,
  UserFilters,
  UserTable,
  UserDetailsModal,
  filterUsers,
  getPaginatedData
} from './users/index';
import { mockUsers, mockWorks } from './users/mockData';

const UsersContent = () => {
  // États principaux
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  
  // États des modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Calcul des statistiques
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const suspendedUsers = mockUsers.filter(u => u.status === 'suspended').length;
  const blockedUsers = mockUsers.filter(u => u.status === 'blocked').length;
  const authorSuspendedUsers = mockUsers.filter(u => u.roles && u.roles.includes('author_suspended')).length;

  // Filtrage et pagination
  const filteredUsers = filterUsers(mockUsers, searchTerm, filterRole, filterStatus);
  const { paginatedData: currentUsers, startIndex, endIndex, totalPages } = 
    getPaginatedData(filteredUsers, currentPage, usersPerPage);

  // Reset de la page lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  // Fonctions de pagination
  const handlePageChange = (page) => setCurrentPage(page);
  const handleFirst = () => setCurrentPage(1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleLast = () => setCurrentPage(totalPages);

  const handleUsersPerPageChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };

  // Fonctions des modals
  const openUserModal = (user) => {
    if (!user || isModalOpen || isEditModalOpen) return;
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUser(null), 150);
  };

  const openEditModal = (user) => {
    if (!user || isModalOpen || isEditModalOpen) return;
    setUserToEdit(user);
    setIsEditModalOpen(true);
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

  return (
    <main className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
      {/* Header de la page */}
      <div className="mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Gérez tous les utilisateurs de la plateforme</p>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <UserStatsCards
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        suspendedUsers={suspendedUsers}
        blockedUsers={blockedUsers}
        authorSuspendedUsers={authorSuspendedUsers}
      />

      {/* Filtres et recherche */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        usersPerPage={usersPerPage}
        onUsersPerPageChange={handleUsersPerPageChange}
      />

      {/* Tableau des utilisateurs */}
      <UserTable
        users={currentUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={filteredUsers.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
        onFirst={handleFirst}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onLast={handleLast}
        onViewUser={openUserModal}
        onEditUser={openEditModal}
        onDeleteUser={handleDeleteUser}
        isModalOpen={isModalOpen}
        isEditModalOpen={isEditModalOpen}
      />

      {/* Modal d'édition utilisateur */}
      <UserEditModal
        user={userToEdit}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveUser}
      />

      {/* Modal de détails utilisateur */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeUserModal}
        userWorks={selectedUser ? mockWorks[selectedUser.id] || [] : []}
      />
    </main>
  );
};

export default UsersContent; 