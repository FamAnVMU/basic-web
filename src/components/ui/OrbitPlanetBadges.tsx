import React from 'react';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import type { PlanetData } from '../../data/solarSystemData';
import { soundManager } from '../../utils/soundEffects';
import { TRANSLATIONS } from '../../data/translations';
import type { Language } from '../../data/translations';

interface OrbitPlanetBadgesProps {
  activePlanetId: string;
  onSelectPlanet: (id: string, openDetails?: boolean) => void;
  planets?: PlanetData[];
  currentLang?: Language;
}

export const OrbitPlanetBadges: React.FC<OrbitPlanetBadgesProps> = ({
  activePlanetId,
  onSelectPlanet,
  planets = SOLAR_PLANETS,
  currentLang = 'vi',
}) => {
  const activePlanet =
    planets.find((p) => p.id === activePlanetId) || planets[0];

  const t = TRANSLATIONS[currentLang].badges;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    onSelectPlanet(activePlanet.id, true); // Bấm vào badge HUD để mở thông tin chi tiết
  };

  const getPlanetBadgeInfo = (planet: PlanetData) => {
    switch (planet.id) {
      case 'home':
        return {
          title: t.homeTitle,
          subtitle: t.homeSub,
        };
      case 'vmu':
        return {
          title: t.vmuTitle,
          subtitle: t.vmuSub,
        };
      case 'knowledge':
        return {
          title: t.knowledgeTitle,
          subtitle: t.knowledgeSub,
        };
      case 'goals':
        return {
          title: t.goalsTitle,
          subtitle: t.goalsSub,
        };
      case 'contact':
        return {
          title: t.contactTitle,
          subtitle: t.contactSub,
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
        className="pointer-events-auto group flex items-center gap-3 sm:gap-3.5 px-3.5 py-2.5 rounded-2xl bg-[#020612]/80 backdrop-blur-md border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 transform hover:scale-105 hover:border-cyan-400/50 cursor-pointer text-left"
        title={t.badgeHint.replace('{name}', activePlanet.name)}
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
          <div className="font-orbitron font-semibold text-xs sm:text-base text-white tracking-[0.1em] sm:tracking-[0.15em] uppercase group-hover:text-cyan-300 transition-colors">
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
