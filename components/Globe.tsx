'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface Location {
  name: string;
  lat: number;
  lng: number;
  color: string;
  roles: { icon: 'university' | 'work' | 'remote'; text: string }[];
}

const locations: Location[] = [
  {
    name: 'Talca, Chile',
    lat: -35.43,
    lng: -71.65,
    color: '#4f8ef7',
    roles: [
      { icon: 'university', text: 'Universidad de Talca' },
      { icon: 'work',       text: 'PF Alimentos · Ene–Feb 2026' },
    ],
  },
  {
    name: 'Las Condes, Santiago',
    lat: -33.41,
    lng: -70.57,
    color: '#3fb950',
    roles: [
      { icon: 'work', text: 'Empresas Iansa · Ene 2025–Feb 2025' },
      { icon: 'work', text: 'Empresas Iansa · Ago 2025' },
    ],
  },
  {
    name: 'EE.UU. — Remoto',
    lat: 37.09,
    lng: -95.71,
    color: '#a78bfa',
    roles: [
      { icon: 'remote', text: 'Outlier AI · Dic 2024–Mar 2025' },
    ],
  },
];

function WorkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function UniversityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function RemoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}>
      <rect width="18" height="14" x="3" y="7" rx="2" />
      <path d="M12 7V3" />
      <path d="M8 3h8" />
      <path d="m5 15-2-2" />
      <path d="m19 15 2-2" />
      <circle cx="9" cy="11.5" r="1.5" />
      <circle cx="15" cy="11.5" r="1.5" />
    </svg>
  );
}

function GlobeInner() {
  const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<any>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
      let destroyed = false;

    async function initGlobe() {
      if (!containerRef.current) return;

      // Dynamic import to avoid SSR issues
      const GlobeGL = (await import('globe.gl')).default;
      if (destroyed || !containerRef.current) return;

      const isDark = !document.body.classList.contains('light-theme');

      // Cast to any to bypass "not callable" error in some TS versions
      const globeInstance = (GlobeGL as any)({ animateIn: false })(containerRef.current);
      globeRef.current = globeInstance;

      const g = globeInstance as {
        width: (n: number) => any;
        height: (n: number) => any;
        backgroundColor: (c: string) => any;
        globeImageUrl: (u: string) => any;
        atmosphereColor: (c: string) => any;
        atmosphereAltitude: (n: number) => any;
        pointsData: (d: unknown[]) => any;
        pointColor: (fn: (d: unknown) => string) => any;
        pointAltitude: (n: number) => any;
        pointRadius: (n: number) => any;
        pointsMerge: (b: boolean) => any;
        controls: () => { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
        pointOfView: (v: { lat: number; lng: number; altitude: number }, ms: number) => void;
      };

      const size = containerRef.current.clientWidth || 480;

      g.width(size)
        .height(size)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl(
          isDark
            ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
            : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
        )
        .atmosphereColor(isDark ? '#4f8ef7' : '#6baed6')
        .atmosphereAltitude(0.15)
        .pointsData(locations)
        .pointColor((d: any) => (d as Location).color)
        .pointAltitude(0.06)
        .pointRadius(0.5)
        .pointsMerge(false);

      const controls = g.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;
      controls.enableZoom = false;

      g.pointOfView({ lat: locations[0].lat, lng: locations[0].lng, altitude: 2 }, 0);
    }

    initGlobe();

    return () => {
      destroyed = true;
    };
  }, []);

  function handleLocationClick(idx: number) {
    setActive(idx);
    const g = globeRef.current as {
      pointOfView: (v: { lat: number; lng: number; altitude: number }, ms: number) => void;
    } | null;
    if (g) {
      g.pointOfView({ lat: locations[idx].lat, lng: locations[idx].lng, altitude: 1.8 }, 800);
    }
  }

  return (
    <div className="globe-layout">
      {/* Globe Canvas */}
      <div id="globe-container" ref={containerRef} />

      {/* Sidebar */}
      <div className="globe-sidebar">
        <div className="globe-legend-title">Experiencia por ubicación</div>

        {locations.map((loc, idx) => (
          <div
            key={idx}
            className={`globe-location-card${active === idx ? ' active' : ''}`}
            onClick={() => handleLocationClick(idx)}
          >
            <div className="globe-loc-dot" style={{ background: loc.color, color: loc.color }} />
            <div>
              <div className="globe-loc-name">{loc.name}</div>
              <div className="globe-loc-roles">
                {loc.roles.map((role, ridx) => (
                  <span key={ridx}>
                    {role.icon === 'university' ? <UniversityIcon /> : role.icon === 'work' ? <WorkIcon /> : <RemoteIcon />}
                    {role.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export as dynamic with no SSR — prevents Three.js hydration issues
// and allows lazy loading via IntersectionObserver wrapper below
const GlobeClient = dynamic(() => Promise.resolve(GlobeInner), { ssr: false });

export default function Globe() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="globe-section"
      ref={sectionRef}
      style={{ borderTop: '1px solid var(--border)', padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      <h2 className="section-title">
        Presencia <span>Global</span>
      </h2>
      <p className="section-subtitle">Desde dónde he construido software que impacta.</p>

      {visible ? (
        <GlobeClient />
      ) : (
        <div style={{ height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <span>Cargando globo...</span>
        </div>
      )}
    </section>
  );
}
