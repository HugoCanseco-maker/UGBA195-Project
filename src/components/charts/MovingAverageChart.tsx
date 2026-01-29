'use client';

import { MovingAverageData } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface MovingAverageChartProps {
  data: MovingAverageData[];
}

export default function MovingAverageChart({ data }: MovingAverageChartProps) {
  // Use full 1-year dataset for moving average visualization
  const chartData = data.map(d => ({
    date: d.date,
    close: d.close,
    ma50: d.ma50,
    ma200: d.ma200,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

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
            name === 'close' ? 'Price' : name === 'ma50' ? '50 MA' : '200 MA'
          ]}
          labelFormatter={formatDate}
        />
        <Legend 
          wrapperStyle={{ fontSize: '10px' }}
          formatter={(value) => value === 'close' ? 'Price' : value === 'ma50' ? '50 MA' : '200 MA'}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke="#00ff00"
          strokeWidth={1}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="ma50"
          stroke="#ff9900"
          strokeWidth={1.5}
          dot={false}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="ma200"
          stroke="#ff4444"
          strokeWidth={1.5}
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
