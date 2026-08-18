import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ParticleNetwork } from '../biological/ParticleNetwork';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  useGSAP(
    () => {
      if (reducedMotion) return;

      const tl = gsap.timeline({ delay: 0.6 });

      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.35'
        )
        .fromTo(
          scrollHintRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          '-=0.1'
        );

      // Subtle floating on the scroll hint
      gsap.to(scrollHintRef.current, {
        y: 8,
        duration: 1.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.8,
      });
    },
    { scope: sectionRef }
  );

  // Parallax on scroll
  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rate = scrollY * 0.25;
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translateY(${rate * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-labelledby="hero-headline"
    >
      {/* Particle network background */}
      <ParticleNetwork
        particleCount={isMobile ? 30 : 55}
        className="opacity-60"
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(27, 123, 110, 0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #050A14)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <Container className="relative z-10 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Eyebrow tag */}
          <div ref={tagRef} className={reducedMotion ? '' : 'opacity-0'}>
            <span className="label-mono inline-flex items-center gap-3 mb-8 md:mb-10">
              <span className="w-8 h-px bg-signal" aria-hidden="true" />
              Biological Systems Engineering
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal animate-pulse-slow" aria-hidden="true" />
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            id="hero-headline"
            className={`text-[clamp(2.8rem,7vw,5.5rem)] font-light leading-[1.06] tracking-tight text-ink-primary mb-6 md:mb-8 ${reducedMotion ? '' : 'opacity-0'}`}
          >
            Engineering life
            <br />
            <span className="text-gradient-teal font-normal">at its smallest scale.</span>
          </h1>

          {/* Subheading */}
          <p
            ref={subRef}
            className={`text-base md:text-lg text-ink-secondary max-w-xl leading-relaxed mb-10 md:mb-12 font-light ${reducedMotion ? '' : 'opacity-0'}`}
          >
            Where biological signals become systems we can understand, model, and engineer.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className={`flex flex-col sm:flex-row gap-4 ${reducedMotion ? '' : 'opacity-0'}`}
          >
            <Button href="#capabilities" variant="primary" aria-label="Explore the NEXUS system">
              Explore the system
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button href="#about" variant="ghost">
              Learn more
            </Button>
          </div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <div
        ref={scrollHintRef}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${reducedMotion ? '' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <span className="label-mono text-ink-tertiary/50">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-signal/0 via-signal/40 to-signal/0" />
      </div>
    </section>
  );
}
