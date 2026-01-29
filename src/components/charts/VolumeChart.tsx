"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceRow } from "@/types";
import { getTickerData } from "@/lib/chartUtils";

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
  compact?: boolean;
}

export function VolumeChart({ selectedTickers, allData, compact }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const data = rows.map((r) => ({
    date: r.date,
    volume: r.volume,
    fill: r.close >= r.open ? "#00ff8833" : "#ff444433",
  }));

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-bloomberg-muted text-xs">
        No data for {ticker}
      </div>
    );
  }

  return (
    <div className={compact ? "h-full min-h-[180px]" : "h-[400px] w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#333" />
          <XAxis
            dataKey="date"
            stroke="#666"
            tick={{ fontSize: compact ? 8 : 10 }}
            tickFormatter={(v) => (v ? String(v).slice(5) : "")}
          />
          <YAxis
            stroke="#666"
            tick={{ fontSize: compact ? 8 : 10 }}
            width={compact ? 36 : 50}
            tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
          />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333", fontSize: 11 }}
            formatter={(v: number) => [(v / 1e6).toFixed(2) + "M", "Volume"]}
          />
          <Bar dataKey="volume" fill="#00aaff" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
