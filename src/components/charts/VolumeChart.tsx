'use client';

import { VolumeData } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface VolumeChartProps {
  data: VolumeData[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
  // Use full 1-year dataset
  const chartData = data.map(d => ({
    date: d.date,
    volume: d.volume / 1000000, // Convert to millions
    avgVolume: (d.avgVolume ?? 0) / 1000000,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatVolume = (value: number) => `${value.toFixed(1)}M`;

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
          tickFormatter={formatVolume}
          tick={{ fill: '#888888', fontSize: 10 }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          domain={[0, 'auto']}
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            border: '1px solid #1a1a1a',
            borderRadius: '4px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ff9900' }}
          formatter={(value: number, name: string) => [
            formatVolume(value),
            name === 'volume' ? 'Volume' : '20-Day Avg'
          ]}
          labelFormatter={formatDate}
        />
        <Legend 
          wrapperStyle={{ fontSize: '10px' }}
          formatter={(value) => value === 'volume' ? 'Volume' : '20-Day Avg'}
        />
        <Bar
          dataKey="volume"
          fill="#888888"
          opacity={0.6}
          radius={[2, 2, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="avgVolume"
          stroke="#ff9900"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
