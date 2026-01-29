'use client';

import { DistanceMAData } from '@/types';
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

interface DistanceMAChartProps {
  data: DistanceMAData[];
}

export default function DistanceMAChart({ data }: DistanceMAChartProps) {
  // Use full 1-year dataset
  const chartData = data.map(d => ({
    date: d.date,
    distance: d.distance,
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
          width={45}
          tickFormatter={(v) => `${v.toFixed(0)}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            border: '1px solid #1a1a1a',
            borderRadius: '4px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ff9900' }}
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Distance from 200 MA']}
          labelFormatter={formatDate}
        />
        <ReferenceLine y={0} stroke="#888888" strokeWidth={1} />
        <Bar dataKey="distance" radius={[2, 2, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.distance >= 0 ? '#00ff00' : '#ff4444'} 
              fillOpacity={0.7}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
