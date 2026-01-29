#!/usr/bin/env python3
"""
Download historical OHLCV data for ~50 tickers using yfinance.
Saves data to data/ folder as one consolidated CSV (data/prices.csv).
Run: python scripts/download_data.py
"""

import os
import pandas as pd
import yfinance as yf
from datetime import datetime

# Top ~50 tickers - realistic market coverage
TICKERS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "AMD", "MU", "PLTR",
    "HOOD", "COIN", "JPM", "GS", "JNJ", "WMT", "PG", "V", "MA", "AXP",
    "XOM", "CVX", "BRK-B", "UNH", "PFE", "ABBV", "MRK", "BA", "LMT", "CAT",
    "MMM", "GE", "CSCO", "INTC", "IBM", "ORCL", "SNOW", "CRM", "DIS", "NFLX",
    "PYPL", "ADBE", "AVGO", "QCOM", "TXN", "AMAT", "LRCX", "KLAC", "NOW", "SPY",
]

# Date range: 2020 to Jan 2026
START_DATE = "2020-01-01"
END_DATE = "2026-01-28"


def download_data():
    """Download OHLCV data for all tickers and save to CSV."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, "data")
    os.makedirs(data_dir, exist_ok=True)

    print(f"Downloading data for {len(TICKERS)} tickers...")
    print(f"Period: {START_DATE} to {END_DATE}")

    all_data = []

    for ticker in TICKERS:
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(start=START_DATE, end=END_DATE)

            if df.empty or len(df) < 10:
                print(f"  ⚠ {ticker}: insufficient data, skipping")
                continue

            df = df.reset_index()
            df["ticker"] = ticker
            df = df.rename(columns={
                "Date": "date",
                "Open": "open",
                "High": "high",
                "Low": "low",
                "Close": "close",
                "Volume": "volume",
            })
            df = df[["ticker", "date", "open", "high", "low", "close", "volume"]]
            df["date"] = df["date"].dt.strftime("%Y-%m-%d")

            all_data.append(df)
            print(f"  ✓ {ticker}: {len(df)} rows")

        except Exception as e:
            print(f"  ✗ {ticker}: {e}")

    if not all_data:
        print("No data downloaded. Exiting.")
        return

    combined = pd.concat(all_data, ignore_index=True)
    output_path = os.path.join(data_dir, "prices.csv")
    combined.to_csv(output_path, index=False)
    print(f"\nSaved {len(combined)} rows to {output_path}")

    # Also save individual CSVs per ticker for flexibility
    for ticker in TICKERS:
        ticker_df = combined[combined["ticker"] == ticker]
        if not ticker_df.empty:
            ticker_path = os.path.join(data_dir, f"{ticker.replace('-', '_')}.csv")
            ticker_df.to_csv(ticker_path, index=False)


if __name__ == "__main__":
    download_data()
