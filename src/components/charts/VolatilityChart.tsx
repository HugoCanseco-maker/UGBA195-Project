'use client';

import { VolatilityData } from '@/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface VolatilityChartProps {
  data: VolatilityData[];
}

export default function VolatilityChart({ data }: VolatilityChartProps) {
  // Use full 1-year dataset
  const chartData = data.map(d => ({
    date: d.date,
    volatility: d.volatility,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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
          width={40}
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
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Volatility (Ann.)']}
          labelFormatter={formatDate}
        />
        <Area
          type="monotone"
          dataKey="volatility"
          stroke="#ff9900"
          strokeWidth={1.5}
          fill="#ff9900"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
