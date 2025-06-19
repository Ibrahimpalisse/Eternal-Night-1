import React from 'react';
import { Users as UsersIcon, UserCheck, UserX, EyeOff, AlertTriangle } from 'lucide-react';

const UserStatsCards = ({ totalUsers, activeUsers, suspendedUsers, blockedUsers, authorSuspendedUsers }) => {
  const stats = [
    {
      label: 'Total Utilisateurs',
      value: totalUsers,
      icon: UsersIcon,
      color: 'blue',
      bgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      label: 'Utilisateurs Activés',
      value: activeUsers,
      icon: UserCheck,
      color: 'green',
      bgColor: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      label: 'Comptes Suspendus',
      value: suspendedUsers,
      icon: UserX,
      color: 'red',
      bgColor: 'bg-red-500/20',
      iconColor: 'text-red-400'
    },
    {
      label: 'Auteurs Suspendus',
      value: authorSuspendedUsers,
      icon: AlertTriangle,
      color: 'orange',
      bgColor: 'bg-orange-500/20',
      iconColor: 'text-orange-400'
    },
    {
      label: 'Comptes Désactivés',
      value: blockedUsers,
      icon: EyeOff,
      color: 'gray',
      bgColor: 'bg-gray-500/20',
      iconColor: 'text-gray-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-slate-800/80 rounded-xl p-3 sm:p-4 md:p-6 border border-slate-700/50 hover:bg-slate-800/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">{stat.label}</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ml-2 flex-shrink-0`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStatsCards; 