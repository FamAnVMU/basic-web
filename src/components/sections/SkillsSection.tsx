import React, { useState } from 'react';
import { Cpu, Zap, Layout, Server, Database, Binary, CheckCircle2 } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { TiltCard } from '../ui/TiltCard';
import { soundManager } from '../../utils/soundEffects';

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCategories =
    activeCategory === 'all'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((cat) => cat.id === activeCategory);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-4 h-4" />;
      case 'Server':
        return <Server className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Binary':
        return <Binary className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const handleFilterClick = (catId: string) => {
    soundManager.playClick();
    setActiveCategory(catId);
  };

  return (
    <section
      id="skills"
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-24 z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-400/30 text-cyan-400 text-xs font-mono-code mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>SECTOR 03 // CỤM TRẠM NĂNG LƯỢNG KỸ NĂNG</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-orbitron text-white">
            MA TRẬN NĂNG LƯỢNG KỸ THUẬT
          </h2>
          <p className="text-slate-400 font-mono-code text-sm mt-2 max-w-2xl">
            Hệ thống kỹ năng được cấu trúc thành các trạm năng lượng vũ trụ, minh chứng cho năng lực thực thi từ nền tảng máy tính đến công nghệ hiện đại.
          </p>
        </div>

        {/* Category Filter Station */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => handleFilterClick('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                : 'hologram-panel text-slate-400 hover:text-cyan-300'
            }`}
          >
            [TẤT CẢ TRẠM]
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterClick(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                  : 'hologram-panel text-slate-400 hover:text-cyan-300'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.title.split('&')[0]}</span>
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <TiltCard key={category.id} maxTilt={6}>
              <div className="p-6 rounded-2xl hologram-panel border-cyan-500/25 h-full flex flex-col justify-between scanline-overlay">
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-400">
                        {getCategoryIcon(category.iconName)}
                      </div>
                      <div>
                        <h3 className="font-orbitron font-bold text-sm text-white">
                          {category.title}
                        </h3>
                        <span className="text-[10px] font-mono-code text-cyan-400/80 block">
                          {category.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Skills List with Energy Levels */}
                  <div className="space-y-3.5">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-mono-code">
                          <span className="text-slate-200 flex items-center gap-1.5 font-medium">
                            {skill.isKeySkill && (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f3ff]"
                                title="Điểm nút cốt lõi"
                              />
                            )}
                            {skill.name}
                          </span>
                          <span className="text-cyan-300 text-[11px] font-semibold">
                            {skill.level}% // {skill.levelLabel}
                          </span>
                        </div>
                        {/* Energy Gauge Bar */}
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-teal-300 rounded-full relative shadow-[0_0_8px_rgba(0,243,255,0.6)]"
                            style={{ width: `${skill.level}%` }}
                          >
                            <span className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-90 shadow-[0_0_5px_white]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Energy Conduit Footer Status */}
                <div className="mt-6 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> NODE STABLE
                  </span>
                  <span>SYNCED: 100%</span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};
