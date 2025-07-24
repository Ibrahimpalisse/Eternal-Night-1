import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  PenTool, 
  Clock, 
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Eye,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const DashboardContent = () => {
  const navigate = useNavigate();

  const quickStats = [
    {
      title: "Utilisateurs",
      value: "1,234",
      change: "+47",
      changeType: "positive",
      icon: Users,
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Auteurs",
      value: "89",
      change: "+5",
      changeType: "positive",
      icon: PenTool,
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30"
    },
    {
      title: "Candidatures",
      value: "12",
      urgent: true,
      icon: Clock,
      bgColor: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      borderColor: "border-yellow-500/30"
    },
    {
      title: "Chapitres",
      value: "456",
      change: "+23",
      changeType: "positive",
      icon: BookOpen,
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <main className="p-4 md:p-6">
      {/* En-tête avec actions rapides */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Tableau de Bord
          </h1>
          <p className="text-gray-400">
            Vue d'ensemble de votre plateforme Night Novels
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/stats')}
          className="mt-4 lg:mt-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
        >
          <BarChart3 className="w-5 h-5" />
          Statistiques détaillées
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className={`bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-4 md:p-6 border ${stat.borderColor} hover:bg-slate-800/40 transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer`}>
          <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  {stat.urgent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <p className="text-xl md:text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </p>
                {stat.change && (
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm font-medium">
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">cette semaine</span>
                  </div>
                )}
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-lg sm:rounded-xl border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`} />
            </div>
            </div>
          </div>
        ))}
        </div>

      {/* Actions rapides et alertes importantes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Actions rapides */}
        <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/admin/applications')}
              className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all duration-300 text-gray-300 hover:text-white group"
            >
              <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">Candidatures</div>
                <div className="text-sm text-gray-400">12 en attente</div>
              </div>
              <div className="ml-auto">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300 text-gray-300 hover:text-white group"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">Utilisateurs</div>
                <div className="text-sm text-gray-400">Gérer les comptes</div>
              </div>
              <div className="ml-auto">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/authorsContent')}
              className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300 text-gray-300 hover:text-white group"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">Contenus</div>
                <div className="text-sm text-gray-400">Modérer chapitres</div>
              </div>
              <div className="ml-auto">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 text-gray-300 hover:text-white group"
            >
              <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-gray-400">7 demandes</div>
              </div>
              <div className="ml-auto">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/stats')}
              className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300 text-gray-300 hover:text-white group"
            >
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">Statistiques</div>
                <div className="text-sm text-gray-400">Analyses détaillées</div>
              </div>
              <div className="ml-auto">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
            </button>
          </div>
        </div>

        {/* Alertes importantes */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            Alertes
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-red-400 font-medium text-sm">Demandes en attente</div>
                  <div className="text-gray-400 text-xs mt-1">7 demandes d'auteurs à traiter</div>
            </div>
          </div>
        </div>

            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-yellow-400 font-medium text-sm">Chapitres en attente</div>
                  <div className="text-gray-400 text-xs mt-1">23 chapitres à modérer</div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-blue-400 font-medium text-sm">Nouveaux utilisateurs</div>
                  <div className="text-gray-400 text-xs mt-1">47 inscriptions cette semaine</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            Performances du site
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Vues totales</span>
              <span className="text-white font-semibold">125,478</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Engagement moyen</span>
              <span className="text-green-400 font-semibold">+12.5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Temps de lecture</span>
              <span className="text-white font-semibold">8.2 min</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            Activité récente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="text-gray-300 text-sm">Nouvelle candidature d'auteur</div>
                <div className="text-gray-500 text-xs">Marie Dubois - Roman fantasy</div>
              </div>
              <span className="text-gray-500 text-xs">Il y a 5 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-gray-300 text-sm">3 nouveaux utilisateurs inscrits</div>
                <div className="text-gray-500 text-xs">Inscriptions récentes</div>
              </div>
              <span className="text-gray-500 text-xs">Il y a 12 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-gray-300 text-sm">Nouveau chapitre publié</div>
                <div className="text-gray-500 text-xs">Chroniques d'Eldoria - Ch. 1359</div>
              </div>
              <span className="text-gray-500 text-xs">Il y a 1h</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-gray-300 text-sm">Nouvelle demande d'auteur</div>
                <div className="text-gray-500 text-xs">Demande de modification</div>
              </div>
              <span className="text-gray-500 text-xs">Il y a 2h</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-gray-300 text-sm">Utilisateur bloqué</div>
                <div className="text-gray-500 text-xs">Violation des règles</div>
              </div>
              <span className="text-gray-500 text-xs">Il y a 3h</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent; 