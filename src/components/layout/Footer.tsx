import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10" role="contentinfo">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs tracking-widest text-ink-tertiary uppercase">NEXUS</span>
            <span className="text-ink-tertiary/40 text-xs">—</span>
            <span className="text-xs text-ink-tertiary">Biological Engineering</span>
          </div>
          <p className="text-2xs text-ink-tertiary/60 font-mono tracking-wide">
            © {new Date().getFullYear()} NEXUS. All rights reserved.
          </p>
          <nav aria-label="Footer navigation" className="flex gap-6">
            {['Privacy', 'Terms', 'Research'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-2xs text-ink-tertiary hover:text-ink-secondary transition-colors tracking-wide uppercase font-mono focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-light focus-visible:outline-offset-2 rounded"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
