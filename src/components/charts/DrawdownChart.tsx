"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { PriceRow } from "@/types";

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
}

function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  return allData
    .filter((r) => r.ticker === ticker)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function computeDrawdown(rows: PriceRow[]): number[] {
  const result: number[] = [];
  let peak = rows[0]?.close ?? 0;
  for (let i = 0; i < rows.length; i++) {
    const close = rows[i].close;
    if (close > peak) peak = close;
    result.push(peak > 0 ? ((close - peak) / peak) * 100 : 0);
  }
  return result;
}

export function DrawdownChart({ selectedTickers, allData }: Props) {
  const tickers = selectedTickers.slice(0, 5);
  if (tickers.length === 0) return null;

  const colors = ["#ff4444", "#ffaa00", "#00aaff", "#00ff88", "#aa44ff"];

  const dataByTicker = tickers.map((t) => ({
    ticker: t,
    rows: getTickerData(allData, t),
  }));

  const dates = dataByTicker[0]?.rows.map((r) => r.date) ?? [];
  const data = dates.map((date, i) => {
    const obj: Record<string, string | number> = { date };
    dataByTicker.forEach(({ ticker, rows }) => {
      const dd = computeDrawdown(rows);
      if (dd[i] !== undefined) obj[ticker] = dd[i];
    });
    return obj;
  });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} domain={["auto", 0]} />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333" }}
            formatter={(v: number) => [v?.toFixed(2) + "%", "Drawdown"]}
          />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="1 1" />
          {tickers.map((t, i) => (
            <Area
              key={t}
              type="monotone"
              dataKey={t}
              stroke={colors[i % 5]}
              fill={colors[i % 5] + "33"}
              strokeWidth={1.5}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Drawdown from peak • % below prior high
      </p>
    </div>
  );
}
