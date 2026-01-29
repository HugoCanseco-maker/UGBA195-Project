# Hugo's Market Dashboard – Bloomberg-Style Stock Visualizer

A junior Bloomberg Terminal-style dashboard for stock analysis. Created by **Hugo Canseco**.

## Features

- **Watchlist sidebar** with ~50 tickers (AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, AMD, and more)
- **Stats cards** showing current price, 1-week return, 1-year return, and rolling volatility
- **15 indicator views**: Price, Volume, Moving Averages, RSI, Z-Score, Volatility, Bollinger Bands, MACD, Correlation matrix, Relative strength vs SPY, Drawdown, Beta, Cumulative return, Distance from 200-day MA, Volume spikes
- **Select 1–5 stocks** at a time from the watchlist
- **"What you're seeing" info box** explaining each chart
- **Dark theme** Bloomberg-style UI

## Data Pipeline

The app reads from pre-downloaded CSV files in the `data/` folder. No live API calls are made when deployed.

### Option 1: Download real data (recommended)

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the download script:
   ```bash
   python scripts/download_data.py
   ```

   This downloads OHLCV data for all ~50 tickers from Yahoo Finance (2020–2026) and saves to `data/prices.csv`.

### Option 2: Generate sample data (offline / demo)

If you're offline or Yahoo Finance is unavailable:

```bash
python scripts/generate_sample_data.py
```

This creates synthetic sample data in `data/prices.csv` so the app works for demo purposes.

## Running the app locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Push the project to GitHub.

2. Connect the repo to Vercel and deploy.

3. **Important**: Ensure `data/prices.csv` exists before deploying. Either:
   - Run `python scripts/download_data.py` locally and commit `data/prices.csv`, or
   - Run `python scripts/generate_sample_data.py` and commit the file.

   The app reads from these CSVs and does not make live Yahoo Finance API calls when deployed.

## Project structure

```
├── data/
│   └── prices.csv          # OHLCV data (ticker, date, open, high, low, close, volume)
├── scripts/
│   ├── download_data.py    # Download real data via yfinance
│   └── generate_sample_data.py  # Generate sample data (offline)
├── src/
│   ├── app/
│   │   ├── api/prices/     # API route serving CSV data
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── charts/         # 15 indicator chart components
│   │   ├── ChartPanel.tsx
│   │   ├── InfoBox.tsx
│   │   ├── StatsCards.tsx
│   │   └── Watchlist.tsx
│   ├── lib/data.ts         # Data utilities (MA, RSI, etc.)
│   └── types/index.ts
└── package.json
```

## Tech stack

- Next.js 14+ (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts
