"use client";

import { PriceRow } from "@/types";
import { useMemo } from "react";

interface Props {
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
}

function computeReturns(rows: PriceRow[]): number[] {
  const ret: number[] = [];
  for (let i = 1; i < rows.length; i++) {
    ret.push((rows[i].close - rows[i - 1].close) / rows[i - 1].close);
  }
  return ret;
}

function correlation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const a2 = a.slice(-n);
  const b2 = b.slice(-n);
  const ma = a2.reduce((s, x) => s + x, 0) / n;
  const mb = b2.reduce((s, x) => s + x, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    num += (a2[i] - ma) * (b2[i] - mb);
    da += (a2[i] - ma) ** 2;
    db += (b2[i] - mb) ** 2;
  }
  const den = Math.sqrt(da * db);
  return den === 0 ? 0 : num / den;
}

export function CorrelationChart({ selectedTickers, tickerData }: Props) {
  const { matrix, tickers } = useMemo(() => {
    const t = selectedTickers.slice(0, 8);
    const returns = t.map((ticker) => {
      const rows = tickerData[ticker] ?? [];
      return computeReturns(rows);
    });
    const matrix: number[][] = [];
    for (let i = 0; i < t.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < t.length; j++) {
        row.push(correlation(returns[i], returns[j]));
      }
      matrix.push(row);
    }
    return { matrix, tickers: t };
  }, [selectedTickers, tickerData]);

  if (tickers.length === 0) return null;

  const cellSize = 44;

  return (
    <div className="w-full overflow-auto">
      <div className="inline-block p-4 bg-bloomberg-panel rounded border border-bloomberg-border">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-xs text-bloomberg-muted font-normal" />
              {tickers.map((t) => (
                <th key={t} className="p-1 text-xs text-bloomberg-muted font-mono w-11 text-center">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="p-1 text-xs text-bloomberg-muted font-mono pr-2">
                  {tickers[i]}
                </td>
                {row.map((val, j) => {
                  const v = Math.max(-1, Math.min(1, val));
                  const pct = ((v + 1) / 2) * 100;
                  const r = Math.round(255 * (1 - pct / 100));
                  const g = Math.round(80 + (175 * pct) / 100);
                  const b = Math.round(80 + (175 * pct) / 100);
                  const bg = `rgb(${r}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
                  return (
                    <td
                      key={j}
                      className="text-xs font-mono text-center p-1"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: bg,
                        color: Math.abs(val) > 0.5 ? "#fff" : "#333",
                      }}
                    >
                      {i === j ? "1" : val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-bloomberg-muted mt-2">
        Correlation matrix • Daily returns • Top {tickers.length} selected
      </p>
    </div>
  );
}
