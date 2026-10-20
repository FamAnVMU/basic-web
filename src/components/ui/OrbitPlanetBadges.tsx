import React from 'react';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import type { PlanetData } from '../../data/solarSystemData';
import { soundManager } from '../../utils/soundEffects';

interface OrbitPlanetBadgesProps {
  activePlanetId: string;
  onSelectPlanet: (id: string, openDetails?: boolean) => void;
}

export const OrbitPlanetBadges: React.FC<OrbitPlanetBadgesProps> = ({
  activePlanetId,
  onSelectPlanet,
}) => {
  const activePlanet =
    SOLAR_PLANETS.find((p) => p.id === activePlanetId) || SOLAR_PLANETS[0];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    onSelectPlanet(activePlanet.id, true); // Bấm vào badge HUD để mở thông tin chi tiết
  };

  const getPlanetBadgeInfo = (planet: PlanetData) => {
    switch (planet.id) {
      case 'home':
        return {
          title: 'PHAM AN',
          subtitle: 'HÀNH TINH TRUNG TÂM',
        };
      case 'vmu':
        return {
          title: 'VMU ORBIT',
          subtitle: 'ĐẠI HỌC HÀNG HẢI',
        };
      case 'knowledge':
        return {
          title: 'KNOWLEDGE',
          subtitle: 'KIẾN THỨC NỀN TẢNG',
        };
      case 'goals':
        return {
          title: 'FUTURE GOALS',
          subtitle: 'MỤC TIÊU NĂM 3',
        };
      case 'contact':
        return {
          title: 'CONNECTION',
          subtitle: 'LIÊN HỆ & KẾT NỐI',
        };
      default:
        return {
          title: planet.name.toUpperCase(),
          subtitle: planet.navLabel.toUpperCase(),
        };
    }
  };

  const badgeInfo = getPlanetBadgeInfo(activePlanet);

  return (
    <div className="pointer-events-none absolute left-4 sm:left-12 top-[58%] -translate-y-1/2 z-20 select-none">
      {/* Dynamic Active Planet HUD Badge - Tự động luân chuyển theo hành tinh hiện tại */}
      <button
        onClick={handleClick}
        className="pointer-events-auto group flex items-center gap-3 sm:gap-3.5 transition-all duration-500 transform hover:scale-105 cursor-pointer text-left"
        title={`Đang tại hành tinh ${activePlanet.name}. Bấm để xem thông tin chi tiết.`}
      >
        {/* Dynamic Glowing Orbit Dot */}
        <div
          className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-500 flex items-center justify-center shrink-0"
          style={{
            borderColor: activePlanet.color,
            backgroundColor: `${activePlanet.color}25`,
            boxShadow: `0 0 22px ${activePlanet.glowColor}`,
          }}
        >
          <div
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-500"
            style={{
              backgroundColor: activePlanet.glowColor,
            }}
          />
        </div>

        {/* Dynamic Planet Title & Subtitle */}
        <div className="transition-all duration-500">
          <div className="font-orbitron font-medium text-xs sm:text-base text-white tracking-[0.25em] sm:tracking-[0.3em] uppercase group-hover:text-cyan-300 transition-colors">
            {badgeInfo.title}
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono-code text-slate-400 tracking-wider">
            {badgeInfo.subtitle}
          </div>
        </div>
      </button>
    </div>
  );
};
