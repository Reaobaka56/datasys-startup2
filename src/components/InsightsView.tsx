import React, { useState } from 'react';
import { DataSet, ColumnStats } from '../types';
import { calculateStats } from '../utils/stats';
import { generateInsights } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { Sparkles, Play, RefreshCw, Save, Check } from 'lucide-react';

interface InsightsViewProps {
  dataSet: DataSet;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ dataSet }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setSaveSuccess(false);
    
    // Filter out nulls safely
    const stats: ColumnStats[] = dataSet.numericColumns
      .map(col => calculateStats(dataSet.data, col))
      .filter((stat): stat is ColumnStats => stat !== null);
    
    const result = await generateInsights(dataSet, stats);
    setInsights(result);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!insights) return;
    setIsSaving(true);
    try {
        const stats: ColumnStats[] = dataSet.numericColumns
            .map(col => calculateStats(dataSet.data, col))
            .filter((stat): stat is ColumnStats => stat !== null);

        await dbService.saveReport({
            fileName: dataSet.fileName,
            summary: insights,
            stats: stats
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
        console.error("Failed to save", e);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600/90 to-violet-600/90 dark:from-indigo-900/80 dark:to-purple-900/80 backdrop-blur-md rounded-2xl p-8 text-white shadow-xl border border-white/20 dark:border-white/10 mb-8 transition-colors duration-500">
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
                    AI Analyst
                </h2>
                <p className="text-indigo-100 max-w-xl">
                    Use Gemini 2.5 Flash to generate a professional summary, detect anomalies, and suggest business questions based on your dataset.
                </p>
            </div>
            <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className={`
                    px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center transition-all border border-white/20
                    ${isLoading 
                        ? 'bg-white/20 cursor-not-allowed text-white' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-xl transform hover:-translate-y-0.5'
                    }
                `}
            >
                {isLoading ? (
                    <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        {insights ? 'Re-Analyze' : 'Generate Insights'}
                    </>
                )}
            </button>
        </div>
      </div>

      {insights && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-white/10 p-8 relative transition-colors duration-500">
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving || saveSuccess}
                    className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${saveSuccess 
                            ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                        }
                    `}
                >
                    {isSaving ? (
                         <div className="w-4 h-4 mr-2 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : saveSuccess ? (
                        <Check className="w-4 h-4 mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {saveSuccess ? 'Saved to DB' : 'Save Report'}
                </button>
            </div>

            {/* Simple Markdown Rendering replacement since we assume no external marked library */}
            <div className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-200 leading-relaxed mt-4">
                {insights.split('\n').map((line, i) => {
                    // Simple styling heuristics for Markdown-like feel
                    if (line.startsWith('##')) return <h3 key={i} className="text-xl font-bold text-slate-800 dark:text-white mt-6 mb-3">{line.replace(/##/g, '')}</h3>;
                    if (line.startsWith('#')) return <h2 key={i} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 border-b border-slate-200/50 dark:border-white/10 pb-2">{line.replace(/#/g, '')}</h2>;
                    if (line.trim().startsWith('-') || line.trim().startsWith('*')) return <li key={i} className="ml-4 list-disc my-1 marker:text-indigo-400 dark:marker:text-fuchsia-400">{line.replace(/^[-*]/, '')}</li>;
                    if (line.match(/^\d\./)) return <div key={i} className="font-semibold mt-4 mb-1 text-slate-800 dark:text-slate-100">{line}</div>;
                    return <p key={i} className="mb-2">{line}</p>;
                })}
            </div>
        </div>
      )}
    </div>
  );
};