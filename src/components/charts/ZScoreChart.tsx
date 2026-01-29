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
import { getTickerData } from "@/lib/chartUtils";
import { computeZScore } from "@/lib/data";

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
  compact?: boolean;
}

export function ZScoreChart({ selectedTickers, allData, compact }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const zscore = computeZScore(rows, 20);

  const data = rows.map((r, i) => ({
    date: r.date,
    zscore: isNaN(zscore[i]) ? undefined : zscore[i],
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
          <YAxis stroke="#666" tick={{ fontSize: compact ? 8 : 10 }} width={compact ? 28 : 40} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333", fontSize: 11 }} />
          <ReferenceLine y={2} stroke="#ff4444" strokeDasharray="2 2" />
          <ReferenceLine y={-2} stroke="#00ff88" strokeDasharray="2 2" />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="1 1" />
          <Line type="monotone" dataKey="zscore" stroke="#00aaff" strokeWidth={compact ? 1.5 : 2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
