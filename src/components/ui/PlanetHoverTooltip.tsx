import React from 'react';

interface HoverInfo {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
}

interface PlanetHoverTooltipProps {
  hoverInfo: HoverInfo | null;
}

export const PlanetHoverTooltip: React.FC<PlanetHoverTooltipProps> = ({ hoverInfo }) => {
  if (!hoverInfo) return null;

  return (
    <div
      className="fixed z-40 pointer-events-none -translate-x-1/2 -translate-y-full mb-4 animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${hoverInfo.x}px`,
        top: `${hoverInfo.y}px`,
      }}
    >
      <div className="relative px-3.5 py-2 rounded-xl bg-[#020612]/90 backdrop-blur-md border border-cyan-400/70 shadow-[0_0_25px_rgba(0,243,255,0.4)] text-center min-w-[180px]">
        {/* Top Target Indicator */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono-code text-cyan-400 uppercase tracking-widest mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>MỤC TIÊU TIẾP CẬN</span>
        </div>

        <div className="font-orbitron font-bold text-sm text-white tracking-wider">
          {hoverInfo.name}
        </div>
        <div className="text-[10px] font-mono-code text-slate-300 truncate max-w-[220px]">
          {hoverInfo.subtitle}
        </div>

        <div className="mt-1 pt-1 border-t border-cyan-500/20 text-[9px] font-mono-code text-cyan-300/80">
          ● Nhấp chuột để chuyển góc nhìn
        </div>

        {/* Pointer Triangle */}
        <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-[#020612] border-b border-r border-cyan-400/70 rotate-45" />
      </div>
    </div>
  );
};
