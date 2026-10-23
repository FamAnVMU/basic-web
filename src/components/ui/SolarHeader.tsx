import React from 'react';
import type { PlanetData } from '../../data/solarSystemData';
import type { Language } from '../../data/translations';
import { TRANSLATIONS } from '../../data/translations';
import { soundManager } from '../../utils/soundEffects';
import { Volume2, VolumeX, Info, Sparkles, Globe2, Compass } from 'lucide-react';

interface SolarHeaderProps {
  activePlanet: PlanetData;
  onSelectPlanet: (id: string) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenDetails: () => void;
  isOverview: boolean;
  onToggleOverview: () => void;
  currentLang?: Language;
}

export const SolarHeader: React.FC<SolarHeaderProps> = ({
  activePlanet,
  onSelectPlanet,
  isMuted,
  onToggleSound,
  onOpenDetails,
  isOverview,
  onToggleOverview,
  currentLang = 'vi',
}) => {
  const t = TRANSLATIONS[currentLang];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundManager.playClick();
    onSelectPlanet(id);
  };

  return (
    <header
      onClick={(e) => e.stopPropagation()}
      className="relative z-30 pt-4 sm:pt-5 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none"
    >
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between text-xs tracking-wider text-slate-300 font-sans">
        {/* Left Nav: Home, About, Contact */}
        <div className="flex items-center gap-5 sm:gap-8">
          <button
            onClick={(e) => handleNavClick(e, 'home')}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              activePlanet.id === 'home' && !isOverview ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="hover:text-cyan-300 transition-colors cursor-pointer text-slate-300"
          >
            {t.nav.about}
          </button>
          <button
            onClick={(e) => handleNavClick(e, 'contact')}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              activePlanet.id === 'contact' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {t.nav.contact}
          </button>
        </div>

        {/* Center Brand / Logo: P H A M   A N // V M U */}
        <div
          className="text-center cursor-pointer"
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <div className="font-orbitron font-extrabold tracking-[0.25em] text-white text-sm sm:text-base leading-none">
            PHAM AN
          </div>
          <div className="font-mono-code text-[9px] text-cyan-400 tracking-[0.3em] uppercase mt-0.5">
            VMU . IT
          </div>
        </div>

        {/* Right Nav: VMU, Knowledge, Goals + Sound */}
        <div className="flex items-center gap-4 sm:gap-7">
          <button
            onClick={(e) => handleNavClick(e, 'vmu')}
            className={`hidden sm:inline hover:text-cyan-300 transition-colors cursor-pointer ${
              activePlanet.id === 'vmu' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {t.nav.vmu}
          </button>
          <button
            onClick={(e) => handleNavClick(e, 'knowledge')}
            className={`hidden sm:inline hover:text-cyan-300 transition-colors cursor-pointer ${
              activePlanet.id === 'knowledge' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {t.nav.knowledge}
          </button>
          <button
            onClick={(e) => handleNavClick(e, 'goals')}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              activePlanet.id === 'goals' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {t.nav.goals}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSound();
            }}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            title={isMuted ? t.header.soundOff : t.header.soundOn}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Hero Display Title: Clean & Balanced */}
      <div className="text-center mt-2.5 sm:mt-3.5 transition-all duration-500">
        <h1 className="font-orbitron font-bold text-lg sm:text-2xl lg:text-3xl text-white tracking-[0.08em] sm:tracking-[0.14em] uppercase text-cyan-glow-subtle">
          {activePlanet.displayTitle}
        </h1>
        <p className="text-[10px] sm:text-xs font-sans text-cyan-300/90 tracking-wide mt-1">
          {activePlanet.subtitle}
        </p>
      </div>

      {/* Horizontal Quick Info Bar - Centered & Glass-Frosted */}
      <div className="mt-2.5 sm:mt-3 flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1 px-4 sm:px-6 py-1.5 rounded-2xl bg-[#020612]/75 backdrop-blur-md border border-cyan-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          {activePlanet.telemetry.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-center">
              <span className="text-[9px] sm:text-[10px] font-mono-code text-cyan-400/80 uppercase">
                {item.label}:
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-100">
                {item.value}
              </span>
              {idx < activePlanet.telemetry.length - 1 && (
                <span className="hidden sm:inline-block text-cyan-500/30 ml-3 sm:ml-4 font-thin select-none">|</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Control Bar: Switch between Focus & Overview */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-3">
        {/* Toggle Overview / Focus Button */}
        <button
          onClick={onToggleOverview}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono-code transition-all cursor-pointer ${
            isOverview
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'bg-slate-900/80 hover:bg-cyan-950/70 border border-cyan-400/35 text-cyan-300 hover:text-white'
          }`}
          title={t.header.viewTooltip}
        >
          {isOverview ? <Globe2 className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5" />}
          <span>{isOverview ? t.header.inOverview : t.header.backToOverview}</span>
        </button>

        {/* Open Details Button */}
        <button
          onClick={onOpenDetails}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono-code transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)] cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.header.dossierDetails}</span>
          <Sparkles className="w-3 h-3 text-cyan-400" />
        </button>
      </div>
    </header>
  );
};
