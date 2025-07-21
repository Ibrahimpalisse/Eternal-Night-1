import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Bookmark, 
  Users, 
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  Eye,
  ChevronDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import ReaderGrowthChart from '../../components/authors/stats/ReaderGrowthChart';

// Données mockées - à remplacer par des appels API
const mockStats = {
  overview: {
    totalNovels: 8,
    totalChapters: 69,
    totalWords: 245000,
    totalReaders: 12500,
    totalLikes: 3033,
    totalComments: 505,
    totalBookmarks: 454
  },
  novelsByStatus: {
    draft: 2,
    pending: 2,
    accepted: 2,
    published: 2
  },
  chaptersByStatus: {
    draft: 15,
    pending: 20,
    accepted: 14,
    published: 20
  },
  readerGrowth: [
    { month: 'Jan 2024', count: 12500 },
    { month: 'Déc 2023', count: 11200 },
    { month: 'Nov 2023', count: 9800 },
    { month: 'Oct 2023', count: 8100 },
    { month: 'Sep 2023', count: 6700 },
    { month: 'Aoû 2023', count: 5500 },
    { month: 'Jui 2023', count: 4200 },
    { month: 'Jun 2023', count: 3100 },
    { month: 'Mai 2023', count: 2300 },
    { month: 'Avr 2023', count: 1800 },
    { month: 'Mar 2023', count: 1200 },
    { month: 'Fév 2023', count: 800 }
  ],
  novels: [
    {
      id: 1,
      title: "Les Chroniques d'Aether",
      readerGrowth: [
        { month: 'Jan 2024', count: 4200 },
        { month: 'Déc 2023', count: 3800 },
        { month: 'Nov 2023', count: 3300 },
        { month: 'Oct 2023', count: 2800 },
        { month: 'Sep 2023', count: 2200 },
        { month: 'Aoû 2023', count: 1800 },
        { month: 'Jui 2023', count: 1400 },
        { month: 'Jun 2023', count: 1100 },
        { month: 'Mai 2023', count: 800 },
        { month: 'Avr 2023', count: 600 },
        { month: 'Mar 2023', count: 400 },
        { month: 'Fév 2023', count: 200 }
      ]
    },
    {
      id: 2,
      title: "L'Empire des Ombres",
      readerGrowth: [
        { month: 'Jan 2024', count: 3800 },
        { month: 'Déc 2023', count: 3400 },
        { month: 'Nov 2023', count: 2900 },
        { month: 'Oct 2023', count: 2400 },
        { month: 'Sep 2023', count: 2000 },
        { month: 'Aoû 2023', count: 1600 },
        { month: 'Jui 2023', count: 1200 },
        { month: 'Jun 2023', count: 900 },
        { month: 'Mai 2023', count: 700 },
        { month: 'Avr 2023', count: 500 },
        { month: 'Mar 2023', count: 300 },
        { month: 'Fév 2023', count: 150 }
      ]
    },
    {
      id: 3,
      title: "La Prophétie Oubliée",
      readerGrowth: [
        { month: 'Jan 2024', count: 2500 },
        { month: 'Déc 2023', count: 2200 },
        { month: 'Nov 2023', count: 1900 },
        { month: 'Oct 2023', count: 1600 },
        { month: 'Sep 2023', count: 1300 },
        { month: 'Aoû 2023', count: 1100 },
        { month: 'Jui 2023', count: 900 },
        { month: 'Jun 2023', count: 700 },
        { month: 'Mai 2023', count: 500 },
        { month: 'Avr 2023', count: 400 },
        { month: 'Mar 2023', count: 300 },
        { month: 'Fév 2023', count: 200 }
      ]
    },
    {
      id: 4,
      title: "Les Gardiens du Temps",
      readerGrowth: [
        { month: 'Jan 2024', count: 1800 },
        { month: 'Déc 2023', count: 1600 },
        { month: 'Nov 2023', count: 1400 },
        { month: 'Oct 2023', count: 1200 },
        { month: 'Sep 2023', count: 1000 },
        { month: 'Aoû 2023', count: 800 },
        { month: 'Jui 2023', count: 600 },
        { month: 'Jun 2023', count: 400 },
        { month: 'Mai 2023', count: 300 },
        { month: 'Avr 2023', count: 200 },
        { month: 'Mar 2023', count: 150 },
        { month: 'Fév 2023', count: 100 }
      ]
    },
    {
      id: 5,
      title: "Le Royaume Perdu",
      readerGrowth: [
        { month: 'Jan 2024', count: 1200 },
        { month: 'Déc 2023', count: 1000 },
        { month: 'Nov 2023', count: 850 },
        { month: 'Oct 2023', count: 700 },
        { month: 'Sep 2023', count: 600 },
        { month: 'Aoû 2023', count: 500 },
        { month: 'Jui 2023', count: 400 },
        { month: 'Jun 2023', count: 300 },
        { month: 'Mai 2023', count: 250 },
        { month: 'Avr 2023', count: 200 },
        { month: 'Mar 2023', count: 150 },
        { month: 'Fév 2023', count: 100 }
      ]
    },
    {
      id: 6,
      title: "La Légende de Zara",
      readerGrowth: [
        { month: 'Jan 2024', count: 800 },
        { month: 'Déc 2023', count: 700 },
        { month: 'Nov 2023', count: 600 },
        { month: 'Oct 2023', count: 500 },
        { month: 'Sep 2023', count: 400 },
        { month: 'Aoû 2023', count: 300 },
        { month: 'Jui 2023', count: 250 },
        { month: 'Jun 2023', count: 200 },
        { month: 'Mai 2023', count: 150 },
        { month: 'Avr 2023', count: 100 },
        { month: 'Mar 2023', count: 75 },
        { month: 'Fév 2023', count: 50 }
      ]
    }
  ],
  topNovels: [
    {
      title: "Les Chroniques d'Aether",
      views: 12500,
      likes: 324,
      comments: 89,
      bookmarked: 156,
      status: 'published',
      lastUpdate: '2024-01-15'
    },
    {
      title: "L'Empire des Ombres",
      views: 9800,
      likes: 287,
      comments: 72,
      bookmarked: 134,
      status: 'published',
      lastUpdate: '2024-01-14'
    },
    {
      title: "La Prophétie Oubliée",
      views: 7650,
      likes: 198,
      comments: 45,
      bookmarked: 89,
      status: 'accepted',
      lastUpdate: '2024-01-13'
    }
  ],
  recentActivity: [
    {
      type: 'chapter',
      title: "Nouveau chapitre publié: Le Réveil de l'Ombre - Chapitre 15",
      time: "Il y a 2 heures"
    },
    {
      type: 'comment',
      title: "5 nouveaux commentaires sur Les Gardiens Éternels",
      time: "Il y a 4 heures"
    },
    {
      type: 'subscriber',
      title: "47 nouveaux abonnés cette semaine",
      time: "Il y a 1 jour"
    }
  ]
};

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon: Icon, color, subValue }) => (
  <div className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 backdrop-blur-sm border border-${color}-500/20 rounded-xl p-6`}>
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-3xl font-bold text-${color}-400 mb-1">{value}</p>
        {subValue && <p className="text-sm text-gray-400">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
    </div>
  </div>
);

// Composant pour la progression des lecteurs avec dropdown
const ReaderGrowth = ({ overallData, novels }) => {
  const [selectedNovel, setSelectedNovel] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Obtenir les données selon la sélection
  const getChartData = () => {
    if (selectedNovel === 'all') {
      return [...overallData].reverse(); // Créer une copie avant d'inverser
    }
    const novel = novels.find(n => n.id === parseInt(selectedNovel));
    return novel ? [...novel.readerGrowth].reverse() : [];
  };

  const getTitle = () => {
    if (selectedNovel === 'all') {
      return 'Tous les Romans';
    }
    const novel = novels.find(n => n.id === parseInt(selectedNovel));
    return novel ? novel.title : 'Tous les Romans';
  };

  const chartData = getChartData();

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Progression des Lecteurs</h2>
        
        {/* Dropdown pour sélectionner le roman */}
        <div className="relative dropdown-container z-50">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
          >
            <span className="text-sm font-medium">{getTitle()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div 
              className="absolute right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-[100] min-w-[200px] max-h-[300px] overflow-y-auto"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedNovel('all');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                    selectedNovel === 'all' ? 'text-blue-400 bg-white/5 font-medium' : 'text-gray-300'
                  }`}
                >
                  Tous les Romans
                </button>
                {novels.map(novel => (
                  <button
                    key={novel.id}
                    onClick={() => {
                      setSelectedNovel(novel.id.toString());
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                      selectedNovel === novel.id.toString() ? 'text-blue-400 bg-white/5 font-medium' : 'text-gray-300'
                    }`}
                  >
                    {novel.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-80 relative z-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#1E40AF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          {selectedNovel === 'all' 
            ? `Total: ${chartData[chartData.length - 1]?.count?.toLocaleString() || 0} lecteurs`
            : `Lecteurs de "${getTitle()}": ${chartData[chartData.length - 1]?.count?.toLocaleString() || 0}`
          }
        </p>
      </div>
    </div>
  );
};

// Composant pour le tableau des meilleurs romans
const TopNovelsTable = ({ novels }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
    <h2 className="text-xl font-bold text-white mb-6">Romans les Plus Populaires</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 text-gray-400 font-medium">Titre</th>
            <th className="text-right py-3 text-gray-400 font-medium">Vues</th>
            <th className="text-right py-3 text-gray-400 font-medium">Likes</th>
            <th className="text-right py-3 text-gray-400 font-medium">Com.</th>
            <th className="text-right py-3 text-gray-400 font-medium">Favoris</th>
          </tr>
        </thead>
        <tbody>
          {novels.map((novel, index) => (
            <tr key={index} className="border-b border-white/5 last:border-0">
              <td className="py-4 text-white font-medium">{novel.title}</td>
              <td className="py-4 text-right text-gray-300">{novel.views.toLocaleString()}</td>
              <td className="py-4 text-right text-gray-300">{novel.likes.toLocaleString()}</td>
              <td className="py-4 text-right text-gray-300">{novel.comments.toLocaleString()}</td>
              <td className="py-4 text-right text-gray-300">{novel.bookmarked.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Composant pour les statuts
const StatusBreakdown = ({ novelStats, chapterStats }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Statuts des Romans</h2>
      <div className="space-y-4">
        {Object.entries(novelStats).map(([status, count]) => {
          const statusLabels = {
            draft: 'Brouillon',
            pending: 'En attente de validation',
            accepted: 'Accepté',
            published: 'Publié'
          };
          return (
            <div key={status} className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className={`w-full h-2.5 rounded-full bg-white/10 overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${
                      status === 'draft' ? 'bg-gray-400' :
                      status === 'pending' ? 'bg-yellow-400' :
                      status === 'accepted' ? 'bg-blue-400' :
                      'bg-green-400'
                    }`}
                    style={{ width: `${(count / Object.values(novelStats).reduce((a, b) => a + b, 0)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between min-w-[180px]">
                <span className="text-sm font-medium text-gray-300">
                  {statusLabels[status]}
                </span>
                <span className="text-sm font-semibold text-white ml-2">
                  ({count})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Statuts des Chapitres</h2>
      <div className="space-y-4">
        {Object.entries(chapterStats).map(([status, count]) => {
          const statusLabels = {
            draft: 'Brouillon',
            pending: 'En attente de validation',
            accepted: 'Accepté',
            published: 'Publié'
          };
          return (
            <div key={status} className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className={`w-full h-2.5 rounded-full bg-white/10 overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${
                      status === 'draft' ? 'bg-gray-400' :
                      status === 'pending' ? 'bg-yellow-400' :
                      status === 'accepted' ? 'bg-blue-400' :
                      'bg-green-400'
                    }`}
                    style={{ width: `${(count / Object.values(chapterStats).reduce((a, b) => a + b, 0)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between min-w-[180px]">
                <span className="text-sm font-medium text-gray-300">
                  {statusLabels[status]}
                </span>
                <span className="text-sm font-semibold text-white ml-2">
                  ({count})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const AuthorStats = () => {
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    console.log('Initial stats:', mockStats);
    setStats(mockStats);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 min-w-0 overflow-hidden">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Statistiques</h1>
        <p className="text-gray-400">Vue d'ensemble de vos performances</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Romans"
          value={stats.overview.totalNovels}
          icon={BookOpen}
          color="blue"
          subValue={`${stats.overview.totalChapters} chapitres`}
        />
        <StatCard
          title="Total Mots"
          value={stats.overview.totalWords.toLocaleString()}
          icon={FileText}
          color="green"
          subValue="Tous chapitres confondus"
        />
        <StatCard
          title="Lecteurs"
          value={stats.overview.totalReaders.toLocaleString()}
          icon={Users}
          color="yellow"
          subValue="Lecteurs uniques"
        />
        <StatCard
          title="Engagement"
          value={stats.overview.totalLikes.toLocaleString()}
          icon={Heart}
          color="purple"
          subValue={`${stats.overview.totalComments} commentaires`}
        />
      </div>

      {/* Graphique de progression */}
      <div className="mb-6 md:mb-8 min-w-0">
        {console.log('Stats data:', stats)}
        <ReaderGrowthChart overallData={stats.readerGrowth} novels={stats.novels} />
      </div>

      {/* Répartition des statuts */}
      <div className="mb-6 md:mb-8">
        <StatusBreakdown 
          novelStats={stats.novelsByStatus}
          chapterStats={stats.chaptersByStatus}
        />
      </div>

      {/* Tableau des meilleurs romans */}
      <div>
        <TopNovelsTable novels={stats.topNovels} />
      </div>
    </div>
  );
};

export default AuthorStats; 