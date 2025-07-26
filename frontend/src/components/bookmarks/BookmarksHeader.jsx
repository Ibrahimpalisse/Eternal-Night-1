import React from 'react';
import { Bookmark } from 'lucide-react';

const BookmarksHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-purple-400" />
            Mes Favoris
          </h1>
          <p className="text-gray-400 text-sm">
            Retrouvez vos romans et chapitres épinglés
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarksHeader; 