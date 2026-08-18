import { useEffect, useRef, useState } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const NAV_LINKS = [
  { href: '#about',        label: 'About' },
  { href: '#technology',   label: 'Technology' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#statistics',   label: 'Impact' },
];

interface NavbarProps {
  onOpenContact: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 }
      );
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => setMobileOpen(false);

  const handleContactClick = () => {
    setMobileOpen(false);
    onOpenContact();
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-void/90 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-light focus-visible:outline-offset-4 rounded"
            aria-label="NEXUS — Biological Engineering, go to homepage"
          >
            <div className="w-6 h-6 relative flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="3" fill="#2BA898" />
                <circle cx="5"  cy="6"  r="1.5" fill="#1B7B6E" />
                <circle cx="19" cy="6"  r="1.5" fill="#1B7B6E" />
                <circle cx="5"  cy="18" r="1.5" fill="#1B7B6E" />
                <circle cx="19" cy="18" r="1.5" fill="#1B7B6E" />
                <line x1="5"  y1="6"  x2="12" y2="12" stroke="#1B7B6E" strokeWidth="0.8" opacity="0.7" />
                <line x1="19" y1="6"  x2="12" y2="12" stroke="#1B7B6E" strokeWidth="0.8" opacity="0.7" />
                <line x1="5"  y1="18" x2="12" y2="12" stroke="#1B7B6E" strokeWidth="0.8" opacity="0.7" />
                <line x1="19" y1="18" x2="12" y2="12" stroke="#1B7B6E" strokeWidth="0.8" opacity="0.7" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-wider text-ink-primary group-hover:text-signal-light transition-colors duration-200">
              NEXUS
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-ink-tertiary hover:text-ink-primary transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-light focus-visible:outline-offset-4 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <Button variant="ghost" onClick={onOpenContact}>
              Contact us
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-ink-secondary hover:text-ink-primary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-abyss/95 backdrop-blur-md border-t border-white/5">
          <nav className="flex flex-col py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="px-6 py-3 text-sm text-ink-secondary hover:text-ink-primary hover:bg-white/3 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="px-6 pt-3 pb-2">
              <Button
                variant="ghost"
                onClick={handleContactClick}
                className="w-full justify-center"
              >
                Contact us
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
