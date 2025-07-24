import React from 'react';
import NovelCard from './NovelCard';

export default function UserNovelsModal({ open, onClose, user, novels }) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center text-2xl text-white font-bold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:ring-offset-2 focus:ring-offset-slate-900 hover:bg-white/10 hover:text-purple-300"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-white mb-2 text-center">
          Romans de {user.name}
        </h2>
        {user.role === 'author' ? (
          novels && novels.length > 0 ? (
            <div className="flex flex-row gap-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
              {novels.map((novel) => (
                <div key={novel.id} className="flex-shrink-0 w-64">
                  <NovelCard novel={novel} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-6">Aucun roman trouvé pour cet auteur.</div>
          )
        ) : (
          <div className="text-gray-400 text-center mt-6">Ce membre n'a pas écrit de roman.</div>
        )}
      </div>
    </div>
  );
} 