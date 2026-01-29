'use client';

import { CumulativeReturnData } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';

interface CumulativeReturnChartProps {
  data: CumulativeReturnData[];
  ticker: string;
}

export default function CumulativeReturnChart({ data, ticker }: CumulativeReturnChartProps) {
  const chartData = data.map(d => ({
    date: d.date,
    stock: d.stockReturn,
    spy: d.spyReturn,
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
          width={50}
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
          formatter={(value: number, name: string) => [
            `${value.toFixed(2)}%`,
            name === 'stock' ? ticker : 'SPY'
          ]}
          labelFormatter={formatDate}
        />
        <Legend 
          wrapperStyle={{ fontSize: '10px' }}
          formatter={(value) => value === 'stock' ? ticker : 'SPY'}
        />
        <ReferenceLine y={0} stroke="#888888" strokeWidth={0.5} />
        <Line
          type="monotone"
          dataKey="stock"
          stroke="#00ff00"
          strokeWidth={1.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="spy"
          stroke="#ff9900"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
