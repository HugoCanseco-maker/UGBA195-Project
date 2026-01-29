"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceRow } from "@/types";
import { computeStdDev } from "@/lib/data";

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
}

function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  return allData
    .filter((r) => r.ticker === ticker)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function VolatilityChart({ selectedTickers, allData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const std = computeStdDev(rows, 21);
  const annualized = std.map((s, i) =>
    isNaN(s) || !rows[i]?.close ? undefined : (s / rows[i].close) * Math.sqrt(252) * 100
  );

  const data = rows.map((r, i) => ({
    date: r.date,
    vol: annualized[i],
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333" }}
            formatter={(v: number) => [v?.toFixed(2) + "%", "Volatility"]}
          />
          <Line type="monotone" dataKey="vol" stroke="#ffaa00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Rolling 21-day volatility (annualized) • {ticker}
      </p>
    </div>
  );
}
