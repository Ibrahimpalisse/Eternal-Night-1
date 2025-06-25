import React from 'react';
import { Users as UsersIcon, UserCheck, UserX, EyeOff, AlertTriangle } from 'lucide-react';

const UserStatsCards = ({ totalUsers, activeUsers, blockedUsers, authorSuspendedUsers }) => {
  const stats = [
    {
      label: 'Total Utilisateurs',
      value: totalUsers,
      icon: UsersIcon,
      color: 'blue',
      bgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Utilisateurs Actifs',
      value: activeUsers,
      icon: UserCheck,
      color: 'green',
      bgColor: 'bg-green-500/20',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'Comptes Bloqués',
      value: blockedUsers,
      icon: EyeOff,
      color: 'red',
      bgColor: 'bg-red-500/20',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/30'
    },
    {
      label: 'Auteurs Suspendus',
      value: authorSuspendedUsers,
      icon: AlertTriangle,
      color: 'yellow',
      bgColor: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className={`bg-slate-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${stat.borderColor} hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2.5 sm:p-3 ${stat.bgColor} rounded-xl sm:rounded-2xl border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs sm:text-sm lg:text-base font-medium">{stat.label}</p>
                <p className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mt-0.5 sm:mt-1 group-hover:scale-105 transition-transform duration-300">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStatsCards; 