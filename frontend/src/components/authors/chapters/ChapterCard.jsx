import React from 'react';
import { FileText, BookOpen, Clock, Calendar, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ChapterCard = ({ chapter, onChapterClick, formatWordCount }) => {
  return (
    <div
      onClick={() => onChapterClick(chapter)}
      className="group bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer w-full overflow-hidden"
    >
      <div className="flex flex-row items-start gap-3 sm:gap-4 w-full">
        {/* Icône du chapitre */}
        <div className="relative w-[65px] sm:w-[100px] aspect-[2/3] flex-shrink-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg overflow-hidden shadow-lg group-hover:shadow-purple-500/10 transition-all duration-200">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-slate-400/80" />
          </div>
          {/* Effet de brillance sur le bord */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Informations du chapitre */}
        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3 w-full">
          <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
            {/* Titre et statut */}
            <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap">
              <h3 className="text-sm sm:text-lg font-semibold text-white truncate max-w-[180px] sm:max-w-[300px] group-hover:text-purple-300 transition-colors duration-200">
                {chapter.title}
              </h3>
              <StatusBadge status={chapter.status} />
            </div>

            {/* Roman parent */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="text-[11px] sm:text-sm text-gray-400 truncate">
                Roman: <span className="text-purple-300 truncate">{chapter.novelTitle}</span>
              </span>
            </div>
          </div>

          {/* Métriques et date */}
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1.5 text-[11px] sm:text-sm text-slate-400">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{formatWordCount(chapter.wordCount)}</span>
            </div>
            {chapter.status === 'published' && (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{chapter.views} vues</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Mis à jour le {new Date(chapter.updatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Créé le {new Date(chapter.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            {/* Version mobile des dates */}
            <div className="sm:hidden text-[10px] text-gray-500 w-full">
              Mis à jour: {new Date(chapter.updatedAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard; 