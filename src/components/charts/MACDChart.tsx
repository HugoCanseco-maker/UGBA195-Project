'use client';

import { MACDData } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';

interface MACDChartProps {
  data: MACDData[];
}

export default function MACDChart({ data }: MACDChartProps) {
  // Use full 1-year dataset
  const chartData = data.map(d => ({
    date: d.date,
    macd: d.macd,
    signal: d.signal,
    histogram: d.histogram,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          tick={{ fill: '#888888', fontSize: 10 }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          interval="preserveStartEnd"
          minTickGap={50}
        />
        <YAxis 
          tick={{ fill: '#888888', fontSize: 10 }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          domain={['auto', 'auto']}
          width={50}
          tickFormatter={(v) => v.toFixed(1)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            border: '1px solid #1a1a1a',
            borderRadius: '4px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ff9900' }}
          formatter={(value: number, name: string) => [value.toFixed(2), name.toUpperCase()]}
          labelFormatter={formatDate}
        />
        <Legend wrapperStyle={{ fontSize: '10px' }} />
        <ReferenceLine y={0} stroke="#888888" strokeWidth={0.5} />
        <Bar
          dataKey="histogram"
          fill="#888888"
          opacity={0.6}
        />
        <Line
          type="monotone"
          dataKey="macd"
          stroke="#00ff00"
          strokeWidth={1.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="signal"
          stroke="#ff4444"
          strokeWidth={1.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
