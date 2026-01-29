import { PriceRow } from "@/types";

const TRADING_DAYS = 252;

/**
 * Load ticker-specific CSV from /api/ticker/[ticker].
 * Data comes from data/AAPL.csv, data/GOOGL.csv, etc. (50+ individual files).
 * Returns last 252 trading days.
 */
export async function getTickerData(ticker: string): Promise<PriceRow[]> {
  if (!ticker) return [];

  try {
    const res = await fetch(`/api/ticker/${encodeURIComponent(ticker)}`);
    const json = await res.json();

    if (!res.ok) {
      console.error(json.error || "Failed to fetch");
      return [];
    }

    const raw = (json.data || []) as unknown[];
    const rows: PriceRow[] = raw
      .filter((r): r is PriceRow => isPriceRow(r))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return rows.slice(-TRADING_DAYS);
  } catch (error) {
    console.error("Failed to load CSV:", error);
    return [];
  }
}

function isPriceRow(r: unknown): r is PriceRow {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.ticker === "string" &&
    typeof o.date === "string" &&
    typeof o.close === "number" &&
    !isNaN(o.close)
  );
}
