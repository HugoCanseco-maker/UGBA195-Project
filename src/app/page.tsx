'use client';

import { useState, useCallback } from 'react';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import ChartGrid from '@/components/ChartGrid';
import { StockData, MetricType } from '@/types';
import { fetchStockData, alignDataWithSPY, validateDateRange, DataLinkError } from '@/lib/csvParser';
import { getCurrentStats } from '@/lib/financeMath';

interface DataInfo {
  startDate: string;
  endDate: string;
  tradingDays: number;
}

export default function Home() {
  const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>([
    'price', 'ma', 'rsi', 'macd', 'bollinger', 'volatility'
  ]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [spyData, setSpyData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDataInfo(null);
    
    try {
      // Fetch SPY baseline first (required for comparison metrics)
      let spyBaseline: StockData[];
      try {
        spyBaseline = await fetchStockData('SPY');
      } catch (err) {
        if (err instanceof DataLinkError) {
          throw new Error('DATA_LINK_FAILURE: SPY benchmark source not found. Required for relative metrics.');
        }
        throw err;
      }
      
      // Fetch selected ticker data
      let tickerData: StockData[];
      try {
        tickerData = await fetchStockData(selectedTicker);
      } catch (err) {
        if (err instanceof DataLinkError) {
          throw new Error(`DATA_LINK_FAILURE: Ticker source not found for ${selectedTicker}`);
        }
        throw err;
      }
      
      // Align dates between stock and SPY for accurate comparisons
      const { alignedStock, alignedSPY } = alignDataWithSPY(tickerData, spyBaseline);
      
      // Validate date range
      const validation = validateDateRange(alignedStock);
      if (validation.isValid) {
        setDataInfo({
          startDate: validation.startDate,
          endDate: validation.endDate,
          tradingDays: validation.tradingDays,
        });
      }
      
      setStockData(alignedStock);
      setSpyData(alignedSPY);
      setHasGenerated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR: Failed to load data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTicker]);

  const stats = stockData.length > 0 ? getCurrentStats(stockData) : null;

  return (
    <div className="h-screen flex flex-col bg-bloomberg-black">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedTicker={selectedTicker}
          onTickerChange={setSelectedTicker}
          selectedMetrics={selectedMetrics}
          onMetricsChange={setSelectedMetrics}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Stats Bar */}
          {hasGenerated && stats && (
            <div className="bg-bloomberg-zinc border-b border-bloomberg-dark-gray px-6 py-3 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-bloomberg-orange font-bold text-xl">{selectedTicker}</span>
                <span className="text-white font-mono text-lg">${stats.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-bloomberg-gray text-sm">Change:</span>
                <span className={`font-mono ${stats.change >= 0 ? 'text-bloomberg-green' : 'text-bloomberg-red'}`}>
                  {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)} ({stats.changePercent >= 0 ? '+' : ''}{stats.changePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-bloomberg-gray text-sm">Volume:</span>
                <span className="text-white font-mono">
                  {(stats.volume / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-bloomberg-gray text-sm">Trading Days:</span>
                <span className="text-white font-mono">{stockData.length}</span>
              </div>
              {dataInfo && (
                <div className="flex items-center gap-2">
                  <span className="text-bloomberg-gray text-sm">Range:</span>
                  <span className="text-white font-mono text-xs">
                    {dataInfo.startDate} → {dataInfo.endDate}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Terminal-Style Error Message */}
          {error && (
            <div className="bg-bloomberg-black border border-bloomberg-red m-4 rounded overflow-hidden font-mono">
              <div className="bg-bloomberg-red/20 px-4 py-2 border-b border-bloomberg-red flex items-center gap-2">
                <span className="text-bloomberg-red">●</span>
                <span className="text-bloomberg-red font-bold text-sm">SYSTEM ERROR</span>
              </div>
              <div className="p-4 text-sm">
                <div className="text-bloomberg-gray mb-2">&gt; Attempting data link...</div>
                <div className="text-bloomberg-red font-bold">&gt; {error}</div>
                <div className="text-bloomberg-gray mt-2">&gt; Check /public/data/ directory for {selectedTicker}.csv</div>
                <div className="text-bloomberg-orange mt-1">&gt; Run: python scripts/download_data.py</div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          {!hasGenerated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-lg">
                <div className="text-6xl mb-6">📈</div>
                <h2 className="text-2xl font-bold text-bloomberg-orange mb-4">
                  Bloomberg Jr. Terminal
                </h2>
                <p className="text-bloomberg-gray mb-6 leading-relaxed">
                  Select a ticker and metrics from the sidebar, then click <span className="text-bloomberg-orange font-semibold">GENERATE</span> to 
                  visualize comprehensive technical analysis and financial indicators.
                </p>
                <div className="text-sm text-bloomberg-gray/70">
                  <div className="mb-1">• 49 major tickers available</div>
                  <div className="mb-1">• 15 professional-grade metrics</div>
                  <div className="mb-1">• Data range: Jan 29, 2025 → Jan 29, 2026</div>
                  <div>• Real-time calculations powered by client-side math engine</div>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="loading-spinner w-12 h-12 mx-auto mb-4" />
                <p className="text-bloomberg-orange">Loading {selectedTicker} data...</p>
                <p className="text-bloomberg-gray text-sm mt-2">Calculating financial indicators</p>
              </div>
            </div>
          ) : (
            <ChartGrid
              stockData={stockData}
              spyData={spyData}
              selectedMetrics={selectedMetrics}
              ticker={selectedTicker}
            />
          )}
        </main>
      </div>
    </div>
  );
}
