import { SavedReport } from '../types';

const DB_KEY = 'data_analytics_pro_db';

export const dbService = {
  async saveReport(report: Omit<SavedReport, 'id' | 'date'>): Promise<SavedReport> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newReport: SavedReport = {
      ...report,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    const existing = await this.getReports();
    const updated = [newReport, ...existing];
    localStorage.setItem(DB_KEY, JSON.stringify(updated));

    return newReport;
  },

  async getReports(): Promise<SavedReport[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  },

  async deleteReport(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const existing = await this.getReports();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
  }
};