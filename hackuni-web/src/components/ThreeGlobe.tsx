'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface HackathonMarker {
  lat: number;
  lon: number;
  title: string;
}

interface ThreeGlobeProps {
  hackathons?: HackathonMarker[];
}

function Earth({ hackathons = [] }: ThreeGlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const markersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Slower rotation for better viewing
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0007;
    }
    if (markersRef.current) {
      markersRef.current.rotation.y += 0.0005;
    }
  });

  // Background Outliers Network nodes - computed once
  const particlesCount = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount; i++) {
      const r = 2.1 + Math.random() * 0.8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta); // x
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta); // y
      pos[i*3+2] = r * Math.cos(phi); // z
    }
    return pos;
  }, []);

  // Convert lat/lon to 3D position on sphere
  const latLonToVector3 = (lat: number, lon: number, radius: number = 2.08): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
  };

  return (
    <group>
      <ambientLight intensity={0.4} />
      {/* Front Coral Light */}
      <directionalLight position={[10, 10, 10]} intensity={3} color="#F56B52" />
      {/* Back Green/Blue Light for contrast */}
      <directionalLight position={[-10, 5, -10]} intensity={1.5} color="#00FF41" />

      {/* Main Globe - Full sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.01, 48, 48]}>
        <meshBasicMaterial
          color="#333333"
          wireframe={true}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Background network nodes */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <PointMaterial color="#F56B52" size={0.03} sizeAttenuation={true} transparent opacity={0.6} />
      </Points>

      {/* 3D Hackathon Markers */}
      <group ref={markersRef}>
        {hackathons.map((hack, index) => {
          const position = latLonToVector3(hack.lat, hack.lon);
          return (
            <group key={hack.title} position={[position.x, position.y, position.z]}>
              {/* Glowing ring marker */}
              <mesh>
                <torusGeometry args={[0.08, 0.02, 8, 32]} />
                <meshBasicMaterial
                  color="#F56B52"
                  emissive="#F56B52"
                  emissiveIntensity={2}
                  transparent
                  opacity={0.9}
                />
              </mesh>

              {/* Central glowing sphere */}
              <Sphere args={[0.06, 16, 16]}>
                <meshBasicMaterial
                  color="#F56B52"
                  emissive="#F56B52"
                  emissiveIntensity={3}
                />
              </Sphere>

              {/* Outer glow ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.12, 0.15, 32]} />
                <meshBasicMaterial
                  color="#F56B52"
                  transparent
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Label that shows on hover */}
              <Html
                position={[0, 0.2, 0]}
                center
                distanceFactor={8}
                style={{
                  pointerEvents: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--brand-coral)',
                  textShadow: '0 0 10px rgba(245, 107, 82, 0.8)',
                  whiteSpace: 'nowrap',
                  opacity: 0.9,
                  fontWeight: 'bold'
                }}
              >
                {hack.title}
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}

export function ThreeGlobe({ hackathons }: ThreeGlobeProps) {
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Math.PI}
          maxAzimuthAngle={Math.PI}
        />
        <Earth hackathons={hackathons} />
      </Canvas>
    </div>
  );
}
