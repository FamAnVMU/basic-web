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
  radius: number;
  pulse: number;
  pulseSpeed: number;
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
    mouseRef.current.x = mouseX ?? null;
    mouseRef.current.y = mouseY ?? null;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Generate constellation nodes
    const nodeCount = Math.max(30, Math.min(55, Math.floor((width * height) / 9000)));
    const nodes: NodePoint[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.8 + Math.random() * 1.6,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      });
    }

    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // 1. Move & Update Nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently inside container bounds
        if (p.x <= 8 || p.x >= width - 8) p.vx *= -1;
        if (p.y <= 8 || p.y >= height - 8) p.vy *= -1;

        p.pulse += p.pulseSpeed;
      }

      // 2. Draw Interconnecting Constellation Lines
      const maxConnectDist = 95;
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.35;
            ctx.strokeStyle = `rgba(0, 243, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Interactive Mouse Connections
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;
      const mouseMaxDist = 135;

      if (mX !== null && mY !== null && mX >= 0 && mX <= width && mY >= 0 && mY <= height) {
        for (let i = 0; i < nodes.length; i++) {
          const p = nodes[i];
          const dx = p.x - mX;
          const dy = p.y - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseMaxDist) {
            const alpha = (1 - dist / mouseMaxDist) * 0.8;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mX, mY);
            ctx.stroke();
          }
        }

        // Mouse pointer node glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(mX, mY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f3ff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00f3ff';
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Nodes with Outer Glow Halo (exact match to user reference screenshot)
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const r = p.radius + Math.sin(p.pulse) * 0.35;

        ctx.save();
        // Subtle translucent outer halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 243, 255, 0.12)';
        ctx.fill();

        // Bright cyber core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f3ff';
        ctx.fill();
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl z-0"
    />
  );
};
