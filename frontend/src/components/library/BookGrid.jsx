import React from 'react';
import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';

const BookGrid = ({ books, onBookClick }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun roman trouvé</h3>
          <p className="text-gray-500 text-sm">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={onBookClick}
        />
      ))}
    </div>
  );
};

export default BookGrid; 
 
 