import React, { useEffect, useState } from 'react';
import { SavedReport } from '../types';
import { dbService } from '../services/dbService';
import { Calendar, Trash2, FileText, ChevronRight } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await dbService.getReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this report?')) {
      await dbService.deleteReport(id);
      loadReports();
      if (selectedReport?.id === id) setSelectedReport(null);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/50 dark:border-white/10 backdrop-blur-sm transition-colors duration-500">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 mb-4">
          <FileText className="w-6 h-6 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No saved reports</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Generate insights and save them to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* List */}
      <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedReport?.id === report.id
                ? 'bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-400 shadow-md'
                : 'bg-white/60 dark:bg-slate-900/40 border-white/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-4">{report.fileName}</h4>
              <button
                onClick={(e) => handleDelete(e, report.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(report.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                View Report <ChevronRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail View */}
      <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm p-6 overflow-y-auto transition-colors duration-500">
        {selectedReport ? (
          <div>
            <div className="border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedReport.fileName}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Generated on {new Date(selectedReport.date).toLocaleString()}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedReport.stats.map(s => (
                    <div key={s.column} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                        <p className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold uppercase">{s.column}</p>
                        <p className="text-lg font-bold text-indigo-900 dark:text-white">{s.mean.toFixed(2)} <span className="text-xs font-normal opacity-70">avg</span></p>
                    </div>
                ))}
            </div>

            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">AI Insights</h3>
              <div className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedReport.summary}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a report to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};