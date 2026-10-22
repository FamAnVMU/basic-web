import React, { useState, useEffect } from 'react';
import type { PlanetData } from '../../data/solarSystemData';
import type { Language } from '../../data/translations';
import { TRANSLATIONS } from '../../data/translations';
import { FacebookIcon, GithubIcon, DiscordIcon } from '../ui/Icons';
import { ScrollReveal } from '../ui/ScrollReveal';
import { MobileSpaceBackground } from './MobileSpaceBackground';
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
  GraduationCap,
  MapPin,
  Calendar,
  Code,
  ArrowUp,
  Terminal,
  Cpu,
  Layers,
  Send,
  UserCheck,
  ChevronDown,
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLang];

  const vmuPlanet = planets.find((p) => p.id === 'vmu') || planets[1];
  const knowledgePlanet = planets.find((p) => p.id === 'knowledge') || planets[2];
  const goalsPlanet = planets.find((p) => p.id === 'goals') || planets[3];

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setScrollProgress(progress);
      }

      setShowBackToTop(currentScroll > 320);

      // Section tracker for sticky pills
      const sections = ['profile', 'education', 'skills', 'goals', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 100) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (text: string, key: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    try {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#00f3ff', '#38bdf8', '#a855f7', '#ffffff'],
      });
    } catch {
      // fallback
    }
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const scrollToSection = (id: string) => {
    soundManager.playClick();
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // Offset for sticky header & tab bar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Structured skill categories for interactive pills
  const skillClusters = [
    {
      category: t.mobile.skillCategories.core,
      icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
      color: 'border-purple-500/30 text-purple-300 bg-purple-950/40',
      skills: [
        'Cấu trúc dữ liệu & Giải thuật',
        'Lập trình hướng đối tượng (OOP)',
        'Cơ sở dữ liệu (SQL)',
        'Hệ điều hành & Mạng máy tính',
      ],
    },
    {
      category: t.mobile.skillCategories.languages,
      icon: <Code className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/40',
      skills: ['C / C++', 'Java', 'JavaScript', 'TypeScript', 'Python Basic'],
    },
    {
      category: t.mobile.skillCategories.tools,
      icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40',
      skills: ['React', 'HTML5 / CSS3', 'Tailwind CSS', 'Git & GitHub', 'Linux', 'VS Code'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden pb-28 relative">
      {/* Background Star Canvas & Glow Orbs */}
      <MobileSpaceBackground />

      {/* Top Scroll Reading Progress Bar */}
      <div className="fixed top-0 inset-x-0 h-[2.5px] bg-slate-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 shadow-[0_0_10px_#00f3ff] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-40 bg-[#020612]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-2.5 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
        <div
          onClick={() => scrollToSection('profile')}
          className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
        >
          {/* Avatar with subtle glow */}
          <div className="relative w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 to-sky-500 shrink-0 shadow-[0_0_10px_rgba(0,243,255,0.4)]">
            <img
              src="/avatar.jpg"
              alt="Phạm An"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="font-orbitron font-bold text-xs sm:text-sm tracking-wider text-white flex items-center gap-1.5">
              <span>PHAM AN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[9px] font-mono-code text-cyan-400 leading-none">
              VMU • K65 IT
            </div>
          </div>
        </div>

        {/* Header Actions: Language Switch & 3D Switch */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Capsule */}
          <div className="flex items-center rounded-xl bg-slate-900/90 border border-cyan-500/30 p-0.5 text-[10px] font-mono-code">
            <button
              onClick={() => {
                soundManager.playClick();
                onLanguageChange('vi');
              }}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                currentLang === 'vi'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,243,255,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onLanguageChange('en');
              }}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,243,255,0.6)]'
                  : 'text-slate-400 hover:text-white'
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono-code transition-all shadow-[0_0_12px_rgba(0,243,255,0.25)] active:scale-95 cursor-pointer"
            title={t.mobile.switchTo3D}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>3D</span>
          </button>
        </div>
      </header>

      {/* Sticky Section Jump Pill Bar */}
      <nav className="sticky top-[49px] z-30 bg-[#020612]/80 backdrop-blur-md border-b border-cyan-500/15 py-1.5 px-3 overflow-x-auto modal-scrollbar flex items-center gap-1.5 select-none">
        {[
          { id: 'profile', label: t.mobile.quickNav.profile, icon: '👤' },
          { id: 'education', label: t.mobile.quickNav.edu, icon: '⚓' },
          { id: 'skills', label: t.mobile.quickNav.skills, icon: '💡' },
          { id: 'goals', label: t.mobile.quickNav.goals, icon: '🎯' },
          { id: 'contact', label: t.mobile.quickNav.contact, icon: '📬' },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono-code whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,243,255,0.3)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Sections with Scroll-Triggered Reveal Animations */}
      <main className="px-4 py-5 max-w-xl mx-auto w-full space-y-7 relative z-10">
        {/* ========================================================= */}
        {/* 1. HERO PROFILE CARD (#profile)                          */}
        {/* ========================================================= */}
        <section id="profile" className="scroll-mt-28">
          <ScrollReveal animation="fade-up" duration={800}>
            <div className="rounded-3xl hologram-panel border border-cyan-400/50 p-5 sm:p-6 shadow-[0_0_35px_rgba(0,243,255,0.2)] relative overflow-hidden">
              {/* Decorative Corner Cyber Notch */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/20 to-transparent pointer-events-none" />

              <div className="flex flex-col items-center text-center gap-4">
                {/* Avatar with Orbital Cyan Ring */}
                <div className="relative group">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500/40 via-sky-500/20 to-purple-500/40 blur-md animate-pulse" />
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_24px_rgba(0,243,255,0.35)] shrink-0">
                    <img
                      src="/avatar.jpg"
                      alt="Phạm An - Sinh viên CNTT K65 Đại học Hàng hải Việt Nam"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Pulsing Live Status Pill */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-950 border border-emerald-400/60 text-[9px] font-mono-code text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{t.mobile.statusBadge}</span>
                  </div>
                </div>

                {/* Identity & Faculty Details */}
                <div className="space-y-2 mt-2 max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono-code">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{t.modal.studentBadge}</span>
                  </div>

                  <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white tracking-wide bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                    PHẠM AN
                  </h1>

                  <div className="text-xs font-mono-code text-cyan-300 leading-tight flex items-center justify-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{t.modal.faculty}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                    {t.modal.bio}
                  </p>
                </div>

                {/* 4-Item Cyber HUD Metrics Grid */}
                <div className="w-full grid grid-cols-2 gap-2 pt-2 text-left font-mono-code">
                  <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-cyan-500/25 space-y-0.5">
                    <div className="text-[9px] text-slate-400 flex items-center gap-1 uppercase">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>{t.mobile.metrics.major}</span>
                    </div>
                    <div className="text-xs font-semibold text-cyan-200 truncate">
                      {t.mobile.metrics.majorVal}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-cyan-500/25 space-y-0.5">
                    <div className="text-[9px] text-slate-400 flex items-center gap-1 uppercase">
                      <Calendar className="w-3 h-3 text-sky-400" />
                      <span>{t.mobile.metrics.cohort}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-100 truncate">
                      {t.mobile.metrics.cohortVal}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-cyan-500/25 space-y-0.5">
                    <div className="text-[9px] text-slate-400 flex items-center gap-1 uppercase">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>{t.mobile.metrics.stage}</span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-300 truncate">
                      {t.mobile.metrics.stageVal}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-cyan-500/25 space-y-0.5">
                    <div className="text-[9px] text-slate-400 flex items-center gap-1 uppercase">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{t.mobile.metrics.location}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-100 truncate">
                      {t.mobile.metrics.locationVal}
                    </div>
                  </div>
                </div>

                {/* Honest Experience Disclaimer Box */}
                <div className="w-full p-3 rounded-2xl bg-cyan-950/35 border border-cyan-500/25 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed text-left">
                  <span className="text-cyan-400 font-bold shrink-0 mt-0.5">ℹ️</span>
                  <span>{t.mobile.disclaimer}</span>
                </div>

                {/* Quick Action Contact Links */}
                <div className="w-full grid grid-cols-2 gap-2 text-xs font-mono-code pt-1">
                  <button
                    onClick={() => handleCopy('phama6372@gmail.com', 'hero-email')}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-all hover:bg-cyan-950/60 active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">Email An</span>
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
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-all hover:bg-slate-800/80 active:scale-95 cursor-pointer"
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
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-all hover:bg-blue-950/40 active:scale-95 cursor-pointer"
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
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-between gap-1 text-slate-200 transition-all hover:bg-indigo-950/40 active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <DiscordIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Discord</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </a>
                </div>

                {/* Gentle Scroll Down Indicator */}
                <div
                  onClick={() => scrollToSection('education')}
                  className="pt-2 flex flex-col items-center gap-1 text-[10px] font-mono-code text-cyan-400/80 cursor-pointer animate-bounce"
                >
                  <span>{t.mobile.scrollDownHint}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* 2. EDUCATION & ACADEMIC BACKGROUND (#education)          */}
        {/* ========================================================= */}
        <section id="education" className="scroll-mt-28 space-y-4">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="rounded-3xl hologram-panel border border-amber-500/30 p-5 space-y-4 shadow-[0_0_25px_rgba(245,158,11,0.12)]">
              {/* Header Title */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950/70 border border-amber-400/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
                  <Anchor className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-amber-400 uppercase tracking-widest">
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
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-amber-500/20 text-xs font-mono-code">
                {vmuPlanet.telemetry.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="text-[9px] text-slate-400 tracking-wider uppercase">
                      {item.label}
                    </div>
                    <div className="text-amber-200 font-medium text-[11px] truncate">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Satellites Cards Staggered */}
              <div className="space-y-2 pt-1">
                {vmuPlanet.satellites.map((sat, idx) => (
                  <ScrollReveal
                    key={sat.id}
                    animation="fade-up"
                    delay={idx * 90}
                    duration={600}
                  >
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-400/50 space-y-1 transition-colors">
                      <div className="font-orbitron font-semibold text-xs text-amber-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                        <span>{sat.title}</span>
                      </div>
                      <div className="text-[10px] font-mono-code text-slate-400">
                        {sat.subtitle}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {sat.detail}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* 3. COMPUTER SCIENCE FOUNDATIONS & SKILLS (#skills)        */}
        {/* ========================================================= */}
        <section id="skills" className="scroll-mt-28 space-y-4">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="rounded-3xl hologram-panel border border-purple-500/30 p-5 space-y-4 shadow-[0_0_25px_rgba(168,85,247,0.12)]">
              {/* Header Title */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-950/70 border border-purple-400/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-purple-400 uppercase tracking-widest">
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
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-purple-500/20 text-xs font-mono-code">
                {knowledgePlanet.telemetry.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="text-[9px] text-slate-400 tracking-wider uppercase">
                      {item.label}
                    </div>
                    <div className="text-purple-300 font-medium text-[11px] truncate">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Skill Clusters */}
              <div className="space-y-3 pt-1">
                {skillClusters.map((cluster, cIdx) => (
                  <ScrollReveal
                    key={cIdx}
                    animation="fade-up"
                    delay={cIdx * 100}
                    duration={600}
                  >
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300">
                        {cluster.icon}
                        <span className="font-semibold text-white">{cluster.category}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cluster.skills.map((skill, sIdx) => {
                          const isPicked = selectedSkill === skill;
                          return (
                            <button
                              key={sIdx}
                              onClick={() => {
                                soundManager.playClick();
                                setSelectedSkill(isPicked ? null : skill);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-code transition-all cursor-pointer border ${
                                isPicked
                                  ? 'bg-purple-500 text-white font-bold border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.6)] scale-105'
                                  : cluster.color
                              }`}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Coursework Modules Staggered */}
              <div className="space-y-2 pt-1">
                {knowledgePlanet.satellites.map((sat, idx) => (
                  <ScrollReveal
                    key={sat.id}
                    animation="fade-up"
                    delay={idx * 80}
                    duration={600}
                  >
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-400/50 space-y-1 transition-colors">
                      <div className="font-orbitron font-semibold text-xs text-purple-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
                        <span>{sat.title}</span>
                      </div>
                      <div className="text-[10px] font-mono-code text-slate-400">
                        {sat.subtitle}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {sat.detail}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* 4. YEAR 3 GOALS & ROADMAP (#goals)                       */}
        {/* ========================================================= */}
        <section id="goals" className="scroll-mt-28 space-y-4">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="rounded-3xl hologram-panel border border-emerald-500/30 p-5 space-y-4 shadow-[0_0_25px_rgba(16,185,129,0.12)]">
              {/* Header Title */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-950/70 border border-emerald-400/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-widest">
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

              {/* Futuristic Stepped Growth Roadmap */}
              <div className="p-4 rounded-2xl bg-slate-950/75 border border-emerald-500/25 space-y-3">
                <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider font-semibold">
                  {t.mobile.roadmap.title}
                </div>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-emerald-500/30">
                  {/* Step 01 */}
                  <div className="relative pl-7 space-y-0.5">
                    <span className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-[8px] font-bold text-emerald-300 -translate-x-1/2">
                      1
                    </span>
                    <div className="font-orbitron font-semibold text-xs text-emerald-300">
                      {t.mobile.roadmap.step1Title}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {t.mobile.roadmap.step1Desc}
                    </p>
                  </div>

                  {/* Step 02 */}
                  <div className="relative pl-7 space-y-0.5">
                    <span className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-[8px] font-bold text-emerald-300 -translate-x-1/2">
                      2
                    </span>
                    <div className="font-orbitron font-semibold text-xs text-emerald-300">
                      {t.mobile.roadmap.step2Title}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {t.mobile.roadmap.step2Desc}
                    </p>
                  </div>

                  {/* Step 03 */}
                  <div className="relative pl-7 space-y-0.5">
                    <span className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-emerald-300 shadow-[0_0_8px_#10b981] flex items-center justify-center text-[8px] font-bold text-slate-950 -translate-x-1/2">
                      3
                    </span>
                    <div className="font-orbitron font-semibold text-xs text-emerald-200">
                      {t.mobile.roadmap.step3Title}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {t.mobile.roadmap.step3Desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights Checklist */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 text-xs">
                <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider">
                  {t.modal.highlights}
                </div>
                {goalsPlanet.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                    <span className="text-emerald-400 font-bold mt-0.5">›</span>
                    <span className="leading-relaxed font-sans">{item}</span>
                  </div>
                ))}
              </div>

              {/* Goals Cards Staggered */}
              <div className="space-y-2 pt-1">
                {goalsPlanet.satellites.map((sat, idx) => (
                  <ScrollReveal
                    key={sat.id}
                    animation="fade-up"
                    delay={idx * 80}
                    duration={600}
                  >
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-400/50 space-y-1 transition-colors">
                      <div className="font-orbitron font-semibold text-xs text-emerald-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                        <span>{sat.title}</span>
                      </div>
                      <div className="text-[10px] font-mono-code text-slate-400">
                        {sat.subtitle}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {sat.detail}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* 5. OFFICIAL CONTACT CHANNELS (#contact)                  */}
        {/* ========================================================= */}
        <section id="contact" className="scroll-mt-28 space-y-4">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="rounded-3xl hologram-panel border border-cyan-400/50 p-5 space-y-4 shadow-[0_0_35px_rgba(0,243,255,0.2)]">
              {/* Header Title */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-950/70 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)] shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest">
                    {t.mobile.contactSection}
                  </div>
                  <h2 className="text-lg font-bold font-orbitron text-white">
                    {t.modal.officialChannels}
                  </h2>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t.mobile.contactPrompt}
              </p>

              {/* Direct Interactive Cards */}
              <div className="space-y-2.5 text-xs">
                {/* Email Special Box with Copy & Send Button */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/35 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono-code text-slate-400">EMAIL</div>
                        <div className="text-white font-medium text-xs sm:text-sm font-mono-code">
                          phama6372@gmail.com
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 font-mono-code">
                    <button
                      onClick={() => handleCopy('phama6372@gmail.com', 'contact-email')}
                      className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                    >
                      {copiedKey === 'contact-email' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">{t.modal.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t.modal.copyEmail}</span>
                        </>
                      )}
                    </button>

                    <a
                      href="mailto:phama6372@gmail.com"
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/50 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.mobile.sendMail}</span>
                    </a>
                  </div>
                </div>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/pham.an.123114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/25 hover:border-cyan-400 flex items-center justify-between transition-all hover:bg-blue-950/30 active:scale-98"
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
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/25 hover:border-cyan-400 flex items-center justify-between transition-all hover:bg-indigo-950/30 active:scale-98"
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

                {/* GitHub */}
                <a
                  href="https://github.com/FamAnVMU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/25 hover:border-cyan-400 flex items-center justify-between transition-all hover:bg-slate-800/60 active:scale-98"
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
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Floating Bottom Quick Action Bar for Mobile */}
      <div className="fixed bottom-4 inset-x-4 z-40 max-w-md mx-auto flex items-center justify-between p-2 rounded-2xl bg-[#020612]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
        {/* Switch to 3D Space Button */}
        <button
          onClick={() => {
            soundManager.playWarp();
            onSwitchTo3D();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-300 text-slate-950 font-bold text-xs font-mono-code shadow-[0_0_16px_rgba(0,243,255,0.5)] active:scale-95 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>{t.mobile.switchTo3D}</span>
        </button>

        {/* Back to Top Quick Button (Visible when scrolled) */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="ml-2 p-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950 transition-all cursor-pointer shadow-md"
            title={t.mobile.backToTop}
            aria-label={t.mobile.backToTop}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Floating Language Switcher Capsule */}
        <div className="ml-2 flex items-center rounded-xl bg-slate-900 border border-cyan-500/30 p-1 text-xs font-mono-code shrink-0">
          <Globe className="w-3.5 h-3.5 text-cyan-400 mr-1 ml-0.5" />
          <button
            onClick={() => onLanguageChange('vi')}
            className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
              currentLang === 'vi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            VI
          </button>
          <span className="text-cyan-500/30 px-0.5">|</span>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
              currentLang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] font-mono-code text-slate-500 px-4 mt-8 pb-4">
        {t.mobile.footerText}
      </footer>
    </div>
  );
};
