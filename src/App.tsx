import { useState, useMemo, useEffect } from 'react';
import { fetchRawData, aggregateData } from './DataUtils';
import type { RawDataPoint, AggregatedDataPoint } from './DataUtils';
import { ControlPanel } from './components/ControlPanel';
import { CubeVisualization } from './components/CubeVisualization';
import { Tooltip } from './components/Tooltip';
import { Legend } from './components/Legend';

function App() {
  const [timePath, setTimePath] = useState<string[]>([]);
  const [regionPath, setRegionPath] = useState<string[]>([]);

  const [selectedTime, setSelectedTime] = useState<string | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<string | 'All'>('All');
  const [selectedRound, setSelectedRound] = useState<string | 'All'>('All');
  
  const [hoveredPoint, setHoveredPoint] = useState<{ point: AggregatedDataPoint; x: number; y: number } | null>(null);
  const [clickedPoint, setClickedPoint] = useState<AggregatedDataPoint | null>(null);

  // Fetch RAW data on mount
  const [rawData, setRawData] = useState<RawDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRawData().then((data) => {
      setRawData(data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  // Compute Aggregated Data dynamically based on Drill-down paths
  const { points: data, timeLabels, regionLabels } = useMemo(() => {
    if (rawData.length === 0) return { points: [], timeLabels: [], regionLabels: [] };
    return aggregateData(rawData, timePath, regionPath);
  }, [rawData, timePath, regionPath]);

  const handleHover = (point: AggregatedDataPoint | null, x: number, y: number) => {
    if (point) {
      setHoveredPoint({ point, x, y });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleClick = (point: AggregatedDataPoint | null) => {
    if (clickedPoint === point) {
      setClickedPoint(null);
    } else {
      setClickedPoint(point);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ControlPanel
        timeLabels={timeLabels}
        regionLabels={regionLabels}
        timePath={timePath}
        setTimePath={setTimePath}
        regionPath={regionPath}
        setRegionPath={setRegionPath}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedRound={selectedRound}
        setSelectedRound={setSelectedRound}
      />
      
      <Legend />
      
      {isLoading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-white">Fetching Database Data...</h2>
          </div>
        </div>
      ) : (
        <CubeVisualization
          data={data}
          timeLabels={timeLabels}
          regionLabels={regionLabels}
          timeLevelName={timePath.length === 0 ? 'Year' : timePath.length === 1 ? 'Week' : 'Day'}
          regionLevelName={regionPath.length === 0 ? 'Country' : regionPath.length === 1 ? 'State' : 'City'}
          selectedTime={selectedTime}
          selectedRegion={selectedRegion}
          selectedRound={selectedRound}
          onHover={handleHover}
          onClick={handleClick}
          clickedPoint={clickedPoint}
        />
      )}

      {hoveredPoint && !isLoading && (
        <Tooltip
          point={hoveredPoint.point}
          mouseX={hoveredPoint.x}
          mouseY={hoveredPoint.y}
        />
      )}
    </div>
  );
}

export default App;
