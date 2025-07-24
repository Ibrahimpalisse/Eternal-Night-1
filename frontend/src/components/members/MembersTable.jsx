import React from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

export default function MembersTable({ members, handleSort, sortBy, sortOrder, formatJoinDate, onUserClick }) {
  return (
    <div className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 sm:p-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group overflow-x-auto z-0">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Membre</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('role')}>
              <div className="flex items-center space-x-1">
                <span>Rôle</span>
                {sortBy === 'role' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('comments')}>
              <div className="flex items-center space-x-1">
                <span>Commentaires</span>
                {sortBy === 'comments' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('likes')}>
              <div className="flex items-center space-x-1">
                <span>Likes</span>
                {sortBy === 'likes' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('niveau')}>
              <div className="flex items-center space-x-1">
                <span>Classement</span>
                {sortBy === 'niveau' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date d'inscription</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {members.map((member) => (
            <tr
              key={member.id}
              className="hover:bg-gray-800/60 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 group cursor-pointer"
              onClick={() => onUserClick && onUserClick(member)}
            >
              <td className="px-6 py-4 whitespace-nowrap rounded-l-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600">
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{member.name}</div>
                    <div className="text-sm text-gray-400">@{member.username}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${member.role === 'author' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                  {member.role === 'author' ? 'Auteur' : 'Lecteur'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.comments.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.likes.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{member.classement}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 rounded-r-lg">{formatJoinDate(member.joinDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {members.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Aucun membre trouvé</h3>
          <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
} 