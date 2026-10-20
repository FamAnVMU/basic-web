import React, { useState } from 'react';
import { Radio, Mail, Send, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { TiltCard } from '../ui/TiltCard';
import { soundManager } from '../../utils/soundEffects';
import { FacebookIcon, GithubIcon, DiscordIcon } from '../ui/Icons';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopy = (text: string, key: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playWarp();
    setIsSending(true);

    // Simulate sending transmission
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);

      // Trigger celebratory cosmic confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f3ff', '#38bdf8', '#0891b2', '#ffffff'],
        });
      } catch {
        // Fallback
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSent(false), 6000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-24 z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-400/30 text-cyan-400 text-xs font-mono-code mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SECTOR 06 // CỔNG GIAO TIẾP VŨ TRỤ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-orbitron text-white">
            TRUYỀN TIN KHÔNG GIAN
          </h2>
          <p className="text-slate-400 font-mono-code text-sm mt-2 max-w-xl mx-auto">
            Hành trình khám phá khép lại tại trạm thu phát viễn thông. Tôi luôn sẵn sàng kết nối, trao đổi về công nghệ, đồ án và cơ hội phát triển.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Cosmic Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <TiltCard maxTilt={5}>
              <div className="p-6 rounded-2xl hologram-panel border-cyan-500/30 scanline-overlay">
                <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-3">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>KÊNH LIÊN LẠC CHÍNH THỨC</span>
                </div>
                <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                  Phạm An // FamAnVMU
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Bạn có thể gửi email trực tiếp hoặc kết nối qua các nền tảng mạng xã hội bên dưới. Tất cả tín hiệu đều được phản hồi nhanh chóng!
                </p>

                {/* Direct Action Channels */}
                <div className="space-y-3">
                  {/* Email Box */}
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex items-center justify-between group hover:border-cyan-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono-code text-slate-400">EMAIL CÁ NHÂN</div>
                        <div className="text-xs font-mono-code text-white font-medium">
                          {PERSONAL_INFO.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(PERSONAL_INFO.email, 'email')}
                      className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors cursor-pointer"
                      title="Sao chép địa chỉ email"
                    >
                      {copiedKey === 'email' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Discord Box */}
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex items-center justify-between group hover:border-cyan-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400">
                        <DiscordIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono-code text-slate-400">DISCORD USER</div>
                        <div className="text-xs font-mono-code text-white font-medium">
                          FamAnVMU (846953344903282758)
                        </div>
                      </div>
                    </div>
                    <a
                      href={PERSONAL_INFO.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors cursor-pointer"
                      title="Mở hồ sơ Discord"
                    >
                      <Sparkles className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Facebook Box */}
                  <a
                    href={PERSONAL_INFO.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex items-center justify-between group hover:border-cyan-400 transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400">
                        <FacebookIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono-code text-slate-400">FACEBOOK</div>
                        <div className="text-xs font-mono-code text-white font-medium">
                          pham.an.123114
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-code text-cyan-400 group-hover:underline">
                      Mở link ›
                    </span>
                  </a>

                  {/* GitHub Box */}
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex items-center justify-between group hover:border-cyan-400 transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400">
                        <GithubIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono-code text-slate-400">GITHUB PROFILE</div>
                        <div className="text-xs font-mono-code text-white font-medium">
                          FamAnVMU
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-code text-cyan-400 group-hover:underline">
                      Mở link ›
                    </span>
                  </a>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Column: Transmission Form (7 Cols) */}
          <div className="lg:col-span-7">
            <TiltCard maxTilt={4}>
              <div className="p-6 sm:p-8 rounded-2xl hologram-panel border-cyan-500/30 scanline-overlay">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-5">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-orbitron font-bold text-base text-white">
                      GỬI THÔNG ĐIỆP KHÔNG GIAN
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono-code text-cyan-400">
                    ENCRYPTION: AES-256
                  </span>
                </div>

                {isSent ? (
                  <div className="p-6 rounded-xl bg-cyan-950/60 border border-cyan-400/50 text-center space-y-3 animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-orbitron font-bold text-lg text-white">
                      THÔNG ĐIỆP ĐÃ ĐƯỢC TRUYỀN ĐI THÀNH CÔNG!
                    </h4>
                    <p className="text-xs font-mono-code text-cyan-200">
                      Cảm ơn bạn đã liên hệ. Tôi sẽ tiếp nhận thông điệp và phản hồi lại sớm nhất qua email của bạn.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono-code text-slate-300 mb-1">
                          DANH TÍNH CỦA BẠN *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono-code text-slate-300 mb-1">
                          TỌA ĐỘ EMAIL *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@domain.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-code text-slate-300 mb-1">
                        CHỦ ĐỀ KẾT NỐI
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Trao đổi công việc / Dự án / Kết bạn"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-code text-slate-300 mb-1">
                        NỘI DUNG THÔNG ĐIỆP *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Nhập nội dung bạn muốn chia sẻ cùng Phạm An..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold font-mono-code text-sm tracking-wide shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSending ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>ĐANG PHÁT TÍN HIỆU KHÔNG GIAN...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>PHÁT TÍN HIỆU LIÊN HỆ NGAY</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
