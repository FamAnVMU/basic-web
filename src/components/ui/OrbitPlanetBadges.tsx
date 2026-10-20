import React from 'react';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import { soundManager } from '../../utils/soundEffects';

interface OrbitPlanetBadgesProps {
  activePlanetId: string;
  onSelectPlanet: (id: string) => void;
}

export const OrbitPlanetBadges: React.FC<OrbitPlanetBadgesProps> = ({
  activePlanetId,
  onSelectPlanet,
}) => {
  const handleClick = (id: string) => {
    soundManager.playClick();
    onSelectPlanet(id);
  };

  const vmuPlanet = SOLAR_PLANETS.find((p) => p.id === 'vmu');
  const knowledgePlanet = SOLAR_PLANETS.find((p) => p.id === 'knowledge');

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 px-4 sm:px-12 flex justify-between items-center select-none">
      {/* Left Planet Label: ETHERON style (VMU ORBIT) */}
      {vmuPlanet && (
        <button
          onClick={() => handleClick(vmuPlanet.id)}
          className="pointer-events-auto group flex items-center gap-3 transition-all transform hover:scale-105 cursor-pointer text-left"
          title="Bấm để xem thông tin Đại học Hàng hải Việt Nam"
        >
          <div
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all flex items-center justify-center ${
              activePlanetId === vmuPlanet.id
                ? 'border-amber-400 bg-amber-500/30 shadow-[0_0_20px_#f59e0b]'
                : 'border-amber-500/50 bg-amber-500/15 group-hover:border-amber-400'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
          <div>
            <div className="font-orbitron font-medium text-xs sm:text-base text-white tracking-[0.3em] uppercase group-hover:text-amber-300 transition-colors">
              VMU ORBIT
            </div>
            <div className="text-[10px] font-mono-code text-slate-400 tracking-wider hidden sm:block">
              ĐẠI HỌC HÀNG HẢI
            </div>
          </div>
        </button>
      )}

      {/* Right Planet Label: THERONIX style (KNOWLEDGE) */}
      {knowledgePlanet && (
        <button
          onClick={() => handleClick(knowledgePlanet.id)}
          className="pointer-events-auto group flex items-center gap-3 transition-all transform hover:scale-105 cursor-pointer text-right flex-row-reverse"
          title="Bấm để xem kiến thức nền tảng đã học"
        >
          <div
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all flex items-center justify-center ${
              activePlanetId === knowledgePlanet.id
                ? 'border-purple-400 bg-purple-500/30 shadow-[0_0_20px_#a855f7]'
                : 'border-purple-500/50 bg-purple-500/15 group-hover:border-purple-400'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-purple-400" />
          </div>
          <div>
            <div className="font-orbitron font-medium text-xs sm:text-base text-white tracking-[0.3em] uppercase group-hover:text-purple-300 transition-colors">
              KNOWLEDGE
            </div>
            <div className="text-[10px] font-mono-code text-slate-400 tracking-wider hidden sm:block">
              KIẾN THỨC NỀN TẢNG
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
