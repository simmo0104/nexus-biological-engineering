import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionLabel } from '../ui/SectionLabel';
import { capabilities } from '../../data/capabilities';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        headerRef.current?.querySelectorAll('.reveal') ?? [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.capability-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="section-pad border-t border-white/5"
      aria-labelledby="capabilities-heading"
    >
      <Container>
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16"
        >
          <div>
            <div className="reveal">
              <SectionLabel className="mb-5">Capabilities</SectionLabel>
            </div>
            <h2
              id="capabilities-heading"
              className="reveal text-[clamp(1.9rem,3.5vw,2.8rem)] font-light leading-tight text-ink-primary"
            >
              What we build
              <br />
              <span className="text-ink-secondary font-light">and how we think.</span>
            </h2>
          </div>
          <p className="reveal text-sm text-ink-secondary max-w-xs leading-relaxed font-light">
            Four interconnected disciplines, united by a single principle: biological systems
            are computable.
          </p>
        </div>

        {/* Card grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6"
          role="list"
        >
          {capabilities.map((cap) => (
            <article
              key={cap.index}
              className="capability-card group bg-surface-card p-7 md:p-8 rounded-sm hover:border-signal/20 transition-all duration-300 hover:glow-teal-sm cursor-default"
              role="listitem"
            >
              <div className="flex items-start justify-between mb-5">
                <span className="label-mono text-signal/50 tabular-nums">{cap.index}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-signal/50">
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </div>

              <h3 className="text-base font-semibold text-ink-primary mb-3 group-hover:text-signal-light transition-colors duration-200">
                {cap.title}
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed font-light">
                {cap.description}
              </p>

              {/* Tag */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <span className="label-mono text-ink-tertiary/60">{cap.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
