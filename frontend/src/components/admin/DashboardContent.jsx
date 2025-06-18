import React from 'react';
import { 
  Users, 
  PenTool, 
  Clock, 
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  UserCheck
} from 'lucide-react';

const DashboardContent = () => {
  return (
    <main className="p-4 md:p-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Utilisateurs</p>
              <p className="text-xl md:text-2xl font-bold text-white">1,234</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Auteurs</p>
              <p className="text-xl md:text-2xl font-bold text-white">89</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <PenTool className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Candidatures</p>
              <p className="text-xl md:text-2xl font-bold text-white">12</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Contenus</p>
              <p className="text-xl md:text-2xl font-bold text-white">456</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
              <FileText className="w-5 h-5" />
              <span>Gérer les candidatures d'auteurs</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
              <UserCheck className="w-5 h-5" />
              <span>Gérer les utilisateurs</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
              <BarChart3 className="w-5 h-5" />
              <span>Voir les statistiques</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
              <Settings className="w-5 h-5" />
              <span>Paramètres du site</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4">Activité récente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Nouvelle candidature d'auteur</span>
              <span className="text-gray-500 text-xs ml-auto">Il y a 5 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Nouvel utilisateur inscrit</span>
              <span className="text-gray-500 text-xs ml-auto">Il y a 12 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Nouveau contenu publié</span>
              <span className="text-gray-500 text-xs ml-auto">Il y a 1h</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent; 