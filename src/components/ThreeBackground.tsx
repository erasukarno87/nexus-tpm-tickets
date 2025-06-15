
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
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.4, 0.8, 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
};

const FuturisticCrystal = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.8 + position[1];
      ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3 + position[2]) * 0.2;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.6;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshBasicMaterial 
        color="#00d4ff" 
        transparent 
        opacity={0.7}
        wireframe
      />
    </mesh>
  );
};

const ModernSphere = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.6;
      ref.current.rotation.y = state.clock.elapsedTime * 0.4;
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.6, 16, 8]} />
      <meshBasicMaterial 
        color="#ff6b35" 
        transparent 
        opacity={0.6}
        wireframe
      />
    </mesh>
  );
};

const HolographicRing = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.7;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.4;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <torusGeometry args={[1.2, 0.1, 8, 32]} />
        <meshBasicMaterial 
          color="#9333ea" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.1, 8, 32]} />
        <meshBasicMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.2, 0.1, 8, 32]} />
        <meshBasicMaterial 
          color="#f59e0b" 
          transparent 
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

const QuantumCube = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.5;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.rotation.z = state.clock.elapsedTime * 0.4;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.8;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshBasicMaterial 
        color="#10b981" 
        transparent 
        opacity={0.7}
        wireframe
      />
    </mesh>
  );
};

export const ThreeBackground = () => {
  const crystalPositions: [number, number, number][] = useMemo(() => [
    [-12, 2, -10],
    [14, -4, -15],
    [-8, -6, -8],
    [10, 5, -12],
    [-15, -1, -11],
    [8, 7, -9]
  ], []);

  const spherePositions: [number, number, number][] = useMemo(() => [
    [-6, 3, -6],
    [12, -2, -8],
    [-10, -5, -7],
    [7, 6, -10],
    [0, -7, -5]
  ], []);

  const ringPositions: [number, number, number][] = useMemo(() => [
    [-4, 0, -7],
    [9, -3, -9],
    [-7, 4, -6]
  ], []);

  const cubePositions: [number, number, number][] = useMemo(() => [
    [5, 1, -4],
    [-9, -3, -5],
    [11, 3, -7],
    [-5, -6, -4]
  ], []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Futuristic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-cyan-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* 3D futuristic background - only visible in light mode */}
      <div className="absolute inset-0 dark:hidden">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[20, 20, 20]} intensity={1.2} color="#00d4ff" />
          <pointLight position={[-20, -20, 20]} intensity={0.8} color="#9333ea" />
          <pointLight position={[0, 0, 15]} intensity={0.6} color="#f59e0b" />
          
          <AnimatedPoints />
          
          {crystalPositions.map((pos, index) => (
            <FuturisticCrystal key={`crystal-${index}`} position={pos} />
          ))}
          
          {spherePositions.map((pos, index) => (
            <ModernSphere key={`sphere-${index}`} position={pos} />
          ))}
          
          {ringPositions.map((pos, index) => (
            <HolographicRing key={`ring-${index}`} position={pos} />
          ))}
          
          {cubePositions.map((pos, index) => (
            <QuantumCube key={`cube-${index}`} position={pos} />
          ))}
        </Canvas>
      </div>
      
      {/* Minimal overlay to maintain readability */}
      <div className="absolute inset-0 bg-white/3 dark:bg-transparent pointer-events-none" />
    </div>
  );
};
