"use client";

import { TICKERS } from "@/lib/data";
import clsx from "clsx";

interface WatchlistProps {
  selectedTickers: string[];
  onSelect: (ticker: string) => void;
  loading: boolean;
}

export function Watchlist({ selectedTickers, onSelect, loading }: WatchlistProps) {
  return (
    <div className="flex-1 overflow-auto p-2">
      <p className="text-xs text-bloomberg-muted px-2 py-1">
        Select one ticker • Click to toggle
      </p>
      {loading ? (
        <div className="p-4 text-bloomberg-muted text-sm">Loading...</div>
      ) : (
        <ul className="space-y-0.5">
          {TICKERS.map((ticker) => {
            const selected = selectedTickers.includes(ticker);
            return (
              <li key={ticker}>
                <button
                  onClick={() => onSelect(ticker)}
                  className={clsx(
                    "w-full text-left px-3 py-1.5 rounded text-sm font-mono transition-colors",
                    selected
                      ? "bg-bloomberg-amber/20 text-bloomberg-amber border border-bloomberg-amber/50"
                      : "hover:bg-bloomberg-panel text-gray-300"
                  )}
                >
                  {ticker}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
