
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, useMatcapTexture } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedText3D = ({ text, position }: { text: string; position: [number, number, number] }) => {
  const textRef = useRef<THREE.Mesh>(null);
  const [matcap] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      textRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  return (
    <Center position={position}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={1.5}
        height={0.3}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshMatcapMaterial matcap={matcap} />
      </Text3D>
    </Center>
  );
};

const HolographicText = ({ text, position }: { text: string; position: [number, number, number] }) => {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
      textRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05);
    }
  });

  return (
    <group ref={textRef} position={position}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1.2}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.01}
          bevelOffset={0}
          bevelSegments={3}
        >
          {text}
          <meshBasicMaterial color="#00ffff" transparent opacity={0.8} wireframe />
        </Text3D>
      </Center>
    </group>
  );
};

const GlowingText = ({ text, position }: { text: string; position: [number, number, number] }) => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      textRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Center position={position}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={1}
        height={0.15}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.015}
        bevelSize={0.015}
        bevelOffset={0}
        bevelSegments={3}
      >
        {text}
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.9} />
      </Text3D>
    </Center>
  );
};

const FloatingText = ({ text, position }: { text: string; position: [number, number, number] }) => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      textRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.5;
      textRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <Center position={position}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.8}
        height={0.1}
        curveSegments={6}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={2}
      >
        {text}
        <meshBasicMaterial color="#9333ea" transparent opacity={0.7} />
      </Text3D>
    </Center>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Futuristic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-cyan-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* 3D text background - only visible in light mode */}
      <div className="absolute inset-0 dark:hidden">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
          <pointLight position={[-10, -10, 10]} intensity={0.8} color="#9333ea" />
          <pointLight position={[0, 10, 5]} intensity={0.6} color="#f59e0b" />
          
          {/* Main 3D Text */}
          <AnimatedText3D text="TPM" position={[-2, 2, -3]} />
          <AnimatedText3D text="Chao Long" position={[1, -1, -4]} />
          
          {/* Additional holographic text variations */}
          <HolographicText text="TPM" position={[-4, -2, -6]} />
          <GlowingText text="Chao Long" position={[4, 1, -5]} />
          <FloatingText text="TPM" position={[0, 3, -7]} />
          <FloatingText text="Chao Long" position={[-3, 0, -8]} />
        </Canvas>
      </div>
      
      {/* Minimal overlay to maintain readability */}
      <div className="absolute inset-0 bg-white/3 dark:bg-transparent pointer-events-none" />
    </div>
  );
};
