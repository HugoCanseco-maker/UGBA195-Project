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
  expanded?: boolean;
}

export default function VolumeSpikesChart({ data, expanded = false }: VolumeSpikesChartProps) {
  const tickFontSize = expanded ? 14 : 10;
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
          tick={{ fill: '#888888', fontSize: tickFontSize }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          domain={[0, 'auto']}
          width={expanded ? 45 : 35}
          tickFormatter={(v) => `${v.toFixed(1)}x`}
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
