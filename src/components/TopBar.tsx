'use client';

import { useEffect, useState } from 'react';

interface TopBarProps {
  name?: string;
}

export default function TopBar({ name = 'HUGO CANSECO' }: TopBarProps) {
  const [time, setTime] = useState<string>('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-bloomberg-zinc border-b border-bloomberg-dark-gray px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-bloomberg-orange font-bold text-lg tracking-wider">
          TERMINAL <span className="text-bloomberg-gray">//</span> {name} <span className="text-bloomberg-gray">-</span> UC BERKELEY HAAS
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-bloomberg-gray text-sm font-mono">
          {time}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-bloomberg-green status-connected" />
          <span className="text-bloomberg-green text-sm">Status: Connected</span>
        </div>
      </div>
    </header>
  );
}
