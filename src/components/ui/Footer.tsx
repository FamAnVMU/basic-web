import React, { useState, useEffect } from 'react';
import { ArrowUp, Shield, Globe } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface FooterProps {
  onBackToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWarpTop = () => {
    soundManager.playWarp();
    onBackToTop();
  };

  return (
    <footer className="relative border-t border-cyan-500/20 bg-[#02040a]/90 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-12 z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Academic Info */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-orbitron font-bold text-white tracking-wider text-sm">
              PHẠM AN // FamAnVMU
            </span>
            <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              VMU.IT
            </span>
          </div>
          <p className="text-xs font-mono-code text-slate-400">
            Khoa Công nghệ Thông tin • Trường Đại học Hàng hải Việt Nam (Hải Phòng)
          </p>
          <p className="text-[11px] font-mono-code text-slate-500">
            © 2026 Phạm An. All rights reserved. Immersive 3D Space Portfolio.
          </p>
        </div>

        {/* Live Space Telemetry */}
        <div className="flex items-center gap-4 text-xs font-mono-code">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-cyan-500/20 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>UTC+7: {timeStr || '16:50:00'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-cyan-500/20 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">SYS: OPTIMAL</span>
          </div>

          {/* Jump to top button */}
          <button
            onClick={handleWarpTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all font-mono-code text-xs cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.2)]"
            title="Nhảy warp về đầu trang"
          >
            <span>VỀ ĐẦU</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
