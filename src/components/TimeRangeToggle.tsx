'use client';

export type TimeRange = '120d' | '1y';

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export default function TimeRangeToggle({ value, onChange }: TimeRangeToggleProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-bloomberg-gray text-sm font-mono mr-2">RANGE:</span>
      <div className="inline-flex rounded border border-bloomberg-dark-gray overflow-hidden bg-bloomberg-zinc p-0.5">
        <button
          type="button"
          onClick={() => onChange('120d')}
          className={`
            px-4 py-2 text-sm font-mono font-medium transition-colors
            ${value === '120d'
              ? 'bg-bloomberg-orange text-black'
              : 'text-bloomberg-gray hover:text-white hover:bg-bloomberg-dark-gray'}
          `}
        >
          120 Days
        </button>
        <button
          type="button"
          onClick={() => onChange('1y')}
          className={`
            px-4 py-2 text-sm font-mono font-medium transition-colors border-l border-bloomberg-dark-gray
            ${value === '1y'
              ? 'bg-bloomberg-orange text-black'
              : 'text-bloomberg-gray hover:text-white hover:bg-bloomberg-dark-gray'}
          `}
        >
          1 Year
        </button>
      </div>
    </div>
  );
}
