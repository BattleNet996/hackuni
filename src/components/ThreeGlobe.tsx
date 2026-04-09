'use client';
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial, OrbitControls, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HackathonMarker {
  lat: number;
  lon: number;
  title: string;
  icon?: string;
}

interface ThreeGlobeProps {
  hackathons?: HackathonMarker[];
}


function Earth({ hackathons = [] }: ThreeGlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const markersRef = useRef<THREE.Group>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  useFrame((state) => {
    // Slower rotation for better viewing
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0003;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
    if (markersRef.current) {
      markersRef.current.rotation.y += 0.0003;
    }
  });

  // Background network nodes with more depth variation
  const particlesCount = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount; i++) {
      const r = 2.2 + Math.random() * 1.2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);

      // Color variation between coral and green
      const colorMix = Math.random();
      colors[i*3] = colorMix > 0.5 ? 0.96 : 0.0;     // R
      colors[i*3+1] = colorMix > 0.5 ? 0.42 : 1.0;   // G
      colors[i*3+2] = colorMix > 0.5 ? 0.32 : 0.25; // B
    }
    return { pos, colors };
  }, []);

  // Convert lat/lon to 3D position on sphere with elevation
  const latLonToVector3 = (lat: number, lon: number, radius: number = 2.05): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
  };

  // Get icon for hackathon based on title/tags
  const getHackathonIcon = (hackathon: HackathonMarker) => {
    const title = hackathon.title.toLowerCase();
    if (title.includes('web3') || title.includes('crypto')) return '⛓️';
    if (title.includes('hardware') || title.includes('robot')) return '🔧';
    return '🏆';
  };

  return (
    <group>
      {/* Lighting setup - increased brightness */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={3.5} color="#F56B52" />
      <directionalLight position={[-10, 5, -10]} intensity={2.0} color="#00FF41" />
      <directionalLight position={[0, -5, 5]} intensity={1.5} color="#4A90E2" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1.0} color="#ffffff" />

      {/* Main Globe with lighter material */}
      <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[1.95, 64, 64]}>
        <meshBasicMaterial
          color="#1a1a1a"
        />
      </Sphere>

      {/* Outer atmosphere glow */}
      <Sphere args={[2.08, 64, 64]}>
        <meshBasicMaterial
          color="#2a2a2a"
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Wireframe overlay with more detail */}
      <Sphere args={[2.03, 64, 64]}>
        <meshBasicMaterial
          color="#3a3a3a"
          wireframe={true}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* AttraX Text on Earth Surface */}
      <Html
        position={[0, 0.5, 2.05]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          fontFamily: 'var(--font-hero)',
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'rgba(255, 255, 255, 0.15)',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          letterSpacing: '8px',
          userSelect: 'none',
        }}
      >
        AttraX
      </Html>

      {/* Elevation contour lines */}
      <Sphere args={[2.06, 72, 72]}>
        <meshBasicMaterial
          color="#444444"
          wireframe={true}
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* Background network nodes with colors */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions.pos, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[positions.colors, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          vertexColors
          size={0.025}
          sizeAttenuation={true}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* 3D Hackathon Markers with icons */}
      <group ref={markersRef}>
        {hackathons.map((hack, index) => {
          const position = latLonToVector3(hack.lat, hack.lon);
          const icon = hack.icon || getHackathonIcon(hack);
          const isHovered = hoveredMarker === hack.title;

          return (
            <group
              key={hack.title}
              position={[position.x, position.y, position.z]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredMarker(hack.title);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredMarker(null);
              }}
            >
              {/* Animated pulsing rings */}
              <group>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.06, 0.08, 32]} />
                  <meshBasicMaterial
                    color="#F56B52"
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.09, 0.11, 32]} />
                  <meshBasicMaterial
                    color="#F56B52"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>

              {/* Central glowing sphere */}
              <Sphere args={[0.05, 16, 16]}>
                <meshStandardMaterial
                  color="#F56B52"
                  emissive="#F56B52"
                  emissiveIntensity={isHovered ? 6 : 4}
                />
              </Sphere>

              {/* Icon label */}
              <Html
                position={[0, 0.18, 0]}
                center
                distanceFactor={8}
                style={{
                  pointerEvents: 'none',
                  fontSize: '20px',
                  filter: 'drop-shadow(0 0 10px rgba(245, 107, 82, 0.8))',
                  opacity: isHovered ? 1 : 0.7,
                  transition: 'opacity 0.2s ease'
                }}
              >
                {icon}
              </Html>

              {/* Title label that shows on hover */}
              <Html
                position={[0, 0.35, 0]}
                center
                distanceFactor={8}
                style={{
                  pointerEvents: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--brand-coral)',
                  textShadow: '0 0 10px rgba(245, 107, 82, 0.8), 0 0 20px rgba(0, 0, 0, 0.8)',
                  whiteSpace: 'nowrap',
                  opacity: isHovered ? 0.95 : 0,
                  fontWeight: 'bold',
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  transition: 'opacity 0.2s ease',
                  transform: isHovered ? 'translateY(0)' : 'translateY(5px)',
                }}
              >
                {hack.title.length > 25 ? hack.title.substring(0, 25) + '...' : hack.title}
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
    <div style={{
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 0,
      cursor: 'grab',
      transform: 'translateX(15%)'
    }}>
      <Canvas camera={{ position: [3, 1, 6], fov: 45 }}>
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
