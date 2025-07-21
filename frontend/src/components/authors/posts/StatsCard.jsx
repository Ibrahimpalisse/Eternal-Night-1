import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    pink: 'text-pink-400',
    purple: 'text-purple-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400'
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {Icon && <Icon className={`w-6 h-6 ${colorClasses[color]}`} />}
      </div>
      <p className={`text-2xl md:text-3xl font-bold ${colorClasses[color]} mb-1`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
};

export default StatsCard; 