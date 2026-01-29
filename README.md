# Bloomberg Jr. Financial Terminal

A professional-grade financial terminal built with Next.js, Tailwind CSS, and Recharts. Features Bloomberg-style dark theme with comprehensive technical analysis tools.

## Features

- **50 Major Tickers**: AAPL, NVDA, TSLA, SPY, and more
- **15 Financial Metrics**:
  - Price Chart
  - 50/200-Day Moving Averages
  - RSI (14-Day) with overbought/oversold alerts
  - MACD (12, 26, 9)
  - Bollinger Bands (20-day)
  - Rolling Volatility
  - Z-Score (Mean Reversion)
  - Distance from 200 MA
  - Relative Strength vs SPY
  - Cumulative Return vs SPY
  - Drawdown Analysis
  - Volume Analysis
  - Volume Spikes
  - Daily Price Change
  - Rolling Beta

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate sample stock data (50 tickers, 2 years of data)
npm run generate-data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the terminal.

## Project Structure

```
├── public/
│   └── data/           # CSV files for each ticker
├── scripts/
│   └── generateData.ts # Stock data generator
├── src/
│   ├── app/
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Main terminal page
│   ├── components/
│   │   ├── charts/     # 15 chart components
│   │   ├── ChartGrid.tsx
│   │   ├── ChartPanel.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── lib/
│   │   ├── csvParser.ts    # Yahoo Finance CSV parser
│   │   └── financeMath.ts  # Financial calculations
│   └── types/
│       └── index.ts    # TypeScript definitions
└── tailwind.config.ts
```

## Visual Design

- **Background**: Pure Black (#000000)
- **Cards/Sidebar**: Dark Zinc (#09090b)
- **Accent**: Bloomberg Orange (#ff9900)
- **Positive Data**: Terminal Green (#00ff00)
- **Negative Data**: Red (#ff4444)
- **Font**: JetBrains Mono (monospace)

## Financial Math Engine

All calculations are performed client-side for performance:

- **SMA/EMA**: Simple and Exponential Moving Averages
- **RSI**: Relative Strength Index with Wilder smoothing
- **MACD**: Moving Average Convergence Divergence
- **Bollinger Bands**: 2 standard deviation bands
- **Beta**: 60-day rolling covariance/variance
- **Volatility**: Annualized rolling standard deviation

## Usage

1. Select a ticker from the dropdown
2. Check the metrics you want to analyze
3. Click **GENERATE** to render the charts
4. Charts display in a responsive 2-column grid

## Author

Hugo Canseco - UC Berkeley Haas

## License

MIT
