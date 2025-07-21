import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReaderGrowthChart = ({ overallData = [], novels = [] }) => {
  const [selectedNovel, setSelectedNovel] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isNovelDropdownOpen, setIsNovelDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Générer la liste des années disponibles (de l'année actuelle à 2020)
  const availableYears = Array.from(
    { length: new Date().getFullYear() - 2019 },
    (_, i) => new Date().getFullYear() - i
  );

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.novel-dropdown')) {
        setIsNovelDropdownOpen(false);
      }
      if (!event.target.closest('.year-dropdown')) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrer les romans selon la recherche
  const filteredNovels = novels.filter(novel =>
    novel.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtenir les données selon la sélection
  const getChartData = () => {
    console.log('Getting chart data:', { selectedNovel, overallData, novels });
    if (selectedNovel === 'all') {
      return overallData || [];
    }
    const novel = novels.find(n => n.id === parseInt(selectedNovel));
    return novel?.readerGrowth || [];
  };

  const getTitle = () => {
    if (selectedNovel === 'all') {
      return 'Tous les Romans';
    }
    const novel = novels.find(n => n.id === parseInt(selectedNovel));
    return novel ? novel.title : 'Tous les Romans';
  };

  const chartData = getChartData();
  console.log('Final chart data:', chartData);

  // Si pas de données, afficher un message
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">Progression des Lecteurs</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-400">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <p className="text-gray-300 mb-1">{label}</p>
          <p className="text-white font-semibold">
            {payload[0].value.toLocaleString()} lecteurs
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-6 w-full">
      <div className="flex flex-col items-start justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Progression des Lecteurs</h2>
        
        <div className="flex flex-col gap-3 w-full">
          {/* Dropdown pour l'année */}
          <div className="relative year-dropdown w-full z-[110]">
            <button
              onClick={() => {
                setIsYearDropdownOpen(!isYearDropdownOpen);
                setIsNovelDropdownOpen(false); // Ferme l'autre dropdown
              }}
              className="flex items-center justify-between gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white hover:bg-white/20 transition-colors w-full"
            >
              <span className="text-sm md:text-base font-medium">{selectedYear}</span>
              <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isYearDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl">
                <div className="py-1 max-h-[200px] overflow-y-auto">
                  {availableYears.map(year => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm md:text-base hover:bg-white/10 transition-colors ${
                        selectedYear === year ? 'text-blue-400 bg-white/5 font-medium' : 'text-gray-300'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dropdown pour sélectionner le roman */}
          <div className="relative novel-dropdown w-full z-[105]">
            <button
              onClick={() => {
                setIsNovelDropdownOpen(!isNovelDropdownOpen);
                setIsYearDropdownOpen(false); // Ferme l'autre dropdown
              }}
              className="flex items-center justify-between gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white hover:bg-white/20 transition-colors w-full"
            >
              <span className="text-sm md:text-base font-medium truncate">{getTitle()}</span>
              <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-transform ${isNovelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isNovelDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl">
                {/* Barre de recherche */}
                <div className="p-3 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un roman..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="py-1 max-h-[250px] overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedNovel('all');
                      setIsNovelDropdownOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm md:text-base hover:bg-white/10 transition-colors ${
                      selectedNovel === 'all' ? 'text-blue-400 bg-white/5 font-medium' : 'text-gray-300'
                    }`}
                  >
                    Tous les Romans
                  </button>
                  
                  {filteredNovels.length > 0 ? (
                    filteredNovels.map(novel => (
                      <button
                        key={novel.id}
                        onClick={() => {
                          setSelectedNovel(novel.id.toString());
                          setIsNovelDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm md:text-base hover:bg-white/10 transition-colors ${
                          selectedNovel === novel.id.toString() ? 'text-blue-400 bg-white/5 font-medium' : 'text-gray-300'
                        }`}
                      >
                        {novel.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm md:text-base text-gray-400 text-center">
                      Aucun roman trouvé
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Container avec scroll horizontal pour le graphique */}
      <div className="w-full overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 relative z-10">
        <div className="min-w-[400px] sm:min-w-[500px] w-full">
          <div className="w-full h-[280px] sm:h-[320px] md:h-[400px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 15, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} stroke="#374151" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={window.innerWidth < 640 ? 10 : 12}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={window.innerWidth < 640 ? 10 : 12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                  width={window.innerWidth < 640 ? 40 : 50}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                  wrapperStyle={{ zIndex: 20 }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center relative z-10">
        <p className="text-gray-400 text-sm md:text-base">
          {selectedNovel === 'all' 
            ? `Total: ${chartData[chartData.length - 1]?.count?.toLocaleString() || 0} lecteurs`
            : `Lecteurs de "${getTitle()}": ${chartData[chartData.length - 1]?.count?.toLocaleString() || 0}`
          }
        </p>
      </div>
    </div>
  );
};

export default ReaderGrowthChart; 