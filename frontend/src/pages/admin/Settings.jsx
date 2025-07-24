import React from 'react';
import { CategoryManagementSection } from '../../components/admin/settings';

const Settings = () => {
  return (
    <div className="admin-page p-2 sm:p-4 md:p-6 lg:p-8 w-full min-w-0 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
          Paramètres
        </h1>

        {/* Section Gestion des Catégories */}
        <CategoryManagementSection />

        {/* Autres sections de paramètres peuvent être ajoutées ici */}
      </div>
    </div>
  );
};

export default Settings; 