import React, { useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { DataCell } from './DataCell';
import { AxesAndLabels } from './AxesAndLabels';
import { ROUNDS, REGIONS, YEARS } from '../DataUtils';
import type { DataPoint, Year, Region, Round } from '../DataUtils';

interface CubeVisualizationProps {
  data: DataPoint[];
  selectedYear: Year | 'All';
  selectedRegion: Region | 'All';
  selectedRound: Round | 'All';
  onHover: (point: DataPoint | null, mouseX: number, mouseY: number) => void;
}

const X_SPACING = 1.5;
const Y_SPACING = 1.5;
const Z_SPACING = 1.5;

export const CubeVisualization: React.FC<CubeVisualizationProps> = ({
  data,
  selectedYear,
  selectedRegion,
  selectedRound,
  onHover,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCellHover = (point: DataPoint | null) => {
    if (point) {
      onHover(point, mousePos.x, mousePos.y);
    } else {
      onHover(null, 0, 0);
    }
  };

  const centerOffset = useMemo(() => {
    return [
      -(ROUNDS.length * X_SPACING) / 2,
      -(REGIONS.length * Y_SPACING) / 2,
      -(YEARS.length * Z_SPACING) / 2,
    ] as [number, number, number];
  }, []);

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
          />
          
          {data.map((point, index) => {
            const xIdx = ROUNDS.indexOf(point.round);
            const yIdx = REGIONS.indexOf(point.region);
            const zIdx = YEARS.indexOf(point.year);

            const isSelected =
              (selectedYear === 'All' || point.year === selectedYear) &&
              (selectedRegion === 'All' || point.region === selectedRegion) &&
              (selectedRound === 'All' || point.round === selectedRound);

            return (
              <DataCell
                key={`cell-${index}`}
                point={point}
                position={[xIdx * X_SPACING, yIdx * Y_SPACING, zIdx * Z_SPACING]}
                isSelected={isSelected}
                onHover={handleCellHover}
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
