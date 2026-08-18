import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '../ui/Container';
import { SectionLabel } from '../ui/SectionLabel';
import { BiologicalFormation } from '../biological/BiologicalFormation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { StructureType } from '../../types/biological';

gsap.registerPlugin(ScrollTrigger);

const STRUCTURES: { key: StructureType; label: string; desc: string }[] = [
  {
    key: 'leaf',
    label: 'Vascular network',
    desc: 'Transport systems that distribute nutrients and signals through living tissue.',
  },
  {
    key: 'helix',
    label: 'Genetic structure',
    desc: 'The molecular archive — encoding instructions that persist across generations.',
  },
  {
    key: 'cell',
    label: 'Cellular organization',
    desc: 'The fundamental unit — compartmentalized, dynamic, and adaptive.',
  },
  {
    key: 'branch',
    label: 'Branching growth',
    desc: 'Fractal patterns of resource distribution and environmental exploration.',
  },
];

export function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [activeStructure, setActiveStructure] = useState<StructureType>('leaf');

  const vizSize = isDesktop ? 440 : 320;

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        contentRef.current?.querySelectorAll('.reveal-item') ?? [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        vizRef.current,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="section-pad border-t border-white/5"
      aria-labelledby="tech-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Text content */}
          <div ref={contentRef}>
            <div className="reveal-item">
              <SectionLabel className="mb-6">Research Platform</SectionLabel>
            </div>
            <h2
              id="tech-heading"
              className="reveal-item text-[clamp(1.9rem,3.5vw,2.8rem)] font-light leading-tight text-ink-primary mb-6"
            >
              From signal to
              <br />
              <span className="text-gradient-teal">structured form.</span>
            </h2>
            <p className="reveal-item text-base text-ink-secondary leading-relaxed font-light mb-10 max-w-sm">
              Our visualization platform captures the moment biological signals begin to
              organize — tracing the path from molecular noise to coherent living structure.
            </p>

            {/* Structure selector */}
            <div
              className="reveal-item flex flex-col gap-0"
              role="tablist"
              aria-label="Biological structure examples"
            >
              {STRUCTURES.map((s) => {
                const isActive = activeStructure === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveStructure(s.key)}
                    className={`group text-left flex gap-4 items-start py-4 px-4 -mx-4 rounded transition-all duration-200 border-b border-white/5 last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-light focus-visible:outline-offset-2 ${
                      isActive
                        ? 'bg-signal/5'
                        : 'hover:bg-white/2'
                    }`}
                  >
                    <span
                      className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
                        isActive ? 'bg-signal-light' : 'bg-ink-tertiary/40 group-hover:bg-signal/50'
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <span
                        className={`block text-sm font-medium mb-0.5 transition-colors duration-200 ${
                          isActive ? 'text-signal-light' : 'text-ink-secondary group-hover:text-ink-primary'
                        }`}
                      >
                        {s.label}
                      </span>
                      {isActive && (
                        <span className="block text-xs text-ink-tertiary leading-relaxed">
                          {s.desc}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biological Formation Visualization */}
          <div
            ref={vizRef}
            className="flex items-center justify-center"
            aria-label="Live biological structure formation visualization"
            role="img"
          >
            <div
              className="relative rounded-sm border border-signal/8 bg-surface/30 overflow-hidden"
              style={{
                width: vizSize,
                height: vizSize,
              }}
            >
              {/* Corner accents */}
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(
                (pos, i) => (
                  <div
                    key={i}
                    className={`absolute ${pos} w-4 h-4 pointer-events-none`}
                    aria-hidden="true"
                    style={{
                      borderTop: pos.includes('top') ? '1px solid rgba(43,168,152,0.2)' : 'none',
                      borderBottom: pos.includes('bottom') ? '1px solid rgba(43,168,152,0.2)' : 'none',
                      borderLeft: pos.includes('left') ? '1px solid rgba(43,168,152,0.2)' : 'none',
                      borderRight: pos.includes('right') ? '1px solid rgba(43,168,152,0.2)' : 'none',
                    }}
                  />
                )
              )}

              <BiologicalFormation
                structure={activeStructure}
                width={vizSize}
                height={vizSize}
              />

              {/* Status label */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-slow" />
                <span className="label-mono text-signal/60">Forming</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
