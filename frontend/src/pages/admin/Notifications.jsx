import React, { useState, useEffect } from 'react';
import { AuthorRequestsSection, ReportedCommentsSection, AdminAuthorPostsSection, ReportedChaptersSection, ReportedPostsSection } from '../../components/admin/notifications';
import ReportedNovelsSection from '../../components/admin/notifications/ReportedNovelsSection';
import { FileEdit, MessageSquare, PenTool, BookOpen, Edit } from 'lucide-react';

const Notifications = () => {
  const tabs = [
    {
      id: 'author-requests',
      label: "Demandes d'Auteurs",
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
      id: 'reported-chapters',
      label: 'Chapitres Signalés',
      icon: <Edit className="w-4 h-4" />,
      component: <ReportedChaptersSection />
    },
    {
      id: 'reported-posts',
      label: 'Posts Signalés',
      icon: <PenTool className="w-4 h-4" />,
      component: <ReportedPostsSection />
    },
    {
      id: 'reported-novels',
      label: 'Romans Signalés',
      icon: <BookOpen className="w-4 h-4" />,
      component: <ReportedNovelsSection />
    }
  ];

  // 1. Lire le paramètre 'tab' dans l'URL au chargement
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return tabs.some(t => t.id === tab) ? tab : 'author-requests';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // 2. Mettre à jour l'URL quand activeTab change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  }, [activeTab]);

  return (
    <div className="admin-page p-2 sm:p-4 md:p-6 lg:p-8 w-full min-w-0 overflow-hidden">
      {/* Onglets de navigation - Responsive */}
      <div className="flex rounded-t-2xl overflow-x-auto bg-slate-900/60 border-b border-slate-700/50 mb-4 sm:mb-6 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 text-xs sm:text-sm md:text-base font-medium transition-all duration-200 relative whitespace-nowrap border-b-2 sm:border-b-0 sm:border-r last:border-r-0 flex-1 sm:flex-none text-white min-w-0 ${activeTab === tab.id ? 'bg-slate-700/50 border-blue-500 sm:border-b-2 sm:border-r-0' : 'bg-transparent border-transparent'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={`flex-shrink-0 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-400'}`}>{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>
      {/* Contenu de l'onglet actif */}
      <div className="mt-2 w-full overflow-hidden">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default Notifications;
