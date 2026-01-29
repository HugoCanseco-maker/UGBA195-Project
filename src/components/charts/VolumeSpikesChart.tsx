"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

function computeVolumeSpikes(rows: PriceRow[], period: number = 20, threshold: number = 2): { date: string; ratio: number; volume: number }[] {
  const result: { date: string; ratio: number; volume: number }[] = [];
  for (let i = period; i < rows.length; i++) {
    const vol = rows[i].volume;
    const avgVol =
      rows
        .slice(i - period, i)
        .reduce((s, r) => s + r.volume, 0) / period;
    const ratio = avgVol > 0 ? vol / avgVol : 0;
    if (ratio >= threshold) {
      result.push({ date: rows[i].date, ratio, volume: vol });
    }
  }
  return result;
}

export function VolumeSpikesChart({ selectedTickers, allData }: Props) {
  const ticker = selectedTickers[0];
  if (!ticker) return null;

  const rows = getTickerData(allData, ticker);
  const spikes = computeVolumeSpikes(rows, 20, 2);

  const data = spikes.slice(-50).map((s) => ({
    date: s.date,
    ratio: s.ratio,
    volume: s.volume,
  }));

  const volumeFormatter = (value: number, name: string, props: { payload?: { volume?: number } }) => {
    const vol = props?.payload?.volume;
    if (vol == null) {
      return [value != null ? `${value.toFixed(2)}× avg` : "0", "Ratio"];
    }
    return [`${(value ?? 0).toFixed(2)}× avg (${(vol / 1e6).toFixed(2)}M vol)`, "Ratio"];
  };

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-bloomberg-muted">
        No volume spikes (≥2× avg) in recent period for {ticker}
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(1)}×`} />
          <Tooltip
            contentStyle={{ background: "#242424", border: "1px solid #333" }}
            formatter={volumeFormatter}
          />
          <Bar dataKey="ratio" fill="#ffaa00" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-bloomberg-muted mt-2">
        Volume spikes • {ticker} • Days with volume ≥2× 20-day avg
      </p>
    </div>
  );
}
