"use client";

import { useState } from "react";
import { PriceRow } from "@/types";
import { IndicatorTab } from "@/types";
import { IndicatorCharts } from "./charts/IndicatorCharts";
import { InfoBox } from "./InfoBox";
import clsx from "clsx";

const TABS: { id: IndicatorTab; label: string }[] = [
  { id: "price", label: "Price" },
  { id: "volume", label: "Volume" },
  { id: "moving-averages", label: "MA 50/200" },
  { id: "rsi", label: "RSI" },
  { id: "zscore", label: "Z-Score" },
  { id: "volatility", label: "Volatility" },
  { id: "bollinger", label: "Bollinger" },
  { id: "macd", label: "MACD" },
  { id: "correlation", label: "Correlation" },
  { id: "relative-strength", label: "vs SPY" },
  { id: "drawdown", label: "Drawdown" },
  { id: "beta", label: "Beta" },
  { id: "cumulative-return", label: "Cum Return" },
  { id: "distance-200ma", label: "Dist 200MA" },
  { id: "volume-spikes", label: "Vol Spikes" },
];

interface ChartPanelProps {
  selectedTickers: string[];
  allData: PriceRow[];
}

export function ChartPanel({ selectedTickers, allData }: ChartPanelProps) {
  const [activeTab, setActiveTab] = useState<IndicatorTab>("price");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-bloomberg-border bg-bloomberg-dark px-2 gap-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-3 py-2 text-xs font-mono whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-bloomberg-amber/20 text-bloomberg-amber border-b-2 border-bloomberg-amber"
                : "text-bloomberg-muted hover:text-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 min-w-0 p-4 overflow-auto">
          {selectedTickers.length === 0 ? (
            <div className="h-full flex items-center justify-center text-bloomberg-muted text-sm">
              Select 1–5 tickers from the watchlist to view charts
            </div>
          ) : (
            <IndicatorCharts
              tab={activeTab}
              selectedTickers={selectedTickers}
              allData={allData}
            />
          )}
        </div>
        <InfoBox activeTab={activeTab} />
      </div>
    </div>
  );
}
