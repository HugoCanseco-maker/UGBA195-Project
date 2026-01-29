"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { PriceRow } from "@/types";
import { computeRSI } from "@/lib/data";

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
}

function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  return allData
    .filter((r) => r.ticker === ticker)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function RSIChart({ selectedTickers, allData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const rsi = computeRSI(rows, 14);

  const data = rows.map((r, i) => ({
    date: r.date,
    rsi: isNaN(rsi[i]) ? undefined : rsi[i],
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} domain={[0, 100]} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333" }} />
          <ReferenceLine y={70} stroke="#ff4444" strokeDasharray="3 3" />
          <ReferenceLine y={30} stroke="#00ff88" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="rsi" stroke="#00aaff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        RSI (14) • {ticker} • Overbought &gt;70, Oversold &lt;30
      </p>
    </div>
  );
}
