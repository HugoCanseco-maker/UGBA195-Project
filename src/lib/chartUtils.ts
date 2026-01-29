import { PriceRow } from "@/types";

const TRADING_DAYS = 252;

export function getTickerData(allData: PriceRow[], ticker: string): PriceRow[] {
  const normalized = allData
    .filter((r) => String(r.ticker || "").toUpperCase() === ticker.toUpperCase())
    .map(normalizeRow)
    .filter((r): r is PriceRow => r != null)
    .sort((a, b) => a.date.localeCompare(b.date));
  return normalized.slice(-TRADING_DAYS);
}

function normalizeRow(r: Record<string, unknown>): PriceRow | null {
  const ticker = String(r.ticker ?? "");
  const date = String(r.date ?? "");
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
