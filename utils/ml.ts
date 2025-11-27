import { DataRow, RegressionResult } from '../types';

export const calculateLinearRegression = (
  data: DataRow[],
  xCol: string,
  yCol: string,
  forecastSteps: number = 5
): RegressionResult | null => {
  // Extract and filter valid number pairs
  const points = data
    .map((row) => ({
      x: typeof row[xCol] === 'number' ? (row[xCol] as number) : NaN,
      y: typeof row[yCol] === 'number' ? (row[yCol] as number) : NaN,
    }))
    .filter((p) => !isNaN(p.x) && !isNaN(p.y));

  if (points.length < 2) return null;

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (let i = 0; i < n; i++) {
    sumX += points[i].x;
    sumY += points[i].y;
    sumXY += points[i].x * points[i].y;
    sumXX += points[i].x * points[i].x;
    sumYY += points[i].y * points[i].y;
  }

  // Calculate slope (m) and intercept (b)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared (Coefficient of Determination)
  const totalSS = sumYY - (sumY * sumY) / n; // Total Sum of Squares
  // Residual Sum of Squares = sum((y - (mx + b))^2)
  // Simplified formula for linear regression:
  // r = (n*sumXY - sumX*sumY) / sqrt((n*sumXX - sumX^2)(n*sumYY - sumY^2))
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  const r = denominator === 0 ? 0 : numerator / denominator;
  const r2 = r * r;

  // Generate data for plotting
  // We want to sort by X to draw a proper line
  points.sort((a, b) => a.x - b.x);

  const predictions: RegressionResult['predictions'] = points.map((p) => ({
    x: p.x,
    y: p.y, // Actual value
    predictedY: slope * p.x + intercept, // Regression line value
    type: 'actual',
  }));

  // Forecast future values
  const lastX = points[points.length - 1].x;
  // Calculate average step between X values to guess next X
  const avgStep = (points[points.length - 1].x - points[0].x) / (n - 1) || 1;
  
  const futureValues = [];
  for (let i = 1; i <= forecastSteps; i++) {
    const futureX = lastX + avgStep * i;
    const futureY = slope * futureX + intercept;
    futureValues.push({ x: futureX, y: futureY });
    predictions.push({
      x: futureX,
      y: futureY, // Placeholder for chart scaling
      predictedY: futureY,
      type: 'future',
    });
  }

  const equation = `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`;

  return {
    slope,
    intercept,
    r2,
    predictions,
    equation,
    futureValues,
  };
};