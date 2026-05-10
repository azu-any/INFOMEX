import React, { useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { DataCell } from './DataCell';
import { AxesAndLabels } from './AxesAndLabels';
import { ROUNDS } from '../DataUtils';
import type { AggregatedDataPoint } from '../DataUtils';

interface CubeVisualizationProps {
  data: AggregatedDataPoint[];
  timeLabels: string[];
  regionLabels: string[];
  timeLevelName: string;
  regionLevelName: string;
  selectedTime: string | 'All';
  selectedRegion: string | 'All';
  selectedRound: string | 'All';
  onHover: (point: AggregatedDataPoint | null, mouseX: number, mouseY: number) => void;
  onClick: (point: AggregatedDataPoint | null) => void;
  clickedPoint: AggregatedDataPoint | null;
}

const X_SPACING = 1.5;
const Y_SPACING = 1.5;
const Z_SPACING = 1.5;

export const CubeVisualization: React.FC<CubeVisualizationProps> = ({
  data,
  timeLabels,
  regionLabels,
  timeLevelName,
  regionLevelName,
  selectedTime,
  selectedRegion,
  selectedRound,
  onHover,
  onClick,
  clickedPoint,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCellHover = (point: AggregatedDataPoint | null) => {
    if (point) {
      onHover(point, mousePos.x, mousePos.y);
    } else {
      onHover(null, 0, 0);
    }
  };

  const centerOffset = useMemo(() => {
    return [
      -(ROUNDS.length * X_SPACING) / 2,
      -(regionLabels.length * Y_SPACING) / 2,
      -(timeLabels.length * Z_SPACING) / 2,
    ] as [number, number, number];
  }, [timeLabels.length, regionLabels.length]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <Canvas camera={{ position: [8, 8, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, 10, 5]} intensity={0.5} />
        
        <group position={centerOffset}>
          <AxesAndLabels
            xSpacing={X_SPACING}
            ySpacing={Y_SPACING}
            zSpacing={Z_SPACING}
            timeLabels={timeLabels}
            regionLabels={regionLabels}
            timeLevelName={timeLevelName}
            regionLevelName={regionLevelName}
          />
          
          {data.map((point, index) => {
            const xIdx = ROUNDS.indexOf(point.roundLabel);
            const yIdx = regionLabels.indexOf(point.regionLabel);
            const zIdx = timeLabels.indexOf(point.timeLabel);

            // Skip rendering if point doesn't map to current visible labels (shouldn't happen with correct aggregation)
            if (xIdx === -1 || yIdx === -1 || zIdx === -1) return null;

            const isSelected =
              (selectedTime === 'All' || point.timeLabel === selectedTime) &&
              (selectedRegion === 'All' || point.regionLabel === selectedRegion) &&
              (selectedRound === 'All' || point.roundLabel === selectedRound);

            const isClicked = clickedPoint === point;

            return (
              <DataCell
                key={`cell-${index}`}
                point={point as any} // DataCell expects DataPoint, AggregatedDataPoint is structurally compatible for rating
                position={[xIdx * X_SPACING, yIdx * Y_SPACING, zIdx * Z_SPACING]}
                isSelected={isSelected}
                isClicked={isClicked}
                onHover={() => handleCellHover(point)}
                onClick={() => onClick(point)}
              />
            );
          })}
        </group>

        <OrbitControls
          makeDefault
          minDistance={5}
          maxDistance={30}
          target={[0, 0, 0]}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
