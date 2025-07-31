import React from 'react';

interface ProgressIndicatorBarProps {
  value: number;
  label: string;
}

export function ProgressIndicatorBar({ value }: ProgressIndicatorBarProps) {
  return (
    <div className="w-full flex items-center">
      <span className="text-xs font-mono text-zinc-400 mr-2" style={{minWidth: 32}}>{Math.round(value)}%</span>
      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}