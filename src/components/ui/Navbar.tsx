import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Terminal, Radio } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import { GithubIcon } from './Icons';

interface NavbarProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSection, onNavigate }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(soundManager.getMutedState());

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: '01 // VŨ TRỤ', short: 'Vũ Trụ' },
    { id: 'about', label: '02 // HỒ SƠ', short: 'Hồ Sơ' },
    { id: 'skills', label: '03 // KỸ NĂNG', short: 'Kỹ Năng' },
    { id: 'projects', label: '04 // DỰ ÁN', short: 'Dự Án' },
    { id: 'journey', label: '05 // HÀNH TRÌNH', short: 'Hành Trình' },
    { id: 'contact', label: '06 // LIÊN HỆ', short: 'Liên Hệ' },
  ];

  const handleNavClick = (id: string) => {
    soundManager.playWarp();
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const handleSoundToggle = () => {
    const newState = soundManager.toggleMute();
    setIsMuted(newState);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#02040a]/85 backdrop-blur-md border-b border-cyan-500/20 py-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Callsign */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group text-left cursor-pointer"
          aria-label="Về đầu trang"
        >
          <div className="relative w-9 h-9 rounded-lg bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center overflow-hidden group-hover:border-cyan-400 transition-colors">
            <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/25 transition-colors" />
            <Terminal className="w-4 h-4 text-cyan-400 relative z-10" />
            <div className="absolute inset-0 border border-cyan-400/30 rounded-lg animate-ping opacity-25" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-sm tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                PHAM AN
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded">
                VMU.IT
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYS: ONLINE</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-code tracking-wider transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f3ff]" />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right HUD Controls: Sound Toggle, GitHub, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer Control */}
          <button
            onClick={handleSoundToggle}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono-code transition-all cursor-pointer ${
              !isMuted
                ? 'border-cyan-400/60 bg-cyan-950/50 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title={!isMuted ? 'Tắt âm thanh không gian' : 'Bật âm thanh không gian tương tác (Web Audio Synth)'}
            aria-label="Chuyển đổi âm thanh vũ trụ"
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline text-[11px]">AUDIO: ON</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3.5 bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline text-[11px]">AUDIO: OFF</span>
              </>
            )}
          </button>

          {/* GitHub Direct Link */}
          <a
            href="https://github.com/FamAnVMU"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/30 transition-all"
            aria-label="GitHub FamAnVMU"
            title="GitHub: FamAnVMU"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-cyan-500/30 bg-slate-900/60 text-cyan-400 hover:bg-cyan-950/40 transition-colors"
            aria-label="Mở menu điều hướng"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown HUD Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-cyan-500/30 bg-[#02040a]/95 backdrop-blur-xl px-4 py-4 space-y-2 mt-2 shadow-[0_12px_40px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 text-[11px] font-mono-code text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              ĐIỀU HƯỚNG TỌA ĐỘ VŨ TRỤ
            </span>
            <span>SEC: {currentSection.toUpperCase()}</span>
          </div>
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono-code tracking-wider text-left transition-colors ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-400/50'
                    : 'text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f3ff]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
