import React from 'react';
import RoleFilter from './RoleFilter';
import UserStatusFilter from './UserStatusFilter';

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
      {/* Filtre par rôle */}
      <div className="space-y-1 sm:space-y-2">
        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300">
          Filtrer par rôle
        </label>
        <RoleFilter
          selectedRole={filterRole}
          onRoleChange={setFilterRole}
        />
      </div>

      {/* Filtre par statut */}
      <div className="space-y-1 sm:space-y-2">
        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300">
          Filtrer par statut
        </label>
        <UserStatusFilter
          selectedStatus={filterStatus}
          onStatusChange={setFilterStatus}
        />
      </div>
    </div>
  );
};

export default UserFilters; 