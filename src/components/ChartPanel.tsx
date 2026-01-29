'use client';

import { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  description: string;
  children: ReactNode;
  alertCondition?: boolean;
  alertText?: string;
}

export default function ChartPanel({
  title,
  description,
  children,
  alertCondition = false,
  alertText,
}: ChartPanelProps) {
  return (
    <div className="chart-panel bg-bloomberg-zinc rounded-lg border border-bloomberg-dark-gray overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-bloomberg-dark-gray">
        <h3 className="text-bloomberg-orange font-semibold text-sm tracking-wide">
          {title}
        </h3>
      </div>
      
      {/* Chart Area */}
      <div className="p-4 h-64">
        {children}
      </div>
      
      {/* Footer Blurb */}
      <div className="px-4 py-3 border-t border-bloomberg-dark-gray bg-bloomberg-black/30">
        <p className={`text-xs leading-relaxed ${alertCondition ? 'text-bloomberg-red font-semibold' : 'text-bloomberg-gray'}`}>
          {alertCondition && alertText ? alertText : description}
        </p>
      </div>
    </div>
  );
}
