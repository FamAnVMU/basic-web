import React, { useEffect, useRef } from 'react';

interface ConstellationCanvasProps {
  mouseX?: number | null;
  mouseY?: number | null;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
  glowEnergy: number; // 0 (idle) to 1 (excited near cursor)
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  mouseX,
  mouseY,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: mouseX ?? null,
    y: mouseY ?? null,
  });

  useEffect(() => {
    if (mouseX !== undefined) mouseRef.current.x = mouseX;
    if (mouseY !== undefined) mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;

    let width = (canvas.width = parent?.clientWidth || 600);
    let height = (canvas.height = parent?.clientHeight || 500);

    const handleResize = () => {
      if (!parent) return;
      width = canvas.width = parent.clientWidth;
      height = canvas.height = parent.clientHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (parent) {
      resizeObserver.observe(parent);
    }

    // Direct native mouse & touch tracking on parent element
    const handleMouseMove = (e: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      } else {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!parent || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = parent.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true });
      parent.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      parent.addEventListener('touchmove', handleTouchMove, { passive: true });
      parent.addEventListener('touchend', handleTouchEnd, { passive: true });
      parent.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }

    // Generate constellation nodes with individual baseline velocities & reactive energy states
    const nodeCount = Math.max(30, Math.min(55, Math.floor((width * height) / 9000)));
    const nodes: NodePoint[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const bvx = (Math.random() - 0.5) * 0.45;
      const bvy = (Math.random() - 0.5) * 0.45;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: bvx,
        vy: bvy,
        baseVx: bvx,
        baseVy: bvy,
        radius: 1.4 + Math.random() * 1.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        glowEnergy: 0,
      });
    }

    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;
      const mouseRadius = 130;

      // 1. Move & Update Nodes (Dynamic Orbit, Excitation & Reactive Fluid Motion)
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        let targetEnergy = 0;

        if (mX !== null && mY !== null && mX >= 0 && mX <= width && mY >= 0 && mY <= height) {
          const dx = mX - p.x;
          const dy = mY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            // Proximity intensity: 1 at cursor, 0 at outer boundary
            const proximity = 1 - dist / mouseRadius;
            targetEnergy = proximity;

            // Celestial Orbital Swirl (combining gentle gravitational pull + tangential orbital curve)
            const angle = Math.atan2(dy, dx);
            const tangent = angle + Math.PI / 2;

            const pullForce = proximity * 0.12;
            const swirlForce = proximity * 0.18;

            p.vx += Math.cos(angle) * pullForce + Math.cos(tangent) * swirlForce;
            p.vy += Math.sin(angle) * pullForce + Math.sin(tangent) * swirlForce;

            // Cushion zone: prevent colliding directly into cursor tip (< 26px)
            if (dist < 26 && dist > 0) {
              const pushBack = (26 - dist) * 0.12;
              p.vx -= (dx / dist) * pushBack;
              p.vy -= (dy / dist) * pushBack;
            }

            // Magnetic damping so particles orbit smoothly without flying away
            p.vx *= 0.95;
            p.vy *= 0.95;
          }
        }

        // Smooth energy transition (lerp)
        p.glowEnergy += (targetEnergy - p.glowEnergy) * 0.12;

        // When releasing from mouse field, smoothly return to base cosmic drift
        if (targetEnergy === 0) {
          p.vx += (p.baseVx - p.vx) * 0.03;
          p.vy += (p.baseVy - p.vy) * 0.03;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently inside container bounds
        if (p.x <= 8) {
          p.x = 8;
          p.vx = Math.abs(p.vx);
          p.baseVx = Math.abs(p.baseVx);
        } else if (p.x >= width - 8) {
          p.x = width - 8;
          p.vx = -Math.abs(p.vx);
          p.baseVx = -Math.abs(p.baseVx);
        }

        if (p.y <= 8) {
          p.y = 8;
          p.vy = Math.abs(p.vy);
          p.baseVy = Math.abs(p.baseVy);
        } else if (p.y >= height - 8) {
          p.y = height - 8;
          p.vy = -Math.abs(p.vy);
          p.baseVy = -Math.abs(p.baseVy);
        }

        // Energized pulsation: accelerates up to 3.5x when excited by cursor
        p.pulse += p.pulseSpeed * (1 + p.glowEnergy * 2.5);
      }

      // 2. Draw Interconnecting Constellation Lines with Resonance Lighting
      const maxConnectDist = 95;
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            // Resonance effect: lines connecting energized nodes glow with bright cyber aura
            const resonance = Math.max(p1.glowEnergy, p2.glowEnergy);
            const baseAlpha = (1 - dist / maxConnectDist) * 0.35;
            const alpha = Math.min(0.9, baseAlpha + resonance * 0.45);

            ctx.strokeStyle = resonance > 0.3
              ? `rgba(56, 189, 248, ${alpha.toFixed(3)})`
              : `rgba(0, 243, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.85 + resonance * 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Subtle Ethereal Magnetic Flux Lines to Cursor Field (Without drawing artificial dots)
      if (mX !== null && mY !== null && mX >= 0 && mX <= width && mY >= 0 && mY <= height) {
        for (let i = 0; i < nodes.length; i++) {
          const p = nodes[i];
          if (p.glowEnergy > 0.08) {
            const alpha = p.glowEnergy * 0.38;
            ctx.strokeStyle = `rgba(0, 243, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mX, mY);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Reactive Nodes with Dynamic Halo Bloom & Supernova Excitation
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const pulseFactor = Math.sin(p.pulse) * 0.25;
        const energy = p.glowEnergy;
        // Moderate size expansion on excitation (+25% max)
        const currentRadius = (p.radius + pulseFactor) * (1 + energy * 0.25);

        ctx.save();

        // Outer Bloom Halo: Scaled down gracefully for a refined, non-overwhelming cyber glow
        const haloRadius = currentRadius * (2.2 + energy * 1.2);
        const haloAlpha = 0.12 + energy * 0.28;
        ctx.beginPath();
        ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 243, 255, ${haloAlpha.toFixed(3)})`;
        ctx.fill();

        // Concentrated secondary energetic aura ring
        if (energy > 0.25) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${(energy * 0.3).toFixed(3)})`;
          ctx.fill();
        }

        // Bright cyber core with crisp neon glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = energy > 0.5 ? '#e0f7ff' : 'rgba(56, 189, 248, 0.95)';
        ctx.shadowBlur = 6 + energy * 10;
        ctx.shadowColor = '#00f3ff';
        ctx.fill();

        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
        parent.removeEventListener('touchmove', handleTouchMove);
        parent.removeEventListener('touchend', handleTouchEnd);
        parent.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl z-0"
    />
  );
};
