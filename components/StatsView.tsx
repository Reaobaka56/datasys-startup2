import React, { useMemo } from 'react';
import { DataSet } from '../types';
import { calculateStats } from '../utils/stats';
import { Activity } from 'lucide-react';

interface StatsViewProps {
  dataSet: DataSet;
}

export const StatsView: React.FC<StatsViewProps> = ({ dataSet }) => {
  const stats = useMemo(() => {
    return dataSet.numericColumns.map(col => calculateStats(dataSet.data, col)).filter(Boolean);
  }, [dataSet]);

  if (stats.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 dark:border-dark-border rounded-xl">
        <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p>No numeric columns available for statistical analysis.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat!.column} className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-4" title={stat!.column}>{stat!.column}</h3>
          
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">{stat!.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className="text-xs text-gray-400 font-medium uppercase">Avg</span>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-4 border-t border-gray-100 dark:border-dark-border text-sm">
             <div>
                <p className="text-xs text-gray-400">Min</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{stat!.min.toLocaleString()}</p>
             </div>
             <div>
                <p className="text-xs text-gray-400">Max</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{stat!.max.toLocaleString()}</p>
             </div>
             <div>
                <p className="text-xs text-gray-400">Median</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{stat!.median.toLocaleString()}</p>
             </div>
             <div>
                <p className="text-xs text-gray-400">Std Dev</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{stat!.stdDev.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};