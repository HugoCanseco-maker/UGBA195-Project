"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PriceRow } from "@/types";
import { computeMA } from "@/lib/data";

interface Props {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
  compact?: boolean;
}

export function MovingAveragesChart({ selectedTickers, tickerData, compact }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = tickerData[ticker] ?? [];
  const ma50 = computeMA(rows, 50);
  const ma200 = computeMA(rows, 200);

  const data = rows.map((r, i) => ({
    date: r.date,
    close: r.close,
    ma50: isNaN(ma50[i]) ? undefined : ma50[i],
    ma200: isNaN(ma200[i]) ? undefined : ma200[i],
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
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#333" />
          <XAxis
            dataKey="date"
            stroke="#666"
            tick={{ fontSize: compact ? 8 : 10 }}
            tickFormatter={(v) => (v ? String(v).slice(5) : "")}
          />
          <YAxis stroke="#666" tick={{ fontSize: compact ? 8 : 10 }} width={compact ? 36 : 50} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333", fontSize: 11 }} />
          {!compact && <Legend />}
          <Line type="monotone" dataKey="close" stroke="#00aaff" strokeWidth={1} dot={false} name="Close" />
          <Line type="monotone" dataKey="ma50" stroke="#ffaa00" strokeWidth={1} dot={false} name="MA 50" />
          <Line type="monotone" dataKey="ma200" stroke="#00ff88" strokeWidth={1} dot={false} name="MA 200" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
