import React from 'react';
import type { AggregatedDataPoint } from '../DataUtils';

interface TooltipProps {
  point: AggregatedDataPoint | null;
  mouseX: number;
  mouseY: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ point, mouseX, mouseY }) => {
  if (!point) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg bg-slate-900/95 p-4 text-sm text-white shadow-xl backdrop-blur-sm border border-slate-700/50"
      style={{
        left: mouseX + 15,
        top: mouseY + 15,
      }}
    >
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-slate-300 mb-1 border-b border-slate-700 pb-1">Data Coordinate</div>
        <div><span className="text-slate-400">Time:</span> <span className="font-medium text-blue-300">{point.timeLabel}</span></div>
        <div><span className="text-slate-400">Region:</span> <span className="font-medium text-purple-300">{point.regionLabel}</span></div>
        <div><span className="text-slate-400">Round:</span> <span className="font-medium text-emerald-300">{point.roundLabel}</span></div>
        <div className="mt-1 font-bold text-base text-orange-400">
          Rating: {point.rating.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
