import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { getSolarPlanets } from './data/solarSystemData';
import type { Language } from './data/translations';
import { SolarSystemCanvas } from './components/canvas/SolarSystemCanvas';
import type { SatelliteScreenPosition, NavTarget } from './components/canvas/SolarSystemCanvas';
import { SolarHeader } from './components/ui/SolarHeader';
import { OrbitPlanetBadges } from './components/ui/OrbitPlanetBadges';
import { PlanetDock } from './components/ui/PlanetDock';
import { PlanetDetailModal } from './components/ui/PlanetDetailModal';
import { PlanetHoverTooltip } from './components/ui/PlanetHoverTooltip';
import { SatelliteOverlay } from './components/ui/SatelliteOverlay';
import { LanguageSwitcher } from './components/ui/LanguageSwitcher';
import { MobilePortfolioView } from './components/mobile/MobilePortfolioView';
import { soundManager } from './utils/soundEffects';

interface HoverInfo {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
}

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pham_an_lang');
      if (saved === 'vi' || saved === 'en') return saved;
    }
    return 'vi';
  });

  const [activePlanetId, setActivePlanetId] = useState<string>('home');
  const [navTarget, setNavTarget] = useState<NavTarget>({
    id: 'home',
    timestamp: Date.now(),
  });
  const [isOverview, setIsOverview] = useState<boolean>(false);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [satellites, setSatellites] = useState<SatelliteScreenPosition[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Device detection: screen < 1024px defaults to clean standard mobile/tablet portfolio interface
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });

  // User manual view preference ('3d' or 'normal'), null means follow device default
  const [userViewMode, setUserViewMode] = useState<'3d' | 'normal' | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLanguageChange = useCallback((lang: Language) => {
    setCurrentLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pham_an_lang', lang);
    }
  }, []);

  const planets = useMemo(() => getSolarPlanets(currentLang), [currentLang]);

  const activePlanet = useMemo(
    () => planets.find((p) => p.id === activePlanetId) || planets[0],
    [planets, activePlanetId]
  );

  const handleSelectPlanet = useCallback((id: string, openDetails: boolean = false) => {
    setActivePlanetId(id);
    setNavTarget({ id, timestamp: Date.now() });
    setIsOverview(false); // Zoom into the selected planet
    soundManager.playWarp();
    if (openDetails) {
      setIsDetailsOpen(true);
    }
  }, []);

  const handleActivePlanetChange = useCallback((id: string) => {
    setActivePlanetId(id);
  }, []);

  const handleExitOverview = useCallback(() => {
    setIsOverview(false);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const handleToggleOverview = () => {
    soundManager.playClick();
    setIsOverview((prev) => !prev);
  };

  const isNormalView = userViewMode ? userViewMode === 'normal' : isMobileDevice;

  // On Mobile / Tablet: Render the complete standard portfolio interface
  if (isNormalView) {
    return (
      <MobilePortfolioView
        planets={planets}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onSwitchTo3D={() => setUserViewMode('3d')}
      />
    );
  }

  // On Desktop (or user explicitly selected 3D space on mobile)
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020612] text-slate-100 select-none">
      {/* 3D High-Res Solar System Canvas with Continuous Gradual Flight & Orbiting Satellites */}
      <SolarSystemCanvas
        activePlanetId={activePlanetId}
        navTarget={navTarget}
        isOverview={isOverview}
        onSelectPlanet={handleSelectPlanet}
        onHoverPlanet={setHoverInfo}
        onUpdateSatellitePositions={setSatellites}
        onActivePlanetChange={handleActivePlanetChange}
        onExitOverview={handleExitOverview}
        isDetailsOpen={isDetailsOpen}
        planets={planets}
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

      {/* Top Header & Telemetry Data Row */}
      <SolarHeader
        activePlanet={activePlanet}
        onSelectPlanet={(id) => handleSelectPlanet(id, false)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenDetails={() => setIsDetailsOpen(true)}
        isOverview={isOverview}
        onToggleOverview={handleToggleOverview}
        currentLang={currentLang}
      />

      {/* Dynamic Active Planet HUD Badge */}
      {!isOverview && (
        <OrbitPlanetBadges
          activePlanetId={activePlanetId}
          onSelectPlanet={(id, openDetails) => handleSelectPlanet(id, openDetails ?? true)}
          planets={planets}
          currentLang={currentLang}
        />
      )}

      {/* Bottom Floating Planet Selector Dock */}
      <PlanetDock
        planets={planets}
        activePlanetId={activePlanetId}
        onSelectPlanet={(id) => handleSelectPlanet(id, false)}
        currentLang={currentLang}
      />

      {/* Language Switcher in bottom right corner */}
      <LanguageSwitcher
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Return to standard view button if on mobile device viewing 3D space */}
      {isMobileDevice && (
        <button
          onClick={() => setUserViewMode('normal')}
          className="fixed top-20 left-4 z-40 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-mono-code backdrop-blur-md shadow-lg flex items-center gap-1.5 cursor-pointer"
          title="Quay lại giao diện thông tin bình thường"
        >
          📄 {currentLang === 'vi' ? 'Giao diện Chuẩn' : 'Standard View'}
        </button>
      )}

      {/* Detailed Holographic Dossier Modal */}
      {isDetailsOpen && (
        <PlanetDetailModal
          planet={activePlanet}
          onClose={() => setIsDetailsOpen(false)}
          onSelectPlanet={(id) => handleSelectPlanet(id, true)}
          currentLang={currentLang}
        />
      )}
    </div>
  );
};

export default App;
