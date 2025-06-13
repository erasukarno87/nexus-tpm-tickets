import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Floating particles component
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Animated geometric shapes
function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe spheres */}
      {Array.from({ length: 5 }, (_, i) => (
        <Sphere
          key={i}
          position={[
            Math.sin(i * 2) * 8,
            Math.cos(i * 2) * 8,
            Math.sin(i) * 5
          ]}
          args={[1, 16, 16]}
        >
          <meshBasicMaterial
            color="#8b5cf6"
            wireframe
            transparent
            opacity={0.3}
          />
        </Sphere>
      ))}
      
      {/* Floating cubes */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`cube-${i}`}
          position={[
            Math.sin(i * 1.5) * 12,
            Math.cos(i * 1.5) * 6,
            Math.sin(i * 0.8) * 8
          ]}
          rotation={[i * 0.5, i * 0.3, i * 0.7]}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated waves
function AnimatedWaves() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 0.5;
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshBasicMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

export const Background3D = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <FloatingParticles />
        <GeometricShapes />
        <AnimatedWaves />
      </Canvas>
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      
      {/* Animated light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
              transform: `rotate(${i * 15}deg)`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
      
      {/* Floating orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};