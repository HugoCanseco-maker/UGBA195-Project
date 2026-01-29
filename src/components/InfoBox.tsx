"use client";

import { IndicatorTab } from "@/types";

const INFO: Record<IndicatorTab, { title: string; body: string }> = {
  price: {
    title: "Price Chart (OHLC)",
    body: "Candlestick chart showing Open, High, Low, Close for each period. Green candles indicate close > open; red indicates close < open. Essential for spotting trends and reversals.",
  },
  volume: {
    title: "Volume",
    body: "Trading volume per period. High volume often confirms price moves—breakouts on low volume are less reliable. Volume spikes can signal institutional activity or news.",
  },
  "moving-averages": {
    title: "Moving Averages (50/200-day)",
    body: "50-day MA captures medium-term trend; 200-day MA captures long-term. Golden cross (50 > 200) is bullish; death cross (50 < 200) is bearish. Price above both MAs suggests uptrend.",
  },
  rsi: {
    title: "RSI (Relative Strength Index)",
    body: "Momentum oscillator (0–100). RSI > 70 suggests overbought; RSI < 30 suggests oversold. Divergences (price makes new high but RSI doesn't) can signal reversals.",
  },
  zscore: {
    title: "Z-Score / Mean Reversion",
    body: "Measures how many standard deviations price is from its rolling mean. Z > 2 suggests overbought; Z < -2 suggests oversold. Mean-reversion strategies buy when Z is low.",
  },
  volatility: {
    title: "Rolling Volatility (Std Dev)",
    body: "Annualized volatility of daily returns over a rolling window. Higher volatility = more risk. Used for position sizing and options pricing. Spikes often precede major moves.",
  },
  bollinger: {
    title: "Bollinger Bands",
    body: "Middle band = moving average; upper/lower = ±2 std devs. Price near upper band = potentially overbought; near lower = oversold. Squeezes (narrow bands) often precede breakouts.",
  },
  macd: {
    title: "MACD (Moving Average Convergence Divergence)",
    body: "MACD line = fast EMA - slow EMA. Signal line = EMA of MACD. Histogram = MACD - signal. Crossovers signal momentum shifts. Divergences can warn of trend exhaustion.",
  },
  correlation: {
    title: "Correlation Matrix Heatmap",
    body: "Shows pairwise correlations between selected tickers. Values near +1 move together; near -1 move opposite. Useful for diversification—avoid holding highly correlated assets.",
  },
  "relative-strength": {
    title: "Relative Strength vs SPY",
    body: "Ratio of stock price to SPY. Rising line = stock outperforming market; falling = underperforming. Helps identify leaders and laggards regardless of market direction.",
  },
  drawdown: {
    title: "Drawdown Chart",
    body: "Shows peak-to-trough decline from each high. Measures risk and pain of holding. Max drawdown is a key risk metric—how much you'd lose in the worst case from a peak.",
  },
  beta: {
    title: "Beta vs SPY",
    body: "Beta measures sensitivity to market. Beta = 1 means moves with market; >1 = more volatile; <1 = less. Used to adjust expected returns (CAPM) and assess systematic risk.",
  },
  "cumulative-return": {
    title: "Cumulative Return vs Benchmark",
    body: "Total return from start of period, normalized to 100. Compares stock performance to SPY. Steeper slope = better performance. Essential for comparing strategies.",
  },
  "distance-200ma": {
    title: "Distance from 200-day MA",
    body: "% above or below 200-day moving average. Positive = above trend; negative = below. Extreme values (>20% or <-20%) can signal overextension and mean reversion.",
  },
  "volume-spikes": {
    title: "Volume Spikes / Anomalies",
    body: "Highlights days when volume exceeds its rolling average by a threshold. Volume spikes often accompany news, earnings, or institutional moves. Useful for event detection.",
  },
};

interface InfoBoxProps {
  activeTab?: IndicatorTab;
}

export function InfoBox({ activeTab = "price" }: InfoBoxProps) {
  const info = INFO[activeTab];
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-bloomberg-amber mb-2">
        What you&apos;re seeing
      </h3>
      <h4 className="text-xs font-medium text-gray-300 mb-1">{info.title}</h4>
      <p className="text-xs text-bloomberg-muted leading-relaxed">{info.body}</p>
    </div>
  );
}
