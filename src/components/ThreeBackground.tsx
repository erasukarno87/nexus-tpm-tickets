import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedPoints = () => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    const colors = new Float32Array(1500 * 3);
    
    for (let i = 0; i < 1500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.3, 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.03;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
};

const FloatingGeometry = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.4;
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime + position[1]) * 0.3;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.8;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshBasicMaterial 
        color="#3b82f6" 
        transparent 
        opacity={0.6}
        wireframe
      />
    </mesh>
  );
};

const WaveGeometry = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.5;
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.8, 0.2, 8, 16]} />
      <meshBasicMaterial 
        color="#06b6d4" 
        transparent 
        opacity={0.4}
        wireframe
      />
    </mesh>
  );
};

export const ThreeBackground = () => {
  const geometryPositions: [number, number, number][] = useMemo(() => [
    [-10, 3, -8],
    [12, -3, -12],
    [-8, -5, -6],
    [15, 4, -15],
    [-12, -2, -10],
    [6, 6, -8],
    [-4, -7, -5],
    [9, 2, -11],
    [0, 8, -9],
    [-6, 5, -7]
  ], []);

  const wavePositions: [number, number, number][] = useMemo(() => [
    [-5, 0, -4],
    [8, -1, -6],
    [-3, 3, -5],
    [5, -4, -3]
  ], []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Very subtle gradient background - almost transparent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* 3D background - only visible in light mode */}
      <div className="absolute inset-0 dark:hidden">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[15, 15, 15]} intensity={0.8} />
          <pointLight position={[-15, -15, 15]} intensity={0.4} color="#3b82f6" />
          
          <AnimatedPoints />
          
          {geometryPositions.map((pos, index) => (
            <FloatingGeometry key={`geo-${index}`} position={pos} />
          ))}
          
          {wavePositions.map((pos, index) => (
            <WaveGeometry key={`wave-${index}`} position={pos} />
          ))}
        </Canvas>
      </div>
      
      {/* Removed heavy overlay - keep it very minimal */}
      <div className="absolute inset-0 bg-white/5 dark:bg-transparent pointer-events-none" />
    </div>
  );
};
