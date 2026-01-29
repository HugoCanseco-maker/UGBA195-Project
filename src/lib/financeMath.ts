import {
  StockData,
  IndicatorData,
  MACDData,
  BollingerData,
  MovingAverageData,
  RelativeStrengthData,
  CumulativeReturnData,
  DrawdownData,
  VolatilityData,
  VolumeData,
  ZScoreData,
  DistanceMAData,
} from '@/types';

/**
 * Calculates Simple Moving Average
 */
export function calculateSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / period;
      result.push(avg);
    }
  }
  
  return result;
}

/**
 * Calculates Exponential Moving Average
 */
export function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(data[i]); // Use raw values before EMA kicks in
    } else if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (data[i] - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  
  return result;
}

/**
 * Calculates 50 and 200 day Moving Averages
 */
export function calculateMovingAverages(stockData: StockData[]): MovingAverageData[] {
  const closes = stockData.map(d => d.close);
  const ma50 = calculateSMA(closes, 50);
  const ma200 = calculateSMA(closes, 200);
  
  return stockData.map((d, i) => ({
    date: d.date,
    close: d.close,
    ma50: ma50[i],
    ma200: ma200[i],
  }));
}

/**
 * Calculates RSI (Relative Strength Index)
 */
export function calculateRSI(stockData: StockData[], period: number = 14): IndicatorData[] {
  const closes = stockData.map(d => d.close);
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const rsi: (number | null)[] = [null]; // First day has no RSI
  
  // Calculate initial average gain/loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < gains.length; i++) {
    if (i < period - 1) {
      rsi.push(null);
    } else if (i === period - 1) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    } else {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return stockData.map((d, i) => ({
    date: d.date,
    value: rsi[i] ?? 50,
  }));
}

/**
 * Calculates MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(
  stockData: StockData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDData[] {
  const closes = stockData.map(d => d.close);
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);
  
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  return stockData.map((d, i) => ({
    date: d.date,
    macd: macdLine[i],
    signal: signalLine[i],
    histogram: macdLine[i] - signalLine[i],
  }));
}

/**
 * Calculates Bollinger Bands
 */
export function calculateBollingerBands(
  stockData: StockData[],
  period: number = 20,
  stdDev: number = 2
): BollingerData[] {
  const closes = stockData.map(d => d.close);
  const sma = calculateSMA(closes, period);
  
  const bands: BollingerData[] = [];
  
  for (let i = 0; i < stockData.length; i++) {
    if (i < period - 1 || sma[i] === null) {
      bands.push({
        date: stockData[i].date,
        close: closes[i],
        upper: closes[i],
        middle: closes[i],
        lower: closes[i],
      });
    } else {
      const slice = closes.slice(i - period + 1, i + 1);
      const mean = sma[i]!;
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      
      bands.push({
        date: stockData[i].date,
        close: closes[i],
        upper: mean + stdDev * std,
        middle: mean,
        lower: mean - stdDev * std,
      });
    }
  }
  
  return bands;
}

/**
 * Calculates Rolling Volatility (Standard Deviation of Returns)
 */
export function calculateVolatility(stockData: StockData[], period: number = 20): VolatilityData[] {
  const returns: number[] = [];
  
  for (let i = 1; i < stockData.length; i++) {
    const dailyReturn = (stockData[i].close - stockData[i - 1].close) / stockData[i - 1].close;
    returns.push(dailyReturn);
  }
  
  const volatility: VolatilityData[] = [{ date: stockData[0].date, volatility: 0 }];
  
  for (let i = 0; i < returns.length; i++) {
    if (i < period - 1) {
      volatility.push({ date: stockData[i + 1].date, volatility: 0 });
    } else {
      const slice = returns.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized, as percentage
      volatility.push({ date: stockData[i + 1].date, volatility: std });
    }
  }
  
  return volatility;
}

/**
 * Calculates Z-Score (Price vs 20-day Mean)
 */
export function calculateZScore(stockData: StockData[], period: number = 20): ZScoreData[] {
  const closes = stockData.map(d => d.close);
  const zscore: ZScoreData[] = [];
  
  for (let i = 0; i < stockData.length; i++) {
    if (i < period - 1) {
      zscore.push({ date: stockData[i].date, zscore: 0 });
    } else {
      const slice = closes.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      const z = std === 0 ? 0 : (closes[i] - mean) / std;
      zscore.push({ date: stockData[i].date, zscore: z });
    }
  }
  
  return zscore;
}

/**
 * Calculates Distance from 200-day MA (as percentage)
 */
export function calculateDistanceFrom200MA(stockData: StockData[]): DistanceMAData[] {
  const closes = stockData.map(d => d.close);
  const ma200 = calculateSMA(closes, 200);
  
  return stockData.map((d, i) => ({
    date: d.date,
    distance: ma200[i] === null ? 0 : ((d.close - ma200[i]!) / ma200[i]!) * 100,
  }));
}

/**
 * Calculates Relative Strength vs SPY
 */
export function calculateRelativeStrength(
  stockData: StockData[],
  spyData: StockData[]
): RelativeStrengthData[] {
  // Create a map of SPY prices by date
  const spyPriceMap = new Map<string, number>();
  spyData.forEach(d => spyPriceMap.set(d.date, d.close));
  
  // Find first common date
  const firstStockDate = stockData[0]?.date;
  const firstSpyPrice = spyPriceMap.get(firstStockDate);
  const firstStockPrice = stockData[0]?.close;
  
  if (!firstSpyPrice || !firstStockPrice) {
    return stockData.map(d => ({ date: d.date, relativeStrength: 100 }));
  }
  
  // Normalize both to 100 at start
  return stockData.map(d => {
    const spyPrice = spyPriceMap.get(d.date);
    if (!spyPrice) {
      return { date: d.date, relativeStrength: 100 };
    }
    
    const stockNormalized = (d.close / firstStockPrice) * 100;
    const spyNormalized = (spyPrice / firstSpyPrice) * 100;
    const relativeStrength = (stockNormalized / spyNormalized) * 100;
    
    return { date: d.date, relativeStrength };
  });
}

/**
 * Calculates Cumulative Return vs SPY
 */
export function calculateCumulativeReturn(
  stockData: StockData[],
  spyData: StockData[]
): CumulativeReturnData[] {
  const spyPriceMap = new Map<string, number>();
  spyData.forEach(d => spyPriceMap.set(d.date, d.close));
  
  const firstStockPrice = stockData[0]?.close;
  const firstSpyPrice = spyPriceMap.get(stockData[0]?.date);
  
  if (!firstStockPrice || !firstSpyPrice) {
    return stockData.map(d => ({ date: d.date, stockReturn: 0, spyReturn: 0 }));
  }
  
  return stockData.map(d => {
    const spyPrice = spyPriceMap.get(d.date) ?? firstSpyPrice;
    
    return {
      date: d.date,
      stockReturn: ((d.close - firstStockPrice) / firstStockPrice) * 100,
      spyReturn: ((spyPrice - firstSpyPrice) / firstSpyPrice) * 100,
    };
  });
}

/**
 * Calculates Drawdown from Peak
 */
export function calculateDrawdown(stockData: StockData[]): DrawdownData[] {
  let peak = stockData[0]?.close ?? 0;
  
  return stockData.map(d => {
    if (d.close > peak) {
      peak = d.close;
    }
    const drawdown = ((d.close - peak) / peak) * 100;
    return { date: d.date, drawdown };
  });
}

/**
 * Calculates Volume with 20-day Average
 */
export function calculateVolumeAnalysis(stockData: StockData[], period: number = 20): VolumeData[] {
  const volumes = stockData.map(d => d.volume);
  const avgVolume = calculateSMA(volumes, period);
  
  return stockData.map((d, i) => ({
    date: d.date,
    volume: d.volume,
    avgVolume: avgVolume[i] ?? d.volume,
  }));
}

/**
 * Identifies Volume Spikes (> 2x average)
 */
export function calculateVolumeSpikes(stockData: StockData[], period: number = 20): IndicatorData[] {
  const volumes = stockData.map(d => d.volume);
  const avgVolume = calculateSMA(volumes, period);
  
  return stockData.map((d, i) => {
    const avg = avgVolume[i] ?? d.volume;
    const ratio = avg > 0 ? d.volume / avg : 1;
    return {
      date: d.date,
      value: ratio,
      isSpike: ratio > 2,
    };
  });
}

/**
 * Calculates Daily Price Change (%)
 */
export function calculatePriceChange(stockData: StockData[]): IndicatorData[] {
  return stockData.map((d, i) => {
    if (i === 0) {
      return { date: d.date, value: 0 };
    }
    const change = ((d.close - stockData[i - 1].close) / stockData[i - 1].close) * 100;
    return { date: d.date, value: change };
  });
}

/**
 * Calculates Rolling Beta vs SPY
 */
export function calculateBeta(
  stockData: StockData[],
  spyData: StockData[],
  period: number = 60
): IndicatorData[] {
  // Create maps for returns
  const spyReturns = new Map<string, number>();
  for (let i = 1; i < spyData.length; i++) {
    const ret = (spyData[i].close - spyData[i - 1].close) / spyData[i - 1].close;
    spyReturns.set(spyData[i].date, ret);
  }
  
  // Calculate stock returns
  const stockReturnsArray: { date: string; stockRet: number; spyRet: number }[] = [];
  for (let i = 1; i < stockData.length; i++) {
    const stockRet = (stockData[i].close - stockData[i - 1].close) / stockData[i - 1].close;
    const spyRet = spyReturns.get(stockData[i].date) ?? 0;
    stockReturnsArray.push({ date: stockData[i].date, stockRet, spyRet });
  }
  
  const beta: IndicatorData[] = [{ date: stockData[0].date, value: 1 }];
  
  for (let i = 0; i < stockReturnsArray.length; i++) {
    if (i < period - 1) {
      beta.push({ date: stockReturnsArray[i].date, value: 1 });
    } else {
      const slice = stockReturnsArray.slice(i - period + 1, i + 1);
      
      const meanStock = slice.reduce((a, b) => a + b.stockRet, 0) / period;
      const meanSpy = slice.reduce((a, b) => a + b.spyRet, 0) / period;
      
      let covariance = 0;
      let spyVariance = 0;
      
      for (const item of slice) {
        covariance += (item.stockRet - meanStock) * (item.spyRet - meanSpy);
        spyVariance += Math.pow(item.spyRet - meanSpy, 2);
      }
      
      const betaValue = spyVariance === 0 ? 1 : covariance / spyVariance;
      beta.push({ date: stockReturnsArray[i].date, value: betaValue });
    }
  }
  
  return beta;
}

/**
 * Gets the latest RSI value for conditional formatting
 */
export function getLatestRSI(rsiData: IndicatorData[]): number {
  const validData = rsiData.filter(d => d.value !== null && d.value !== undefined);
  return validData[validData.length - 1]?.value ?? 50;
}

/**
 * Gets current price stats
 */
export function getCurrentStats(stockData: StockData[]) {
  if (stockData.length === 0) {
    return { price: 0, change: 0, changePercent: 0, volume: 0 };
  }
  
  const latest = stockData[stockData.length - 1];
  const previous = stockData[stockData.length - 2];
  
  const change = previous ? latest.close - previous.close : 0;
  const changePercent = previous ? (change / previous.close) * 100 : 0;
  
  return {
    price: latest.close,
    change,
    changePercent,
    volume: latest.volume,
  };
}
