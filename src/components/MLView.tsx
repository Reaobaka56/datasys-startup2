import React, { useState, useMemo } from 'react';
import { DataSet, RegressionResult } from '../types';
import { calculateLinearRegression } from '../utils/ml';
import { BrainCircuit, TrendingUp, Calculator, ArrowRight } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MLViewProps {
  dataSet: DataSet;
}

export const MLView: React.FC<MLViewProps> = ({ dataSet }) => {
  const [xCol, setXCol] = useState<string>(dataSet.numericColumns[0] || '');
  const [yCol, setYCol] = useState<string>(dataSet.numericColumns[1] || dataSet.numericColumns[0] || '');
  const [result, setResult] = useState<RegressionResult | null>(null);

  const handleTrain = () => {
    const res = calculateLinearRegression(dataSet.data, xCol, yCol);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 dark:border-white/10 transition-all duration-500">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-tr from-fuchsia-600 to-pink-600 rounded-lg mr-3 shadow-lg shadow-pink-500/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Linear Regression Model</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Train a predictive model to forecast trends.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Independent Variable (X)</label>
            <div className="relative">
              <select
                value={xCol}
                onChange={(e) => setXCol(e.target.value)}
                className="block w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:text-white appearance-none transition-colors"
              >
                {dataSet.numericColumns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-center pb-3">
             <ArrowRight className="w-6 h-6 text-slate-300 dark:text-slate-600" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Target Variable (Y)</label>
            <div className="relative">
              <select
                value={yCol}
                onChange={(e) => setYCol(e.target.value)}
                className="block w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:text-white appearance-none transition-colors"
              >
                {dataSet.numericColumns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleTrain}
          className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-fuchsia-500/25 transition-all transform hover:scale-[1.01] flex items-center justify-center"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Train Model & Forecast
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Stats Card */}
           <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Model Performance</h3>
                  
                  <div className="mb-6">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Equation</p>
                      <p className="font-mono text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-700 dark:text-fuchsia-300 break-all border border-slate-200 dark:border-slate-700">
                          {result.equation}
                      </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-1">Accuracy (R²)</p>
                          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{(result.r2 * 100).toFixed(1)}%</p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Slope</p>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{result.slope.toFixed(2)}</p>
                      </div>
                  </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-fuchsia-500" />
                      Future Predictions
                  </h3>
                  <div className="space-y-3">
                      {result.futureValues.map((val, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                              <span className="text-slate-500 dark:text-slate-400">X = <span className="font-mono text-slate-700 dark:text-slate-200">{val.x.toFixed(1)}</span></span>
                              <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400 font-mono">{val.y.toFixed(2)}</span>
                          </div>
                      ))}
                  </div>
              </div>
           </div>

           {/* Chart */}
           <div className="lg:col-span-2 h-[500px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={result.predictions} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis 
                        dataKey="x" 
                        type="number" 
                        domain={['auto', 'auto']} 
                        name={xCol}
                        label={{ value: xCol, position: 'bottom', offset: 0, fill: '#94a3b8' }}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        dataKey="y" 
                        name={yCol} 
                        label={{ value: yCol, angle: -90, position: 'left', fill: '#94a3b8' }}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            borderRadius: '12px', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            color: '#fff' 
                        }}
                      />
                      <Legend />
                      <Scatter name="Actual Data" dataKey="y" fill="#8b5cf6" fillOpacity={0.6} shape="circle" />
                      <Line 
                        name="Regression Line" 
                        dataKey="predictedY" 
                        stroke="#d946ef" 
                        strokeWidth={3} 
                        dot={false} 
                        activeDot={false}
                        type="monotone"
                      />
                  </ComposedChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}
    </div>
  );
};