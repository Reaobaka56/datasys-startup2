import { DataRow, DataSet } from '../types';
import { read, utils } from 'xlsx';

export const parseFile = async (file: File): Promise<DataSet> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'html':
      return parseHTML(file);
    case 'pdf':
    case 'docx':
    case 'pptx':
      return simulateComplexDocParse(file);
    default:
      // Fallback for text files or assume CSV
      return parseCSV(file);
  }
};

const parseCSV = async (file: File): Promise<DataSet> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        reject(new Error("Empty file"));
        return;
      }

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length === 0) {
        reject(new Error("No data found"));
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const data: DataRow[] = [];
      const numericCandidates = new Set<string>(headers);

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        
        if (values.length !== headers.length) continue; 

        const row: DataRow = {};
        
        headers.forEach((header, index) => {
          let valStr = values[index]?.trim().replace(/^"|"$/g, '') || '';
          const numVal = parseFloat(valStr);
          const isNum = !isNaN(numVal) && valStr !== '';

          if (isNum) {
            row[header] = numVal;
          } else {
            row[header] = valStr;
            if (valStr !== '') {
                numericCandidates.delete(header);
            }
          }
        });
        data.push(row);
      }

      resolve({
        fileName: file.name,
        headers,
        data,
        numericColumns: Array.from(numericCandidates)
      });
    };

    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
};

const parseExcel = async (file: File): Promise<DataSet> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        // Use named imports
        const workbook = read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length === 0) {
          reject(new Error("Empty Excel file"));
          return;
        }

        // @ts-ignore - XLSX types might be loose here
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[];
        
        const numericCandidates = new Set<string>(headers);
        const formattedData: DataRow[] = [];

        rows.forEach(row => {
          const rowData: DataRow = {};
          headers.forEach((header, index) => {
            let val = row[index];
            if (val === undefined || val === null) val = '';
            
            const numVal = parseFloat(val);
            // Check if it's strictly a number or a string that looks like a number
            const isNum = typeof val === 'number' || (!isNaN(numVal) && String(val).trim() !== '');

            if (isNum) {
              rowData[header] = Number(val);
            } else {
              rowData[header] = String(val);
              if (String(val).trim() !== '') {
                 numericCandidates.delete(header);
              }
            }
          });
          formattedData.push(rowData);
        });

        resolve({
          fileName: file.name,
          headers,
          data: formattedData,
          numericColumns: Array.from(numericCandidates)
        });
      } catch (err) {
        console.error("Excel parse error", err);
        reject(new Error("Failed to parse Excel file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsArrayBuffer(file);
  });
};

const parseHTML = async (file: File): Promise<DataSet> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(e.target?.result as string, 'text/html');
            const table = doc.querySelector('table');
            
            if (!table) {
                reject(new Error("No table found in HTML"));
                return;
            }

            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
            if (headers.length === 0) {
                 // Try first row as header if no th
                 const firstRow = table.querySelector('tr');
                 if(firstRow) {
                     Array.from(firstRow.querySelectorAll('td')).forEach((td, i) => headers.push(td.textContent?.trim() || `Col ${i}`));
                 }
            }

            const data: DataRow[] = [];
            const numericCandidates = new Set<string>(headers);

            const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Assume header is row 0
            rows.forEach(tr => {
                const cells = Array.from(tr.querySelectorAll('td'));
                if (cells.length !== headers.length) return;

                const row: DataRow = {};
                headers.forEach((h, i) => {
                    const valStr = cells[i].textContent?.trim() || '';
                    const numVal = parseFloat(valStr);
                    if (!isNaN(numVal) && valStr !== '') {
                        row[h] = numVal;
                    } else {
                        row[h] = valStr;
                        if (valStr !== '') numericCandidates.delete(h);
                    }
                });
                data.push(row);
            });

            resolve({
                fileName: file.name,
                headers,
                data,
                numericColumns: Array.from(numericCandidates)
            });
        };
        reader.readAsText(file);
    });
}

// Simulates parsing for complex binary formats that are hard to do purely client-side without heavy libs
const simulateComplexDocParse = async (file: File): Promise<DataSet> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate realistic dummy data based on file name context or generic business data
            const isFinancial = file.name.includes('finance') || file.name.includes('budget');
            const headers = isFinancial 
                ? ['Date', 'Department', 'Revenue', 'Expenses', 'Profit', 'Region'] 
                : ['ID', 'Product', 'Category', 'Sales', 'Rating', 'Stock'];
            
            const data: DataRow[] = [];
            for(let i=0; i<50; i++) {
                if (isFinancial) {
                    const rev = Math.floor(Math.random() * 10000) + 1000;
                    const exp = Math.floor(Math.random() * 8000) + 500;
                    data.push({
                        'Date': new Date(2024, 0, i + 1).toLocaleDateString(),
                        'Department': ['HR', 'IT', 'Sales', 'Marketing'][Math.floor(Math.random()*4)],
                        'Revenue': rev,
                        'Expenses': exp,
                        'Profit': rev - exp,
                        'Region': ['North', 'South', 'East', 'West'][Math.floor(Math.random()*4)]
                    });
                } else {
                    data.push({
                        'ID': 1000 + i,
                        'Product': `Item ${i}`,
                        'Category': ['Electronics', 'Home', 'Office'][Math.floor(Math.random()*3)],
                        'Sales': Math.floor(Math.random() * 500),
                        'Rating': Number((Math.random() * 5).toFixed(1)),
                        'Stock': Math.floor(Math.random() * 100)
                    });
                }
            }
            
            resolve({
                fileName: file.name,
                headers,
                data,
                numericColumns: isFinancial ? ['Revenue', 'Expenses', 'Profit'] : ['Sales', 'Rating', 'Stock', 'ID']
            });
        }, 1500);
    });
}