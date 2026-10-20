import React from 'react';
import { User, Compass, Cpu, Code, Anchor, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { TiltCard } from '../ui/TiltCard';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-24 z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-400/30 text-cyan-400 text-xs font-mono-code mb-3">
            <User className="w-3.5 h-3.5" />
            <span>SECTOR 02 // HỒ SƠ & DỮ LIỆU CÁ NHÂN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-orbitron text-white">
            HỒ SƠ HOLOGRAPHIC
          </h2>
          <p className="text-slate-400 font-mono-code text-sm mt-2 max-w-xl">
            Thông tin sinh viên, hành trình tích lũy kiến thức tại Trường Đại học Hàng hải Việt Nam và mục tiêu học hỏi.
          </p>
        </div>

        {/* Main Grid: Avatar Holographic Frame + Data Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Avatar Holographic Pod (Left - 5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard maxTilt={8} className="w-full max-w-md">
              <div className="relative p-6 rounded-3xl hologram-panel border border-cyan-400/30 scanline-overlay overflow-hidden shadow-[0_0_40px_rgba(0,243,255,0.12)]">
                {/* Rotating HUD Reticles */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-72 h-72 border border-cyan-500/15 rounded-full border-dashed animate-spin-slow" />
                  <div className="w-80 h-80 border border-cyan-400/10 rounded-full border-dotted animate-spin-reverse absolute" />
                </div>

                {/* Avatar Image with Cyber Frame */}
                <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,243,255,0.3)] group">
                  <img
                    src="/avatar.jpg"
                    alt="Phạm An - Sinh viên CNTT Đại học Hàng hải Việt Nam"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02040a]/90 via-transparent to-cyan-500/10" />

                  {/* Corner Targets */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                </div>

                {/* Profile Identity Bar */}
                <div className="mt-5 text-center">
                  <h3 className="font-orbitron font-bold text-xl text-white tracking-wide">
                    PHẠM AN
                  </h3>
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono-code text-xs">
                    CALLSIGN: FamAnVMU
                  </div>
                  <p className="text-xs font-mono-code text-slate-300 mt-2 flex items-center justify-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                    Trường Đại học Hàng hải Việt Nam (VMU)
                  </p>
                </div>

                {/* Quick Spec Readout */}
                <div className="mt-5 pt-4 border-t border-cyan-500/20 grid grid-cols-2 gap-2 text-[11px] font-mono-code">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-cyan-500/10">
                    <span className="text-slate-400 block">CHUYÊN NGÀNH:</span>
                    <span className="text-cyan-300 font-semibold">Công nghệ Thông tin</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-cyan-500/10">
                    <span className="text-slate-400 block">TRẠM ĐÀO TẠO:</span>
                    <span className="text-white font-semibold">Hải Phòng, VN</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Holographic Data Boards (Right - 7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Mission Statement Card */}
            <TiltCard maxTilt={5}>
              <div className="p-6 rounded-2xl hologram-panel border-cyan-500/30">
                <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>ĐỊNH HƯỚNG & THÁI ĐỘ HỌC TẬP</span>
                </div>
                <h4 className="text-lg font-bold text-white font-orbitron">
                  Sinh Viên CNTT & Tinh Thần Cầu Thị
                </h4>
                <blockquote className="mt-2 text-sm text-cyan-100/90 italic pl-3 border-l-2 border-cyan-400 leading-relaxed font-sans">
                  "{PERSONAL_INFO.philosophy}"
                </blockquote>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Là một sinh viên Công nghệ Thông tin tại Trường Đại học Hàng hải Việt Nam, tôi hiểu rằng mình vẫn đang ở giai đoạn đầu của sự nghiệp lập trình. Vì vậy, tôi luôn giữ cho mình tinh thần cầu thị, chủ động tìm tòi những công nghệ mới, rèn luyện tư duy logic và mong muốn có cơ hội được thực tập, cọ xát trong môi trường thực tế.
                </p>
              </div>
            </TiltCard>

            {/* Core Competencies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TiltCard maxTilt={6}>
                <div className="p-5 rounded-2xl hologram-panel border-cyan-500/20 h-full">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3">
                    <Code className="w-4 h-4" />
                  </div>
                  <h5 className="font-orbitron font-bold text-sm text-white">Lập Trình Web Cơ Bản</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Nắm bắt kiến thức cơ bản về HTML/CSS/JS, tìm hiểu React, TypeScript và thực nghiệm xây dựng giao diện 3D với Three.js.
                  </p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={6}>
                <div className="p-5 rounded-2xl hologram-panel border-cyan-500/20 h-full">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h5 className="font-orbitron font-bold text-sm text-white">Nền Tảng Máy Tính</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Được đào tạo chính quy về C/C++, Lập trình hướng đối tượng (OOP), Cấu trúc dữ liệu & Giải thuật và Cơ sở dữ liệu quan hệ.
                  </p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={6}>
                <div className="p-5 rounded-2xl hologram-panel border-cyan-500/20 h-full">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3">
                    <Anchor className="w-4 h-4" />
                  </div>
                  <h5 className="font-orbitron font-bold text-sm text-white">Môi Trường Hàng Hải (VMU)</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Môi trường đào tạo giàu truyền thống tại Hải Phòng, rèn luyện tính kỷ luật, sự kiên trì và tinh thần trách nhiệm trong công việc.
                  </p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={6}>
                <div className="p-5 rounded-2xl hologram-panel border-cyan-500/20 h-full">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h5 className="font-orbitron font-bold text-sm text-white">Sẵn Sàng Học Hỏi</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Chủ động tiếp thu góp ý, trau dồi tiếng Anh chuyên ngành và sẵn sàng thử sức với các bài toán công nghệ mới.
                  </p>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
