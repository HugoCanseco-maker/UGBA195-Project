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

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
}

function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  return allData
    .filter((r) => r.ticker === ticker)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function VolumeChart({ selectedTickers, allData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const data = rows.slice(-126).map((r) => ({
    date: r.date,
    volume: r.volume,
    fill: r.close >= r.open ? "#00ff8833" : "#ff444433",
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333" }}
            formatter={(v: number) => [(v / 1e6).toFixed(2) + "M", "Volume"]}
          />
          <Bar dataKey="volume" fill="#00aaff" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Volume • {ticker} • Last 126 days
      </p>
    </div>
  );
}
