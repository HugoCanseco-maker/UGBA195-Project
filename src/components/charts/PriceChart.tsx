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
} from 'recharts';

interface PriceChartProps {
  data: StockData[];
}

export default function PriceChart({ data }: PriceChartProps) {
  // Use full 1-year dataset (Jan 29, 2025 - Jan 29, 2026)
  const chartData = data.map(d => ({
    date: d.date,
    close: d.close,
    high: d.high,
    low: d.low,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

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
          tickFormatter={formatPrice}
          tick={{ fill: '#888888', fontSize: 10 }}
          axisLine={{ stroke: '#1a1a1a' }}
          tickLine={{ stroke: '#1a1a1a' }}
          domain={['auto', 'auto']}
          width={60}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            border: '1px solid #1a1a1a',
            borderRadius: '4px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ff9900' }}
          itemStyle={{ color: '#00ff00' }}
          formatter={(value: number) => [formatPrice(value), 'Price']}
          labelFormatter={formatDate}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke="#00ff00"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4, fill: '#00ff00' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
