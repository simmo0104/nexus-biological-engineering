//+SK 17/08/2026 - This component creates the ambient biological particle network used behind the hero section, handling particle movement, proximity-based connections, responsive canvas sizing, and reduced-motion support.
import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NetworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  phase: number;
}

interface ParticleNetworkProps {
  className?: string;
  particleCount?: number;
}

export function ParticleNetwork({ className = '', particleCount = 55 }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<NetworkParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(W, H);
    };

    const initParticles = (w: number, h: number) => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.2 + Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reducedMotion) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        for (const p of particlesRef.current) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(43, 168, 152, ${p.opacity})`;
          ctx.fill();
        }
      }
      return () => ro.disconnect();
    }

    let time = 0;
    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      const maxDist = Math.min(W, H) * 0.18;

      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(43, 168, 152, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const opacity = p.opacity * (0.7 + Math.sin(time + p.phase) * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(43, 168, 152, ${opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [particleCount, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`bio-canvas ${className}`}
      aria-hidden="true"
      role="presentation"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
//-SK 17/08/2026 - This component creates the ambient biological particle network used behind the hero section, handling particle movement, proximity-based connections, responsive canvas sizing, and reduced-motion support.
