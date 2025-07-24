import React from 'react';
import { Bookmark } from 'lucide-react';

const BookmarksHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
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