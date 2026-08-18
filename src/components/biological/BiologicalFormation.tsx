//+SK 17/08/2026 - This component displays the main biological visualization like it takes the selected structure (leaf, DNA, cell, or branch), prepares the canvas for responsive/high-resolution rendering, starts the biological animation, and shows a still version when reduced motion is enabled.
import { useRef, useEffect, useCallback } from 'react';
import { BiologicalFormationProps } from '../../types/biological';
import { getStructureDefinition } from './BiologicalStructures';
import { useBiologicalAnimation } from './useBiologicalAnimation';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function BiologicalFormation({
  structure = 'leaf',
  width = 500,
  height = 500,
  className = '',
}: BiologicalFormationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  const { targets, connections: structuralConns } = getStructureDefinition(structure);

  const { start, stop } = useBiologicalAnimation({
    targets,
    structuralConns,
    canvasWidth: width,
    canvasHeight: height,
    reducedMotion,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    stop(); 

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    if (!reducedMotion) {
      start(canvas);
    }

    return () => stop();
  }, [width, height, structure, reducedMotion]);

  const renderStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    for (const sc of structuralConns) {
      const from = targets[sc.fromIdx];
      const to   = targets[sc.toIdx];
      if (!from || !to) continue;
      ctx.beginPath();
      ctx.moveTo(from.x * width, from.y * height);
      ctx.lineTo(to.x * width,   to.y * height);
      ctx.strokeStyle = sc.isMainVein
        ? 'rgba(78, 205, 196, 0.55)'
        : 'rgba(43, 168, 152, 0.35)';
      ctx.lineWidth = sc.isMainVein ? 1.2 : 0.8;
      ctx.stroke();
    }

    for (const t of targets) {
      if (!t.isNode) continue;
      ctx.beginPath();
      ctx.arc(t.x * width, t.y * height, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(78, 205, 196, 0.7)';
      ctx.fill();
    }
  }, [targets, structuralConns, width, height]);

  useEffect(() => {
    if (reducedMotion) renderStatic();
  }, [reducedMotion, renderStatic]);

  return (
    <canvas
      ref={canvasRef}
      className={`bio-canvas ${className}`}
      aria-hidden="true"
      role="presentation"
      style={{ display: 'block' }}
    />
  );
}
//-SK 17/08/2026 - This component displays the main biological visualization like it takes the selected structure (leaf, DNA, cell, or branch), prepares the canvas for responsive/high-resolution rendering, starts the biological animation, and shows a still version when reduced motion is enabled.