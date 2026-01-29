"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { PriceRow } from "@/types";
import { computeMACD } from "@/lib/data";

interface Props {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
}

export function MACDChart({ selectedTickers, tickerData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = tickerData[ticker] ?? [];
  const { macd, signal, histogram } = computeMACD(rows, 12, 26, 9);

  const data = rows.map((r, i) => ({
    date: r.date,
    macd: isNaN(macd[i]) ? undefined : macd[i],
    signal: isNaN(signal[i]) ? undefined : signal[i],
    histogram: isNaN(histogram[i]) ? undefined : histogram[i],
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333" }} />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="1 1" />
          <Bar dataKey="histogram" fill="#00aaff" radius={[2, 2, 0, 0]} />
          <Line type="monotone" dataKey="macd" stroke="#00ff88" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="signal" stroke="#ffaa00" strokeWidth={1} strokeDasharray="3 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        MACD (12, 26, 9) • {ticker}
      </p>
    </div>
  );
}
