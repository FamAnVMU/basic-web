import React from 'react';
import { ChevronDown, Sparkles, Navigation, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { soundManager } from '../../utils/soundEffects';

interface HeroSectionProps {
  onExplore: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  const handleAction = (id: string) => {
    soundManager.playWarp();
    onExplore(id);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-start px-4 sm:px-6 lg:px-12 pt-24 pb-16 z-10"
    >
      <div className="max-w-4xl mx-auto lg:mx-0 w-full">
        {/* Futuristic Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(0,243,255,0.15)] animate-pulse-glow">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] sm:text-xs font-mono-code text-cyan-300 tracking-wider uppercase">
            HÀNH TRÌNH KHÔNG GIAN SỐ // VMU.IT.2026
          </span>
          <span className="text-cyan-500/40">|</span>
          <span className="hidden sm:inline text-[11px] font-mono-code text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> TRẠM ĐH HÀNG HẢI
          </span>
        </div>

        {/* Main Hero Title */}
        <div className="space-y-2 mb-6">
          <p className="text-xs sm:text-sm font-mono-code text-cyan-400 tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            HỆ THỐNG DANH TÍNH KỸ THUẬT SỐ
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-orbitron tracking-tight text-white leading-none">
            PHẠM AN
            <span className="block text-2xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-200 mt-2">
              FamAnVMU
            </span>
          </h1>
        </div>

        {/* Major & University Tagline */}
        <div className="relative p-5 rounded-2xl hologram-panel max-w-2xl mb-8 scanline-overlay">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f3ff] shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-cyan-200 font-mono-code">
                {PERSONAL_INFO.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                {PERSONAL_INFO.bio}
              </p>
              <div className="mt-4 pt-3 border-t border-cyan-500/20 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono-code text-slate-400">
                <span className="text-cyan-300 font-semibold">⚓ {PERSONAL_INFO.university}</span>
                <span>• {PERSONAL_INFO.location}</span>
                <span>• Khoa CNTT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <button
            onClick={() => handleAction('about')}
            className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold font-mono-code text-sm tracking-wide shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:shadow-[0_0_35px_rgba(0,243,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>KHÁM PHÁ HỒ SƠ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleAction('projects')}
            className="px-6 py-3 rounded-xl hologram-panel text-cyan-300 hover:text-white font-mono-code text-sm tracking-wide border-cyan-400/40 hover:border-cyan-400 hover:bg-cyan-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>XEM DỰ ÁN</span>
          </button>

          <button
            onClick={() => handleAction('contact')}
            className="px-5 py-3 rounded-xl border border-slate-700 hover:border-cyan-400/50 bg-slate-900/40 text-slate-300 hover:text-cyan-300 font-mono-code text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>KẾT NỐI</span>
          </button>
        </div>

        {/* Telemetry Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          {PERSONAL_INFO.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#030917]/70 border border-cyan-500/15 backdrop-blur-md"
            >
              <div className="text-[10px] font-mono-code text-cyan-400/80 uppercase">
                {stat.label}
              </div>
              <div className="text-sm sm:text-base font-bold font-orbitron text-white mt-0.5">
                {stat.value}
              </div>
              <div className="text-[10px] font-mono-code text-slate-400 truncate">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-400/70 pointer-events-none">
        <span className="text-[10px] font-mono-code tracking-widest uppercase">
          CUỘN ĐỂ DU HÀNH VŨ TRỤ
        </span>
        <div className="w-5 h-9 rounded-full border border-cyan-400/40 flex items-start justify-center p-1.5 shadow-[0_0_12px_rgba(0,243,255,0.2)]">
          <div className="w-1.5 h-2 bg-cyan-400 rounded-full animate-bounce" />
        </div>
        <ChevronDown className="w-4 h-4 animate-pulse text-cyan-400" />
      </div>
    </section>
  );
};
