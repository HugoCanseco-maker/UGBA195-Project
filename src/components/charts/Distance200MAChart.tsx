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

export function Distance200MAChart({ selectedTickers, allData }: Props) {
  const tickers = selectedTickers.slice(0, 5);
  if (tickers.length === 0) return null;

  const colors = ["#00aaff", "#00ff88", "#ffaa00", "#ff4444", "#aa44ff"];

  const dataByTicker = tickers.map((t) => {
    const rows = getTickerData(allData, t);
    const ma200 = computeMA(rows, 200);
    const dist = rows.map((r, i) =>
      isNaN(ma200[i]) || ma200[i] === 0 ? undefined : ((r.close - ma200[i]) / ma200[i]) * 100
    );
    return { ticker: t, rows, dist };
  });

  const dates = dataByTicker[0]?.rows.map((r) => r.date) ?? [];
  const data = dates.map((date, i) => {
    const obj: Record<string, string | number> = { date };
    dataByTicker.forEach(({ ticker, dist }) => {
      if (dist[i] !== undefined) obj[ticker] = dist[i];
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
            formatter={(v: number) => [v?.toFixed(2) + "%", "Dist"]}
          />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="1 1" />
          <ReferenceLine y={20} stroke="#ff4444" strokeDasharray="3 3" />
          <ReferenceLine y={-20} stroke="#00ff88" strokeDasharray="3 3" />
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
        % distance from 200-day MA • +20% overbought, -20% oversold
      </p>
    </div>
  );
}
