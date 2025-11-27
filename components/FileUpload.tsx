import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { parseFile } from '../utils/csvParser';
import { DataSet } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: DataSet) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsedData = await parseFile(file);
      onDataLoaded(parsedData);
    } catch (err) {
      console.error(err);
      setError('Invalid file format. Please check the file content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative group w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center
          transition-all duration-200 cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
            : 'border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:border-gray-400'
          }
        `}
      >
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer z-10">
            {isLoading ? (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary-600 mb-4"></div>
                    <p className="text-sm font-medium text-gray-500">Processing data...</p>
                </div>
            ) : (
                <>
                    <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        CSV, Excel, PDF, DOCX (max 50MB)
                    </p>
                </>
            )}
          <input type="file" className="hidden" accept=".csv,.xlsx,.xls,.pdf,.docx,.html" onChange={handleFileInput} disabled={isLoading} />
        </label>
      </div>

      {error && (
        <div className="mt-4 flex items-center p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      <div className="mt-6 text-center">
         <button 
           onClick={() => {
             const demoContent = `Date,Sales,Profit,Cost,Region\n1,100,20,80,North\n2,150,40,110,South\n3,200,80,120,East\n4,120,30,90,West\n5,300,100,200,North`;
             const file = new File([demoContent], "demo_data.csv", { type: "text/csv" });
             processFile(file);
           }}
           className="text-xs text-gray-500 hover:text-primary-600 transition-colors underline underline-offset-4"
         >
           Load sample dataset
         </button>
      </div>
    </div>
  );
};
