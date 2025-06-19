import React, { useState } from 'react';
import { Calendar, Eye, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { getRoleIcons, getRoleBadges, getSmartStatus, getSmartStatusIcon, getSmartStatusBadge } from './userUtils.jsx';
import UserPagination from './UserPagination';
import DeleteUserDialog from '../DeleteUserDialog';

const UserTable = ({
  users,
  currentPage,
  totalPages,
  totalUsers,
  startIndex,
  endIndex,
  onPageChange,
  onFirst,
  onPrevious,
  onNext,
  onLast,
  onViewUser,
  onEditUser,
  onDeleteUser,
  isModalOpen,
  isEditModalOpen
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (user, password) => {
    if (onDeleteUser) {
      await onDeleteUser(user, password);
    }
  };

  return (
    <>
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden">
        {/* Version mobile/tablette en cartes */}
        <div className="block lg:hidden">
          <div className="p-3 sm:p-4">
            <div className="space-y-3">
              {users.map((userData) => (
                <div key={userData.id} className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm sm:text-base">
                          {userData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm sm:text-base truncate">{userData.name}</div>
                        <div className="text-gray-400 text-xs sm:text-sm truncate">{userData.email}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(userData.joinDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isModalOpen && !isEditModalOpen && !deleteDialogOpen) {
                            onViewUser(userData);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Voir les détails"
                        disabled={isModalOpen || isEditModalOpen || deleteDialogOpen}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isModalOpen && !isEditModalOpen && !deleteDialogOpen) {
                            onEditUser(userData);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Modifier l'utilisateur"
                        disabled={isModalOpen || isEditModalOpen || deleteDialogOpen}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isModalOpen && !isEditModalOpen && !deleteDialogOpen) {
                            handleDeleteClick(userData);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Supprimer l'utilisateur"
                        disabled={isModalOpen || isEditModalOpen || deleteDialogOpen}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Version desktop en tableau */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-600/50">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Utilisateur</th>
                <th className="text-left p-4 text-gray-300 font-medium">Inscription</th>
                <th className="text-right p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr key={userData.id} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {userData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{userData.name}</div>
                        <div className="text-gray-400 text-sm">{userData.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(userData.joinDate).toLocaleDateString('fr-FR')}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isModalOpen && !isEditModalOpen && !deleteDialogOpen) {
                            onViewUser(userData);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Voir les détails"
                        disabled={isModalOpen || isEditModalOpen || deleteDialogOpen}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isModalOpen && !isEditModalOpen && !deleteDialogOpen) {
                            onEditUser(userData);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Modifier l'utilisateur"
                        disabled={isModalOpen || isEditModalOpen || deleteDialogOpen}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isModalOpen && !isEditModalOpen && !deleteDialogOpen) {
                            handleDeleteClick(userData);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Supprimer l'utilisateur"
                        disabled={isModalOpen || isEditModalOpen || deleteDialogOpen}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button 
                        className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Plus d'options"
                        disabled={isModalOpen || isEditModalOpen || deleteDialogOpen}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={onPageChange}
          onFirst={onFirst}
          onPrevious={onPrevious}
          onNext={onNext}
          onLast={onLast}
          itemLabel="utilisateur"
        />
      </div>

      {/* Dialog de suppression */}
      <DeleteUserDialog
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default UserTable; 