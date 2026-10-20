import React from 'react';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import { soundManager } from '../../utils/soundEffects';

interface PlanetDockProps {
  activePlanetId: string;
  onSelectPlanet: (id: string) => void;
}

export const PlanetDock: React.FC<PlanetDockProps> = ({
  activePlanetId,
  onSelectPlanet,
}) => {
  const handleClick = (id: string) => {
    soundManager.playClick();
    onSelectPlanet(id);
  };

  return (
    <div className="fixed bottom-6 inset-x-0 z-30 flex justify-center px-4 select-none pointer-events-none">
      <div className="pointer-events-auto p-1.5 sm:p-2 rounded-2xl bg-[#020612]/80 backdrop-blur-xl border border-cyan-500/25 flex items-center gap-1 sm:gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
        {SOLAR_PLANETS.map((planet) => {
          const isActive = activePlanetId === planet.id;

          return (
            <button
              key={planet.id}
              onClick={() => handleClick(planet.id)}
              className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono-code transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,243,255,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: isActive ? `0 0 8px ${planet.glowColor}` : 'none',
                }}
              />
              <span className="truncate max-w-[85px] sm:max-w-none">{planet.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
