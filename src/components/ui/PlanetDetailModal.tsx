import React, { useState, useEffect } from 'react';
import { X, Check, Copy, ExternalLink, Mail, Anchor, BookOpen, Target, Send, User } from 'lucide-react';
import type { PlanetData } from '../../data/solarSystemData';
import { FacebookIcon, GithubIcon, DiscordIcon } from './Icons';
import { ConstellationCanvas } from './ConstellationCanvas';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';
import { TRANSLATIONS } from '../../data/translations';
import type { Language } from '../../data/translations';

interface PlanetDetailModalProps {
  planet: PlanetData;
  onClose: () => void;
  onSelectPlanet: (id: string) => void;
  currentLang?: Language;
}

export const PlanetDetailModal: React.FC<PlanetDetailModalProps> = ({
  planet,
  onClose,
  currentLang = 'vi',
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const t = TRANSLATIONS[currentLang].modal;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = (text: string, key: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfetti = () => {
    soundManager.playWarp();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#38bdf8', '#c084fc', '#ffffff'],
      });
    } catch {
      // fallback
    }
  };

  const getPlanetIcon = (id: string) => {
    switch (id) {
      case 'home':
        return <User className="w-5 h-5 text-cyan-400" />;
      case 'vmu':
        return <Anchor className="w-5 h-5 text-amber-400" />;
      case 'knowledge':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'goals':
        return <Target className="w-5 h-5 text-emerald-400" />;
      case 'contact':
        return <Send className="w-5 h-5 text-rose-400" />;
      default:
        return null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      title={t.closeHint}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-2xl rounded-3xl hologram-panel border border-cyan-400/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,243,255,0.25)] max-h-[85vh] overflow-y-auto modal-scrollbar cursor-default select-text"
      >
        {/* Interactive Constellation / Particle Network Background */}
        <ConstellationCanvas mouseX={mousePos?.x} mouseY={mousePos?.y} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/80 hover:border-cyan-300 hover:text-white transition-all cursor-pointer z-20 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          aria-label={t.closeWindow}
          title={t.closeHint}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-5">
          {/* Modal Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40">
              {getPlanetIcon(planet.id)}
            </div>
            <div>
              <div className="text-[10px] font-mono-code text-cyan-400 tracking-widest uppercase">
                {t.planetInfo}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-orbitron text-white">
                {planet.name}
              </h2>
            </div>
          </div>

          {/* Home / Avatar Special Layout */}
          {planet.id === 'home' && (
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/20">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,243,255,0.3)] shrink-0">
                <img
                  src="/avatar.jpg"
                  alt="Phạm An - Sinh viên CNTT K65 Đại học Hàng hải Việt Nam"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold font-orbitron text-white">PHẠM AN</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    {t.studentBadge}
                  </span>
                </div>
                <div className="text-xs font-mono-code text-cyan-300">
                  {t.faculty}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {t.bio}
                </p>
              </div>
            </div>
          )}

          {/* Main Description */}
          <div className="space-y-3">
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {planet.description}
            </p>

            {/* Highlights */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/50 border border-cyan-500/15 text-xs">
              <div className="text-[11px] font-mono-code text-cyan-400 uppercase tracking-wider font-semibold">
                {t.highlights}
              </div>
              {planet.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-400 font-bold mt-0.5">›</span>
                  <span className="leading-relaxed font-sans">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-modules / Satellites Cards */}
          {planet.satellites && planet.satellites.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono-code text-cyan-400 uppercase tracking-wider font-semibold">
                {currentLang === 'vi' ? 'NỘI DUNG CHI TIẾT:' : 'KEY DETAILS:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {planet.satellites.map((sat) => (
                  <div
                    key={sat.id}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors space-y-1"
                  >
                    <div className="font-orbitron font-semibold text-xs text-cyan-300 flex items-center justify-between">
                      <span className="truncate">{sat.title}</span>
                      {sat.link && (
                        <a
                          href={sat.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-white p-0.5"
                          onClick={(e) => e.stopPropagation()}
                          title="Mở liên kết"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-[10px] font-mono-code text-slate-400">
                      {sat.subtitle}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {sat.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Links Box */}
          <div className="pt-4 border-t border-cyan-500/20">
            <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-3">
              {t.officialChannels}:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/pham.an.123114"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleConfetti}
                className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400 flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-950/80 text-blue-400">
                    <FacebookIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code text-slate-400">FACEBOOK</div>
                    <div className="text-white font-medium">pham.an.123114</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Discord */}
              <a
                href="https://discord.com/users/846953344903282758"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleConfetti}
                className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400 flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400">
                    <DiscordIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code text-slate-400">DISCORD</div>
                    <div className="text-white font-medium">FamAnVMU</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Email with 1-click copy */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code text-slate-400">EMAIL</div>
                    <div className="text-white font-medium truncate max-w-[150px]">
                      phama6372@gmail.com
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('phama6372@gmail.com', 'email')}
                  className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors cursor-pointer"
                  title={t.copyEmail}
                >
                  {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/FamAnVMU"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleConfetti}
                className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400 flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-200">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code text-slate-400">GITHUB</div>
                    <div className="text-white font-medium">FamAnVMU</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
