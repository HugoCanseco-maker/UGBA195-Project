"use client";

import { PriceRow } from "@/types";
import { PriceChart } from "./charts/PriceChart";
import { VolumeChart } from "./charts/VolumeChart";
import { MovingAveragesChart } from "./charts/MovingAveragesChart";
import { RSIChart } from "./charts/RSIChart";
import { ZScoreChart } from "./charts/ZScoreChart";

interface ChartGridProps {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
  loading: boolean;
  chartsGenerated: boolean;
}

export function ChartGrid({ selectedTickers, tickerData, loading, chartsGenerated }: ChartGridProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-bloomberg-muted text-sm">
        Loading data from data/*.csv...
      </div>
    );
  }

  if (selectedTickers.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-bloomberg-muted text-sm">
        Select 1–5 tickers from the watchlist, then click Generate Charts
      </div>
    );
  }

  if (!chartsGenerated) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-bloomberg-muted text-sm gap-4">
        <p>Selected: {selectedTickers.join(", ")}</p>
        <p className="text-xs">Click &quot;Generate Charts&quot; above to view the 5 charts</p>
      </div>
    );
  }

  const chartProps = { selectedTickers, tickerData };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 h-full">
      <div className="min-h-[280px] aspect-[16/10] bg-bloomberg-panel rounded-lg border border-bloomberg-border p-3 overflow-hidden">
        <h3 className="text-xs font-mono text-bloomberg-amber mb-2">Price (OHLC)</h3>
        <div className="h-[calc(100%-24px)] min-h-[200px]">
          <PriceChart {...chartProps} compact />
        </div>
      </div>
      <div className="min-h-[280px] aspect-[16/10] bg-bloomberg-panel rounded-lg border border-bloomberg-border p-3 overflow-hidden">
        <h3 className="text-xs font-mono text-bloomberg-amber mb-2">Volume</h3>
        <div className="h-[calc(100%-24px)] min-h-[200px]">
          <VolumeChart {...chartProps} compact />
        </div>
      </div>
      <div className="min-h-[280px] aspect-[16/10] bg-bloomberg-panel rounded-lg border border-bloomberg-border p-3 overflow-hidden">
        <h3 className="text-xs font-mono text-bloomberg-amber mb-2">Moving Averages (50/200)</h3>
        <div className="h-[calc(100%-24px)] min-h-[200px]">
          <MovingAveragesChart {...chartProps} compact />
        </div>
      </div>
      <div className="min-h-[280px] aspect-[16/10] bg-bloomberg-panel rounded-lg border border-bloomberg-border p-3 overflow-hidden">
        <h3 className="text-xs font-mono text-bloomberg-amber mb-2">RSI (Momentum)</h3>
        <div className="h-[calc(100%-24px)] min-h-[200px]">
          <RSIChart {...chartProps} compact />
        </div>
      </div>
      <div className="min-h-[280px] aspect-[16/10] bg-bloomberg-panel rounded-lg border border-bloomberg-border p-3 overflow-hidden">
        <h3 className="text-xs font-mono text-bloomberg-amber mb-2">Z-Score (Mean Reversion)</h3>
        <div className="h-[calc(100%-24px)] min-h-[200px]">
          <ZScoreChart {...chartProps} compact />
        </div>
      </div>
    </div>
  );
}
