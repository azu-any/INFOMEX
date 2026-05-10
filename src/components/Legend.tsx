import React from 'react';

export const Legend: React.FC = () => {
  return (
    <div className="absolute bottom-6 right-6 z-10 w-64 rounded-xl bg-slate-900/80 p-4 shadow-2xl backdrop-blur-md border border-slate-700/50">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Rating Scale</h3>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full rounded bg-gradient-to-r from-sky-400 to-orange-600" />
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
