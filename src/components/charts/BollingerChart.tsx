"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { PriceRow } from "@/types";
import { computeBollinger } from "@/lib/data";

interface Props {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
}

export function BollingerChart({ selectedTickers, tickerData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = tickerData[ticker] ?? [];
  const { upper, middle, lower } = computeBollinger(rows, 20, 2);

  const data = rows.map((r, i) => ({
    date: r.date,
    close: r.close,
    upper: isNaN(upper[i]) ? undefined : upper[i],
    middle: isNaN(middle[i]) ? undefined : middle[i],
    lower: isNaN(lower[i]) ? undefined : lower[i],
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333" }} />
          <Line type="monotone" dataKey="close" stroke="#00aaff" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="middle" stroke="#ffaa00" strokeWidth={1} strokeDasharray="3 3" dot={false} />
          <Line type="monotone" dataKey="upper" stroke="#666" strokeWidth={1} dot={false} />
          <Line type="monotone" dataKey="lower" stroke="#666" strokeWidth={1} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Bollinger Bands (20, 2) • {ticker}
      </p>
    </div>
  );
}
