"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

export function PriceChart({ selectedTickers, allData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const data = rows.map((r) => ({
    date: r.date,
    open: r.open,
    high: r.high,
    low: r.low,
    close: r.close,
  }));

  const colors = ["#00ff88", "#ff4444"];
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333" }}
            labelStyle={{ color: "#ffaa00" }}
          />
          <Line type="monotone" dataKey="close" stroke="#00aaff" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        OHLC close price • {ticker} • Last 252 trading days
      </p>
    </div>
  );
}
