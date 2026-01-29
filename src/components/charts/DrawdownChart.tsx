'use client';

import { DrawdownData } from '@/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface DrawdownChartProps {
  data: DrawdownData[];
}

export default function DrawdownChart({ data }: DrawdownChartProps) {
  const chartData = data.map(d => ({
    date: d.date,
    drawdown: d.drawdown,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Find max drawdown
  const maxDrawdown = Math.min(...chartData.map(d => d.drawdown));

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
          domain={[Math.floor(maxDrawdown * 1.1), 0]}
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
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
          labelFormatter={formatDate}
        />
        <ReferenceLine y={0} stroke="#888888" strokeWidth={1} />
        <Area
          type="monotone"
          dataKey="drawdown"
          stroke="#ff4444"
          strokeWidth={1.5}
          fill="#ff4444"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
