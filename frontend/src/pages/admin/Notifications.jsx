import React, { useState } from 'react';
import { AuthorRequestsSection, ReportedCommentsSection, AdminAuthorPostsSection } from '../../components/admin/notifications';
import { FileEdit, MessageSquare, PenTool } from 'lucide-react';

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
    },
    {
      id: 'author-posts',
      label: 'Posts d\'Auteurs',
      icon: <PenTool className="w-4 h-4" />,
      component: <AdminAuthorPostsSection />
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
        <div className="flex flex-col sm:flex-row border-b border-slate-700/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base font-medium transition-all duration-200 relative whitespace-nowrap border-b-2 sm:border-b-0 sm:border-r last:border-r-0 flex-1 sm:flex-none ${
                activeTab === tab.id
                  ? 'text-white bg-slate-700/50 border-blue-500 sm:border-b-2 sm:border-r-0'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/30 border-transparent'
              }`}
            >
              <span className={`flex-shrink-0 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-500'}`}>
                {tab.icon}
              </span>
              <span className="truncate">{tab.label}</span>
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
