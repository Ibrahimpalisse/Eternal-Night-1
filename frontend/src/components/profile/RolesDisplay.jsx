import React from 'react';

const RolesDisplay = ({ user }) => {
  // Vérifier si l'utilisateur a des rôles avec descriptions
  const rolesWithDescription = user?.rolesWithDescription || [];
  
  if (!rolesWithDescription || rolesWithDescription.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">Rôles</h3>
        <p className="text-gray-400">Aucun rôle assigné</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Rôles et Descriptions</h3>
      <div className="space-y-3">
        {rolesWithDescription.map((roleData, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-white capitalize mb-1">
                  {roleData.role}
                </h4>
                <p className="text-sm text-gray-300">
                  {roleData.description || 'Aucune description disponible'}
                </p>
              </div>
              <div className="ml-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {roleData.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesDisplay; 