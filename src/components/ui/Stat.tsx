import { useRef, useEffect } from 'react';
import { countUp } from '../../lib/animations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  sectionRef: React.RefObject<HTMLElement>;
}

export function Stat({ value, suffix, label, description, sectionRef }: StatProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const hasDecimals = !Number.isInteger(value);

  useEffect(() => {
    if (!valueRef.current || !sectionRef.current || reducedMotion) {
      if (valueRef.current) {
        valueRef.current.textContent = value.toFixed(hasDecimals ? 1 : 0) + suffix;
      }
      return;
    }

    const anim = countUp(
      valueRef.current,
      value,
      suffix,
      sectionRef.current,
      hasDecimals ? 1 : 0
    );

    return () => {
      anim.kill();
    };
  }, [value, suffix, sectionRef, reducedMotion, hasDecimals]);

  return (
    <div className="group">
      <div
        className="flex flex-col gap-1 pb-6 border-b border-white/8 transition-colors duration-300 group-hover:border-signal/25"
        role="figure"
        aria-label={`${value}${suffix} — ${label}`}
      >
        <div className="flex items-baseline gap-0.5">
          <span
            ref={valueRef}
            className="text-5xl md:text-6xl font-light tabular-nums text-gradient-teal"
            aria-hidden={!reducedMotion}
          >
            {reducedMotion ? value.toFixed(hasDecimals ? 1 : 0) + suffix : '0' + suffix}
          </span>
        </div>
        <p className="text-sm font-medium text-ink-primary mt-1">{label}</p>
        <p className="text-xs text-ink-tertiary leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}
