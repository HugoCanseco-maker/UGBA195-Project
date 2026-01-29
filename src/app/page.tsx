"use client";

import { useState, useEffect } from "react";
import { Watchlist } from "@/components/Watchlist";
import { ChartGrid } from "@/components/ChartGrid";
import { StatsCards } from "@/components/StatsCards";
import { getTickerData } from "@/lib/chartUtils";
import { PriceRow } from "@/types";

const CHART_IDS = ["price", "volume", "moving-averages", "rsi", "zscore"] as const;

export default function Dashboard() {
  const [selectedTicker, setSelectedTicker] = useState<string>("");
  const [visibleCharts, setVisibleCharts] = useState<string[]>([]);
  const [tickerData, setTickerData] = useState<Record<string, PriceRow[]>>({});
  const [loading, setLoading] = useState(false);

  // Load ticker-specific CSV when selectedTicker changes
  useEffect(() => {
    if (!selectedTicker) {
      setTickerData({});
      return;
    }
    setLoading(true);
    getTickerData(selectedTicker)
      .then((rows) => {
        setTickerData({ [selectedTicker]: rows });
      })
      .catch(() => setTickerData({}))
      .finally(() => setLoading(false));
  }, [selectedTicker]);

  const handleSelectTicker = (ticker: string) => {
    setSelectedTicker((prev) => (prev === ticker ? "" : ticker));
    setVisibleCharts([]); // Reset charts when ticker changes
  };

  const handleGenerateDashboard = () => {
    if (selectedTicker) {
      setVisibleCharts([...CHART_IDS]);
    }
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
              Select a ticker, then Generate
            </p>
          </div>
          <Watchlist
            selectedTickers={selectedTicker ? [selectedTicker] : []}
            onSelect={handleSelectTicker}
            loading={false}
          />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="p-3 border-b border-bloomberg-border bg-bloomberg-dark flex-shrink-0">
            <StatsCards
              selectedTickers={selectedTicker ? [selectedTicker] : []}
              tickerData={tickerData}
            />
          </div>

          <div className="flex-1 min-h-0 p-4 overflow-auto flex flex-col">
            <div className="flex-shrink-0 flex items-center gap-4 mb-4 pb-3 border-b border-bloomberg-border">
              <button
                onClick={handleGenerateDashboard}
                disabled={!selectedTicker || loading}
                className="px-4 py-2 bg-bloomberg-amber text-bloomberg-black font-mono text-sm font-semibold rounded hover:bg-bloomberg-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate Dashboard
              </button>
              <span className="text-xs text-bloomberg-muted">
                {!selectedTicker
                  ? "Select a ticker first"
                  : loading
                    ? "Loading data..."
                    : visibleCharts.length > 0
                      ? `Showing ${visibleCharts.length} charts for ${selectedTicker}`
                      : `Ready: ${selectedTicker} selected`}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <ChartGrid
                selectedTickers={selectedTicker ? [selectedTicker] : []}
                tickerData={tickerData}
                loading={loading}
                visibleCharts={visibleCharts}
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
