'use client';

import { useState, useMemo } from 'react';
import { StockData, MetricType, METRICS } from '@/types';
import ChartPanel from './ChartPanel';
import ChartModal from './ChartModal';
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
  const [expandedMetricId, setExpandedMetricId] = useState<MetricType | null>(null);
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

  const renderChartContent = (metricId: MetricType, expanded = false) => {
    switch (metricId) {
      case 'price':
        return <PriceChart data={applyTimeRange(stockData)} expanded={expanded} />;
      case 'ma':
        return <MovingAverageChart data={applyTimeRange(computed.ma)} expanded={expanded} />;
      case 'rsi':
        return <RSIChart data={applyTimeRange(computed.rsi)} expanded={expanded} />;
      case 'macd':
        return <MACDChart data={applyTimeRange(computed.macd)} expanded={expanded} />;
      case 'bollinger':
        return <BollingerChart data={applyTimeRange(computed.bollinger)} expanded={expanded} />;
      case 'volatility':
        return <VolatilityChart data={applyTimeRange(computed.volatility)} expanded={expanded} />;
      case 'zscore':
        return <ZScoreChart data={applyTimeRange(computed.zscore)} expanded={expanded} />;
      case 'distance200ma':
        return <DistanceMAChart data={applyTimeRange(computed.distanceMa)} expanded={expanded} />;
      case 'relativeStrength':
        return <RelativeStrengthChart data={applyTimeRange(computed.relStrength)} expanded={expanded} />;
      case 'cumulativeReturn':
        return <CumulativeReturnChart data={applyTimeRange(computed.cumReturn)} ticker={ticker} expanded={expanded} />;
      case 'drawdown':
        return <DrawdownChart data={applyTimeRange(computed.drawdown)} expanded={expanded} />;
      case 'volume':
        return <VolumeChart data={applyTimeRange(computed.volume)} expanded={expanded} />;
      case 'volumeSpikes':
        return <VolumeSpikesChart data={applyTimeRange(computed.volumeSpikes)} expanded={expanded} />;
      case 'priceChange':
        return <PriceChangeChart data={applyTimeRange(computed.priceChange)} expanded={expanded} />;
      case 'beta':
        return <BetaChart data={applyTimeRange(computed.beta)} expanded={expanded} />;
      default:
        return null;
    }
  };

  const renderChart = (metricId: MetricType) => {
    const config = getMetricConfig(metricId);
    const title = `${ticker} - ${config.name}`;

    if (metricId === 'rsi') {
      return (
        <ChartPanel
          title={title}
          description={config.description}
          alertCondition={isOverbought || isOversold}
          alertText={
            isOverbought
              ? `⚠️ RSI at ${latestRSI.toFixed(1)} - OVERBOUGHT. Price may be due for a pullback.`
              : `⚠️ RSI at ${latestRSI.toFixed(1)} - OVERSOLD. Price may be due for a bounce.`
          }
          onExpand={() => setExpandedMetricId(metricId)}
        >
          {renderChartContent(metricId, false)}
        </ChartPanel>
      );
    }

    return (
      <ChartPanel
        title={title}
        description={config.description}
        onExpand={() => setExpandedMetricId(metricId)}
      >
        {renderChartContent(metricId, false)}
      </ChartPanel>
    );
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
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedMetrics.map(metricId => (
            <div key={metricId}>{renderChart(metricId)}</div>
          ))}
        </div>
      </div>
      {expandedMetricId && (
        <ChartModal
          isOpen={!!expandedMetricId}
          onClose={() => setExpandedMetricId(null)}
          title={`${ticker} - ${getMetricConfig(expandedMetricId).name}`}
        >
          {renderChartContent(expandedMetricId, true)}
        </ChartModal>
      )}
    </>
  );
}
