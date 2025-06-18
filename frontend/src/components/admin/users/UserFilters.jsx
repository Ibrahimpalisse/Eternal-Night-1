import React from 'react';
import { Search } from 'lucide-react';

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  usersPerPage,
  onUsersPerPageChange
}) => {
  const roleOptions = [
    { value: 'all', label: 'Tous les rôles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'content_editor', label: 'Éditeur' },
    { value: 'author', label: 'Auteur' },
    { value: 'user', label: 'Utilisateur' },
    { value: 'blocked', label: 'Bloqué' },
    { value: 'author_suspended', label: 'Auteur suspendu' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Activé' },
    { value: 'blocked', label: 'Compte désactivé' },
    { value: 'author_suspended', label: 'Author_suspended' },
    { value: 'suspended', label: 'Compte suspendu' }
  ];

  const itemsPerPageOptions = [
    { value: 5, label: '5 par page' },
    { value: 10, label: '10 par page' },
    { value: 25, label: '25 par page' },
    { value: 50, label: '50 par page' }
  ];

  return (
    <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barre de recherche */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-3">
          {/* Filtre par rôle */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Filtre par statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Nombre d'éléments par page */}
          <select
            value={usersPerPage}
            onChange={(e) => onUsersPerPageChange(Number(e.target.value))}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserFilters; 