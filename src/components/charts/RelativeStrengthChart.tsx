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

interface Props {
  selectedTickers: string[];
  allData: PriceRow[];
}

function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  return allData
    .filter((r) => r.ticker === ticker)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function RelativeStrengthChart({ selectedTickers, allData }: Props) {
  const spyRows = getTickerData(allData, "SPY");
  const tickers = selectedTickers.filter((t) => t !== "SPY").slice(0, 5);
  if (spyRows.length === 0 || tickers.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-bloomberg-muted text-sm">
        {spyRows.length === 0
          ? "SPY data required for relative strength. Add SPY to data."
          : "Select at least one non-SPY ticker for relative strength vs SPY."}
      </div>
    );
  }

  const dataByDate = new Map<string, number>();
  spyRows.forEach((r) => dataByDate.set(r.date, r.close));

  const series: Record<string, number[]> = {};

  tickers.forEach((ticker) => {
    const rows = getTickerData(allData, ticker);
    const ratios: { date: string; value: number }[] = [];
    rows.forEach((r) => {
      const spy = dataByDate.get(r.date);
      if (spy && spy > 0) {
        ratios.push({ date: r.date, value: (r.close / spy) * 100 });
      }
    });
    series[ticker] = ratios.map((x) => x.value);
  });

  const dates = tickers.length > 0
    ? getTickerData(allData, tickers[0])
        .filter((r) => dataByDate.has(r.date))
        .map((r) => r.date)
    : [];

  const data = dates.map((date, i) => {
    const obj: Record<string, string | number> = { date };
    tickers.forEach((t) => {
      const rows = getTickerData(allData, t);
      const r = rows.find((x) => x.date === date);
      const spy = dataByDate.get(date);
      if (r && spy && spy > 0) obj[t] = (r.close / spy) * 100;
    });
    return obj;
  });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-252)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
          <Tooltip contentStyle={{ background: "#242424", border: "1px solid #333" }} />
          <Legend />
          {tickers.map((t, i) => (
            <Line
              key={t}
              type="monotone"
              dataKey={t}
              stroke={["#00aaff", "#00ff88", "#ffaa00", "#ff4444", "#aa44ff"][i % 5]}
              strokeWidth={1.5}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Relative strength vs SPY (ratio × 100) • Rising = outperforming
      </p>
    </div>
  );
}
