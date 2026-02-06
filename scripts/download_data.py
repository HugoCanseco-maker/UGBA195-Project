#!/usr/bin/env python3
"""
Download historical stock data for 50 tickers using yfinance.
Data range: February 6, 2025 to February 6, 2026
Saves individual CSV files to ./public/data/
"""

import os
import yfinance as yf
import pandas as pd
from datetime import datetime

# 50 tickers to download
TICKERS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'PLTR', 'MU', 'AVGO',
    'NFLX', 'AMD', 'JPM', 'V', 'MA', 'GS', 'MS', 'PYPL', 'CRM', 'ORCL',
    'ADBE', 'INTC', 'QCOM', 'AMAT', 'LRCX', 'NOW', 'PANW', 'SNOW', 'UBER', 'ABNB',
    'COIN', 'HOOD', 'SQ', 'SHOP', 'TSM', 'ASML', 'COST', 'WMT', 'TGT', 'DIS',
    'NKE', 'SBUX', 'F', 'GM', 'JNJ', 'PFE', 'UNH', 'CVX', 'XOM', 'SPY'
]

# Date range
START_DATE = '2025-02-06'
END_DATE = '2026-02-06'

# Output directory (relative to project root)
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'data')


def download_ticker_data(ticker: str) -> pd.DataFrame | None:
    """
    Download historical data for a single ticker.
    
    Args:
        ticker: Stock ticker symbol
        
    Returns:
        DataFrame with OHLCV data or None if download fails
    """
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(start=START_DATE, end=END_DATE, auto_adjust=False)
        
        if df.empty:
            print(f"  ⚠️  No data returned for {ticker}")
            return None
            
        return df
    except Exception as e:
        print(f"  ❌ Error downloading {ticker}: {e}")
        return None


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the downloaded data:
    - Forward-fill missing values
    - Round prices to 2 decimal places
    - Format for Yahoo Finance CSV compatibility
    
    Args:
        df: Raw DataFrame from yfinance
        
    Returns:
        Cleaned DataFrame
    """
    # Forward-fill any missing values
    df = df.ffill()
    
    # Select and rename columns to match Yahoo Finance format
    df = df[['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']].copy()
    
    # Round price columns to 2 decimal places
    price_columns = ['Open', 'High', 'Low', 'Close', 'Adj Close']
    for col in price_columns:
        df[col] = df[col].round(2)
    
    # Ensure volume is integer
    df['Volume'] = df['Volume'].astype(int)
    
    # Reset index to get Date as a column
    df = df.reset_index()
    
    # Format date as YYYY-MM-DD string
    df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
    
    return df


def save_to_csv(df: pd.DataFrame, ticker: str, output_dir: str) -> bool:
    """
    Save DataFrame to CSV file.
    
    Args:
        df: Cleaned DataFrame
        ticker: Ticker symbol for filename
        output_dir: Directory to save the file
        
    Returns:
        True if successful, False otherwise
    """
    try:
        filepath = os.path.join(output_dir, f'{ticker}.csv')
        df.to_csv(filepath, index=False)
        return True
    except Exception as e:
        print(f"  ❌ Error saving {ticker}: {e}")
        return False


def main():
    """Main function to download all ticker data."""
    print("=" * 60)
    print("Bloomberg Jr. Terminal - Data Downloader")
    print("=" * 60)
    print(f"\nDate Range: {START_DATE} to {END_DATE}")
    print(f"Tickers: {len(TICKERS)}")
    print(f"Output: {OUTPUT_DIR}\n")
    
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"✓ Output directory ready: {OUTPUT_DIR}\n")
    
    # Track results
    success_count = 0
    failed_tickers = []
    
    print("Downloading data...\n")
    
    for i, ticker in enumerate(TICKERS, 1):
        print(f"[{i:02d}/{len(TICKERS)}] {ticker}...", end=" ")
        
        # Download data
        df = download_ticker_data(ticker)
        
        if df is None:
            failed_tickers.append(ticker)
            continue
        
        # Clean data
        df = clean_data(df)
        
        # Save to CSV
        if save_to_csv(df, ticker, OUTPUT_DIR):
            trading_days = len(df)
            date_range = f"{df['Date'].iloc[0]} to {df['Date'].iloc[-1]}"
            print(f"✓ {trading_days} days ({date_range})")
            success_count += 1
        else:
            failed_tickers.append(ticker)
    
    # Print summary
    print("\n" + "=" * 60)
    print("DOWNLOAD COMPLETE")
    print("=" * 60)
    print(f"\n✓ Successfully downloaded: {success_count}/{len(TICKERS)} tickers")
    
    if failed_tickers:
        print(f"✗ Failed: {', '.join(failed_tickers)}")
    
    print(f"\n📁 Data saved to: {OUTPUT_DIR}")
    print("\nYou can now run the Next.js app to visualize the data!")


if __name__ == '__main__':
    main()
