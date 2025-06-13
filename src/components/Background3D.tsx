
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3;
      temp[i3] = (Math.random() - 0.5) * 200;
      temp[i3 + 1] = (Math.random() - 0.5) * 200;
      temp[i3 + 2] = (Math.random() - 0.5) * 200;
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4F46E5"
          size={0.8}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingCubes() {
  const cubesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cubesRef.current) {
      cubesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      cubesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const cubes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
        ],
        scale: Math.random() * 2 + 0.5,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      });
    }
    return temp;
  }, []);

  return (
    <group ref={cubesRef}>
      {cubes.map((cube, index) => (
        <mesh key={index} position={cube.position as [number, number, number]} scale={cube.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#6366F1" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export const Background3D = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 1],
          fov: 75,
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles />
        <FloatingCubes />
      </Canvas>
    </div>
  );
};
