import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { PriceRow } from "@/types";

const TRADING_DAYS = 252;

/** Map ticker to filename (BRK-B -> BRK_B) */
function tickerToFilename(ticker: string): string {
  return ticker.replace(/-/g, "_") + ".csv";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  if (!ticker) {
    return NextResponse.json({ error: "Ticker required" }, { status: 400 });
  }

  try {
    const filename = tickerToFilename(ticker);
    const dataPath = path.join(process.cwd(), "data", filename);

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: `Data not found for ${ticker}. Run: python scripts/download_data.py` },
        { status: 404 }
      );
    }

    const text = fs.readFileSync(dataPath, "utf-8");
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const rows: PriceRow[] = parsed.data
      .map((r) => normalizeRow(r))
      .filter((r): r is PriceRow => r != null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const last252 = rows.slice(-TRADING_DAYS);
    return NextResponse.json({ data: last252 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to read data" },
      { status: 500 }
    );
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
