import React from 'react';
import { Text, Line } from '@react-three/drei';
import { YEARS, REGIONS, ROUNDS } from '../DataUtils';

const AXIS_COLOR = '#94a3b8'; // slate-400
const TEXT_COLOR = '#f8fafc'; // slate-50

interface AxesAndLabelsProps {
  xSpacing: number;
  ySpacing: number;
  zSpacing: number;
}

export const AxesAndLabels: React.FC<AxesAndLabelsProps> = ({
  xSpacing,
  ySpacing,
  zSpacing,
}) => {
  const xLength = ROUNDS.length * xSpacing;
  const yLength = REGIONS.length * ySpacing;
  const zLength = YEARS.length * zSpacing;

  return (
    <group>
      {/* X Axis (Rounds) */}
      <Line
        points={[[-0.5, -0.5, -0.5], [xLength, -0.5, -0.5]]}
        color={AXIS_COLOR}
        lineWidth={2}
      />
      <Text
        position={[xLength / 2, -1.2, -0.5]}
        color={TEXT_COLOR}
        fontSize={0.4}
        anchorX="center"
        anchorY="middle"
      >
        Round (X)
      </Text>
      {ROUNDS.map((round, idx) => (
        <Text
          key={`x-label-${idx}`}
          position={[idx * xSpacing, -0.8, -0.5]}
          color={AXIS_COLOR}
          fontSize={0.25}
          anchorX="center"
          anchorY="middle"
        >
          {round}
        </Text>
      ))}

      {/* Y Axis (Regions) */}
      <Line
        points={[[-0.5, -0.5, -0.5], [-0.5, yLength, -0.5]]}
        color={AXIS_COLOR}
        lineWidth={2}
      />
      <Text
        position={[-1.5, yLength / 2, -0.5]}
        color={TEXT_COLOR}
        fontSize={0.4}
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, Math.PI / 2]}
      >
        Region (Y)
      </Text>
      {REGIONS.map((region, idx) => (
        <Text
          key={`y-label-${idx}`}
          position={[-0.8, idx * ySpacing, -0.5]}
          color={AXIS_COLOR}
          fontSize={0.25}
          anchorX="right"
          anchorY="middle"
        >
          {region}
        </Text>
      ))}

      {/* Z Axis (Years) */}
      <Line
        points={[[-0.5, -0.5, -0.5], [-0.5, -0.5, zLength]]}
        color={AXIS_COLOR}
        lineWidth={2}
      />
      <Text
        position={[-0.5, -1.2, zLength / 2]}
        color={TEXT_COLOR}
        fontSize={0.4}
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
      >
        Year (Z)
      </Text>
      {YEARS.map((year, idx) => (
        <Text
          key={`z-label-${idx}`}
          position={[-0.5, -0.8, idx * zSpacing]}
          color={AXIS_COLOR}
          fontSize={0.25}
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
        >
          {year}
        </Text>
      ))}
    </group>
  );
};
