import * as Papa from "papaparse";
import { PriceRow } from "@/types";

const TRADING_DAYS = 252;

/** Map ticker to filename - case-sensitive for Vercel (AAPL.csv not Aapl.csv) */
function tickerToFilename(ticker: string): string {
  return ticker.replace(/-/g, "_") + ".csv";
}

/**
 * Load ticker-specific CSV client-side from public/data/.
 * Uses window.location.origin for absolute URL (Vercel-friendly).
 * Returns last 252 trading days.
 */
export async function getTickerData(ticker: string): Promise<PriceRow[]> {
  if (!ticker) return [];

  try {
    const filename = tickerToFilename(ticker);
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${baseUrl}/data/${filename}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Failed to fetch ${url}`);
      return [];
    }

    const csvText = await res.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    }) as Papa.ParseResult<any>;

    const raw = (parsed.data ?? []) as Record<string, unknown>[];
    const rows: PriceRow[] = raw
      .map((r) => normalizeRow(r))
      .filter((r): r is PriceRow => r != null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return rows.slice(-TRADING_DAYS);
  } catch (error) {
    console.error("Failed to load CSV:", error);
    return [];
  }
}

function normalizeRow(r: Record<string, unknown>): PriceRow | null {
  const ticker = String(r.ticker ?? "").trim();
  const date = String(r.date ?? "").trim();
  const open = toNumber(r.open);
  const high = toNumber(r.high);
  const low = toNumber(r.low);
  const close = toNumber(r.close);
  const volume = toNumber(r.volume);
  if (!ticker || !date || isNaN(close)) return null;
  return { ticker, date, open, high, low, close, volume };
}

function toNumber(v: unknown): number {
  if (typeof v === "number" && !isNaN(v)) return v;
  const n = parseFloat(String(v ?? ""));
  return isNaN(n) ? 0 : n;
}
