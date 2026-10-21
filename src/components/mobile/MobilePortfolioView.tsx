import React, { useState } from 'react';
import type { PlanetData } from '../../data/solarSystemData';
import type { Language } from '../../data/translations';
import { TRANSLATIONS } from '../../data/translations';
import { FacebookIcon, GithubIcon, DiscordIcon } from '../ui/Icons';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Anchor,
  BookOpen,
  Target,
  Sparkles,
  Globe,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface MobilePortfolioViewProps {
  planets: PlanetData[];
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onSwitchTo3D: () => void;
}

export const MobilePortfolioView: React.FC<MobilePortfolioViewProps> = ({
  planets,
  currentLang,
  onLanguageChange,
  onSwitchTo3D,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const t = TRANSLATIONS[currentLang];

  const vmuPlanet = planets.find((p) => p.id === 'vmu') || planets[1];
  const knowledgePlanet = planets.find((p) => p.id === 'knowledge') || planets[2];
  const goalsPlanet = planets.find((p) => p.id === 'goals') || planets[3];

  const handleCopy = (text: string, key: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch {
      // fallback
    }
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden pb-24">
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-30 bg-[#020612]/95 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/50 shrink-0">
            <img src="/avatar.jpg" alt="Phạm An" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-orbitron font-bold text-sm tracking-wider text-white">PHAM AN</div>
            <div className="text-[9px] font-mono-code text-cyan-400 leading-none">VMU • K65 IT</div>
          </div>
        </div>

        {/* Header Actions: Language Switch & 3D Mode */}
        <div className="flex items-center gap-2">
          {/* Quick Language Toggle */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-cyan-500/30 p-0.5 text-[11px] font-mono-code">
            <button
              onClick={() => {
                soundManager.playClick();
                onLanguageChange('vi');
              }}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                currentLang === 'vi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onLanguageChange('en');
              }}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                currentLang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              EN
            </button>
          </div>

          {/* Switch to 3D Space Mode Button */}
          <button
            onClick={() => {
              soundManager.playWarp();
              onSwitchTo3D();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 text-xs font-mono-code transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)]"
            title={t.mobile.switchTo3D}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="hidden xs:inline">3D</span>
          </button>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="px-4 py-5 max-w-2xl mx-auto w-full space-y-6">
        {/* 1. Hero Profile Card */}
        <section className="rounded-3xl hologram-panel border border-cyan-400/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(0,243,255,0.3)] shrink-0">
              <img
                src="/avatar.jpg"
                alt="Phạm An - Sinh viên CNTT K65 ĐH Hàng hải Việt Nam"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono-code">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{t.modal.studentBadge}</span>
              </div>

              <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                PHẠM AN
              </h1>

              <div className="text-xs font-mono-code text-cyan-300 leading-tight">
                {t.modal.faculty}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {t.modal.bio}
              </p>
            </div>
          </div>

          {/* Honest Experience Disclaimer */}
          <div className="mt-4 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/25 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
            <span className="text-cyan-400 font-bold shrink-0 mt-0.5">ℹ️</span>
            <span>{t.mobile.disclaimer}</span>
          </div>

          {/* Quick Contact Action Chips */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono-code">
            <button
              onClick={() => handleCopy('phama6372@gmail.com', 'hero-email')}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Email</span>
              </div>
              {copiedKey === 'hero-email' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            <a
              href="https://github.com/FamAnVMU"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <GithubIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="truncate">GitHub</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </a>

            <a
              href="https://www.facebook.com/pham.an.123114"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <FacebookIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Facebook</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </a>

            <a
              href="https://discord.com/users/846953344903282758"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <DiscordIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">Discord</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </a>
          </div>
        </section>

        {/* 2. Education & Academic Background */}
        <section className="rounded-3xl hologram-panel border border-cyan-500/25 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-400/40 text-amber-400">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code text-amber-400 uppercase tracking-wider">
                {t.mobile.eduSection}
              </div>
              <h2 className="text-lg font-bold font-orbitron text-white">
                {vmuPlanet.name}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {vmuPlanet.description}
          </p>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/20 text-xs font-mono-code">
            {vmuPlanet.telemetry.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="text-[9px] text-slate-400 tracking-wider uppercase">{item.label}</div>
                <div className="text-slate-100 font-medium text-[11px] truncate">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Satellites Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {vmuPlanet.satellites.map((sat) => (
              <div
                key={sat.id}
                className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-1"
              >
                <div className="font-orbitron font-semibold text-xs text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{sat.title}</span>
                </div>
                <div className="text-[10px] font-mono-code text-slate-400">{sat.subtitle}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{sat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Computer Science Foundations */}
        <section className="rounded-3xl hologram-panel border border-cyan-500/25 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-400/40 text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code text-purple-400 uppercase tracking-wider">
                {t.mobile.skillsSection}
              </div>
              <h2 className="text-lg font-bold font-orbitron text-white">
                {knowledgePlanet.name}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {knowledgePlanet.description}
          </p>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/20 text-xs font-mono-code">
            {knowledgePlanet.telemetry.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="text-[9px] text-slate-400 tracking-wider uppercase">{item.label}</div>
                <div className="text-purple-300 font-medium text-[11px] truncate">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Coursework Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {knowledgePlanet.satellites.map((sat) => (
              <div
                key={sat.id}
                className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-1"
              >
                <div className="font-orbitron font-semibold text-xs text-purple-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span>{sat.title}</span>
                </div>
                <div className="text-[10px] font-mono-code text-slate-400">{sat.subtitle}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{sat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Year 3 Goals & Internship */}
        <section className="rounded-3xl hologram-panel border border-cyan-500/25 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider">
                {t.mobile.goalsSection}
              </div>
              <h2 className="text-lg font-bold font-orbitron text-white">
                {goalsPlanet.name}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {goalsPlanet.description}
          </p>

          {/* Highlights */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/20 text-xs">
            <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider mb-1">
              {t.modal.highlights}
            </div>
            {goalsPlanet.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold mt-0.5">›</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Goals Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {goalsPlanet.satellites.map((sat) => (
              <div
                key={sat.id}
                className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-1"
              >
                <div className="font-orbitron font-semibold text-xs text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{sat.title}</span>
                </div>
                <div className="text-[10px] font-mono-code text-slate-400">{sat.subtitle}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{sat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Official Contact Channels */}
        <section className="rounded-3xl hologram-panel border border-cyan-400/40 p-5 space-y-4">
          <div className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest">
            {t.mobile.contactSection}
          </div>

          <h2 className="text-lg font-bold font-orbitron text-white">
            {t.modal.officialChannels}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/pham.an.123114"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400">
                  <FacebookIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400">FACEBOOK</div>
                  <div className="text-white font-medium">pham.an.123114</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>

            {/* Discord */}
            <a
              href="https://discord.com/users/846953344903282758"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400">
                  <DiscordIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400">DISCORD</div>
                  <div className="text-white font-medium">FamAnVMU</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>

            {/* Email with copy */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400">EMAIL</div>
                  <div className="text-white font-medium">phama6372@gmail.com</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy('phama6372@gmail.com', 'footer-email')}
                className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors cursor-pointer"
                title={t.modal.copyEmail}
              >
                {copiedKey === 'footer-email' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/FamAnVMU"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400">GITHUB</div>
                  <div className="text-white font-medium">FamAnVMU</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>
          </div>
        </section>
      </main>

      {/* Floating Bottom Action Bar for Mobile */}
      <div className="fixed bottom-4 inset-x-4 z-40 max-w-md mx-auto flex items-center justify-between p-2 rounded-2xl bg-[#020612]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
        {/* Switch to 3D Space Button */}
        <button
          onClick={() => {
            soundManager.playWarp();
            onSwitchTo3D();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs font-mono-code shadow-[0_0_15px_rgba(0,243,255,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>{t.mobile.switchTo3D}</span>
        </button>

        {/* Floating Language Switcher */}
        <div className="ml-2 flex items-center rounded-xl bg-slate-900 border border-cyan-500/30 p-1 text-xs font-mono-code shrink-0">
          <Globe className="w-3.5 h-3.5 text-cyan-400 mr-1 ml-0.5" />
          <button
            onClick={() => onLanguageChange('vi')}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              currentLang === 'vi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            VI
          </button>
          <span className="text-cyan-500/30 px-0.5">|</span>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              currentLang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] font-mono-code text-slate-500 px-4 mt-6">
        {t.mobile.footerText}
      </footer>
    </div>
  );
};
