import React, { useEffect, useState } from 'react';

interface Props {
  incomingValue: string;
  targetType: string;
  state: 'idle' | 'hammering' | 'measuring' | 'result_good' | 'result_bad';
  hammerResult?: string;
}

export const DoorFrame: React.FC<Props> = ({ incomingValue, targetType, state, hammerResult }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (state === 'hammering' || state === 'result_bad') {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [state]);

  const isBad = state === 'result_bad';
  const isGood = state === 'result_good';

  return (
    <div className="relative flex flex-col items-center justify-center h-64 w-full max-w-lg mx-auto my-8">
      
      {/* The Frame (Function Signature) */}
      <div className={`relative border-8 transition-all duration-300 w-48 h-64 rounded-t-lg flex items-start justify-center pt-2 shadow-lg
        ${isBad ? 'border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-900/20' : isGood ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'}
        ${shake ? 'shake' : ''}
      `}>
        <div className="absolute -top-8 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 shadow-sm">
          Expected: <span className="text-purple-600 dark:text-purple-400">{targetType}</span>
        </div>

        {/* Cracks Overlay */}
        {isBad && (
           <>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500 transform rotate-12 opacity-80" />
            <div className="absolute bottom-10 right-0 w-12 h-1 border-b-2 border-red-500 transform -rotate-12 opacity-80" />
            <div className="absolute top-1/2 left-2 w-full h-[1px] bg-red-500/50 rotate-45" />
           </>
        )}

        {/* The Door (Value) */}
        <div className={`
          mt-4 w-32 h-48 rounded flex flex-col items-center justify-center text-white font-mono text-lg shadow-md border-2
          transition-all duration-700
          ${state === 'idle' ? 'bg-blue-500 border-blue-400 -translate-y-4 shadow-blue-200 dark:shadow-blue-900/50' : ''}
          ${state === 'hammering' ? 'bg-orange-500 border-orange-400 scale-95 translate-y-10' : ''}
          ${state === 'measuring' ? 'bg-blue-500 border-blue-400 scale-100 translate-y-2' : ''}
          ${isBad ? 'bg-red-600 border-red-500 rotate-3 translate-y-12 grayscale' : ''}
          ${isGood ? 'bg-green-600 border-green-500 translate-y-0 shadow-green-200 dark:shadow-green-900/50' : ''}
        `}>
          <span className="text-xs text-white/80 uppercase tracking-widest mb-2 font-semibold">
            {state === 'result_bad' ? 'Forced' : 'Value'}
          </span>
          <span className="font-bold text-2xl px-2 text-center break-all drop-shadow-md">
            {state === 'result_bad' && hammerResult !== undefined ? hammerResult : incomingValue}
          </span>
          {/* Visual cue for empty strings */}
          {state === 'result_bad' && hammerResult === '' && (
            <span className="text-xs text-white/60 italic">(empty)</span>
          )}
        </div>
      </div>

      {/* Floor */}
      <div className="absolute bottom-0 w-64 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
    </div>
  );
};