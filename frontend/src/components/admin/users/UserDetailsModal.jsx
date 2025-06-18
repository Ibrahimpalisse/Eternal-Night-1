import React from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Mail, Calendar, Badge } from 'lucide-react';
import { getRoleBadges, getRoleDisplayText, getStatusIcon, getStatusBadge, getStatusDisplayName, isAuthorUser } from './userUtils.jsx';
import UserWorksSection from './UserWorksSection';

const UserDetailsModal = ({ user, isOpen, onClose, userWorks = [] }) => {
  if (!isOpen || !user) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-800/95 rounded-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header du modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400">{getRoleDisplayText(user.roles)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Informations personnelles */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Informations Personnelles
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Inscrit le {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>

              </div>
            </div>

            {/* Rôles et statut */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Badge className="w-5 h-5 text-purple-400" />
                Rôles et Statut
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Rôles</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getRoleBadges(user.roles)}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Statut</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    <span className={getStatusBadge(user.status)}>
                      {getStatusDisplayName(user.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Œuvres (seulement si l'utilisateur est auteur ou auteur suspendu) */}
          {isAuthorUser(user) && (
            <UserWorksSection userWorks={userWorks} />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UserDetailsModal; 