"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceRow } from "@/types";

interface Props {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
  compact?: boolean;
}

export function PriceChart({ selectedTickers, tickerData, compact }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = tickerData[ticker] ?? [];
  const data = rows.map((r) => ({
    date: r.date,
    open: r.open,
    high: r.high,
    low: r.low,
    close: r.close,
  }));

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-bloomberg-muted text-xs">
        No data for {ticker}
      </div>
    );
  }

  const chartData = data.slice(-252);

  return (
    <div className={compact ? "h-full min-h-[180px]" : "h-[400px] w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#333" />
          <XAxis
            dataKey="date"
            stroke="#666"
            tick={{ fontSize: compact ? 8 : 10 }}
            tickFormatter={(v) => (v ? String(v).slice(5) : "")}
          />
          <YAxis stroke="#666" tick={{ fontSize: compact ? 8 : 10 }} domain={["auto", "auto"]} width={compact ? 36 : 50} />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333", fontSize: 11 }}
            labelStyle={{ color: "#ffaa00" }}
            formatter={(v: number) => [v?.toFixed(2), "Close"]}
            labelFormatter={(v) => v}
          />
          <Line type="monotone" dataKey="close" stroke="#00aaff" strokeWidth={compact ? 1.5 : 2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
