export type CellValue = string | number | null;

export interface DataRow {
  [key: string]: CellValue;
}

export interface DataSet {
  fileName: string;
  headers: string[];
  data: DataRow[];
  numericColumns: string[];
}

export interface ColumnStats {
  column: string;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  count: number;
}

export interface User {
  email: string;
  name: string;
}

export interface SavedReport {
  id: string;
  fileName: string;
  date: string;
  summary: string;
  stats: ColumnStats[];
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  predictions: { x: number; y: number; predictedY: number; type: 'actual' | 'predicted' | 'future' }[];
  equation: string;
  futureValues: { x: number; y: number }[];
}

// Navigation Pages
export type PageType = 
  | 'landing' 
  | 'dashboard'
  | 'features' 
  | 'integrations' 
  | 'security' 
  | 'enterprise' 
  | 'changelog' 
  | 'about' 
  | 'careers' 
  | 'blog' 
  | 'contact' 
  | 'partners' 
  | 'resources' 
  | 'documentation' 
  | 'community' 
  | 'help' 
  | 'api' 
  | 'status';