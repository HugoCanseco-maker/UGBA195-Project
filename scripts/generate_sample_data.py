#!/usr/bin/env python3
"""
Generate sample OHLCV data when yfinance download fails (e.g. offline).
Creates individual CSV files in public/data/ for client-side fetch.
Run: python scripts/generate_sample_data.py
"""

import os
import random
from datetime import datetime, timedelta

TICKERS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "AMD", "MU", "PLTR",
    "HOOD", "COIN", "JPM", "GS", "JNJ", "WMT", "PG", "V", "MA", "AXP",
    "XOM", "CVX", "BRK-B", "UNH", "PFE", "ABBV", "MRK", "BA", "LMT", "CAT",
    "MMM", "GE", "CSCO", "INTC", "IBM", "ORCL", "SNOW", "CRM", "DIS", "NFLX",
    "PYPL", "ADBE", "AVGO", "QCOM", "TXN", "AMAT", "LRCX", "KLAC", "NOW", "SPY",
]

# Approximate starting prices (Jan 2020)
BASE_PRICES = {
    "AAPL": 75, "MSFT": 160, "GOOGL": 1400, "AMZN": 1900, "NVDA": 230, "META": 210,
    "TSLA": 90, "AMD": 50, "MU": 55, "PLTR": 10, "HOOD": 0, "COIN": 0, "JPM": 140,
    "GS": 230, "JNJ": 145, "WMT": 120, "PG": 125, "V": 190, "MA": 290, "AXP": 130,
    "XOM": 70, "CVX": 115, "BRK-B": 220, "UNH": 290, "PFE": 40, "ABBV": 95,
    "MRK": 90, "BA": 330, "LMT": 400, "CAT": 145, "MMM": 180, "GE": 12,
    "CSCO": 48, "INTC": 60, "IBM": 135, "ORCL": 55, "SNOW": 0, "CRM": 170,
    "DIS": 145, "NFLX": 340, "PYPL": 110, "ADBE": 330, "AVGO": 320, "QCOM": 90,
    "TXN": 125, "AMAT": 60, "LRCX": 280, "KLAC": 180, "NOW": 320, "SPY": 325,
}


def generate_ticker_data(ticker: str, start: datetime, days: int) -> list[dict]:
    rows = []
    base = BASE_PRICES.get(ticker, 100)
    if base == 0:
        base = 50  # IPO later
    price = base
    vol_base = 10_000_000 if ticker != "SPY" else 50_000_000

    for i in range(days):
        d = start + timedelta(days=i)
        if d.weekday() >= 5:
            continue
        ret = random.gauss(0.0003, 0.015)
        prev = price
        price = max(price * (1 + ret), 1)
        o, c = prev, price
        h = max(o, c) * (1 + abs(random.gauss(0, 0.005)))
        l = min(o, c) * (1 - abs(random.gauss(0, 0.005)))
        vol = int(vol_base * (1 + random.gauss(0, 0.3)))
        vol = max(vol, 100000)
        rows.append({
            "ticker": ticker,
            "date": d.strftime("%Y-%m-%d"),
            "open": round(o, 2),
            "high": round(h, 2),
            "low": round(l, 2),
            "close": round(c, 2),
            "volume": vol,
        })
    return rows


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    # Write to public/data/ for client-side fetch(/data/AAPL.csv)
    data_dir = os.path.join(project_root, "public", "data")
    os.makedirs(data_dir, exist_ok=True)

    start = datetime(2020, 1, 1)
    days = (datetime(2026, 1, 28) - start).days
    random.seed(42)

    for ticker in TICKERS:
        rows = generate_ticker_data(ticker, start, days)
        filename = ticker.replace("-", "_") + ".csv"
        out = os.path.join(data_dir, filename)
        with open(out, "w") as f:
            f.write("ticker,date,open,high,low,close,volume\n")
            for r in rows:
                f.write(f"{r['ticker']},{r['date']},{r['open']},{r['high']},{r['low']},{r['close']},{r['volume']}\n")
        print(f"  ✓ {ticker} -> public/data/{filename} ({len(rows)} rows)")

    print(f"\nGenerated {len(TICKERS)} ticker CSVs in public/data/")


if __name__ == "__main__":
    main()
