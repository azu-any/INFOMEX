import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { AggregatedDataPoint } from '../DataUtils';

interface DataCellProps {
  point: AggregatedDataPoint;
  position: [number, number, number];
  isSelected: boolean;
  isClicked: boolean;
  onHover: (point: AggregatedDataPoint | null) => void;
  onClick: () => void;
}

const colorLow = new THREE.Color('#38bdf8'); // sky-400 (light blue)
const colorHigh = new THREE.Color('#ea580c'); // orange-600 (dark orange)

export const DataCell: React.FC<DataCellProps> = ({
  point,
  position,
  isSelected,
  isClicked,
  onHover,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const cellColor = useMemo(() => {
    const c = colorLow.clone();
    c.lerp(colorHigh, point.rating / 100);
    return c;
  }, [point.rating]);

  // Gentle floating animation
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.05;
    } else if (meshRef.current && !isSelected) {
      meshRef.current.position.y = position[1];
    }

    // Scale animation
    if (meshRef.current) {
      const targetScale = isClicked ? 1.3 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(point);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        onHover(null);
      }}
      onPointerUp={(e) => {
        // e.delta is the distance the mouse moved between onPointerDown and onPointerUp.
        // We use a threshold (e.g. <= 5 pixels) to allow for slight hand movements
        // when clicking, but still prevent triggering a click when dragging the camera.
        if (e.delta <= 5) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={cellColor}
        transparent
        opacity={isSelected ? 1 : 0.1}
        roughness={0.2}
        metalness={0.1}
      />
      {(isSelected || isClicked) && (
        <lineSegments raycast={() => null}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.8, 0.8, 0.8)]} />
          <lineBasicMaterial 
            color={isClicked ? "#fbbf24" : "#ffffff"} 
            transparent 
            opacity={isClicked ? 1 : 0.3} 
          />
        </lineSegments>
      )}
    </mesh>
  );
};
