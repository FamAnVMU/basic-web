import React, { useState, useEffect, useCallback } from 'react';
import { SpaceCanvas } from './components/canvas/SpaceCanvas';
import { Navbar } from './components/ui/Navbar';
import { HudRadar } from './components/ui/HudRadar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { JourneySection } from './components/sections/JourneySection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/ui/Footer';

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<string>('hero');

  const sectionIds = ['hero', 'about', 'skills', 'projects', 'journey', 'contact'];

  // Track overall scroll progress for 3D camera interpolation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalHeight > 0 ? Math.min(Math.max(currentScroll / totalHeight, 0), 1) : 0;
          setScrollProgress(progress);

          // Determine active section based on scroll offset
          const viewportMid = currentScroll + window.innerHeight * 0.4;
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el && el.offsetTop <= viewportMid) {
              setCurrentSection(sectionIds[i]);
              break;
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const currentSectionIndex = Math.max(sectionIds.indexOf(currentSection), 0);

  return (
    <div className="relative min-h-screen bg-[#02040a] text-slate-100 selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 3D Deep Space WebGL Canvas */}
      <SpaceCanvas
        scrollProgress={scrollProgress}
        currentSectionIndex={currentSectionIndex}
      />

      {/* Cyber HUD Navigation Bar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={scrollToSection}
      />

      {/* Space Radar & Orbital Coordinates HUD */}
      <HudRadar
        currentSection={currentSection}
        scrollProgress={scrollProgress}
        onNavigate={scrollToSection}
      />

      {/* Main Cosmic Journey Narrative Content */}
      <main className="relative z-10">
        <HeroSection onExplore={scrollToSection} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <JourneySection />
        <ContactSection />
      </main>

      {/* Telemetry Footer */}
      <Footer onBackToTop={() => scrollToSection('hero')} />
    </div>
  );
};

export default App;
