import React from 'react';
import { ActivityIcon, WarningIcon } from './Icons';

interface Props {
  value: number;
}

export const TechDebtMeter: React.FC<Props> = ({ value }) => {
  // Calculate color based on value
  const getColor = (val: number) => {
    if (val < 30) return 'bg-green-500';
    if (val < 60) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-md">
      <div className="flex justify-between items-center text-sm font-semibold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>System Stability</span>
        </div>
        <span className={value > 70 ? 'text-red-600 dark:text-red-400 animate-pulse font-bold' : 'text-slate-800 dark:text-slate-200'}>
          {value >= 100 ? 'CRITICAL FAILURE' : `${100 - value}% Integrity`}
        </span>
      </div>
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600 relative shadow-inner">
        <div 
          className={`h-full transition-all duration-500 ease-out ${getColor(value)}`}
          style={{ width: `${Math.max(0, 100 - value)}%` }}
        />
        {value > 80 && (
           <div className="absolute inset-0 flex items-center justify-center opacity-50">
             <div className="w-full h-[1px] bg-red-900 rotate-12 absolute" />
             <div className="w-full h-[1px] bg-red-900 -rotate-12 absolute" />
           </div>
        )}
      </div>
      {value > 0 && (
        <div className="text-xs text-slate-500 dark:text-slate-500 text-right">
          Tech Debt: {value}%
        </div>
      )}
    </div>
  );
};