import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

export default ReaderGrowthChart; 