import React from 'react';
import { ROUNDS } from '../DataUtils';

interface ControlPanelProps {
  timeLabels: string[];
  regionLabels: string[];
  
  timePath: string[];
  setTimePath: (path: string[]) => void;
  regionPath: string[];
  setRegionPath: (path: string[]) => void;

  selectedTime: string | 'All';
  setSelectedTime: (v: string | 'All') => void;
  selectedRegion: string | 'All';
  setSelectedRegion: (v: string | 'All') => void;
  selectedRound: string | 'All';
  setSelectedRound: (v: string | 'All') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  timeLabels,
  regionLabels,
  timePath,
  setTimePath,
  regionPath,
  setRegionPath,
  selectedTime,
  setSelectedTime,
  selectedRegion,
  setSelectedRegion,
  selectedRound,
  setSelectedRound,
}) => {
  const handleTimeDrillDown = (val: string) => {
    setTimePath([...timePath, val]);
    setSelectedTime('All');
  };

  const handleTimeRollUp = () => {
    setTimePath(timePath.slice(0, -1));
    setSelectedTime('All');
  };

  const handleRegionDrillDown = (val: string) => {
    setRegionPath([...regionPath, val]);
    setSelectedRegion('All');
  };

  const handleRegionRollUp = () => {
    setRegionPath(regionPath.slice(0, -1));
    setSelectedRegion('All');
  };

  return (
    <div className="absolute top-6 left-6 z-10 w-80 max-h-[90vh] overflow-y-auto rounded-xl bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md border border-slate-700/50">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
        INFOMEX
      </h1>
      <p className="text-sm text-slate-400 mb-6">OLAP Data Cube</p>

      {/* Time Dimension Controls */}
      <div className="mb-6 border-b border-slate-700/50 pb-4">
        <h3 className="text-md font-bold text-slate-200 mb-2">Time Dimension</h3>
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
          <span>Path:</span>
          {timePath.length === 0 ? <span className="font-semibold text-blue-300">All Years</span> : null}
          {timePath.map((p, i) => (
            <span key={i} className="font-semibold text-blue-300">
              {i > 0 ? ' > ' : ''}{p}
            </span>
          ))}
          {timePath.length < 2 && (
             <span className="text-slate-500 italic"> (Select to Drill Down)</span>
          )}
        </div>
        {timePath.length > 0 && (
          <button 
            onClick={handleTimeRollUp}
            className="mb-3 text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white transition"
          >
            ↑ Roll Up
          </button>
        )}
        <select
          className="w-full mb-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 transition-colors"
          value={selectedTime}
          onChange={(e) => {
            const val = e.target.value;
            if (val.startsWith('drill:')) {
              handleTimeDrillDown(val.replace('drill:', ''));
            } else {
              setSelectedTime(val);
            }
          }}
        >
          <option value="All">Slice by Current Level (All)</option>
          <optgroup label="Slicing">
            {timeLabels.map((l) => (
              <option key={`slice-${l}`} value={l}>Filter: {l}</option>
            ))}
          </optgroup>
          {timePath.length < 2 && (
            <optgroup label="Drill Down">
              {timeLabels.map((l) => (
                <option key={`drill-${l}`} value={`drill:${l}`}>Drill Down into: {l}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Region Dimension Controls */}
      <div className="mb-6 border-b border-slate-700/50 pb-4">
        <h3 className="text-md font-bold text-slate-200 mb-2">Region Dimension</h3>
        <div className="flex flex-wrap items-center gap-1 mb-3 text-xs text-slate-400">
          <span>Path:</span>
          {regionPath.length === 0 ? <span className="font-semibold text-purple-300">All Countries</span> : null}
          {regionPath.map((p, i) => (
            <span key={i} className="font-semibold text-purple-300">
              {i > 0 ? ' > ' : ''}{p}
            </span>
          ))}
          {regionPath.length < 2 && (
             <span className="text-slate-500 italic"> (Select to Drill)</span>
          )}
        </div>
        {regionPath.length > 0 && (
          <button 
            onClick={handleRegionRollUp}
            className="mb-3 text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white transition"
          >
            ↑ Roll Up
          </button>
        )}
        <select
          className="w-full mb-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-purple-500 focus:ring-1 transition-colors"
          value={selectedRegion}
          onChange={(e) => {
            const val = e.target.value;
            if (val.startsWith('drill:')) {
              handleRegionDrillDown(val.replace('drill:', ''));
            } else {
              setSelectedRegion(val);
            }
          }}
        >
          <option value="All">Slice by Current Level (All)</option>
          <optgroup label="Slicing">
            {regionLabels.map((l) => (
              <option key={`slice-${l}`} value={l}>Filter: {l}</option>
            ))}
          </optgroup>
          {regionPath.length < 2 && (
            <optgroup label="Drill Down">
              {regionLabels.map((l) => (
                <option key={`drill-${l}`} value={`drill:${l}`}>Drill Down into: {l}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Round Dimension Controls */}
      <div className="mb-6">
        <h3 className="text-md font-bold text-slate-200 mb-2">Round Dimension</h3>
        <select
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 focus:ring-1 transition-colors"
          value={selectedRound}
          onChange={(e) => setSelectedRound(e.target.value)}
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
  );
};
