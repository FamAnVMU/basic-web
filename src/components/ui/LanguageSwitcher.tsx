import React from 'react';
import { Globe } from 'lucide-react';
import type { Language } from '../../data/translations';
import { soundManager } from '../../utils/soundEffects';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
  className = '',
}) => {
  const handleSelect = (lang: Language) => {
    if (lang === currentLang) return;
    soundManager.playClick();
    onLanguageChange(lang);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 select-none ${className}`}
      title={currentLang === 'vi' ? 'Chuyển đổi ngôn ngữ: Tiếng Việt / Tiếng Anh' : 'Switch language: Vietnamese / English'}
    >
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#020612]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.8)] hover:border-cyan-400 transition-all hover:scale-105">
        <div className="px-2 py-1 text-cyan-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        </div>

        <button
          onClick={() => handleSelect('vi')}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono-code transition-all cursor-pointer ${
            currentLang === 'vi'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,243,255,0.6)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
          aria-label="Tiếng Việt"
        >
          VI
        </button>

        <span className="text-cyan-500/30 text-xs">|</span>

        <button
          onClick={() => handleSelect('en')}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono-code transition-all cursor-pointer ${
            currentLang === 'en'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,243,255,0.6)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
          aria-label="English"
        >
          EN
        </button>
      </div>
    </div>
  );
};
