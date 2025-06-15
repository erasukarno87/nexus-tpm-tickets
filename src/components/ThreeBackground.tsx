
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const RotatingGeometry = () => {
  const meshRef = useRef<Mesh>(null);
  const mesh2Ref = useRef<Mesh>(null);
  const mesh3Ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.x -= delta * 0.1;
      mesh2Ref.current.rotation.z += delta * 0.2;
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.y += delta * 0.15;
      mesh3Ref.current.rotation.z -= delta * 0.1;
    }
  });

  const wireframeMaterial = useMemo(
    () => ({
      color: '#3b82f6',
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    }),
    []
  );

  const solidMaterial = useMemo(
    () => ({
      color: '#8b5cf6',
      transparent: true,
      opacity: 0.1,
    }),
    []
  );

  return (
    <>
      <mesh ref={meshRef} position={[-2, 0, -5]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshBasicMaterial {...wireframeMaterial} />
      </mesh>
      
      <mesh ref={mesh2Ref} position={[2, 1, -8]}>
        <octahedronGeometry args={[1]} />
        <meshBasicMaterial {...solidMaterial} />
      </mesh>
      
      <mesh ref={mesh3Ref} position={[0, -2, -6]}>
        <dodecahedronGeometry args={[0.8]} />
        <meshBasicMaterial {...wireframeMaterial} />
      </mesh>

      <mesh position={[3, -1, -10]} rotation={[0.5, 0.5, 0]}>
        <tetrahedronGeometry args={[0.6]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.2} />
      </mesh>

      <mesh position={[-3, 2, -7]} rotation={[1, 0, 0.5]}>
        <icosahedronGeometry args={[0.7]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.4} />
      </mesh>
    </>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
        <RotatingGeometry />
      </Canvas>
    </div>
  );
};
