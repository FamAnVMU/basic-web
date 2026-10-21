import React from 'react';
import type { PlanetData } from '../../data/solarSystemData';
import type { Language } from '../../data/translations';
import { TRANSLATIONS } from '../../data/translations';
import { soundManager } from '../../utils/soundEffects';

interface PlanetDockProps {
  planets: PlanetData[];
  activePlanetId: string;
  onSelectPlanet: (id: string, openDetails?: boolean) => void;
  currentLang?: Language;
}

export const PlanetDock: React.FC<PlanetDockProps> = ({
  planets,
  activePlanetId,
  onSelectPlanet,
  currentLang = 'vi',
}) => {
  const t = TRANSLATIONS[currentLang];

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    soundManager.playClick();
    onSelectPlanet(id, false); // Chuyển góc nhìn sang hành tinh, không mở modal thông tin
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-5 inset-x-0 z-30 flex flex-col items-center gap-1.5 px-4 select-none pointer-events-none"
    >
      {/* Scroll Navigation Hint */}
      <div className="text-[9px] font-mono-code text-cyan-400/80 tracking-widest uppercase">
        {t.dock.scrollHint}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto relative p-1.5 sm:p-2 rounded-2xl bg-[#020612]/85 backdrop-blur-xl border border-cyan-500/25 flex items-center gap-1 sm:gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
      >
        {planets.map((planet) => {
          const isActive = activePlanetId === planet.id;

          return (
            <button
              key={planet.id}
              onClick={(e) => handleClick(e, planet.id)}
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
