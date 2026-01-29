"use client";

import { useState, useEffect } from "react";
import { Watchlist } from "@/components/Watchlist";
import { ChartGrid } from "@/components/ChartGrid";
import { StatsCards } from "@/components/StatsCards";
import { getTickerData } from "@/lib/chartUtils";
import { PriceRow } from "@/types";

export default function Dashboard() {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [tickerData, setTickerData] = useState<Record<string, PriceRow[]>>({});
  const [loading, setLoading] = useState(false);
  const [chartsGenerated, setChartsGenerated] = useState(false);

  // Load ticker-specific CSVs from data/AAPL.csv, data/GOOGL.csv, etc.
  useEffect(() => {
    if (selectedTickers.length === 0) {
      setTickerData({});
      return;
    }
    setLoading(true);
    Promise.all(selectedTickers.map((t) => getTickerData(t)))
      .then((results) => {
        const data: Record<string, PriceRow[]> = {};
        selectedTickers.forEach((t, i) => {
          data[t] = results[i] ?? [];
        });
        setTickerData(data);
      })
      .catch(() => setTickerData({}))
      .finally(() => setLoading(false));
  }, [selectedTickers]);

  const handleSelectTicker = (ticker: string) => {
    setSelectedTickers((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      if (prev.length >= 5) return prev;
      return [...prev, ticker];
    });
    setChartsGenerated(false);
  };

  const handleGenerateCharts = () => {
    setChartsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-bloomberg-black text-gray-200 flex flex-col">
      <div className="flex flex-1 min-h-0">
        <aside className="w-56 border-r border-bloomberg-border bg-bloomberg-dark flex-shrink-0 flex flex-col min-h-0">
          <div className="p-3 border-b border-bloomberg-border">
            <h1 className="text-sm font-semibold text-bloomberg-amber">
              Hugo&apos;s Market
            </h1>
            <p className="text-xs text-bloomberg-muted mt-0.5">
              Select 1–5 tickers
            </p>
          </div>
          <Watchlist
            selectedTickers={selectedTickers}
            onSelect={handleSelectTicker}
            loading={false}
          />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="p-3 border-b border-bloomberg-border bg-bloomberg-dark flex-shrink-0">
            <StatsCards
              selectedTickers={selectedTickers}
              tickerData={tickerData}
            />
          </div>

          <div className="flex-1 min-h-0 p-4 overflow-auto flex flex-col">
            <div className="flex-shrink-0 flex items-center gap-4 mb-4 pb-3 border-b border-bloomberg-border">
              <button
                onClick={handleGenerateCharts}
                disabled={selectedTickers.length === 0 || loading}
                className="px-4 py-2 bg-bloomberg-amber text-bloomberg-black font-mono text-sm font-semibold rounded hover:bg-bloomberg-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate Charts
              </button>
              <span className="text-xs text-bloomberg-muted">
                {selectedTickers.length === 0
                  ? "Select 1–5 tickers first"
                  : loading
                    ? "Loading data..."
                    : chartsGenerated
                      ? `Showing charts for ${selectedTickers.join(", ")}`
                      : `Ready: ${selectedTickers.join(", ")} selected`}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <ChartGrid
                selectedTickers={selectedTickers}
                tickerData={tickerData}
                loading={loading}
                chartsGenerated={chartsGenerated}
              />
            </div>
          </div>
        </main>
      </div>

      <footer className="py-2 px-4 border-t border-bloomberg-border bg-bloomberg-dark text-xs text-bloomberg-muted text-center">
        Created by Hugo Canseco
      </footer>
    </div>
  );
}
