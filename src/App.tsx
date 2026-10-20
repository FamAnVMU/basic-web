import React, { useState, useCallback } from 'react';
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

  const handleSelectPlanet = useCallback((id: string, openDetails: boolean = false) => {
    setActivePlanetId(id);
    setIsOverview(false); // Zoom into the selected planet
    soundManager.playWarp();
    if (openDetails) {
      setIsDetailsOpen(true);
    }
  }, []);

  const handleActivePlanetChange = useCallback((id: string) => {
    setActivePlanetId(id);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const handleToggleOverview = () => {
    soundManager.playClick();
    setIsOverview((prev) => !prev);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020612] text-slate-100 select-none">
      {/* 3D High-Res Solar System Canvas with Continuous Gradual Flight & Orbiting Satellites */}
      <SolarSystemCanvas
        activePlanetId={activePlanetId}
        isOverview={isOverview}
        onSelectPlanet={handleSelectPlanet}
        onHoverPlanet={setHoverInfo}
        onUpdateSatellitePositions={setSatellites}
        onActivePlanetChange={handleActivePlanetChange}
        isDetailsOpen={isDetailsOpen}
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
