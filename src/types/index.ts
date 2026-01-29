export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export interface IndicatorData {
  date: string;
  value: number;
  [key: string]: string | number | undefined;
}

export interface MACDData {
  date: string;
  macd: number;
  signal: number;
  histogram: number;
}

export interface BollingerData {
  date: string;
  close: number;
  upper: number;
  middle: number;
  lower: number;
}

export interface MovingAverageData {
  date: string;
  close: number;
  ma50: number | null;
  ma200: number | null;
}

export interface RelativeStrengthData {
  date: string;
  relativeStrength: number;
}

export interface CumulativeReturnData {
  date: string;
  stockReturn: number;
  spyReturn: number;
}

export interface DrawdownData {
  date: string;
  drawdown: number;
}

export interface VolatilityData {
  date: string;
  volatility: number;
}

export interface VolumeData {
  date: string;
  volume: number;
  avgVolume: number;
}

export interface ZScoreData {
  date: string;
  zscore: number;
}

export interface DistanceMAData {
  date: string;
  distance: number;
}

export type MetricType = 
  | 'price'
  | 'ma'
  | 'rsi'
  | 'macd'
  | 'bollinger'
  | 'volatility'
  | 'zscore'
  | 'distance200ma'
  | 'relativeStrength'
  | 'cumulativeReturn'
  | 'drawdown'
  | 'volume'
  | 'volumeSpikes'
  | 'priceChange'
  | 'beta';

export interface MetricConfig {
  id: MetricType;
  name: string;
  description: string;
}

export const METRICS: MetricConfig[] = [
  { id: 'price', name: 'Price Chart', description: 'Daily closing price with candlestick visualization.' },
  { id: 'ma', name: '50/200-Day MA', description: 'Moving averages identify trend direction. Golden cross (50 > 200) is bullish.' },
  { id: 'rsi', name: 'RSI (14-Day)', description: 'Relative Strength Index measures momentum. Above 70 = overbought, below 30 = oversold.' },
  { id: 'macd', name: 'MACD (12,26,9)', description: 'Moving Average Convergence Divergence shows momentum changes and potential reversals.' },
  { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility bands showing price deviation from 20-day mean. Squeeze indicates consolidation.' },
  { id: 'volatility', name: 'Rolling Volatility', description: '20-day rolling standard deviation of returns. Higher values indicate increased risk.' },
  { id: 'zscore', name: 'Z-Score', description: 'Price deviation from 20-day mean in standard deviations. Values > 2 suggest mean reversion.' },
  { id: 'distance200ma', name: 'Distance from 200 MA', description: 'Percentage distance from 200-day MA. Extreme values may signal reversion opportunity.' },
  { id: 'relativeStrength', name: 'Relative Strength vs SPY', description: 'Stock performance relative to SPY. Rising line = outperformance vs market.' },
  { id: 'cumulativeReturn', name: 'Cumulative Return', description: 'Total return over the period compared to SPY benchmark.' },
  { id: 'drawdown', name: 'Drawdown', description: 'Peak-to-trough decline showing maximum loss from any high point.' },
  { id: 'volume', name: 'Volume Analysis', description: 'Daily trading volume with 20-day average. High volume confirms price moves.' },
  { id: 'volumeSpikes', name: 'Volume Spikes', description: 'Days where volume exceeds 2x average. Often indicates significant news or institutional activity.' },
  { id: 'priceChange', name: 'Daily Price Change', description: 'Daily percentage returns. Useful for spotting volatility clusters.' },
  { id: 'beta', name: 'Rolling Beta', description: '60-day rolling beta vs SPY. Beta > 1 means more volatile than market.' },
];

export const TICKERS = [
  'AAPL', 'ABNB', 'ADBE', 'AMAT', 'AMD', 'AMZN', 'ASML', 'AVGO', 'COIN', 'COST',
  'CRM', 'CVX', 'DIS', 'F', 'GM', 'GOOGL', 'GS', 'HOOD', 'INTC', 'JNJ',
  'JPM', 'LRCX', 'MA', 'META', 'MS', 'MSFT', 'MU', 'NFLX', 'NKE', 'NOW',
  'NVDA', 'ORCL', 'PANW', 'PFE', 'PLTR', 'PYPL', 'QCOM', 'SBUX', 'SHOP', 'SNOW',
  'SPY', 'TGT', 'TSM', 'TSLA', 'UBER', 'UNH', 'V', 'WMT', 'XOM'
];
