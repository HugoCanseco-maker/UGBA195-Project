'use client';

import { StockData } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Customized,
  TooltipProps,
} from 'recharts';

const CANDLE_GREEN = '#00ff00';
const CANDLE_RED = '#ff0000';

interface CandlestickLayerProps {
  data?: { date: string; open: number; high: number; low: number; close: number }[];
  xAxisMap?: Record<string, { scale: { (v: unknown): number; bandwidth?: () => number } }>;
  yAxisMap?: Record<string, { scale: (v: number) => number }>;
  offset?: { left: number; top: number; width: number; height: number };
}

function CandlestickLayer(props: CandlestickLayerProps) {
  const { data = [], xAxisMap = {}, yAxisMap = {}, offset = { left: 0, top: 0, width: 0, height: 0 } } = props;
  const xAxis = Object.values(xAxisMap)[0] as { scale: { (v: unknown): number; bandwidth?: () => number } } | undefined;
  const yAxis = Object.values(yAxisMap)[0] as { scale: (v: number) => number } | undefined;
  if (!xAxis?.scale || !yAxis?.scale || !data.length) return null;

  const xScale = xAxis.scale;
  const yScale = yAxis.scale;
  const bw = (typeof xScale.bandwidth === 'function' ? xScale.bandwidth() : 0) as number;
  const bandwidth = bw > 0 ? bw : 8;
  const gap = Math.max(1, bandwidth * 0.1);
  const bodyWidth = Math.max(3, bandwidth - gap);

  const candles = data.map((d, i) => {
    const xRaw = xScale(d.date) ?? xScale(i);
    const x = typeof xRaw === 'number' ? xRaw : 0;
    const cx = offset.left + x + (bw > 0 ? bandwidth / 2 : 0);
    const yHigh = yScale(d.high);
    const yLow = yScale(d.low);
    const yOpen = yScale(d.open);
    const yClose = yScale(d.close);
    const yMin = Math.min(yOpen, yClose);
    const yMax = Math.max(yOpen, yClose);
    const bodyHeight = Math.max(1, Math.abs(yMax - yMin));
    const isUp = d.close >= d.open;
    const color = isUp ? CANDLE_GREEN : CANDLE_RED;

    return {
      cx,
      yHigh: offset.top + yHigh,
      yLow: offset.top + yLow,
      yMin: offset.top + yMin,
      bodyHeight,
      color,
      bodyWidth,
    };
  });

  return (
    <g className="recharts-candlestick-layer">
      {candles.map((c, i) => (
        <g key={i}>
          {/* Wick: vertical line from low to high */}
          <line
            x1={c.cx}
            y1={c.yLow}
            x2={c.cx}
            y2={c.yHigh}
            stroke={c.color}
            strokeWidth={1}
          />
          {/* Body: open–close rectangle */}
          <rect
            x={c.cx - c.bodyWidth / 2}
            y={c.yMin}
            width={c.bodyWidth}
            height={c.bodyHeight}
            fill={c.color}
            stroke={c.color}
            strokeWidth={1}
          />
        </g>
      ))}
    </g>
  );
}

interface PriceChartProps {
  data: StockData[];
  expanded?: boolean;
}

export default function PriceChart({ data, expanded = false }: PriceChartProps) {
  const tickFontSize = expanded ? 14 : 10;
  const axisWidth = expanded ? 70 : 60;
  const chartData = data.map(d => ({
    date: d.date,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

  const renderTooltip = (props: TooltipProps<number, string>) => {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    const p = payload[0]?.payload as { date: string; open: number; high: number; low: number; close: number } | undefined;
    if (!p) return null;
    const labelStr = label ?? p.date;
    return (
      <div
        style={{
          backgroundColor: '#09090b',
          border: '1px solid #1a1a1a',
          borderRadius: '4px',
          padding: expanded ? '12px 16px' : '8px 12px',
          fontSize: expanded ? '14px' : '12px',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <div style={{ color: '#ff9900', marginBottom: '4px' }}>{formatDate(labelStr)}</div>
        <div style={{ color: '#888' }}>O {formatPrice(p.open)}</div>
        <div style={{ color: '#888' }}>H {formatPrice(p.high)}</div>
        <div style={{ color: '#888' }}>L {formatPrice(p.low)}</div>
        <div style={{ color: p.close >= p.open ? CANDLE_GREEN : CANDLE_RED }}>C {formatPrice(p.close)}</div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: expanded ? 10 : 5, right: expanded ? 10 : 5, bottom: expanded ? 10 : 5, left: expanded ? 10 : 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis
          dataKey="date"
          type="category"
          tickFormatter={formatDate}
          tick={{ fill: '#888888', fontSize: tickFontSize }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          interval="preserveStartEnd"
          minTickGap={expanded ? 60 : 40}
        />
        <YAxis
          type="number"
          domain={['auto', 'auto']}
          tickFormatter={formatPrice}
          tick={{ fill: '#888888', fontSize: tickFontSize }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          width={axisWidth}
        />
        <Tooltip
          content={renderTooltip}
          cursor={{ stroke: '#ff9900', strokeWidth: 2 }}
          isAnimationActive={false}
        />
        {/* Invisible lines so y-domain spans high/low and Tooltip receives OHLC */}
        <Line dataKey="high" stroke="transparent" strokeWidth={0} dot={false} isAnimationActive={false} />
        <Line dataKey="low" stroke="transparent" strokeWidth={0} dot={false} isAnimationActive={false} />
        <Line dataKey="close" stroke="transparent" strokeWidth={0} dot={false} isAnimationActive={false} />
        <Customized component={<CandlestickLayer />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
