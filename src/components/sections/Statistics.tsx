import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '../ui/Container';
import { SectionLabel } from '../ui/SectionLabel';
import { Stat } from '../ui/Stat';
import { statistics } from '../../data/statistics';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function Statistics() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        headerRef.current?.querySelectorAll('.reveal') ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
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
      id="statistics"
      className="section-pad border-t border-white/5"
      aria-labelledby="statistics-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Header column */}
          <div ref={headerRef}>
            <div className="reveal">
              <SectionLabel className="mb-5">System metrics</SectionLabel>
            </div>
            <h2
              id="statistics-heading"
              className="reveal text-[clamp(1.7rem,3vw,2.4rem)] font-light leading-tight text-ink-primary mb-4"
            >
              A system
              <br />
              in stable state.
            </h2>
            <p className="reveal text-sm text-ink-secondary leading-relaxed font-light">
              Real-time measures of the NEXUS biological modelling platform — monitored continuously,
              updated when the system speaks.
            </p>
          </div>

          {/* Stats grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-8 md:gap-10">
              {statistics.map((stat) => (
                <Stat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  description={stat.description}
                  sectionRef={sectionRef as React.RefObject<HTMLElement>}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
