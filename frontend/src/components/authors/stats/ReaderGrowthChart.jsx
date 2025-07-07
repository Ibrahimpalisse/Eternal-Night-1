import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReaderGrowthChart = ({ overallData, novels }) => {
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
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">Progression des Lecteurs</h2>
        
        {/* Dropdown pour sélectionner le roman */}
        <div className="relative dropdown-container z-50 w-full sm:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 text-white hover:bg-white/20 transition-colors"
          >
            <span className="text-sm font-medium truncate">{getTitle()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div 
              className="absolute right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-[100] w-full sm:w-[250px] max-h-[300px] overflow-y-auto"
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
                    <span className="block truncate">{novel.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] relative z-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              tick={{ fontSize: '10px', fill: '#9CA3AF' }}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={60}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fontSize: '10px', fill: '#9CA3AF' }}
              tickMargin={8}
              width={40}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#F3F4F6', marginBottom: '4px' }}
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-xs sm:text-sm">
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