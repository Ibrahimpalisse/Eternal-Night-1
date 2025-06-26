import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  MessageSquare, 
  PenTool,
  TrendingUp,
  Eye,
  Clock,
  Calendar,
  Heart,
  Shield,
  AlertTriangle,
  Check,
  XCircle,
  FileText,
  Target,
  Activity
} from 'lucide-react';

const Stats = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  // Données simulées basées sur les données réelles du projet
  const [stats, setStats] = useState({
    overview: {
      totalUsers: 1234,
      totalAuthors: 89,
      totalChapters: 456,
      totalComments: 2847,
      pendingApplications: 12,
      activeStories: 67
    },
    users: {
      active: 1156,
      blocked: 23,
      authorSuspended: 8,
      newThisWeek: 47,
      loginToday: 234
    },
    content: {
      publishedChapters: 398,
      pendingChapters: 23,
      acceptedUnpublished: 18,
      rejectedChapters: 17,
      totalViews: 125478,
      averageViews: 275
    },
    engagement: {
      visibleComments: 2684,
      hiddenComments: 163,
      reportedComments: 45,
      totalLikes: 8956,
      commentsThisWeek: 186
    },
    authors: {
      activeAuthors: 72,
      suspendedAuthors: 8,
      pendingApplications: 12,
      approvedThisWeek: 3,
      rejectedThisWeek: 2
    }
  });

  useEffect(() => {
    // Simulation de chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const StatCard = ({ title, value, icon: Icon, change, changeType, color, bgColor, iconColor, borderColor }) => (
    <div className={`bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border ${borderColor} hover:bg-slate-800/90 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1 group-hover:scale-105 transition-transform duration-300">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-green-400' : 
                changeType === 'negative' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{change}
              </span>
              <span className="text-gray-500 text-xs ml-1">vs semaine dernière</span>
            </div>
          )}
        </div>
        <div className={`p-3 ${bgColor} rounded-xl border ${borderColor} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, icon: Icon }) => (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Statistiques du Site</h1>
          <p className="text-gray-400">Vue d'ensemble des performances et de l'activité</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="quarter">3 derniers mois</option>
            <option value="year">12 derniers mois</option>
          </select>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Utilisateurs"
          value={stats.overview.totalUsers}
          icon={Users}
          change="47"
          changeType="positive"
          bgColor="bg-blue-500/20"
          iconColor="text-blue-400"
          borderColor="border-blue-500/30"
        />
        <StatCard
          title="Auteurs Actifs"
          value={stats.overview.totalAuthors}
          icon={PenTool}
          change="5"
          changeType="positive"
          bgColor="bg-green-500/20"
          iconColor="text-green-400"
          borderColor="border-green-500/30"
        />
        <StatCard
          title="Chapitres Publiés"
          value={stats.overview.totalChapters}
          icon={BookOpen}
          change="23"
          changeType="positive"
          bgColor="bg-purple-500/20"
          iconColor="text-purple-400"
          borderColor="border-purple-500/30"
        />
        <StatCard
          title="Commentaires"
          value={stats.overview.totalComments}
          icon={MessageSquare}
          change="186"
          changeType="positive"
          bgColor="bg-yellow-500/20"
          iconColor="text-yellow-400"
          borderColor="border-yellow-500/30"
        />
      </div>

      {/* Statistiques des utilisateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartCard title="Statistiques des Utilisateurs" icon={Users}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{stats.users.active}</div>
                <div className="text-sm text-gray-400">Actifs</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{stats.users.blocked}</div>
                <div className="text-sm text-gray-400">Bloqués</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{stats.users.authorSuspended}</div>
                <div className="text-sm text-gray-400">Auteurs Suspendus</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{stats.users.newThisWeek}</div>
                <div className="text-sm text-gray-400">Nouveaux (7j)</div>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{stats.users.loginToday}</div>
                <div className="text-sm text-gray-400">Connectés aujourd'hui</div>
              </div>
            </div>
          </ChartCard>
        </div>
        
        <ChartCard title="Candidatures d'Auteurs" icon={FileText}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-white">En attente</span>
              </div>
              <span className="text-yellow-400 font-semibold">{stats.authors.pendingApplications}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-white">Approuvées (7j)</span>
              </div>
              <span className="text-green-400 font-semibold">{stats.authors.approvedThisWeek}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-white">Refusées (7j)</span>
              </div>
              <span className="text-red-400 font-semibold">{stats.authors.rejectedThisWeek}</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Statistiques du contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Statut des Chapitres" icon={BookOpen}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Publiés</span>
              </div>
              <span className="text-white font-semibold">{stats.content.publishedChapters}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">En attente</span>
              </div>
              <span className="text-white font-semibold">{stats.content.pendingChapters}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Acceptés non publiés</span>
              </div>
              <span className="text-white font-semibold">{stats.content.acceptedUnpublished}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Rejetés</span>
              </div>
              <span className="text-white font-semibold">{stats.content.rejectedChapters}</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Statistiques de Lecture" icon={Eye}>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <div className="text-3xl font-bold text-white">{stats.content.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Vues totales</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{stats.content.averageViews}</div>
              <div className="text-sm text-gray-400">Vues moyennes/chapitre</div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Statistiques d'engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Engagement des Commentaires" icon={MessageSquare}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-gray-300">Commentaires visibles</span>
              <span className="text-green-400 font-semibold">{stats.engagement.visibleComments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
              <span className="text-gray-300">Commentaires masqués</span>
              <span className="text-red-400 font-semibold">{stats.engagement.hiddenComments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
              <span className="text-gray-300">Signalements</span>
              <span className="text-yellow-400 font-semibold">{stats.engagement.reportedComments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-pink-500/10 rounded-lg">
              <span className="text-gray-300">Likes totaux</span>
              <span className="text-pink-400 font-semibold">{stats.engagement.totalLikes}</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Activité Récente" icon={Activity}>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm flex-1">Nouvelle candidature d'auteur</span>
              <span className="text-gray-500 text-xs">Il y a 5 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm flex-1">3 nouveaux utilisateurs inscrits</span>
              <span className="text-gray-500 text-xs">Il y a 12 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300 text-sm flex-1">Nouveau chapitre publié</span>
              <span className="text-gray-500 text-xs">Il y a 1h</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300 text-sm flex-1">Commentaire signalé</span>
              <span className="text-gray-500 text-xs">Il y a 2h</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-300 text-sm flex-1">Utilisateur bloqué</span>
              <span className="text-gray-500 text-xs">Il y a 3h</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Stats; 