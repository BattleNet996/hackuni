'use client';
import React from 'react';

interface FootprintMapProps {
  cities: Array<{ city: string; country: string; date: string }>;
}

export function FootprintMap({ cities }: FootprintMapProps) {
  // Enhanced visualization with larger canvas and more details
  const mapWidth = '100%';
  const mapHeight = 500;

  return (
    <div style={{
      width: mapWidth,
      height: `${mapHeight}px`,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-base)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-sm)'
    }}>
      {/* World map SVG */}
      <svg width="100%" height="100%" viewBox="0 0 1000 500" style={{ opacity: 0.2 }}>
        {/* Simplified world map outline */}
        <path
          d="M100,150 Q200,100 300,150 T500,150 Q600,120 700,150 T900,150"
          stroke="var(--brand-coral)"
          strokeWidth="3"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M150,250 Q250,220 350,250 T550,250 Q650,230 750,250 T950,250"
          stroke="var(--brand-green)"
          strokeWidth="2"
          fill="none"
          opacity={0.3}
        />
        <path
          d="M120,350 Q220,320 320,350 T520,350 Q620,330 720,350 T920,350"
          stroke="var(--brand-coral)"
          strokeWidth="2"
          fill="none"
          opacity={0.4}
        />

        {/* Grid lines */}
        {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(x => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="500"
            stroke="var(--border-base)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        {[0, 100, 200, 300, 400, 500].map(y => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="1000"
            y2={y}
            stroke="var(--border-base)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Connection lines between cities */}
        {cities.length > 1 && cities.map((_, i) => {
          if (i === cities.length - 1) return null;
          const x1 = 150 + (i * 200) % 800;
          const y1 = 200 + (i % 3) * 80;
          const x2 = 150 + ((i + 1) * 200) % 800;
          const y2 = 200 + ((i + 1) % 3) * 80;

          // Animated dashed line
          return (
            <g key={`connection-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--brand-green)"
                strokeWidth="2"
                strokeDasharray="8,4"
                opacity="0.6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="24"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </line>
              {/* Animated dot moving along the line */}
              <circle r="4" fill="var(--brand-green)">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={`M${x1},${y1} L${x2},${y2}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* City markers */}
      {cities.map((city, i) => {
        const x = 150 + (i * 200) % 800;
        const y = 200 + (i % 3) * 80;
        return (
          <g key={`city-${i}`} style={{ position: 'absolute', left: `${x / 10}%`, top: `${y / 5}%`, transform: 'translate(-50%, -50%)' }}>
            {/* Outer glow */}
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              background: 'radial-gradient(circle, rgba(245, 107, 82, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>

            {/* Main marker */}
            <div style={{
              width: '16px',
              height: '16px',
              background: 'var(--brand-coral)',
              borderRadius: '50%',
              border: '2px solid var(--brand-coral)',
              boxShadow: '0 0 20px rgba(245, 107, 82, 0.8)',
              position: 'relative',
              zIndex: 10
            }}></div>

            {/* City label */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              {city.city}
            </div>

            {/* Date label */}
            <div style={{
              position: 'absolute',
              top: '42px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap'
            }}>
              {new Date(city.date).toLocaleDateString()}
            </div>
          </g>
        );
      })}

      {/* Stats overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: 'var(--text-muted)',
        background: 'rgba(0,0,0,0.7)',
        padding: '15px',
        borderRadius: 'var(--radius-sm)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ marginBottom: '8px' }}>🌍 TOTAL_DISTANCE: {cities.length * 2500}km</div>
        <div style={{ marginBottom: '8px' }}>📍 CITIES_VISITED: {cities.length}</div>
        <div>🏃 JOURNEY_STEPS: {cities.length - 1}</div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        background: 'rgba(0,0,0,0.7)',
        padding: '12px',
        borderRadius: 'var(--radius-sm)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '10px', height: '10px', background: 'var(--brand-coral)', borderRadius: '50%' }}></div>
          <span>HACKATHON_LOCATION</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--brand-green)', borderRadius: '1px' }}></div>
          <span>TRAVEL_ROUTE</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
