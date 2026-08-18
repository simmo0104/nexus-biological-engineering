import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  href?: string;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 font-medium text-sm tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-light focus-visible:outline-offset-4';

  const styles = {
    primary:
      'px-7 py-3.5 bg-signal text-white rounded-sm hover:bg-signal-light hover:shadow-[0_0_20px_rgba(43,168,152,0.25)] active:scale-[0.98]',
    ghost:
      'px-5 py-2.5 border border-white/10 text-ink-secondary rounded-sm hover:border-signal/40 hover:text-ink-primary active:scale-[0.98]',
  };

  const classes = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
