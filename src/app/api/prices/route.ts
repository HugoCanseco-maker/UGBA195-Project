import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickerParam = searchParams.get("ticker");
  const tickersParam = searchParams.get("tickers");
  const tickersFilter = tickersParam
    ? tickersParam.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean)
    : tickerParam
      ? [tickerParam.toUpperCase()]
      : null;

  try {
    const dataPath = path.join(process.cwd(), "data", "prices.csv");
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: "Data not found. Run: python scripts/download_data.py" },
        { status: 404 }
      );
    }

    const text = fs.readFileSync(dataPath, "utf-8");
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows: Record<string, string | number>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const row: Record<string, string | number> = {};
      headers.forEach((h, j) => {
        const v = values[j]?.trim() ?? "";
        row[h] = ["open", "high", "low", "close", "volume"].includes(h)
          ? parseFloat(v) || 0
          : v;
      });
      const rowTicker = String(row.ticker ?? "").toUpperCase();
      if (!tickersFilter || tickersFilter.includes(rowTicker)) {
        rows.push(row);
      }
    }

    return NextResponse.json({ data: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to read data" },
      { status: 500 }
    );
  }
}
