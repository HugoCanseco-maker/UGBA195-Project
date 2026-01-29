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
  allData: PriceRow[];
}

function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  return allData
    .filter((r) => r.ticker === ticker)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function MovingAveragesChart({ selectedTickers, allData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const ma50 = computeMA(rows, 50);
  const ma200 = computeMA(rows, 200);

  const data = rows.map((r, i) => ({
    date: r.date,
    close: r.close,
    ma50: isNaN(ma50[i]) ? undefined : ma50[i],
    ma200: isNaN(ma200[i]) ? undefined : ma200[i],
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333" }} />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#00aaff" strokeWidth={1.5} dot={false} name="Close" />
          <Line type="monotone" dataKey="ma50" stroke="#ffaa00" strokeWidth={1.5} dot={false} name="MA 50" />
          <Line type="monotone" dataKey="ma200" stroke="#00ff88" strokeWidth={1.5} dot={false} name="MA 200" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Moving Averages • {ticker}
      </p>
    </div>
  );
}
