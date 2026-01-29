"use client";

import { useState, useEffect } from "react";
import { Watchlist } from "@/components/Watchlist";
import { StatsCards } from "@/components/StatsCards";
import { ChartPanel } from "@/components/ChartPanel";
import { InfoBox } from "@/components/InfoBox";
import { PriceRow } from "@/types";

export default function Dashboard() {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [allData, setAllData] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((res) => {
        setAllData(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectTicker = (ticker: string) => {
    setSelectedTickers((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      if (prev.length >= 5) return prev;
      return [...prev, ticker];
    });
  };

  return (
    <div className="min-h-screen bg-bloomberg-black text-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-bloomberg-border bg-bloomberg-dark flex-shrink-0 flex flex-col">
        <header className="p-4 border-b border-bloomberg-border">
          <h1 className="text-lg font-semibold text-bloomberg-amber">
            Hugo&apos;s Market
          </h1>
          <p className="text-xs text-bloomberg-muted mt-0.5">
            Bloomberg-Style Visualizer
          </p>
          <p className="text-xs text-bloomberg-muted">by Hugo Canseco</p>
        </header>
        <Watchlist
          selectedTickers={selectedTickers}
          onSelect={handleSelectTicker}
          loading={loading}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-bloomberg-border bg-bloomberg-dark">
          <StatsCards
            selectedTickers={selectedTickers}
            allData={allData}
          />
        </div>

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 min-w-0 flex flex-col">
            <ChartPanel
              selectedTickers={selectedTickers}
              allData={allData}
            />
          </div>
          <aside className="w-72 border-l border-bloomberg-border bg-bloomberg-dark flex-shrink-0 overflow-auto">
            <InfoBox />
          </aside>
        </div>
      </main>
    </div>
  );
}
