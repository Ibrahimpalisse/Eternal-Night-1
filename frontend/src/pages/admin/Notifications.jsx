import React, { useState } from 'react';
import { AuthorRequestsSection, ReportedCommentsSection } from '../../components/admin/notifications';
import { FileEdit, MessageSquare } from 'lucide-react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('author-requests');

  const tabs = [
    {
      id: 'author-requests',
      label: 'Demandes d\'Auteurs',
      icon: <FileEdit className="w-4 h-4" />,
      component: <AuthorRequestsSection />
    },
    {
      id: 'reported-comments',
      label: 'Commentaires Signalés',
      icon: <MessageSquare className="w-4 h-4" />,
      component: <ReportedCommentsSection />
    }
  ];

  return (
    <div className="admin-page p-2 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
      {/* Header de la page */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          Gérez toutes les demandes des auteurs et les commentaires signalés
        </p>
      </div>

      {/* Onglets */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="flex border-b border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 relative ${
                activeTab === tab.id
                  ? 'text-white bg-slate-700/50 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-blue-400' : 'text-gray-500'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu de l'onglet actif */}
        <div className="p-4 sm:p-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
