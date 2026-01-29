'use client';

import { IndicatorData } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
} from 'recharts';

interface RSIChartProps {
  data: IndicatorData[];
  expanded?: boolean;
}

export default function RSIChart({ data, expanded = false }: RSIChartProps) {
  const tickFontSize = expanded ? 14 : 10;
  const chartData = data.map(d => ({
    date: d.date,
    rsi: d.value,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: expanded ? 10 : 5, right: expanded ? 10 : 5, bottom: expanded ? 10 : 5, left: expanded ? 10 : 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          tick={{ fill: '#888888', fontSize: tickFontSize }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          interval="preserveStartEnd"
          minTickGap={expanded ? 60 : 50}
        />
        <YAxis 
          domain={[0, 100]}
          ticks={[0, 30, 50, 70, 100]}
          tick={{ fill: '#888888', fontSize: tickFontSize }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          width={expanded ? 45 : 35}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            border: '1px solid #1a1a1a',
            borderRadius: '4px',
            fontSize: expanded ? '14px' : '12px',
          }}
          labelStyle={{ color: '#ff9900' }}
          cursor={expanded ? { stroke: '#ff9900', strokeWidth: 2 } : false}
          formatter={(value: number) => [value.toFixed(1), 'RSI']}
          labelFormatter={formatDate}
        />
        <ReferenceLine y={70} stroke="#ff4444" strokeDasharray="5 5" strokeWidth={1} />
        <ReferenceLine y={30} stroke="#00ff00" strokeDasharray="5 5" strokeWidth={1} />
        <ReferenceLine y={50} stroke="#888888" strokeDasharray="3 3" strokeWidth={0.5} />
        <Area
          type="monotone"
          dataKey="rsi"
          stroke="none"
          fill="#ff9900"
          fillOpacity={0.1}
        />
        <Line
          type="monotone"
          dataKey="rsi"
          stroke="#ff9900"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4, fill: '#ff9900' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
