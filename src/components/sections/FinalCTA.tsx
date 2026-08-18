import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  onOpenContact: () => void;
}

export function FinalCTA({ onOpenContact }: FinalCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef   = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        innerRef.current?.querySelectorAll('.reveal') ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.9, stagger: 0.12, ease: 'power2.out',
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
      id="cta"
      className="section-pad border-t border-white/5"
      aria-labelledby="cta-heading"
    >
      <Container>
        <div
          ref={innerRef}
          className="relative overflow-hidden rounded-sm border border-signal/10 px-8 md:px-16 py-16 md:py-20 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(17,28,46,0.9) 0%, rgba(12,21,37,0.95) 50%, rgba(8,14,26,0.9) 100%)',
          }}
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(27,123,110,0.07) 0%, transparent 70%)',
            }}
          />

          {/* Corner accents */}
          {[
            'top-0 left-0 border-t border-l',
            'top-0 right-0 border-t border-r',
            'bottom-0 left-0 border-b border-l',
            'bottom-0 right-0 border-b border-r',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute ${cls} w-6 h-6 border-signal/25 pointer-events-none`}
              aria-hidden="true"
            />
          ))}

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="reveal label-mono text-signal/60 inline-block mb-5">
              Research access
            </span>

            <h2
              id="cta-heading"
              className="reveal text-[clamp(1.8rem,4vw,3rem)] font-light leading-tight text-ink-primary mb-5"
            >
              Ready to work with
              <br />
              <span className="text-gradient-teal">living systems?</span>
            </h2>

            <p className="reveal text-base text-ink-secondary font-light leading-relaxed mb-10 max-w-sm mx-auto">
              Join researchers and biotechnology teams using NEXUS to model, visualize, and engineer biological networks.
            </p>

            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={onOpenContact}
                aria-label="Contact the NEXUS research team"
              >
                <Mail size={15} aria-hidden="true" />
                Contact research team
              </Button>
              <Button href="#hero" variant="ghost">
                Back to top
                <ArrowRight size={14} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
