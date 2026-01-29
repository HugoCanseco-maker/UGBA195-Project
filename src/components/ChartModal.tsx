'use client';

import { useEffect, useCallback, ReactNode } from 'react';

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function ChartModal({ isOpen, onClose, title, children }: ChartModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal
      aria-labelledby="chart-modal-title"
      role="dialog"
    >
      {/* Backdrop - click outside to close */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      {/* Modal panel - 80% viewport, terminal black, thin orange border */}
      <div
        className="relative z-10 flex w-[90%] max-w-7xl flex-col rounded border border-bloomberg-orange bg-[#000000] shadow-2xl"
        style={{ height: '80vh', maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-bloomberg-dark-gray px-6 py-4">
          <h2
            id="chart-modal-title"
            className="font-mono text-lg font-semibold text-bloomberg-orange"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-bloomberg-zinc focus:outline-none focus:ring-2 focus:ring-bloomberg-orange text-bloomberg-gray hover:text-white"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        {/* Chart area - high-res view */}
        <div className="min-h-0 flex-1 p-6">
          <div className="h-full min-h-[400px] w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
