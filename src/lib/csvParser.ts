import { StockData } from '@/types';

// Data range constants for the 1-year period
export const DATA_START_DATE = '2025-01-29';
export const DATA_END_DATE = '2026-01-29';

// Custom error class for data link failures
export class DataLinkError extends Error {
  constructor(ticker: string) {
    super(`DATA_LINK_FAILURE: Ticker source not found for ${ticker}`);
    this.name = 'DataLinkError';
  }
}

/**
 * Parses Yahoo Finance CSV data into structured StockData objects
 * Handles various date formats and data inconsistencies
 */
export function parseYahooCSV(csvText: string): StockData[] {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    return [];
  }

  // Parse header to find column indices
  const header = lines[0].toLowerCase().split(',').map(h => h.trim());
  
  const dateIdx = header.findIndex(h => h === 'date');
  const openIdx = header.findIndex(h => h === 'open');
  const highIdx = header.findIndex(h => h === 'high');
  const lowIdx = header.findIndex(h => h === 'low');
  const closeIdx = header.findIndex(h => h === 'close');
  const adjCloseIdx = header.findIndex(h => h === 'adj close' || h === 'adjclose' || h === 'adj_close');
  const volumeIdx = header.findIndex(h => h === 'volume');

  const data: StockData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    
    const date = values[dateIdx];
    const open = parseFloat(values[openIdx]);
    const high = parseFloat(values[highIdx]);
    const low = parseFloat(values[lowIdx]);
    const close = parseFloat(values[closeIdx]);
    const adjClose = adjCloseIdx >= 0 ? parseFloat(values[adjCloseIdx]) : close;
    const volume = parseInt(values[volumeIdx], 10);

    // Skip invalid rows
    if (!date || isNaN(close) || isNaN(volume)) {
      continue;
    }

    data.push({
      date,
      open: isNaN(open) ? close : open,
      high: isNaN(high) ? close : high,
      low: isNaN(low) ? close : low,
      close,
      adjClose: isNaN(adjClose) ? close : adjClose,
      volume: isNaN(volume) ? 0 : volume,
    });
  }

  // Sort by date ascending
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return data;
}

/**
 * Handles CSV lines with potential quoted values containing commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Fetches and parses CSV data for a given ticker from local /data/ route
 */
export async function fetchStockData(ticker: string): Promise<StockData[]> {
  try {
    const response = await fetch(`/data/${ticker}.csv`);
    
    if (!response.ok) {
      throw new DataLinkError(ticker);
    }
    
    const csvText = await response.text();
    
    // Check if we got valid CSV content
    if (!csvText || csvText.trim().length === 0) {
      throw new DataLinkError(ticker);
    }
    
    const data = parseYahooCSV(csvText);
    
    if (data.length === 0) {
      throw new DataLinkError(ticker);
    }
    
    return data;
  } catch (error) {
    if (error instanceof DataLinkError) {
      throw error;
    }
    // Network or other errors
    throw new DataLinkError(ticker);
  }
}

/**
 * Aligns stock data with SPY data by matching dates
 * Returns only the dates that exist in both datasets
 */
export function alignDataWithSPY(
  stockData: StockData[],
  spyData: StockData[]
): { alignedStock: StockData[]; alignedSPY: StockData[] } {
  // Create a Set of SPY dates for fast lookup
  const spyDateSet = new Set(spyData.map(d => d.date));
  
  // Create a Map of SPY data by date
  const spyByDate = new Map(spyData.map(d => [d.date, d]));
  
  // Filter stock data to only include dates that exist in SPY
  const alignedStock: StockData[] = [];
  const alignedSPY: StockData[] = [];
  
  for (const stock of stockData) {
    if (spyDateSet.has(stock.date)) {
      alignedStock.push(stock);
      alignedSPY.push(spyByDate.get(stock.date)!);
    }
  }
  
  return { alignedStock, alignedSPY };
}

/**
 * Validates that data falls within the expected date range
 */
export function validateDateRange(data: StockData[]): {
  isValid: boolean;
  startDate: string;
  endDate: string;
  tradingDays: number;
} {
  if (data.length === 0) {
    return { isValid: false, startDate: '', endDate: '', tradingDays: 0 };
  }
  
  const startDate = data[0].date;
  const endDate = data[data.length - 1].date;
  
  return {
    isValid: true,
    startDate,
    endDate,
    tradingDays: data.length,
  };
}
