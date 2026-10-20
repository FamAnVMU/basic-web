import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SOLAR_PLANETS } from './data/solarSystemData';
import { SolarSystemCanvas } from './components/canvas/SolarSystemCanvas';
import type { SatelliteScreenPosition } from './components/canvas/SolarSystemCanvas';
import { SolarHeader } from './components/ui/SolarHeader';
import { OrbitPlanetBadges } from './components/ui/OrbitPlanetBadges';
import { PlanetDock } from './components/ui/PlanetDock';
import { PlanetDetailModal } from './components/ui/PlanetDetailModal';
import { PlanetHoverTooltip } from './components/ui/PlanetHoverTooltip';
import { SatelliteOverlay } from './components/ui/SatelliteOverlay';
import { soundManager } from './utils/soundEffects';

interface HoverInfo {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
}

export const App: React.FC = () => {
  const [activePlanetId, setActivePlanetId] = useState<string>('home');
  const [isOverview, setIsOverview] = useState<boolean>(true); // Start in expansive solar system overview
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [satellites, setSatellites] = useState<SatelliteScreenPosition[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const activePlanetIdRef = useRef<string>(activePlanetId);
  activePlanetIdRef.current = activePlanetId;

  const isDetailsOpenRef = useRef<boolean>(isDetailsOpen);
  isDetailsOpenRef.current = isDetailsOpen;

  const activePlanet =
    SOLAR_PLANETS.find((p) => p.id === activePlanetId) || SOLAR_PLANETS[0];

  const handleSelectPlanet = useCallback((id: string, openDetails: boolean = false) => {
    setActivePlanetId(id);
    setIsOverview(false); // Zoom into the selected planet
    soundManager.playWarp();
    if (openDetails) {
      setIsDetailsOpen(true);
    }
  }, []);

  const handleSelectPlanetRef = useRef(handleSelectPlanet);
  handleSelectPlanetRef.current = handleSelectPlanet;

  const handleToggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const handleToggleOverview = () => {
    soundManager.playClick();
    setIsOverview((prev) => !prev);
  };

  // Smooth scroll accumulator with decay for seamless, non-jarring planet transitions
  useEffect(() => {
    let accumulator = 0;
    let lastSwitchTime = 0;
    const SCROLL_THRESHOLD = 180; // Requires deliberate scroll stroke, avoiding accidental switch on 1 light notch
    const COOLDOWN_MS = 650; // Smooth transition cooldown

    // Frame decay loop to dissipate small or accidental scroll nudges
    let animId: number;
    const decay = () => {
      if (Math.abs(accumulator) > 0.1) {
        accumulator *= 0.88;
        if (Math.abs(accumulator) < 0.5) accumulator = 0;
      }
      animId = requestAnimationFrame(decay);
    };
    animId = requestAnimationFrame(decay);

    const handleWheel = (e: WheelEvent) => {
      // If modal is open, let user scroll modal content freely
      if (isDetailsOpenRef.current) return;

      const now = Date.now();
      if (now - lastSwitchTime < COOLDOWN_MS) return;

      // Normalize wheel delta (pixel, line, page)
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 25;
      if (e.deltaMode === 2) delta *= 400;

      // Clamp individual delta jump so a fast fling doesn't jump multiple steps
      delta = Math.max(-120, Math.min(120, delta));

      accumulator += delta;

      if (accumulator >= SCROLL_THRESHOLD) {
        accumulator = 0;
        lastSwitchTime = now;
        const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === activePlanetIdRef.current);
        const nextIndex = (currentIndex + 1) % SOLAR_PLANETS.length;
        handleSelectPlanetRef.current(SOLAR_PLANETS[nextIndex].id, false);
      } else if (accumulator <= -SCROLL_THRESHOLD) {
        accumulator = 0;
        lastSwitchTime = now;
        const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === activePlanetIdRef.current);
        const prevIndex = (currentIndex - 1 + SOLAR_PLANETS.length) % SOLAR_PLANETS.length;
        handleSelectPlanetRef.current(SOLAR_PLANETS[prevIndex].id, false);
      }
    };

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isDetailsOpenRef.current) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDetailsOpenRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;

      const now = Date.now();
      if (now - lastSwitchTime < COOLDOWN_MS) return;

      // Intentional swipe gesture threshold for mobile
      if (Math.abs(diffY) > 80) {
        lastSwitchTime = now;
        const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === activePlanetIdRef.current);

        if (diffY > 0) {
          // Swipe up -> next planet
          const nextIndex = (currentIndex + 1) % SOLAR_PLANETS.length;
          handleSelectPlanetRef.current(SOLAR_PLANETS[nextIndex].id, false);
        } else {
          // Swipe down -> previous planet
          const prevIndex = (currentIndex - 1 + SOLAR_PLANETS.length) % SOLAR_PLANETS.length;
          handleSelectPlanetRef.current(SOLAR_PLANETS[prevIndex].id, false);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020612] text-slate-100 select-none">
      {/* 3D High-Res Solar System Canvas with Camera Flight & Orbiting Satellites */}
      <SolarSystemCanvas
        activePlanetId={activePlanetId}
        isOverview={isOverview}
        onSelectPlanet={handleSelectPlanet}
        onHoverPlanet={setHoverInfo}
        onUpdateSatellitePositions={setSatellites}
      />

      {/* Hover Holographic Tooltip HUD */}
      <PlanetHoverTooltip hoverInfo={hoverInfo} />

      {/* Orbiting Satellite Data Chips (Links & Info) */}
      {!isOverview && (
        <SatelliteOverlay
          satellites={satellites}
          onOpenDetails={() => setIsDetailsOpen(true)}
        />
      )}

      {/* Top Header & Telemetry Data Row (matching reference screenshot) */}
      <SolarHeader
        activePlanet={activePlanet}
        onSelectPlanet={(id) => handleSelectPlanet(id, true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenDetails={() => setIsDetailsOpen(true)}
        isOverview={isOverview}
        onToggleOverview={handleToggleOverview}
      />

      {/* Floating Orbital Labels (ETHERON / THERONIX style) */}
      <OrbitPlanetBadges
        activePlanetId={activePlanetId}
        onSelectPlanet={(id) => handleSelectPlanet(id, true)}
      />

      {/* Bottom Floating Planet Selector Dock */}
      <PlanetDock
        activePlanetId={activePlanetId}
        onSelectPlanet={(id) => handleSelectPlanet(id, true)}
      />

      {/* Detailed Holographic Dossier Modal (Directly triggered when clicking any planet) */}
      {isDetailsOpen && (
        <PlanetDetailModal
          planet={activePlanet}
          onClose={() => setIsDetailsOpen(false)}
          onSelectPlanet={(id) => handleSelectPlanet(id, true)}
        />
      )}
    </div>
  );
};

export default App;
