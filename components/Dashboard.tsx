import React, { useState, useMemo } from 'react';
import { DataSet, DataRow } from '../types';
import { LayoutDashboard, BarChart3, Database, ArrowLeft, BrainCircuit, Calculator, Search, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { StatsView } from './StatsView';
import { ChartView } from './ChartView';
import { MLView } from './MLView';
import { AnalysisView } from './AnalysisView';
import { Logo } from './Logo';

interface DashboardProps {
  dataSet: DataSet;
  onReset: () => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type Tab = 'overview' | 'data' | 'visualize' | 'ml' | 'analysis';
type SortDirection = 'asc' | 'desc';

export const Dashboard: React.FC<DashboardProps> = ({ dataSet, onReset, onLogout, darkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection } | null>(null);

  const processedData = useMemo(() => {
    let data = [...dataSet.data];

    const activeFilters = Object.entries(filters).filter(([_, value]) => (value as string).trim() !== '');
    if (activeFilters.length > 0) {
      data = data.filter(row => {
        return activeFilters.every(([key, value]) => {
          const cellValue = String(row[key] ?? '').toLowerCase();
          return cellValue.includes((value as string).toLowerCase());
        });
      });
    }

    if (sortConfig) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [dataSet.data, filters, sortConfig]);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    if (processedData.length === 0) return;
    const headers = dataSet.headers;
    const csvContent = [
      headers.join(','),
      ...processedData.map(row => 
        headers.map(header => {
          const val = row[header];
          let stringVal = String(val === null || val === undefined ? '' : val);
          if (stringVal.includes('"')) stringVal = stringVal.replace(/"/g, '""');
          if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) return `"${stringVal}"`;
          return stringVal;
        }).join(',')
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataSet.fileName.replace(/\.[^/.]+$/, "")}_export.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Dashboard Header */}
      <header className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onReset}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">{dataSet.fileName}</h2>
                        <p className="text-xs text-gray-500">{dataSet.data.length} records • {dataSet.numericColumns.length} numeric columns</p>
                    </div>
                </div>

                {/* Segmented Control Nav */}
                <div className="flex p-1 bg-gray-100 dark:bg-dark-bg rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={14} />} label="Overview" />
                    <TabButton active={activeTab === 'visualize'} onClick={() => setActiveTab('visualize')} icon={<BarChart3 size={14} />} label="Visualize" />
                    <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<Calculator size={14} />} label="Analysis" />
                    <TabButton active={activeTab === 'ml'} onClick={() => setActiveTab('ml')} icon={<BrainCircuit size={14} />} label="Predict" />
                    <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={<Database size={14} />} label="Data" />
                </div>
            </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'overview' && (
            <div className="space-y-8 animate-slide-up">
                <section>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Key Metrics</h3>
                    <StatsView dataSet={dataSet} />
                </section>
                <section>
                     <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Visual Distribution</h3>
                    <ChartView dataSet={dataSet} />
                </section>
            </div>
        )}

        {activeTab === 'visualize' && (
             <div className="h-[700px] animate-slide-up">
                <ChartView dataSet={dataSet} />
            </div>
        )}
        
        {activeTab === 'analysis' && (
             <div className="animate-slide-up">
                <AnalysisView dataSet={dataSet} />
            </div>
        )}

        {activeTab === 'ml' && (
             <div className="animate-slide-up">
                <MLView dataSet={dataSet} />
            </div>
        )}

        {activeTab === 'data' && (
            <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] animate-slide-up">
                 <div className="px-6 py-3 border-b border-gray-200 dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Raw Data</span>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center px-3 py-1.5 text-xs font-medium bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300"
                    >
                        <Download className="w-3 h-3 mr-2" />
                        Export CSV
                    </button>
                 </div>
                 
                 <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                        <thead className="bg-gray-50 dark:bg-dark-bg sticky top-0 z-10">
                            <tr>
                                {dataSet.headers.map(h => (
                                    <th 
                                        key={h} 
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors select-none group border-b border-gray-200 dark:border-dark-border"
                                        onClick={() => handleSort(h)}
                                    >
                                        <div className="flex items-center gap-1">
                                            {h}
                                            <span className="flex flex-col h-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                {sortConfig?.key === h ? (
                                                    sortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                                                ) : (
                                                    <ArrowUpDown size={10} />
                                                )}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            <tr className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
                                {dataSet.headers.map(h => (
                                    <th key={`${h}-filter`} className="px-6 py-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Filter..."
                                                className="w-full pl-8 pr-2 py-1 text-xs border border-gray-200 dark:border-dark-border rounded bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-400"
                                                value={filters[h] || ''}
                                                onChange={(e) => handleFilterChange(h, e.target.value)}
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-100 dark:divide-dark-border">
                            {processedData.slice(0, 500).map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    {dataSet.headers.map(h => (
                                        <td key={`${idx}-${h}`} className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {row[h]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        )}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${active 
                ? 'bg-white dark:bg-dark-surface shadow-sm text-gray-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
        `}
    >
        <span className="mr-2 opacity-70">{icon}</span>
        {label}
    </button>
)