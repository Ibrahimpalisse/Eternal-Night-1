import React from 'react';
import { Users, Heart } from 'lucide-react';

export default function MembersStats({ members }) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            Membres
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Gestion de la communauté</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{members.length}</p>
          <p className="text-xs text-gray-400">membres</p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-white font-semibold">Commentateurs</span>
          </div>
          <p className="text-2xl font-bold text-white">{members.filter(m => m.comments > 0).length}</p>
          <p className="text-xs text-gray-400">commentateurs</p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-white font-semibold">Likes</span>
          </div>
          <p className="text-2xl font-bold text-white">{members.reduce((sum, m) => sum + m.likes, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-400">total</p>
        </div>
      </div>
    </div>
  );
} 