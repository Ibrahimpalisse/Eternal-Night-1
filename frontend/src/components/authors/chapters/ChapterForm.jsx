import React from 'react';

const ChapterForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-white">
          Titre du chapitre
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          placeholder="Entrez le titre du chapitre"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-white">
          Contenu
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-y"
          placeholder="Écrivez le contenu de votre chapitre..."
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        Enregistrer le chapitre
      </button>
    </form>
  );
};

export default ChapterForm; 