import React from 'react';
import { ChevronDown } from 'lucide-react';

const GenreFilter = ({ selectedGenre, onGenreChange, genres }) => {
  return (
    <div className="relative">
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="appearance-none w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer pr-10"
      >
        {genres.map(genre => (
          <option key={genre.value} value={genre.value} className="bg-slate-800 text-white">
            {genre.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>
  );
};

export default GenreFilter; 
 
 
 