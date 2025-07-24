import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

const BookmarksTabs = ({ activeTab, setActiveTab, novelsCount, chaptersCount }) => {
  return (
    <div className="flex items-center gap-1 mb-6 bg-slate-800/50 rounded-xl p-1">
      <button
        onClick={() => setActiveTab('novels')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          activeTab === 'novels'
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span className="font-medium">Romans ({novelsCount})</span>
      </button>
      <button
        onClick={() => setActiveTab('chapters')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          activeTab === 'chapters'
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <Clock className="w-4 h-4" />
        <span className="font-medium">Chapitres ({chaptersCount})</span>
      </button>
    </div>
  );
};

export default BookmarksTabs; 