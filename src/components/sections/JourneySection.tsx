import React from 'react';
import { Compass, CheckCircle2, CircleDot, Anchor } from 'lucide-react';
import { MILESTONES } from '../../data/portfolioData';
import { TiltCard } from '../ui/TiltCard';

export const JourneySection: React.FC = () => {
  return (
    <section
      id="journey"
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-24 z-10"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-400/30 text-cyan-400 text-xs font-mono-code mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>SECTOR 05 // HÀNH TRÌNH QUỸ ĐẠO & CỘT MỐC</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-orbitron text-white">
            QUỸ ĐẠO PHÁT TRIỂN
          </h2>
          <p className="text-slate-400 font-mono-code text-sm mt-2 max-w-xl mx-auto">
            Đường quỹ đạo phát sáng ghi dấu các chặng đường học tập, tích lũy tri thức tại Đại học Hàng hải Việt Nam và mục tiêu tương lai.
          </p>
        </div>

        {/* Orbit Trajectory Line & Nodes */}
        <div className="relative">
          {/* Vertical Glowing Beam (Desktop & Mobile) */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-400 via-teal-400 to-cyan-600/20 shadow-[0_0_15px_#00f3ff] rounded-full" />

          {/* Milestones List */}
          <div className="space-y-12">
            {MILESTONES.map((milestone, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={milestone.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-8`}
                >
                  {/* Central Orbit Beacon Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#02040a] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_#00f3ff] z-20">
                    {milestone.status === 'Completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    ) : milestone.status === 'Current Phase' ? (
                      <CircleDot className="w-4 h-4 text-cyan-400 animate-pulse" />
                    ) : (
                      <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>

                  {/* Content Card (Left or Right on desktop) */}
                  <div className="pl-12 md:pl-0 md:w-1/2 w-full">
                    <TiltCard maxTilt={5}>
                      <div className="p-6 sm:p-7 rounded-2xl hologram-panel border-cyan-500/25 scanline-overlay">
                        {/* Top Phase Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
                          <span className="text-xs font-mono-code font-bold text-cyan-400">
                            {milestone.orbitPhase}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {milestone.year}
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <h3 className="text-lg sm:text-xl font-bold font-orbitron text-white">
                          {milestone.title}
                        </h3>
                        <div className="text-xs font-mono-code text-cyan-300/80 mt-1 flex items-center gap-2">
                          <span>{milestone.organization}</span>
                          <span>•</span>
                          <span>{milestone.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Highlight Bullets */}
                        <div className="mt-4 pt-3 border-t border-cyan-500/15 space-y-2">
                          {milestone.highlights.map((item, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="text-cyan-400 font-bold mt-0.5">›</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TiltCard>
                  </div>

                  {/* Empty Spacer on the opposite side for symmetric layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
