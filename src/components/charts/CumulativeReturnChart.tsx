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
  ReferenceLine,
} from "recharts";
import { PriceRow } from "@/types";

interface Props {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
}

function computeCumulativeReturn(rows: PriceRow[]): number[] {
  const result: number[] = [];
  const start = rows[0]?.close ?? 1;
  for (let i = 0; i < rows.length; i++) {
    result.push(((rows[i].close - start) / start) * 100);
  }
  return result;
}

export function CumulativeReturnChart({ selectedTickers, tickerData }: Props) {
  const tickers = selectedTickers.slice(0, 5);
  if (tickers.length === 0) return null;

  const colors = ["#00aaff", "#00ff88", "#ffaa00", "#ff4444", "#aa44ff"];

  const dataByTicker = tickers.map((t) => ({
    ticker: t,
    rows: tickerData[t] ?? [],
  }));

  const dates = dataByTicker[0]?.rows.map((r) => r.date) ?? [];
  const data = dates.map((date, i) => {
    const obj: Record<string, string | number> = { date };
    dataByTicker.forEach(({ ticker, rows }) => {
      const cum = computeCumulativeReturn(rows);
      if (cum[i] !== undefined) obj[ticker] = cum[i];
    });
    return obj;
  });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333" }}
            formatter={(v: number) => [v?.toFixed(2) + "%", "Cum Return"]}
          />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="1 1" />
          <Legend />
          {tickers.map((t, i) => (
            <Line
              key={t}
              type="monotone"
              dataKey={t}
              stroke={colors[i % 5]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Cumulative return from period start • vs benchmark
      </p>
    </div>
  );
}
