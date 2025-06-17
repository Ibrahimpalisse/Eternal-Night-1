import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'settings',
      label: 'Paramètres',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
    // Vous pouvez ajouter d'autres onglets ici plus tard
  ];

  return (
    <div className="bg-gray-900/50 rounded-lg border border-white/10 mb-8 backdrop-blur-sm overflow-x-auto">
      <div className="flex w-full justify-between sm:justify-start border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className={`transition-all duration-200 ${
                activeTab === tab.id ? 'text-purple-400' : 'text-gray-400'
              }`}>
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Indicateur mobile pour l'onglet actif */}
      <div className="sm:hidden bg-gray-800/50 px-4 py-2 text-center">
        <span className="text-sm text-gray-300">
          {tabs.find(tab => tab.id === activeTab)?.label}
        </span>
      </div>
    </div>
  );
};

export default ProfileTabs; 