import React, { useState } from 'react';
import { DataSet } from '../types';
import { calculateCorrelation, calculateTTest } from '../utils/stats';
import { Calculator, GitCompare, Info } from 'lucide-react';

interface AnalysisViewProps {
  dataSet: DataSet;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ dataSet }) => {
  const [testType, setTestType] = useState<'correlation' | 'ttest'>('correlation');
  const [col1, setCol1] = useState<string>(dataSet.numericColumns[0] || '');
  const [col2, setCol2] = useState<string>(dataSet.numericColumns[1] || dataSet.numericColumns[0] || '');

  const correlation = testType === 'correlation' ? calculateCorrelation(dataSet.data, col1, col2) : null;
  const tTestResult = testType === 'ttest' ? calculateTTest(dataSet.data, col1, col2) : null;

  return (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 dark:border-white/10 transition-colors duration-500">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl mr-4 shadow-lg shadow-cyan-500/20">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Statistical Analysis</h2>
            <p className="text-slate-500 dark:text-slate-400">Run statistical tests to explore relationships between variables.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Analysis Type</label>
                 <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setTestType('correlation')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${testType === 'correlation' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        Correlation
                    </button>
                    <button
                        onClick={() => setTestType('ttest')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${testType === 'ttest' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        T-Test
                    </button>
                 </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Variable A</label>
                <select 
                    value={col1} 
                    onChange={(e) => setCol1(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white appearance-none"
                >
                    {dataSet.numericColumns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Variable B</label>
                <select 
                    value={col2} 
                    onChange={(e) => setCol2(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white appearance-none"
                >
                    {dataSet.numericColumns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* Results Display */}
        <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            {testType === 'correlation' && (
                <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Pearson Correlation Coefficient</h3>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 my-4">
                        {correlation !== null ? correlation.toFixed(4) : 'N/A'}
                    </div>
                    <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                        {correlation !== null && (
                            <>
                                {Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak'} 
                                {' '}
                                {correlation > 0 ? 'positive' : 'negative'} relationship between <span className="font-medium text-slate-900 dark:text-white">{col1}</span> and <span className="font-medium text-slate-900 dark:text-white">{col2}</span>.
                            </>
                        )}
                    </p>
                </div>
            )}

            {testType === 'ttest' && tTestResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                    <div>
                         <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
                            <GitCompare className="w-5 h-5 mr-2" />
                            Group Comparison
                         </h3>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{col1} Mean</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{tTestResult.mean1.toFixed(3)}</span>
                            </div>
                             <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{col2} Mean</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{tTestResult.mean2.toFixed(3)}</span>
                            </div>
                         </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                         <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">T-Statistic</div>
                         <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{tTestResult.tStat.toFixed(4)}</div>
                         <div className="text-xs text-center text-slate-400 dark:text-slate-500 flex items-center">
                            <Info className="w-3 h-3 mr-1" />
                            Larger absolute values indicate <br/>more significant difference.
                         </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};