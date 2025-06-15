
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Center } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedText3D = ({ text, position, color = '#ffffff' }: { text: string; position: [number, number, number]; color?: string }) => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      textRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  return (
    <Center position={position}>
      <Text
        ref={textRef}
        fontSize={1.5}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </Text>
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
        <Text
          fontSize={1.2}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
        >
          {text}
          <meshStandardMaterial color="#00ffff" transparent opacity={0.9} wireframe emissive="#00ffff" emissiveIntensity={0.3} />
        </Text>
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
      <Text
        ref={textRef}
        fontSize={1.0}
        color="#ff6b35"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial color="#ff6b35" transparent opacity={0.9} emissive="#ff6b35" emissiveIntensity={0.4} />
      </Text>
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
      <Text
        ref={textRef}
        fontSize={0.8}
        color="#9333ea"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial color="#9333ea" transparent opacity={0.8} emissive="#9333ea" emissiveIntensity={0.3} />
      </Text>
    </Center>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Futuristic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-cyan-50/30 to-purple-50/40 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95" />
      
      {/* 3D text background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d4ff" />
          <pointLight position={[-10, -10, 10]} intensity={1.2} color="#9333ea" />
          <pointLight position={[0, 10, 5]} intensity={1} color="#f59e0b" />
          
          {/* Main 3D Text */}
          <AnimatedText3D text="TPM" position={[-2, 2, -3]} color="#0066ff" />
          <AnimatedText3D text="Chao Long" position={[1, -1, -4]} color="#ff0066" />
          
          {/* Additional holographic text variations */}
          <HolographicText text="TPM" position={[-4, -2, -6]} />
          <GlowingText text="Chao Long" position={[4, 1, -5]} />
          <FloatingText text="TPM" position={[0, 3, -7]} />
          <FloatingText text="Chao Long" position={[-3, 0, -8]} />
        </Canvas>
      </div>
      
      {/* Reduced overlay opacity for better 3D text visibility */}
      <div className="absolute inset-0 bg-white/2 dark:bg-transparent pointer-events-none" />
    </div>
  );
};
