import React from 'react';
import { soundManager } from '../../utils/soundEffects';

interface HudRadarProps {
  currentSection: string;
  scrollProgress: number;
  onNavigate: (sectionId: string) => void;
}

export const HudRadar: React.FC<HudRadarProps> = ({
  currentSection,
  scrollProgress,
  onNavigate,
}) => {
  const sectors = [
    { id: 'hero', code: '01', name: 'VŨ TRỤ' },
    { id: 'about', code: '02', name: 'HỒ SƠ' },
    { id: 'skills', code: '03', name: 'KỸ NĂNG' },
    { id: 'projects', code: '04', name: 'DỰ ÁN' },
    { id: 'journey', code: '05', name: 'HÀNH TRÌNH' },
    { id: 'contact', code: '06', name: 'LIÊN HỆ' },
  ];

  const handleSectorClick = (id: string) => {
    soundManager.playWarp();
    onNavigate(id);
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 pointer-events-auto">
      {/* Orbital Telemetry Card */}
      <div className="p-3 rounded-xl hologram-panel border-cyan-500/20 text-[10px] font-mono-code text-right space-y-1 mb-2">
        <div className="text-cyan-400 font-bold">RADAR KHÔNG GIAN</div>
        <div className="text-slate-400">
          QUỸ ĐẠO: <span className="text-white font-semibold">{Math.round(scrollProgress * 100)}%</span>
        </div>
        <div className="text-slate-400">
          TỌA ĐỘ: <span className="text-cyan-300">VMU-HAI PHONG</span>
        </div>
      </div>

      {/* Sector Navigation Dots */}
      <div className="flex flex-col items-end gap-2.5">
        {sectors.map((sec) => {
          const isActive = currentSection === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => handleSectorClick(sec.id)}
              className="group flex items-center gap-3 cursor-pointer py-1"
              aria-label={`Đi tới ${sec.name}`}
            >
              <span
                className={`text-[10px] font-mono-code transition-all opacity-0 group-hover:opacity-100 ${
                  isActive ? 'opacity-100 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                {sec.code} // {sec.name}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_#00f3ff] scale-125'
                    : 'bg-transparent border-slate-600 group-hover:border-cyan-400/60'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
