import React from 'react';
import { Bookmark, Clock } from 'lucide-react';

const EmptyState = ({ type, searchTerm }) => {
  const isNovels = type === 'novels';
  const Icon = isNovels ? Bookmark : Clock;
  const title = isNovels ? 'Aucun roman épinglé' : 'Aucun chapitre épinglé';
  const description = searchTerm 
    ? 'Aucun résultat pour votre recherche.' 
    : `Commencez à épingler vos ${isNovels ? 'romans' : 'chapitres'} favoris !`;

  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default EmptyState; 