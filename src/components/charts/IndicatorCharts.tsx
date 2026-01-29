"use client";

import { IndicatorTab } from "@/types";
import { PriceChart } from "./PriceChart";
import { VolumeChart } from "./VolumeChart";
import { MovingAveragesChart } from "./MovingAveragesChart";
import { RSIChart } from "./RSIChart";
import { ZScoreChart } from "./ZScoreChart";
import { VolatilityChart } from "./VolatilityChart";
import { BollingerChart } from "./BollingerChart";
import { MACDChart } from "./MACDChart";
import { CorrelationChart } from "./CorrelationChart";
import { RelativeStrengthChart } from "./RelativeStrengthChart";
import { DrawdownChart } from "./DrawdownChart";
import { BetaChart } from "./BetaChart";
import { CumulativeReturnChart } from "./CumulativeReturnChart";
import { Distance200MAChart } from "./Distance200MAChart";
import { VolumeSpikesChart } from "./VolumeSpikesChart";

import { PriceRow } from "@/types";

interface IndicatorChartsProps {
  tab: IndicatorTab;
  selectedTickers: string[];
  tickerData: Record<string, PriceRow[]>;
}

export function IndicatorCharts({
  tab,
  selectedTickers,
  tickerData,
}: IndicatorChartsProps) {
  const props = { selectedTickers, tickerData };

  switch (tab) {
    case "price":
      return <PriceChart {...props} />;
    case "volume":
      return <VolumeChart {...props} />;
    case "moving-averages":
      return <MovingAveragesChart {...props} />;
    case "rsi":
      return <RSIChart {...props} />;
    case "zscore":
      return <ZScoreChart {...props} />;
    case "volatility":
      return <VolatilityChart {...props} />;
    case "bollinger":
      return <BollingerChart {...props} />;
    case "macd":
      return <MACDChart {...props} />;
    case "correlation":
      return <CorrelationChart {...props} />;
    case "relative-strength":
      return <RelativeStrengthChart {...props} />;
    case "drawdown":
      return <DrawdownChart {...props} />;
    case "beta":
      return <BetaChart {...props} />;
    case "cumulative-return":
      return <CumulativeReturnChart {...props} />;
    case "distance-200ma":
      return <Distance200MAChart {...props} />;
    case "volume-spikes":
      return <VolumeSpikesChart {...props} />;
    default:
      return <PriceChart {...props} />;
  }
}
