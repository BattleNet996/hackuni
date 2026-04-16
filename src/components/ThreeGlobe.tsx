'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, PointMaterial, Points, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { talentPlanetEvents, talentPlanetPoints, type TalentPlanetPoint } from '@/data/talent-planet';

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9973.13) * 10000;
  return value - Math.floor(value);
}

function seededPointOnSphere(seed: number, radius: number = 2.08): THREE.Vector3 {
  const theta = seededRandom(seed + 11) * Math.PI * 2;
  const phi = Math.acos(seededRandom(seed + 29) * 2 - 1);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function markerColor(talent: TalentPlanetPoint) {
  const text = `${talent.skills.join(' ')} ${talent.signal}`.toLowerCase();
  if (text.includes('finance')) return '#FFB000';
  if (text.includes('hardware') || text.includes('robot') || text.includes('drone')) return '#00D1FF';
  if (text.includes('design')) return '#F56B52';
  if (text.includes('community') || text.includes('ecosystem')) return '#B7FF4A';
  return '#00FF41';
}

function TalentMarker({
  talent,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  talent: TalentPlanetPoint;
  selected: boolean;
  hovered: boolean;
  onSelect: (talent: TalentPlanetPoint) => void;
  onHover: (id: string | null) => void;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const color = markerColor(talent);
  const position = useMemo(() => seededPointOnSphere(talent.seed), [talent.seed]);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const wave = 1 + Math.sin(state.clock.elapsedTime * 3.2 + talent.id.length) * 0.22;
    pulseRef.current.scale.setScalar(selected ? 1.75 : hovered ? 1.45 : wave);
  });

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(talent);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(talent.id);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
    >
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.075, 0.12, 36]} />
        <meshBasicMaterial color={color} transparent opacity={selected ? 0.72 : 0.34} side={THREE.DoubleSide} />
      </mesh>

      <Sphere args={[selected ? 0.075 : 0.052, 20, 20]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 5.8 : hovered ? 4.6 : 3.2}
          roughness={0.28}
          metalness={0.42}
        />
      </Sphere>

      {(selected || hovered) && (
        <Html
          position={[0, 0.24, 0]}
          center
          distanceFactor={7}
          style={{
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color,
            whiteSpace: 'nowrap',
            textShadow: `0 0 12px ${color}, 0 0 24px rgba(0,0,0,0.9)`,
            background: 'rgba(0, 0, 0, 0.72)',
            border: `1px solid ${color}`,
            padding: '4px 7px',
            letterSpacing: '0.03em',
          }}
        >
          {talent.maskedName} // {talent.signal}
        </Html>
      )}
    </group>
  );
}

function TalentPlanetScene({
  talents,
  selectedTalent,
  onSelectTalent,
}: {
  talents: TalentPlanetPoint[];
  selectedTalent: TalentPlanetPoint | null;
  onSelectTalent: (talent: TalentPlanetPoint) => void;
}) {
  const planetRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += hoveredId ? 0.0007 : 0.0014;
      planetRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.18) * 0.018;
    }
    if (particleRef.current) {
      particleRef.current.rotation.y -= 0.0009;
    }
  });

  const particles = useMemo(() => {
    const count = 1050;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const radius = 2.25 + seededRandom(index + 1) * 1.18;
      const theta = seededRandom(index + 11) * 2 * Math.PI;
      const phi = Math.acos(seededRandom(index + 23) * 2 - 1);
      const mix = seededRandom(index + 37);

      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);

      colors[index * 3] = mix > 0.56 ? 0.96 : 0;
      colors[index * 3 + 1] = mix > 0.56 ? 0.42 : 1;
      colors[index * 3 + 2] = mix > 0.56 ? 0.32 : 0.35;
    }

    return { positions, colors };
  }, []);

  const connectionPositions = useMemo(() => {
    const values: number[] = [];
    talents.slice(0, 72).forEach((talent, index) => {
      const from = seededPointOnSphere(talent.seed, 2.11);
      const next = talents[(index + 5) % talents.length] || talent;
      const to = seededPointOnSphere(next.seed, 2.11);
      values.push(from.x, from.y, from.z, to.x, to.y, to.z);
    });
    return new Float32Array(values);
  }, [talents]);

  return (
    <group>
      <ambientLight intensity={0.74} />
      <directionalLight position={[8, 8, 8]} intensity={3.2} color="#F56B52" />
      <directionalLight position={[-8, 3, -9]} intensity={2.3} color="#00FF41" />
      <pointLight position={[0, -5, 5]} intensity={1.8} color="#00D1FF" />
      <pointLight position={[3, 2, 5]} intensity={1.1} color="#ffffff" />

      <group ref={planetRef}>
        <Sphere args={[2, 96, 96]}>
          <meshStandardMaterial color="#101614" roughness={0.62} metalness={0.34} />
        </Sphere>

        <Sphere args={[2.02, 96, 96]}>
          <meshBasicMaterial color="#15251F" wireframe transparent opacity={0.28} blending={THREE.AdditiveBlending} />
        </Sphere>

        <Sphere args={[2.09, 96, 96]}>
          <meshBasicMaterial color="#00FF41" transparent opacity={0.045} blending={THREE.AdditiveBlending} />
        </Sphere>

        <Sphere args={[2.18, 96, 96]}>
          <meshBasicMaterial color="#F56B52" transparent opacity={0.035} blending={THREE.AdditiveBlending} />
        </Sphere>

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[connectionPositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#00FF41" transparent opacity={0.18} blending={THREE.AdditiveBlending} />
        </lineSegments>

        <Html
          position={[0, 0.32, 2.13]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            fontFamily: 'var(--font-hero)',
            fontSize: '24px',
            color: 'rgba(255,255,255,0.18)',
            textShadow: '0 0 20px rgba(0,255,65,0.38)',
            letterSpacing: '7px',
            userSelect: 'none',
          }}
        >
          ATTRAX
        </Html>

        {talents.map((talent) => (
          <TalentMarker
            key={talent.id}
            talent={talent}
            selected={selectedTalent?.id === talent.id}
            hovered={hoveredId === talent.id}
            onSelect={onSelectTalent}
            onHover={setHoveredId}
          />
        ))}
      </group>

      <Points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
        </bufferGeometry>
        <PointMaterial vertexColors size={0.023} sizeAttenuation transparent opacity={0.72} blending={THREE.AdditiveBlending} />
      </Points>
    </group>
  );
}

export function ThreeGlobe() {
  const [selectedEventId, setSelectedEventId] = useState('all');
  const filteredTalents = useMemo(() => (
    selectedEventId === 'all'
      ? talentPlanetPoints
      : talentPlanetPoints.filter((talent) => talent.eventId === selectedEventId)
  ), [selectedEventId]);
  const [selectedTalentId, setSelectedTalentId] = useState(talentPlanetPoints[0]?.id || '');

  useEffect(() => {
    if (!filteredTalents.some((talent) => talent.id === selectedTalentId)) {
      setSelectedTalentId(filteredTalents[0]?.id || '');
    }
  }, [filteredTalents, selectedTalentId]);

  const selectedTalent = filteredTalents.find((talent) => talent.id === selectedTalentId) || filteredTalents[0] || null;
  const selectedEvent = talentPlanetEvents.find((event) => event.id === selectedEventId) || talentPlanetEvents[0];

  return (
    <div
      className="talent-planet-shell"
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 0,
        transform: 'translateX(-3%)',
      }}
    >
      <Canvas camera={{ position: [3.4, 1.15, 6.2], fov: 44 }}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.55}
          autoRotate={false}
        />
        <TalentPlanetScene
          talents={filteredTalents}
          selectedTalent={selectedTalent}
          onSelectTalent={(talent) => setSelectedTalentId(talent.id)}
        />
      </Canvas>

      <div className="talent-filter-panel">
        <div className="talent-filter-eyebrow">ATTRAX // ACTIVITY_FILTER</div>
        <div className="talent-filter-grid">
          {talentPlanetEvents.map((event) => {
            const count = event.id === 'all'
              ? talentPlanetPoints.length
              : talentPlanetPoints.filter((talent) => talent.eventId === event.id).length;

            if (event.id !== 'all' && count === 0) return null;

            return (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEventId(event.id)}
                className={selectedEventId === event.id ? 'talent-filter active' : 'talent-filter'}
              >
                <span>{event.label}</span>
                <strong>{count}</strong>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTalent && (
        <aside className="talent-info-card" aria-label="Selected talent profile">
          <div className="talent-info-topline">
            <span>{selectedTalent.maskedName}</span>
            <span>{selectedEvent.city.toUpperCase()}</span>
          </div>

          <h3>{selectedTalent.signal}</h3>

          <div className="talent-info-meta">
            <span>{selectedTalent.eventName}</span>
            <span>{selectedTalent.city}, {selectedTalent.country}</span>
          </div>

          <div className="talent-field-grid">
            <div>
              <span>EDU</span>
              <strong>{selectedTalent.education}</strong>
            </div>
            <div>
              <span>ORG</span>
              <strong>{selectedTalent.organization}</strong>
            </div>
            <div>
              <span>MAJOR / ROLE</span>
              <strong>{selectedTalent.major}</strong>
            </div>
          </div>

          <div className="talent-story-block">
            <span>COOLEST_THING</span>
            <p>{selectedTalent.coolestThing}</p>
          </div>

          <div className="talent-story-block">
            <span>BUILDING_NOW</span>
            <p>{selectedTalent.building}</p>
          </div>

          <div className="talent-tags">
            {selectedTalent.skills.map((skill) => (
              <span key={skill}>#{skill}</span>
            ))}
          </div>

          <div className="talent-privacy-note">
            DATA_MASKED // NO_NAME_NO_CONTACT
          </div>
        </aside>
      )}

      <style jsx>{`
        .talent-filter-panel {
          position: absolute;
          left: 38%;
          top: var(--sp-5);
          width: min(780px, 58vw);
          z-index: 4;
          pointer-events: auto;
          font-family: var(--font-mono);
          color: var(--text-main);
        }

        .talent-filter-eyebrow {
          margin-bottom: var(--sp-2);
          color: var(--text-muted);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-shadow: 0 0 14px rgba(0, 255, 65, 0.5);
        }

        .talent-filter-grid {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          gap: 6px;
          padding-bottom: 2px;
          scrollbar-width: thin;
        }

        .talent-filter {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.42);
          color: var(--text-muted);
          padding: 5px 7px;
          font: inherit;
          font-size: 10px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.18s ease;
        }

        .talent-filter strong {
          color: var(--brand-green);
          font-weight: 700;
        }

        .talent-filter.active,
        .talent-filter:hover {
          color: var(--text-main);
          border-color: var(--brand-coral);
          box-shadow: 0 0 18px rgba(245, 107, 82, 0.25);
          transform: translateY(-1px);
        }

        .talent-info-card {
          position: absolute;
          right: var(--sp-4);
          top: 52%;
          width: min(420px, 35vw);
          transform: translateY(-50%);
          z-index: 5;
          pointer-events: auto;
          padding: var(--sp-4);
          color: var(--text-main);
          border: 1px solid rgba(0, 255, 65, 0.32);
          background:
            linear-gradient(135deg, rgba(0, 255, 65, 0.12), rgba(245, 107, 82, 0.08)),
            rgba(5, 8, 7, 0.82);
          backdrop-filter: blur(18px);
          box-shadow:
            0 0 40px rgba(0, 255, 65, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          font-family: var(--font-mono);
        }

        .talent-info-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(transparent 50%, rgba(255,255,255,0.03) 50%);
          background-size: 100% 6px;
          mix-blend-mode: screen;
          opacity: 0.45;
        }

        .talent-info-topline {
          display: flex;
          justify-content: space-between;
          gap: var(--sp-3);
          color: var(--brand-green);
          font-size: 11px;
          margin-bottom: var(--sp-2);
          letter-spacing: 0.08em;
        }

        .talent-info-card h3 {
          position: relative;
          margin: 0 0 var(--sp-3) 0;
          font-family: var(--font-hero);
          font-size: clamp(28px, 3vw, 42px);
          line-height: 0.96;
          color: var(--text-main);
          text-transform: uppercase;
          text-shadow: 0 0 24px rgba(245, 107, 82, 0.35);
        }

        .talent-info-meta {
          display: flex;
          justify-content: space-between;
          gap: var(--sp-3);
          color: var(--text-muted);
          font-size: 11px;
          padding-bottom: var(--sp-3);
          margin-bottom: var(--sp-3);
          border-bottom: 1px dashed rgba(255, 255, 255, 0.18);
        }

        .talent-field-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--sp-2);
          margin-bottom: var(--sp-3);
        }

        .talent-field-grid div,
        .talent-story-block {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.28);
          padding: var(--sp-2);
        }

        .talent-field-grid span,
        .talent-story-block span {
          display: block;
          color: var(--brand-coral);
          font-size: 10px;
          margin-bottom: 4px;
          letter-spacing: 0.06em;
        }

        .talent-field-grid strong {
          display: block;
          color: var(--text-main);
          font-size: 12px;
          line-height: 1.35;
          font-weight: 600;
        }

        .talent-story-block {
          margin-bottom: var(--sp-2);
        }

        .talent-story-block p {
          margin: 0;
          font-family: var(--font-body);
          color: var(--text-muted);
          font-size: 12px;
          line-height: 1.55;
        }

        .talent-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: var(--sp-3);
        }

        .talent-tags span {
          color: var(--brand-green);
          border: 1px solid rgba(0, 255, 65, 0.28);
          background: rgba(0, 255, 65, 0.06);
          padding: 4px 7px;
          font-size: 10px;
        }

        .talent-privacy-note {
          margin-top: var(--sp-3);
          color: var(--text-muted);
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        @media (max-width: 900px) {
          .talent-planet-shell {
            transform: translateX(0) !important;
          }

          .talent-filter-panel {
            left: var(--sp-3);
            right: var(--sp-3);
            top: var(--sp-3);
            width: auto;
          }

          .talent-info-card {
            left: var(--sp-3);
            right: var(--sp-3);
            bottom: var(--sp-3);
            top: auto;
            width: auto;
            transform: none;
            max-height: 42vh;
            overflow: auto;
          }
        }
      `}</style>
    </div>
  );
}
