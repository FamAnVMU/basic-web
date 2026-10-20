import React, { useState, useEffect } from 'react';
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

  const activePlanet =
    SOLAR_PLANETS.find((p) => p.id === activePlanetId) || SOLAR_PLANETS[0];

  const handleSelectPlanet = (id: string, openDetails: boolean = false) => {
    setActivePlanetId(id);
    setIsOverview(false); // Zoom into the selected planet
    soundManager.playWarp();
    if (openDetails) {
      setIsDetailsOpen(true);
    }
  };

  const handleToggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const handleToggleOverview = () => {
    soundManager.playClick();
    setIsOverview((prev) => !prev);
  };

  // Scroll to transition between planets (mouse wheel & mobile touch swipe)
  useEffect(() => {
    let lastScrollTime = 0;

    const handleWheel = (e: WheelEvent) => {
      // If modal is open, do not hijack scrolling
      if (isDetailsOpen) return;

      const now = Date.now();
      if (now - lastScrollTime < 550) return; // Cooldown for smooth single step

      if (Math.abs(e.deltaY) > 20) {
        lastScrollTime = now;
        const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === activePlanetId);

        if (e.deltaY > 0) {
          // Scroll down -> next planet
          const nextIndex = (currentIndex + 1) % SOLAR_PLANETS.length;
          handleSelectPlanet(SOLAR_PLANETS[nextIndex].id, false);
        } else {
          // Scroll up -> previous planet
          const prevIndex = (currentIndex - 1 + SOLAR_PLANETS.length) % SOLAR_PLANETS.length;
          handleSelectPlanet(SOLAR_PLANETS[prevIndex].id, false);
        }
      }
    };

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isDetailsOpen) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDetailsOpen) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;

      const now = Date.now();
      if (now - lastScrollTime < 550) return;

      if (Math.abs(diffY) > 40) {
        lastScrollTime = now;
        const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === activePlanetId);

        if (diffY > 0) {
          // Swipe up -> next planet
          const nextIndex = (currentIndex + 1) % SOLAR_PLANETS.length;
          handleSelectPlanet(SOLAR_PLANETS[nextIndex].id, false);
        } else {
          // Swipe down -> previous planet
          const prevIndex = (currentIndex - 1 + SOLAR_PLANETS.length) % SOLAR_PLANETS.length;
          handleSelectPlanet(SOLAR_PLANETS[prevIndex].id, false);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activePlanetId, isDetailsOpen]);

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
