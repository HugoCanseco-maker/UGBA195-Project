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
import { computeZScore } from "@/lib/data";

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
}

function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  return allData
    .filter((r) => r.ticker === ticker)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function ZScoreChart({ selectedTickers, allData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const zscore = computeZScore(rows, 20);

  const data = rows.map((r, i) => ({
    date: r.date,
    zscore: isNaN(zscore[i]) ? undefined : zscore[i],
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333" }} />
          <ReferenceLine y={2} stroke="#ff4444" strokeDasharray="3 3" />
          <ReferenceLine y={-2} stroke="#00ff88" strokeDasharray="3 3" />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="1 1" />
          <Line type="monotone" dataKey="zscore" stroke="#00aaff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Z-Score (20d) • {ticker} • Std devs from rolling mean
      </p>
    </div>
  );
}
