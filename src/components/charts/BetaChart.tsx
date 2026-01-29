'use client';

import { IndicatorData } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface BetaChartProps {
  data: IndicatorData[];
}

export default function BetaChart({ data }: BetaChartProps) {
  // Use full 1-year dataset - dates are pre-aligned with SPY
  const chartData = data.map(d => ({
    date: d.date,
    beta: d.value,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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
          width={40}
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
          formatter={(value: number) => [value.toFixed(2), 'Beta']}
          labelFormatter={formatDate}
        />
        <ReferenceLine y={1} stroke="#888888" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Market', fill: '#888888', fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="beta"
          stroke="#ff9900"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
