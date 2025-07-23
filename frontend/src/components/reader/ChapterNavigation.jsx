import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ChapterNavigation = ({
  chapterData,
  goToPreviousChapter,
  goToNextChapter
}) => {
  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-black/20 to-transparent pt-8 pb-4">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="rounded-xl backdrop-blur-sm border border-slate-700/50 bg-slate-800/80">
          <div className="flex items-center justify-between p-4">
            
            <button
              onClick={goToPreviousChapter}
              disabled={!chapterData.previousChapter}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                chapterData.previousChapter
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30' 
                  : 'bg-slate-700/50 text-gray-500 border border-slate-600/50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Précédent</span>
            </button>

            <button
              onClick={goToNextChapter}
              disabled={!chapterData.nextChapter}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                chapterData.nextChapter
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30' 
                  : 'bg-slate-700/50 text-gray-500 border border-slate-600/50'
              }`}
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterNavigation; 