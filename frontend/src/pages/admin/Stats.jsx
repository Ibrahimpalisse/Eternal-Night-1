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
    <div className={`bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-6 border ${borderColor} hover:bg-slate-800/40 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}>
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
        <div className={`p-3 ${bgColor} rounded-lg sm:rounded-xl border ${borderColor} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, icon: Icon }) => (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-6 border border-slate-700/50">
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
            className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-lg sm:rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
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
              <div className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <div className="text-2xl font-bold text-green-400">{stats.users.active}</div>
                <div className="text-sm text-gray-400">Actifs</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <div className="text-2xl font-bold text-red-400">{stats.users.blocked}</div>
                <div className="text-sm text-gray-400">Bloqués</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <div className="text-2xl font-bold text-yellow-400">{stats.users.authorSuspended}</div>
                <div className="text-sm text-gray-400">Auteurs Suspendus</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <div className="text-2xl font-bold text-blue-400">{stats.users.newThisWeek}</div>
                <div className="text-sm text-gray-400">Nouveaux (7j)</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <div className="text-2xl font-bold text-purple-400">{stats.users.loginToday}</div>
                <div className="text-sm text-gray-400">Connectés aujourd'hui</div>
              </div>
            </div>
          </ChartCard>
        </div>

        <div>
          <ChartCard title="Applications en Attente" icon={FileText}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <span className="text-gray-300">En attente</span>
                <span className="text-yellow-400 font-semibold">{stats.overview.pendingApplications}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <span className="text-gray-300">Approuvées (7j)</span>
                <span className="text-green-400 font-semibold">{stats.authors.approvedThisWeek}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
                <span className="text-gray-300">Rejetées (7j)</span>
                <span className="text-red-400 font-semibold">{stats.authors.rejectedThisWeek}</span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Statistiques du contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Statistiques du Contenu" icon={BookOpen}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Chapitres publiés</span>
              <span className="text-green-400 font-semibold">{stats.content.publishedChapters}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">En attente</span>
              <span className="text-yellow-400 font-semibold">{stats.content.pendingChapters}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Vues totales</span>
              <span className="text-blue-400 font-semibold">{stats.content.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Moyenne par chapitre</span>
              <span className="text-purple-400 font-semibold">{stats.content.averageViews}</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Engagement" icon={Heart}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Commentaires visibles</span>
              <span className="text-green-400 font-semibold">{stats.engagement.visibleComments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Commentaires cachés</span>
              <span className="text-yellow-400 font-semibold">{stats.engagement.hiddenComments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Signalés</span>
              <span className="text-red-400 font-semibold">{stats.engagement.reportedComments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Likes totaux</span>
              <span className="text-purple-400 font-semibold">{stats.engagement.totalLikes.toLocaleString()}</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Performance" icon={Activity}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Temps de réponse</span>
              <span className="text-green-400 font-semibold">~200ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Uptime</span>
              <span className="text-blue-400 font-semibold">99.9%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Erreurs (24h)</span>
              <span className="text-red-400 font-semibold">3</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Sécurité" icon={Shield}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Tentatives de connexion</span>
              <span className="text-yellow-400 font-semibold">1,247</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Bloquées</span>
              <span className="text-red-400 font-semibold">23</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">IPs suspectes</span>
              <span className="text-orange-400 font-semibold">7</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Objectifs" icon={Target}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Utilisateurs actifs</span>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">1,156</span>
                <span className="text-green-400 text-xs">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Nouveaux auteurs</span>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-semibold">3</span>
                <span className="text-blue-400 text-xs">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50">
              <span className="text-gray-300">Engagement</span>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-semibold">+12.5%</span>
                <span className="text-green-400 text-xs">✓</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Stats; 