import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '../ui/Container';
import { SectionLabel } from '../ui/SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    label: 'Signal',
    description:
      'Biological information begins as molecular signals — chemical gradients, electrical pulses, genetic expressions — traveling through living networks.',
  },
  {
    label: 'Organization',
    description:
      'Signals self-organize into coherent systems. Networks emerge, structures form, and distributed intelligence becomes possible.',
  },
  {
    label: 'Adaptation',
    description:
      'Living systems respond and evolve. They optimize, mutate, and reach new equilibria — an intelligence that emerges from the network itself.',
  },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        [labelRef.current, headingRef.current, bodyRef.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (pillarsRef.current) {
        const items = pillarsRef.current.querySelectorAll('.pillar-item');
        gsap.fromTo(
          items,
          { opacity: 0, x: -16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: pillarsRef.current,
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
      id="about"
      className="section-pad border-t border-white/5"
      aria-labelledby="about-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column */}
          <div>
            <div ref={labelRef}>
              <SectionLabel className="mb-6">The Approach</SectionLabel>
            </div>
            <h2
              ref={headingRef}
              id="about-heading"
              className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-light leading-tight text-ink-primary mb-6"
            >
              Biological networks
              <br />
              <em className="font-light not-italic text-signal-light">carry information.</em>
              <br />
              We read and write them.
            </h2>
            <p
              ref={bodyRef}
              className="text-ink-secondary leading-relaxed text-base font-light max-w-md"
            >
              NEXUS builds tools for understanding the molecular grammar of living systems — the rules
              by which signals become decisions, and decisions become life. Our platform bridges
              computational modelling and experimental biology, turning raw biological data into
              actionable insight.
            </p>
          </div>

          {/* Right column — pillars */}
          <div ref={pillarsRef} className="flex flex-col gap-0">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.label}
                className={`pillar-item group flex gap-6 py-7 ${
                  i < PILLARS.length - 1 ? 'border-b border-white/6' : ''
                }`}
              >
                {/* Index + accent line */}
                <div className="flex-shrink-0 pt-1">
                  <span className="label-mono text-signal/70 tabular-nums">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink-primary mb-2 tracking-wide group-hover:text-signal-light transition-colors duration-200">
                    {pillar.label}
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
