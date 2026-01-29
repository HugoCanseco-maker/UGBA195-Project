'use client';

import { StockData, MetricType, METRICS } from '@/types';
import ChartPanel from './ChartPanel';
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

interface ChartGridProps {
  stockData: StockData[];
  spyData: StockData[];
  selectedMetrics: MetricType[];
  ticker: string;
}

export default function ChartGrid({ stockData, spyData, selectedMetrics, ticker }: ChartGridProps) {
  const getMetricConfig = (id: MetricType) => METRICS.find(m => m.id === id)!;
  
  // Pre-calculate data for metrics that need it
  const rsiData = calculateRSI(stockData);
  const latestRSI = getLatestRSI(rsiData);
  const isOverbought = latestRSI > 70;
  const isOversold = latestRSI < 30;

  const renderChart = (metricId: MetricType) => {
    const config = getMetricConfig(metricId);
    
    switch (metricId) {
      case 'price':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <PriceChart data={stockData} />
          </ChartPanel>
        );
      
      case 'ma':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <MovingAverageChart data={calculateMovingAverages(stockData)} />
          </ChartPanel>
        );
      
      case 'rsi':
        return (
          <ChartPanel 
            title={`${ticker} - ${config.name}`} 
            description={config.description}
            alertCondition={isOverbought || isOversold}
            alertText={isOverbought 
              ? `⚠️ RSI at ${latestRSI.toFixed(1)} - OVERBOUGHT. Price may be due for a pullback.`
              : `⚠️ RSI at ${latestRSI.toFixed(1)} - OVERSOLD. Price may be due for a bounce.`
            }
          >
            <RSIChart data={rsiData} />
          </ChartPanel>
        );
      
      case 'macd':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <MACDChart data={calculateMACD(stockData)} />
          </ChartPanel>
        );
      
      case 'bollinger':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <BollingerChart data={calculateBollingerBands(stockData)} />
          </ChartPanel>
        );
      
      case 'volatility':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <VolatilityChart data={calculateVolatility(stockData)} />
          </ChartPanel>
        );
      
      case 'zscore':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <ZScoreChart data={calculateZScore(stockData)} />
          </ChartPanel>
        );
      
      case 'distance200ma':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <DistanceMAChart data={calculateDistanceFrom200MA(stockData)} />
          </ChartPanel>
        );
      
      case 'relativeStrength':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <RelativeStrengthChart data={calculateRelativeStrength(stockData, spyData)} />
          </ChartPanel>
        );
      
      case 'cumulativeReturn':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <CumulativeReturnChart data={calculateCumulativeReturn(stockData, spyData)} ticker={ticker} />
          </ChartPanel>
        );
      
      case 'drawdown':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <DrawdownChart data={calculateDrawdown(stockData)} />
          </ChartPanel>
        );
      
      case 'volume':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <VolumeChart data={calculateVolumeAnalysis(stockData)} />
          </ChartPanel>
        );
      
      case 'volumeSpikes':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <VolumeSpikesChart data={calculateVolumeSpikes(stockData)} />
          </ChartPanel>
        );
      
      case 'priceChange':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <PriceChangeChart data={calculatePriceChange(stockData)} />
          </ChartPanel>
        );
      
      case 'beta':
        return (
          <ChartPanel title={`${ticker} - ${config.name}`} description={config.description}>
            <BetaChart data={calculateBeta(stockData, spyData)} />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedMetrics.map(metricId => (
          <div key={metricId}>
            {renderChart(metricId)}
          </div>
        ))}
      </div>
    </div>
  );
}
