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

function computeBeta(stockReturns: number[], marketReturns: number[]): number {
  const n = Math.min(stockReturns.length, marketReturns.length);
  if (n < 2) return 0;
  const s = stockReturns.slice(-n);
  const m = marketReturns.slice(-n);
  const sm = s.reduce((a, b) => a + b, 0) / n;
  const mm = m.reduce((a, b) => a + b, 0) / n;
  let cov = 0, varM = 0;
  for (let i = 0; i < n; i++) {
    cov += (s[i] - sm) * (m[i] - mm);
    varM += (m[i] - mm) ** 2;
  }
  return varM === 0 ? 0 : cov / varM;
}

export function BetaChart({ selectedTickers, tickerData }: Props) {
  const betas = useMemo(() => {
    const spyRows = tickerData["SPY"] ?? [];
    const marketReturns = computeReturns(spyRows);
    if (marketReturns.length < 2) return [];

    return selectedTickers
      .filter((t) => t !== "SPY")
      .slice(0, 10)
      .map((ticker) => {
        const rows = tickerData[ticker] ?? [];
        const stockReturns = computeReturns(rows);
        const beta = computeBeta(stockReturns, marketReturns);
        return { ticker, beta };
      });
  }, [selectedTickers, tickerData]);

  if (betas.length === 0) return null;

  const maxBeta = Math.max(...betas.map((b) => Math.abs(b.beta)), 1);
  const barWidth = 120;

  return (
    <div className="w-full">
      <div className="space-y-3">
        {betas.map(({ ticker, beta }) => {
          const pct = (beta / (maxBeta * 1.2)) * 50 + 50;
          const color = beta >= 1 ? "#ff4444" : beta >= 0 ? "#00aaff" : "#00ff88";
          return (
            <div key={ticker} className="flex items-center gap-4">
              <span className="text-sm font-mono text-bloomberg-amber w-16">{ticker}</span>
              <div className="flex-1 h-6 bg-bloomberg-panel rounded overflow-hidden relative">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${Math.min(100, Math.abs(beta) * 50)}%`,
                    backgroundColor: color,
                    marginLeft: beta < 0 ? "auto" : 0,
                  }}
                />
              </div>
              <span className="text-sm font-mono w-16 text-right">{beta.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-bloomberg-muted mt-4">
        Beta vs SPY (252-day) • β=1 moves with market; β&gt;1 more volatile
      </p>
    </div>
  );
}
