'use client';

import { TICKERS, METRICS, MetricType } from '@/types';

interface SidebarProps {
  selectedTicker: string;
  onTickerChange: (ticker: string) => void;
  selectedMetrics: MetricType[];
  onMetricsChange: (metrics: MetricType[]) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function Sidebar({
  selectedTicker,
  onTickerChange,
  selectedMetrics,
  onMetricsChange,
  onGenerate,
  isLoading,
}: SidebarProps) {
  const toggleMetric = (metricId: MetricType) => {
    if (selectedMetrics.includes(metricId)) {
      onMetricsChange(selectedMetrics.filter(m => m !== metricId));
    } else {
      onMetricsChange([...selectedMetrics, metricId]);
    }
  };

  const selectAll = () => {
    onMetricsChange(METRICS.map(m => m.id));
  };

  const clearAll = () => {
    onMetricsChange([]);
  };

  return (
    <aside className="w-72 bg-bloomberg-zinc border-r border-bloomberg-dark-gray flex flex-col h-full">
      {/* Ticker Selection */}
      <div className="p-4 border-b border-bloomberg-dark-gray">
        <label className="block text-bloomberg-orange text-sm font-semibold mb-2 tracking-wide">
          SELECT TICKER
        </label>
        <select
          value={selectedTicker}
          onChange={(e) => onTickerChange(e.target.value)}
          className="w-full bg-bloomberg-black border border-bloomberg-dark-gray rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-bloomberg-orange transition-colors cursor-pointer"
        >
          {TICKERS.map(ticker => (
            <option key={ticker} value={ticker}>
              {ticker}
            </option>
          ))}
        </select>
      </div>

      {/* Metrics Selection */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-bloomberg-orange text-sm font-semibold tracking-wide">
            SELECT METRICS
          </label>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-bloomberg-gray hover:text-bloomberg-orange transition-colors"
            >
              All
            </button>
            <span className="text-bloomberg-dark-gray">|</span>
            <button
              onClick={clearAll}
              className="text-xs text-bloomberg-gray hover:text-bloomberg-orange transition-colors"
            >
              None
            </button>
          </div>
        </div>
        
        <div className="space-y-1">
          {METRICS.map(metric => (
            <label
              key={metric.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-bloomberg-dark-gray cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric.id)}
                onChange={() => toggleMetric(metric.id)}
                className="w-4 h-4 rounded border-bloomberg-gray bg-bloomberg-black checked:bg-bloomberg-orange checked:border-bloomberg-orange focus:ring-bloomberg-orange focus:ring-offset-0 cursor-pointer accent-bloomberg-orange"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {metric.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="p-4 border-t border-bloomberg-dark-gray">
        <button
          onClick={onGenerate}
          disabled={isLoading || selectedMetrics.length === 0}
          className={`
            w-full py-3 rounded font-bold text-sm tracking-wider transition-all
            ${isLoading || selectedMetrics.length === 0
              ? 'bg-bloomberg-dark-gray text-bloomberg-gray cursor-not-allowed'
              : 'bg-bloomberg-orange text-black hover:bg-orange-400 active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="loading-spinner" />
              LOADING...
            </span>
          ) : (
            `GENERATE (${selectedMetrics.length})`
          )}
        </button>
        
        {selectedMetrics.length === 0 && (
          <p className="text-bloomberg-gray text-xs mt-2 text-center">
            Select at least one metric
          </p>
        )}
      </div>
    </aside>
  );
}
