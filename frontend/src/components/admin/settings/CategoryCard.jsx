import React from 'react';
import { Edit, Trash2, Tag, BookOpen } from 'lucide-react';

const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete, 
  getColorClasses 
}) => {
  return (
    <div
      className={`bg-slate-700/30 backdrop-blur-sm border ${getColorClasses(category.color)} rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all hover:scale-105 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <div className={`p-1.5 sm:p-2 rounded-lg ${getColorClasses(category.color).replace('border-', 'bg-').replace('/30', '/20')} flex-shrink-0`}>
            <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <h3 className="font-semibold text-white text-sm sm:text-base truncate">{category.name}</h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="p-1 sm:p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Modifier"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(category)}
            disabled={category.novelsCount > 0}
            className="p-1 sm:p-1.5 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
            title={category.novelsCount > 0 ? "Impossible de supprimer (contient des romans)" : "Supprimer"}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-300">{category.novelsCount} romans</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard; 