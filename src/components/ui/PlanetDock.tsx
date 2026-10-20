import React from 'react';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import { soundManager } from '../../utils/soundEffects';

interface PlanetDockProps {
  activePlanetId: string;
  onSelectPlanet: (id: string, openDetails?: boolean) => void;
}

export const PlanetDock: React.FC<PlanetDockProps> = ({
  activePlanetId,
  onSelectPlanet,
}) => {
  const activeIdx = Math.max(0, SOLAR_PLANETS.findIndex((p) => p.id === activePlanetId));
  const progressPercent = (activeIdx / (SOLAR_PLANETS.length - 1)) * 100;

  const handleClick = (id: string) => {
    soundManager.playClick();
    onSelectPlanet(id, false); // Chuyển góc nhìn sang hành tinh, không mở modal thông tin
  };

  return (
    <div className="fixed bottom-5 inset-x-0 z-30 flex flex-col items-center gap-1.5 px-4 select-none pointer-events-none">
      {/* Scroll Navigation Hint */}
      <div className="text-[9px] font-mono-code text-cyan-400/80 tracking-widest uppercase">
        CUỘN CHUỘT ĐỂ CHUYỂN DẦN HÀNH TINH • BẤM ĐỂ CHUYỂN NHANH
      </div>

      <div className="pointer-events-auto relative p-1.5 sm:p-2 rounded-2xl bg-[#020612]/85 backdrop-blur-xl border border-cyan-500/25 flex items-center gap-1 sm:gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Subtle Travel Track */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-cyan-950/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-300 transition-all duration-300 ease-out shadow-[0_0_8px_#00f3ff]"
            style={{ width: `${Math.max(10, progressPercent)}%` }}
          />
        </div>
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
