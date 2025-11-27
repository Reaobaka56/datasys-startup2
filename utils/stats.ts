import { DataRow, ColumnStats } from '../types';

export const calculateStats = (data: DataRow[], column: string): ColumnStats | null => {
  const values = data
    .map(row => row[column])
    .filter(val => typeof val === 'number') as number[];

  if (values.length === 0) return null;

  values.sort((a, b) => a - b);

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const min = values[0];
  const max = values[values.length - 1];

  const mid = Math.floor(values.length / 2);
  const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;

  // Std Dev
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  return {
    column,
    count: values.length,
    min,
    max,
    mean,
    median,
    stdDev
  };
};

export const calculateCorrelation = (data: DataRow[], col1: string, col2: string): number | null => {
  const points = data
    .map(row => ({ x: row[col1], y: row[col2] }))
    .filter(p => typeof p.x === 'number' && typeof p.y === 'number') as { x: number, y: number }[];

  if (points.length < 2) return null;

  const n = points.length;
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = points.reduce((acc, p) => acc + p.x * p.x, 0);
  const sumY2 = points.reduce((acc, p) => acc + p.y * p.y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
};

export const calculateTTest = (data: DataRow[], col1: string, col2: string): { tStat: number, mean1: number, mean2: number, n1: number, n2: number } | null => {
  const vals1 = data.map(r => r[col1]).filter(v => typeof v === 'number') as number[];
  const vals2 = data.map(r => r[col2]).filter(v => typeof v === 'number') as number[];

  if (vals1.length < 2 || vals2.length < 2) return null;

  // Calculate means
  const mean1 = vals1.reduce((a, b) => a + b, 0) / vals1.length;
  const mean2 = vals2.reduce((a, b) => a + b, 0) / vals2.length;

  // Calculate variances
  const variance1 = vals1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0) / (vals1.length - 1);
  const variance2 = vals2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0) / (vals2.length - 1);

  // Standard Error of the Difference (assuming unequal variances - Welch's t-test denominator)
  const se = Math.sqrt((variance1 / vals1.length) + (variance2 / vals2.length));

  if (se === 0) return { tStat: 0, mean1, mean2, n1: vals1.length, n2: vals2.length };

  const tStat = (mean1 - mean2) / se;

  return {
    tStat,
    mean1,
    mean2,
    n1: vals1.length,
    n2: vals2.length
  };
};