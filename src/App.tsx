import { useState, useMemo } from 'react';
import { generateCubeData } from './DataUtils';
import type { Year, Region, Round, DataPoint } from './DataUtils';
import { ControlPanel } from './components/ControlPanel';
import { CubeVisualization } from './components/CubeVisualization';
import { Tooltip } from './components/Tooltip';

function App() {
  const [selectedYear, setSelectedYear] = useState<Year | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [selectedRound, setSelectedRound] = useState<Round | 'All'>('All');
  
  const [hoveredPoint, setHoveredPoint] = useState<{ point: DataPoint; x: number; y: number } | null>(null);

  // Generate data once on mount
  const data = useMemo(() => generateCubeData(), []);

  const handleHover = (point: DataPoint | null, x: number, y: number) => {
    if (point) {
      setHoveredPoint({ point, x, y });
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ControlPanel
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedRound={selectedRound}
        setSelectedRound={setSelectedRound}
      />
      
      <CubeVisualization
        data={data}
        selectedYear={selectedYear}
        selectedRegion={selectedRegion}
        selectedRound={selectedRound}
        onHover={handleHover}
      />

      {hoveredPoint && (
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
