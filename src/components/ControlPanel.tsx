import React from 'react';
import { YEARS, REGIONS, ROUNDS } from '../DataUtils';
import type { Year, Region, Round } from '../DataUtils';

interface ControlPanelProps {
  selectedYear: Year | 'All';
  setSelectedYear: (v: Year | 'All') => void;
  selectedRegion: Region | 'All';
  setSelectedRegion: (v: Region | 'All') => void;
  selectedRound: Round | 'All';
  setSelectedRound: (v: Round | 'All') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedYear,
  setSelectedYear,
  selectedRegion,
  setSelectedRegion,
  selectedRound,
  setSelectedRound,
}) => {
  return (
    <div className="absolute top-6 left-6 z-10 w-80 rounded-xl bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md border border-slate-700/50">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
        INFOMEX
      </h1>
      <p className="text-sm text-slate-400 mb-6">World Cup Broadcast Ratings OLAP Cube</p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Slice by Year</label>
          <select
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value as Year | 'All')}
          >
            <option value="All">All Years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Slice by Region</label>
          <select
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as Region | 'All')}
          >
            <option value="All">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Slice by Round</label>
          <select
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value as Round | 'All')}
          >
            <option value="All">All Rounds</option>
            {ROUNDS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">
          Rotate: Left Click & Drag<br/>
          Pan: Right Click & Drag<br/>
          Zoom: Scroll
        </p>
      </div>
    </div>
  );
};
