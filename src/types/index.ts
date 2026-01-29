export interface PriceRow {
  ticker: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerData {
  ticker: string;
  rows: PriceRow[];
}

export interface Stats {
  currentPrice: number;
  weekReturn: number;
  yearReturn: number;
  volatility: number;
}

export type IndicatorTab =
  | "price"
  | "volume"
  | "moving-averages"
  | "rsi"
  | "zscore"
  | "volatility"
  | "bollinger"
  | "macd"
  | "correlation"
  | "relative-strength"
  | "drawdown"
  | "beta"
  | "cumulative-return"
  | "distance-200ma"
  | "volume-spikes";
