import React from 'react';

const RankingBadge = ({ ranking, size = 'default', className = '' }) => {
  if (!ranking) return null;

  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    default: 'text-sm sm:text-base px-2 py-1',
    large: 'text-base sm:text-lg px-3 py-1.5'
  };

  return (
    <div className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg shadow-lg backdrop-blur-sm border border-amber-400/30 ${sizeClasses[size]} ${className}`}>
      {ranking.toString().padStart(2, '0')}
    </div>
  );
};

export default RankingBadge; 