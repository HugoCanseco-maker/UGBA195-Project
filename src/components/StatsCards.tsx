"use client";

import { PriceRow } from "@/types";
import clsx from "clsx";

interface StatsCardsProps {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
}

function computeStats(rows: PriceRow[]): {
  currentPrice: number;
  weekReturn: number;
  yearReturn: number;
  volatility: number;
} {
  if (rows.length < 2) return { currentPrice: 0, weekReturn: 0, yearReturn: 0, volatility: 0 };
  const current = rows[rows.length - 1].close;
  const weekAgo = rows[Math.max(0, rows.length - 6)];
  const yearAgo = rows[Math.max(0, rows.length - 253)];
  const weekReturn = weekAgo ? ((current - weekAgo.close) / weekAgo.close) * 100 : 0;
  const yearReturn = yearAgo ? ((current - yearAgo.close) / yearAgo.close) * 100 : 0;
  const returns = [];
  for (let i = 1; i < Math.min(22, rows.length); i++) {
    const r = (rows[rows.length - i].close - rows[rows.length - i - 1].close) / rows[rows.length - i - 1].close;
    returns.push(r);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const volatility = Math.sqrt(variance) * 100;
  return { currentPrice: current, weekReturn, yearReturn, volatility };
}

export function StatsCards({ selectedTickers, tickerData }: StatsCardsProps) {
  if (selectedTickers.length === 0) {
    return (
      <div className="text-bloomberg-muted text-sm">
        Select tickers from the watchlist to view stats
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {selectedTickers.map((ticker) => {
        const rows = tickerData[ticker] ?? [];
        const stats = computeStats(rows);
        if (rows.length === 0) {
          return (
            <div
              key={ticker}
              className="bg-bloomberg-panel border border-bloomberg-border rounded-lg px-4 py-3 min-w-[180px]"
            >
              <div className="text-bloomberg-amber font-semibold text-sm">{ticker}</div>
              <div className="text-xs text-bloomberg-muted mt-2">Loading...</div>
            </div>
          );
        }
        return (
          <div
            key={ticker}
            className="bg-bloomberg-panel border border-bloomberg-border rounded-lg px-4 py-3 min-w-[180px]"
          >
            <div className="text-bloomberg-amber font-semibold text-sm">{ticker}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
              <span className="text-bloomberg-muted">Price</span>
              <span className="text-right font-mono">${stats.currentPrice.toFixed(2)}</span>
              <span className="text-bloomberg-muted">1W Return</span>
              <span
                className={clsx(
                  "text-right font-mono",
                  stats.weekReturn >= 0 ? "text-bloomberg-green" : "text-bloomberg-red"
                )}
              >
                {stats.weekReturn >= 0 ? "+" : ""}
                {stats.weekReturn.toFixed(2)}%
              </span>
              <span className="text-bloomberg-muted">1Y Return</span>
              <span
                className={clsx(
                  "text-right font-mono",
                  stats.yearReturn >= 0 ? "text-bloomberg-green" : "text-bloomberg-red"
                )}
              >
                {stats.yearReturn >= 0 ? "+" : ""}
                {stats.yearReturn.toFixed(2)}%
              </span>
              <span className="text-bloomberg-muted">Vol (21d)</span>
              <span className="text-right font-mono text-bloomberg-blue">
                {stats.volatility.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
