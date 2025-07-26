import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      label: 'Brouillon',
      className: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    },
    pending: {
      label: 'En attente',
      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    },
    accepted: {
      label: 'Accepté',
      className: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    published: {
      label: 'Publié',
      className: 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-2.5 lg:py-1 rounded-full text-xs sm:text-sm font-medium border ${config.className} transition-colors duration-200 whitespace-nowrap`}>
      {config.label}
    </span>
  );
};

export default StatusBadge; 