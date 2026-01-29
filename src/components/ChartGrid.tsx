'use client';

import { useState, useMemo } from 'react';
import { StockData, MetricType, METRICS } from '@/types';
import ChartPanel from './ChartPanel';
import TimeRangeToggle, { type TimeRange } from './TimeRangeToggle';
import PriceChart from './charts/PriceChart';
import MovingAverageChart from './charts/MovingAverageChart';
import RSIChart from './charts/RSIChart';
import MACDChart from './charts/MACDChart';
import BollingerChart from './charts/BollingerChart';
import VolatilityChart from './charts/VolatilityChart';
import ZScoreChart from './charts/ZScoreChart';
import DistanceMAChart from './charts/DistanceMAChart';
import RelativeStrengthChart from './charts/RelativeStrengthChart';
import CumulativeReturnChart from './charts/CumulativeReturnChart';
import DrawdownChart from './charts/DrawdownChart';
import VolumeChart from './charts/VolumeChart';
import VolumeSpikesChart from './charts/VolumeSpikesChart';
import PriceChangeChart from './charts/PriceChangeChart';
import BetaChart from './charts/BetaChart';
import {
  calculateMovingAverages,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVolatility,
  calculateZScore,
  calculateDistanceFrom200MA,
  calculateRelativeStrength,
  calculateCumulativeReturn,
  calculateDrawdown,
  calculateVolumeAnalysis,
  calculateVolumeSpikes,
  calculatePriceChange,
  calculateBeta,
  getLatestRSI,
} from '@/lib/financeMath';

const DAYS_120 = 120;

function sliceByTimeRange<T>(arr: T[], range: TimeRange): T[] {
  return range === '120d' ? arr.slice(-DAYS_120) : arr;
}

interface ChartGridProps {
  stockData: StockData[];
  spyData: StockData[];
  selectedMetrics: MetricType[];
  ticker: string;
}

export default function ChartGrid({ stockData, spyData, selectedMetrics, ticker }: ChartGridProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');
  const getMetricConfig = (id: MetricType) => METRICS.find(m => m.id === id)!;

  // Pre-calculate all series from full dataset (so MA200, etc. are valid)
  const computed = useMemo(() => {
    const ma = calculateMovingAverages(stockData);
    const rsi = calculateRSI(stockData);
    const macd = calculateMACD(stockData);
    const bollinger = calculateBollingerBands(stockData);
    const volatility = calculateVolatility(stockData);
    const zscore = calculateZScore(stockData);
    const distanceMa = calculateDistanceFrom200MA(stockData);
    const relStrength = calculateRelativeStrength(stockData, spyData);
    const cumReturn = calculateCumulativeReturn(stockData, spyData);
    const drawdown = calculateDrawdown(stockData);
    const volume = calculateVolumeAnalysis(stockData);
    const volumeSpikes = calculateVolumeSpikes(stockData);
    const priceChange = calculatePriceChange(stockData);
    const beta = calculateBeta(stockData, spyData);
    return {
      ma,
      rsi,
      macd,
      bollinger,
      volatility,
      zscore,
      distanceMa,
      relStrength,
      cumReturn,
      drawdown,
      volume,
      volumeSpikes,
      priceChange,
      beta,
    };
  }, [stockData, spyData]);

  const latestRSI = getLatestRSI(computed.rsi);
  const isOverbought = latestRSI > 70;
  const isOversold = latestRSI < 30;

  const applyTimeRange = <T,>(arr: T[]) => sliceByTimeRange(arr, timeRange);

  const renderChart = (metricId: MetricType) => {
    const config = getMetricConfig(metricId);

    switch (metricId) {
      case 'price':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <PriceChart data={applyTimeRange(stockData)} />
          </ChartPanel>
        );

      case 'ma':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <MovingAverageChart data={applyTimeRange(computed.ma)} />
          </ChartPanel>
        );

      case 'rsi':
        return (
          <ChartPanel
            title={`${ticker} - ${config.name}`}
            description={config.description}
            alertCondition={isOverbought || isOversold}
            alertText={
              isOverbought
                ? `⚠️ RSI at ${latestRSI.toFixed(1)} - OVERBOUGHT. Price may be due for a pullback.`
                : `⚠️ RSI at ${latestRSI.toFixed(1)} - OVERSOLD. Price may be due for a bounce.`
            }
          >
            <RSIChart data={applyTimeRange(computed.rsi)} />
          </ChartPanel>
        );

      case 'macd':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <MACDChart data={applyTimeRange(computed.macd)} />
          </ChartPanel>
        );

      case 'bollinger':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <BollingerChart data={applyTimeRange(computed.bollinger)} />
          </ChartPanel>
        );

      case 'volatility':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <VolatilityChart data={applyTimeRange(computed.volatility)} />
          </ChartPanel>
        );

      case 'zscore':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <ZScoreChart data={applyTimeRange(computed.zscore)} />
          </ChartPanel>
        );

      case 'distance200ma':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <DistanceMAChart data={applyTimeRange(computed.distanceMa)} />
          </ChartPanel>
        );

      case 'relativeStrength':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <RelativeStrengthChart data={applyTimeRange(computed.relStrength)} />
          </ChartPanel>
        );

      case 'cumulativeReturn':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <CumulativeReturnChart data={applyTimeRange(computed.cumReturn)} ticker={ticker} />
          </ChartPanel>
        );

      case 'drawdown':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <DrawdownChart data={applyTimeRange(computed.drawdown)} />
          </ChartPanel>
        );

      case 'volume':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <VolumeChart data={applyTimeRange(computed.volume)} />
          </ChartPanel>
        );

      case 'volumeSpikes':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <VolumeSpikesChart data={applyTimeRange(computed.volumeSpikes)} />
          </ChartPanel>
        );

      case 'priceChange':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <PriceChangeChart data={applyTimeRange(computed.priceChange)} />
          </ChartPanel>
        );

      case 'beta':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <BetaChart data={applyTimeRange(computed.beta)} />
          </ChartPanel>
        );

      default:
        return null;
    }
  };

  if (selectedMetrics.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-bloomberg-orange text-6xl mb-4">📊</div>
          <h2 className="text-xl text-bloomberg-gray mb-2">No Metrics Selected</h2>
          <p className="text-sm text-bloomberg-gray/70">Select metrics from the sidebar and click GENERATE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedMetrics.map(metricId => (
          <div key={metricId}>{renderChart(metricId)}</div>
        ))}
      </div>
    </div>
  );
}
