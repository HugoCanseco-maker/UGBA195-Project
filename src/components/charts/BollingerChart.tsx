'use client';

import { BollingerData } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface BollingerChartProps {
  data: BollingerData[];
}

export default function BollingerChart({ data }: BollingerChartProps) {
  // Use full 1-year dataset
  const chartData = data.map(d => ({
    date: d.date,
    close: d.close,
    upper: d.upper,
    middle: d.middle,
    lower: d.lower,
    band: [d.lower, d.upper],
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
          formatter={(value: number, name: string) => [
            formatPrice(value),
            name === 'close' ? 'Price' : name === 'upper' ? 'Upper Band' : name === 'lower' ? 'Lower Band' : 'Middle'
          ]}
          labelFormatter={formatDate}
        />
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="#ff9900"
          fillOpacity={0.1}
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="#000000"
          fillOpacity={1}
        />
        <Line
          type="monotone"
          dataKey="upper"
          stroke="#ff9900"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="middle"
          stroke="#888888"
          strokeWidth={1}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="lower"
          stroke="#ff9900"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke="#00ff00"
          strokeWidth={1.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
