"use client";

import { PriceRow } from "@/types";
import { PriceChart } from "./charts/PriceChart";
import { VolumeChart } from "./charts/VolumeChart";
import { MovingAveragesChart } from "./charts/MovingAveragesChart";
import { RSIChart } from "./charts/RSIChart";
import { ZScoreChart } from "./charts/ZScoreChart";

const CHART_CONFIG: { id: string; label: string; component: React.ComponentType<any> }[] = [
  { id: "price", label: "Price (OHLC)", component: PriceChart },
  { id: "volume", label: "Volume", component: VolumeChart },
  { id: "moving-averages", label: "Moving Averages (50/200)", component: MovingAveragesChart },
  { id: "rsi", label: "RSI (Momentum)", component: RSIChart },
  { id: "zscore", label: "Z-Score (Mean Reversion)", component: ZScoreChart },
];

interface ChartGridProps {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
  loading: boolean;
  visibleCharts: string[];
}

export function ChartGrid({ selectedTickers, tickerData, loading, visibleCharts }: ChartGridProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-bloomberg-muted text-sm">
        Loading data from public/data/*.csv...
      </div>
    );
  }

  if (selectedTickers.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-bloomberg-muted text-sm">
        Select a ticker from the watchlist, then click Generate Dashboard
      </div>
    );
  }

  if (visibleCharts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-bloomberg-muted text-sm gap-4">
        <p>Selected: {selectedTickers.join(", ")}</p>
        <p className="text-xs">Click &quot;Generate Dashboard&quot; above to view charts</p>
      </div>
    );
  }

  const chartProps = { selectedTickers, tickerData, compact: true };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 h-full">
      {CHART_CONFIG.map(({ id, label, component: ChartComponent }) =>
        visibleCharts.includes(id) ? (
          <div
            key={id}
            className="min-h-[280px] aspect-[16/10] bg-bloomberg-panel rounded-lg border border-bloomberg-border p-3 overflow-hidden"
          >
            <h3 className="text-xs font-mono text-bloomberg-amber mb-2">{label}</h3>
            <div className="h-[calc(100%-24px)] min-h-[200px]">
              <ChartComponent {...chartProps} compact />
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
