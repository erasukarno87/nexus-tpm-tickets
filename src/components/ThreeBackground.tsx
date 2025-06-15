
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedPoints = () => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.3, 0.8);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.008}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

const FloatingGeometry = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime + position[1]) * 0.2;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshBasicMaterial 
        color="#e0f2fe" 
        transparent 
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
};

export const ThreeBackground = () => {
  const geometryPositions: [number, number, number][] = useMemo(() => [
    [-8, 2, -5],
    [8, -2, -8],
    [-6, -4, -3],
    [10, 3, -10],
    [-10, -1, -6],
    [4, 5, -7],
    [-3, -6, -4],
    [7, 1, -9]
  ], []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* Light mode only 3D background */}
      <div className="absolute inset-0 dark:hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <AnimatedPoints />
          {geometryPositions.map((pos, index) => (
            <FloatingGeometry key={index} position={pos} />
          ))}
        </Canvas>
      </div>
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-white/20 dark:bg-transparent" />
    </div>
  );
};
