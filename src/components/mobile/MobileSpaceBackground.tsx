import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
  colorType: 'cyan' | 'white' | 'gold' | 'lavender';
}

interface ShootingStar {
  active: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  alpha: number;
  speed: number;
}

export const MobileSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Multi-color palette generator
    const colorTypes: ('cyan' | 'white' | 'gold' | 'lavender')[] = [
      'cyan',
      'cyan',
      'white',
      'white',
      'gold',
      'lavender',
    ];

    // Generate layered multi-spectral stardust particles
    const particleCount = Math.min(85, Math.floor((width * height) / 8500));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const type = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.65 + 0.25,
        speed: Math.random() * 0.16 + 0.04,
        twinkleSpeed: Math.random() * 0.03 + 0.012,
        twinklePhase: Math.random() * Math.PI * 2,
        colorType: type,
      });
    }

    // Occasional 2D Shooting Star
    const shootingStar: ShootingStar = {
      active: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      length: 0,
      alpha: 0,
      speed: 0,
    };

    let nextMeteorTime = performance.now() + 3000;

    const triggerMeteor = () => {
      shootingStar.active = true;
      shootingStar.x = Math.random() * (width * 0.8) + width * 0.1;
      shootingStar.y = Math.random() * (height * 0.35);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.25; // ~45 deg diagonal
      shootingStar.speed = Math.random() * 8 + 12;
      shootingStar.dx = Math.cos(angle) * shootingStar.speed;
      shootingStar.dy = Math.sin(angle) * shootingStar.speed;
      shootingStar.length = Math.random() * 60 + 80;
      shootingStar.alpha = 1.0;
    };

    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // 1. Render Multi-Spectral Drifting Stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentAlpha = Math.max(
          0.12,
          Math.min(0.95, p.alpha + Math.sin(p.twinklePhase) * 0.32)
        );

        let rgb = '0, 243, 255';
        let glowRgb = '56, 189, 248';
        if (p.colorType === 'white') {
          rgb = '248, 250, 252';
          glowRgb = '224, 242, 254';
        } else if (p.colorType === 'gold') {
          rgb = '253, 224, 71';
          glowRgb = '251, 191, 36';
        } else if (p.colorType === 'lavender') {
          rgb = '216, 180, 254';
          glowRgb = '192, 132, 252';
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${currentAlpha.toFixed(2)})`;
        ctx.fill();

        // Extra twinkle aura for larger stars
        if (p.radius > 1.25) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${glowRgb}, ${(currentAlpha * 0.3).toFixed(2)})`;
          ctx.fill();
        }
      }

      // 2. Render Shooting Star if active
      const now = performance.now();
      if (!shootingStar.active && now > nextMeteorTime) {
        triggerMeteor();
        nextMeteorTime = now + (Math.random() * 5000 + 4000);
      }

      if (shootingStar.active) {
        shootingStar.x += shootingStar.dx;
        shootingStar.y += shootingStar.dy;
        shootingStar.alpha -= 0.022;

        if (
          shootingStar.alpha <= 0 ||
          shootingStar.x > width + 100 ||
          shootingStar.y > height + 100
        ) {
          shootingStar.active = false;
        } else {
          // Draw meteor head and glowing fading tail
          const tailX = shootingStar.x - (shootingStar.dx / shootingStar.speed) * shootingStar.length;
          const tailY = shootingStar.y - (shootingStar.dy / shootingStar.speed) * shootingStar.length;

          const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          grad.addColorStop(0, 'rgba(0, 243, 255, 0)');
          grad.addColorStop(0.7, `rgba(56, 189, 248, ${(shootingStar.alpha * 0.6).toFixed(2)})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha.toFixed(2)})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          // Meteor spark head
          ctx.beginPath();
          ctx.arc(shootingStar.x, shootingStar.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.alpha.toFixed(2)})`;
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Star Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85" />

      {/* Cyber Space Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-cyan-600/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[32%] -left-28 w-[400px] h-[400px] bg-purple-600/14 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[62%] -right-28 w-[400px] h-[400px] bg-sky-600/14 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[450px] h-[300px] bg-amber-500/8 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Space Grid Texture */}
      <div className="absolute inset-0 space-grid-pattern opacity-25" />
    </div>
  );
};
