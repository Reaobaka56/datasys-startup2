import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Scatter, Brush, ReferenceArea
} from 'recharts';
import { DataSet } from '../types';
import { BarChart as BarIcon, LineChart as LineIcon, PieChart as PieIcon, ScatterChart as ScatterIcon, RotateCcw, TrendingUp, Search, MoveHorizontal, ChevronDown } from 'lucide-react';
import { calculateLinearRegression } from '../utils/ml';

interface ChartViewProps {
  dataSet: DataSet;
}

type ChartType = 'line' | 'bar' | 'area' | 'scatter';
type AggregationType = 'none' | 'sum' | 'mean';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export const ChartView: React.FC<ChartViewProps> = ({ dataSet }) => {
  const [xAxis, setXAxis] = useState<string>(dataSet.headers[0] || '');
  const [yAxis, setYAxis] = useState<string>(dataSet.numericColumns[0] || '');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [aggregation, setAggregation] = useState<AggregationType>('none');
  const [chartColor, setChartColor] = useState(CHART_COLORS[0]);
  const [showTrendline, setShowTrendline] = useState(false);

  // Zoom / Pan State
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [refAreaLeft, setRefAreaLeft] = useState<string | number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | number | null>(null);
  const [left, setLeft] = useState<string | number>('dataMin');
  const [right, setRight] = useState<string | number>('dataMax');

  const isXNumeric = useMemo(() => dataSet.numericColumns.includes(xAxis), [xAxis, dataSet]);

  // Handle empty numeric columns (Text only data)
  if (dataSet.numericColumns.length === 0) {
      return (
          <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border text-gray-500">
              <BarIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>No numeric data available to visualize.</p>
          </div>
      )
  }

  const chartData = useMemo(() => {
    let data = [...dataSet.data];
    data = data.filter(row => row[xAxis] !== null && row[xAxis] !== undefined && row[yAxis] !== null && row[yAxis] !== undefined);

    if (aggregation !== 'none') {
        const grouped = data.reduce((acc, row) => {
            const key = String(row[xAxis]);
            if (!acc[key]) {
                acc[key] = { [xAxis]: row[xAxis], [yAxis]: 0, count: 0 };
            }
            acc[key][yAxis] += (Number(row[yAxis]) || 0);
            acc[key].count += 1;
            return acc;
        }, {} as Record<string, any>);

        data = Object.values(grouped).map((item: any) => {
            if (aggregation === 'mean') item[yAxis] = item[yAxis] / item.count;
            return item;
        });
        if (isXNumeric) data.sort((a, b) => Number(a[xAxis]) - Number(b[xAxis]));
    } else if (isXNumeric) {
        data.sort((a, b) => Number(a[xAxis]) - Number(b[xAxis]));
    }

    if (showTrendline && isXNumeric && data.length > 1) {
        const result = calculateLinearRegression(data, xAxis, yAxis, 0);
        if (result) {
            data = data.map(point => ({
                ...point,
                trend: result.slope * Number(point[xAxis]) + result.intercept
            }));
        }
    }
    return data;
  }, [dataSet.data, xAxis, yAxis, aggregation, showTrendline, isXNumeric]);

  const handleZoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === null || refAreaLeft === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }
    let newLeft = refAreaLeft;
    let newRight = refAreaRight;
    if (newLeft > newRight) [newLeft, newRight] = [newRight, newLeft];
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setLeft(newLeft);
    setRight(newRight);
  };

  const handleZoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const toggleZoomMode = (mode: boolean) => {
      setIsZoomMode(mode);
      handleZoomOut(); 
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border shadow-sm flex flex-col h-full">
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-border flex flex-col xl:flex-row gap-4 justify-between bg-gray-50/50 dark:bg-white/5 rounded-t-xl">
        <div className="flex flex-wrap gap-4 items-center">
            <SelectGroup label="X Axis" value={xAxis} onChange={(e) => {setXAxis(e.target.value); handleZoomOut();}} options={dataSet.headers} />
            <SelectGroup label="Y Axis" value={yAxis} onChange={(e) => setYAxis(e.target.value)} options={dataSet.numericColumns} />
            <SelectGroup label="Aggregation" value={aggregation} onChange={(e) => {setAggregation(e.target.value as any); handleZoomOut();}} options={['none', 'sum', 'mean']} />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
            {/* Color */}
            <div className="flex gap-1 p-1 bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border">
                {CHART_COLORS.map(c => (
                    <button key={c} onClick={() => setChartColor(c)} className={`w-4 h-4 rounded-full ${chartColor === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`} style={{backgroundColor: c}} />
                ))}
            </div>

            {/* Mode */}
            <div className="flex p-1 bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border">
                <IconButton onClick={() => toggleZoomMode(false)} active={!isZoomMode} icon={<MoveHorizontal size={14} />} title="Pan" />
                <IconButton onClick={() => toggleZoomMode(true)} active={isZoomMode} icon={<Search size={14} />} title="Zoom" />
            </div>

            {/* Types */}
            <div className="flex p-1 bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border">
                <IconButton onClick={() => setChartType('line')} active={chartType === 'line'} icon={<LineIcon size={14} />} title="Line" />
                <IconButton onClick={() => setChartType('bar')} active={chartType === 'bar'} icon={<BarIcon size={14} />} title="Bar" />
                <IconButton onClick={() => setChartType('area')} active={chartType === 'area'} icon={<PieIcon size={14} />} title="Area" />
                <IconButton onClick={() => setChartType('scatter')} active={chartType === 'scatter'} icon={<ScatterIcon size={14} />} title="Scatter" />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {(left !== 'dataMin' || right !== 'dataMax') && (
                     <button onClick={handleZoomOut} className="p-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors border border-primary-100">
                        <RotateCcw size={14} />
                    </button>
                )}
                {isXNumeric && (
                     <button onClick={() => setShowTrendline(!showTrendline)} className={`p-1.5 text-xs font-medium rounded-md transition-colors border ${showTrendline ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-white text-gray-500 border-gray-200'}`}>
                         <TrendingUp size={14} />
                     </button>
                 )}
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            onMouseDown={(e) => isZoomMode && e && setRefAreaLeft(e.activeLabel ?? null)}
            onMouseMove={(e) => isZoomMode && refAreaLeft !== null && e && setRefAreaRight(e.activeLabel ?? null)}
            onMouseUp={handleZoom}
          >
             <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey={xAxis} stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} dy={10} type={isXNumeric ? 'number' : 'category'} domain={[left, right]} allowDuplicatedCategory={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#a1a1aa' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
            {!isZoomMode && <Brush dataKey={xAxis} height={20} stroke="#e5e7eb" fill="transparent" tickFormatter={() => ''} travellerWidth={6} />}
            
            {showTrendline && isXNumeric && <Line type="monotone" dataKey="trend" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />}
            {chartType === 'line' && <Line type="monotone" dataKey={yAxis} stroke={chartColor} strokeWidth={2} dot={{ r: 3, fill: chartColor, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />}
            {chartType === 'bar' && <Bar dataKey={yAxis} fill={chartColor} radius={[4, 4, 0, 0]} />}
            {chartType === 'area' && <Area type="monotone" dataKey={yAxis} stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorY)" />}
            {chartType === 'scatter' && <Scatter dataKey={yAxis} fill={chartColor} fillOpacity={0.6} />}
            {isZoomMode && refAreaLeft && refAreaRight ? <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#8884d8" fillOpacity={0.1} /> : null}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SelectGroup = ({ label, value, onChange, options }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider ml-1">{label}</label>
        <div className="relative">
            <select value={value} onChange={onChange} className="appearance-none bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-md py-1.5 pl-3 pr-8 text-xs font-medium text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-primary-500 outline-none w-32 cursor-pointer hover:border-gray-300 transition-colors">
                {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
    </div>
);

const IconButton = ({ onClick, active, icon, title }: any) => (
    <button onClick={onClick} className={`p-1.5 rounded-md transition-all ${active ? 'bg-gray-100 dark:bg-dark-surface text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title={title}>
        {icon}
    </button>
);