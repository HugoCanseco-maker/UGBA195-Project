'use client';

import { ZScoreData } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface ZScoreChartProps {
  data: ZScoreData[];
  expanded?: boolean;
}

export default function ZScoreChart({ data, expanded = false }: ZScoreChartProps) {
  const tickFontSize = expanded ? 14 : 10;
  const chartData = data.map(d => ({
    date: d.date,
    zscore: d.zscore,
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
          domain={[-3, 3]}
          ticks={[-3, -2, -1, 0, 1, 2, 3]}
          width={expanded ? 45 : 35}
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
          formatter={(value: number) => [value.toFixed(2), 'Z-Score']}
          labelFormatter={formatDate}
        />
        <ReferenceLine y={2} stroke="#ff4444" strokeDasharray="5 5" strokeWidth={1} />
        <ReferenceLine y={-2} stroke="#00ff00" strokeDasharray="5 5" strokeWidth={1} />
        <ReferenceLine y={0} stroke="#888888" strokeWidth={0.5} />
        <Area
          type="monotone"
          dataKey="zscore"
          stroke="none"
          fill="#ff9900"
          fillOpacity={0.15}
        />
        <Line
          type="monotone"
          dataKey="zscore"
          stroke="#ff9900"
          strokeWidth={1.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
