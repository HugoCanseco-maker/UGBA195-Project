'use client';

import { IndicatorData } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';

interface VolumeSpikesChartProps {
  data: IndicatorData[];
}

export default function VolumeSpikesChart({ data }: VolumeSpikesChartProps) {
  // Use full 1-year dataset
  const chartData = data.map(d => ({
    date: d.date,
    ratio: d.value,
    isSpike: d.isSpike,
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
          domain={[0, 'auto']}
          width={35}
          tickFormatter={(v) => `${v.toFixed(1)}x`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            border: '1px solid #1a1a1a',
            borderRadius: '4px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ff9900' }}
          formatter={(value: number) => [`${value.toFixed(2)}x`, 'Vol/Avg']}
          labelFormatter={formatDate}
        />
        <ReferenceLine y={2} stroke="#ff4444" strokeDasharray="5 5" strokeWidth={1} label={{ value: '2x', fill: '#ff4444', fontSize: 10 }} />
        <ReferenceLine y={1} stroke="#888888" strokeWidth={0.5} />
        <Bar dataKey="ratio" radius={[2, 2, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.isSpike ? '#ff9900' : '#888888'} 
              fillOpacity={entry.isSpike ? 0.9 : 0.4}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
