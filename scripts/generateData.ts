import * as fs from 'fs';
import * as path from 'path';

const TICKERS = [
  'AAPL', 'ABBV', 'ADBE', 'AMAT', 'AMD', 'AMZN', 'AVGO', 'AXP', 'BA', 'BRK_B',
  'CAT', 'COIN', 'CRM', 'CSCO', 'CVX', 'DIS', 'GE', 'GOOGL', 'GS', 'HOOD',
  'IBM', 'INTC', 'JNJ', 'JPM', 'KLAC', 'LMT', 'LRCX', 'MA', 'META', 'MMM',
  'MRK', 'MSFT', 'MU', 'NFLX', 'NOW', 'NVDA', 'ORCL', 'PFE', 'PG', 'PLTR',
  'PYPL', 'QCOM', 'SNOW', 'SPY', 'TSLA', 'TXN', 'UNH', 'V', 'WMT', 'XOM'
];

// Realistic base prices for each ticker
const BASE_PRICES: Record<string, number> = {
  'AAPL': 185, 'ABBV': 155, 'ADBE': 580, 'AMAT': 190, 'AMD': 145,
  'AMZN': 175, 'AVGO': 1350, 'AXP': 220, 'BA': 210, 'BRK_B': 410,
  'CAT': 340, 'COIN': 180, 'CRM': 290, 'CSCO': 50, 'CVX': 155,
  'DIS': 95, 'GE': 160, 'GOOGL': 145, 'GS': 480, 'HOOD': 22,
  'IBM': 190, 'INTC': 35, 'JNJ': 155, 'JPM': 195, 'KLAC': 700,
  'LMT': 475, 'LRCX': 950, 'MA': 470, 'META': 500, 'MMM': 105,
  'MRK': 125, 'MSFT': 415, 'MU': 110, 'NFLX': 620, 'NOW': 850,
  'NVDA': 880, 'ORCL': 125, 'PFE': 28, 'PG': 165, 'PLTR': 24,
  'PYPL': 65, 'QCOM': 170, 'SNOW': 165, 'SPY': 520, 'TSLA': 245,
  'TXN': 175, 'UNH': 530, 'V': 280, 'WMT': 175, 'XOM': 115
};

// Volatility profiles (daily std dev as decimal)
const VOLATILITY: Record<string, number> = {
  'AAPL': 0.018, 'ABBV': 0.014, 'ADBE': 0.022, 'AMAT': 0.025, 'AMD': 0.032,
  'AMZN': 0.022, 'AVGO': 0.024, 'AXP': 0.018, 'BA': 0.025, 'BRK_B': 0.012,
  'CAT': 0.018, 'COIN': 0.045, 'CRM': 0.024, 'CSCO': 0.015, 'CVX': 0.016,
  'DIS': 0.020, 'GE': 0.020, 'GOOGL': 0.020, 'GS': 0.020, 'HOOD': 0.048,
  'IBM': 0.015, 'INTC': 0.025, 'JNJ': 0.012, 'JPM': 0.018, 'KLAC': 0.026,
  'LMT': 0.014, 'LRCX': 0.028, 'MA': 0.016, 'META': 0.028, 'MMM': 0.016,
  'MRK': 0.014, 'MSFT': 0.018, 'MU': 0.030, 'NFLX': 0.028, 'NOW': 0.026,
  'NVDA': 0.035, 'ORCL': 0.018, 'PFE': 0.016, 'PG': 0.010, 'PLTR': 0.042,
  'PYPL': 0.028, 'QCOM': 0.024, 'SNOW': 0.038, 'SPY': 0.010, 'TSLA': 0.038,
  'TXN': 0.018, 'UNH': 0.016, 'V': 0.014, 'WMT': 0.012, 'XOM': 0.016
};

// Trend bias (annual drift)
const TREND: Record<string, number> = {
  'AAPL': 0.15, 'ABBV': 0.08, 'ADBE': 0.12, 'AMAT': 0.20, 'AMD': 0.25,
  'AMZN': 0.18, 'AVGO': 0.22, 'AXP': 0.10, 'BA': 0.05, 'BRK_B': 0.12,
  'CAT': 0.14, 'COIN': 0.30, 'CRM': 0.15, 'CSCO': 0.08, 'CVX': 0.06,
  'DIS': -0.05, 'GE': 0.18, 'GOOGL': 0.16, 'GS': 0.12, 'HOOD': 0.20,
  'IBM': 0.10, 'INTC': -0.10, 'JNJ': 0.05, 'JPM': 0.12, 'KLAC': 0.22,
  'LMT': 0.10, 'LRCX': 0.24, 'MA': 0.12, 'META': 0.25, 'MMM': -0.05,
  'MRK': 0.08, 'MSFT': 0.18, 'MU': 0.15, 'NFLX': 0.20, 'NOW': 0.22,
  'NVDA': 0.45, 'ORCL': 0.14, 'PFE': -0.08, 'PG': 0.06, 'PLTR': 0.28,
  'PYPL': -0.10, 'QCOM': 0.15, 'SNOW': 0.10, 'SPY': 0.10, 'TSLA': 0.20,
  'TXN': 0.12, 'UNH': 0.10, 'V': 0.12, 'WMT': 0.10, 'XOM': 0.08
};

function generateStockData(ticker: string, days: number = 504): string[] {
  const basePrice = BASE_PRICES[ticker] ?? 100;
  const volatility = VOLATILITY[ticker] ?? 0.02;
  const annualTrend = TREND[ticker] ?? 0.10;
  const dailyTrend = annualTrend / 252;
  
  const rows: string[] = ['Date,Open,High,Low,Close,Adj Close,Volume'];
  
  let price = basePrice * (0.7 + Math.random() * 0.3); // Start 70-100% of current price
  const startDate = new Date('2023-01-03');
  
  let dayCount = 0;
  const currentDate = new Date(startDate);
  
  while (dayCount < days) {
    // Skip weekends
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Generate daily return with trend and noise
    const noise = (Math.random() - 0.5) * 2 * volatility;
    const dailyReturn = dailyTrend + noise;
    
    // Calculate OHLC
    const open = price;
    const close = price * (1 + dailyReturn);
    const intraVolatility = volatility * 0.5;
    const high = Math.max(open, close) * (1 + Math.random() * intraVolatility);
    const low = Math.min(open, close) * (1 - Math.random() * intraVolatility);
    
    // Generate volume (higher on bigger moves)
    const baseVolume = 10000000 + Math.random() * 50000000;
    const volumeMultiplier = 1 + Math.abs(dailyReturn) * 20;
    const volume = Math.round(baseVolume * volumeMultiplier);
    
    // Format date as YYYY-MM-DD
    const dateStr = currentDate.toISOString().split('T')[0];
    
    rows.push(
      `${dateStr},${open.toFixed(2)},${high.toFixed(2)},${low.toFixed(2)},${close.toFixed(2)},${close.toFixed(2)},${volume}`
    );
    
    price = close;
    currentDate.setDate(currentDate.getDate() + 1);
    dayCount++;
  }
  
  return rows;
}

function main() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  console.log('Generating stock data for 50 tickers...\n');
  
  for (const ticker of TICKERS) {
    const data = generateStockData(ticker);
    const filePath = path.join(dataDir, `${ticker}.csv`);
    fs.writeFileSync(filePath, data.join('\n'));
    console.log(`✓ Generated ${ticker}.csv (${data.length - 1} trading days)`);
  }
  
  console.log('\n✅ All data generated successfully!');
  console.log(`📁 Data saved to: ${dataDir}`);
}

main();
