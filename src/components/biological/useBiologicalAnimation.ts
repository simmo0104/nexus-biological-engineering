// SK 17/08/2026 - This hook controls the complete biological animation cycle, moving particles from scattered signals into recognizable structures, then through stabilization, breathing, and selective mutation before repeating the process.
import { useRef, useCallback, useEffect } from 'react';
import { Particle, Connection, AnimationPhase, StructuralConnection } from '../../types/biological';


interface LeafParticle extends Particle {
  mutationGroup: number;
  // Centroid-relative offset used for breathing (set once at init)
  relX: number;
  relY: number;
}

interface AnimationState {
  particles: LeafParticle[];
  structuralConns: StructuralConnection[];  
  signalConns: Connection[];             
  phase: AnimationPhase;
  phaseProgress: number; 
  time: number;
  centroidX: number;
  centroidY: number;
  mutGroup2Ids: number[];
  formationProgress: number;
}

interface UseBiologicalAnimationOptions {
  targets: { x: number; y: number; isNode: boolean; mutationGroup?: number }[];
  structuralConns: StructuralConnection[];
  canvasWidth: number;
  canvasHeight: number;
  reducedMotion: boolean;
}


const PHASE_DURATIONS: Record<AnimationPhase, number> = {
  float:     3500,
  organize:  4500,
  form:      5500,
  stabilize: 2500,
  breathe:   7000,
  mutate:    5000,
};

const PHASE_ORDER: AnimationPhase[] = [
  'float', 'organize', 'form', 'stabilize', 'breathe', 'mutate',
];


export function useBiologicalAnimation({
  targets,
  structuralConns,
  canvasWidth,
  canvasHeight,
  reducedMotion,
}: UseBiologicalAnimationOptions) {
  const stateRef = useRef<AnimationState | null>(null);
  const rafRef   = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  const dimsRef = useRef({ w: canvasWidth, h: canvasHeight });
  useEffect(() => {
    dimsRef.current = { w: canvasWidth, h: canvasHeight };
  }, [canvasWidth, canvasHeight]);


  const initState = useCallback(() => {
    const { w, h } = dimsRef.current;
    if (w === 0 || h === 0) return;
    let cx = 0, cy = 0;
    for (const t of targets) { cx += t.x; cy += t.y; }
    cx /= targets.length;
    cy /= targets.length;

    const particles: LeafParticle[] = targets.map((t, i) => {
      const tx = t.x * w;
      const ty = t.y * h;
      const centCX = cx * w;
      const centCY = cy * h;
      return {
        id: i,
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        targetX: tx,
        targetY: ty,
        radius:  t.isNode ? 3.2 : 1.8,
        opacity: 0.25 + Math.random() * 0.2,
        phase:   Math.random() * Math.PI * 2,
        signalProgress: 0,
        isNode:  t.isNode,
        mutationGroup: t.mutationGroup ?? 0,
        relX: tx - centCX,
        relY: ty - centCY,
      };
    });

    const signalConns: Connection[] = structuralConns
      .filter(() => Math.random() < 0.55)
      .map((sc) => ({
        fromId: sc.fromIdx,
        toId:   sc.toIdx,
        signalProgress: Math.random(),
        signalActive:   Math.random() < 0.3,
        opacity: 0,
      }));

    const mutGroup2Ids = particles
      .filter((p) => p.mutationGroup === 2)
      .map((p) => p.id);

    stateRef.current = {
      particles,
      structuralConns,
      signalConns,
      phase: 'float',
      phaseProgress: 0,
      time: 0,
      centroidX: cx * w,
      centroidY: cy * h,
      mutGroup2Ids,
      formationProgress: 0,
    };
  }, [targets, structuralConns]);


  const updateParticle = useCallback((p: LeafParticle, state: AnimationState, dt: number) => {
    const { phase, phaseProgress, formationProgress, time, centroidX, centroidY } = state;
    const { w, h } = dimsRef.current;

    switch (phase) {
      case 'float': {
        // Organic slow drift
        p.x += p.vx * dt * 0.035;
        p.y += p.vy * dt * 0.035;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.opacity = 0.15 + Math.sin(time * 0.0009 + p.phase) * 0.08;
        break;
      }

      case 'organize': {
        // Begin slow migration toward targets
        const lerpRate = 0.008 * (dt / 16);
        p.x += (p.targetX - p.x) * lerpRate;
        p.y += (p.targetY - p.y) * lerpRate;
        p.opacity = 0.2 + phaseProgress * 0.3;
        break;
      }

      case 'form': {
        const lerpRate = (0.018 + phaseProgress * 0.012) * (dt / 16);
        p.x += (p.targetX - p.x) * lerpRate;
        p.y += (p.targetY - p.y) * lerpRate;
        p.opacity = 0.5 + formationProgress * 0.35;
        break;
      }

      case 'stabilize': {
        p.x += (p.targetX - p.x) * 0.12;
        p.y += (p.targetY - p.y) * 0.12;
        p.opacity = 0.85;
        break;
      }

      case 'breathe': {
        const breatheAmt = Math.sin(time * 0.00055) * 5.5; 
        const dist = Math.sqrt(p.relX * p.relX + p.relY * p.relY);
        const scale = dist > 1 ? 1 + (breatheAmt / dist) * 0.035 : 1;
        const bx = centroidX + p.relX * scale;
        const by = centroidY + p.relY * scale;
        p.x += (bx - p.x) * 0.06;
        p.y += (by - p.y) * 0.06;
        p.opacity = 0.78 + Math.sin(time * 0.00055 + p.phase * 0.1) * 0.12;
        break;
      }

      case 'mutate': {
        const mutPeak = Math.sin(phaseProgress * Math.PI); 

        if (p.mutationGroup === 2 && p.isNode) {
          const dx = p.targetX - centroidX;
          const dy = p.targetY - centroidY;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const elongation = mutPeak * 18; // max 18px elongation
          const mx = p.targetX + (dx / len) * elongation;
          const my = p.targetY + (dy / len) * elongation;
          p.x += (mx - p.x) * 0.025 * (dt / 16);
          p.y += (my - p.y) * 0.025 * (dt / 16);
        } else if (p.mutationGroup === 2) {

          const perpX = -(p.targetY - centroidY);
          const perpY =  (p.targetX - centroidX);
          const pLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
          const wobble = Math.sin(p.phase + time * 0.0006) * mutPeak * 6;
          const mx = p.targetX + (perpX / pLen) * wobble;
          const my = p.targetY + (perpY / pLen) * wobble;
          p.x += (mx - p.x) * 0.03 * (dt / 16);
          p.y += (my - p.y) * 0.03 * (dt / 16);
        } else {
          const breatheAmt = Math.sin(time * 0.00055) * 4;
          const dist = Math.sqrt(p.relX * p.relX + p.relY * p.relY);
          const scale = dist > 1 ? 1 + (breatheAmt / dist) * 0.03 : 1;
          p.x += (centroidX + p.relX * scale - p.x) * 0.05;
          p.y += (centroidY + p.relY * scale - p.y) * 0.05;
        }

        p.opacity = 0.72 + Math.sin(time * 0.0012 + p.phase) * 0.15;
        break;
      }
    }

    p.x = Math.max(1, Math.min(w - 1, p.x));
    p.y = Math.max(1, Math.min(h - 1, p.y));
  }, []);


  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, state: AnimationState) => {
    const { w, h } = dimsRef.current;
    ctx.clearRect(0, 0, w, h);

    const { particles, structuralConns, signalConns, phase, formationProgress } = state;

    const lineAlpha =
      phase === 'float'     ? 0 :
      phase === 'organize'  ? formationProgress * 0.18 :
      phase === 'form'      ? 0.18 + formationProgress * 0.22 :
      0.42;

    if (lineAlpha > 0.01) {
      for (const sc of structuralConns) {
        const from = particles[sc.fromIdx];
        const to   = particles[sc.toIdx];
        if (!from || !to) continue;

        const alpha = sc.isMainVein
          ? lineAlpha                     
          : lineAlpha * 0.65;           

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = sc.isMainVein
          ? `rgba(78, 205, 196, ${alpha})`
          : `rgba(43, 168, 152, ${alpha})`;
        ctx.lineWidth = sc.isMainVein ? 1.1 : 0.7;
        ctx.stroke();
      }
    }

    if (formationProgress > 0.55) {
      for (const conn of signalConns) {
        conn.opacity = Math.min(1, conn.opacity + 0.015);
        conn.signalProgress += 0.007;
        if (conn.signalProgress > 1) {
          conn.signalProgress = 0;
          conn.signalActive = Math.random() < 0.30;
        }

        if (!conn.signalActive) continue;

        const from = particles[conn.fromId];
        const to   = particles[conn.toId];
        if (!from || !to) continue;

        const sx = from.x + (to.x - from.x) * conn.signalProgress;
        const sy = from.y + (to.y - from.y) * conn.signalProgress;

        ctx.beginPath();
        ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 213, 207, ${conn.opacity * lineAlpha * 1.4})`;
        ctx.fill();
      }
    }

    for (const p of particles) {
      if (p.opacity < 0.02) continue;

      
      if (p.isNode && formationProgress > 0.6) {
        const gr = p.radius * 5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
        grad.addColorStop(0, `rgba(78, 205, 196, ${p.opacity * 0.22})`);
        grad.addColorStop(1, 'rgba(78, 205, 196, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.isNode
        ? `rgba(78, 205, 196, ${p.opacity})`
        : `rgba(43, 168, 152, ${p.opacity * 0.9})`;
      ctx.fill();
    }
  }, []);


  const tick = useCallback((ctx: CanvasRenderingContext2D, timestamp: number) => {
    const state = stateRef.current;
    if (!state) return;

    const dt = lastTsRef.current
      ? Math.min(timestamp - lastTsRef.current, 50)
      : 16;
    lastTsRef.current = timestamp;

    state.time += dt;
    state.phaseProgress = Math.min(1, state.phaseProgress + dt / PHASE_DURATIONS[state.phase]);

    const { w } = dimsRef.current;


    if (state.phase === 'organize') {
      state.formationProgress = state.phaseProgress * 0.28;
    } else if (state.phase === 'form') {
      state.formationProgress = 0.28 + state.phaseProgress * 0.72;
    } else if (state.phase === 'float') {
      state.formationProgress = 0;
    } else {
      state.formationProgress = 1;
    }


    if (state.phaseProgress >= 1) {
      const idx = PHASE_ORDER.indexOf(state.phase);
      state.phase = PHASE_ORDER[(idx + 1) % PHASE_ORDER.length];
      state.phaseProgress = 0;
      if (state.phase === 'float') {
        state.formationProgress = 0;
      }
    }

    let cx = 0, cy = 0;
    for (const p of state.particles) { cx += p.targetX; cy += p.targetY; }
    cx /= state.particles.length;
    cy /= state.particles.length;
    if (Math.abs(cx - state.centroidX) > w * 0.02) {
      state.centroidX = cx;
      state.centroidY = cy;
    }

    for (const p of state.particles) updateParticle(p, state, dt);
    drawFrame(ctx, state);

    rafRef.current = requestAnimationFrame((ts) => tick(ctx, ts));
  }, [updateParticle, drawFrame]);


  const start = useCallback((canvas: HTMLCanvasElement) => {
    if (reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    initState();
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame((ts) => tick(ctx, ts));
  }, [initState, tick, reducedMotion]);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { start, stop };
}
