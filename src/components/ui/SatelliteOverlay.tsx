import React, { useState } from 'react';
import type { SatelliteScreenPosition } from '../canvas/SolarSystemCanvas';
import { Anchor, Code, BookOpen, Target, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';
import { FacebookIcon, DiscordIcon, GithubIcon } from './Icons';
import { soundManager } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SatelliteOverlayProps {
  satellites: SatelliteScreenPosition[];
  onOpenDetails: () => void;
}

export const SatelliteOverlay: React.FC<SatelliteOverlayProps> = ({
  satellites,
  onOpenDetails,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getSatelliteIcon = (iconType: string) => {
    switch (iconType) {
      case 'vmu':
        return <Anchor className="w-3.5 h-3.5 text-amber-400" />;
      case 'code':
        return <Code className="w-3.5 h-3.5 text-cyan-400" />;
      case 'study':
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      case 'goal':
        return <Target className="w-3.5 h-3.5 text-emerald-400" />;
      case 'facebook':
        return <FacebookIcon className="w-3.5 h-3.5 text-blue-400" />;
      case 'discord':
        return <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />;
      case 'email':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-300" />;
      case 'github':
        return <GithubIcon className="w-3.5 h-3.5 text-slate-200" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const handleSatelliteClick = (e: React.MouseEvent, satPos: SatelliteScreenPosition) => {
    e.stopPropagation();
    soundManager.playClick();

    if (satPos.satellite.action === 'copy' && satPos.satellite.link) {
      const email = satPos.satellite.link.replace('mailto:', '');
      navigator.clipboard.writeText(email);
      setCopiedId(satPos.id);
      setTimeout(() => setCopiedId(null), 2000);
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch {
        // fallback
      }
      return;
    }

    if (satPos.satellite.action === 'link' && satPos.satellite.link) {
      window.open(satPos.satellite.link, '_blank');
      return;
    }

    onOpenDetails();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {satellites.map((sat) => {
        const isCopied = copiedId === sat.id;

        return (
          <div
            key={sat.id}
            className="absolute pointer-events-auto transition-transform duration-150 -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${Math.round(sat.x)}px`,
              top: `${Math.round(sat.y)}px`,
            }}
          >
            {/* Holographic Satellite Chip - Compact & Sleek */}
            <div
              onClick={(e) => handleSatelliteClick(e, sat)}
              className="px-2.5 py-1 rounded-xl bg-[#020612]/90 backdrop-blur-md border border-cyan-400/40 hover:border-cyan-300 hover:bg-[#071936]/90 shadow-[0_0_12px_rgba(0,243,255,0.2)] flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 text-left"
              title="Bấm để xem chi tiết thông tin vệ tinh này"
            >
              <div className="p-1 rounded-lg bg-cyan-950/80 border border-cyan-400/30 shrink-0">
                {getSatelliteIcon(sat.satellite.iconType)}
              </div>

              <div>
                <div className="font-sans font-medium text-[11px] text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1 leading-tight">
                  <span className="truncate max-w-[140px]">{sat.satellite.title}</span>
                  {sat.satellite.action === 'link' && (
                    <ExternalLink className="w-2.5 h-2.5 text-cyan-400 opacity-70" />
                  )}
                  {sat.satellite.action === 'copy' && (
                    isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-cyan-400 opacity-70" />
                  )}
                </div>
                <div className="text-[8.5px] font-mono-code text-cyan-400/80 leading-tight">
                  {sat.satellite.subtitle}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
