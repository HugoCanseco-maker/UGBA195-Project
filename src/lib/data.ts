import { PriceRow } from "@/types";

export const TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "AMD", "MU", "PLTR",
  "HOOD", "COIN", "JPM", "GS", "JNJ", "WMT", "PG", "V", "MA", "AXP",
  "XOM", "CVX", "BRK-B", "UNH", "PFE", "ABBV", "MRK", "BA", "LMT", "CAT",
  "MMM", "GE", "CSCO", "INTC", "IBM", "ORCL", "SNOW", "CRM", "DIS", "NFLX",
  "PYPL", "ADBE", "AVGO", "QCOM", "TXN", "AMAT", "LRCX", "KLAC", "NOW", "SPY",
];

export function parseCSV(text: string): PriceRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows: PriceRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row: Record<string, string | number> = {};
    headers.forEach((h, j) => {
      const v = values[j]?.trim() ?? "";
      row[h] = ["open", "high", "low", "close", "volume"].includes(h)
        ? parseFloat(v) || 0
        : v;
    });
    rows.push(row as unknown as PriceRow);
  }
  return rows;
}

export function computeMA(data: PriceRow[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[i - j].close;
      result.push(sum / period);
    }
  }
  return result;
}

export function computeRSI(data: PriceRow[], period: number = 14): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(NaN);
    } else {
      let gains = 0, losses = 0;
      for (let j = 1; j <= period; j++) {
        const change = data[i - j + 1].close - data[i - j].close;
        if (change > 0) gains += change;
        else losses -= change;
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) result.push(100);
      else result.push(100 - 100 / (1 + avgGain / avgLoss));
    }
  }
  return result;
}

export function computeStdDev(data: PriceRow[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1).map((r) => r.close);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const variance =
        slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
      result.push(Math.sqrt(variance));
    }
  }
  return result;
}

export function computeBollinger(
  data: PriceRow[],
  period: number = 20,
  k: number = 2
): { upper: number[]; middle: number[]; lower: number[] } {
  const middle = computeMA(data, period);
  const std = computeStdDev(data, period);
  return {
    middle,
    upper: middle.map((m, i) => (isNaN(std[i]) ? NaN : m + k * std[i])),
    lower: middle.map((m, i) => (isNaN(std[i]) ? NaN : m - k * std[i])),
  };
}

export function computeMACD(
  data: PriceRow[],
  fast: number = 12,
  slow: number = 26,
  signal: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const ema = (arr: number[], period: number) => {
    const result: number[] = [];
    const k = 2 / (period + 1);
    for (let i = 0; i < arr.length; i++) {
      if (i < period - 1) result.push(NaN);
      else if (i === period - 1) {
        const sum = arr.slice(0, period).reduce((a, b) => a + b, 0);
        result.push(sum / period);
      } else {
        result.push(arr[i] * k + result[i - 1] * (1 - k));
      }
    }
    return result;
  };
  const closes = data.map((r) => r.close);
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macd = emaFast.map((f, i) => (isNaN(emaSlow[i]) ? NaN : f - emaSlow[i]));
  const macdClean = macd.filter((m) => !isNaN(m));
  const signalLine = ema(macd, signal);
  const histogram = macd.map((m, i) =>
    isNaN(signalLine[i]) ? NaN : m - signalLine[i]
  );
  return { macd, signal: signalLine, histogram };
}

export function computeZScore(data: PriceRow[], period: number = 20): number[] {
  const ma = computeMA(data, period);
  const std = computeStdDev(data, period);
  return data.map((r, i) =>
    isNaN(ma[i]) || isNaN(std[i]) || std[i] === 0 ? NaN : (r.close - ma[i]) / std[i]
  );
}
