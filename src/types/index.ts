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
  /** Optional flag for volume spikes (> 2x average); used by VolumeSpikesChart */
  isSpike?: boolean;
  [key: string]: string | number | boolean | undefined;
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
  /** Institutional insight explaining the financial technique */
  insight: string;
}

export const METRICS: MetricConfig[] = [
  {
    id: 'price',
    name: 'Price Chart',
    description: 'Daily closing price with candlestick visualization.',
    insight: 'Why OHLC? Open, High, Low, Close capture the full price action each day. Institutional traders use candlesticks to read market sentiment and identify key support/resistance levels in real time.',
  },
  {
    id: 'ma',
    name: '50/200-Day MA',
    description: 'Moving averages identify trend direction. Golden cross (50 > 200) is bullish.',
    insight: 'What are Moving Averages? They smooth price noise to reveal trend direction. The 50/200-day crossover is a widely watched institutional signal—a golden cross often precedes sustained uptrends.',
  },
  {
    id: 'rsi',
    name: 'RSI (14-Day)',
    description: 'Relative Strength Index measures momentum. Above 70 = overbought, below 30 = oversold.',
    insight: 'What is RSI? It measures momentum on a 0–100 scale. Above 70 suggests overbought conditions; below 30 suggests oversold. Institutions use RSI for mean-reversion entries and exit timing.',
  },
  {
    id: 'macd',
    name: 'MACD (12,26,9)',
    description: 'Moving Average Convergence Divergence shows momentum changes and potential reversals.',
    insight: 'What is MACD? It compares short- and long-term momentum. Crossovers signal trend shifts; divergence from price can foreshadow reversals. A cornerstone of quantitative momentum strategies.',
  },
  {
    id: 'bollinger',
    name: 'Bollinger Bands',
    description: 'Volatility bands showing price deviation from 20-day mean. Squeeze indicates consolidation.',
    insight: 'What are Bollinger Bands? They measure volatility around a 20-day average. A squeeze—when bands narrow—often precedes breakout moves. Institutions use band touches for mean-reversion setups.',
  },
  {
    id: 'volatility',
    name: 'Rolling Volatility',
    description: '20-day rolling standard deviation of returns. Higher values indicate increased risk.',
    insight: 'Why Volatility Matters? It quantifies risk and expected price swing. High volatility signals uncertainty; low volatility often precedes large moves. Essential for position sizing and options pricing.',
  },
  {
    id: 'zscore',
    name: 'Z-Score',
    description: 'Price deviation from 20-day mean in standard deviations. Values > 2 suggest mean reversion.',
    insight: 'What is Mean Reversion? This technique assumes prices return to a long-term average. It is vital in finance for identifying overextended stocks that are likely to correct back to the mean.',
  },
  {
    id: 'distance200ma',
    name: 'Distance from 200 MA',
    description: 'Percentage distance from 200-day MA. Extreme values may signal reversion opportunity.',
    insight: 'Why Distance from 200 MA? It measures how far price has stretched from its long-term trend. Extreme deviations often revert; institutional mean-reversion strategies use this to time entries.',
  },
  {
    id: 'relativeStrength',
    name: 'Relative Strength vs SPY',
    description: 'Stock performance relative to SPY. Rising line = outperformance vs market.',
    insight: 'What is Relative Strength? It compares a stock to the market (SPY). Outperformance suggests institutional accumulation; underperformance can signal distribution. Key for sector rotation.',
  },
  {
    id: 'cumulativeReturn',
    name: 'Cumulative Return',
    description: 'Total return over the period compared to SPY benchmark.',
    insight: 'Why Cumulative Return? It shows total performance vs the market. Institutions benchmark every position; alpha is measured as excess return over SPY. Essential for portfolio attribution.',
  },
  {
    id: 'drawdown',
    name: 'Drawdown',
    description: 'Peak-to-trough decline showing maximum loss from any high point.',
    insight: 'Why Drawdown Matters? It measures worst-case loss from a peak. Institutions use drawdown for risk management and to size positions. Lower drawdowns indicate more stable returns.',
  },
  {
    id: 'volume',
    name: 'Volume Analysis',
    description: 'Daily trading volume with 20-day average. High volume confirms price moves.',
    insight: 'Why Volume Matters? High volume validates price trends. In institutional trading, volume spikes often signal the entry or exit of Smart Money. Low volume breakouts are viewed as suspect.',
  },
  {
    id: 'volumeSpikes',
    name: 'Volume Spikes',
    description: 'Days where volume exceeds 2x average. Often indicates significant news or institutional activity.',
    insight: 'What Do Volume Spikes Signal? Unusual volume often precedes major moves. Institutions use volume spikes to detect accumulation, distribution, or earnings/news reactions. A key divergence indicator.',
  },
  {
    id: 'priceChange',
    name: 'Daily Price Change',
    description: 'Daily percentage returns. Useful for spotting volatility clusters.',
    insight: 'Why Daily Returns? They show day-to-day price movement in percentage terms. Volatility clusters—large moves followed by large moves—are common. Used for risk modeling and VaR calculations.',
  },
  {
    id: 'beta',
    name: 'Rolling Beta',
    description: '60-day rolling beta vs SPY. Beta > 1 means more volatile than market.',
    insight: 'What is Beta? It measures a stock\'s sensitivity to market moves. Beta > 1 means the stock amplifies market moves; beta < 1 means it dampens them. Central to CAPM and portfolio construction.',
  },
];

export const TICKERS = [
  'AAPL', 'ABNB', 'ADBE', 'AMAT', 'AMD', 'AMZN', 'ASML', 'AVGO', 'COIN', 'COST',
  'CRM', 'CVX', 'DIS', 'F', 'GM', 'GOOGL', 'GS', 'HOOD', 'INTC', 'JNJ',
  'JPM', 'LRCX', 'MA', 'META', 'MS', 'MSFT', 'MU', 'NFLX', 'NKE', 'NOW',
  'NVDA', 'ORCL', 'PANW', 'PFE', 'PLTR', 'PYPL', 'QCOM', 'SBUX', 'SHOP', 'SNOW',
  'SPY', 'TGT', 'TSM', 'TSLA', 'UBER', 'UNH', 'V', 'WMT', 'XOM'
];
