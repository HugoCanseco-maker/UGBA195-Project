"use client";

import { useState, useEffect } from "react";
import { Watchlist } from "@/components/Watchlist";
import { ChartGrid } from "@/components/ChartGrid";
import { StatsCards } from "@/components/StatsCards";
import { PriceRow } from "@/types";

export default function Dashboard() {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [allData, setAllData] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setAllData([]);
        } else {
          const raw = res.data || [];
          const data = raw.map((r: Record<string, unknown>) => ({
            ticker: String(r.ticker ?? ""),
            date: String(r.date ?? ""),
            open: parseFloat(String(r.open ?? 0)) || 0,
            high: parseFloat(String(r.high ?? 0)) || 0,
            low: parseFloat(String(r.low ?? 0)) || 0,
            close: parseFloat(String(r.close ?? 0)) || 0,
            volume: parseFloat(String(r.volume ?? 0)) || 0,
          })) as PriceRow[];
          setAllData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setAllData([]);
        setLoading(false);
      });
  }, []);

  const handleSelectTicker = (ticker: string) => {
    setSelectedTickers((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      if (prev.length >= 5) return prev;
      return [...prev, ticker];
    });
  };

  return (
    <div className="min-h-screen bg-bloomberg-black text-gray-200 flex flex-col">
      <div className="flex flex-1 min-h-0">
        {/* Watchlist - no extra box, tickers start immediately */}
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
            loading={loading}
          />
        </aside>

        {/* Main content - 5 charts + stats */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="p-3 border-b border-bloomberg-border bg-bloomberg-dark flex-shrink-0">
            <StatsCards
              selectedTickers={selectedTickers}
              allData={allData}
            />
          </div>

          <div className="flex-1 min-h-0 p-4 overflow-auto">
            {error ? (
              <div className="h-full flex items-center justify-center text-bloomberg-red text-sm">
                {error}
              </div>
            ) : (
              <ChartGrid
                selectedTickers={selectedTickers}
                allData={allData}
                loading={loading}
              />
            )}
          </div>
        </main>
      </div>

      <footer className="py-2 px-4 border-t border-bloomberg-border bg-bloomberg-dark text-xs text-bloomberg-muted text-center">
        Created by Hugo Canseco
      </footer>
    </div>
  );
}
