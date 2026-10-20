import React, { useState } from 'react';
import { Layers, ExternalLink, Sparkles, X, Activity, CheckCircle, Ship, Box, Monitor, Globe } from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';
import type { Project } from '../../types';
import { TiltCard } from '../ui/TiltCard';
import { GithubIcon } from '../ui/Icons';
import { soundManager } from '../../utils/soundEffects';

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getCategoryIcon = (category: Project['category']) => {
    switch (category) {
      case 'Maritime Tech':
        return <Ship className="w-4 h-4 text-cyan-400" />;
      case 'Interactive 3D':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'Full-Stack Web':
        return <Monitor className="w-4 h-4 text-cyan-400" />;
      default:
        return <Box className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleOpenModal = (project: Project) => {
    soundManager.playClick();
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    soundManager.playClick();
    setSelectedProject(null);
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-24 z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-400/30 text-cyan-400 text-xs font-mono-code mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>SECTOR 04 // KHÔNG GIAN TRƯNG BÀY DỰ ÁN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-orbitron text-white">
            KHU VỰC DỰ ÁN CHIẾN LƯỢC
          </h2>
          <p className="text-slate-400 font-mono-code text-sm mt-2 max-w-2xl">
            Các sản phẩm phần mềm tiêu biểu, kết hợp thế mạnh ngành Công nghệ Thông tin và giải pháp số hóa ứng dụng thực tiễn.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <TiltCard key={project.id} maxTilt={5}>
              <div
                onClick={() => handleOpenModal(project)}
                className="p-6 sm:p-7 rounded-3xl hologram-panel border-cyan-500/25 h-full flex flex-col justify-between scanline-overlay cursor-pointer group hover:border-cyan-400/70 transition-all"
              >
                <div>
                  {/* Top System Metadata */}
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4 text-xs font-mono-code">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-md bg-cyan-950/80 border border-cyan-400/30">
                        {getCategoryIcon(project.category)}
                      </span>
                      <span className="text-cyan-400 font-semibold">{project.systemCode}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        project.status === 'Deployed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      ● {project.status}
                    </span>
                  </div>

                  {/* Project Title & Category */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-mono-code text-cyan-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-orbitron text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono-code text-slate-400">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Key Highlights */}
                  {project.metrics && (
                    <div className="mb-5 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 text-xs font-mono-code text-cyan-200 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{project.metrics}</span>
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono-code bg-slate-900/80 text-cyan-300/90 border border-cyan-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Quick Links */}
                <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono-code">
                  <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                    <span>Xem chi tiết thông số</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
                    title="Xem mã nguồn trên GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Project Detail Holographic Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl hologram-panel border border-cyan-400/60 p-6 sm:p-8 scanline-overlay shadow-[0_0_50px_rgba(0,243,255,0.25)] max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-950/60 transition-colors cursor-pointer"
              aria-label="Đóng cửa sổ chi tiết"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>{selectedProject.systemCode} // HỒ SƠ DỰ ÁN CHI TIẾT</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-orbitron text-white">
                {selectedProject.title}
              </h3>
              <p className="text-sm font-mono-code text-cyan-200">
                {selectedProject.subtitle}
              </p>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 text-sm text-slate-300">
              <p className="leading-relaxed">{selectedProject.description}</p>

              {/* Detailed Features */}
              <div>
                <h4 className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-3">
                  TÍNH NĂNG & ĐẶC ĐIỂM KỸ THUẬT:
                </h4>
                <div className="space-y-2">
                  {selectedProject.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-2">
                  CÔNG NGHỆ ÁP DỤNG:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-lg text-xs font-mono-code bg-cyan-950/60 text-cyan-300 border border-cyan-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cyan-500/20 flex flex-wrap gap-3">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono-code text-xs tracking-wider shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:bg-cyan-400 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>XEM SOURCE CODE GITHUB</span>
                </a>

                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-400/40 bg-slate-900/60 text-cyan-300 font-mono-code text-xs hover:border-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>TRUY CẬP DỰ ÁN</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
