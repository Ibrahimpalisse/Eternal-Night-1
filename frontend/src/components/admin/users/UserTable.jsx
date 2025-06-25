import React from 'react';
import { Calendar, Eye, Edit3, Trash2, MoreHorizontal, MessageCircle } from 'lucide-react';
import { getRoleIcons, getRoleBadges, getSmartStatus, getSmartStatusIcon, getSmartStatusBadge } from './userUtils.jsx';
import ActionMenu from '../table/ActionMenu';

const UserTable = ({
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onViewComments,
  onViewLoginHistory,
  onViewSearchHistory,
  isModalOpen,
  isEditModalOpen
}) => {
  // Fonctions pour les actions du menu
  const handleView = (user) => {
    if (!isModalOpen && !isEditModalOpen) {
      onViewUser(user);
    }
  };

  const handleEdit = (user) => {
    if (!isModalOpen && !isEditModalOpen) {
      onEditUser(user);
    }
  };

  const handleDelete = (user) => {
    onDeleteUser(user);
  };

  const handleViewCommentsHistory = (user) => {
    if (!isModalOpen && !isEditModalOpen && onViewComments) {
      onViewComments(user);
    }
  };

  const handleViewLoginHistory = (user) => {
    if (!isModalOpen && !isEditModalOpen && onViewLoginHistory) {
      onViewLoginHistory(user);
    }
  };

  const handleViewSearchHistory = (user) => {
    if (!isModalOpen && !isEditModalOpen && onViewSearchHistory) {
      onViewSearchHistory(user);
    }
  };

  return (
    <>
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
        {/* Version mobile/tablette en cartes */}
        <div className="block lg:hidden">
          <div className="p-3 sm:p-4">
            <div className="space-y-3">
              {users.map((userData) => (
                <div key={userData.id} className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
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
                        {/* Badges de rôles et statut en mobile */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getRoleBadges(userData.roles, 2)}
                        </div>
                        {/* Badge de statut en mobile */}
                        <div className="flex items-center gap-1 mt-1">
                          <span className={getSmartStatusBadge(userData)}>
                            {getSmartStatus(userData).displayName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ActionMenu
                        item={userData}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewComments={handleViewCommentsHistory}
                        onViewLoginHistory={handleViewLoginHistory}
                        onViewSearchHistory={handleViewSearchHistory}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Version desktop en tableau */}
        <div className="hidden lg:block">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Utilisateur</th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rôles</th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Inscription</th>
                <th className="w-16 px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map((userData) => (
                <tr key={userData.id} className="hover:bg-slate-700/25 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {userData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{userData.name}</p>
                        <p className="text-gray-400 text-sm">{userData.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {getRoleBadges(userData.roles, 3)}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getSmartStatusIcon(userData)}
                      <span className={getSmartStatusBadge(userData)}>
                        {getSmartStatus(userData).displayName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-sm">
                      {new Date(userData.joinDate).toLocaleDateString('fr-FR')}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <ActionMenu
                      item={userData}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewComments={handleViewCommentsHistory}
                      onViewLoginHistory={handleViewLoginHistory}
                      onViewSearchHistory={handleViewSearchHistory}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun utilisateur */}
        {users.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-400">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

    </>
  );
  };

export default UserTable; 