import React from 'react';
import { BookOpen, Eye, Heart, MessageCircle } from 'lucide-react';

export default function NovelCard({ novel }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-white/10 p-0 shadow-xl w-full max-w-xs mx-auto flex flex-col overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={novel.image}
          alt={novel.title}
          className="w-full h-full object-cover"
        />
        {novel.status === 'in_progress' && (
          <span className="absolute top-3 right-3 bg-orange-500/90 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{novel.title}</h3>
        <p className="text-gray-400 text-sm mb-1">par {novel.author}</p>
        <p className="text-gray-300 text-xs mb-3 line-clamp-3">{novel.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs mt-auto">
          <div className="flex items-center gap-1 text-blue-400"><BookOpen className="w-4 h-4" />{novel.chapters}</div>
          <div className="flex items-center gap-1 text-purple-400"><Eye className="w-4 h-4" />{novel.views.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-pink-500"><Heart className="w-4 h-4" />{novel.likes.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-green-400"><MessageCircle className="w-4 h-4" />{novel.comments.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
} 