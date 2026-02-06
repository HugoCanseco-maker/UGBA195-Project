'use client';

import { ReactNode } from 'react';

function Maximize2Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

interface ChartPanelProps {
  title: string;
  description: string;
  insight?: string;
  children: ReactNode;
  alertCondition?: boolean;
  alertText?: string;
  onExpand?: () => void;
}

export default function ChartPanel({
  title,
  description,
  insight,
  children,
  alertCondition = false,
  alertText,
  onExpand,
}: ChartPanelProps) {
  return (
    <div className="chart-panel relative bg-bloomberg-zinc rounded-lg border border-bloomberg-dark-gray overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-bloomberg-dark-gray px-4 py-3">
        <h3 className="text-bloomberg-orange font-semibold text-sm tracking-wide pr-8">
          {title}
        </h3>
        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-bloomberg-dark-gray focus:outline-none focus:ring-2 focus:ring-bloomberg-orange text-bloomberg-gray hover:text-bloomberg-orange"
            aria-label="Expand chart"
          >
            <Maximize2Icon />
          </button>
        )}
      </div>

      {/* Chart Area */}
      <div className="p-4 h-64">
        {children}
      </div>

      {/* Institutional Insight Bar */}
      {insight && (
        <div className="px-4 py-2 border-t border-bloomberg-dark-gray bg-bloomberg-black/50 border-l-2 border-l-bloomberg-orange">
          <p className="text-xs leading-relaxed text-bloomberg-gray font-mono">
            {insight}
          </p>
        </div>
      )}

      {/* Footer Blurb */}
      <div className="px-4 py-3 border-t border-bloomberg-dark-gray bg-bloomberg-black/30">
        <p className={`text-xs leading-relaxed ${alertCondition ? 'text-bloomberg-red font-semibold' : 'text-bloomberg-gray'}`}>
          {alertCondition && alertText ? alertText : description}
        </p>
      </div>
    </div>
  );
}
