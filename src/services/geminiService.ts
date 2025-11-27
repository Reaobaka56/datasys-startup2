import { GoogleGenAI } from "@google/genai";
import { DataSet, ColumnStats } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInsights = async (
  dataSet: DataSet, 
  stats: ColumnStats[]
): Promise<string> => {
  try {
    const sampleSize = 5;
    const sampleData = dataSet.data.slice(0, sampleSize);
    
    // Construct a prompt that summarizes the data structure
    const prompt = `
      Act as a Senior Data Analyst. I have a dataset named "${dataSet.fileName}".
      
      Here are the columns: ${dataSet.headers.join(', ')}.
      
      Here are some calculated statistics for numeric columns:
      ${JSON.stringify(stats.map(s => ({ 
        col: s.column, 
        mean: s.mean.toFixed(2), 
        max: s.max, 
        min: s.min 
      })), null, 2)}
      
      Here is a sample of the first ${sampleSize} rows:
      ${JSON.stringify(sampleData, null, 2)}
      
      Please provide a comprehensive analysis of this data.
      1. Identify the likely nature of this dataset (what is it tracking?).
      2. Point out any interesting trends or anomalies based on the statistics.
      3. Suggest 3 key business questions this data could answer.
      4. Format the output with clear headings and bullet points using Markdown.
      
      Keep the tone professional and insightful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate insights. Please check your API key and try again.";
  }
};