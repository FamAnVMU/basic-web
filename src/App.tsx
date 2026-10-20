import React, { useState } from 'react';
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
  const [isOverview, setIsOverview] = useState<boolean>(false);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [satellites, setSatellites] = useState<SatelliteScreenPosition[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const activePlanet =
    SOLAR_PLANETS.find((p) => p.id === activePlanetId) || SOLAR_PLANETS[0];

  const handleSelectPlanet = (id: string) => {
    setActivePlanetId(id);
    setIsOverview(false); // Zoom into the selected planet!
    soundManager.playWarp();
  };

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
        onSelectPlanet={handleSelectPlanet}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenDetails={() => setIsDetailsOpen(true)}
        isOverview={isOverview}
        onToggleOverview={handleToggleOverview}
      />

      {/* Floating Orbital Labels (ETHERON / THERONIX style) */}
      <OrbitPlanetBadges
        activePlanetId={activePlanetId}
        onSelectPlanet={handleSelectPlanet}
      />

      {/* Bottom Floating Planet Selector Dock */}
      <PlanetDock
        activePlanetId={activePlanetId}
        onSelectPlanet={handleSelectPlanet}
      />

      {/* Detailed Holographic Dossier Modal */}
      {isDetailsOpen && (
        <PlanetDetailModal
          planet={activePlanet}
          onClose={() => setIsDetailsOpen(false)}
          onSelectPlanet={handleSelectPlanet}
        />
      )}
    </div>
  );
};

export default App;
